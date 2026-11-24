import { parseArgs } from 'node:util';
import { experiments } from '../experiments/registry.js';

const USAGE = [
  'Usage:',
  '  js-basics list',
  '  js-basics run <experiment> [--seed N] [--samples N] [--buckets N] [--limit N]',
].join('\n');

const NUMERIC_OPTIONS = ['seed', 'samples', 'buckets', 'limit'];

function toPrintable(text) {
  return text.replace(/[\p{Cc}\p{Cf}]/gu, '?');
}

function parseNumericOptions(values, allowed) {
  const parsed = {};
  for (const name of NUMERIC_OPTIONS) {
    if (values[name] === undefined) continue;
    if (!allowed.includes(name)) throw new RangeError(`Option --${name} is not supported here.`);
    if (!/^\d+$/.test(values[name])) throw new RangeError(`Option --${name} must be an integer.`);
    parsed[name] = Number(values[name]);
  }
  return parsed;
}

function runExperiment(name, values, io) {
  if (!name || !Object.hasOwn(experiments, name)) {
    throw new RangeError(`Unknown experiment: ${name ?? '(none)'}.`);
  }
  const experiment = experiments[name];
  const output = experiment.run(parseNumericOptions(values, experiment.options));
  io.stdout(JSON.stringify({ experiment: name, ...output }, null, 2));
}

export function runCli(argv, io) {
  try {
    const { values, positionals } = parseArgs({
      args: argv,
      allowPositionals: true,
      options: Object.fromEntries(NUMERIC_OPTIONS.map((name) => [name, { type: 'string' }])),
    });
    const [command, name] = positionals;
    if (command === 'list') {
      if (positionals.length > 1 || Object.keys(values).length > 0) {
        throw new RangeError('The list command takes no arguments.');
      }
      for (const [key, { description }] of Object.entries(experiments)) {
        io.stdout(`${key}: ${description}`);
      }
      return 0;
    }
    if (command === 'run') {
      if (positionals.length > 2) {
        throw new RangeError('The run command takes a single experiment name.');
      }
      runExperiment(name, values, io);
      return 0;
    }
    io.stderr(USAGE);
    return 2;
  } catch (error) {
    if (error instanceof RangeError || error instanceof TypeError) {
      io.stderr(toPrintable(error.message));
      return 2;
    }
    throw error;
  }
}

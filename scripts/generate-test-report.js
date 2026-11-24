import { spawnSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const outputDirectory = join(root, 'reports', 'tests');

const run = spawnSync(
  process.execPath,
  [
    '--disable-warning=ExperimentalWarning',
    '--test',
    '--experimental-test-coverage',
    '--test-coverage-include=src/**',
    '--test-reporter=spec',
    'tests/**/*.test.js',
  ],
  { cwd: root, encoding: 'utf8', env: { ...process.env, NO_COLOR: '1', FORCE_COLOR: '0' } },
);

const output = `${run.stdout}${run.stderr}`.replaceAll(root, '.');
const readCount = (label) => Number(output.match(new RegExp(`ℹ ${label} (\\d+)`))?.[1] ?? 0);
const summary = {
  generatedAt: new Date().toISOString(),
  runtime: process.version,
  platform: process.platform,
  command: 'npm run test:report',
  exitCode: run.status,
  tests: readCount('tests'),
  passed: readCount('pass'),
  failed: readCount('fail'),
  cancelled: readCount('cancelled'),
  skipped: readCount('skipped'),
  todo: readCount('todo'),
};

mkdirSync(outputDirectory, { recursive: true });
writeFileSync(join(outputDirectory, 'latest.txt'), output);
writeFileSync(join(outputDirectory, 'summary.json'), `${JSON.stringify(summary, null, 2)}\n`);
console.log(JSON.stringify(summary, null, 2));
process.exitCode = run.status ?? 1;

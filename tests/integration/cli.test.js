import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';
import { runCli } from '../../src/cli/main.js';
import { runPrimeDensity, runUniformity } from '../../src/index.js';

const binary = fileURLToPath(new URL('../../bin/js-basics.js', import.meta.url));

function capture(argv) {
  const out = [];
  const err = [];
  const code = runCli(argv, { stdout: (l) => out.push(l), stderr: (l) => err.push(l) });
  return { code, out: out.join('\n'), err: err.join('\n') };
}

describe('command line interface', () => {
  it('lists experiments', () => {
    const { code, out } = capture(['list']);
    assert.equal(code, 0);
    assert.match(out, /uniformity/);
    assert.match(out, /prime-density/);
  });

  it('produces byte-identical output for the same seed', () => {
    const argv = ['run', 'uniformity', '--seed', '7', '--samples', '5000', '--buckets', '4'];
    assert.equal(capture(argv).out, capture(argv).out);
  });

  it('reports prime density', () => {
    const { code, out } = capture(['run', 'prime-density', '--limit', '1000']);
    assert.equal(code, 0);
    assert.equal(JSON.parse(out).result.primeCount, 168);
  });

  it('rejects invalid usage with exit code two', () => {
    for (const argv of [
      [],
      ['unknown'],
      ['run'],
      ['run', 'constructor'],
      ['run', 'uniformity', '--seed', 'abc'],
      ['run', 'uniformity', '--seed', '-1'],
      ['run', 'uniformity', '--limit', '10'],
      ['run', 'uniformity', '--nope', '1'],
      ['run', 'prime-density', '--limit', '999999999999'],
    ]) {
      assert.equal(capture(argv).code, 2, argv.join(' '));
    }
  });

  it('runs through the executable entry point', () => {
    const result = spawnSync(process.execPath, [binary, 'run', 'prime-density', '--limit', '100'], {
      encoding: 'utf8',
    });
    assert.equal(result.status, 0);
    assert.equal(JSON.parse(result.stdout).result.primeCount, 25);
  });

  it('validates experiment parameters', () => {
    assert.throws(() => runUniformity({ samples: 1, buckets: 16 }), RangeError);
    assert.throws(() => runPrimeDensity({ limit: 1 }), RangeError);
  });
});

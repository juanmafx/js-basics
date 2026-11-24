import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  chiSquarePValue,
  chiSquareUniformity,
  compensatedSum,
  createRandom,
  createXoshiro128StarStar,
  expandSeed,
  logGamma,
  mean,
  regularizedUpperGamma,
  sampleVariance,
  shuffle,
} from '../../src/index.js';

const close = (actual, expected, tolerance = 1e-9) =>
  assert.ok(Math.abs(actual - expected) <= tolerance, `${actual} is not close to ${expected}`);

describe('xoshiro128**', () => {
  it('reproduces the reference sequence for state 1, 2, 3, 4', () => {
    const random = createXoshiro128StarStar([1, 2, 3, 4]);
    const output = Array.from({ length: 10 }, () => random.nextUint32());
    assert.deepEqual(
      output,
      [
        11520, 0, 5927040, 70819200, 2031721883, 1637235492, 1287239034, 3734860849, 3729100597,
        4258142804,
      ],
    );
  });

  it('rejects invalid state and seeds', () => {
    assert.throws(() => createXoshiro128StarStar([0, 0, 0, 0]), RangeError);
    assert.throws(() => createXoshiro128StarStar([1, 2, 3]), RangeError);
    assert.throws(() => expandSeed(-1), RangeError);
    assert.throws(() => expandSeed(2 ** 32), RangeError);
  });

  it('is deterministic per seed', () => {
    const first = createRandom(7);
    const second = createRandom(7);
    const other = createRandom(8);
    const a = Array.from({ length: 32 }, () => first.nextUint32());
    const b = Array.from({ length: 32 }, () => second.nextUint32());
    const c = Array.from({ length: 32 }, () => other.nextUint32());
    assert.deepEqual(a, b);
    assert.notDeepEqual(a, c);
  });

  it('rejects an invalid bound', () => {
    assert.throws(() => createRandom(1).nextBelow(0), RangeError);
  });

  it('requires a generator to shuffle', () => {
    assert.throws(() => shuffle([1], undefined), TypeError);
    assert.throws(() => shuffle([1, 2], {}), TypeError);
  });

  it('shuffles without mutating the input', () => {
    const input = [1, 2, 3, 4, 5];
    const output = shuffle(input, createRandom(3));
    assert.deepEqual(input, [1, 2, 3, 4, 5]);
    assert.deepEqual(
      [...output].sort((a, b) => a - b),
      input,
    );
  });
});

describe('descriptive statistics', () => {
  it('keeps precision where naive summation loses it', () => {
    assert.equal(compensatedSum([1, 1e100, 1, -1e100]), 2);
  });

  it('computes mean and sample variance', () => {
    assert.equal(mean([1, 2, 3, 4]), 2.5);
    close(sampleVariance([2, 4, 4, 4, 5, 5, 7, 9]), 32 / 7);
  });

  it('rejects undersized input', () => {
    assert.throws(() => mean([]), RangeError);
    assert.throws(() => sampleVariance([1]), RangeError);
  });

  it('rejects overflow instead of returning a non-finite result', () => {
    assert.throws(() => compensatedSum([1e308, 1e308]), RangeError);
    assert.throws(() => mean([1e308, 1e308]), RangeError);
    assert.throws(() => sampleVariance([1e308, -1e308]), RangeError);
  });

  it('rejects sparse arrays in variance', () => {
    const sparse = [1, 2, 3];
    delete sparse[1];
    assert.throws(() => sampleVariance(sparse), TypeError);
  });
});

describe('chi-square', () => {
  it('computes log gamma for known values', () => {
    close(logGamma(5), Math.log(24));
    close(logGamma(0.5), 0.5 * Math.log(Math.PI));
    close(logGamma(0.25), Math.log(3.625609908221908));
    assert.throws(() => logGamma(0), RangeError);
  });

  it('matches published critical values at the 5 percent level', () => {
    close(chiSquarePValue(3.841458820694124, 1), 0.05);
    close(chiSquarePValue(18.307038053275146, 10), 0.05);
    close(chiSquarePValue(124.34211340400407, 100), 0.05);
  });

  it('matches the closed form for two degrees of freedom', () => {
    for (const x of [0.1, 1, 2, 5, 10, 30]) close(chiSquarePValue(x, 2), Math.exp(-x / 2), 1e-12);
  });

  it('handles the incomplete gamma domain', () => {
    assert.equal(regularizedUpperGamma(1, 0), 1);
    assert.throws(() => regularizedUpperGamma(0, 1), RangeError);
    assert.throws(() => regularizedUpperGamma(1, -1), RangeError);
    assert.throws(() => chiSquarePValue(1, 0), RangeError);
  });

  it('scores a uniformity table', () => {
    const { statistic, degreesOfFreedom, pValue } = chiSquareUniformity([10, 10, 10, 10]);
    assert.equal(statistic, 0);
    assert.equal(degreesOfFreedom, 3);
    assert.equal(pValue, 1);
  });

  it('rejects invalid tables', () => {
    assert.throws(() => chiSquareUniformity([1]), RangeError);
    assert.throws(() => chiSquareUniformity([0, 0]), RangeError);
    assert.throws(() => chiSquareUniformity([1, -1]), RangeError);
    assert.throws(
      () => chiSquareUniformity([Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER]),
      RangeError,
    );
  });
});

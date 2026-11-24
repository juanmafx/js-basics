import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  chiSquareUniformity,
  createRandom,
  mean,
  runUniformity,
  sampleVariance,
  shuffle,
} from '../../src/index.js';

const SIGNIFICANCE = 0.001;

describe('seeded statistical checks', () => {
  it('nextBelow is uniform across fixed seeds', () => {
    for (const seed of [1, 42, 2026]) {
      const { result } = runUniformity({ seed, samples: 200_000, buckets: 7 });
      assert.ok(result.pValue > SIGNIFICANCE, `seed ${seed}: p=${result.pValue}`);
    }
  });

  it('the test detects a biased source', () => {
    const counts = new Array(8).fill(0);
    const random = createRandom(5);
    for (let draw = 0; draw < 80_000; draw++) {
      const value = random.nextBelow(8);
      counts[value === 7 && random.nextBelow(4) === 0 ? 0 : value]++;
    }
    assert.ok(chiSquareUniformity(counts).pValue < SIGNIFICANCE);
  });

  it('nextFloat matches uniform mean and variance', () => {
    const random = createRandom(11);
    const values = Array.from({ length: 200_000 }, () => random.nextFloat());
    assert.ok(Math.abs(mean(values) - 0.5) < 0.005);
    assert.ok(Math.abs(sampleVariance(values) - 1 / 12) < 0.002);
  });

  it('Fisher-Yates produces every permutation of four items uniformly', () => {
    const random = createRandom(99);
    const tally = new Map();
    for (let round = 0; round < 240_000; round++) {
      const key = shuffle([0, 1, 2, 3], random).join('');
      tally.set(key, (tally.get(key) ?? 0) + 1);
    }
    assert.equal(tally.size, 24);
    assert.ok(chiSquareUniformity([...tally.values()]).pValue > SIGNIFICANCE);
  });
});

import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  arrayFromRange,
  countOccurrences,
  createRandom,
  except,
  fizzBuzz,
  getMax,
  grant,
  hasPermission,
  isPrime,
  isPrimeBigInt,
  mean,
  move,
  primesUpTo,
  revoke,
  sampleVariance,
  shuffle,
  sumOfMultiples,
} from '../../src/index.js';
import { fc } from '../helpers/property.js';

const naiveIsPrime = (value) => {
  if (value < 2) return false;
  for (let factor = 2; factor * factor <= value; factor++) {
    if (value % factor === 0) return false;
  }
  return true;
};

const sorted = (values) => [...values].sort((a, b) => a - b);
const finiteDouble = fc.double({ min: -1e6, max: 1e6, noNaN: true, noDefaultInfinity: true });

describe('array properties', () => {
  it('range length equals the span', () => {
    fc.assert(
      fc.property(fc.integer({ min: -500, max: 500 }), fc.nat(500), (min, span) => {
        const range = arrayFromRange(min, min + span);
        assert.equal(range.length, span + 1);
        assert.equal(range.at(-1), min + span);
      }),
    );
  });

  it('move is a permutation that places the element at the target', () => {
    const scenario = fc.array(fc.integer(), { minLength: 1, maxLength: 40 }).chain((values) =>
      fc.record({
        values: fc.constant(values),
        index: fc.nat(values.length - 1),
        target: fc.nat(values.length - 1),
      }),
    );
    fc.assert(
      fc.property(scenario, ({ values, index, target }) => {
        const output = move(values, index, target - index);
        assert.deepEqual(sorted(output), sorted(values));
        assert.equal(output[target], values[index]);
      }),
    );
  });

  it('except leaves no excluded values and keeps the rest', () => {
    fc.assert(
      fc.property(fc.array(fc.integer()), fc.array(fc.integer()), (values, excluded) => {
        const output = except(values, excluded);
        assert.ok(output.every((value) => !excluded.includes(value)));
        assert.equal(output.length, values.filter((value) => !excluded.includes(value)).length);
      }),
    );
  });

  it('occurrence counts partition the array', () => {
    fc.assert(
      fc.property(fc.array(fc.integer({ min: 0, max: 5 })), (values) => {
        const total = [0, 1, 2, 3, 4, 5].reduce(
          (acc, key) => acc + countOccurrences(values, key),
          0,
        );
        assert.equal(total, values.length);
      }),
    );
  });

  it('max dominates every element', () => {
    fc.assert(
      fc.property(fc.array(fc.integer(), { minLength: 1 }), (values) => {
        const largest = getMax(values);
        assert.ok(values.every((value) => value <= largest));
        assert.ok(values.includes(largest));
      }),
    );
  });
});

describe('arithmetic properties', () => {
  it('closed-form multiples agree with enumeration', () => {
    fc.assert(
      fc.property(fc.nat(5000), (limit) => {
        let expected = 0;
        for (let value = 0; value <= limit; value++) {
          if (value % 3 === 0 || value % 5 === 0) expected += value;
        }
        assert.equal(sumOfMultiples(limit), expected);
      }),
    );
  });

  it('FizzBuzz has period fifteen on labels', () => {
    fc.assert(
      fc.property(fc.nat(1_000_000), (value) => {
        const label = (result) => (typeof result === 'string' ? result : 'number');
        assert.equal(label(fizzBuzz(value)), label(fizzBuzz(value + 15)));
      }),
    );
  });

  it('grant then revoke clears the permission', () => {
    fc.assert(
      fc.property(fc.nat(7), fc.nat(7), (mask, permission) => {
        assert.equal(hasPermission(grant(mask, permission), permission), true);
        assert.equal(revoke(grant(mask, permission), permission) & permission, 0);
      }),
    );
  });

  it('variance is non-negative and shift invariant', () => {
    fc.assert(
      fc.property(fc.array(finiteDouble, { minLength: 2, maxLength: 50 }), (values) => {
        const variance = sampleVariance(values);
        const shifted = sampleVariance(values.map((value) => value + 100));
        assert.ok(variance >= 0);
        assert.ok(Math.abs(variance - shifted) <= 1e-5 * Math.max(1, variance));
      }),
    );
  });

  it('mean lies between the extremes', () => {
    fc.assert(
      fc.property(fc.array(finiteDouble, { minLength: 1, maxLength: 50 }), (values) => {
        const average = mean(values);
        assert.ok(average >= Math.min(...values) - 1e-9);
        assert.ok(average <= Math.max(...values) + 1e-9);
      }),
    );
  });
});

describe('prime properties', () => {
  it('trial division agrees with a naive oracle', () => {
    fc.assert(
      fc.property(fc.integer({ min: -10, max: 2_000_000 }), (value) => {
        assert.equal(isPrime(value), naiveIsPrime(value));
      }),
    );
  });

  it('Miller-Rabin agrees with trial division', () => {
    fc.assert(
      fc.property(fc.maxSafeNat(), (value) => {
        const candidate = value % 1_000_000_007;
        assert.equal(isPrimeBigInt(BigInt(candidate)), isPrime(candidate));
      }),
    );
  });

  it('the sieve agrees with trial division', () => {
    fc.assert(
      fc.property(fc.nat(3000), (limit) => {
        const expected = [];
        for (let value = 2; value <= limit; value++) {
          if (naiveIsPrime(value)) expected.push(value);
        }
        assert.deepEqual(primesUpTo(limit), expected);
      }),
      { numRuns: 60 },
    );
  });
});

describe('random properties', () => {
  it('nextBelow stays in range', () => {
    fc.assert(
      fc.property(fc.nat(), fc.integer({ min: 1, max: 2 ** 32 }), (seed, bound) => {
        const random = createRandom(seed);
        for (let draw = 0; draw < 16; draw++) {
          const value = random.nextBelow(bound);
          assert.ok(Number.isInteger(value) && value >= 0 && value < bound);
        }
      }),
    );
  });

  it('nextFloat stays in the unit interval', () => {
    fc.assert(
      fc.property(fc.nat(), (seed) => {
        const random = createRandom(seed);
        for (let draw = 0; draw < 16; draw++) {
          const value = random.nextFloat();
          assert.ok(value >= 0 && value < 1);
        }
      }),
    );
  });

  it('shuffle is a permutation', () => {
    fc.assert(
      fc.property(fc.array(fc.integer()), fc.nat(), (values, seed) => {
        assert.deepEqual(sorted(shuffle(values, createRandom(seed))), sorted(values));
      }),
    );
  });
});

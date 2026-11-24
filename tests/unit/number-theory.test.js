import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  isPrime,
  isPrimeBigInt,
  MAX_SIEVE_LIMIT,
  MILLER_RABIN_DETERMINISTIC_BOUND,
  primesUpTo,
} from '../../src/index.js';

describe('primes', () => {
  it('treats values below two as non-prime', () => {
    for (const value of [-7, 0, 1]) assert.equal(isPrime(value), false);
  });

  it('classifies known values', () => {
    for (const value of [2, 3, 5, 25, 49, 7919, 2147483647]) {
      assert.equal(isPrime(value), ![25, 49].includes(value));
    }
  });

  it('matches published prime counts', () => {
    assert.equal(primesUpTo(10).length, 4);
    assert.equal(primesUpTo(100).length, 25);
    assert.equal(primesUpTo(1000).length, 168);
    assert.equal(primesUpTo(1_000_000).length, 78498);
  });

  it('handles small sieve limits', () => {
    assert.deepEqual(primesUpTo(1), []);
    assert.deepEqual(primesUpTo(2), [2]);
    assert.deepEqual(primesUpTo(3), [2, 3]);
    assert.deepEqual(primesUpTo(9), [2, 3, 5, 7]);
    assert.throws(() => primesUpTo(MAX_SIEVE_LIMIT + 1), RangeError);
  });

  it('rejects known strong pseudoprimes', () => {
    for (const value of [2047n, 3215031751n, 3825123056546413051n, 318665857834031151167461n]) {
      assert.equal(isPrimeBigInt(value), false);
    }
  });

  it('accepts large known primes', () => {
    assert.equal(isPrimeBigInt(2n ** 61n - 1n), true);
    assert.equal(isPrimeBigInt(2n ** 67n - 1n), false);
    assert.equal(isPrimeBigInt(1n), false);
    assert.equal(isPrimeBigInt(41n), true);
  });

  it('refuses to answer beyond the deterministic bound', () => {
    assert.throws(() => isPrimeBigInt(MILLER_RABIN_DETERMINISTIC_BOUND), RangeError);
    assert.throws(() => isPrimeBigInt(7), TypeError);
  });
});

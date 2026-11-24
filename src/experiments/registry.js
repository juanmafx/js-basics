import { assertIntegerInRange } from '../core/validation.js';
import { MAX_SIEVE_LIMIT, primesUpTo } from '../number-theory/primes.js';
import { createRandom } from '../random/xoshiro128.js';
import { chiSquareUniformity } from '../statistics/chi-square.js';

const MAX_SAMPLES = 100_000_000;
const MAX_BUCKETS = 1_000_000;
const MIN_EXPECTED_PER_BUCKET = 5;
const MAX_SEED = 2 ** 32 - 1;

export function runUniformity({ seed = 42, samples = 100_000, buckets = 16 } = {}) {
  assertIntegerInRange(seed, 0, MAX_SEED, 'seed');
  assertIntegerInRange(buckets, 2, MAX_BUCKETS, 'buckets');
  assertIntegerInRange(samples, MIN_EXPECTED_PER_BUCKET * buckets, MAX_SAMPLES, 'samples');
  const random = createRandom(seed);
  const counts = new Array(buckets).fill(0);
  for (let drawn = 0; drawn < samples; drawn++) counts[random.nextBelow(buckets)]++;
  return { parameters: { seed, samples, buckets }, result: chiSquareUniformity(counts) };
}

export function runPrimeDensity({ limit = 1_000_000 } = {}) {
  assertIntegerInRange(limit, 2, MAX_SIEVE_LIMIT, 'limit');
  const primeCount = primesUpTo(limit).length;
  const estimate = limit / Math.log(limit);
  return {
    parameters: { limit },
    result: { primeCount, estimate, ratioToEstimate: primeCount / estimate },
  };
}

export const experiments = Object.freeze({
  'prime-density': Object.freeze({
    description: 'Counts primes up to a limit and compares the count with x / ln(x).',
    options: Object.freeze(['limit']),
    run: runPrimeDensity,
  }),
  uniformity: Object.freeze({
    description: 'Runs a chi-square uniformity test on the seeded generator.',
    options: Object.freeze(['seed', 'samples', 'buckets']),
    run: runUniformity,
  }),
});

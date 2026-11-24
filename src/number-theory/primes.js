import { assertIntegerInRange, assertSafeInteger } from '../core/validation.js';

export const MAX_SIEVE_LIMIT = 100_000_000;
export const MILLER_RABIN_DETERMINISTIC_BOUND = 3317044064679887385961981n;

const MILLER_RABIN_BASES = [2n, 3n, 5n, 7n, 11n, 13n, 17n, 19n, 23n, 29n, 31n, 37n, 41n];

export function isPrime(value) {
  assertSafeInteger(value);
  if (value < 2) return false;
  if (value < 4) return true;
  if (value % 2 === 0 || value % 3 === 0) return false;
  for (let factor = 5; factor <= Math.floor(value / factor); factor += 6) {
    if (value % factor === 0 || value % (factor + 2) === 0) return false;
  }
  return true;
}

export function primesUpTo(limit) {
  assertIntegerInRange(limit, 0, MAX_SIEVE_LIMIT, 'limit');
  if (limit < 2) return [];
  const size = Math.floor((limit - 1) / 2);
  const composite = new Uint8Array(size);
  for (let index = 0; 2 * index + 3 <= Math.floor(limit / (2 * index + 3)); index++) {
    if (composite[index] === 1) continue;
    const prime = 2 * index + 3;
    for (let multiple = (prime * prime - 3) / 2; multiple < size; multiple += prime) {
      composite[multiple] = 1;
    }
  }
  const primes = [2];
  for (let index = 0; index < size; index++) {
    if (composite[index] === 0) primes.push(2 * index + 3);
  }
  return primes;
}

function modularPower(base, exponent, modulus) {
  let result = 1n;
  let factor = base % modulus;
  let remaining = exponent;
  while (remaining > 0n) {
    if (remaining & 1n) result = (result * factor) % modulus;
    factor = (factor * factor) % modulus;
    remaining >>= 1n;
  }
  return result;
}

function isStrongProbablePrime(value, base, oddPart, twos) {
  let witness = modularPower(base, oddPart, value);
  if (witness === 1n || witness === value - 1n) return true;
  for (let round = 1n; round < twos; round++) {
    witness = (witness * witness) % value;
    if (witness === value - 1n) return true;
  }
  return false;
}

export function isPrimeBigInt(value) {
  if (typeof value !== 'bigint') throw new TypeError('value must be a bigint.');
  if (value >= MILLER_RABIN_DETERMINISTIC_BOUND) {
    throw new RangeError('value exceeds the deterministic Miller-Rabin bound.');
  }
  if (value < 2n) return false;
  for (const prime of MILLER_RABIN_BASES) {
    if (value === prime) return true;
    if (value % prime === 0n) return false;
  }
  let oddPart = value - 1n;
  let twos = 0n;
  while ((oddPart & 1n) === 0n) {
    oddPart >>= 1n;
    twos++;
  }
  return MILLER_RABIN_BASES.every((base) => isStrongProbablePrime(value, base, oddPart, twos));
}

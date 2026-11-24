import { assertArray, assertFiniteNumber } from '../core/validation.js';

const LANCZOS_G = 7;
const LANCZOS_COEFFICIENTS = [
  0.99999999999980993, 676.5203681218851, -1259.1392167224028, 771.32342877765313,
  -176.61502916214059, 12.507343278686905, -0.13857109526572012, 9.9843695780195716e-6,
  1.5056327351493116e-7,
];
const MAX_ITERATIONS = 10_000;
const EPSILON = 1e-15;
const SMALLEST = 1e-300;

export function logGamma(value) {
  assertFiniteNumber(value);
  if (value <= 0) throw new RangeError('value must be positive.');
  if (value < 0.5) {
    return Math.log(Math.PI / Math.sin(Math.PI * value)) - logGamma(1 - value);
  }
  const shifted = value - 1;
  let series = LANCZOS_COEFFICIENTS[0];
  for (let index = 1; index < LANCZOS_COEFFICIENTS.length; index++) {
    series += LANCZOS_COEFFICIENTS[index] / (shifted + index);
  }
  const base = shifted + LANCZOS_G + 0.5;
  return 0.5 * Math.log(2 * Math.PI) + (shifted + 0.5) * Math.log(base) - base + Math.log(series);
}

function lowerGammaSeries(shape, x) {
  let term = 1 / shape;
  let total = term;
  for (let step = 1; step <= MAX_ITERATIONS; step++) {
    term *= x / (shape + step);
    total += term;
    if (Math.abs(term) < Math.abs(total) * EPSILON) {
      return total * Math.exp(-x + shape * Math.log(x) - logGamma(shape));
    }
  }
  throw new RangeError('Incomplete gamma series did not converge.');
}

function upperGammaFraction(shape, x) {
  let b = x + 1 - shape;
  let c = 1 / SMALLEST;
  let d = 1 / b;
  let fraction = d;
  for (let step = 1; step <= MAX_ITERATIONS; step++) {
    const a = -step * (step - shape);
    b += 2;
    d = a * d + b;
    if (Math.abs(d) < SMALLEST) d = SMALLEST;
    c = b + a / c;
    if (Math.abs(c) < SMALLEST) c = SMALLEST;
    d = 1 / d;
    const delta = d * c;
    fraction *= delta;
    if (Math.abs(delta - 1) < EPSILON) {
      return fraction * Math.exp(-x + shape * Math.log(x) - logGamma(shape));
    }
  }
  throw new RangeError('Incomplete gamma fraction did not converge.');
}

export function regularizedUpperGamma(shape, x) {
  assertFiniteNumber(shape, 'shape');
  assertFiniteNumber(x, 'x');
  if (shape <= 0) throw new RangeError('shape must be positive.');
  if (x < 0) throw new RangeError('x must not be negative.');
  if (x === 0) return 1;
  if (x < shape + 1) return Math.max(0, 1 - lowerGammaSeries(shape, x));
  return Math.min(1, upperGammaFraction(shape, x));
}

export function chiSquarePValue(statistic, degreesOfFreedom) {
  if (!Number.isSafeInteger(degreesOfFreedom) || degreesOfFreedom < 1) {
    throw new RangeError('degreesOfFreedom must be a positive integer.');
  }
  return regularizedUpperGamma(degreesOfFreedom / 2, statistic / 2);
}

export function chiSquareUniformity(observed) {
  assertArray(observed, 'observed');
  if (observed.length < 2) throw new RangeError('observed must hold at least two buckets.');
  let total = 0;
  for (const count of observed) {
    if (!Number.isSafeInteger(count) || count < 0) {
      throw new RangeError('observed counts must be non-negative integers.');
    }
    total += count;
  }
  if (total === 0) throw new RangeError('observed must hold at least one sample.');
  const expected = total / observed.length;
  const statistic = observed.reduce((acc, count) => acc + (count - expected) ** 2 / expected, 0);
  const degreesOfFreedom = observed.length - 1;
  return { statistic, degreesOfFreedom, pValue: chiSquarePValue(statistic, degreesOfFreedom) };
}

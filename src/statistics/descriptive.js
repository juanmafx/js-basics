import { assertArray, assertFiniteNumber } from '../core/validation.js';

export function compensatedSum(values) {
  assertArray(values, 'values');
  let total = 0;
  let compensation = 0;
  for (const value of values) {
    assertFiniteNumber(value, 'value');
    const next = total + value;
    compensation +=
      Math.abs(total) >= Math.abs(value) ? total - next + value : value - next + total;
    total = next;
  }
  return total + compensation;
}

export function mean(values) {
  assertArray(values, 'values');
  if (values.length === 0) throw new RangeError('values must not be empty.');
  return compensatedSum(values) / values.length;
}

export function sampleVariance(values) {
  assertArray(values, 'values');
  if (values.length < 2) throw new RangeError('values must hold at least two items.');
  let runningMean = 0;
  let squaredDeviations = 0;
  values.forEach((value, index) => {
    assertFiniteNumber(value, 'value');
    const delta = value - runningMean;
    runningMean += delta / (index + 1);
    squaredDeviations += delta * (value - runningMean);
  });
  return squaredDeviations / (values.length - 1);
}

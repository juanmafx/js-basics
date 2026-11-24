import { assertFiniteNumber, assertFiniteResult } from '../core/validation.js';

export function sum(...items) {
  const values = items.length === 1 && Array.isArray(items[0]) ? items[0] : items;
  let total = 0;
  for (const value of values) {
    assertFiniteNumber(value, 'item');
    total += value;
  }
  assertFiniteResult(total, 'sum');
  return total;
}

export function createCircle(radius) {
  assertFiniteNumber(radius, 'radius');
  if (radius < 0) throw new RangeError('radius must not be negative.');
  assertFiniteResult(Math.PI * radius * radius, 'area');
  return Object.freeze({
    radius,
    get area() {
      return Math.PI * radius * radius;
    },
  });
}

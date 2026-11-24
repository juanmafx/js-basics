import { assertFiniteNumber } from '../core/validation.js';

export function sum(...items) {
  const values = items.length === 1 && Array.isArray(items[0]) ? items[0] : items;
  return values.reduce((total, value) => {
    assertFiniteNumber(value, 'item');
    return total + value;
  }, 0);
}

export function createCircle(radius) {
  assertFiniteNumber(radius, 'radius');
  if (radius < 0) throw new RangeError('radius must not be negative.');
  return Object.freeze({
    radius,
    get area() {
      return Math.PI * radius * radius;
    },
  });
}

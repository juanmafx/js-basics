import { assertFiniteNumber } from '../core/validation.js';

const GOLD_THRESHOLD = 100;

export function membershipTier(points) {
  assertFiniteNumber(points, 'points');
  return points > GOLD_THRESHOLD ? 'gold' : 'silver';
}

export function greet(name) {
  if (typeof name !== 'string' || name.trim() === '') {
    throw new TypeError('name must be a non-empty string.');
  }
  return `Hello, ${name.trim()}!`;
}

export function square(value) {
  assertFiniteNumber(value);
  return value * value;
}

export function ownEntries(object) {
  if (object === null || typeof object !== 'object') {
    throw new TypeError('object must be a non-null object.');
  }
  return Object.entries(object);
}

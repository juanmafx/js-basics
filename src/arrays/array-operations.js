import {
  assertArray,
  assertFiniteNumber,
  assertIntegerInRange,
  assertSafeInteger,
} from '../core/validation.js';

const MAX_RANGE_LENGTH = 1_000_000;

export function arrayFromRange(min, max) {
  assertSafeInteger(min, 'min');
  assertSafeInteger(max, 'max');
  if (max < min) return [];
  if (max - min >= MAX_RANGE_LENGTH) {
    throw new RangeError(`The range must not exceed ${MAX_RANGE_LENGTH} items.`);
  }
  return Array.from({ length: max - min + 1 }, (_, offset) => min + offset);
}

export function includes(array, searchElement) {
  assertArray(array);
  for (const element of array) {
    if (element === searchElement) return true;
  }
  return false;
}

export function except(array, excluded) {
  assertArray(array);
  assertArray(excluded, 'excluded');
  const excludedValues = new Set(excluded);
  return array.filter((element) => !excludedValues.has(element));
}

export function move(array, index, offset) {
  assertArray(array);
  assertIntegerInRange(index, 0, Math.max(array.length - 1, 0), 'index');
  assertSafeInteger(offset, 'offset');
  const position = index + offset;
  if (array.length === 0 || position < 0 || position >= array.length) {
    throw new RangeError('Invalid offset.');
  }
  const output = [...array];
  const [element] = output.splice(index, 1);
  output.splice(position, 0, element);
  return output;
}

export function countOccurrences(array, searchElement) {
  assertArray(array);
  return array.reduce((count, current) => count + (current === searchElement ? 1 : 0), 0);
}

export function getMax(array) {
  assertArray(array);
  for (const value of array) assertFiniteNumber(value, 'item');
  if (array.length === 0) return undefined;
  return array.reduce((largest, current) => (largest > current ? largest : current));
}

export function findByName(records, name) {
  assertArray(records, 'records');
  return records.find((record) => record.name === name);
}

export function findIndexByName(records, name) {
  assertArray(records, 'records');
  return records.findIndex((record) => record.name === name);
}

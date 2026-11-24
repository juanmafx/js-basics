import {
  assertArray,
  assertFiniteNumber,
  assertFiniteResult,
  assertIntegerInRange,
} from '../core/validation.js';

const SPEED_LIMIT = 70;
const KM_PER_POINT = 5;
const SUSPENSION_POINTS = 12;
const MAX_LISTING = 1_000_000;
const MAX_STAR_ROWS = 1_000;

export function max(a, b) {
  assertFiniteNumber(a, 'a');
  assertFiniteNumber(b, 'b');
  return a > b ? a : b;
}

export function isLandscape(width, height) {
  assertFiniteNumber(width, 'width');
  assertFiniteNumber(height, 'height');
  return width > height;
}

export function fizzBuzz(input) {
  if (typeof input !== 'number') return Number.NaN;
  const divisibleByThree = input % 3 === 0;
  const divisibleByFive = input % 5 === 0;
  if (divisibleByThree && divisibleByFive) return 'FizzBuzz';
  if (divisibleByThree) return 'Fizz';
  if (divisibleByFive) return 'Buzz';
  return input;
}

export function parityList(limit) {
  assertIntegerInRange(limit, 0, MAX_LISTING, 'limit');
  return Array.from({ length: limit + 1 }, (_, value) => ({
    value,
    label: value % 2 === 0 ? 'EVEN' : 'ODD',
  }));
}

export function countTruthy(array) {
  assertArray(array);
  return array.filter(Boolean).length;
}

export function stringProperties(object) {
  if (object === null || typeof object !== 'object') {
    throw new TypeError('object must be a non-null object.');
  }
  return Object.entries(object).filter(([, value]) => typeof value === 'string');
}

function sumOfMultiplesOf(divisor, limit) {
  const terms = limit / divisor;
  return (divisor * terms * (terms + 1n)) / 2n;
}

export function sumOfMultiples(limit) {
  assertIntegerInRange(limit, 0, Number.MAX_SAFE_INTEGER, 'limit');
  const bound = BigInt(limit);
  const total =
    sumOfMultiplesOf(3n, bound) + sumOfMultiplesOf(5n, bound) - sumOfMultiplesOf(15n, bound);
  if (total > BigInt(Number.MAX_SAFE_INTEGER)) {
    throw new RangeError('The result exceeds the safe integer range.');
  }
  return Number(total);
}

export function calculateAverage(values) {
  assertArray(values, 'values');
  if (values.length === 0) throw new RangeError('values must not be empty.');
  let total = 0;
  for (const value of values) {
    assertFiniteNumber(value, 'value');
    total += value;
  }
  assertFiniteResult(total, 'sum');
  return total / values.length;
}

export function calculateGrade(marks) {
  assertArray(marks, 'marks');
  for (const mark of marks) {
    assertFiniteNumber(mark, 'mark');
    if (mark < 0 || mark > 100) throw new RangeError('mark must be between 0 and 100.');
  }
  const average = calculateAverage(marks);
  if (average < 60) return 'F';
  if (average < 70) return 'D';
  if (average < 80) return 'C';
  if (average < 90) return 'B';
  return 'A';
}

export function checkSpeed(speed) {
  assertFiniteNumber(speed, 'speed');
  if (speed < 0) throw new RangeError('speed must not be negative.');
  if (speed < SPEED_LIMIT + KM_PER_POINT) return { status: 'ok', points: 0 };
  const points = Math.floor((speed - SPEED_LIMIT) / KM_PER_POINT);
  return { status: points >= SUSPENSION_POINTS ? 'suspended' : 'points', points };
}

export function starPattern(rows) {
  assertIntegerInRange(rows, 0, MAX_STAR_ROWS, 'rows');
  return Array.from({ length: rows }, (_, row) => '*'.repeat(row + 1));
}

import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  calculateAverage,
  calculateGrade,
  checkSpeed,
  countTruthy,
  fizzBuzz,
  isLandscape,
  max,
  parityList,
  starPattern,
  stringProperties,
  sumOfMultiples,
} from '../../src/index.js';

describe('control flow exercises', () => {
  it('compares values', () => {
    assert.equal(max(5, 3), 5);
    assert.equal(max(1, 2), 2);
    assert.equal(isLandscape(800, 700), true);
    assert.equal(isLandscape(300, 600), false);
    assert.throws(() => isLandscape('a', 1), TypeError);
  });

  it('classifies FizzBuzz inputs', () => {
    assert.equal(fizzBuzz(15), 'FizzBuzz');
    assert.equal(fizzBuzz(9), 'Fizz');
    assert.equal(fizzBuzz(10), 'Buzz');
    assert.equal(fizzBuzz(17), 17);
    assert.ok(Number.isNaN(fizzBuzz('15')));
  });

  it('labels parity', () => {
    assert.deepEqual(parityList(1), [
      { value: 0, label: 'EVEN' },
      { value: 1, label: 'ODD' },
    ]);
    assert.throws(() => parityList(-1), RangeError);
  });

  it('counts truthy values', () => {
    assert.equal(countTruthy([0, null, undefined, '', 2, 3]), 2);
  });

  it('lists own string properties only', () => {
    const movie = Object.create({ inherited: 'x' });
    Object.assign(movie, { title: 'a', releaseYear: 2018, director: 'b' });
    assert.deepEqual(stringProperties(movie), [
      ['title', 'a'],
      ['director', 'b'],
    ]);
    assert.throws(() => stringProperties(null), TypeError);
  });

  it('sums multiples of three or five', () => {
    assert.equal(sumOfMultiples(10), 33);
    assert.equal(sumOfMultiples(0), 0);
    assert.equal(sumOfMultiples(999), 233168);
    assert.throws(() => sumOfMultiples(Number.MAX_SAFE_INTEGER), RangeError);
  });

  it('assigns grades on each boundary', () => {
    assert.equal(calculateGrade([59]), 'F');
    assert.equal(calculateGrade([60]), 'D');
    assert.equal(calculateGrade([70]), 'C');
    assert.equal(calculateGrade([80]), 'B');
    assert.equal(calculateGrade([90]), 'A');
    assert.equal(calculateGrade([80, 80, 50]), 'C');
  });

  it('rejects empty and out-of-range marks instead of returning A', () => {
    assert.throws(() => calculateGrade([]), RangeError);
    assert.throws(() => calculateGrade([101]), RangeError);
    assert.throws(() => calculateAverage([]), RangeError);
  });

  it('scores speed', () => {
    assert.deepEqual(checkSpeed(74), { status: 'ok', points: 0 });
    assert.deepEqual(checkSpeed(75), { status: 'points', points: 1 });
    assert.deepEqual(checkSpeed(129), { status: 'points', points: 11 });
    assert.deepEqual(checkSpeed(130), { status: 'suspended', points: 12 });
    assert.throws(() => checkSpeed(-1), RangeError);
  });

  it('renders star rows', () => {
    assert.deepEqual(starPattern(3), ['*', '**', '***']);
    assert.deepEqual(starPattern(0), []);
    assert.throws(() => starPattern(1001), RangeError);
  });
});

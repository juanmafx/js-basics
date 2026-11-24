import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  arrayFromRange,
  countOccurrences,
  except,
  findByName,
  findIndexByName,
  getMax,
  includes,
  move,
} from '../../src/index.js';

describe('array operations', () => {
  it('builds inclusive ranges', () => {
    assert.deepEqual(arrayFromRange(-2, 2), [-2, -1, 0, 1, 2]);
    assert.deepEqual(arrayFromRange(1, -4), []);
  });

  it('rejects non-integer range bounds', () => {
    assert.throws(() => arrayFromRange(0.5, 2), TypeError);
  });

  it('caps the range length', () => {
    assert.equal(arrayFromRange(1, 1_000_000).length, 1_000_000);
    assert.throws(() => arrayFromRange(0, 1_000_000), RangeError);
    assert.throws(() => arrayFromRange(0, 4_000_000_000), RangeError);
  });

  it('finds elements with strict equality', () => {
    assert.equal(includes([1, 2, 3], 2), true);
    assert.equal(includes([1, 2, 3], '2'), false);
  });

  it('excludes values', () => {
    assert.deepEqual(except([1, 2, 3, 4], [1, 2]), [3, 4]);
  });

  it('moves an element without mutating the input', () => {
    const input = [1, 2, 3, 4];
    assert.deepEqual(move(input, 1, 2), [1, 3, 4, 2]);
    assert.deepEqual(input, [1, 2, 3, 4]);
  });

  it('throws on an invalid move', () => {
    assert.throws(() => move([1, 2], 0, 2), RangeError);
    assert.throws(() => move([1, 2], 0, -1), RangeError);
    assert.throws(() => move([1, 2], 5, 0), RangeError);
    assert.throws(() => move([], 0, 0), RangeError);
  });

  it('counts occurrences and rejects non-arrays', () => {
    assert.equal(countOccurrences([1, 2, 1], 1), 2);
    assert.throws(() => countOccurrences(null, 1), TypeError);
  });

  it('returns the maximum or undefined when empty', () => {
    assert.equal(getMax([1, 9, 3]), 9);
    assert.equal(getMax([]), undefined);
  });

  it('rejects non-finite and non-numeric items when finding the maximum', () => {
    for (const values of [
      [Number.NaN, 1],
      [1, Number.NaN],
      [1, '9'],
      [1, Infinity],
    ]) {
      assert.throws(() => getMax(values), TypeError);
    }
  });

  it('finds records by name', () => {
    const records = [
      { id: 1, name: 'a' },
      { id: 2, name: 'b' },
    ];
    assert.deepEqual(findByName(records, 'b'), { id: 2, name: 'b' });
    assert.equal(findByName(records, 'z'), undefined);
    assert.equal(findIndexByName(records, 'b'), 1);
    assert.equal(findIndexByName(records, 'z'), -1);
  });
});

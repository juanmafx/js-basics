import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  createCircle,
  grant,
  greet,
  hasPermission,
  membershipTier,
  ownEntries,
  Permission,
  revoke,
  square,
  sum,
} from '../../src/index.js';

describe('functions', () => {
  it('sums variadic and array arguments', () => {
    assert.equal(sum(1, 2, 3), 6);
    assert.equal(sum([1, 2, 3, 4]), 10);
    assert.equal(sum(), 0);
    assert.throws(() => sum(1, 'a'), TypeError);
    assert.throws(() => sum(1e308, 1e308), RangeError);
    assert.throws(() => sum(new Array(2)), TypeError);
  });

  it('computes a read-only circle area', () => {
    const circle = createCircle(2);
    assert.equal(circle.area, Math.PI * 4);
    assert.ok(Object.isFrozen(circle));
    assert.throws(() => createCircle(-1), RangeError);
    assert.throws(() => createCircle(1e200), RangeError);
  });
});

describe('language basics', () => {
  it('derives a membership tier', () => {
    assert.equal(membershipTier(101), 'gold');
    assert.equal(membershipTier(100), 'silver');
  });

  it('greets by name', () => {
    assert.equal(greet(' Ada '), 'Hello, Ada!');
    assert.throws(() => greet('  '), TypeError);
  });

  it('squares values and lists entries', () => {
    assert.equal(square(-3), 9);
    assert.throws(() => square(1e200), RangeError);
    assert.deepEqual(ownEntries({ a: 1 }), [['a', 1]]);
    assert.throws(() => ownEntries(null), TypeError);
  });

  it('manipulates permission bit flags', () => {
    const readWrite = grant(Permission.READ, Permission.WRITE);
    assert.equal(readWrite, 6);
    assert.equal(hasPermission(readWrite, Permission.WRITE), true);
    assert.equal(hasPermission(readWrite, Permission.EXECUTE), false);
    assert.equal(revoke(readWrite, Permission.READ), Permission.WRITE);
    assert.throws(() => grant(8, Permission.READ), RangeError);
  });
});

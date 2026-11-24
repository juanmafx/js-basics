import { assertIntegerInRange } from '../core/validation.js';

export const Permission = Object.freeze({ READ: 4, WRITE: 2, EXECUTE: 1 });

const ALL_PERMISSIONS = Permission.READ | Permission.WRITE | Permission.EXECUTE;

function assertMask(mask) {
  assertIntegerInRange(mask, 0, ALL_PERMISSIONS, 'mask');
}

export function grant(mask, permission) {
  assertMask(mask);
  assertMask(permission);
  return mask | permission;
}

export function revoke(mask, permission) {
  assertMask(mask);
  assertMask(permission);
  return mask & ~permission;
}

export function hasPermission(mask, permission) {
  assertMask(mask);
  assertMask(permission);
  return (mask & permission) === permission;
}

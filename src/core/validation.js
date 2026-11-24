export function assertArray(value, name = 'array') {
  if (!Array.isArray(value)) throw new TypeError(`${name} must be an array.`);
}

export function assertFiniteNumber(value, name = 'value') {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new TypeError(`${name} must be a finite number.`);
  }
}

export function assertFiniteResult(value, name = 'result') {
  if (!Number.isFinite(value)) throw new RangeError(`${name} exceeds the floating-point range.`);
}

export function assertSafeInteger(value, name = 'value') {
  if (!Number.isSafeInteger(value)) throw new TypeError(`${name} must be a safe integer.`);
}

export function assertIntegerInRange(value, min, max, name = 'value') {
  assertSafeInteger(value, name);
  if (value < min || value > max) {
    throw new RangeError(`${name} must be between ${min} and ${max}.`);
  }
}

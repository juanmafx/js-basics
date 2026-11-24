import { assertArray, assertIntegerInRange } from '../core/validation.js';

const TWO_POW_32 = 2 ** 32;
const MAX_UINT32 = TWO_POW_32 - 1;
const GOLDEN_GAMMA = 0x9e3779b9;

function rotateLeft(value, bits) {
  return (value << bits) | (value >>> (32 - bits));
}

function finalizeMix(value) {
  let mixed = value;
  mixed = Math.imul(mixed ^ (mixed >>> 16), 0x85ebca6b);
  mixed = Math.imul(mixed ^ (mixed >>> 13), 0xc2b2ae35);
  return (mixed ^ (mixed >>> 16)) >>> 0;
}

export function expandSeed(seed) {
  assertIntegerInRange(seed, 0, MAX_UINT32, 'seed');
  let counter = seed;
  return Array.from({ length: 4 }, () => {
    counter = (counter + GOLDEN_GAMMA) >>> 0;
    return finalizeMix(counter);
  });
}

export function createXoshiro128StarStar(initialState) {
  assertArray(initialState, 'initialState');
  if (initialState.length !== 4) throw new RangeError('initialState must hold four words.');
  for (const word of initialState) assertIntegerInRange(word, 0, MAX_UINT32, 'state word');
  if (initialState.every((word) => word === 0)) {
    throw new RangeError('initialState must not be all zero.');
  }
  const state = Uint32Array.from(initialState);

  function nextUint32() {
    const result = Math.imul(rotateLeft(Math.imul(state[1], 5), 7), 9) >>> 0;
    const shifted = state[1] << 9;
    state[2] ^= state[0];
    state[3] ^= state[1];
    state[1] ^= state[2];
    state[0] ^= state[3];
    state[2] ^= shifted;
    state[3] = rotateLeft(state[3], 11);
    return result;
  }

  function nextFloat() {
    const high = nextUint32() >>> 5;
    const low = nextUint32() >>> 6;
    return (high * 67108864 + low) / 9007199254740992;
  }

  function nextBelow(bound) {
    assertIntegerInRange(bound, 1, TWO_POW_32, 'bound');
    const threshold = TWO_POW_32 % bound;
    let candidate = nextUint32();
    while (candidate < threshold) candidate = nextUint32();
    return candidate % bound;
  }

  return Object.freeze({ nextUint32, nextFloat, nextBelow });
}

export function createRandom(seed) {
  return createXoshiro128StarStar(expandSeed(seed));
}

export function shuffle(array, random) {
  assertArray(array);
  if (typeof random?.nextBelow !== 'function') {
    throw new TypeError('random must provide nextBelow.');
  }
  const output = [...array];
  for (let last = output.length - 1; last > 0; last--) {
    const pick = random.nextBelow(last + 1);
    [output[last], output[pick]] = [output[pick], output[last]];
  }
  return output;
}

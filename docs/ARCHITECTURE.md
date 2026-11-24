# Architecture

## Structure

```text
js-basics/
├── bin/js-basics.js          Executable entry point
├── db/schema.sql             Optional run-results schema
├── reports/tests/            Committed output of a real test run
├── scripts/                  Test report generator
├── src/
│   ├── index.js              Public API
│   ├── core/                 Shared input validation
│   ├── fundamentals/         Language basics and bit flags
│   ├── arrays/               Array exercises
│   ├── control-flow/         Branching and looping exercises
│   ├── functions/            Function exercises
│   ├── number-theory/        Primality and sieving
│   ├── random/               Seeded generator and shuffle
│   ├── statistics/           Descriptive statistics and chi-square
│   ├── experiments/          Reproducible experiment registry
│   └── cli/                  Argument parsing and output
└── tests/
    ├── unit/                 Example-based behavior
    ├── property/             Invariants checked with fast-check
    ├── statistical/          Seeded goodness-of-fit checks
    └── integration/          CLI and schema
```

## Dependency direction

```text
bin -> cli -> experiments -> number-theory, random, statistics -> core
              fundamentals, arrays, control-flow, functions    -> core
```

Algorithms are pure apart from the generator's own state, which is passed explicitly. Only `bin/` touches the process, and the CLI receives its output streams as arguments so it can be tested in-process.

The project has no client or server, so a `frontend/` and `backend/` split does not apply.

## Complexity

| Function                           | Time                  | Space    | Notes                                   |
| ---------------------------------- | --------------------- | -------- | --------------------------------------- |
| `arrayFromRange`                   | O(n)                  | O(n)     | n is at most 1,000,000                  |
| `except`                           | O(n + m) average      | O(n + m) | Hash set instead of a nested scan       |
| `move`                             | O(n)                  | O(n)     | Returns a copy                          |
| `sumOfMultiples`                   | O(1) arithmetic steps | O(1)     | Inclusion-exclusion over 3, 5, and 15   |
| `isPrime`                          | O(√n)                 | O(1)     | Tests 6k±1 candidates only              |
| `primesUpTo`                       | O(n log log n)        | O(n)     | Odd-only sieve starting at p²           |
| `isPrimeBigInt`                    | O(k log³ n)           | O(log n) | k = 13 bases, schoolbook multiplication |
| `nextBelow`                        | O(1) expected         | O(1)     | Fewer than two draws expected           |
| `shuffle`                          | O(n)                  | O(n)     | Returns a copy                          |
| `compensatedSum`, `sampleVariance` | O(n)                  | O(1)     | Single pass                             |
| `chiSquareUniformity`              | O(b + c)              | O(1)     | b buckets, c gamma iterations           |

## Algorithm notes

**Sieve.** Index `i` represents the odd number `2i + 3`, halving memory. Limits are capped at 100,000,000 to bound allocation.

**Miller-Rabin.** The first 13 prime bases are deterministic below 3,317,044,064,679,887,385,961,981. `isPrimeBigInt` throws at or above that bound rather than returning a probabilistic answer.

**Random generation.** xoshiro128\*\* has period 2¹²⁸ − 1. A 32-bit seed is expanded to four state words by running a golden-ratio counter through the MurmurHash3 finalizer. That finalizer is a bijection and the four counter values are distinct, so the state can never be all zero. Only 2³² of the possible streams are reachable from a seed. The test suite pins the first ten outputs for state `[1, 2, 3, 4]`.

**Unbiased bounds.** `nextBelow` rejects draws below `2³² mod bound`, removing modulo bias.

**Chi-square p-values.** The p-value is the regularized upper incomplete gamma function Q(k/2, x/2), computed by series when x < a + 1 and by a Lentz continued fraction otherwise. It is checked against published critical values and the closed form for two degrees of freedom.

## Reproducibility

The same seed and parameters produce identical CLI output on the same code and Node.js version. Property tests use a fixed fast-check seed, and statistical tests use fixed generator seeds, so a failure is reproducible rather than intermittent. Because those seeds are fixed, passing tests show the implementation is consistent with uniformity for those streams; they are not a full randomness battery such as TestU01.

## Recommended evolution

- Publish the library only after the licensing question in `NOTICE.md` is settled.
- If run history becomes useful, add a storage adapter behind the experiment registry that writes to `db/schema.sql`, keeping the algorithms free of I/O.

## Migration from the original layout

| Original                                                  | Current                                                                       |
| --------------------------------------------------------- | ----------------------------------------------------------------------------- |
| `arrays/*.js`                                             | `src/arrays/array-operations.js`                                              |
| `control-flow/*.js`                                       | `src/control-flow/exercises.js`                                               |
| `objects/*.js` (duplicates of control-flow)               | `src/control-flow/exercises.js`, prime check in `src/number-theory/primes.js` |
| `functions/*.js`                                          | `src/functions/function-exercises.js`, `countOccurrences` in `src/arrays/`    |
| `bascis.js`                                               | `src/fundamentals/`                                                           |
| Scratch worksheet of array lookups                        | `findByName` and `findIndexByName` in `src/arrays/`                           |
| `index.html`, empty `index.js`, empty `operators/swap.js` | Removed                                                                       |

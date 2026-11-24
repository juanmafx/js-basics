# Changelog

This project follows [Semantic Versioning](https://semver.org/). The 2019 code was never versioned or tagged and is treated as 1.x.

## [2.0.1] - 2026-11-24

### Changed

- Documentation corrections only, with no change in code behaviour. Release notes, changelog and security audit now reflect the published 2.0.0 release and the 2026-11-24 history rewrite.

## [2.0.0] - 2026-11-24

### Breaking

- Replaced the standalone console scripts with an ES module library under `src/`.
- Functions now return values instead of logging, and throw `TypeError` or `RangeError` on invalid input.
- Requires Node.js 22.13 or newer.
- Removed `index.html`, the empty `index.js`, and the empty `operators/swap.js`.

### Fixed

- `calculateGrade([])` returned `A`; it now throws.
- `isPrime` reported `0`, `1`, and negative numbers as prime.
- `sum([1, 2, 3, 4])` returned the array instead of `10`, and `sum()` threw.
- The max-of-two exercise threw a `ReferenceError` from a misspelled variable.
- The scratch worksheet called `splice` on an undefined variable.
- `countOccurrences` no longer logs on every iteration.
- Property listing no longer includes inherited properties.
- `move` now rejects an out-of-range source index.
- `max` and `getMax` returned order-dependent results for `NaN`; they now reject non-finite and non-numeric input.
- `sum`, `square`, `createCircle`, `calculateAverage`, `compensatedSum`, `mean`, and `sampleVariance` throw `RangeError` on floating-point overflow instead of returning `NaN` or an infinity.
- `sum` and `sampleVariance` no longer skip holes in sparse arrays.
- `chiSquareUniformity` rejects totals beyond the safe integer range, and `shuffle` rejects a missing generator.
- The CLI rejects unused arguments.

### Added

- Odd-only sieve, 6k±1 trial division, and deterministic Miller-Rabin.
- Seeded xoshiro128\*\*, unbiased bounded integers, and Fisher-Yates shuffle.
- Compensated summation, Welford variance, and a chi-square uniformity test.
- Reproducible experiment CLI.
- Unit, property-based, statistical, and integration tests with a committed report.
- Optional SQL schema, CI workflow, architecture and security documentation.

### Changed

- All identifiers, strings, comments, and file names are in English.
- Merged duplicate exercises from `objects/` and `control-flow/`.

### Security

- Removed the outdated moment.js CDN script.
- Untracked `.DS_Store` files.
- Capped `arrayFromRange` at 1,000,000 items; a large span previously aborted the process.
- CLI error output replaces control and format characters, preventing terminal escape injection.

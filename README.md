# js-basics

A tested JavaScript fundamentals library: classic language exercises rebuilt as validated ES modules, extended with number theory, a seeded random number generator, and statistical testing.

> **Project history:** originally created in 2019 as a set of JavaScript study exercises, modernized in 2026.

## Purpose

The repository began as a workbook of introductory exercises that printed results to the console. This version turns those exercises into pure, importable functions with defined behavior for invalid input, then builds on the same topics (loops, primes, counting) with algorithms whose correctness can be checked.

## Why this project exists

Introductory exercises rarely state their edge cases. Several originals had real defects, listed in [CHANGELOG.md](CHANGELOG.md): for example, an empty grade list produced an `A`, and `0` and `1` were reported as prime. Keeping the small problems and holding them to a strict standard makes the project a compact study of specification, testing, and algorithmic trade-offs.

## What it does

| Area          | Module               | Contents                                                               |
| ------------- | -------------------- | ---------------------------------------------------------------------- |
| Fundamentals  | `src/fundamentals/`  | Bit-flag permissions, greeting, membership tier, object entries        |
| Arrays        | `src/arrays/`        | Range, includes, except, move, count, max, record lookup               |
| Control flow  | `src/control-flow/`  | FizzBuzz, grading, speed check, parity, star pattern, multiples        |
| Functions     | `src/functions/`     | Variadic sum, immutable circle                                         |
| Number theory | `src/number-theory/` | 6k±1 trial division, odd-only sieve, deterministic Miller-Rabin        |
| Randomness    | `src/random/`        | Seeded xoshiro128\*\*, unbiased bounded integers, Fisher-Yates shuffle |
| Statistics    | `src/statistics/`    | Compensated sum, Welford variance, chi-square test                     |
| Experiments   | `src/experiments/`   | Reproducible runs exposed through the CLI                              |

## Architecture

The library has no runtime dependencies. Dependencies point inward: the CLI calls experiments, experiments call the algorithms, and everything shares `src/core/validation.js`. See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for the structure and complexity notes.

There is no server or browser client, so the project is not split into `frontend/` and `backend/`.

## Quick start

Requires Node.js 22.13 or newer.

```bash
npm ci --ignore-scripts
npm test
node bin/js-basics.js list
```

## Usage guide

As a library, from a checkout of this repository:

```js
import { calculateGrade, createRandom, isPrimeBigInt, shuffle } from './src/index.js';

calculateGrade([80, 80, 50]);
isPrimeBigInt(2n ** 61n - 1n);
shuffle([1, 2, 3, 4], createRandom(42));
```

From the command line:

```bash
node bin/js-basics.js run uniformity --seed 42 --samples 100000 --buckets 16
node bin/js-basics.js run prime-density --limit 1000000
```

The `run` command prints JSON. Runs contain no timestamps, so the same arguments on the same code and Node.js version produce identical output. Invalid or unused arguments exit with code `2`.

## Configuration

There are no environment variables or configuration files. Experiments are controlled only by CLI options:

| Option      | Experiment      | Default | Allowed range            |
| ----------- | --------------- | ------- | ------------------------ |
| `--seed`    | `uniformity`    | 42      | 0 to 4294967295          |
| `--samples` | `uniformity`    | 100000  | 5 × buckets to 100000000 |
| `--buckets` | `uniformity`    | 16      | 2 to 1000000             |
| `--limit`   | `prime-density` | 1000000 | 2 to 100000000           |

## Database schema (optional)

The library does not use a database and works without one. [db/schema.sql](db/schema.sql) is an optional schema for anyone who wants to archive experiment runs. It is exercised against SQLite by the test suite and has not been run against another database engine.

```bash
sqlite3 runs.db < db/schema.sql
```

SQLite enforces the schema's foreign keys and cascades only on connections that first run `PRAGMA foreign_keys = ON`.

## Testing

| Command                 | Purpose                                                  |
| ----------------------- | -------------------------------------------------------- |
| `npm test`              | Unit, property-based, statistical, and integration tests |
| `npm run test:coverage` | The same suite with a coverage table                     |
| `npm run test:report`   | Regenerates the committed report in `reports/tests/`     |
| `npm run lint`          | Biome lint and format check                              |

Property-based tests use fast-check with a fixed seed. Statistical tests use fixed generator seeds and a 0.001 significance level, so they are deterministic. The latest recorded run is in [reports/tests/](reports/tests/).

## Security notes

The project performs no network, file-system, or database access at runtime, and the generator is **not cryptographically secure**: never use it for tokens, keys, or passwords. See [SECURITY.md](SECURITY.md) and [docs/SECURITY_AUDIT.md](docs/SECURITY_AUDIT.md).

## Credits and license

The original exercises appear to follow the JavaScript Basics material by Mosh Hamedani (Code with Mosh) and are not presented as original work. See [NOTICE.md](NOTICE.md).

No open-source license has been granted, so all rights are reserved by their respective holders.

# js-basics 2.0.0 Release Notes

**Status:** prepared, not tagged or published.

This release rebuilds a 2019 set of JavaScript study exercises as a tested, dependency-free ES module library, and adds number theory, seeded randomness, and statistical testing.

## Highlights

- Pure functions with defined behavior for invalid input.
- Deterministic Miller-Rabin up to about 3.3 × 10²⁴.
- Reproducible experiments from a single seed.
- Unit, property-based, statistical, and integration tests. Results are in `reports/tests/`.

## Upgrade notes

The original files were standalone scripts, so there is no compatible upgrade path. See the migration table in `docs/ARCHITECTURE.md`. Node.js 22.13 or newer is required.

## Known limitations

- The generator is not cryptographically secure.
- The optional SQL schema has been run on SQLite only.
- No license has been granted. See `NOTICE.md`.

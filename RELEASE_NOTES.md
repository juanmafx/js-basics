# js-basics 2.0.1 Release Notes

Version 2.0.1 is a documentation release. It does not change code behaviour.

## Changes

- The changelog marks 2.0.0 as released on 2026-11-24.
- The security audit marks JSB-03 resolved. On 2026-11-24 the public history was rewritten so that only the 2026 modernization commits remain, and the old `.DS_Store` blobs are no longer in any branch or tag. Anything that was ever published in the old history should still be treated as compromised.

## Upgrade notes

No action is needed when upgrading from 2.0.0. Node.js 22.13 or newer is still required.

## Known limitations

- The generator is not cryptographically secure.
- The optional SQL schema has been run on SQLite only.
- No license has been granted. See `NOTICE.md`.

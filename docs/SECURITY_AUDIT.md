# Security Audit

**Date:** 2026-11-23. **Scope:** all tracked files on the `modernize/2026` branch, plus a pattern scan of the full git history. This was a manual review with local tooling, not an independent audit.

## Findings

| ID     | Severity | Finding                                                                                                       | Status                                                         |
| ------ | -------- | ------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| JSB-01 | Medium   | `index.html` loaded moment.js 2.18.1, which is affected by CVE-2017-18214, CVE-2022-24785, and CVE-2022-31129 | Fixed: the page and script were removed; nothing used them     |
| JSB-02 | Medium   | The same script came from a third-party CDN with no Subresource Integrity hash                                | Fixed: no remote scripts remain                                |
| JSB-03 | Low      | `.DS_Store` metadata files were tracked                                                                       | Fixed in the tree and ignored; the old blobs remain in history |
| JSB-04 | Low      | Invalid input produced wrong results, such as an `A` for an empty grade list                                  | Fixed: public functions validate input                         |
| JSB-05 | Low      | `for...in` iteration included inherited properties                                                            | Fixed: uses `Object.entries`                                   |
| JSB-06 | Info     | Unbounded loop and allocation sizes                                                                           | Fixed: sieve, listing, and experiment inputs are capped        |
| JSB-07 | Info     | The CLI resolves experiment names from user input                                                             | Fixed: own-property lookup rejects names such as `constructor` |

## Checks performed

| Check                                                                      | Result                                            |
| -------------------------------------------------------------------------- | ------------------------------------------------- |
| `eval`, `new Function`, `innerHTML`, `document.write` in `src/` and `bin/` | None                                              |
| Secret-pattern scan of full history, excluding `.DS_Store` binaries        | No matches                                        |
| `npm audit`                                                                | 0 vulnerabilities at the time of the audit        |
| Runtime dependencies                                                       | None                                              |
| CI permissions                                                             | `contents: read`, actions pinned to commit hashes |

## Not applicable

The project has no authentication, sessions, forms, database access at runtime, or server, so CSRF, SQL injection, XSS, and password hashing have no attack surface here.

## Open items

- JSB-03: the `.DS_Store` blobs remain in git history because history was not rewritten. Their readable strings are only local folder names, and no sensitive data was found.
- The repository has no license. This is a legal matter rather than a vulnerability and needs an owner decision.

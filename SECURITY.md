# Security Policy

## Supported versions

| Version                   | Supported |
| ------------------------- | --------- |
| 2.x                       | Yes       |
| Earlier, unversioned code | No        |

## Reporting a vulnerability

Please use GitHub's private vulnerability reporting on this repository if it is enabled, or contact the owner through their GitHub profile without including exploit details in a public issue.

This is a personal study project with no response-time commitment.

## Scope and safe use

- The random number generator is not cryptographically secure. Use `node:crypto` for anything security-sensitive.
- The CLI bounds its numeric inputs, but large permitted values can still consume significant CPU and memory. Do not expose it to untrusted callers as a service.
- Dependencies are development-only, pinned, and installed with lifecycle scripts disabled.

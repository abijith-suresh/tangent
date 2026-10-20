# tangent — agent brief

tangent is a minimal Pi package for people who want better defaults: a Catppuccin
Mocha theme and a `/clarify` command, with no model or provider chosen for them.

## The Project

Core promise: small, proper improvements over default agent harnesses that work
with any model. `/clarify <text>` restates only the supplied text with the current
session model and leaves it in the editor; it never submits, executes, asks
questions, or plans implementation, and it preserves intent, constraints, and
unresolved facts. Preserve the theme's name and palette.

Non-negotiables: add no dependencies, lockfile, TypeScript, frameworks, or
placeholder features. No input interception, model configuration, subagents, or
commands beyond `/clarify`.

Status: dormant — feature-complete for the current scope. `0.0.1` is published;
`/clarify` ships in the next patch release.

## How I Work Here

- Verification: run focused tests for what you touched, and hand off only when
  they pass.
- Commits: Conventional Commits, squash-merged to `main`; never commit to `main`.
- Pull requests: keep them focused and leave the merge to the owner; never merge
  or push to `main`.
- Scope: update this brief before adding product behavior.
- Theme changes: validate against Pi's schema and native resource loader under an
  isolated temporary `HOME`; never change real Pi settings.
- Releases: never add version overrides; published versions are immutable, and
  release PRs wait for the owner's review.

## Sources of Truth

| Fact | Where |
|---|---|
| Product intent | § The Project (this file) |
| Runtime behavior | code + tests |
| Commands & deps | package.json |
| Commit rules | Conventional Commits; `release-please-config.json` |
| Release contract | release-please-config.json + .github/workflows/release-please.yml |

Code and tests are the authority; this file never overrides executable truth.

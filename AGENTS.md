# tangent — agent brief

A minimal Pi package for people who want better defaults: a Catppuccin Mocha
theme and a `/clarify` command, with no model or provider chosen for them.

## The Project

Core promise: small, proper improvements over default agent harnesses that work
with any model. Ships the Catppuccin Mocha theme and `/clarify <text>`, which
asks the current session model to restate only the supplied text and leaves the
result in the editor for review. It never sets a default model or provider.

Non-goals: no dependencies, lockfile, TypeScript, frameworks, or placeholder
features; no input interception, model configuration, subagents, or commands
beyond `/clarify`.

Status: dormant — feature-complete for the current scope. `0.0.1` is published;
`/clarify` ships in the next patch release.

## How I Work Here

- Quality gate: `verify` (`npm run verify`) — runs the self-contained command
  suite; must pass before handoff. The SDK and release-engine suites in `tests/`
  need external installs and env vars (see README's Verification section) and are
  not part of the default gate.
- Commits: Conventional Commits, squash-merged to `main`; never commit to
  `main`. Commit types drive Release Please, so keep them accurate.
- Hard rule: keep it minimal — no dependencies, no lockfile, no TypeScript, no
  frameworks. Update the scope in this file before adding product behavior.
- Preserve the theme's name and palette; its schema URL points at Pi's current
  schema. Validate themes against Pi's schema and native resource loader using an
  isolated temporary `HOME`; never change real Pi settings during verification.
- `/clarify` only restates: it must not submit, execute, ask questions, or plan
  implementation, and must preserve intent, constraints, and unresolved facts.
- Releases are patch-only via `always-bump-patch`, with no version overrides and
  no `v` prefix. `RELEASE_PLEASE_TOKEN` is required with no fallback; release PRs
  need manual review. Published `0.0.1` is immutable.

## Sources of Truth

| Fact | Where |
|---|---|
| Product intent | § The Project (this file) |
| Runtime behavior | code + tests |
| Commands & deps | package.json |
| Commit rules | Conventional Commits; `release-please-config.json` |
| Release contract | release-please-config.json + .github/workflows/release-please.yml |

Code and tests are the authority; this file never overrides executable truth.

## Getting Around

- `extensions/clarify.js` — the `/clarify` command: system prompt, editor handling, timeout and error behavior.
- `themes/catppuccin-mocha.json` — theme definition; name and palette are fixed.
- `tests/clarify.test.mjs` — self-contained command tests; this is what `verify` runs.
- `tests/pi-sdk.test.mjs` — native SDK checks; needs `PI_SDK_PATH` and an isolated `HOME`.
- `tests/release-versioning.test.mjs` — checks the pinned Release Please engine; needs `RELEASE_PLEASE_PATH`.
- `.github/workflows/release-please.yml` — pinned shared release workflow.
- `release-please-config.json`, `.release-please-manifest.json` — release contract.

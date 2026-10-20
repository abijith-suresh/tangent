# tangent — agent brief

tangent is a minimal Pi package for people who want better defaults: a Catppuccin
Mocha theme and a `/clarify` command, with no model or provider chosen for them.

## The Project

Core promise: small, proper improvements over default agent harnesses that work
with any model. `/clarify <text>` restates only the supplied text with the current
session model and leaves it in the editor; it never submits, executes, asks
questions, or plans implementation, and it preserves intent, constraints, and
unresolved facts. Preserve the theme's name and palette.

Non-goals: input interception, model configuration, subagents, commands beyond
`/clarify`, or placeholder features.

Status: dormant — feature-complete for the current scope. `0.0.1` is published;
`/clarify` ships in the next patch release.

## Sources of Truth

| Fact | Where |
|---|---|
| Product intent | § The Project (this file) |
| Runtime behavior | code + tests |
| Commands & deps | package.json |
| How to work here | CONTRIBUTING.md |
| Release contract | release-please-config.json + .github/workflows/release-please.yml |

Code and tests are the authority; this file never overrides executable truth.

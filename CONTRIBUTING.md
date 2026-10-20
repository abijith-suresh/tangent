# Contributing to tangent

tangent is a plain ESM Pi package: `extensions/clarify.js` and
`themes/catppuccin-mocha.json` load directly, with no build step.

## Scope contract

Hard rule: add no dependencies, no lockfile, no TypeScript, and no frameworks.
Test fixtures and external verification packages do not belong in tangent's
dependencies; load them from an isolated path instead. Keep placeholder features
out.

## Quality gate

Run `npm run verify` before handoff and add focused tests for what you touched.
The native SDK and Release Please suites need external checkouts and run
separately, as described in `README.md` § Verification. CI owns the full suite.

## Commits and pull requests

- Branch from the latest `main`; never commit directly to `main`.
- Use Conventional Commits. The expected merge strategy is squash.
- Keep each PR focused and leave merging to the owner.
- Update `AGENTS.md` § The Project before adding product behavior.

## Releases

- Never add version overrides such as `release-as` or a `Release-As` footer;
  published versions are immutable.
- Release Please owns versions and the changelog; release PRs wait for the owner's
  review. See `README.md` § Releases and `release-please-config.json`.

## Theme changes

Validate the theme against Pi's schema and native resource loader under an
isolated temporary `HOME`; never change real Pi settings.

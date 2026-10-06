# tangent

tangent aims to make small, proper improvements over default agent harnesses
that work with any model. Keep it minimal and choose no default model or provider.

The package contains the Catppuccin Mocha theme and `/clarify`. Preserve the
theme's name and palette. `/clarify <text>` only restates the supplied text clearly
and concisely, using the current session model and native Pi SDK APIs. Preserve
intent, constraints, and unresolved facts. Leave the result in the editor for
review; never submit it, execute the task, ask questions, or plan implementation.
Do not add input interception, model configuration, subagents, or other commands.
Add no dependencies, lockfile, TypeScript, frameworks, or placeholder features.
Update this scope before adding product behavior.

Validate themes against Pi's current schema and native resource loader using an
isolated temporary HOME. Never change real Pi settings during verification.
Use Conventional Commits and the shared Release Please workflow. Every future
release increments only the patch version, including features and breaking
changes, through `always-bump-patch`. Do not add version overrides. Release tags
and titles have no `v` prefix. Require `RELEASE_PLEASE_TOKEN` without a fallback.
Release PRs require manual review and merging. Published `0.0.1` is immutable.

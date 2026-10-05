# tangent

A minimal Pi package. Version `0.0.1` contains the Catppuccin Mocha theme.

## Install

With [Pi](https://pi.dev/docs/latest/packages) installed, run:

```sh
pi install git:github.com/abijith-suresh/tangent@0.0.1
```

Start Pi, open `/settings`, and select `catppuccin-mocha` under Theme. In a
running session, use `/reload` first. See [Pi's theme guide](https://pi.dev/docs/latest/themes).

Installation registers the package in Pi's settings and preserves your existing
theme selection, theme files, and other settings. Select the theme manually;
fresh setup defaults belong to the separate dotfiles configuration. tangent
sets no model or provider defaults.

## Releases

Conventional Commits on `main` feed Release Please. Its `node` strategy updates
`package.json`, the release manifest, and the changelog in a release PR. Review
and merge that PR manually. Tags and release titles use bare versions such as
`0.0.1`. The initial `0.0.1` release is published manually.

The release job calls
[abijith-suresh/workflows `0.6.0`](https://github.com/abijith-suresh/workflows/releases/tag/0.6.0),
pinned to commit `163055ac24b4169ae93ae05c5d7491b1cd5d96c7`.
It uses `RELEASE_PLEASE_TOKEN` when available and otherwise the repository's
`GITHUB_TOKEN`. The fallback needs no custom secret. Repository Settings >
Actions > General must allow GitHub Actions to create and approve pull requests.
The workflow does not approve or auto-merge PRs.

With the fallback, bot-created release PRs and tags do not trigger other GitHub
Actions workflows. A human merging a release PR triggers the `main` push workflow
that publishes the release. If downstream PR or release workflows are added,
an authorized maintainer can supply an existing suitably scoped token as the
repository secret `RELEASE_PLEASE_TOKEN`. See the
[Release Please credentials guidance](https://github.com/googleapis/release-please-action#github-credentials).

## Attribution

The theme comes from
[Abijith Suresh's dotfiles](https://github.com/abijith-suresh/dotfiles/blob/3960cc4b0b5e51ad244c9408eb446b7caed73dc2/configs/pi/.pi/agent/themes/catppuccin-mocha.json).
Its name, palette, and color mappings are preserved; the schema URL points to
Pi's current schema. The [Catppuccin palette](https://github.com/catppuccin/catppuccin)
and this package are MIT licensed. See [LICENSE](LICENSE).

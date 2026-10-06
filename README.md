# tangent

A minimal Pi package. Version `0.0.1` contains the Catppuccin Mocha theme.
The next patch release also adds `/clarify`, described below.

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

## Clarify

In the next patch release, use `/clarify <text>` in Pi's interactive terminal:

```text
/clarify Rename the Save button to Export. Keep the existing download behavior.
```

The command asks the current session model to restate only the supplied text
clearly and concisely. It instructs the model to preserve intent, constraints,
concrete details, language, and unresolved facts. It supplies no tools or session
history. It does not ask questions, plan implementation, or execute the task.

The result goes into the editor for review. Edit it before deciding whether to
send it; model restatements can still lose nuance. An empty `/clarify` shows
usage rather than choosing an earlier prompt. The command uses the session's
provider and authentication through Pi's native model registry. It has no
separate model settings and makes one normal model request, with the session's
usual billing. It requires Pi 1.0's model registry API and the terminal editor.

Errors, missing authentication, unsupported models, empty or incomplete replies,
and a 60-second request timeout leave the editor unchanged. If you type a new
draft while the request runs, the command keeps your draft instead of replacing
it. Wait for an active agent request to finish before using `/clarify`.

## Releases

Conventional Commits on `main` feed Release Please. Its `node` strategy updates
`package.json`, the release manifest, and the changelog in a release PR. Review
and merge that PR manually. Tags and release titles use bare versions such as
`0.0.1`. The published initial `0.0.1` release is immutable.

Every future release increments only the patch version. The supported
[`always-bump-patch` strategy](https://github.com/googleapis/release-please/blob/main/docs/customizing.md#versioning-strategies)
makes `fix`, `feat`, `feat!`, and `BREAKING CHANGE` commits advance `0.0.1` to
`0.0.2`. Ordinary types that do not produce release notes do not independently
trigger a release, but cannot cause a minor or major bump. Do not add version
overrides such as `release-as` or a `Release-As` footer.

The release job calls
[abijith-suresh/workflows `0.6.0`](https://github.com/abijith-suresh/workflows/releases/tag/0.6.0),
pinned to commit `163055ac24b4169ae93ae05c5d7491b1cd5d96c7`.
It requires the repository Actions secret `RELEASE_PLEASE_TOKEN`. Add your PAT
under Settings > Secrets and variables > Actions > New repository secret, using
that exact name. Scope a fine-grained PAT to `abijith-suresh/tangent` with these
repository permissions, matching the shared workflow:

- **Contents: read and write**, for commits, tags, and
  [releases](https://docs.github.com/en/rest/releases/releases#create-a-release).
- **Issues: read and write**, for release lifecycle
  [labels](https://docs.github.com/en/rest/issues/labels#create-a-label).
- **Pull requests: read and write**, for
  [release PRs](https://docs.github.com/en/rest/pulls/pulls#create-a-pull-request).

The workflow fails before calling the shared engine if this secret is absent.
There is no token fallback; release automation stays unavailable until you add
the PAT. It does not approve or auto-merge PRs. After configuring the secret,
run Release Please from the Actions tab on `main` to retry. See the
[official credentials guidance](https://github.com/googleapis/release-please-action#github-credentials).

## Verification

Run the command tests with Node's built-in test runner:

```sh
node --test tests/clarify.test.mjs
```

The native SDK checks require an already installed Pi SDK, an isolated temporary
HOME, and no API keys. They load the package and exercise native authentication
and unsupported-provider failures without contacting a model:

```sh
verify_dir="$(mktemp -d)"
env -i HOME="$verify_dir" PATH="$PATH" \
  PI_CODING_AGENT_DIR="$verify_dir/.pi/agent" \
  PI_SDK_PATH=/path/to/installed/@earendil-works/pi-coding-agent \
  node --test tests/pi-sdk.test.mjs
```

`tests/release-versioning.test.mjs` checks the real Release Please `17.6.0`
strategy shipped in the pinned shared action. Set `RELEASE_PLEASE_PATH` to a
temporary installation of that package and run it with `node --test`. Test
fixtures and external verification packages do not belong in tangent's
dependencies. Run `actionlint` and `git diff --check` before review.

## Attribution

The theme comes from
[Abijith Suresh's dotfiles](https://github.com/abijith-suresh/dotfiles/blob/3960cc4b0b5e51ad244c9408eb446b7caed73dc2/configs/pi/.pi/agent/themes/catppuccin-mocha.json).
Its name, palette, and color mappings are preserved; the schema URL points to
Pi's current schema. The [Catppuccin palette](https://github.com/catppuccin/catppuccin)
and this package are MIT licensed. See [LICENSE](LICENSE).

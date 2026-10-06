import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";

assert.ok(process.env.RELEASE_PLEASE_PATH, "Set RELEASE_PLEASE_PATH to the temporary release-please 17.6.0 installation");
const requireEngine = createRequire(path.join(process.env.RELEASE_PLEASE_PATH, "package.json"));
assert.equal(requireEngine("./package.json").version, "17.6.0", "Use the engine version shipped in the pinned shared workflow");
const { buildVersioningStrategy } = requireEngine("./build/src/factories/versioning-strategy-factory.js");
const { Version } = requireEngine("./build/src/version.js");
const { parseConventionalCommits } = requireEngine("./build/src/commit.js");
const config = JSON.parse(readFileSync(new URL("../release-please-config.json", import.meta.url))).packages["."];

test("configured native strategy increments only patch for every normal type and breaking changes", () => {
  const strategy = buildVersioningStrategy({ type: config.versioning });
  assert.equal(config["include-component-in-tag"], false);
  assert.equal(config["include-v-in-tag"], false);
  assert.equal(config["include-v-in-release-name"], false);
  const types = ["fix", "feat", "perf", "refactor", "docs", "chore", "build", "ci", "style", "test", "revert"];
  const messages = [
    ...types.map((type) => `${type}: update behavior`),
    ...types.map((type) => `${type}!: change behavior`),
    "feat: change behavior\n\nBREAKING CHANGE: old behavior removed",
  ];
  for (const message of messages) {
    const commits = parseConventionalCommits([{ sha: "fixture", message }]);
    assert.ok(commits.length > 0, message);
    for (const [before, after] of [["0.0.1", "0.0.2"], ["0.0.9", "0.0.10"], ["1.2.3", "1.2.4"]]) {
      assert.equal(strategy.bump(Version.parse(before), commits).toString(), after, message);
    }
  }
});

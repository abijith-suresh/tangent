import assert from "node:assert/strict";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
import path from "node:path";
import test from "node:test";

assert.ok(process.env.PI_SDK_PATH, "Set PI_SDK_PATH to an existing Pi SDK installation");
assert.ok(process.env.PI_CODING_AGENT_DIR?.startsWith(process.env.HOME + "/"), "Use an isolated temporary HOME and PI_CODING_AGENT_DIR");
globalThis.fetch = () => { throw new Error("Network access is forbidden in SDK verification"); };
const sdk = (file) => import(pathToFileURL(path.join(process.env.PI_SDK_PATH, "dist", file)));
const { DefaultResourceLoader } = await sdk("core/resource-loader.js");
const { SettingsManager } = await sdk("core/settings-manager.js");
const { ModelRuntime } = await sdk("core/model-runtime.js");
const { ModelRegistry } = await sdk("core/model-registry.js");
const { AuthStorage } = await sdk("core/auth-storage.js");
const { createAssistantMessageEventStream } = await import(pathToFileURL(path.join(
  process.env.PI_SDK_PATH, "node_modules/@earendil-works/pi-ai/dist/utils/event-stream.js",
)));
const { setThemeJsonValidator } = await sdk("modes/interactive/theme/theme.js");
const { validateThemeJson } = await sdk("modes/interactive/theme/theme-json.js");
const packageDir = path.resolve(new URL("..", import.meta.url).pathname);
const agentDir = process.env.PI_CODING_AGENT_DIR;
const cwd = path.join(process.env.HOME, "work");
mkdirSync(cwd, { recursive: true });
mkdirSync(agentDir, { recursive: true });
const settingsPath = path.join(agentDir, "settings.json");
const settingsBytes = JSON.stringify({ theme: "dark", unknownField: "keep", packages: [packageDir] });
writeFileSync(settingsPath, settingsBytes);
setThemeJsonValidator(validateThemeJson);
const loader = new DefaultResourceLoader({ cwd, agentDir, settingsManager: SettingsManager.create(cwd, agentDir) });
await loader.reload();
const loaded = loader.getExtensions();

test("native package loader registers only clarify and preserves settings and theme", () => {
  assert.deepEqual(loaded.errors, []);
  assert.equal(loaded.extensions.length, 1);
  const extension = loaded.extensions[0];
  assert.deepEqual([...extension.commands.keys()], ["clarify"]);
  assert.equal(extension.tools.size, 0);
  assert.equal(extension.handlers.size, 0);
  assert.deepEqual(loader.getThemes().diagnostics, []);
  assert.deepEqual(loader.getThemes().themes.map((theme) => theme.name), ["catppuccin-mocha"]);
  assert.equal(readFileSync(settingsPath, "utf8"), settingsBytes);
});

test("native registry rejects unauthenticated and unsupported models without a network call", async () => {
  const runtime = await ModelRuntime.create({
    credentials: AuthStorage.inMemory(), modelsPath: null,
    allowModelNetwork: false, refreshOnCreate: false,
  });
  const registry = new ModelRegistry(runtime);
  const model = registry.find("openai", "gpt-4.1");
  assert.ok(model, "SDK must include the fixture model");
  for (const [selected, expected] of [
    [model, /not configured|auth|credential|API key/i],
    [{ ...model, provider: "unsupported-fixture" }, /Unknown provider/],
    [{ ...model, type: "image" }, /not a chat model/],
  ]) {
    let editor = "Existing draft";
    const notices = [];
    await loaded.extensions[0].commands.get("clarify").handler("Keep the original constraints.", {
      mode: "tui", hasUI: true, isIdle: () => true, model: selected, modelRegistry: registry,
      ui: {
        getEditorText: () => editor,
        setEditorText: (text) => { editor = text; },
        setStatus() {},
        notify: (message, level) => notices.push({ message, level }),
      },
    });
    assert.equal(editor, "Existing draft");
    assert.equal(notices.at(-1).level, "error");
    assert.match(notices.at(-1).message, expected);
  }
  assert.equal(readFileSync(settingsPath, "utf8"), settingsBytes);
});

test("native completion uses the selected custom provider and inserts only its final text", async () => {
  const runtime = await ModelRuntime.create({
    credentials: AuthStorage.inMemory(), modelsPath: null,
    allowModelNetwork: false, refreshOnCreate: false,
  });
  const registry = new ModelRegistry(runtime);
  let requests = 0;
  registry.registerProvider("clarify-fixture", {
    api: "clarify-fixture-api", apiKey: "dummy-for-offline-fixture",
    baseUrl: "https://offline-fixture.invalid",
    models: [{ id: "fixture", name: "Fixture", reasoning: false, input: ["text"],
      cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 }, contextWindow: 4096, maxTokens: 512 }],
    streamSimple(model, context) {
      requests++;
      assert.equal(model.id, "fixture");
      assert.equal(context.tools?.length ?? 0, 0);
      const stream = createAssistantMessageEventStream();
      stream.push({ type: "done", reason: "stop", message: {
        role: "assistant", api: model.api, provider: model.provider, model: model.id,
        content: [{ type: "thinking", thinking: "Do not show" }, { type: "text", text: "Keep the original constraints." }],
        usage: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, totalTokens: 0,
          cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, total: 0 } },
        stopReason: "stop", timestamp: Date.now(),
      } });
      return stream;
    },
  });
  let editor = "";
  await loaded.extensions[0].commands.get("clarify").handler("Keep the original constraints.", {
    mode: "tui", hasUI: true, isIdle: () => true,
    model: registry.find("clarify-fixture", "fixture"), modelRegistry: registry,
    ui: { getEditorText: () => editor, setEditorText: (text) => { editor = text; }, setStatus() {}, notify() {} },
  });
  assert.equal(requests, 1);
  assert.equal(editor, "Keep the original constraints.");
  assert.equal(readFileSync(settingsPath, "utf8"), settingsBytes);
});

import assert from "node:assert/strict";
import test from "node:test";
import clarify from "../extensions/clarify.js";

function fixture(complete = async () => ({ stopReason: "stop", content: [{ type: "text", text: "Restated text." }] })) {
  let command;
  clarify({ registerCommand(name, options) { assert.equal(name, "clarify"); command = options.handler; } });
  const state = { editor: "Existing draft", notices: [], calls: [], status: undefined };
  const ctx = {
    hasUI: true, mode: "tui", isIdle: () => true,
    model: { provider: "selected-provider", id: "selected-model" },
    modelRegistry: { complete: async (...args) => { state.calls.push(args); return complete(...args); } },
    ui: {
      getEditorText: () => state.editor,
      setEditorText: (text) => { state.editor = text; },
      setStatus: (_key, value) => { state.status = value; },
      notify: (message, level) => state.notices.push({ message, level }),
    },
  };
  return { command, ctx, state };
}

test("uses only explicit text and the selected model; leaves a draft without submitting", async () => {
  const { command, ctx, state } = fixture();
  await command("  Keep file a.json and the 20 ms limit.  ", ctx);
  assert.equal(state.editor, "Restated text.");
  assert.equal(state.status, undefined);
  assert.equal(state.calls.length, 1);
  const [model, context, options] = state.calls[0];
  assert.equal(model, ctx.model);
  assert.equal(context.messages.length, 1);
  assert.deepEqual(context.messages[0].content, [{ type: "text", text: "Keep file a.json and the 20 ms limit." }]);
  assert.equal(context.tools, undefined);
  assert.match(context.systemPrompt, /Do not invent requirements/);
  assert.equal(options.apiKey, undefined);
  assert.equal(options.signal instanceof AbortSignal, true);
  assert.match(state.notices.at(-1).message, /Review and edit/);
});

test("empty input, missing model, busy agent, and non-terminal modes make no request", async () => {
  for (const [args, overrides, message] of [
    [" ", {}, /Usage/],
    ["Restate", { model: undefined }, /Select a session model/],
    ["Restate", { isIdle: () => false }, /Wait/],
    ["Restate", { mode: "rpc" }, /interactive terminal/],
    ["Restate", { hasUI: false, mode: "print" }, /interactive terminal/],
  ]) {
    const { command, ctx, state } = fixture();
    await command(args, Object.assign(ctx, overrides));
    assert.equal(state.calls.length, 0);
    assert.equal(state.editor, "Existing draft");
    assert.match(state.notices.at(-1).message, message);
  }
});

test("provider failures and unusable responses preserve the draft and allow retry", async () => {
  for (const reply of [
    new Error("Provider unavailable"),
    { stopReason: "error", errorMessage: "Authentication missing" },
    { stopReason: "aborted" },
    { stopReason: "length", content: [{ type: "text", text: "Incomplete" }] },
    { stopReason: "toolUse", content: [{ type: "toolCall", name: "bash" }] },
    { stopReason: "stop", content: [{ type: "thinking", thinking: "Internal" }] },
  ]) {
    let first = true;
    const { command, ctx, state } = fixture(async () => {
      if (!first) return { stopReason: "stop", content: [{ type: "text", text: "Retry worked" }] };
      first = false;
      if (reply instanceof Error) throw reply;
      return reply;
    });
    await command("Restate", ctx);
    assert.equal(state.editor, "Existing draft");
    assert.equal(state.notices.at(-1).level, "error");
    assert.equal(state.status, undefined);
    await command("Restate", ctx);
    assert.equal(state.editor, "Retry worked");
  }
});

test("a concurrent clarify call is rejected; typing during a request is preserved", async () => {
  let finish;
  const { command, ctx, state } = fixture(() => new Promise((resolve) => { finish = resolve; }));
  const running = command("Restate", ctx);
  await command("Second request", ctx);
  assert.equal(state.calls.length, 1);
  assert.match(state.notices.at(-1).message, /Wait/);
  state.editor = "New draft typed while waiting";
  finish({ stopReason: "stop", content: [{ type: "text", text: "Restatement" }] });
  await running;
  assert.equal(state.editor, "New draft typed while waiting");
  assert.match(state.notices.at(-1).message, /state changed/);
  assert.equal(state.status, undefined);
});

test("a request started while clarifying prevents a late editor replacement", async () => {
  const { command, ctx, state } = fixture(async () => {
    ctx.isIdle = () => false;
    return { stopReason: "stop", content: [{ type: "text", text: "Late result" }] };
  });
  await command("Restate", ctx);
  assert.equal(state.editor, "Existing draft");
  assert.match(state.notices.at(-1).message, /state changed/);
});

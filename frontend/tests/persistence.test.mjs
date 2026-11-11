import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import ts from "typescript";

const source = ts.transpileModule(readFileSync(new URL("../common/use-persistent-state.ts", import.meta.url), "utf8"), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText;

function harness({ blocked = false, server = false } = {}) {
  const storage = new Map();
  let errors = 0;
  const context = {
    exports: {},
    require: () => ({
      useCallback: callback => callback,
      useMemo: callback => callback(),
      useSyncExternalStore: (_subscribe, snapshot, serverSnapshot) => server ? serverSnapshot() : snapshot(),
    }),
    window: { localStorage: {
      getItem: key => { if (blocked) throw new Error("blocked"); return storage.get(key) ?? null; },
      setItem: (key, value) => { if (blocked) throw new Error("blocked"); storage.set(key, value); },
    } },
  };
  vm.runInNewContext(source, context);
  const read = () => context.exports.usePersistentState("draft", "", value => typeof value === "string", () => errors++);
  return { read, storage, errors: () => errors };
}

test("saved drafts survive a fresh store instance", () => {
  const first = harness();
  first.read()[1]("Client reply");
  const next = harness();
  next.storage.set("draft", first.storage.get("draft"));
  assert.equal(next.read()[0], "Client reply");
});

test("functional updates use the latest saved value", () => {
  const store = harness();
  const [, save] = store.read();
  save("Hello");
  save(previous => previous + " there");
  assert.equal(store.read()[0], "Hello there");
});

test("malformed or incompatible saved data falls back safely", () => {
  const store = harness();
  for (const invalid of ["{broken", "null", "[]", "42"]) {
    store.storage.set("draft", invalid);
    assert.equal(store.read()[0], "");
  }
});

test("blocked storage keeps the draft in memory and reports the failure", () => {
  const store = harness({ blocked: true });
  store.read()[1]("Keep this reply");
  assert.equal(store.read()[0], "Keep this reply");
  assert.equal(store.errors(), 1);
});

test("server hydration uses the initial value even when browser data exists", () => {
  const store = harness({ server: true });
  store.storage.set("draft", JSON.stringify("Browser draft"));
  assert.equal(store.read()[0], "");
});

test("changes from another tab appear on the next snapshot", () => {
  const store = harness();
  store.read()[1]("First version");
  store.storage.set("draft", JSON.stringify("Other tab version"));
  assert.equal(store.read()[0], "Other tab version");
});

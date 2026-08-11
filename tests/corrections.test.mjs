import assert from "node:assert/strict";
import test from "node:test";
import { correctionUrl } from "../src/corrections.mjs";

test("Google Form correction URL uses the supplied prefill fields", () => {
  const url = new URL(correctionUrl({ causebase_id: "cb_123", display_name: "Example", dataset_version: "phase2a-h1" }, "causebase_summary", "Current summary", "https://example.test/CauseBase-Viewer/#cb_123"));
  assert.equal(url.searchParams.get("entry.1706692994"), "Example");
  assert.equal(url.searchParams.get("entry.126487103"), "cb_123");
  assert.equal(url.searchParams.get("entry.1118671490"), "phase2a-h1");
  assert.equal(url.searchParams.get("entry.682855219"), "https://example.test/CauseBase-Viewer/#cb_123");
  assert.equal(url.searchParams.get("entry.561570777"), "causebase_summary");
  assert.equal(url.searchParams.get("entry.1691361730"), "Current summary");
});

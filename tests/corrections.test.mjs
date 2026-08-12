import assert from "node:assert/strict";
import test from "node:test";
import { correctionUrl, MAX_PREFILL_VALUE_LENGTH } from "../src/corrections.mjs";

test("Google Form correction URL matches the externally verified prefill contract", () => {
  const url = new URL(correctionUrl({ causebase_id: "cb_123", display_name: "Example", dataset_version: "phase2a-h1" }, "causebase_summary", "Current summary", "https://example.test/CauseBase-Viewer/#cb_123"));
  assert.equal(url.href, "https://docs.google.com/forms/d/e/1FAIpQLSfWpGlSeWv4IzmxSiHQeRsT-gDlUwDeIFnJiUQMbUWxZX8FHQ/viewform?usp=pp_url&entry.1802351789=Example&entry.971651971=cb_123&entry.1763981563=phase2a-h1&entry.967966977=https%3A%2F%2Fexample.test%2FCauseBase-Viewer%2F%23cb_123&entry.141688278=causebase_summary&entry.540909367=Current+summary");
});

test("long prose does not make correction identity context unreliable", () => {
  const url = new URL(correctionUrl({ causebase_id: "cb_123", display_name: "Example", dataset_version: "phase2b" }, "causebase_summary", "x".repeat(MAX_PREFILL_VALUE_LENGTH + 1), "https://example.test/#cb_123"));
  assert.equal(url.searchParams.get("entry.971651971"), "cb_123");
  assert.equal(url.searchParams.get("entry.1763981563"), "phase2b");
  assert.equal(url.searchParams.get("entry.141688278"), "causebase_summary");
  assert.equal(url.searchParams.get("entry.967966977"), "https://example.test/#cb_123");
  assert.equal(url.searchParams.get("entry.540909367"), "");
});

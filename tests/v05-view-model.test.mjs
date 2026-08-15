import test from "node:test";
import assert from "node:assert/strict";
import { buildV05ViewModel } from "../scripts/v05-view-model.mjs";

test("projects canonical v0.5 cards without inventing legacy facts", () => {
  const model = buildV05ViewModel([{ causebase_id: "cb_x", subject_kind: "organisation", identity: { display_name: "Example", legal_name: "Example Ltd", external_identifiers: [], registrations: [], tax_statuses: [], website: null }, evidence: [], activities: [{ label: "Observed" }], beneficiaries: [], descriptive_geography: [], navigation_geography: [], classifications: [], programs: [], participation: [], funding_sources: [], fundraising_methods: [], financial_reports: [], canonical_metrics: [], source_record_refs: [], coverage: { current: [] }, legacy_unbound: { origin_release: "rc4", origin_card_sha256: "a".repeat(64), activities: [{ value: "Legacy" }] } }], [], { dataset_version: "0.5.0-test", release_id: "test" });
  assert.equal(model.entities[0].activities[0], "Observed");
  assert.equal(model.entities[0].legacy_unbound.activities[0].value, "Legacy");
  assert.equal(model.entities[0].financial_records.length, 0);
});

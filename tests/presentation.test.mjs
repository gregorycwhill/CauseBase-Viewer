import test from "node:test";
import assert from "node:assert/strict";

import { financialMetricDisplay, fundraisingDisplay, fundingSourceLabel, functionalAllocationDisplay, sourceRecordLocator, taxonomyHeading } from "../src/presentation.mjs";

test("renders a missing fundraising estimate without placeholder metadata", () => {
  assert.equal(fundraisingDisplay({ fundraising_expenditure: null }), "Not available from selected evidence.");
});

test("renders a real fundraising estimate with its supplied currency", () => {
  assert.match(
    fundraisingDisplay({ fundraising_expenditure: { normalised_amount: 1250, normalised_currency: "USD" } }),
    /USD.*1,250/,
  );
});

test("uses observation currency and preserves conflicting financial state", () => {
  const usd = { financial_metrics: [{ metric: "revenue", reconciliation_status: "single_observation", observations: [{ amount: { normalised_amount: 5000, normalised_currency: "USD" } }] }] };
  const conflict = { financial_metrics: [{ metric: "revenue", reconciliation_status: "divergent", observations: [] }] };
  assert.match(financialMetricDisplay(usd, "revenue"), /USD.*5,000/);
  assert.equal(financialMetricDisplay(conflict, "revenue"), "Multiple reported values — inspect evidence");
});

test("uses friendly but separated taxonomy headings", () => {
  assert.equal(taxonomyHeading("causebase"), "CauseBase classifications");
  assert.equal(taxonomyHeading("acnc-register"), "ACNC classifications");
});

test("keeps source-native records distinct and linkable", () => {
  assert.equal(fundingSourceLabel("government_grants_or_contracts"), "government grants or contracts");
  assert.equal(sourceRecordLocator({ source_record_id: "src:acnc/1" }), "./public/data/source-records/src%253Aacnc%252F1.json");
});

test("keeps encoded source-native filenames routable through static hosting", () => {
  assert.equal(
    sourceRecordLocator({ source_record_id: "src:acnc-ais:example" }),
    "./public/data/source-records/src%253Aacnc-ais%253Aexample.json",
  );
});

test("renders functional allocations as direct shares with transparent derived amounts", () => {
  const display = functionalAllocationDisplay({ share: "0.1", direct_observation: true, derived_amount_approximate: true, derived_amount: { normalised_amount: "585279", normalised_currency: "AUD" } });
  assert.equal(display.share, "10% (direct reported)");
  assert.match(display.derivedAmount, /^Approx\. \$585,279$/);
});

import test from "node:test";
import assert from "node:assert/strict";

import { financialMetricDisplay, fundraisingDisplay, fundingSourceLabel, sourceRecordLocator, taxonomyHeading } from "../src/presentation.mjs";

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
  assert.equal(sourceRecordLocator({ source_record_id: "src:acnc/1" }), "./public/data/source-records/src%3Aacnc%2F1.json");
});

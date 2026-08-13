export function formatMoney(amount, currency = "AUD") {
  if (amount == null) return "Not available";
  return new Intl.NumberFormat("en-AU", {
    style: "currency", currency, maximumFractionDigits: 0,
  }).format(amount);
}

export function financialMetricDisplay(entity, metric) {
  const set = (entity.financial_metrics ?? []).find(item => item.metric === metric);
  if (!set) return "Not available";
  if (set.reconciliation_status !== "single_observation") return "Multiple reported values — inspect evidence";
  const amount = set.observations?.[0]?.amount;
  return amount ? formatMoney(amount.normalised_amount, amount.normalised_currency) : "Not available";
}

export function fundraisingDisplay(entity) {
  const estimate = entity.fundraising_expenditure;
  return estimate ? formatMoney(estimate.normalised_amount, estimate.normalised_currency) : "Not available from selected evidence.";
}

export function taxonomyHeading(taxonomyId) {
  if (taxonomyId === "causebase") return "CauseBase classifications";
  if (taxonomyId === "acnc-register") return "ACNC classifications";
  return `${taxonomyId} classifications`;
}

export function fundingSourceLabel(sourceType) {
  return String(sourceType ?? "other").replaceAll("_", " ");
}

export function functionalAllocationDisplay(allocation) {
  const share = `${(Number(allocation?.share ?? 0) * 100).toFixed(0)}%`;
  return {
    share: allocation?.direct_observation ? `${share} (direct reported)` : share,
    derivedAmount: allocation?.derived_amount
      ? `${allocation?.derived_amount_approximate ? "Approx. " : ""}${formatMoney(allocation.derived_amount.normalised_amount, allocation.derived_amount.normalised_currency)}`
      : "",
  };
}

export function sourceRecordLocator(record) {
  // GitHub Pages decodes one URL-encoding layer before looking up a static
  // file. Source-record files deliberately retain their encoded opaque IDs on
  // Windows-safe filenames, so the URL must retain that layer after routing.
  return `./public/data/source-records/${encodeURIComponent(encodeURIComponent(record.source_record_id))}.json`;
}

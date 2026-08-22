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
  if (taxonomyId === "causebase") return "Legacy classifications";
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
      ? allocation?.derived_amount_approximate
        ? `Approx. ${compactMoney(allocation.derived_amount.normalised_amount, allocation.derived_amount.normalised_currency)}`
        : formatMoney(allocation.derived_amount.normalised_amount, allocation.derived_amount.normalised_currency)
      : "",
  };
}

export function compactMoney(amount, currency = "AUD") {
  if (amount == null) return "Not available";
  return new Intl.NumberFormat("en-AU", {
    style: "currency", currency, notation: "compact", maximumFractionDigits: 0,
  }).format(amount).replace("K", "k");
}

export function validActionUrl(value, viewerOrigin = "https://gregorycwhill.github.io/charitygraph-viewer/") {
  try {
    const url = new URL(value);
    if (!/^https?:$/.test(url.protocol) || !url.hostname) return null;
    const viewer = new URL(viewerOrigin);
    const legacyViewer = new URL("https://gregorycwhill.github.io/CauseBase-Viewer/");
    if ((url.origin === viewer.origin && url.pathname.startsWith(viewer.pathname)) || (url.origin === legacyViewer.origin && url.pathname.startsWith(legacyViewer.pathname))) return null;
    return url.href;
  } catch {
    return null;
  }
}

export function donationsGiftsBequestsDisplay(projection) {
  const amount = projection?.numerator_amount;
  return {
    amount: amount?.normalised_amount == null ? "Not available" : new Intl.NumberFormat("en-AU", {
      style: "currency", currency: amount.normalised_currency ?? "AUD", notation: "compact", maximumFractionDigits: 3,
    }).format(amount.normalised_amount).replace("M", "m").replace("K", "k"),
    percentage: `${(Number(projection?.result ?? 0) * 100).toFixed(1)}% of ${projection?.denominator_label ?? "total income"}`,
  };
}

export function fundraisingAllocationOnly(allocations) {
  return (allocations ?? []).find(item => String(item?.source_label ?? "").trim().toLowerCase() === "fundraising") ?? null;
}

export function sourceRecordLocator(record) {
  // GitHub Pages decodes one URL-encoding layer before looking up a static
  // file. Source-record files deliberately retain their encoded opaque IDs on
  // Windows-safe filenames, so the URL must retain that layer after routing.
  return `./public/data/source-records/${encodeURIComponent(encodeURIComponent(record.source_record_id))}.json`;
}

// This is the Google-generated prefill URL grammar, verified against the
// live form.  Do not change entry IDs without an end-to-end Form check.
export const CORRECTION_INTAKE_URL = "https://docs.google.com/forms/d/e/1FAIpQLSfWpGlSeWv4IzmxSiHQeRsT-gDlUwDeIFnJiUQMbUWxZX8FHQ/viewform?usp=pp_url";

const ENTRY = {
  organisation: "entry.1802351789",
  causebase_id: "entry.971651971",
  dataset_version: "entry.1763981563",
  viewer_url: "entry.967966977",
  field: "entry.141688278",
  current_value: "entry.540909367",
};

// Google Forms prefill is a convenience, not the identity contract. Keeping
// lengthy prose out of the query avoids fragile links across browsers/forms;
// the required card/release/field/page context is always retained.
export const MAX_PREFILL_VALUE_LENGTH = 1200;

export function correctionUrl(entity, field, currentValue, viewerUrl) {
  const params = new URLSearchParams();
  const values = {
    organisation: entity?.display_name ?? "",
    causebase_id: entity?.causebase_id ?? "",
    dataset_version: entity?.dataset_version ?? "",
    viewer_url: viewerUrl ?? "",
    field: field ?? "general_feedback",
    current_value: String(currentValue ?? "").length <= MAX_PREFILL_VALUE_LENGTH ? currentValue ?? "" : "",
  };
  for (const [key, entry] of Object.entries(ENTRY)) params.set(entry, values[key]);
  return `${CORRECTION_INTAKE_URL}&${params.toString()}`;
}

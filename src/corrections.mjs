export const CORRECTION_INTAKE_URL = "https://docs.google.com/forms/d/e/1FAIpQLSfWpGlSeWv4IzmxSiHQeRsT-gDlUwDeIFnJiUQMbUWxZX8FHQ/viewform?usp=header";

const ENTRY = {
  organisation: "entry.1706692994",
  causebase_id: "entry.126487103",
  dataset_version: "entry.1118671490",
  viewer_url: "entry.682855219",
  field: "entry.561570777",
  current_value: "entry.1691361730",
};

export function correctionUrl(entity, field, currentValue, viewerUrl) {
  const params = new URLSearchParams();
  const values = {
    organisation: entity?.display_name ?? "",
    causebase_id: entity?.causebase_id ?? "",
    dataset_version: entity?.dataset_version ?? "",
    viewer_url: viewerUrl ?? "",
    field: field ?? "general_feedback",
    current_value: currentValue ?? "",
  };
  for (const [key, entry] of Object.entries(ENTRY)) params.set(entry, values[key]);
  return `${CORRECTION_INTAKE_URL}&${params.toString()}`;
}

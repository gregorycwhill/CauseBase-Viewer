export function normalise(value) { return String(value ?? "").toLowerCase().normalize("NFKD").replace(/\s+/g, " ").trim(); }
export function searchableText(entity) { return normalise([entity.causebase_id, entity.display_name, entity.legal_name, ...(entity.external_identifiers ?? []).flatMap(x => [x.scheme, x.value]), entity.causebase_summary, ...(entity.geography ?? []), ...(entity.activities ?? []), ...(entity.beneficiaries ?? []), ...(entity.participation_modes ?? []), ...(entity.classifications ?? []).flatMap(x => [x.taxonomy_id, x.term_id, x.term_label])].join(" ")); }
export function matchesQuery(entity, query) { return normalise(query).split(" ").filter(Boolean).every(token => searchableText(entity).includes(token)); }
export function filterEntities(entities, query) { return entities.filter(entity => matchesQuery(entity, query)); }
const causebase = entity => (entity.classifications ?? []).filter(x => x.taxonomy_id === "causebase");
const dimension = (entity, name) => causebase(entity).filter(x => x.term_id.startsWith(`${name}.`)).map(x => x.term_id);
export function facetValues(entities) {
  const values = { geography: new Set(), causebase_geography: new Set(), cause: new Set(), beneficiary: new Set(), activity: new Set(), approach: new Set(), participation: new Set(), organisation: new Set(), acnc_classification: new Set(), funding: new Set(), dgr: new Set() };
  for (const e of entities) {
    for (const x of e.navigation_geography ?? []) values.geography.add(`${x.level}:${x.code}:${x.label}`);
    for (const x of dimension(e, "geography")) values.causebase_geography.add(x);
    for (const group of ["cause", "beneficiary", "activity", "approach", "participation", "organisation"]) for (const x of dimension(e, group)) values[group].add(x);
    for (const x of e.classifications ?? []) if (x.taxonomy_id === "acnc-register") values.acnc_classification.add(x.term_id);
    for (const x of e.funding_sources ?? []) values.funding.add(x.source_type);
    for (const x of e.tax_statuses ?? []) if (x.scheme.toLowerCase().includes("dgr")) values.dgr.add(x.status ?? "recorded");
  }
  return Object.fromEntries(Object.entries(values).map(([key, set]) => [key, [...set].sort()]));
}
export function filterWithFacets(entities, query, facets = {}) { return filterEntities(entities, query).filter(e => Object.entries(facets).every(([group, wanted]) => {
  if (!wanted?.length) return true;
  let candidates = [];
  if (group === "geography") candidates = (e.navigation_geography ?? []).map(x => `${x.level}:${x.code}:${x.label}`);
  else if (group === "causebase_geography") candidates = dimension(e, "geography");
  else if (["cause", "beneficiary", "activity", "approach", "participation", "organisation"].includes(group)) candidates = dimension(e, group);
  else if (group === "acnc_classification") candidates = (e.classifications ?? []).filter(x => x.taxonomy_id === "acnc-register").map(x => x.term_id);
  else if (group === "funding") candidates = (e.funding_sources ?? []).map(x => x.source_type);
  else if (group === "dgr") candidates = (e.tax_statuses ?? []).filter(x => x.scheme.toLowerCase().includes("dgr")).map(x => x.status ?? "recorded");
  return wanted.some(x => candidates.includes(x));
})); }

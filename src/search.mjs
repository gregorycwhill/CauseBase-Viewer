export function normalise(value) {
  return String(value ?? "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/\s+/g, " ")
    .trim();
}

export function searchableText(entity) {
  return normalise([
    entity.causebase_id,
    entity.display_name,
    entity.legal_name,
    ...(entity.external_identifiers ?? []).flatMap(identifier => [identifier.scheme, identifier.value]),
    entity.causebase_summary,
    ...(entity.geography ?? []),
    ...(entity.activities ?? []),
    ...(entity.beneficiaries ?? []),
    ...(entity.participation_modes ?? []),
    ...(entity.classifications ?? []).flatMap(c => [c.term_label, c.term_id, c.taxonomy_id]),
  ].join(" "));
}

export function matchesQuery(entity, query) {
  const q = normalise(query);
  if (!q) return true;
  return q.split(" ").every(token => searchableText(entity).includes(token));
}

export function filterEntities(entities, query) {
  return entities.filter(entity => matchesQuery(entity, query));
}

export function facetValues(entities) {
  const values = { geography: new Set(), taxonomy: new Set(), funding: new Set() };
  for (const entity of entities) {
    for (const item of entity.geography ?? []) values.geography.add(item);
    for (const item of entity.classifications ?? []) values.taxonomy.add(`${item.taxonomy_id}:${item.term_id}`);
    for (const item of entity.funding_sources ?? []) values.funding.add(item.source_type);
  }
  return Object.fromEntries(Object.entries(values).map(([key, value]) => [key, [...value].sort()]));
}

export function filterWithFacets(entities, query, facets = {}) {
  return filterEntities(entities, query).filter(entity => {
    if (facets.geography?.length && !facets.geography.some(value => (entity.geography ?? []).includes(value))) return false;
    if (facets.taxonomy?.length && !facets.taxonomy.some(value =>
      (entity.classifications ?? []).some(item => `${item.taxonomy_id}:${item.term_id}` === value))) return false;
    if (facets.funding?.length && !facets.funding.some(value =>
      (entity.funding_sources ?? []).some(item => item.source_type === value))) return false;
    return true;
  });
}

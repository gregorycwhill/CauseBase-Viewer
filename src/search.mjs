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

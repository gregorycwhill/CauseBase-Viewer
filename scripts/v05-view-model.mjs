/** Build a browser index from canonical public-contract 0.5 cards. */
export function buildV05ViewModel(cards, sourceRecords, manifest) {
  const sources = new Map(sourceRecords.map(source => [source.source_record_id, source]));
  const entity = card => {
    const report = card.financial_reports?.at(-1);
    const observations = new Map((report?.structured_observations ?? []).map(item => [item.observation_id, item]));
    const metric = name => {
      const pointer = card.canonical_metrics?.find(item => item.metric === name);
      const observation = pointer && observations.get(pointer.observation_id);
      return observation ? { metric: name, reconciliation_status: pointer.reconciliation_status, observations: [{ amount: observation.amount }] } : null;
    };
    const sourceNativeRecords = (card.source_record_refs ?? []).map(sourceRecordId => {
      const source = sources.get(sourceRecordId);
      return source && { source_record_id: sourceRecordId, source_family: source.source_family, dataset_version: source.dataset_version };
    }).filter(Boolean);
    return {
      causebase_id: card.causebase_id,
      subject_kind: card.subject_kind,
      display_name: card.identity.display_name,
      legal_name: card.identity.legal_name,
      operating_names: card.identity.operating_names ?? [], former_names: card.identity.former_names ?? [], entity_status: card.identity.entity_status,
      external_identifiers: card.identity.external_identifiers ?? [], registrations: card.identity.registrations ?? [], tax_statuses: card.identity.tax_statuses ?? [], website: card.identity.website,
      evidence: card.evidence ?? [], causebase_summary: card.summary?.text ?? null, summary_evidence_ids: card.derivatives?.find(item => item.kind === "summary")?.evidence_ids ?? [],
      activities: (card.activities ?? []).map(item => item.label), beneficiaries: (card.beneficiaries ?? []).map(item => item.label), geography: (card.descriptive_geography ?? []).map(item => item.label),
      legacy_unbound: card.legacy_unbound ?? null,
      navigation_geography: card.navigation_geography ?? [], classifications: card.classifications ?? [],
      programs: card.programs ?? [], participation_observations: card.participation ?? [], funding_sources: card.funding_sources ?? [], fundraising_methods: card.fundraising_methods ?? [],
      financial_records: report ? [{ ...report, period: report.reporting_period, statements: (report.statements ?? []).map(statement => ({ ...statement, statement_title: statement.printed_title, rows: statement.rows.map(row => ({ ...row, current_amount: row.amount, comparative_periods: row.comparatives ?? [] })) })), functional_expense_allocations: (report.functional_expense_allocations ?? []).map(item => ({ ...item, source_label: item.allocation_label, direct_observation: true })) }] : [],
      financial_metrics: [metric("revenue"), metric("total_expenses"), metric("total_assets"), metric("total_liabilities"), metric("net_assets_equity")].filter(Boolean),
      source_native_records: sourceNativeRecords,
      dataset_version: manifest.dataset_version, card_schema_version: "0.5", editorial_policy_version: "historical RC4 derivative lineage",
    };
  };
  return { entities: cards.map(entity), generated_from: { contract_version: "0.5", release_id: manifest.release_id } };
}

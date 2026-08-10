# CauseBase Viewer Data Contract

**Status:** Provisional Viewer implementation boundary — shared CauseBase contract remains subject to reality spike  
**Version:** 0.1-draft

## 1. Principle

CauseBase Viewer consumes published CauseBase Data.

Viewer does not read Builder's private source or processed working directories and does not maintain an independent charity datastore.

## 2. Required public capabilities

Viewer needs public data sufficient to:

- list/index entities;
- search/filter;
- load a selected card;
- display provenance/estimate methods;
- inspect multiple taxonomies;
- display correction status;
- navigate semantic similarity;
- support semantic search/blending where enabled.

## 3. Likely publication artefacts

Exact filenames/formats may evolve.

### Browser entity index

Compact public representation for initial search/results, including opaque CauseBase subject ID, subject kind, names, selected external identifiers, geography, source-aware coverage observations, selected taxonomy facets, participation flags, selected financial/size fields and a stable card locator. ABN is an external identifier, not the Viewer or card primary key.

### Card JSON

Rich card representation for selected-entity inspection. This may be bulk or per-entity depending on measured performance.

### Markdown card

Public human/LLM-readable representation. Viewer may link to it but need not render from Markdown.

### Taxonomy data

Public term definitions and hierarchies needed for filtering/inspection.

### Correction intake and proposal index

The first enriched-card release requires a private, prefilled correction intake handoff and traceable acknowledgement. Governed public status/history arrives when moderation and proposal-ledger infrastructure is ready.

### Semantic index

A browser-appropriate semantic representation may be published separately from canonical full embeddings. The contract is semantic functionality, not a specific vector encoding.

## 4. Full analytical assets

CauseBase Data may also publish CSV, JSONL, Parquet, canonical embeddings and similarity tables.

Viewer may link to these without loading them during ordinary browsing.

## 5. Version awareness

Viewer should be able to display/determine CauseBase release/version, card/schema version where relevant and last build/publication time.

A correction proposal must identify the release/value challenged.

## 6. Representation authority

If Viewer displays a card field, the published CauseBase Card is authoritative for that release.

Do not recompute financial metrics, taxonomy assignments or prose differently in JavaScript unless it is explicitly a Viewer-only exploration operation such as semantic blending.

## 7. Semantic exploration

Canonical high-dimensional embeddings may be too large for routine browser delivery.

Builder may publish precomputed neighbours, reduced/quantised vectors or another compact semantic index. Any Viewer-specific semantic representation is derived from the canonical release and should identify method/version.

## 8. Staleness

Viewer should respect freshness metadata and distinguish not-found-in-source, source unavailability, retrieval failure and not-yet-processed work. Transient opportunities may have different observation dates from stable card summary information.

Do not present stale retained observations as current without indication.

## 9. Failure behaviour

If a secondary artefact such as the semantic index fails to load, Viewer should still permit basic search/card inspection where possible.

## 10. Downloads

Viewer should provide clear links to CauseBase Data and relevant release artefacts. Viewer is a convenience interface over an independently usable public data product.

## 11. Agent usability

Published data must offer stable subject/card URLs, per-subject JSON and Markdown, machine-readable release/licence/schema metadata, provenance and freshness conventions, latest-release discovery and compact selective retrieval. An unfamiliar coding/AI agent should be able to retrieve and correctly interpret one subject within minutes without downloading the national corpus.

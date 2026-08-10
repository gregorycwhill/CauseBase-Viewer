# CauseBase Viewer — Agent Instructions

**Status:** Canonical repository instructions  
**Version:** 0.1

## Shared CauseBase project memory

The canonical shared state and planning documents live in the sibling
[`CauseBase-Data`](https://github.com/gregorycwhill/CauseBase-Data) repository:

- `CURRENT_STATE.md`
- `ROADMAP.md`
- `IMPLEMENTATION_PLAN.md`
- `TEST_PLAN.md`
- `CODEX_TO_CHATGPT_HANDOFF.md`

Read those files before changing cross-product contracts. Do not create or maintain workspace-root duplicates.

## Product boundary

CauseBase Viewer is for discovery, search, inspection, provenance and correction.

Do not add personalised recommendations, charity quality scores, best-charity rankings, donation nudges, portfolio optimisation, payments, user-account infrastructure or a proprietary CauseBase datastore.

## Data ownership

Viewer consumes CauseBase Data. It must not become an independent source of truth.

Do not manually maintain charity facts, summaries, taxonomies, embeddings or estimates inside Viewer code.

Treat opaque CauseBase subject ID and stable card URL as the primary navigation identity. ABN and ACNC identifiers are displayed/searchable external identifiers.

## Static-first

Prefer a static browser architecture. Do not introduce a backend unless a concrete requirement cannot reasonably be met by static/public data plus external contribution/discussion mechanisms.

## Search versus recommendation

Allowed:

- text/faceted/taxonomy search;
- semantic search;
- semantic neighbours;
- multi-entity centroid/blend exploration;
- factual side-by-side comparison;
- transparent sort controls.

Not allowed:

- unexplained desirability ranking;
- “recommended for you”;
- quality stars/scores;
- hidden objective functions intended to change giving behaviour.

Search ranking should be understandable as retrieval relevance, not charity merit.

## Card fidelity

Viewer renders the canonical CauseBase Card. Do not rewrite substantive card content client-side.

Display provenance, confidence and estimation method clearly enough that users can distinguish fact from inference.

## Corrections

- Field-level edit controls create proposals; they do not mutate source data.
- Prefill entity, field, current value and release/version.
- Correction status/history should be inspectable where available.
- Open-ended discussion is distinct from structured correction.
- The first public enriched-card experience requires a private prefilled correction intake handoff and traceable acknowledgement; do not publish raw submissions automatically.

## Taxonomies

Support multiple taxonomies without presenting the UI default as universal truth.

## Semantic interaction

Similarity is descriptive.

Use labels such as Similar organisations, Semantic neighbours and Explore nearby.

Avoid Recommended alternatives, Better charities and You should also support.

Never expose synthetic or hash-based fixture neighbours as though they were semantic results. Real embeddings, classifications and similarities arrive together for real enriched cards.

If multiple charities are blended, explain that the result is semantic proximity to the selected set.

## Accessibility

Do not make dense grid interaction the only way to use Viewer. Primary controls/cards/corrections must be keyboard- and screen-reader-usable. Mobile should remain usable.

## Performance

Do not require every browser to download the full canonical high-dimensional embedding corpus if a smaller generated semantic index can support the experience.

## Before declaring work complete

1. Run static/unit/browser tests.
2. Test against a representative fixture.
3. Test search/filter/card navigation.
4. Confirm deep links.
5. Confirm correction links prefill correctly.
6. Confirm provenance/estimate methods remain visible.
7. Check that recommendation language/logic has not slipped in.
8. Test keyboard/mobile behaviour for touched interactions.

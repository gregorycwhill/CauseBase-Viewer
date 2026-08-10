# CauseBase Viewer

**Status:** Canonical repository overview  
**Version:** 0.1

CauseBase Viewer is the thin public browser for CauseBase Data.

It exists to help people discover charities, search/filter, explore semantic neighbourhoods, inspect CauseBase Cards, understand provenance/uncertainty, inspect multiple taxonomies, identify stale/missing information, propose corrections and follow public correction/discussion history.

Viewer does not recommend charities and does not own CauseBase's underlying data.

## Product boundary

CauseBase Viewer is an epistemic interface.

It answers:

- What does CauseBase currently say about this organisation?
- Why?
- How current is the evidence?
- Which taxonomies classify it where?
- What organisations are semantically nearby?
- Is a field estimated or measured?
- How can I challenge it?

It does not answer:

- Which charity is best?
- Which should I give to?
- How should I allocate money?
- Which cause should I prefer?

## Intended implementation

Viewer should remain a static web application wherever practical:

`static HTML/CSS/JavaScript + grid/search library + published CauseBase data`

No CauseBase-specific backend is required merely to display, search and inspect the public data.

## Core layout

The default desktop experience is expected to use:

- search/filter/index on the left;
- selected CauseBase Card on the right.

Mobile behaviour may stack these views.

## Canonical documents

- `UX_SPEC.md` — user experience and interaction contract
- `DATA_CONTRACT.md` — what Viewer consumes and must not own
- `CORRECTION_FLOW.md` — field-level correction and discussion experience
- `AGENTS.md` — coding-agent instructions

High-level CauseBase product documents remain authoritative where these implementation documents conflict with them.
Their canonical GitHub-visible copies are in [CauseBase-Data](https://github.com/gregorycwhill/CauseBase-Data): `CURRENT_STATE.md`, `ROADMAP.md`, `IMPLEMENTATION_PLAN.md`, `TEST_PLAN.md` and `CODEX_TO_CHATGPT_HANDOFF.md`.

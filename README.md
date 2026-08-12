# CauseBase Viewer

**Status:** Canonical repository overview  
**Version:** 0.1

CauseBase Viewer is the thin public browser for CauseBase Data.

## Human-test deployment

GitHub Pages uses only the `gh-pages` branch, built by the manual **Deploy validated human-test site** workflow. Pushes to `main` do not deploy. The workflow tests Viewer, refuses an unvalidated or unsafe publication candidate, and publishes the static bundle only. Each deployment includes `deployment.json` with the dataset version and Viewer commit used to build it.

It exists to help people discover charities, search/filter, explore semantic neighbourhoods, inspect CauseBase Cards, understand provenance/uncertainty, inspect multiple taxonomies, identify stale/missing information, propose corrections and follow public correction/discussion history.

Viewer does not recommend charities and does not own CauseBase's underlying data.

## Phase 2B browser surfaces

The Viewer supports free-text retrieval plus combinable geography, taxonomy and funding facets; taxonomy terms are navigation links, never quality labels. Stable card hash URLs work with browser back/forward. Each card separates evidence links from convenience links, exposes JSON/Markdown and source-native record sidecars, shows longitudinal financial/release history and derivative reuse metadata, and renders funding/fundraising only where data is supported.

The current release remains an explicit 120-subject early test corpus, not a claim of national enriched coverage.

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

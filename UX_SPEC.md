# CauseBase Viewer UX Specification

**Status:** Canonical Viewer experience contract  
**Version:** 0.1

## 1. Purpose

CauseBase Viewer helps humans inspect the CauseBase information space.

The primary loop is:

**Discover -> Search -> Inspect -> Verify -> Correct**

Semantic exploration may extend search, but Viewer does not recommend or persuade.

## 2. Default desktop layout

```text
+------------------------------+--------------------------------------+
| Search / filters / results   | Selected CauseBase Card              |
|                              |                                      |
| [search.................]    | Organisation name                    |
|                              | CauseBase summary                    |
| taxonomy filters             | activities / beneficiaries           |
| geography                    | participation                        |
| participation                | financials                           |
| size/financial filters       | taxonomies                           |
|                              | evidence / provenance                |
| result 1                     | corrections/history                  |
| result 2                     | semantic neighbours                  |
| result 3                     |                                      |
+------------------------------+--------------------------------------+
```

The visual design may evolve. The conceptual separation between index/navigation and knowledge card should remain.

## 3. Search

Support name, ABN/identifier, keyword, geography, taxonomy, activity, beneficiary, participation and appropriate financial/size filters.

Search ranking represents retrieval relevance, not merit.

## 4. Semantic search

A user may enter a natural-language description such as:

> practical creek restoration volunteering in northern Melbourne

Viewer may use CauseBase semantic representations to retrieve nearby organisations.

## 5. Semantic neighbours

A card may display semantically similar organisations using neutral labels such as Similar organisations or Semantic neighbours.

## 6. Multi-select semantic blend

A user may select multiple charities and request a combined semantic search.

Conceptually, Viewer finds organisations near the centroid or other defined combination of selected semantic representations.

Explain it plainly, for example:

> Explore organisations semantically similar to this combination.

This is discovery, not preference inference.

Possible filters include similar-but-local, similar-but-smaller or similar mission with a specified participation mode.

## 7. Card sections

### Identity
Names, ABN, status, website and major identifiers.

### CauseBase summary
Neutral, dense CauseBase synthesis.

### Organisation's own description
Clearly attributed where shown.

### Activities / beneficiaries / geography
Concrete structured understanding.

### Participation
Stable modes and current opportunities, with freshness.

### Financials
Facts, metrics and estimates. Fundraising expenditure clearly shows method/confidence/provenance.

### Classifications
Multiple taxonomy views.

### Evidence
Source classes, citations, observation dates and derivation information.

### Similar organisations
Descriptive semantic relationships.

### Corrections / discussion
Visible proposals, status/history and discussion links where relevant.

## 8. Deep links

Each entity/card should have a stable addressable URL. Selecting a result should update the URL, and a shared link should restore the selected card.

Where practical, important search/taxonomy states may also be shareable.

## 9. Correction affordance

Fields/sections that can be challenged should expose a clear correction action without requiring re-entry of organisation, field, current value or release/version.

The action creates a proposal, not an immediate edit.

## 10. Public status

Show statuses such as lodged, under review, queried, accepted, rejected and incorporated where correction data is available.

Users should be able to distinguish a published value from a pending challenge.

## 11. Discussion

Open-ended discussion may link to GitHub Discussions or another public mechanism. Discussion and correction are separate actions.

## 12. Grid/table mode

A dense grid view may be provided for data-oriented users as a secondary representation, with filtering, sorting, column selection and export.

## 13. No recommendation affordances

Do not introduce Top picks, Best match, Recommended for you, Give now, quality stars or desirability scores.

Downstream applications may build those experiences using CauseBase Data.

## 14. Accessibility and responsive behaviour

The two-pane desktop design should degrade cleanly to smaller screens. On mobile, search/results and selected card may become sequential views.

Core actions must not depend on hover. Keyboard access and screen-reader semantics are required.

## 15. Tone

Viewer should feel like public data infrastructure or an inspection tool, not a fundraising campaign.

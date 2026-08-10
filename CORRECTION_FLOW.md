# CauseBase Viewer Correction Flow

**Status:** Canonical correction UX contract  
**Version:** 0.1

## 1. Goal

Make it easy for a person who spots a problem to challenge the exact CauseBase assertion without giving direct edit access to generated data.

## 2. Field-level interaction

Where appropriate, a field or section exposes `Suggest correction`.

The action should carry context automatically:

- entity ID;
- organisation name;
- field/assertion;
- current value;
- CauseBase release/card version;
- Viewer URL.

The contributor mainly supplies what is wrong/missing, proposed correction where appropriate, reason and supporting source/evidence.

## 3. Correction versus self-description

Distinguish:

### Correct a CauseBase assertion
Use for factual, stale, missing or classification issues. Encourage evidence.

### Update organisation self-description
Use for attributed organisation-authored mission/description. This does not imply replacement of CauseBase's neutral synthesis.

## 4. Proposal acknowledgement

After submission, provide a stable proposal identifier and public status link where possible.

Example lifecycle:

`Lodged -> Under review -> Queried -> Accepted/Rejected -> Incorporated`

## 5. Pending state on card

Where practical, a card with a material active challenge may show `Correction proposed` without prematurely changing the published value.

## 6. Accepted state

Once incorporated, history should identify proposal, decision and release in which the change appeared.

If the correction altered dependent generated content, the new release should contain regenerated summary/classifications/embeddings as appropriate.

## 7. Rejected state

A rejected proposal should remain publicly inspectable where appropriate, with concise decision reason.

## 8. Discussion

Provide a separate action for open-ended discussion where available.

Discussion does not directly alter the card.

## 9. Low-friction intake

A simple external form may be used initially. The intake mechanism must not define the correction data model. All channels converge on the Builder proposal model.

### Phase 2A external-intake contract

Set `window.CAUSEBASE_CORRECTION_INTAKE_URL` to the external intake endpoint. Viewer appends URL-encoded query parameters; the endpoint must accept and preserve these exact names:

- `causebase_id` — required opaque subject identifier;
- `dataset_version` — required release challenged;
- `field` — required displayed field or section identifier;
- `current_value` — optional rendered value at the time of submission;
- `organisation` — optional display context only;
- `viewer_url` — optional source page/deep link.

The private intake must collect, in addition to the prefilled values:

- `proposed_correction` (long text, required);
- `reason` (long text, required);
- `supporting_evidence` (URL or long text, optional but encouraged);
- `contact` (email or other contact, optional);
- `consent_to_contact` (boolean, optional).

The receiver must return or display a private acknowledgement identifier. It must not publish raw submissions, contact details, or an unmoderated proposal ledger.

## 10. Avoid adversarial framing

Suitable language:

> CauseBase is built from public evidence and may be incomplete or wrong. If you can improve the record, tell us what should change and why.

Do not imply either CauseBase infallibility or charity veto over neutral description.

## 11. Promotional rewrites

If a contributor proposes replacing concrete CauseBase prose with promotional copy, direct them to correct a specific factual problem or update the attributed organisation self-description.

This reflects the published editorial policy rather than ad hoc moderation.

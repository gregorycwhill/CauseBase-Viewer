# CauseBase Phase 2A.1 human-test feedback form

Create one private Google Form titled **CauseBase human-test feedback**. Do not publish responses, create GitHub issues automatically, or expose contact details.

## Fields

| Field name | Google Forms type | Required | Helper text / values |
| --- | --- | --- | --- |
| Feedback type | Dropdown | Yes | `factual correction`; `outdated information`; `missing information`; `organisation self-description`; `classification dispute`; `methodology dispute`; `general product feedback`; `other` |
| Organisation / display name | Short answer | No | Prefilled for card-specific corrections. |
| CauseBase ID | Short answer | No | Prefilled opaque ID; do not substitute ABN. |
| Dataset / release version | Short answer | No | Prefilled release challenged. |
| Viewer / card URL | Short answer | No | Prefilled project-site URL with hash where available. |
| Field / section | Short answer | No | Prefilled for field-level correction. |
| Current displayed value | Paragraph | No | Prefilled snapshot of challenged text. |
| Proposed correction or feedback | Paragraph | Yes | State the requested change or general feedback. |
| Explanation | Paragraph | Yes | Explain why the change is warranted. |
| Supporting source / evidence URL | Short answer | No | Public link preferred; do not request confidential documents. |
| Contact name | Short answer | No | Optional. |
| Contact email | Short answer with email validation | No | Optional; used only for follow-up. |

## Wiring information required from the form owner

After creating the form, provide:

1. the form response URL for `CAUSEBASE_CORRECTION_INTAKE_URL`;
2. each Google Forms `entry.<number>` identifier for the prefillable fields: organisation, CauseBase ID, release version, Viewer URL, field/section and current displayed value;
3. confirmation that responses are restricted to the intended private reviewers or otherwise handled privately.

Until these details are supplied, Viewer must state that external intake is not configured. Generic feedback uses the same form without card fields; card-specific correction supplies the documented prefill context.

import test from "node:test";
import assert from "node:assert/strict";

import { filterEntities, filterWithFacets, matchesQuery } from "../src/search.mjs";

const entities = [
  {
    display_name: "Friends of Merri Creek North",
    legal_name: "Friends of Merri Creek North Incorporated",
    causebase_id: "cb:demo:merri-creek-north",
    external_identifiers: [{ scheme: "abn", value: "11111111111" }],
    causebase_summary: "removes weeds and litter along Merri Creek",
    geography: ["Coburg"],
    navigation_geography: [{ level: "region_locality", code: "AU-VIC-COBURG", label: "Coburg" }],
    activities: ["revegetates creek banks"],
    beneficiaries: ["urban waterways"],
    participation_modes: ["working bees"],
    classifications: [
      { taxonomy_id: "causebase", term_id: "cause.environment.waterways", term_label: "Waterways" }
    ]
  },
  {
    display_name: "Northern Youth Legal Centre",
    causebase_id: "cb:demo:northern-youth-legal-centre",
    external_identifiers: [{ scheme: "abn", value: "22222222222" }],
    causebase_summary: "provides free legal advice to young people",
    geography: ["Northern Melbourne"],
    navigation_geography: [{ level: "region_locality", code: "AU-VIC-NMEL", label: "Northern Melbourne" }],
    activities: [],
    beneficiaries: ["young people"],
    participation_modes: ["board service"],
    classifications: []
  }
];

test("searches across activity and geography", () => {
  assert.equal(filterEntities(entities, "creek Coburg").length, 1);
  assert.equal(filterEntities(entities, "legal young").length, 1);
});

test("searches taxonomy labels", () => {
  assert.equal(matchesQuery(entities[0], "waterways"), true);
});

test("does not imply recommendation ordering", () => {
  assert.deepEqual(
    filterEntities(entities, ""),
    entities
  );
});

test("combines free text with multiple descriptive facets", () => {
  const withFunding = { ...entities[0], funding_sources: [{ source_type: "government_grants_or_contracts" }] };
  assert.equal(filterWithFacets([withFunding, entities[1]], "creek", {
    geography: ["region_locality:AU-VIC-COBURG:Coburg"], cause: ["cause.environment.waterways"], funding: ["government_grants_or_contracts"],
  }).length, 1);
});

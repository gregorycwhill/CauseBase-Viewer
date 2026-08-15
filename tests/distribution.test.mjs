import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, existsSync, readdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { execFileSync } from "node:child_process";

const root=resolve(import.meta.dirname,"..");

test("static build provides indexable direct routes and machine release discovery", () => {
  const output=mkdtempSync(join(tmpdir(),"causebase-viewer-distribution-"));
  const localRelease=resolve(root,"..","CauseBase-Data","releases","v0.5.0-2026-08-15");
  const ciRelease=resolve(root,"causebase-data","releases","v0.5.0-2026-08-15");
  const release=existsSync(localRelease) ? localRelease : ciRelease;
  execFileSync(process.execPath,[join(root,"scripts","prepare-pages.mjs")],{cwd:root,env:{...process.env,CAUSEBASE_OUTPUT_DIR:output,CAUSEBASE_DATA_DIR:release},stdio:"pipe"});
  const manifest=JSON.parse(readFileSync(join(output,"public","data","manifest.json"),"utf8"));
  const cardFile=readdirSync(join(output,"public","data","cards")).find(file => file.endsWith(".json"));
  const card=JSON.parse(readFileSync(join(output,"public","data","cards",cardFile),"utf8"));
  const page=readFileSync(join(output,"charity",card.causebase_id,"index.html"),"utf8");
  assert.match(page,new RegExp(`<link rel="canonical" href="https://gregorycwhill.github.io/CauseBase-Viewer/charity/${card.causebase_id}/">`));
  assert.match(page,/Card JSON/); assert.match(page,/Source-native records/);
  assert.match(readFileSync(join(output,"public","data","cards",`${card.causebase_id}.md`),"utf8"),/Canonical HTML/);
  assert.equal(JSON.parse(readFileSync(join(output,"current-release.json"),"utf8")).dataset_version,manifest.dataset_version);
  assert.match(readFileSync(join(output,"sitemap.xml"),"utf8"),new RegExp(`/charity/${card.causebase_id}/`));
  assert.ok(existsSync(join(output,"robots.txt")));
});

test("documented links retain representative v0.5 interpretation states", () => {
  const release=resolve(root,"..","CauseBase-Data","releases","v0.5.0-2026-08-15");
  const card=id => JSON.parse(readFileSync(join(release,"cards",`${id}.json`),"utf8"));
  const eja=card("cb_604da7f26c6c48dd934e713edc493e9f");
  const allocation=eja.financial_reports[0].functional_expense_allocations.find(item => item.allocation_label === "Fundraising");
  assert.equal(allocation.share,"0.1");
  assert.equal(allocation.claim_basis,"direct");
  assert.match(allocation.warnings[0],/Mechanically derived/);
  const apnic=card("cb_4434434d6c6e425faf0dd56cb29ef8bf");
  assert.ok(apnic.financial_reports.length >= 1);
  assert.ok(apnic.financial_reports[0].reporting_period.label);
  assert.equal(apnic.current_financials,undefined); // no unsupported current-selection is invented
  assert.ok(apnic.legacy_unbound.financial_records.length >= 1);
  const sparse=card("cb_5d5459e58dac4e49a042f717e395ebec");
  assert.equal(sparse.coverage.current.find(item => item.capability === "understanding.activities").status,"unknown");
  const dfwa=card("cb_408c113ff48c4b4f91c7697b00b211dd");
  assert.ok(dfwa.legacy_unbound); // retained material is not silently converted to observed evidence
  const legacy=card("cb_065dfdefae8b4f7ea2b964dd2b60d800");
  assert.ok(legacy.legacy_unbound.origin_card_sha256);
});

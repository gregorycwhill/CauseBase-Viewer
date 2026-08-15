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

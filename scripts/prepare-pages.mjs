import { cp, mkdir, readFile, readdir, rm, stat, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { execFileSync } from "node:child_process";
import { buildV05ViewModel } from "./v05-view-model.mjs";

const root = resolve(import.meta.dirname, "..");
const output = resolve(process.env.CAUSEBASE_OUTPUT_DIR ?? resolve(root, "dist"));
const data = resolve(process.env.CAUSEBASE_DATA_DIR ?? resolve(root, "public", "data"));
const legacyRequired = [
  "causebase.json", "causebase.jsonl", "causebase.csv", "causebase.parquet",
  "embeddings.json", "embeddings.parquet", "similarities.json", "similarities.parquet",
  "manifest.json", "coverage.json", "agent-guide.md", "schema/card.schema.json",
  "taxonomy/causebase-v0.json", "source-inventory.json", "release-history.json",
];
const forbidden = /(^|[/\\])(archive|cache|runtime|state)([/\\]|$)|\.(pdf|warc|env|sqlite|db)$/i;
const siteBase = "https://gregorycwhill.github.io/CauseBase-Viewer";
const esc = value => String(value ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
const abn = card => card.identity?.external_identifiers?.find(item => item.scheme === "abn")?.value;
const sourceHref = sourceId => `../../public/data/source-records/${encodeURIComponent(sourceId)}.json`;
const cardMarkdown = (card, manifest) => {
  const identity=card.identity ?? {}; const title=identity.display_name ?? identity.legal_name ?? card.causebase_id;
  const coverage=(card.coverage?.current ?? []).map(item => `- ${item.capability}: ${item.status}`).join("\n");
  return `# ${title}\n\n- CauseBase ID: ${card.causebase_id}\n- Dataset version: ${manifest.dataset_version}\n- Contract version: ${manifest.contract_version}\n\n${card.summary?.text ?? ""}\n\n## Coverage\n\n${coverage}\n\n## Data\n\n- JSON: ${siteBase}/public/data/cards/${encodeURIComponent(card.causebase_id)}.json\n- Canonical HTML: ${siteBase}/charity/${encodeURIComponent(card.causebase_id)}/\n`;
};
const cardHtml = (card, manifest) => {
  const identity=card.identity ?? {}; const title=identity.display_name ?? identity.legal_name ?? card.causebase_id;
  const evidence=new Map((card.evidence ?? []).map(item => [item.evidence_id,item]));
  const sources=[...new Set(card.source_record_refs ?? [])];
  const coverage=(card.coverage?.current ?? []).map(item => `<li><strong>${esc(item.capability)}</strong>: ${esc(item.status)}</li>`).join("");
  return `<!doctype html><html lang="en-AU"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)} | CauseBase</title><meta name="description" content="CauseBase public charity record for ${esc(title)}."><link rel="canonical" href="${siteBase}/charity/${encodeURIComponent(card.causebase_id)}/"><link rel="alternate" type="application/json" href="../../public/data/cards/${encodeURIComponent(card.causebase_id)}.json" title="CauseBase card JSON"><link rel="alternate" type="text/markdown" href="../../public/data/cards/${encodeURIComponent(card.causebase_id)}.md" title="CauseBase card Markdown"><link rel="stylesheet" href="../../styles.css"></head><body><header class="site-header"><div><strong>CauseBase</strong><span>Public charity data</span></div><nav><a href="../../">Browse Viewer</a><a href="../../public/data/manifest.json">Dataset manifest</a></nav></header><main class="card-pane static-card"><article><p class="eyebrow">CauseBase card</p><h1>${esc(title)}</h1><dl class="identity-facts"><div><dt>CauseBase ID</dt><dd>${esc(card.causebase_id)}</dd></div><div><dt>Legal name</dt><dd>${esc(identity.legal_name)}</dd></div>${abn(card) ? `<div><dt>ABN</dt><dd>${esc(abn(card))}</dd></div>` : ""}<div><dt>Dataset version</dt><dd>${esc(manifest.dataset_version)}</dd></div><div><dt>Contract version</dt><dd>${esc(manifest.contract_version)}</dd></div></dl>${card.summary?.text ? `<section><h2>Summary</h2><p>${esc(card.summary.text)}</p></section>` : ""}<section><h2>Coverage</h2><ul>${coverage || "<li>None recorded</li>"}</ul></section><section><h2>Data and provenance</h2><p><a href="../../public/data/cards/${encodeURIComponent(card.causebase_id)}.json">Card JSON</a> · <a href="../../public/data/cards/${encodeURIComponent(card.causebase_id)}.md">Card Markdown</a> · <a href="../../public/data/schema/card.schema.json">Card schema</a></p><h3>Source-native records</h3><ul>${sources.map(id => `<li><a href="${sourceHref(id)}">${esc(id)}</a></li>`).join("") || "<li>None recorded</li>"}</ul><h3>Evidence</h3><ul>${[...evidence.values()].map(item => `<li>${esc(item.title)}${item.url ? ` · <a href="${esc(item.url)}">Open source</a>` : ""}</li>`).join("") || "<li>None recorded</li>"}</ul></section></article></main></body></html>`;
};

const manifest = JSON.parse(await readFile(resolve(data, "manifest.json"), "utf8"));
if (manifest.validation?.status !== "passed" || manifest.entity_count < 100) {
  throw new Error("Refusing deployment: public/data is not a validated Phase 2A candidate.");
}
const v05 = manifest.contract_version === "0.5";
const required = v05 ? ["cards", "source-records", "capability-registry.json"] : legacyRequired;
for (const relative of required) {
  await stat(resolve(data, relative));
}

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
for (const file of ["index.html", "styles.css", "correction.html", "commitments.html", "robots.txt", ".nojekyll"]) {
  await cp(resolve(root, file), resolve(output, file));
}
await cp(resolve(root, "src"), resolve(output, "src"), { recursive: true });
await cp(resolve(root, "public"), resolve(output, "public"), { recursive: true });
// A local human-review bundle may deliberately point at a staged candidate.
// Replace only its data subtree after copying the Viewer shell/assets.
if (data !== resolve(root, "public", "data")) {
  await rm(resolve(output, "public", "data"), { recursive: true, force: true });
  await cp(data, resolve(output, "public", "data"), { recursive: true });
}
if (v05) {
  const dataOutput = resolve(output, "public", "data");
  const cards = await Promise.all((await readdir(resolve(data, "cards"))).filter(name => name.endsWith(".json")).sort().map(async name => JSON.parse(await readFile(resolve(data, "cards", name), "utf8"))));
  const sources = await Promise.all((await readdir(resolve(data, "source-records"))).filter(name => name.endsWith(".json")).sort().map(async name => JSON.parse(await readFile(resolve(data, "source-records", name), "utf8"))));
  await writeFile(resolve(dataOutput, "causebase.json"), JSON.stringify(buildV05ViewModel(cards, sources, manifest), null, 2) + "\n");
  await writeFile(resolve(dataOutput, "similarities.json"), "[]\n");
  const routeRoot=resolve(output,"charity"); await mkdir(routeRoot,{recursive:true});
  for (const card of cards) {
    const directory=resolve(routeRoot,card.causebase_id); await mkdir(directory,{recursive:true});
    await writeFile(resolve(directory,"index.html"),cardHtml(card,manifest));
    await writeFile(resolve(dataOutput,"cards",`${card.causebase_id}.md`),cardMarkdown(card,manifest));
  }
  const urls=[`${siteBase}/`, ...cards.map(card => `${siteBase}/charity/${encodeURIComponent(card.causebase_id)}/`)];
  await writeFile(resolve(output,"sitemap.xml"),`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map(url => `<url><loc>${url}</loc></url>`).join("")}</urlset>\n`);
  await writeFile(resolve(output,"current-release.json"),JSON.stringify({dataset_version:manifest.dataset_version,contract_version:manifest.contract_version,manifest_url:`${siteBase}/public/data/manifest.json`,release_url:`${siteBase}/current-release.json`},null,2)+"\n");
}
const viewerCommit = process.env.GITHUB_SHA ?? execFileSync("git", ["rev-parse", "HEAD"], { cwd: root, encoding: "utf8" }).trim();
await writeFile(resolve(output, "deployment.json"), JSON.stringify({
  deployment_type: "CauseBase human-test",
  source_branch: "main",
  deployment_branch: "gh-pages",
  dataset_version: manifest.dataset_version,
  viewer_commit: viewerCommit,
  correction_intake: "private Google Forms intake configured with card-context prefill",
}, null, 2) + "\n");

const walk = async directory => {
  const { readdir } = await import("node:fs/promises");
  const entries = await readdir(directory, { withFileTypes: true });
  return (await Promise.all(entries.map(async entry => {
    const child = resolve(directory, entry.name);
    return entry.isDirectory() ? walk(child) : [child];
  }))).flat();
};
for (const file of await walk(output)) {
  if (forbidden.test(file.slice(output.length + 1))) {
    throw new Error(`Refusing deployment: forbidden static artefact ${file}`);
  }
}

console.log(`Prepared validated human-test bundle: ${manifest.entity_count} cards, ${manifest.dataset_version}.`);

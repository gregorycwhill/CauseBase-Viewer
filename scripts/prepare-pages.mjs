import { cp, mkdir, readFile, rm, stat } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const output = resolve(root, "dist");
const data = resolve(root, "public", "data");
const required = [
  "causebase.json", "causebase.jsonl", "causebase.csv", "causebase.parquet",
  "embeddings.json", "embeddings.parquet", "similarities.json", "similarities.parquet",
  "manifest.json", "coverage.json", "agent-guide.md", "schema/card.schema.json",
  "taxonomy/causebase-v0.json",
];
const forbidden = /(^|[/\\])(archive|cache|runtime|state)([/\\]|$)|\.(pdf|warc|env|sqlite|db)$/i;

const manifest = JSON.parse(await readFile(resolve(data, "manifest.json"), "utf8"));
if (manifest.validation?.status !== "passed" || manifest.entity_count < 100) {
  throw new Error("Refusing deployment: public/data is not a validated Phase 2A candidate.");
}
for (const relative of required) {
  await stat(resolve(data, relative));
}

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
for (const file of ["index.html", "styles.css", "correction.html", "robots.txt", ".nojekyll"]) {
  await cp(resolve(root, file), resolve(output, file));
}
await cp(resolve(root, "src"), resolve(output, "src"), { recursive: true });
await cp(resolve(root, "public"), resolve(output, "public"), { recursive: true });

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

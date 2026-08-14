import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { execFileSync } from "node:child_process";

const root = resolve(import.meta.dirname, "..");
const releaseDirectory = process.env.CAUSEBASE_DATA_RELEASE_DIR;

if (!releaseDirectory) {
  throw new Error(
    "CAUSEBASE_DATA_RELEASE_DIR is required; choose one immutable CauseBase Data release explicitly."
  );
}

const data = resolve(releaseDirectory);
const manifest = JSON.parse(await readFile(resolve(data, "manifest.json"), "utf8"));
if (!manifest.dataset_version || manifest.validation?.status !== "passed") {
  throw new Error("Refusing incomplete or unvalidated CauseBase Data release.");
}

execFileSync(process.execPath, [resolve(root, "scripts", "prepare-pages.mjs")], {
  cwd: root,
  env: {
    ...process.env,
    CAUSEBASE_DATA_DIR: data,
    CAUSEBASE_OUTPUT_DIR: process.env.CAUSEBASE_OUTPUT_DIR ?? resolve(root, "dist"),
  },
  stdio: "inherit",
});

console.log(`Prepared Viewer bundle from explicit CauseBase Data release: ${manifest.dataset_version}.`);

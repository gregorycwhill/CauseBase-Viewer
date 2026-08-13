import { createServer } from "node:http";
import { access, readFile } from "node:fs/promises";
import { constants } from "node:fs";
import { resolve, sep } from "node:path";

const root = resolve(process.env.CAUSEBASE_OUTPUT_DIR ?? resolve(import.meta.dirname, "..", "dist"));
const cards = JSON.parse(await readFile(resolve(root, "public/data/causebase.json"), "utf8")).entities;
const hrefs = [...new Set(cards.flatMap(card => (card.source_native_records ?? []).map(record => `/public/data/source-records/${encodeURIComponent(encodeURIComponent(record.source_record_id))}.json`)))];
const viewer = new URL("https://gregorycwhill.github.io/CauseBase-Viewer/");
const invalidActionUrls = cards.flatMap(card => (card.participation_observations ?? []).flatMap(item => {
  if (!item.action_url) return [];
  try {
    const url = new URL(item.action_url);
    return /^https?:$/.test(url.protocol) && url.hostname && !(url.origin === viewer.origin && url.pathname.startsWith(viewer.pathname)) ? [] : [`${card.causebase_id}: ${item.action_url}`];
  } catch { return [`${card.causebase_id}: ${item.action_url}`]; }
}));
if (invalidActionUrls.length) throw new Error(`Invalid participation action URLs (${invalidActionUrls.length}): ${invalidActionUrls.join(", ")}`);
const server = createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url, "http://localhost").pathname);
    const file = resolve(root, `.${pathname}`);
    if (!file.startsWith(root + sep)) throw new Error("outside bundle");
    await access(file, constants.R_OK); response.writeHead(200).end();
  } catch { response.writeHead(404).end(); }
});
await new Promise((resolveServer, rejectServer) => { server.once("error", rejectServer); server.listen(0, "127.0.0.1", resolveServer); });
const { port } = server.address();
const results = [];
for (const href of hrefs) results.push({ href, status: (await fetch(`http://127.0.0.1:${port}${href}`)).status });
await new Promise(resolveServer => server.close(resolveServer));
const missing = results.filter(result => result.status !== 200);
if (missing.length) throw new Error(`Source-native 404s (${missing.length}): ${missing.map(item => item.href).join(", ")}`);
console.log(`Source-native static HTTP check passed: ${results.length} rendered hrefs returned 200; ${cards.flatMap(card => card.participation_observations ?? []).filter(item => item.action_url).length} participation action URLs are absolute external destinations.`);

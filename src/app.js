import { filterEntities } from "./search.mjs";
import { financialMetricDisplay, fundraisingDisplay, taxonomyHeading } from "./presentation.mjs";
import { correctionUrl } from "./corrections.mjs";

const state = {
  entities: [],
  similarities: [],
  semanticAvailable: false,
  filtered: [],
  selectedId: null,
};

const els = {
  search: document.querySelector("#search"),
  results: document.querySelector("#results"),
  count: document.querySelector("#result-count"),
  card: document.querySelector("#card"),
  feedback: document.querySelector("#feedback-link"),
};

async function loadJson(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}: ${url}`);
  return response.json();
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function externalIdentifiers(entity) {
  return (entity.external_identifiers ?? [])
    .map(identifier => `${identifier.scheme.toUpperCase()} ${identifier.value}`)
    .join(" · ");
}

function renderResults() {
  els.results.innerHTML = "";
  els.count.textContent = `${state.filtered.length} organisations`;

  for (const entity of state.filtered) {
    const button = document.createElement("button");
    button.className = "result";
    if (entity.causebase_id === state.selectedId) button.classList.add("selected");
    button.innerHTML = `
      <strong>${escapeHtml(entity.display_name)}</strong>
      <span>${escapeHtml(entity.geography?.[0] ?? "")}</span>
      <small>${escapeHtml(externalIdentifiers(entity))}</small>
    `;
    button.addEventListener("click", () => selectEntity(entity.causebase_id));
    els.results.appendChild(button);
  }
}

function classificationsByTaxonomy(entity) {
  const map = new Map();
  for (const item of entity.classifications ?? []) {
    if (!map.has(item.taxonomy_id)) map.set(item.taxonomy_id, []);
    map.get(item.taxonomy_id).push(item);
  }
  return map;
}

function semanticNeighbours(entityId) {
  const byId = new Map(state.entities.map(e => [e.causebase_id, e]));
  return state.similarities
    .filter(row => row.causebase_id === entityId)
    .sort((a, b) => a.rank - b.rank)
    .map(row => ({ ...row, entity: byId.get(row.similar_causebase_id) }))
    .filter(row => row.entity);
}

function renderCard(entity) {
  const fr = entity.fundraising_expenditure;
  const taxonomyHtml = [...classificationsByTaxonomy(entity).entries()]
    .map(([taxonomy, terms]) => `
      <div class="taxonomy-block">
        <h4>${escapeHtml(taxonomyHeading(taxonomy))}</h4>
        <ul>${terms.map(t => `<li>${escapeHtml(t.term_label)} <code>${escapeHtml(t.term_id)}</code></li>`).join("")}</ul>
      </div>
    `).join("");

  const evidenceHtml = (entity.evidence ?? []).map(e => `
    <li>
      <strong>${escapeHtml(e.title)}</strong>
      <span>${escapeHtml(e.source_type)} · observed ${escapeHtml(e.observed_at)}${e.page ? ` · p. ${e.page}` : ""}</span>
      ${e.url ? `<a href="${escapeHtml(e.url)}" target="_blank" rel="noreferrer">source</a>` : ""}
    </li>
  `).join("");

  const neighboursHtml = semanticNeighbours(entity.causebase_id).map(row => `
    <li>
      <button class="link-button" data-entity="${escapeHtml(row.entity.causebase_id)}">
        ${escapeHtml(row.entity.display_name)}
      </button>
      <span>semantic score ${row.score.toFixed(3)}</span>
    </li>
  `).join("");

  els.card.innerHTML = `
    <header class="card-header">
      <div>
        <p class="eyebrow">CauseBase Card</p>
        <h1>${escapeHtml(entity.display_name)}</h1>
        <p>${escapeHtml(entity.legal_name)} · ${escapeHtml(externalIdentifiers(entity))}</p>
      </div>
    </header>

    <section>
      <div class="section-title">
        <h2>CauseBase summary</h2>
        <a class="edit-link" href="${correctionUrl(entity, "causebase_summary", entity.causebase_summary, location.href)}">Suggest correction</a>
      </div>
      <p class="summary">${escapeHtml(entity.causebase_summary)}</p>
    </section>

    ${entity.organisation_self_description ? `
    <section>
      <h2>Organisation's own description</h2>
      <blockquote>${escapeHtml(entity.organisation_self_description)}</blockquote>
    </section>` : ""}

    <section class="columns">
      <div>
        <h2>Activities</h2>
        <ul>${(entity.activities ?? []).map(x => `<li>${escapeHtml(x)}</li>`).join("")}</ul>
      </div>
      <div>
        <h2>Beneficiaries</h2>
        <ul>${(entity.beneficiaries ?? []).map(x => `<li>${escapeHtml(x)}</li>`).join("")}</ul>
      </div>
      <div>
        <h2>Participation</h2>
        <ul>${(entity.participation_modes ?? []).map(x => `<li>${escapeHtml(x)}</li>`).join("")}</ul>
      </div>
    </section>

    <section>
      <h2>Financials</h2>
      <dl class="facts">
        <div><dt>Revenue</dt><dd>${escapeHtml(financialMetricDisplay(entity, "revenue"))}</dd></div>
        <div><dt>Total expenses</dt><dd>${escapeHtml(financialMetricDisplay(entity, "total_expenses"))}</dd></div>
        <div><dt>Fundraising expenditure</dt><dd>${escapeHtml(fundraisingDisplay(entity))}</dd></div>
      </dl>
      ${fr ? `<div class="estimate-note">` : `<p class="muted">Not available from selected evidence.</p>`}
      ${fr ? `
        <strong>${escapeHtml(fr.method)}</strong> · ${escapeHtml(fr.confidence)} confidence
        ${fr.rule_id ? ` · rule <code>${escapeHtml(fr.rule_id)}</code>` : ""}
        ${fr.note ? `<p>${escapeHtml(fr.note)}</p>` : ""}
      </div>` : ""}
    </section>

    <section>
      <h2>Coverage and freshness</h2>
      <ul>${(entity.coverage ?? []).map(item => `<li><strong>${escapeHtml(item.capability)}</strong>: ${escapeHtml(item.status)}${item.observed_at ? ` · observed ${escapeHtml(item.observed_at)}` : ""}${item.freshness_note ? ` · ${escapeHtml(item.freshness_note)}` : ""}</li>`).join("") || "<li>None recorded</li>"}</ul>
    </section>

    <section>
      <h2>Classifications</h2>
      ${taxonomyHtml}
    </section>

    <section>
      <h2>Evidence</h2>
      <ul class="evidence-list">${evidenceHtml}</ul>
    </section>

    ${state.semanticAvailable ? `
    <section>
      <h2>Similar organisations</h2>
      <p class="muted">Semantic neighbours are descriptive, not recommendations.</p>
      <ul class="neighbour-list">${neighboursHtml || "<li>None available</li>"}</ul>
    </section>` : ""}

    <footer>
      CauseBase ${escapeHtml(entity.dataset_version)} ·
      card schema ${escapeHtml(entity.card_schema_version)} ·
      editorial policy ${escapeHtml(entity.editorial_policy_version)}
    </footer>
  `;

  els.card.querySelectorAll("[data-entity]").forEach(button => {
    button.addEventListener("click", () => selectEntity(button.dataset.entity));
  });
}

function selectEntity(entityId) {
  const entity = state.entities.find(e => e.causebase_id === entityId);
  if (!entity) return;
  state.selectedId = entityId;
  history.replaceState(null, "", `#${encodeURIComponent(entityId)}`);
  renderResults();
  renderCard(entity);
}

function applySearch() {
  state.filtered = filterEntities(state.entities, els.search.value);
  if (!state.filtered.some(e => e.causebase_id === state.selectedId)) {
    state.selectedId = state.filtered[0]?.causebase_id ?? null;
  }
  renderResults();
  if (state.selectedId) {
    renderCard(state.entities.find(e => e.causebase_id === state.selectedId));
  } else {
    els.card.innerHTML = `<div class="empty"><strong>No organisations match this search in the early test release.</strong><p>This 120-subject test corpus is not the complete national CauseBase corpus. A missing organisation is not evidence that it is unregistered or absent from the national source backbone.</p></div>`;
  }
}

async function init() {
  try {
    const [data, manifest, similarities] = await Promise.all([
      loadJson("./public/data/causebase.json"),
      loadJson("./public/data/manifest.json"),
      loadJson("./public/data/similarities.json").catch(() => []),
    ]);
    state.entities = data.entities;
    state.similarities = similarities;
    state.semanticAvailable = !manifest.embedding?.model_id?.includes("demo");
    state.filtered = state.entities;
    els.feedback.href = correctionUrl(null, "general_feedback", "", location.href);

    const hashId = decodeURIComponent(location.hash.replace(/^#/, ""));
    state.selectedId =
      state.entities.find(e => e.causebase_id === hashId)?.causebase_id ??
      state.entities[0]?.causebase_id ??
      null;

    els.search.addEventListener("input", applySearch);
    renderResults();
    if (state.selectedId) selectEntity(state.selectedId);
  } catch (error) {
    console.error(error);
    els.card.innerHTML = `
      <div class="empty">
        <strong>CauseBase data could not be loaded.</strong>
        <p>${escapeHtml(error.message)}</p>
      </div>`;
  }
}

init();

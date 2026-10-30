import { CASES, FREE_PRESETS, getCase } from "./cases.mjs";
import { FACTOR_KINDS, computeFree, computeStory, createExportPayload, directionText, formatCoordinate, freeDefaults, octant, summariseFree, summariseStory, withoutPushes } from "./model.mjs";
import { PROJECTIONS, renderAssumptions, renderChart, renderLegend, renderTable } from "./chart.mjs";

const $ = (selector) => document.querySelector(selector);
const AXES_ORDER = ["x", "y", "z"];
const AXIS_WORDS = { x: "agency", y: "harm prevention", z: "shared responsibility" };
// Room ids in Morality, Between Us are lowercase words; anything else is ignored.
const ROOM_ID = /^[a-z]{2,20}$/;
const ANIMATION_MS = 600;

const params = new URLSearchParams(globalThis.location?.search ?? "");
let selectedCase = CASES.find((scenario) => scenario.id === params.get("case")) ?? CASES[0];
let selectedProjection = "iso";
let unveiled = 0;
let included = new Set();
let partial = null;
let controls = null;
const fromRoom = params.get("from");
if (fromRoom && ROOM_ID.test(fromRoom)) {
  $("#public-back").setAttribute("href", `../#${fromRoom}`);
  $("#public-back").textContent = "← Back to the room in Morality, Between Us";
}

const caseSelect = $("#case-select");
for (const scenario of CASES) {
  const option = document.createElement("option");
  option.value = scenario.id;
  option.textContent = scenario.title;
  caseSelect.append(option);
}

const reducedMotion = () => Boolean(globalThis.matchMedia?.("(prefers-reduced-motion: reduce)").matches);

function personName(key) {
  return selectedCase.viewpoints[key === "A" ? 0 : 1].name;
}

function storyIncluded() {
  return selectedCase.factors.slice(0, unveiled).filter((factor) => included.has(factor.id)).map((factor) => factor.id);
}

function renderFactorList() {
  $("#factor-list").innerHTML = selectedCase.factors.map((factor, index) => {
    if (index >= unveiled) return `<li class="factor-card hidden-factor"><h3>Factor ${index + 1}</h3><p>Not yet unveiled.</p></li>`;
    const who = Object.keys(factor.moves).map(personName).join(" and ");
    const moves = Object.entries(factor.moves).map(([key, move]) => `${personName(key)}: ${directionText(move)}`).join(" · ");
    return `<li class="factor-card kind-${factor.kind}"><h3>${index + 1}. ${factor.title}</h3><p class="factor-meta">Moves ${who} · the story labels this: ${FACTOR_KINDS[factor.kind]}</p><p>${factor.text}</p><p>${moves}</p><label class="factor-toggle"><input type="checkbox" data-factor="${factor.id}" ${included.has(factor.id) ? "checked" : ""}> Include this factor</label></li>`;
  }).join("");
  $("#unveil-next").textContent = unveiled < selectedCase.factors.length ? `Unveil factor ${unveiled + 1} of ${selectedCase.factors.length}` : "All factors unveiled";
}

function renderOutcome() {
  const outcome = $("#outcome");
  const all = unveiled === selectedCase.factors.length;
  if (!all) { outcome.hidden = true; outcome.innerHTML = ""; return; }
  outcome.hidden = false;
  outcome.innerHTML = included.size === selectedCase.factors.length
    ? `<strong>${selectedCase.outcome.title} (the story's outcome, not computed)</strong>${selectedCase.outcome.text}`
    : "<strong>Some factors are removed</strong>The story's outcome assumed every factor. Compare where they stand now with where they stood with everything included.";
}

function storyStatus(result) {
  const [a, b] = selectedCase.viewpoints;
  if (unveiled === 0) {
    return `Nothing unveiled yet. ${a.name} and ${b.name} start ${formatCoordinate(result.startGap)} apart, in ${octant(selectedCase.A0) === octant(selectedCase.B0) ? "the same octant" : "different octants"}. Unveil the factors to see what moves them.`;
  }
  return summariseStory(selectedCase, result, storyIncluded());
}

function renderFreeControls() {
  selectedCase.viewpoints.forEach((person, index) => {
    $(`#person-${index}-title`).textContent = `${person.label} · ${person.cues.title}`;
    for (const [axisIndex, axis] of AXES_ORDER.entries()) {
      const value = controls.people[index][axisIndex];
      $(`#control-p${index}-${axis}-label`).textContent = `${axis} · ${AXIS_WORDS[axis]} · ${person.cues[axis]}`;
      const input = $(`#control-p${index}-${axis}`);
      input.value = String(value);
      input.setAttribute("aria-label", `${person.name} · ${AXIS_WORDS[axis]} · ${person.cues[axis]} · from minus one to plus one`);
      $(`#control-p${index}-${axis}-value`).textContent = formatCoordinate(value);
    }
  });
  $("#person-card-2").hidden = selectedCase.viewpoints.length < 3;
  const { drift, squeeze } = selectedCase.shared;
  $("#drift-title").textContent = `Global drift · ${drift.title}`;
  $("#drift-text").textContent = drift.text;
  for (const [axisIndex, axis] of AXES_ORDER.entries()) {
    $(`#control-g-${axis}-label`).textContent = `${axis} · ${AXIS_WORDS[axis]} · ${drift[axis]}`;
    $(`#control-g-${axis}`).value = String(controls.g[axisIndex]);
    $(`#control-g-${axis}-value`).textContent = formatCoordinate(controls.g[axisIndex]);
  }
  $("#squeeze-title").textContent = `Squeeze · ${squeeze.title}`;
  $("#squeeze-text").textContent = squeeze.text;
  $("#control-s").value = String(controls.s);
  $("#control-s-value").textContent = formatCoordinate(controls.s);
}

function renderViewpoints() {
  $("#viewpoint-grid").innerHTML = selectedCase.viewpoints.map((person, index) => `
    <article class="viewpoint-card viewpoint-${["a", "b", "c"][index]}">
      <p class="eyebrow">Person ${person.label}</p>
      <h3>${person.name}</h3>
      <p class="viewpoint-role">${person.role}</p>
      <p class="viewpoint-proposal">${person.proposal}</p>
    </article>`).join("");
  $("#case-note").textContent = selectedCase.caseNote;
}

function update() {
  const story = selectedCase.mode === "story";
  $("#story-controls").hidden = !story;
  $("#free-controls").hidden = story;
  $("#case-prompt").textContent = selectedCase.prompt;
  $("#switch-note").textContent = story
    ? "These are the raw circumstances. Each factor is something happening in one person's life, or in both; unveiling it moves them as the story says. Every story here was written so that, with every factor included, the pair meet. Untick a factor to see where their points would be without it; the chart computes positions, not decisions."
    : "Free exploration: move each person with their own influences, move everyone with the global drift, and draw them together with the squeeze.";
  let result;
  if (story) {
    result = computeStory(selectedCase, storyIncluded(), partial);
    renderFactorList();
    renderOutcome();
    $("#live-status").textContent = storyStatus(computeStory(selectedCase, storyIncluded()));
  } else {
    result = computeFree(selectedCase, controls);
    renderFreeControls();
    $("#live-status").textContent = summariseFree(selectedCase, result, controls);
  }
  $("#chart-wrap").innerHTML = renderChart(selectedCase, result, selectedProjection, `${selectedCase.title} at current settings`);
  $("#projection-note").textContent = `${PROJECTIONS[selectedProjection].label} · ${PROJECTIONS[selectedProjection].depth}. Apparent overlap in a 2D view can hide depth; the coordinate table retains all three axes.`;
  $("#coordinate-wrap").innerHTML = renderTable(selectedCase, result);
  $("#assumptions-wrap").innerHTML = renderAssumptions(selectedCase);
  $("#legend-wrap").innerHTML = renderLegend(selectedCase);
  renderViewpoints();
}

function animateFactor(id) {
  const raf = globalThis.requestAnimationFrame;
  if (!raf || reducedMotion()) { update(); return; }
  const begin = globalThis.performance?.now?.() ?? Date.now();
  const frame = (now) => {
    // The first frame timestamp can precede the click time slightly.
    const t = Math.min(1, Math.max(0, (now - begin) / ANIMATION_MS));
    partial = t < 1 ? { id, t } : null;
    update();
    if (t < 1) raf(frame);
  };
  partial = { id, t: 0 };
  update();
  raf(frame);
}

function selectCase(scenario) {
  selectedCase = scenario;
  caseSelect.value = scenario.id;
  unveiled = 0;
  included = new Set();
  partial = null;
  controls = scenario.mode === "free" ? freeDefaults(scenario) : null;
  $("#preset-note").textContent = "";
  update();
}

caseSelect.addEventListener("change", () => selectCase(getCase(caseSelect.value)));

$("#unveil-next").addEventListener("click", () => {
  if (unveiled >= selectedCase.factors.length) return;
  const factor = selectedCase.factors[unveiled];
  unveiled += 1;
  included.add(factor.id);
  animateFactor(factor.id);
});
$("#unveil-all").addEventListener("click", () => {
  unveiled = selectedCase.factors.length;
  included = new Set(selectedCase.factors.map((factor) => factor.id));
  partial = null;
  update();
});
$("#without-pushes").addEventListener("click", () => {
  const keep = new Set(withoutPushes(selectedCase));
  included = new Set([...included].filter((id) => keep.has(id)));
  partial = null;
  update();
});
$("#include-all").addEventListener("click", () => {
  included = new Set(selectedCase.factors.slice(0, unveiled).map((factor) => factor.id));
  partial = null;
  update();
});
$("#unveil-reset").addEventListener("click", () => selectCase(selectedCase));
$("#factor-list").addEventListener("change", (event) => {
  const id = event.target?.dataset?.factor;
  if (!id) return;
  if (event.target.checked) included.add(id); else included.delete(id);
  partial = null;
  update();
});

for (let index = 0; index < 3; index += 1) {
  for (const [axisIndex, axis] of AXES_ORDER.entries()) {
    $(`#control-p${index}-${axis}`).addEventListener("input", (event) => {
      if (!controls || index >= controls.people.length) return;
      controls.people[index][axisIndex] = Number(event.currentTarget.value);
      $("#preset-note").textContent = "";
      update();
    });
  }
}
for (const [axisIndex, axis] of AXES_ORDER.entries()) {
  $(`#control-g-${axis}`).addEventListener("input", (event) => { controls.g[axisIndex] = Number(event.currentTarget.value); $("#preset-note").textContent = ""; update(); });
}
$("#control-s").addEventListener("input", (event) => { controls.s = Number(event.currentTarget.value); $("#preset-note").textContent = ""; update(); });
for (const [id, preset] of Object.entries(FREE_PRESETS)) {
  $(`#free-preset-${id}`).addEventListener("click", () => {
    controls = structuredClone(preset.controls);
    $("#preset-note").textContent = preset.note;
    update();
  });
}
$("#free-reset").addEventListener("click", () => { controls = freeDefaults(selectedCase); $("#preset-note").textContent = ""; update(); });

for (const button of document.querySelectorAll(".projection-button")) {
  button.addEventListener("click", () => {
    selectedProjection = button.dataset.view;
    for (const candidate of document.querySelectorAll(".projection-button")) candidate.setAttribute("aria-pressed", String(candidate === button));
    update();
  });
}

$("#export-json").addEventListener("click", () => {
  const state = selectedCase.mode === "story" ? { unveiled, included: storyIncluded() } : { controls };
  const payload = createExportPayload(selectedCase, state);
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `moral-topology-${selectedCase.id}-${payload.ts_ms}.json`;
  link.click();
  URL.revokeObjectURL(url);
});

selectCase(selectedCase);

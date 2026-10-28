import { CASES, CONTROLS_DEFAULT, PRESETS, getCase } from "./cases.mjs";
import { CONTROL_KEYS, INFLUENCE_KINDS, READINGS, computeEndpoints, createExportPayload, directionText, formatCoordinate, summarise } from "./model.mjs";
import { PROJECTIONS, renderAssumptions, renderChartSvg, renderCoordinateTable, renderLegend } from "./chart.mjs";

const $ = (selector) => document.querySelector(selector);
const controls = { ...CONTROLS_DEFAULT };
const readings = { a: "unset", b: "unset" };
// Room ids in Morality, Between Us are lowercase words; anything else is ignored.
const ROOM_ID = /^[a-z]{2,20}$/;

const params = new URLSearchParams(globalThis.location?.search ?? "");
let selectedCase = CASES.find((scenario) => scenario.id === params.get("case")) ?? CASES[0];
let selectedProjection = "iso";
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
caseSelect.value = selectedCase.id;

function setControls(next, note = "") {
  for (const key of CONTROL_KEYS) controls[key] = next[key];
  $("#preset-note").textContent = note;
  update();
}

function renderInfluences() {
  const { personalA, personalB, reasons, pressure } = selectedCase.influences;
  const [personA, personB] = selectedCase.viewpoints;
  for (const [key, influence, person] of [["a", personalA, personA], ["b", personalB, personB]]) {
    $(`#${key}-legend`).textContent = `${person.label} · ${influence.title}`;
    $(`#${key}-kind`).textContent = `The story labels this: ${INFLUENCE_KINDS[influence.kind]}. You may disagree; your reading does not change the geometry.`;
    $(`#${key}-text`).textContent = `${influence.text} At full strength: ${directionText(influence.direction)}.`;
    $(`#control-${key}-label`).textContent = `Strength · moves ${person.name} only; negative means it backfired`;
    $(`#reading-${key}`).value = readings[key];
  }
  $("#r-title").textContent = reasons.title;
  $("#r-text").textContent = reasons.text;
  $("#p-title").textContent = pressure.title;
  $("#p-text").textContent = pressure.text;
}

function renderViewpoints() {
  $("#viewpoint-grid").innerHTML = selectedCase.viewpoints.map((person, index) => `
    <article class="viewpoint-card ${index === 0 ? "viewpoint-a" : "viewpoint-b"}">
      <p class="eyebrow">Viewpoint ${person.label}</p>
      <h3>${person.name}</h3>
      <p class="viewpoint-role">${person.role}</p>
      <p class="viewpoint-proposal">${person.proposal}</p>
      <p>${person.context}</p>
    </article>`).join("");
  $("#shared-option").innerHTML = `<strong>${selectedCase.sharedOption.title}</strong><p>${selectedCase.sharedOption.text}</p>`;
  $("#case-note").textContent = selectedCase.caseNote;
}

function update() {
  const result = computeEndpoints(selectedCase, controls);
  for (const key of CONTROL_KEYS) {
    const value = controls[key];
    const input = $(`#control-${key}`);
    input.value = String(value);
    input.setAttribute("aria-valuetext", formatCoordinate(value));
    const output = $(`#control-${key}-value`);
    output.value = formatCoordinate(value);
    output.textContent = formatCoordinate(value);
  }
  $("#case-prompt").textContent = selectedCase.prompt;
  renderInfluences();
  $("#chart-wrap").innerHTML = renderChartSvg(selectedCase, result, selectedProjection, `${selectedCase.title} at current settings`);
  $("#projection-note").textContent = `${PROJECTIONS[selectedProjection].label} · ${PROJECTIONS[selectedProjection].depth}. Apparent overlap in a 2D view can hide depth; the coordinate table retains all three axes.`;
  $("#coordinate-wrap").innerHTML = renderCoordinateTable(selectedCase, result);
  $("#assumptions-wrap").innerHTML = renderAssumptions(selectedCase, controls);
  $("#legend-wrap").innerHTML = renderLegend();
  $("#live-status").textContent = summarise(selectedCase, result).text;
  renderViewpoints();
}

caseSelect.addEventListener("change", () => {
  selectedCase = getCase(caseSelect.value);
  readings.a = "unset";
  readings.b = "unset";
  setControls(CONTROLS_DEFAULT);
});

for (const key of CONTROL_KEYS) {
  $(`#control-${key}`).addEventListener("input", (event) => {
    controls[key] = Number(event.currentTarget.value);
    $("#preset-note").textContent = "";
    update();
  });
}

for (const key of ["a", "b"]) {
  $(`#reading-${key}`).addEventListener("change", (event) => {
    const value = event.currentTarget.value;
    readings[key] = READINGS[value] ? value : "unset";
  });
}

for (const button of document.querySelectorAll(".projection-button")) {
  button.addEventListener("click", () => {
    selectedProjection = button.dataset.view;
    for (const candidate of document.querySelectorAll(".projection-button")) {
      candidate.setAttribute("aria-pressed", String(candidate === button));
    }
    update();
  });
}

for (const [id, preset] of Object.entries(PRESETS)) {
  $(`#preset-${id}`).addEventListener("click", () => setControls(preset.controls, preset.note));
}
$("#reset-case").addEventListener("click", () => setControls(CONTROLS_DEFAULT));

$("#export-json").addEventListener("click", () => {
  const payload = createExportPayload(selectedCase, controls, readings);
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `moral-topology-${selectedCase.id}-${payload.ts_ms}.json`;
  link.click();
  URL.revokeObjectURL(url);
});

update();

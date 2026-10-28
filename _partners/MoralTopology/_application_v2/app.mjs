import { CASES, CONTROLS_DEFAULT, EXAMPLE_CONTROLS, getCase } from "./cases.mjs";
import { computeEndpoints, createExportPayload, formatCoordinate, subtractVector } from "./model.mjs";
import { PROJECTIONS, renderAssumptions, renderChartSvg, renderCoordinateTable, renderLegend } from "./chart.mjs";

const $ = (selector) => document.querySelector(selector);
const controls = {
  a: [...CONTROLS_DEFAULT.a],
  b: [...CONTROLS_DEFAULT.b],
  g: [...CONTROLS_DEFAULT.g],
};
const GROUPS = Object.freeze({
  a: { key: "personalA", title: "Personal A", scale: 50, affects: "A only" },
  b: { key: "personalB", title: "Personal B", scale: 50, affects: "B only" },
  g: { key: "shared", title: "Global", scale: 25, affects: "both points equally" },
});
const AXIS_ORDER = Object.freeze(["x", "y", "z"]);
const AXIS_NAMES = Object.freeze({ x: "personal agency", y: "preventing harm", z: "shared responsibility" });

let selectedCase = CASES[0];
let selectedProjection = "iso";

const caseSelect = $("#case-select");
for (const scenario of CASES) {
  const option = document.createElement("option");
  option.value = scenario.id;
  option.textContent = scenario.title;
  caseSelect.append(option);
}

function currentResult() {
  return computeEndpoints(selectedCase, controls);
}

function setControls(next) {
  for (const group of Object.keys(GROUPS)) controls[group] = [...next[group]];
  update();
}

function renderControlCues() {
  for (const [controlKey, config] of Object.entries(GROUPS)) {
    const story = selectedCase.influences[config.key];
    $(`#${controlKey}-title`).textContent = story.title;
    $(`#${controlKey}-explanation`).textContent = controlKey === "g"
      ? `This authored vector applies the same [25gx, 25gy, 25gz] displacement at A and B. It moves their shared context but preserves their complete difference and gap. These are chosen emphasis shifts, not predicted effects of an encounter.`
      : `This authored vector moves ${config.affects} by 50 times each signed component. Positive raises and negative lowers the named relative emphasis; zero leaves it unchanged. These are freely chosen illustration settings, not predicted effects of an encounter.`;
    for (const axis of AXIS_ORDER) {
      $(`#control-${controlKey}-${axis}-label`).textContent = `${axis} · ${AXIS_NAMES[axis]} · ${story.cues[axis]}`;
      $(`#control-${controlKey}-${axis}`).setAttribute("aria-label", `${config.title} · ${axis} · ${AXIS_NAMES[axis]} · ${story.cues[axis]} · signed emphasis control from minus one to plus one`);
    }
  }
}

function updateStatus(result) {
  const status = $("#live-status");
  if (result.gap <= 1e-9) {
    status.textContent = "Same displayed coordinates; policy positions may still differ.";
    return;
  }
  const difference = subtractVector(result.A, result.B);
  const gap = result.gap < 0.000001 ? "<0.000001" : formatCoordinate(result.gap);
  status.textContent = `Current A − B differences: x ${formatCoordinate(difference[0])}, y ${formatCoordinate(difference[1])}, z ${formatCoordinate(difference[2])} signed illustrative units. Coordinate gap: ${gap}.`;
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
  const result = currentResult();
  for (const controlKey of Object.keys(GROUPS)) {
    for (let axisIndex = 0; axisIndex < AXIS_ORDER.length; axisIndex += 1) {
      const axis = AXIS_ORDER[axisIndex];
      const value = controls[controlKey][axisIndex];
      const input = $(`#control-${controlKey}-${axis}`);
      input.value = String(value);
      input.setAttribute("aria-valuetext", formatCoordinate(value));
      const output = $(`#control-${controlKey}-${axis}-value`);
      output.value = formatCoordinate(value);
      output.textContent = formatCoordinate(value);
    }
  }
  $("#case-prompt").textContent = selectedCase.prompt;
  renderControlCues();
  $("#chart-wrap").innerHTML = renderChartSvg(selectedCase, result, selectedProjection, `${selectedCase.title} at current settings`);
  $("#projection-note").textContent = `${PROJECTIONS[selectedProjection].label} · ${PROJECTIONS[selectedProjection].depth}. Apparent overlap in a 2D view can hide depth; the coordinate table retains all three axes.`;
  $("#coordinate-wrap").innerHTML = renderCoordinateTable(selectedCase, result);
  $("#assumptions-wrap").innerHTML = renderAssumptions(selectedCase, controls);
  $("#legend-wrap").innerHTML = renderLegend();
  updateStatus(result);
  renderViewpoints();
}

caseSelect.addEventListener("change", () => {
  selectedCase = getCase(caseSelect.value);
  setControls(CONTROLS_DEFAULT);
});

for (const controlKey of Object.keys(GROUPS)) {
  for (let axisIndex = 0; axisIndex < AXIS_ORDER.length; axisIndex += 1) {
    const axis = AXIS_ORDER[axisIndex];
    $(`#control-${controlKey}-${axis}`).addEventListener("input", (event) => {
      controls[controlKey][axisIndex] = Number(event.currentTarget.value);
      update();
    });
  }
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

$("#show-example").addEventListener("click", () => setControls(EXAMPLE_CONTROLS));
$("#show-meeting").addEventListener("click", () => setControls(selectedCase.witness));
$("#reset-case").addEventListener("click", () => setControls(CONTROLS_DEFAULT));

$("#export-json").addEventListener("click", () => {
  const payload = createExportPayload(selectedCase, controls);
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `moral-topology-${selectedCase.id}-${payload.ts_ms}.json`;
  link.click();
  URL.revokeObjectURL(url);
});

update();

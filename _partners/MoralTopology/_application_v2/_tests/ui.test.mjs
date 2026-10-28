import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { CASES, PRESETS } from "../cases.mjs";

class FakeElement {
  constructor(id = "") {
    this.id = id;
    this.value = "";
    this.textContent = "";
    this.innerHTML = "";
    this.dataset = {};
    this.attributes = {};
    this.options = [];
    this.listeners = new Map();
  }
  addEventListener(type, callback) {
    if (!this.listeners.has(type)) this.listeners.set(type, []);
    this.listeners.get(type).push(callback);
  }
  dispatch(type, extra = {}) {
    for (const callback of this.listeners.get(type) || []) callback({ currentTarget: this, target: this, ...extra });
  }
  append(element) {
    this.options.push(element);
    if (this.id === "case-select" && this.value === "") this.value = element.value;
  }
  setAttribute(name, value) { this.attributes[name] = String(value); }
  click() { this.dispatch("click"); }
}

async function installDocument(search = "") {
  globalThis.location = { search };
  const source = await readFile(fileURLToPath(new URL("../index.html", import.meta.url)), "utf8");
  const ids = [...source.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
  const elements = new Map(ids.map((id) => [id, new FakeElement(id)]));
  for (const key of ["a", "b", "r", "p"]) elements.get(`control-${key}`).value = "0";
  const projections = ["iso", "xy", "xz", "yz"].map((view) => {
    const button = new FakeElement(`projection-${view}`);
    button.dataset.view = view;
    return button;
  });
  globalThis.document = {
    querySelector(selector) {
      const id = selector.startsWith("#") ? selector.slice(1) : selector;
      const element = elements.get(id);
      if (!element) throw new Error(`Test DOM does not define ${selector}`);
      return element;
    },
    querySelectorAll(selector) {
      if (selector === ".projection-button") return projections;
      throw new Error(`Test DOM does not define ${selector}`);
    },
    createElement: (tagName) => {
      const element = new FakeElement(tagName);
      element.tagName = tagName;
      return element;
    },
  };
  return { elements, projections, source };
}

const controlKeys = ["a", "b", "r", "p"].map((key) => `control-${key}`);

test("the browser UI exposes four native sliders with their stated ranges, case text and a fixed chart", async () => {
  const { elements, source } = await installDocument();
  await import(`../app.mjs?ui-test=${Date.now()}`);
  for (const id of controlKeys) assert.equal(elements.get(id).value, "0");
  assert.equal((source.match(/type="range"/g) || []).length, 4);
  assert.equal((source.match(/min="-1" max="1" step="0\.01"/g) || []).length, 2);
  assert.match(source, /id="control-r" name="r" type="range" min="0" max="1"/);
  assert.match(source, /id="control-p" name="p" type="range" min="-0\.5" max="1"/);
  assert.equal(elements.get("case-select").value, "town");
  assert.equal(elements.get("a-legend").textContent, `A · ${CASES[0].influences.personalA.title}`);
  assert.equal(elements.get("p-title").textContent, CASES[0].influences.pressure.title);
  assert.match(elements.get("a-kind").textContent, /carries reasons and pushes/);
  assert.match(elements.get("chart-wrap").innerHTML, /viewBox="0 0 720 520"/);
  assert.match(elements.get("coordinate-wrap").innerHTML, /A − B/);
  assert.match(elements.get("legend-wrap").innerHTML, /Shared pressure · towards N/);
  assert.match(elements.get("live-status").textContent, /Nothing has narrowed the gap yet/);
});

test("presets set all four controls and explain themselves; the two meetings land in different places", async () => {
  const { elements } = await installDocument();
  await import(`../app.mjs?ui-preset-test=${Date.now()}`);
  elements.get("preset-reasons").click();
  for (const [key, value] of Object.entries(PRESETS.reasons.controls)) assert.equal(elements.get(`control-${key}`).value, String(value));
  assert.match(elements.get("live-status").textContent, /meet/);
  assert.match(elements.get("live-status").textContent, /0 from the shared option/);
  assert.equal(elements.get("preset-note").textContent, PRESETS.reasons.note);
  elements.get("preset-pressure").click();
  assert.match(elements.get("live-status").textContent, /0 from Pat's starting position/);
  assert.match(elements.get("live-status").textContent, /Sam does all the moving/);
  elements.get("preset-backlash").click();
  assert.match(elements.get("live-status").textContent, /Backlash/);
  elements.get("reset-case").click();
  for (const id of controlKeys) assert.equal(elements.get(id).value, "0");
  assert.equal(elements.get("preset-note").textContent, "");
});

test("moving a slider updates the geometry while viewpoint cards stay as authored", async () => {
  const { elements, projections } = await installDocument();
  await import(`../app.mjs?ui-components-test=${Date.now()}`);
  const originalCards = elements.get("viewpoint-grid").innerHTML;
  const input = elements.get("control-r");
  input.value = "0.5";
  input.dispatch("input");
  assert.equal(elements.get("control-r-value").textContent, "0.5");
  assert.match(elements.get("coordinate-wrap").innerHTML, /× 0\.5 \(shared reasons\)/);
  assert.equal(elements.get("viewpoint-grid").innerHTML, originalCards);
  for (const { proposal } of CASES[0].viewpoints) assert.ok(originalCards.includes(proposal));
  projections[1].click();
  assert.equal(projections[1].attributes["aria-pressed"], "true");
  assert.match(elements.get("projection-note").textContent, /z depth omitted/);
});

test("deep links open a named case and point the back link at the room it came from; bad values are ignored", async () => {
  const { elements } = await installDocument("?case=punishment&from=places");
  await import(`../app.mjs?ui-deeplink-test=${Date.now()}`);
  assert.equal(elements.get("case-select").value, "punishment");
  assert.equal(elements.get("case-prompt").textContent, CASES.find((c) => c.id === "punishment").prompt);
  assert.equal(elements.get("public-back").attributes.href, "../#places");
  const bad = await installDocument("?case=nope&from=%22%3E%3Cscript%3E");
  await import(`../app.mjs?ui-deeplink-bad-test=${Date.now()}`);
  assert.equal(bad.elements.get("case-select").value, "town");
  assert.equal(bad.elements.get("public-back").attributes.href, undefined);
});

test("visitor readings are recorded, reset with the case, and do not move the points", async () => {
  const { elements } = await installDocument();
  await import(`../app.mjs?ui-reading-test=${Date.now()}`);
  const before = elements.get("coordinate-wrap").innerHTML;
  const reading = elements.get("reading-a");
  reading.value = "pushes";
  reading.dispatch("change");
  elements.get("control-b").value = "0";
  elements.get("control-b").dispatch("input");
  assert.equal(elements.get("reading-a").value, "pushes");
  assert.equal(elements.get("coordinate-wrap").innerHTML, before);
  const select = elements.get("case-select");
  select.value = "privacy";
  select.dispatch("change");
  assert.equal(elements.get("reading-a").value, "unset");
});

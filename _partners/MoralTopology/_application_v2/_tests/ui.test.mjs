import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { CASES, EXAMPLE_CONTROLS } from "../cases.mjs";

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

async function installDocument() {
  const source = await readFile(fileURLToPath(new URL("../index.html", import.meta.url)), "utf8");
  const ids = [...source.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
  const elements = new Map(ids.map((id) => [id, new FakeElement(id)]));
  for (const group of ["a", "b", "g"]) {
    for (const axis of ["x", "y", "z"]) elements.get(`control-${group}-${axis}`).value = "0";
  }
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

const controlKeys = ["a", "b", "g"].flatMap((group) => ["x", "y", "z"].map((axis) => `control-${group}-${axis}`));

test("the browser UI exposes nine signed native sliders, case cues, and fixed chart coordinates", async () => {
  const { elements, source } = await installDocument();
  await import(`../app.mjs?ui-test=${Date.now()}`);
  assert.equal(controlKeys.length, 9);
  for (const id of controlKeys) assert.equal(elements.get(id).value, "0");
  assert.equal(elements.get("a-title").textContent, CASES[0].influences.personalA.title);
  assert.equal(elements.get("control-a-x-label").textContent, `x · personal agency · ${CASES[0].influences.personalA.cues.x}`);
  assert.equal(elements.get("control-g-y-label").textContent, `y · preventing harm · ${CASES[0].influences.shared.cues.y}`);
  assert.equal((source.match(/type="range"/g) || []).length, 9);
  assert.equal((source.match(/min="-1" max="1" step="0\.01"/g) || []).length, 9);
  assert.match(elements.get("chart-wrap").innerHTML, /viewBox="0 0 720 520"/);
  assert.match(elements.get("coordinate-wrap").innerHTML, /A − B/);
  assert.match(elements.get("legend-wrap").innerHTML, /same xyz displacement at A and B/);
});

test("constructed-meeting and example presets update all nine controls, and case changes reset", async () => {
  const { elements } = await installDocument();
  await import(`../app.mjs?ui-preset-test=${Date.now()}`);
  elements.get("show-meeting").click();
  const witness = CASES[0].witness;
  for (const [group, vector] of Object.entries(witness)) {
    for (let i = 0; i < 3; i += 1) assert.equal(elements.get(`control-${group}-${["x", "y", "z"][i]}`).value, String(vector[i]));
  }
  assert.match(elements.get("live-status").textContent, /Same displayed coordinates/);

  elements.get("show-example").click();
  for (const group of ["a", "b", "g"]) {
    for (const [index, axis] of ["x", "y", "z"].entries()) {
      assert.equal(elements.get(`control-${group}-${axis}`).value, String(EXAMPLE_CONTROLS[group][index]));
    }
  }
  assert.doesNotMatch(elements.get("live-status").textContent, /Same displayed coordinates/);
  assert.equal((elements.get("chart-wrap").innerHTML.match(/<line class="vector /g) || []).length, 4);

  const select = elements.get("case-select");
  select.value = "punishment";
  select.dispatch("change");
  for (const id of controlKeys) assert.equal(elements.get(id).value, "0");
  assert.equal(elements.get("case-prompt").textContent, CASES[1].prompt);
  assert.equal(elements.get("b-title").textContent, CASES[1].influences.personalB.title);
});

test("manual component movement updates geometry while policy cards stay as authored context", async () => {
  const { elements, projections } = await installDocument();
  await import(`../app.mjs?ui-components-test=${Date.now()}`);
  const startingViewpoints = CASES[0].viewpoints.map(({ proposal }) => proposal);
  const originalCards = elements.get("viewpoint-grid").innerHTML;
  const input = elements.get("control-a-x");
  input.value = "0.25";
  input.dispatch("input");
  assert.equal(elements.get("control-a-x-value").textContent, "0.25");
  assert.match(elements.get("coordinate-wrap").innerHTML, /-47\.5/);
  assert.equal(elements.get("viewpoint-grid").innerHTML, originalCards);
  for (const proposal of startingViewpoints) assert.ok(originalCards.includes(proposal));

  projections[1].click();
  assert.equal(projections[1].attributes["aria-pressed"], "true");
  assert.match(elements.get("projection-note").textContent, /z depth omitted/);
});

test("the UI does not call a tiny rounded positive gap a meeting", async () => {
  const { elements } = await installDocument();
  await import(`../app.mjs?ui-tiny-gap-test=${Date.now()}`);
  elements.get("show-meeting").click();
  elements.get("control-a-x").value = "0.800000001";
  elements.get("control-a-x").dispatch("input");
  assert.doesNotMatch(elements.get("live-status").textContent, /Same displayed coordinates/);
  assert.match(elements.get("live-status").textContent, /x 5\.00e-8/);
});

import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { CASES, FREE_PRESETS } from "../cases.mjs";

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
  for (const id of ids.filter((name) => name.startsWith("control-") && !name.endsWith("-label") && !name.endsWith("-value"))) elements.get(id).value = "0";
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

const town = CASES[0];
const free = CASES.find((c) => c.mode === "free");
const unveilAll = (elements) => { for (let i = 0; i < town.factors.length; i += 1) elements.get("unveil-next").click(); };

test("the page has thirteen native sliders for the free case and opens on the town story with nothing unveiled", async () => {
  const { elements, source } = await installDocument();
  await import(`../app.mjs?ui-test=${Date.now()}`);
  assert.equal((source.match(/type="range"/g) || []).length, 13);
  assert.equal(elements.get("case-select").value, "town");
  assert.equal(elements.get("story-controls").hidden, false);
  assert.equal(elements.get("free-controls").hidden, true);
  assert.match(elements.get("live-status").textContent, /^Nothing unveiled yet/);
  assert.equal((elements.get("factor-list").innerHTML.match(/Not yet unveiled/g) || []).length, town.factors.length);
  assert.equal(elements.get("outcome").hidden, true);
  assert.match(elements.get("chart-wrap").innerHTML, /viewBox="0 0 720 520"/);
});

test("unveiling factors moves the people automatically, then reveals the story's outcome", async () => {
  const { elements } = await installDocument();
  await import(`../app.mjs?ui-unveil-test=${Date.now()}`);
  elements.get("unveil-next").click();
  assert.match(elements.get("factor-list").innerHTML, new RegExp(town.factors[0].title));
  assert.match(elements.get("factor-list").innerHTML, /the story labels this: only pushes/);
  assert.equal(elements.get("outcome").hidden, true);
  for (let i = 1; i < town.factors.length; i += 1) elements.get("unveil-next").click();
  assert.match(elements.get("live-status").textContent, /land on the same point/);
  assert.match(elements.get("live-status").textContent, /a different one from now/);
  assert.match(elements.get("outcome").innerHTML, /not computed/);
  assert.equal(elements.get("outcome").hidden, false);
  assert.match(elements.get("outcome").innerHTML, new RegExp(town.outcome.title));
  assert.equal(elements.get("unveil-next").textContent, "All factors unveiled");
});

test("removing the factors that only push, or unticking one factor, moves the people back and withdraws the outcome", async () => {
  const { elements } = await installDocument();
  await import(`../app.mjs?ui-toggle-test=${Date.now()}`);
  unveilAll(elements);
  elements.get("without-pushes").click();
  assert.match(elements.get("live-status").textContent, /11\.66 apart/);
  assert.match(elements.get("outcome").innerHTML, /Some factors are removed/);
  elements.get("include-all").click();
  assert.match(elements.get("live-status").textContent, /same point/);
  elements.get("factor-list").dispatch("change", { target: { dataset: { factor: "families" }, checked: false } });
  assert.doesNotMatch(elements.get("live-status").textContent, /same point/);
  assert.doesNotMatch(elements.get("factor-list").innerHTML, /data-factor="families" checked/);
  elements.get("unveil-reset").click();
  assert.match(elements.get("live-status").textContent, /^Nothing unveiled yet/);
});

test("the free three-person case opens by deep link, labels each slider with a real influence, and responds to presets and sliders", async () => {
  const { elements } = await installDocument("?case=assisted-dying&from=access");
  await import(`../app.mjs?ui-free-test=${Date.now()}`);
  assert.equal(elements.get("public-back").attributes.href, "../#access");
  assert.equal(elements.get("free-controls").hidden, false);
  assert.equal(elements.get("story-controls").hidden, true);
  assert.equal(elements.get("person-card-2").hidden, false);
  assert.equal(elements.get("control-p2-y-label").textContent, `y · harm prevention · ${free.viewpoints[2].cues.y}`);
  assert.equal(elements.get("control-g-x-label").textContent, `x · agency · ${free.shared.drift.x}`);
  elements.get("free-preset-squeeze").click();
  assert.equal(elements.get("control-s").value, String(FREE_PRESETS.squeeze.controls.s));
  assert.match(elements.get("live-status").textContent, /multiplies every distance by 0\.1/);
  const input = elements.get("control-p1-x");
  input.value = "0.5";
  input.dispatch("input");
  assert.equal(elements.get("control-p1-x-value").textContent, "0.5");
  assert.equal(elements.get("preset-note").textContent, "");
  assert.match(elements.get("coordinate-wrap").innerHTML, /Ada after own influences/);
});

test("bad deep-link values are ignored, and switching cases resets the story", async () => {
  const { elements } = await installDocument("?case=nope&from=%22%3E%3Cscript%3E");
  await import(`../app.mjs?ui-bad-test=${Date.now()}`);
  assert.equal(elements.get("case-select").value, "town");
  assert.equal(elements.get("public-back").attributes.href, undefined);
  unveilAll(elements);
  const select = elements.get("case-select");
  select.value = "abortion";
  select.dispatch("change");
  assert.match(elements.get("live-status").textContent, /^Nothing unveiled yet. Mara and Daniel/);
});

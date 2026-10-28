export const MODEL_VERSION = "2.2.0";

export const AXES = Object.freeze({
  x: Object.freeze({ key: "x", label: "Personal agency", meaning: "Relative weight given to the directly affected person's control over their own life and choices.", min: -150, max: 150 }),
  y: Object.freeze({ key: "y", label: "Preventing harm", meaning: "Relative weight given to avoiding serious burdens or harms to affected people.", min: -150, max: 150 }),
  z: Object.freeze({ key: "z", label: "Shared responsibility", meaning: "Relative weight given to obligations and practical responsibilities extending beyond the immediate individual or pair.", min: -150, max: 150 }),
});
const AXIS_KEYS = ["x", "y", "z"];

// Story cases: each person is moved by three real-life factors, each an authored 3D displacement.
// Factors are labelled by the story; the visitor does not decide what kind an influence is.
export const FACTOR_KINDS = Object.freeze({
  reasons: "carries reasons",
  pushes: "only pushes",
  both: "carries reasons and pushes",
});
export const FACTORS_PER_PERSON = 3;
// Thresholds the authored story cases must meet, checked by validateScenario.
export const STORY_RULES = Object.freeze({ maxFinalGap: 25, minMovement: 80 });

// Free case: three signed sliders per person, a three-component global drift added equally to everyone,
// and a squeeze that pulls everyone towards their centroid.
export const FREE_SCALES = Object.freeze({ personal: 50, drift: 25 });
export const FREE_RANGES = Object.freeze({ component: Object.freeze({ min: -1, max: 1, step: 0.01 }), squeeze: Object.freeze({ min: 0, max: 1, step: 0.01 }) });
export const MEETING_TOLERANCE = 1e-9;

function assertVector(vector, label) {
  if (!Array.isArray(vector) || vector.length !== 3 || Array.from(vector).some((value) => !Number.isFinite(value))) {
    throw new TypeError(`${label} must be a finite three-coordinate vector.`);
  }
}

function onChart(point) {
  return point.every((value, index) => value >= AXES[AXIS_KEYS[index]].min && value <= AXES[AXIS_KEYS[index]].max);
}

function assertOnChart(point, label) {
  if (!onChart(point)) throw new RangeError(`${label} lies outside the fixed chart axes [-150, 150].`);
}

export function addVector(left, right) {
  assertVector(left, "Left operand");
  assertVector(right, "Right operand");
  return left.map((value, index) => value + right[index]);
}

export function subtractVector(left, right) {
  assertVector(left, "Left operand");
  assertVector(right, "Right operand");
  return left.map((value, index) => value - right[index]);
}

export function scaleVector(vector, factor) {
  assertVector(vector, "Vector");
  return vector.map((value) => value * factor);
}

export function distance(left, right) {
  return Math.hypot(...subtractVector(left, right));
}

export function magnitude(vector) {
  return Math.hypot(...vector);
}

// The octant is the sign pattern of the three coordinates. A coordinate of exactly zero lies on a
// boundary, so a point with a zero coordinate is in no octant.
export function octant(point) {
  if (point.some((value) => value === 0)) return null;
  return point.map((value) => (value > 0 ? "+" : "−")).join("");
}

export function sameOctant(left, right) {
  const a = octant(left);
  return a !== null && a === octant(right);
}

// ---------- Story cases ----------

export function factorsFor(scenario, person) {
  return scenario.factors.filter((factor) => factor.moves[person]);
}

// included: ids of the factors in effect. partial: optionally one factor applied at a fraction, for animation.
export function computeStory(scenario, included = scenario.factors.map((factor) => factor.id), partial = null) {
  if (scenario.mode !== "story") throw new TypeError("computeStory needs a story case.");
  const known = new Set(scenario.factors.map((factor) => factor.id));
  for (const id of included) if (!known.has(id)) throw new RangeError(`Unknown factor: ${id}`);
  if (partial && (!known.has(partial.id) || !(partial.t >= 0 && partial.t <= 1))) throw new RangeError("Partial factor must name a factor and a fraction between 0 and 1.");
  const active = new Set(included);
  const people = {};
  for (const person of ["A", "B"]) {
    const start = scenario[`${person}0`];
    assertVector(start, `${person}0`);
    assertOnChart(start, `${person}0`);
    let point = [...start];
    const steps = [];
    for (const factor of scenario.factors) {
      const move = factor.moves[person];
      if (!move) continue;
      const fraction = partial?.id === factor.id ? partial.t : active.has(factor.id) ? 1 : 0;
      if (fraction === 0) continue;
      const to = addVector(point, scaleVector(move, fraction));
      steps.push({ factorId: factor.id, kind: factor.kind, from: point, to, fraction });
      point = to;
    }
    if (!onChart(point)) throw new RangeError(`${person} endpoint lies outside the fixed chart axes [-150, 150].`);
    const byKind = Object.fromEntries(Object.keys(FACTOR_KINDS).map((kind) => [kind, 0]));
    for (const step of steps) byKind[step.kind] += distance(step.from, step.to);
    const path = Object.values(byKind).reduce((sum, value) => sum + value, 0);
    people[person] = { start: [...start], end: point, steps, path, byKind, net: distance(start, point) };
  }
  return {
    mode: "story",
    A: people.A.end,
    B: people.B.end,
    people,
    startGap: distance(scenario.A0, scenario.B0),
    gap: distance(people.A.end, people.B.end),
    sameOctant: sameOctant(people.A.end, people.B.end),
    octants: { A: octant(people.A.end), B: octant(people.B.end) },
  };
}

export function withoutPushes(scenario) {
  return scenario.factors.filter((factor) => factor.kind !== "pushes").map((factor) => factor.id);
}

const percent = (part, whole) => (whole === 0 ? 0 : Math.round((100 * part) / whole));

export function summariseStory(scenario, result, included) {
  const [personA, personB] = scenario.viewpoints;
  const lines = [];
  lines.push(result.gap <= MEETING_TOLERANCE
    ? `${personA.name} and ${personB.name} now land on the same point.`
    : `${personA.name} and ${personB.name} are ${formatCoordinate(result.gap)} apart (they started ${formatCoordinate(result.startGap)} apart), ${result.sameOctant ? "in the same octant" : "in different octants"}.`);
  for (const [key, person] of [["A", personA], ["B", personB]]) {
    const p = result.people[key];
    if (p.path === 0) continue;
    lines.push(`${person.name} was moved ${formatCoordinate(p.path)} units in all: ${percent(p.byKind.reasons, p.path)}% from factors that carry reasons, ${percent(p.byKind.both, p.path)}% from factors that do both, ${percent(p.byKind.pushes, p.path)}% from factors that only push.`);
  }
  const allIncluded = included.length === scenario.factors.length;
  if (allIncluded && scenario.factors.some((factor) => factor.kind === "pushes")) {
    const without = computeStory(scenario, withoutPushes(scenario));
    const shifted = without.sameOctant && result.sameOctant && without.octants.A !== result.octants.A;
    lines.push(`Without the factors that only push, they would be ${formatCoordinate(without.gap)} apart, ${!without.sameOctant ? "in different octants" : shifted ? "still sharing an octant, but a different one: the pushes changed what they agree on, not whether they agree" : "still in the same octant"}.`);
  }
  return lines.join(" ");
}

// ---------- Free case ----------
// Any number of people (the authored free case has three). Each has three signed sliders; the global
// drift is added equally to everyone; the squeeze pulls everyone towards their centroid, which
// multiplies every pairwise distance by exactly (1 - s).

export function freeStarts(scenario) {
  return scenario.viewpoints.map((person) => person.start);
}

export function freeDefaults(scenario) {
  return { people: scenario.viewpoints.map(() => [0, 0, 0]), g: [0, 0, 0], s: 0 };
}

function assertFreeControls(scenario, controls) {
  if (!controls || typeof controls !== "object" || Array.isArray(controls)) throw new TypeError("Controls must be an object with people, g and s.");
  if (Object.keys(controls).sort().join(",") !== "g,people,s") throw new TypeError("Controls must contain exactly people, g and s.");
  if (!Array.isArray(controls.people) || controls.people.length !== scenario.viewpoints.length) throw new TypeError("There must be one control vector per person.");
  for (const [index, vector] of [...controls.people.entries(), ["g", controls.g]]) {
    assertVector(vector, `Control ${index}`);
    for (const value of vector) if (value < FREE_RANGES.component.min || value > FREE_RANGES.component.max) throw new RangeError("Each component must be between -1 and 1.");
  }
  if (!Number.isFinite(controls.s) || controls.s < FREE_RANGES.squeeze.min || controls.s > FREE_RANGES.squeeze.max) throw new RangeError("Squeeze must be between 0 and 1.");
}

export function pairwise(points) {
  const pairs = [];
  for (let i = 0; i < points.length; i += 1) for (let j = i + 1; j < points.length; j += 1) pairs.push({ i, j, gap: distance(points[i], points[j]) });
  return pairs;
}

export function computeFree(scenario, controls) {
  if (scenario.mode !== "free") throw new TypeError("computeFree needs a free case.");
  assertFreeControls(scenario, controls);
  const starts = freeStarts(scenario);
  starts.forEach((start, index) => { assertVector(start, `Start ${index}`); assertOnChart(start, `Start ${index}`); });
  const afterPersonal = starts.map((start, index) => addVector(start, scaleVector(controls.people[index], FREE_SCALES.personal)));
  const centroid = scaleVector(afterPersonal.reduce((sum, point) => addVector(sum, point), [0, 0, 0]), 1 / afterPersonal.length);
  const afterSqueeze = afterPersonal.map((point) => addVector(centroid, scaleVector(subtractVector(point, centroid), 1 - controls.s)));
  const drift = scaleVector(controls.g, FREE_SCALES.drift);
  const ends = afterSqueeze.map((point) => addVector(point, drift));
  ends.forEach((point, index) => { if (!onChart(point)) throw new RangeError(`Endpoint ${index} lies outside the fixed chart axes [-150, 150].`); });
  const gaps = pairwise(ends);
  const octants = ends.map(octant);
  return {
    mode: "free",
    ends,
    stages: starts.map((start, index) => ({ start: [...start], afterPersonal: afterPersonal[index], afterSqueeze: afterSqueeze[index], end: ends[index] })),
    centroid,
    drift,
    startGaps: pairwise(starts),
    personalGaps: pairwise(afterPersonal),
    gaps,
    spread: Math.max(...gaps.map((pair) => pair.gap)),
    allSameOctant: octants[0] !== null && octants.every((value) => value === octants[0]),
    octants,
  };
}

export function summariseFree(scenario, result, controls) {
  const names = scenario.viewpoints.map((person) => person.name);
  const pairText = result.gaps.map(({ i, j, gap }) => `${names[i]}–${names[j]} ${formatCoordinate(gap)}`).join(", ");
  const lines = [result.spread <= MEETING_TOLERANCE ? "Everyone lands on the same point." : `Distances now: ${pairText}.`];
  lines.push(result.allSameOctant ? "All are in the same octant." : "They are not all in the same octant.");
  if (controls.s > 0) lines.push(`The squeeze multiplies every distance by ${formatCoordinate(1 - controls.s)}.`);
  lines.push("The global drift moves everyone equally, so it can change octants but not distances.");
  return lines.join(" ");
}

// Bounds check: P_k = (1 - s + s/n) P1_k + (s/n) sum of the other P1_j + 25 g. For fixed s every
// coefficient is nonnegative, so each coordinate is largest when every slider on that axis is at +1
// and smallest when all are at -1; and it is linear in s, so s = 0 or 1 suffices. The corners below
// include those cases for every person.
export function freeCorners(scenario) {
  const n = scenario.viewpoints.length;
  const extremes = [FREE_RANGES.component.min, FREE_RANGES.component.max];
  const corners = [];
  for (let mask = 0; mask < 1 << (3 + 3 + 1); mask += 1) {
    const bit = (i) => extremes[(mask >> i) & 1];
    const own = [bit(0), bit(1), bit(2)], g = [bit(3), bit(4), bit(5)], s = (mask >> 6) & 1 ? FREE_RANGES.squeeze.max : FREE_RANGES.squeeze.min;
    for (const othersSign of extremes) {
      for (let person = 0; person < n; person += 1) {
        const people = Array.from({ length: n }, (_, index) => (index === person ? own : [othersSign, othersSign, othersSign]));
        corners.push({ people, g, s });
      }
    }
  }
  return corners;
}

export function subsetsOf(ids) {
  const out = [];
  for (let mask = 0; mask < 1 << ids.length; mask += 1) out.push(ids.filter((_, i) => (mask >> i) & 1));
  return out;
}

// ---------- Validation ----------

export function validateScenario(scenario) {
  if (!scenario || typeof scenario !== "object") throw new TypeError("Scenario must be an object.");
  if (!Array.isArray(scenario.viewpoints)) throw new TypeError("A scenario needs viewpoints.");
  if (scenario.mode === "story") {
    if (scenario.viewpoints.length !== 2) throw new TypeError("A story case has exactly two viewpoints.");
    for (const person of ["A", "B"]) { assertVector(scenario[`${person}0`], `${person}0`); assertOnChart(scenario[`${person}0`], `${person}0`); }
    if (!Array.isArray(scenario.factors)) throw new TypeError("A story case needs factors.");
    for (const factor of scenario.factors) {
      if (!factor.id || !factor.title || !factor.text || !FACTOR_KINDS[factor.kind]) throw new TypeError(`Factor ${factor.id} needs an id, title, text and known kind.`);
      const people = Object.keys(factor.moves || {});
      if (!people.length || people.some((person) => !["A", "B"].includes(person))) throw new TypeError(`Factor ${factor.id} must move A, B or both.`);
      for (const person of people) assertVector(factor.moves[person], `Factor ${factor.id} move for ${person}`);
    }
    for (const person of ["A", "B"]) if (factorsFor(scenario, person).length !== FACTORS_PER_PERSON) throw new RangeError(`${scenario.id}: ${person} must be moved by exactly ${FACTORS_PER_PERSON} factors.`);
    for (const subset of subsetsOf(scenario.factors.map((factor) => factor.id))) computeStory(scenario, subset);
    const all = computeStory(scenario);
    if (all.gap > STORY_RULES.maxFinalGap || !all.sameOctant) throw new RangeError(`${scenario.id}: with every factor the pair must end in the same octant within ${STORY_RULES.maxFinalGap} units.`);
    for (const person of ["A", "B"]) if (all.people[person].net < STORY_RULES.minMovement) throw new RangeError(`${scenario.id}: ${person}'s factors must move them at least ${STORY_RULES.minMovement} units.`);
    if (!scenario.outcome?.title || !scenario.outcome.text) throw new TypeError(`${scenario.id}: a story case needs an outcome.`);
  } else if (scenario.mode === "free") {
    if (scenario.viewpoints.length < 2 || scenario.viewpoints.length > 3) throw new RangeError("A free case has two or three people.");
    for (const person of scenario.viewpoints) if (!person.cues?.title || AXIS_KEYS.some((axis) => !person.cues[axis])) throw new TypeError(`${scenario.id}: ${person.name} needs titled cues for x, y and z.`);
    for (const key of ["drift", "squeeze"]) if (!scenario.shared?.[key]?.title || !scenario.shared[key].text) throw new TypeError(`${scenario.id}: free case needs a ${key} title and text.`);
    if (AXIS_KEYS.some((axis) => !scenario.shared.drift[axis])) throw new TypeError(`${scenario.id}: drift needs cues for x, y and z.`);
    for (const controls of freeCorners(scenario)) computeFree(scenario, controls);
  } else {
    throw new TypeError("Scenario mode must be story or free.");
  }
  return true;
}

const AXIS_WORDS = Object.freeze({ x: "agency", y: "harm prevention", z: "shared responsibility" });

export function directionText(direction) {
  const parts = direction.map((value, index) => (value === 0 ? null : `${value > 0 ? "+" : ""}${formatCoordinate(value)} ${AXIS_WORDS[AXIS_KEYS[index]]}`)).filter(Boolean);
  return parts.length ? parts.join(", ") : "no change";
}

export function formatCoordinate(value) {
  if (Number.isInteger(value)) return String(value);
  const rounded = Number(value.toFixed(2));
  if (rounded !== 0) return String(rounded);
  if (value === 0) return "0";
  return value.toExponential(2);
}

export function createExportPayload(scenario, state, ts_ms = Date.now()) {
  if (!Number.isSafeInteger(ts_ms) || ts_ms < 0) throw new RangeError("ts_ms must be a nonnegative epoch-millisecond integer.");
  const common = {
    format: "moral-topology-local-export",
    version: MODEL_VERSION,
    ts_ms,
    scope: "Illustrative fictional model; authored assumptions do not establish truth, virtue, policy, or personal worth.",
    coordinateReading: "Zero is an authored reference level. Positive and negative values are relative emphasis, not better or worse. Axes are independent, not percentages that sum to 100.",
    axes: Object.fromEntries(Object.entries(AXES).map(([key, axis]) => [key, { label: axis.label, meaning: axis.meaning, min: axis.min, max: axis.max, unit: "signed illustrative units" }])),
  };
  const caseBase = { id: scenario.id, mode: scenario.mode, title: scenario.title, prompt: scenario.prompt, viewpoints: scenario.viewpoints, axisCues: scenario.axisCues, caseNote: scenario.caseNote, caseVersion: scenario.version, ...(scenario.mode === "story" ? { A0: [...scenario.A0], B0: [...scenario.B0] } : {}) };
  if (scenario.mode === "story") {
    const included = [...state.included];
    const result = computeStory(scenario, included);
    return { ...common, formula: { story: "Each person's end point is their start plus the displacement of every included factor that moves them. Factor kinds and displacements are authored." },
      case: { ...caseBase, factors: scenario.factors, outcome: scenario.outcome, unveiled: state.unveiled, included, endpoints: { A: result.A, B: result.B }, coordinateGap: result.gap, sameOctant: result.sameOctant, movementByKind: { A: result.people.A.byKind, B: result.people.B.byKind }, summary: summariseStory(scenario, result, included),
        assumptions: { coordinates: "All people, factors, displacements and labels are authored fictional examples.", factorKindsAreAuthoredAndDisputable: true, meetingDoesNotEstablishPolicyAgreement: true } } };
  }
  const result = computeFree(scenario, state.controls);
  return { ...common, formula: { personal: "P1 = P0 + 50*p for each person (componentwise)", squeeze: "C = centroid of the P1; P2 = C + (1 - s)(P1 - C)", drift: "P = P2 + 25*g for everyone", distances: "every pairwise distance = (1 - s) * its distance after personal influences" },
    case: { ...caseBase, shared: scenario.shared, controls: structuredClone(state.controls), stages: result.stages, endpoints: result.ends, distances: result.gaps, allSameOctant: result.allSameOctant, summary: summariseFree(scenario, result, state.controls),
      assumptions: { coordinates: "All people, cues and coordinates are authored fictional examples.", driftIsIdenticalForEveryone: true, meetingDoesNotEstablishPolicyAgreement: true } } };
}

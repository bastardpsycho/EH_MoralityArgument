export const MODEL_VERSION = "2.1.0";

export const AXES = Object.freeze({
  x: Object.freeze({ key: "x", label: "Personal agency", meaning: "Relative weight given to the directly affected person's control over their own life and choices.", min: -150, max: 150 }),
  y: Object.freeze({ key: "y", label: "Preventing harm", meaning: "Relative weight given to avoiding serious burdens or harms to affected people.", min: -150, max: 150 }),
  z: Object.freeze({ key: "z", label: "Shared responsibility", meaning: "Relative weight given to obligations and practical responsibilities extending beyond the immediate individual or pair.", min: -150, max: 150 }),
});

// Four scalar controls. Personal influences move one person along an authored direction;
// negative values mean the encounter backfired. Shared reasons pull both people towards the
// case's shared option R. Shared pressure pulls both towards the louder side's starting
// position N; below zero it is backlash, pushing both away from N.
export const CONTROL_RANGES = Object.freeze({
  a: Object.freeze({ min: -1, max: 1, step: 0.01 }),
  b: Object.freeze({ min: -1, max: 1, step: 0.01 }),
  r: Object.freeze({ min: 0, max: 1, step: 0.01 }),
  p: Object.freeze({ min: -0.5, max: 1, step: 0.01 }),
});
export const CONTROL_KEYS = Object.freeze(["a", "b", "r", "p"]);
export const INFLUENCE_KINDS = Object.freeze({
  reasons: "carries reasons",
  pushes: "only pushes",
  both: "carries reasons and pushes",
});
export const READINGS = Object.freeze({
  unset: "Not chosen",
  reasons: "It carried reasons",
  pushes: "It only pushed",
  both: "Both",
  unsure: "Not sure",
});
export const MEETING_TOLERANCE = 1e-9;

function assertVector(vector, label) {
  if (!Array.isArray(vector) || vector.length !== 3 || Array.from(vector).some((value) => !Number.isFinite(value))) {
    throw new TypeError(`${label} must be a finite three-coordinate vector.`);
  }
}

function onChart(point) {
  return point.every((value, index) => value >= AXES["xyz"[index]].min && value <= AXES["xyz"[index]].max);
}

function assertPointOnChart(point, label) {
  if (!onChart(point)) throw new RangeError(`${label} lies outside the fixed chart axes [-150, 150].`);
}

function assertControls(controls) {
  if (!controls || typeof controls !== "object" || Array.isArray(controls)) {
    throw new TypeError("Controls must be an object with a, b, r and p values.");
  }
  if (Object.keys(controls).sort().join(",") !== "a,b,p,r") {
    throw new TypeError("Controls must contain exactly a, b, r and p.");
  }
  for (const key of CONTROL_KEYS) {
    const value = controls[key];
    if (!Number.isFinite(value)) throw new TypeError(`Control ${key} must be a finite number.`);
    if (value < CONTROL_RANGES[key].min || value > CONTROL_RANGES[key].max) {
      throw new RangeError(`Control ${key} must be between ${CONTROL_RANGES[key].min} and ${CONTROL_RANGES[key].max}.`);
    }
  }
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

// Scales a point's offset from a centre: factor 1 leaves it, 0 moves it onto the centre,
// above 1 pushes it away. Applied to both people with the same centre and factor, it
// multiplies the distance between them by |factor| exactly.
export function homothety(point, centre, factor) {
  return addVector(centre, scaleVector(subtractVector(point, centre), factor));
}

export function pressureCentre(scenario) {
  if (scenario.influences.pressure.side === "A") return [...scenario.A0];
  if (scenario.influences.pressure.side === "B") return [...scenario.B0];
  throw new TypeError("Pressure side must be A or B.");
}

function stagesFor(start, direction, amount, R, r, N, p) {
  const personal = scaleVector(direction, amount);
  const afterPersonal = addVector(start, personal);
  const afterReasons = homothety(afterPersonal, R, 1 - r);
  const end = homothety(afterReasons, N, 1 - p);
  return { start: [...start], afterPersonal, afterReasons, end, personal };
}

export function computeEndpoints(scenario, controls) {
  if (!scenario || typeof scenario !== "object") throw new TypeError("A scenario is required.");
  assertControls(controls);
  for (const [label, point] of [["A0", scenario.A0], ["B0", scenario.B0], ["R", scenario.R]]) {
    assertVector(point, label);
    assertPointOnChart(point, label);
  }
  assertVector(scenario.influences.personalA.direction, "Personal A direction");
  assertVector(scenario.influences.personalB.direction, "Personal B direction");
  const N = pressureCentre(scenario);
  const { a, b, r, p } = controls;
  const A = stagesFor(scenario.A0, scenario.influences.personalA.direction, a, scenario.R, r, N, p);
  const B = stagesFor(scenario.B0, scenario.influences.personalB.direction, b, scenario.R, r, N, p);
  for (const [label, point] of [["A", A.end], ["B", B.end]]) {
    if (!onChart(point)) throw new RangeError(`${label} endpoint lies outside the fixed chart axes [-150, 150].`);
  }
  const startGap = distance(scenario.A0, scenario.B0);
  const personalGap = distance(A.afterPersonal, B.afterPersonal);
  const meetingPoint = scaleVector(addVector(A.end, B.end), 0.5);
  return {
    A: A.end,
    B: B.end,
    R: [...scenario.R],
    N,
    stages: { A, B },
    arrows: {
      personalA: A.personal,
      reasonsAtA: subtractVector(A.afterReasons, A.afterPersonal),
      pressureAtA: subtractVector(A.end, A.afterReasons),
      personalB: B.personal,
      reasonsAtB: subtractVector(B.afterReasons, B.afterPersonal),
      pressureAtB: subtractVector(B.end, B.afterReasons),
    },
    factors: {
      personal: startGap === 0 ? 1 : personalGap / startGap,
      reasons: 1 - r,
      pressure: Math.abs(1 - p),
    },
    startGap,
    gap: distance(A.end, B.end),
    meetingPoint,
    fromR: distance(meetingPoint, scenario.R),
    fromN: distance(meetingPoint, N),
    moved: { A: distance(A.end, scenario.A0), B: distance(B.end, scenario.B0) },
  };
}

// The endpoint is multilinear in (own personal amount, r, p), so its extremes lie at the
// corners of the control box. Checking those corners checks every setting.
export function cornerControls() {
  const corners = [];
  for (const a of [CONTROL_RANGES.a.min, CONTROL_RANGES.a.max])
    for (const b of [CONTROL_RANGES.b.min, CONTROL_RANGES.b.max])
      for (const r of [CONTROL_RANGES.r.min, CONTROL_RANGES.r.max])
        for (const p of [CONTROL_RANGES.p.min, CONTROL_RANGES.p.max]) corners.push({ a, b, r, p });
  return corners;
}

export function validateScenario(scenario) {
  if (!scenario || typeof scenario !== "object") throw new TypeError("Scenario must be an object.");
  for (const [label, point] of [["A0", scenario.A0], ["B0", scenario.B0], ["R", scenario.R]]) {
    assertVector(point, label);
    assertPointOnChart(point, label);
  }
  if (!scenario.viewpoints || scenario.viewpoints.length !== 2) throw new TypeError("A scenario must contain exactly two viewpoints.");
  for (const key of ["personalA", "personalB"]) {
    const influence = scenario.influences?.[key];
    if (!influence?.title || !influence.text || !INFLUENCE_KINDS[influence.kind]) throw new TypeError(`${key} needs a title, text and a known kind.`);
    assertVector(influence.direction, `${key} direction`);
  }
  for (const key of ["reasons", "pressure"]) {
    if (!scenario.influences?.[key]?.title || !scenario.influences[key].text) throw new TypeError(`${key} needs a title and text.`);
  }
  pressureCentre(scenario);
  for (const controls of cornerControls()) computeEndpoints(scenario, controls);
  return true;
}

const AXIS_WORDS = Object.freeze({ x: "agency", y: "harm prevention", z: "shared responsibility" });

export function directionText(direction) {
  const parts = direction.map((value, index) => value === 0 ? null : `${value > 0 ? "more" : "less"} weight on ${AXIS_WORDS["xyz"[index]]} (${value > 0 ? "+" : ""}${formatCoordinate(value)})`).filter(Boolean);
  return parts.length ? parts.join(", ") : "no change";
}

// What drove the change in the gap, read from the three exact factors. Smaller is stronger.
export function mainDriver(result) {
  const { personal, reasons, pressure } = result.factors;
  if (pressure > 1 + 1e-9) return "backlash";
  const entries = [["personal", personal], ["reasons", reasons], ["pressure", pressure]];
  const narrowing = entries.filter(([, factor]) => factor < 1 - 1e-9);
  if (!narrowing.length) return personal > 1 + 1e-9 ? "personal-widening" : "none";
  narrowing.sort((left, right) => left[1] - right[1]);
  if (narrowing.length > 1 && Math.abs(narrowing[0][1] - narrowing[1][1]) < 0.05) return "mixed";
  return narrowing[0][0];
}

export function summarise(scenario, result) {
  const [nameA, nameB] = scenario.viewpoints.map((person) => person.name);
  const louder = scenario.influences.pressure.side === "A" ? nameA : nameB;
  const quieter = scenario.influences.pressure.side === "A" ? nameB : nameA;
  const met = result.gap <= MEETING_TOLERANCE;
  const sentences = [];
  sentences.push(met
    ? "The two points meet. Matching coordinates are not agreement about what to do."
    : `Gap ${formatCoordinate(result.gap)} (it started at ${formatCoordinate(result.startGap)}).`);
  sentences.push(`Gap multiplied by ${formatCoordinate(result.factors.personal)} from personal influences, ${formatCoordinate(result.factors.reasons)} from shared reasons and ${formatCoordinate(result.factors.pressure)} from shared pressure.`);
  sentences.push(`${nameA} moved ${formatCoordinate(result.moved.A)} units and ${nameB} moved ${formatCoordinate(result.moved.B)}. Their midpoint is ${formatCoordinate(result.fromR)} from the shared option and ${formatCoordinate(result.fromN)} from ${louder}'s starting position.`);
  const driver = mainDriver(result);
  const louderMoved = result.moved[scenario.influences.pressure.side];
  const quieterMoved = result.moved[scenario.influences.pressure.side === "A" ? "B" : "A"];
  const moving = louderMoved === 0 ? `so ${quieter} does all the moving ` : quieterMoved > louderMoved ? `so ${quieter} does most of the moving ` : "";
  const reading = {
    reasons: "In this model the narrowing came mainly from shared reasons, so both people moved towards the shared option.",
    pressure: `In this model the narrowing came mainly from pressure. Pressure pulls towards ${louder}'s position, ${moving}and any meeting lands on ${louder}'s side, not on the shared option.`,
    personal: "In this model the narrowing came mainly from the two personal encounters.",
    mixed: "In this model more than one influence did comparable work.",
    backlash: `Backlash: pressure is pushing both away from ${louder}'s position, which widens the gap.`,
    "personal-widening": "The personal encounters have pushed them further apart.",
    none: "Nothing has narrowed the gap yet.",
  }[driver];
  sentences.push(reading);
  return { met, driver, text: sentences.join(" ") };
}

export function formatCoordinate(value) {
  if (Number.isInteger(value)) return String(value);
  const rounded = Number(value.toFixed(2));
  if (rounded !== 0) return String(rounded);
  if (value === 0) return "0";
  return value.toExponential(2);
}

export function createExportPayload(scenario, controls, readings = {}, ts_ms = Date.now()) {
  if (!Number.isSafeInteger(ts_ms) || ts_ms < 0) throw new RangeError("ts_ms must be a nonnegative epoch-millisecond integer.");
  const result = computeEndpoints(scenario, controls);
  const cleanReadings = Object.fromEntries(["a", "b"].map((key) => [key, READINGS[readings[key]] ? readings[key] : "unset"]));
  return {
    format: "moral-topology-local-export",
    version: MODEL_VERSION,
    ts_ms,
    scope: "Illustrative fictional model; authored assumptions do not establish truth, virtue, policy, or personal worth.",
    coordinateReading: "Zero is an authored reference level. Positive and negative values are relative emphasis, not better or worse. Axes are independent, not percentages that sum to 100.",
    axes: Object.fromEntries(Object.entries(AXES).map(([key, axis]) => [key, { label: axis.label, meaning: axis.meaning, min: axis.min, max: axis.max, unit: "signed illustrative units" }])),
    controlRanges: structuredClone(CONTROL_RANGES),
    formula: {
      personal: "A1 = A0 + a*dA; B1 = B0 + b*dB",
      reasons: "A2 = R + (1 - r)(A1 - R); B2 likewise",
      pressure: "A = N + (1 - p)(A2 - N); B likewise; N is the louder side's starting position",
      gap: "|A - B| = |1 - p| * (1 - r) * |A1 - B1|",
      note: "R, N, dA and dB are authored for each fictional case. At full strength the model assumes complete adoption of R or N, an extreme by construction.",
    },
    case: {
      id: scenario.id,
      title: scenario.title,
      prompt: scenario.prompt,
      viewpoints: scenario.viewpoints,
      influences: scenario.influences,
      sharedOption: scenario.sharedOption,
      caseNote: scenario.caseNote,
      caseVersion: scenario.version,
      A0: [...scenario.A0],
      B0: [...scenario.B0],
      R: [...scenario.R],
      N: result.N,
      controls: { ...controls },
      visitorReadings: cleanReadings,
      stages: result.stages,
      endpoints: { A: result.A, B: result.B },
      factors: result.factors,
      coordinateGap: result.gap,
      summary: summarise(scenario, result).text,
      assumptions: {
        coordinates: "All people, stories, directions, R and N are authored fictional examples.",
        influenceKindsAreAuthoredAndDisputable: true,
        visitorReadingsDoNotChangeTheGeometry: true,
        meetingDoesNotEstablishPolicyAgreement: true,
      },
    },
  };
}

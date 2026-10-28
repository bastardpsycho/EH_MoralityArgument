export const MODEL_VERSION = "2.0.0";

export const AXES = Object.freeze({
  x: Object.freeze({ key: "x", label: "Personal agency", meaning: "Relative weight given to the directly affected person's control over their own life and choices.", min: -150, max: 150 }),
  y: Object.freeze({ key: "y", label: "Preventing harm", meaning: "Relative weight given to avoiding serious burdens or harms to affected people.", min: -150, max: 150 }),
  z: Object.freeze({ key: "z", label: "Shared responsibility", meaning: "Relative weight given to obligations and practical responsibilities extending beyond the immediate individual or pair.", min: -150, max: 150 }),
});

export const CONTROL_RANGE = Object.freeze({ min: -1, max: 1, step: 0.01 });
export const INFLUENCE_SCALES = Object.freeze({
  personalA: Object.freeze([50, 50, 50]),
  personalB: Object.freeze([50, 50, 50]),
  shared: Object.freeze([25, 25, 25]),
});

function assertVector(vector, label) {
  if (!Array.isArray(vector) || vector.length !== 3 || Array.from(vector).some((value) => !Number.isFinite(value))) {
    throw new TypeError(`${label} must be a finite three-coordinate vector.`);
  }
}

function assertPointOnChart(point, label) {
  if (point.some((value, index) => value < AXES["xyz"[index]].min || value > AXES["xyz"[index]].max)) {
    throw new RangeError(`${label} lies outside the fixed chart axes [-150, 150].`);
  }
}

function assertControls(controls) {
  if (!controls || typeof controls !== "object" || Array.isArray(controls)) {
    throw new TypeError("Controls must be an object with a, b, and g values.");
  }
  const keys = Object.keys(controls).sort();
  if (keys.join(",") !== "a,b,g") {
    throw new TypeError("Controls must contain exactly a, b, and g.");
  }
  for (const key of ["a", "b", "g"]) {
    const vector = controls[key];
    assertVector(vector, `Control ${key}`);
    for (const value of vector) {
      if (value < CONTROL_RANGE.min || value > CONTROL_RANGE.max) {
        throw new RangeError(`Each component of control ${key} must be between -1 and 1.`);
      }
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

export function distance(left, right) {
  return Math.hypot(...subtractVector(left, right));
}

export function translatePair(aPoint, bPoint, delta) {
  return { a: addVector(aPoint, delta), b: addVector(bPoint, delta) };
}

export function computeEndpoints(scenario, controls) {
  if (!scenario || typeof scenario !== "object") throw new TypeError("A scenario is required.");
  assertControls(controls);
  assertVector(scenario.A0, "A0");
  assertVector(scenario.B0, "B0");
  assertPointOnChart(scenario.A0, "A0");
  assertPointOnChart(scenario.B0, "B0");
  const personalA = controls.a.map((value, index) => INFLUENCE_SCALES.personalA[index] * value);
  const personalB = controls.b.map((value, index) => INFLUENCE_SCALES.personalB[index] * value);
  const shared = controls.g.map((value, index) => INFLUENCE_SCALES.shared[index] * value);
  const A = addVector(addVector(scenario.A0, personalA), shared);
  const B = addVector(addVector(scenario.B0, personalB), shared);
  for (const [label, point] of [["A", A], ["B", B]]) {
    if (point.some((value, index) => value < AXES["xyz"[index]].min || value > AXES["xyz"[index]].max)) {
      throw new RangeError(`${label} endpoint lies outside the fixed chart axes [-150, 150].`);
    }
  }
  return {
    A,
    B,
    arrows: { personalA, globalAtA: [...shared], personalB, globalAtB: [...shared] },
    gap: distance(A, B),
  };
}

export function validateScenario(scenario) {
  if (!scenario || typeof scenario !== "object") throw new TypeError("Scenario must be an object.");
  assertVector(scenario.A0, "A0");
  assertVector(scenario.B0, "B0");
  for (const [label, point] of [["A0", scenario.A0], ["B0", scenario.B0]]) {
    assertPointOnChart(point, label);
  }
  if (scenario.viewpoints && scenario.viewpoints.length !== 2) throw new TypeError("A scenario must contain exactly two viewpoints.");
  for (let mask = 0; mask < 512; mask += 1) {
    const controls = { a: [], b: [], g: [] };
    for (let groupIndex = 0; groupIndex < 3; groupIndex += 1) {
      const group = ["a", "b", "g"][groupIndex];
      for (let axisIndex = 0; axisIndex < 3; axisIndex += 1) {
        const bit = groupIndex * 3 + axisIndex;
        controls[group].push((mask & (1 << bit)) === 0 ? -1 : 1);
      }
    }
    computeEndpoints(scenario, controls);
  }
  return true;
}

export function formatCoordinate(value) {
  if (Number.isInteger(value)) return String(value);
  const rounded = Number(value.toFixed(6));
  if (rounded !== 0) return String(rounded);
  if (value === 0) return "0";
  return value.toExponential(2);
}

export function createExportPayload(scenario, controls, ts_ms = Date.now()) {
  if (!Number.isSafeInteger(ts_ms) || ts_ms < 0) throw new RangeError("ts_ms must be a nonnegative epoch-millisecond integer.");
  const result = computeEndpoints(scenario, controls);
  return {
    format: "moral-topology-local-export",
    version: MODEL_VERSION,
    ts_ms,
    scope: "Illustrative fictional model; authored assumptions do not establish truth, virtue, policy, or personal worth.",
    coordinateReading: "Zero is an authored reference level. Positive and negative values are relative emphasis, not better or worse. Axes are independent, not percentages that sum to 100.",
    axes: Object.fromEntries(Object.entries(AXES).map(([key, axis]) => [key, { label: axis.label, meaning: axis.meaning, min: axis.min, max: axis.max, unit: "signed illustrative units" }])),
    controlRange: { ...CONTROL_RANGE },
    influenceScales: Object.fromEntries(Object.entries(INFLUENCE_SCALES).map(([key, vector]) => [key, [...vector]])),
    formula: {
      A: "A0 + 50*a + 25*g, componentwise",
      B: "B0 + 50*b + 25*g, componentwise",
      note: "a, b, and g are independent three-component vectors. The same shared vector is added to both points, so it preserves their pairwise difference.",
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
      witness: {
        a: [...scenario.witness.a],
        b: [...scenario.witness.b],
        g: [...scenario.witness.g],
      },
      controls: { a: [...controls.a], b: [...controls.b], g: [...controls.g] },
      endpoints: { A: result.A, B: result.B },
      arrows: result.arrows,
      coordinateGap: result.gap,
      assumptions: {
        axisReference: "Zero is an authored reference level; signs indicate relative emphasis, not better or worse.",
        coordinates: "All people, stories, and coordinate values in this case are authored fictional examples.",
        influenceScales: Object.fromEntries(Object.entries(INFLUENCE_SCALES).map(([key, vector]) => [key, [...vector]])),
        controlsAreSignedIndependentVectors: true,
        sharedVectorIsIdenticalAtBothPoints: true,
        meetingDoesNotEstablishPolicyAgreement: true,
      },
    },
  };
}

import { AXES, FACTOR_KINDS, FREE_SCALES, directionText, formatCoordinate, subtractVector } from "./model.mjs";

const LIMIT = 150;
export const PROJECTIONS = Object.freeze({
  iso: { label: "Oblique 3D", depth: "All three axes shown", project: ([x, y, z]) => [360 + 0.9 * (x - y), 250 + 0.4 * (x + y) - 0.65 * z] },
  xy: { label: "Agency × harm", depth: "z depth omitted", project: ([x, y]) => [360 + 1.05 * x, 260 - 1.05 * y] },
  xz: { label: "Agency × shared", depth: "y depth omitted", project: ([x, , z]) => [360 + 1.05 * x, 260 - 1.05 * z] },
  yz: { label: "Harm × shared", depth: "x depth omitted", project: ([, y, z]) => [360 + 1.05 * y, 260 - 1.05 * z] },
});

const COLORS = Object.freeze({ reasons: "#3f62a8", pushes: "#8a4f8f", both: "#b58227", "person-0": "#24726d", "person-1": "#ca624f", "person-2": "#5b7a2e", squeeze: "#6b6f68", drift: "#b58227" });
const AXIS_SHORT = Object.freeze({ x: "x · agency", y: "y · harm", z: "z · shared" });

function pointText(point) {
  return point.map(formatCoordinate).join(", ");
}

function line(from, to, className, marker = false) {
  const [x1, y1] = from;
  const [x2, y2] = to;
  const length = Math.hypot(x2 - x1, y2 - y1);
  if (length <= 1) return `<circle class="zero-arrow ${className}" cx="${x2.toFixed(2)}" cy="${y2.toFixed(2)}" r="3" aria-hidden="true"/>`;
  const markerEnd = marker ? ` marker-end="url(#arrow-${className})"` : "";
  return `<line class="vector ${className}" x1="${x1.toFixed(2)}" y1="${y1.toFixed(2)}" x2="${x2.toFixed(2)}" y2="${y2.toFixed(2)}"${markerEnd} aria-hidden="true"/>`;
}

function polygon(project, points, className) {
  return `<polygon class="${className}" points="${points.map((point) => project(point).map((value) => value.toFixed(2)).join(",")).join(" ")}" aria-hidden="true"/>`;
}

function planeMarkup(project) {
  const edge = LIMIT;
  const faces = [
    [[0, -edge, -edge], [0, edge, -edge], [0, edge, edge], [0, -edge, edge]],
    [[-edge, 0, -edge], [edge, 0, -edge], [edge, 0, edge], [-edge, 0, edge]],
    [[-edge, -edge, 0], [edge, -edge, 0], [edge, edge, 0], [-edge, edge, 0]],
  ];
  return `<g class="zero-planes" aria-hidden="true">${faces.map((face) => polygon(project, face, "zero-plane")).join("")}</g>`;
}

function cubeMarkup(project, projection) {
  const values = [-LIMIT, LIMIT];
  const vertices = [];
  for (const x of values) for (const y of values) for (const z of values) vertices.push([x, y, z]);
  const edges = [];
  for (const vertex of vertices) {
    for (let axis = 0; axis < 3; axis += 1) {
      if (vertex[axis] !== -LIMIT) continue;
      const other = [...vertex];
      other[axis] = LIMIT;
      const [x1, y1] = project(vertex);
      const [x2, y2] = project(other);
      edges.push(`<line class="cube-edge" x1="${x1.toFixed(2)}" y1="${y1.toFixed(2)}" x2="${x2.toFixed(2)}" y2="${y2.toFixed(2)}" aria-hidden="true"/>`);
    }
  }
  const visible = projection === "iso" ? ["x", "y", "z"] : projection.split("");
  const axisData = {
    x: { start: [-LIMIT, 0, 0], end: [LIMIT, 0, 0], at: (v) => [v, 0, 0] },
    y: { start: [0, -LIMIT, 0], end: [0, LIMIT, 0], at: (v) => [0, v, 0] },
    z: { start: [0, 0, -LIMIT], end: [0, 0, LIMIT], at: (v) => [0, 0, v] },
  };
  const axes = visible.map((axis) => {
    const { start, end, at } = axisData[axis];
    const [x1, y1] = project(start);
    const [x2, y2] = project(end);
    const labelPoint = project(axis === "x" ? [LIMIT, 0, 0] : axis === "y" ? [0, LIMIT, 0] : [0, 0, LIMIT]);
    const labelAnchor = axis === "y" && projection === "iso" ? "end" : "start";
    const labelX = labelPoint[0] + (labelAnchor === "end" ? -7 : 7);
    const labelY = labelPoint[1] + (axis === "z" ? -8 : 4);
    const main = `<line class="axis-line axis-${axis}" x1="${x1.toFixed(2)}" y1="${y1.toFixed(2)}" x2="${x2.toFixed(2)}" y2="${y2.toFixed(2)}" aria-hidden="true"/><text class="axis-label" text-anchor="${labelAnchor}" x="${labelX.toFixed(2)}" y="${labelY.toFixed(2)}" aria-hidden="true">${AXIS_SHORT[axis]}</text>`;
    const dx = x2 - x1;
    const dy = y2 - y1;
    const length = Math.hypot(dx, dy) || 1;
    const nx = -dy / length;
    const ny = dx / length;
    const ticks = [-LIMIT, 0, LIMIT].map((value) => {
      const [tx, ty] = project(at(value));
      const half = 4;
      const labelX = tx + nx * 10;
      const labelY = ty + ny * 10 + 3;
      const label = value === LIMIT ? "+150" : String(value);
      return `<line class="axis-tick" x1="${(tx - nx * half).toFixed(2)}" y1="${(ty - ny * half).toFixed(2)}" x2="${(tx + nx * half).toFixed(2)}" y2="${(ty + ny * half).toFixed(2)}" aria-hidden="true"/><text class="tick-label" text-anchor="middle" x="${labelX.toFixed(2)}" y="${labelY.toFixed(2)}" aria-hidden="true">${label}</text>`;
    }).join("");
    return `${main}${ticks}`;
  }).join("");
  return `<g class="cube" aria-hidden="true">${planeMarkup(project)}${edges.join("")}${axes}</g>`;
}

const PERSON_CLASSES = ["a", "b", "c"];

function startMarker(x, y, index) {
  const cls = `${PERSON_CLASSES[index]}-origin`;
  if (index === 0) return `<circle class="point ${cls}" cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" r="6" aria-hidden="true"/>`;
  if (index === 1) return `<rect class="point ${cls}" x="${(x - 5).toFixed(2)}" y="${(y - 5).toFixed(2)}" width="10" height="10" transform="rotate(45 ${x.toFixed(2)} ${y.toFixed(2)})" aria-hidden="true"/>`;
  return `<path class="point ${cls}" d="M ${x.toFixed(2)} ${(y - 7).toFixed(2)} L ${(x + 7).toFixed(2)} ${(y + 5).toFixed(2)} L ${(x - 7).toFixed(2)} ${(y + 5).toFixed(2)} Z" aria-hidden="true"/>`;
}

function endMarker(x, y, index) {
  const cls = `${PERSON_CLASSES[index]}-end`;
  if (index === 0) return `<circle class="point ${cls}" cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" r="7" aria-hidden="true"/>`;
  if (index === 1) return `<path class="point ${cls}" d="M ${x.toFixed(2)} ${(y - 9).toFixed(2)} L ${(x + 9).toFixed(2)} ${y.toFixed(2)} L ${x.toFixed(2)} ${(y + 9).toFixed(2)} L ${(x - 9).toFixed(2)} ${y.toFixed(2)} Z" aria-hidden="true"/>`;
  return `<path class="point ${cls}" d="M ${x.toFixed(2)} ${(y - 9).toFixed(2)} L ${(x + 9).toFixed(2)} ${(y + 7).toFixed(2)} L ${(x - 9).toFixed(2)} ${(y + 7).toFixed(2)} Z" aria-hidden="true"/>`;
}

const LABEL_OFFSETS = [[9, -9], [9, 18], [-30, 4]];

// people: [{ name, start, end, segments: [{ from, to, className }] }]
function chartFrame(project, projection, title, aria, people) {
  const lines = people.flatMap((person) => person.segments.map((segment) => line(project(segment.from), project(segment.to), segment.className, true))).join("");
  const points = people.map((person, index) => {
    const [sx, sy] = project(person.start);
    const [ex, ey] = project(person.end);
    const [dx, dy] = LABEL_OFFSETS[index];
    return `${startMarker(sx, sy, index)}<text class="point-label ${PERSON_CLASSES[index]}-origin" x="${(sx + dx).toFixed(2)}" y="${(sy + dy).toFixed(2)}" aria-hidden="true">${person.name} start</text>${endMarker(ex, ey, index)}<text class="point-label ${PERSON_CLASSES[index]}-end" x="${(ex + dx).toFixed(2)}" y="${(ey + dy).toFixed(2)}" aria-hidden="true">${person.name}</text>`;
  }).join("");
  const used = [...new Set(people.flatMap((person) => person.segments.map((segment) => segment.className)))];
  const markers = used.map((name) => `<marker id="arrow-${name}" markerWidth="9" markerHeight="9" refX="6" refY="3" orient="auto" markerUnits="userSpaceOnUse"><path d="M0,0 L0,6 L7,3 z" fill="${COLORS[name]}"/></marker>`).join("");
  return `<svg class="topology-chart" viewBox="0 0 720 520" role="img" aria-label="${aria}" xmlns="http://www.w3.org/2000/svg">
    <title>${title}</title><desc>${aria}</desc>
    <defs>${markers}</defs>
    ${cubeMarkup(project, projection)}
    <g class="vectors">${lines}</g>
    <g class="points">${points}</g>
  </svg>`;
}

function viewFor(projection) {
  const view = PROJECTIONS[projection];
  if (!view) throw new RangeError(`Unknown projection: ${projection}`);
  return view;
}

export function renderStoryChart(scenario, result, projection = "iso", title = "Current model view") {
  const view = viewFor(projection);
  const people = ["A", "B"].map((key, index) => ({
    name: scenario.viewpoints[index].name,
    start: result.people[key].start,
    end: result.people[key].end,
    segments: result.people[key].steps.map((step) => ({ from: step.from, to: step.to, className: step.kind })),
  }));
  const aria = `${title}. ${view.label}; ${view.depth}. Fixed axis range minus 150 to plus 150. ${people.map((p) => `${p.name} starts at ${pointText(p.start)} and is now at ${pointText(p.end)}`).join(". ")}.`;
  return chartFrame(view.project, projection, title, aria, people);
}

export function renderFreeChart(scenario, result, projection = "iso", title = "Current model view") {
  const view = viewFor(projection);
  const people = result.stages.map((stage, index) => ({
    name: scenario.viewpoints[index].name,
    start: stage.start,
    end: stage.end,
    segments: [
      { from: stage.start, to: stage.afterPersonal, className: `person-${index}` },
      { from: stage.afterPersonal, to: stage.afterSqueeze, className: "squeeze" },
      { from: stage.afterSqueeze, to: stage.end, className: "drift" },
    ],
  }));
  const aria = `${title}. ${view.label}; ${view.depth}. Fixed axis range minus 150 to plus 150. ${people.map((p) => `${p.name} starts at ${pointText(p.start)} and is now at ${pointText(p.end)}`).join(". ")}.`;
  return chartFrame(view.project, projection, title, aria, people);
}

export function renderChart(scenario, result, projection, title) {
  return scenario.mode === "story" ? renderStoryChart(scenario, result, projection, title) : renderFreeChart(scenario, result, projection, title);
}

function tableMarkup(caption, rows) {
  const heads = [AXES.x, AXES.y, AXES.z].map((axis) => `<th scope="col">${axis.key} · ${axis.label}</th>`).join("");
  return `<table class="coordinate-table"><caption>${caption}</caption><thead><tr><th scope="col">Point</th>${heads}</tr></thead><tbody>${rows.map(([label, point]) => `<tr><th scope="row">${label}</th>${point.map((value) => `<td>${formatCoordinate(value)}</td>`).join("")}</tr>`).join("")}</tbody></table>`;
}

export function renderStoryTable(scenario, result) {
  const titles = Object.fromEntries(scenario.factors.map((factor) => [factor.id, factor.title]));
  const rows = [];
  for (const [key, index] of [["A", 0], ["B", 1]]) {
    const person = result.people[key], name = scenario.viewpoints[index].name;
    rows.push([`${name} start`, person.start]);
    for (const step of person.steps) rows.push([`${name} after “${titles[step.factorId]}”${step.fraction < 1 ? ` (${Math.round(step.fraction * 100)}%)` : ""}`, step.to]);
  }
  rows.push([`${scenario.viewpoints[0].name} − ${scenario.viewpoints[1].name}`, subtractVector(result.A, result.B)]);
  return tableMarkup("All three differences must be zero for matching displayed coordinates; that does not establish agreement.", rows);
}

export function renderFreeTable(scenario, result) {
  const rows = [];
  result.stages.forEach((stage, index) => {
    const name = scenario.viewpoints[index].name;
    rows.push([`${name} start`, stage.start], [`${name} after own influences`, stage.afterPersonal], [`${name} after the squeeze`, stage.afterSqueeze], [`${name} now (after the drift)`, stage.end]);
  });
  rows.push(["Centroid after own influences", result.centroid], ["Global drift (same for everyone)", result.drift]);
  return tableMarkup("Every pairwise distance after the squeeze is (1 − squeeze) times its distance after personal influences.", rows);
}

export function renderTable(scenario, result) {
  return scenario.mode === "story" ? renderStoryTable(scenario, result) : renderFreeTable(scenario, result);
}

export function renderAssumptions(scenario) {
  const cues = Object.entries(scenario.axisCues).map(([axis, text]) => `<div><dt>${axis} · ${AXES[axis].label}</dt><dd>In this case: ${text}.</dd></div>`).join("");
  const extra = scenario.mode === "story"
    ? `<div><dt>Factors</dt><dd>${scenario.factors.map((factor) => `${factor.title} (${FACTOR_KINDS[factor.kind]}): ${Object.entries(factor.moves).map(([person, move]) => `${scenario.viewpoints[person === "A" ? 0 : 1].name} ${directionText(move)}`).join("; ")}`).join(" · ")}</dd></div>`
    : `<div><dt>Scales</dt><dd>Each person's slider moves them up to ${FREE_SCALES.personal} units per axis; the drift up to ${FREE_SCALES.drift} units per axis, the same for everyone.</dd></div>`;
  return `<dl class="assumption-grid">${cues}${extra}<div class="assumption-note"><dt>Reading the signs</dt><dd>Zero is an authored reference. Signs are relative emphasis, not better or worse; axes are independent, not percentages. Every displacement and label is the story's claim.</dd></div></dl>`;
}

export function renderLegend(scenario) {
  if (scenario.mode === "story") {
    return `<ul class="legend" aria-label="Arrows and markers">${Object.entries(FACTOR_KINDS).map(([kind, label]) => `<li><span class="legend-swatch ${kind}" aria-hidden="true"></span>Factor that ${label}</li>`).join("")}<li><span class="marker-key" aria-hidden="true">○ ◇</span>Hollow markers are starts; filled markers are where each person is now.</li></ul>`;
  }
  return `<ul class="legend" aria-label="Arrows and markers">${scenario.viewpoints.map((person, index) => `<li><span class="legend-swatch person-${index}" aria-hidden="true"></span>${person.name}'s own influences</li>`).join("")}<li><span class="legend-swatch squeeze" aria-hidden="true"></span>Squeeze · towards one another</li><li><span class="legend-swatch drift" aria-hidden="true"></span>Global drift · same for everyone</li><li><span class="marker-key" aria-hidden="true">○ ◇ △</span>Hollow markers are starts; filled markers are where each person is now.</li></ul>`;
}

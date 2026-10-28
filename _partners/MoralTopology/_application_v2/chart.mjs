import { AXES, INFLUENCE_SCALES, addVector, formatCoordinate, subtractVector } from "./model.mjs";

const LIMIT = 150;
export const PROJECTIONS = Object.freeze({
  iso: { label: "Oblique 3D", depth: "All three axes shown", project: ([x, y, z]) => [360 + 0.9 * (x - y), 250 + 0.4 * (x + y) - 0.65 * z] },
  xy: { label: "Agency × harm", depth: "z depth omitted", project: ([x, y]) => [360 + 1.05 * x, 260 - 1.05 * y] },
  xz: { label: "Agency × shared", depth: "y depth omitted", project: ([x, , z]) => [360 + 1.05 * x, 260 - 1.05 * z] },
  yz: { label: "Harm × shared", depth: "x depth omitted", project: ([, y, z]) => [360 + 1.05 * y, 260 - 1.05 * z] },
});

const COLORS = Object.freeze({ personalA: "#24726d", personalB: "#ca624f", global: "#b58227" });
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

function pointMarkup(project, point, label, className, dx, dy) {
  const [x, y] = project(point);
  let marker;
  if (className === "a-origin") {
    marker = `<circle class="point a-origin" cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" r="6" aria-hidden="true"/>`;
  } else if (className === "b-origin") {
    marker = `<rect class="point b-origin" x="${(x - 5).toFixed(2)}" y="${(y - 5).toFixed(2)}" width="10" height="10" transform="rotate(45 ${x.toFixed(2)} ${y.toFixed(2)})" aria-hidden="true"/>`;
  } else if (className === "a-end") {
    marker = `<circle class="point a-end" cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" r="7" aria-hidden="true"/>`;
  } else {
    marker = `<path class="point b-end" d="M ${x.toFixed(2)} ${(y - 9).toFixed(2)} L ${(x + 9).toFixed(2)} ${y.toFixed(2)} L ${x.toFixed(2)} ${(y + 9).toFixed(2)} L ${(x - 9).toFixed(2)} ${y.toFixed(2)} Z" aria-hidden="true"/>`;
  }
  const pointLabel = `<text class="point-label ${className}" x="${(x + dx).toFixed(2)}" y="${(y + dy).toFixed(2)}" aria-hidden="true">${label}</text>`;
  return `${marker}${pointLabel}`;
}

export function renderChartSvg(scenario, result, projection = "iso", title = "Current model view") {
  const view = PROJECTIONS[projection];
  if (!view) throw new RangeError(`Unknown projection: ${projection}`);
  const project = view.project;
  const A0 = scenario.A0;
  const B0 = scenario.B0;
  const APersonal = addVector(A0, result.arrows.personalA);
  const BPersonal = addVector(B0, result.arrows.personalB);
  const lines = [
    line(project(A0), project(APersonal), "personal-a", true),
    line(project(APersonal), project(result.A), "global", true),
    line(project(B0), project(BPersonal), "personal-b", true),
    line(project(BPersonal), project(result.B), "global", true),
  ].join("");
  // The two filled shapes intentionally overlap at a meeting: the teal circle is
  // drawn over the coral diamond, leaving its corners visible and both labels legible.
  const points = [
    pointMarkup(project, A0, "A start", "a-origin", 9, -8),
    pointMarkup(project, B0, "B start", "b-origin", 9, 17),
    pointMarkup(project, result.B, "B", "b-end", 12, 20),
    pointMarkup(project, result.A, "A", "a-end", -18, -12),
  ].join("");
  const aria = `${title}. ${view.label}; ${view.depth}. Fixed axis range minus 150 to plus 150. A starts at ${pointText(A0)} and ends at ${pointText(result.A)}. B starts at ${pointText(B0)} and ends at ${pointText(result.B)}.`;
  return `<svg class="topology-chart" viewBox="0 0 720 520" role="img" aria-label="${aria}" xmlns="http://www.w3.org/2000/svg">
    <title>${title}</title><desc>${aria}</desc>
    <defs>
      <marker id="arrow-personal-a" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto" markerUnits="strokeWidth"><path d="M0,0 L0,6 L7,3 z" fill="${COLORS.personalA}"/></marker>
      <marker id="arrow-personal-b" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto" markerUnits="strokeWidth"><path d="M0,0 L0,6 L7,3 z" fill="${COLORS.personalB}"/></marker>
      <marker id="arrow-global" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto" markerUnits="strokeWidth"><path d="M0,0 L0,6 L7,3 z" fill="${COLORS.global}"/></marker>
    </defs>
    ${cubeMarkup(project, projection)}
    <g class="vectors">${lines}</g>
    <g class="points">${points}</g>
  </svg>`;
}

export function renderCoordinateTable(scenario, result) {
  const rows = [
    ["A start", scenario.A0],
    ["A · Personal A displacement", result.arrows.personalA],
    ["A · Shared displacement", result.arrows.globalAtA],
    ["A current endpoint", result.A],
    ["B start", scenario.B0],
    ["B · Personal B displacement", result.arrows.personalB],
    ["B · Shared displacement", result.arrows.globalAtB],
    ["B current endpoint", result.B],
    ["A − B · per-axis difference", subtractVector(result.A, result.B)],
  ];
  const heads = [AXES.x, AXES.y, AXES.z].map((axis) => `<th scope="col">${axis.key} · ${axis.label}</th>`).join("");
  return `<table class="coordinate-table"><caption>All three differences must be zero for matching displayed coordinates; that does not establish agreement.</caption><thead><tr><th scope="col">Point or applied displacement</th>${heads}</tr></thead><tbody>${rows.map(([label, point]) => `<tr><th scope="row">${label}</th>${point.map((value) => `<td>${formatCoordinate(value)}</td>`).join("")}</tr>`).join("")}</tbody></table>`;
}

function vectorText(vector) {
  return `[${vector.map(formatCoordinate).join(", ")}]`;
}

export function renderAssumptions(scenario, controls) {
  return `<dl class="assumption-grid">
    <div><dt>Starting points</dt><dd>A ${pointText(scenario.A0)} · B ${pointText(scenario.B0)}</dd></div>
    <div><dt>Personal A scale</dt><dd>${vectorText(INFLUENCE_SCALES.personalA)} signed units per component</dd></div>
    <div><dt>Personal B scale</dt><dd>${vectorText(INFLUENCE_SCALES.personalB)} signed units per component</dd></div>
    <div><dt>Shared scale</dt><dd>${vectorText(INFLUENCE_SCALES.shared)} signed units, same vector at A and B</dd></div>
    <div><dt>Current vectors</dt><dd>a ${vectorText(controls.a)} · b ${vectorText(controls.b)} · g ${vectorText(controls.g)}</dd></div>
    <div class="assumption-note"><dt>Reading the signs</dt><dd>Zero is an authored reference. Signs are relative emphasis, not better or worse; axes are independent, not percentages.</dd></div>
  </dl>`;
}

export function renderLegend() {
  return `<ul class="legend" aria-label="Influence arrows and markers">
    <li><span class="legend-swatch personal-a" aria-hidden="true"></span>Personal A · xyz, A only</li>
    <li><span class="legend-swatch personal-b" aria-hidden="true"></span>Personal B · xyz, B only</li>
    <li><span class="legend-swatch global" aria-hidden="true"></span>Global · same xyz displacement at A and B</li>
    <li><span class="marker-key" aria-hidden="true">○ ◇</span>Hollow markers are starts; filled circle and diamond are endpoints.</li>
  </ul>`;
}

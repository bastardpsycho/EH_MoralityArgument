"""Dash application: Moral Decision Topology."""

import socket

import dash
import numpy as np
from dash import ALL, Input, Output, State, dcc, html, no_update

from . import __version__
from .dynamics import POPULATIONS, find_attractors, init_population, objectivity_test, reversal_test, simulate
from .figures import (add_attractors, add_probe_b, add_click_lattice, add_field, add_influences, add_objective_marker,
                      add_objectivity_isosurface, add_octant_labels, add_population_animation, add_probe,
                      add_regime_clouds, add_theories, base_figure, decomposition_heatmap, octant_share_figure,
                      objectivity_test_figure, reversal_figure)
from .forces import (AXIS_TOPIC, COMPONENT_LABEL, COMPONENT_MECH, INFLUENCE_TYPES, components, disagreement, drift,
                     felt_objectivity, moral_strain, noise_sigma)
from .levers import DEFAULT_LEVERS, LEVER_GROUPS, LEVERS, TRAITS, TRAIT_KEYS, to_unit
from .scenarios import CASES, ECOLOGIES, REVERSAL_PHASES
from .space import THEORIES, THEORY_BY_NAME, band, nearest_regime, octant_of

INK2, MUTED, LINE, PANEL = "#9fb0cc", "#8193b2", "#243653", "#101d33"
GRADE_COLOR = {"robust": "#57ddf5", "mixed": "#e9bd78", "contested": "#f38bc8", "n/a": MUTED}

app = dash.Dash(__name__, title="Moral Topology · Decision Mapping")
server = app.server


# ---------------------------------------------------------------------------
# Layout helpers
# ---------------------------------------------------------------------------
def lever_row(lv):
    return html.Div(className="lever", title=f"{lv.mechanism}\n\nEvidence: {lv.evidence}", children=[
        html.Div(style={"display": "flex", "justifyContent": "space-between", "alignItems": "baseline"}, children=[
            html.Span(lv.label, style={"fontWeight": 600, "fontSize": "13px"}),
            html.Span(lv.grade, style={"fontSize": "10px", "color": GRADE_COLOR[lv.grade], "fontWeight": 600}),
        ]),
        dcc.Slider(id={"type": "lever", "key": lv.key}, min=0, max=10, step=1, value=lv.default,
                   marks={0: "0", 5: "5", 10: "10"}, updatemode="mouseup"),
    ])


def trait_row(t):
    return html.Div(className="lever", title=t.mechanism, children=[
        html.Span(t.label, style={"fontWeight": 600, "fontSize": "13px"}),
        dcc.Slider(id={"type": "trait", "key": t.key}, min=-3, max=3, step=0.5, value=0,
                   marks={-3: "-3σ", 0: "avg", 3: "+3σ"}, updatemode="mouseup"),
    ])


def num(id_, value, label):
    return html.Label(style={"display": "inline-flex", "flexDirection": "column", "width": "23%",
                             "fontSize": "11px", "color": INK2}, children=[
        label, dcc.Input(id=id_, type="number", value=value, min=-100, max=100, step=1, debounce=True,
                         style={"width": "100%"})])


def section(title, *children):
    return html.Div(style={"marginBottom": "14px"}, children=[html.H4(title, className="sec"), *children])


def P(text, **style):
    return html.P(text, style={"fontSize": "12.5px", "lineHeight": "1.45", "color": INK2, "margin": "4px 0 8px",
                               **style})


scenario_tab = html.Div(className="tabbody", children=[
    section("Case library",
            dcc.Dropdown(id="case", options=[{"label": c["title"], "value": k} for k, c in CASES.items()],
                         value="everyday", clearable=False),
            html.Div(style={"display": "flex", "gap": "6px", "marginTop": "8px"}, children=[
                html.Button("Load case", id="btn-load", n_clicks=0, className="primary"),
                html.Button("Everyday defaults", id="btn-reset", n_clicks=0),
                html.Button("Zero all levers", id="btn-zero", n_clicks=0)]),
            html.Div(id="case-card", className="card")),
    section("How to read the space",
            P("x — who counts (self → kin → ingroup → society → humanity → sentient beings). "
              "y — what holds the norm in place (outside sanction → internal identity/conviction). "
              "z — how the decision is made (fast intuition → slow reflection). "
              "Colour w — which moral foundations are weighted (care/fairness in cyan → loyalty/authority/"
              "sanctity in pink)."),
            P("A point is a decision configuration — the full structure of a judgement (scope, binding, "
              "processing) — not a person, an ideology or a moral truth. Different configurations can reach "
              "the same verdict. Arrows show where the current social ecology pushes decisions made from "
              "that configuration.")),
])

levers_tab = html.Div(className="tabbody", children=[
    P("Hover a lever for its mechanism and sources. Literature tags are inherited annotations, not validation of these coefficients."),
    *[html.Details(open=(g in ("Ecology", "Institutions")), children=[
        html.Summary(g, className="grp"),
        *[lever_row(lv) for lv in LEVERS if lv.group == g]]) for g in LEVER_GROUPS],
])

person_tab = html.Div(className="tabbody", children=[
    section("Decision probe (x, y, z, w)",
            html.Div(style={"display": "flex", "gap": "2%"}, children=[
                num("probe-x", -20, "scope x"), num("probe-y", 20, "binding y"),
                num("probe-z", -20, "processing z"), num("probe-w", 0, "tilt w")]),
            html.Div("Click in the 3D view (click mode below) to move the probe.",
                     style={"fontSize": "11px", "color": MUTED, "marginTop": "4px"})),
    section("Probe B — compare two configurations (disagreement)",
            dcc.Checklist(id="b-on", options=[{"label": " show probe B and the A–B disagreement", "value": "on"}],
                          value=[]),
            html.Div(style={"display": "flex", "gap": "2%", "marginTop": "4px"}, children=[
                num("b-x", 55, "scope x"), num("b-y", 55, "binding y"),
                num("b-z", 45, "processing z"), num("b-w", -45, "tilt w")])),
    section("Click mode",
            dcc.RadioItems(id="click-mode", value="off", labelStyle={"display": "block", "fontSize": "13px"},
                           options=[{"label": "Clicks move the probe", "value": "probe"},
                                    {"label": "Clicks move probe B", "value": "probe_b"},
                                    {"label": "Clicks set the influence position", "value": "influence"},
                                    {"label": "Clicks do nothing (rotate freely)", "value": "off"}])),
    section("Individual traits of the probe person",
            P("Traits change how strongly this person responds to each lever, and set personal thresholds "
              "(e.g. for obeying a command)."),
            *[trait_row(t) for t in TRAITS]),
    section("Cohort",
            P("Different people from the same starting point in the same situation (random traits around the "
              "probe person's, plus unmodelled noise)."),
            dcc.Slider(id="cohort", min=0, max=60, step=10, value=30, marks={0: "0", 30: "30", 60: "60"},
                       updatemode="mouseup")),
])

influence_tab = html.Div(className="tabbody", children=[
    P("Place local influence sources. Reach is an illustrative choice: effect = strength × closeness "
      "(Gaussian in decision space)."),
    section("New influence",
            dcc.Dropdown(id="inf-type", value="attractor", clearable=False,
                         options=[{"label": v, "value": k} for k, v in INFLUENCE_TYPES.items()]),
            html.Div("Strength", className="lbl"),
            dcc.Slider(id="inf-strength", min=0.1, max=1.0, step=0.1, value=0.6, marks={0.1: "0.1", 1: "1"}),
            html.Div("Reach (radius)", className="lbl"),
            dcc.Slider(id="inf-radius", min=10, max=60, step=5, value=25, marks={10: "10", 60: "60"}),
            html.Div("Polariser splits along axis", className="lbl"),
            dcc.Dropdown(id="inf-axis", value="x", clearable=False,
                         options=[{"label": "x (scope)", "value": "x"}, {"label": "y (binding)", "value": "y"},
                                  {"label": "z (processing)", "value": "z"}]),
            html.Div(style={"display": "flex", "gap": "2%", "marginTop": "8px"}, children=[
                num("inf-x", 0, "x"), num("inf-y", 0, "y"), num("inf-z", 0, "z")]),
            html.Div(style={"display": "flex", "gap": "6px", "marginTop": "8px"}, children=[
                html.Button("Add", id="inf-add", n_clicks=0, className="primary"),
                html.Button("Undo last", id="inf-undo", n_clicks=0),
                html.Button("Clear", id="inf-clear", n_clicks=0)])),
    section("Placed", html.Div(id="inf-list", style={"fontSize": "12px"})),
    section("Types",
            P("Attractor — a charismatic leader or exemplar pulls nearby configurations toward itself. "
              "Repeller — stigma or taboo pushes away. Amplifier — a spotlight (media attention, crisis) "
              "multiplies whatever forces already act locally. Stabiliser — an institution damps local "
              "forces and noise. Polariser — an echo chamber splits configurations apart along one axis.")),
])

thesis_tab = html.Div(className="tabbody", children=[
    section("Explore the assumptions",
            P("The source proposes that social and cognitive forces can explain patterns in moral judgement. "
              "Here those forces are chosen equations, not estimated causal laws. These experiments reveal "
              "what the chosen equations do; they cannot establish the truth, falsity or explanatory redundancy of moral realism.")),
    section("Fixed attractor experiment",
            dcc.Checklist(id="obj-on", options=[{"label": " include fixed pull in full-model views", "value": "on"}], value=[]),
            html.Div("Illustrative reference position", className="lbl"),
            dcc.Dropdown(id="obj-theory", value="Kantian deontology", clearable=False,
                         options=[{"label": t["name"], "value": t["name"]} for t in THEORIES]),
            P("Positions assigned to theories are author choices. Moral realism does not entail a physical pull toward any point."),
            html.Div("Strength k", className="lbl"),
            dcc.Slider(id="obj-k", min=0.0, max=1.6, step=0.1, value=0.4, marks={0: "0", 0.8: "0.8", 1.6: "1.6"})),
    section("Run assumption experiments",
            html.Button("Compare seven situations", id="run-obj", n_clicks=0, className="primary"),
            P("Shared starting configurations, traits and random draws. Compare spread with increasing fixed-pull strength; "
              "the sweep also includes k = 2, 4 and 8. These are synthetic conditions, not sampled societies."),
            html.Button("Explore changing conditions", id="run-rev", n_clicks=0, className="primary"),
            P("One simulated cohort passes through precarity, security, war and peace presets. Habit carries forward. "
              "An iteration is a model update, not a day or year.")),
    section("What the numbers mean",
            P("No held-out observations or calibrated measurement scales are used. Felt certainty, tension and strain are "
              "illustrative indices. Nearby points may share structure yet reach different verdicts; distant points may agree. "
              "A wider scope or more reflection is not a moral quality score.")),
])

app.layout = html.Div(id="root", children=[
    html.Div(id="left", children=[
        html.Div(style={"padding": "14px 16px 6px"}, children=[
            html.H2("Moral Decision Topology", style={"margin": 0, "fontSize": "19px"}),
            html.Div(f"v{__version__} · illustrative model laboratory", style={"fontSize": "11px", "color": MUTED})]),
        dcc.Tabs(id="left-tabs", value="scenario", className="tabs", children=[
            dcc.Tab(label="Case", value="scenario", children=scenario_tab),
            dcc.Tab(label="Levers", value="levers", children=levers_tab),
            dcc.Tab(label="Person", value="person", children=person_tab),
            dcc.Tab(label="Influences", value="influences", children=influence_tab),
            dcc.Tab(label="Assumptions", value="thesis", children=thesis_tab),
        ]),
    ]),
    html.Div(id="right", children=[
        html.Div(id="toolbar", children=[
            dcc.RadioItems(id="view", value="field", inline=True, className="seg",
                           options=[{"label": "Probe + cohort", "value": "probe"},
                                    {"label": "Force field", "value": "field"},
                                    {"label": "Population", "value": "population"}]),
            dcc.Checklist(id="overlays", inline=True, value=["octants", "attractors"], className="chk",
                          options=[{"label": "octant names", "value": "octants"},
                                   {"label": "regime clouds", "value": "regimes"},
                                   {"label": "moral theories", "value": "theories"},
                                   {"label": "certainty index", "value": "phi"},
                                   {"label": "endpoint clusters", "value": "attractors"}]),
            html.Div(id="pop-controls", children=[
                dcc.Dropdown(id="pop-init", value="Diverse mix", clearable=False, style={"width": "190px"},
                             options=[{"label": k, "value": k} for k in POPULATIONS]),
                html.Span("N", className="lbl"),
                dcc.Input(id="pop-n", type="number", value=200, min=20, max=400, step=20, debounce=True,
                          style={"width": "64px"}),
                html.Span("steps", className="lbl"),
                dcc.Input(id="pop-steps", type="number", value=60, min=10, max=200, step=10, debounce=True,
                          style={"width": "64px"}),
            ]),
        ]),
        dcc.Loading(dcc.Graph(id="graph", style={"height": "60vh"},
                              config={"displayModeBar": True, "scrollZoom": True}), type="dot"),
        dcc.Tabs(id="bottom-tabs", value="explain", className="tabs", children=[
            dcc.Tab(label="Explanation", value="explain", children=html.Div(className="bottom", children=[
                html.Div(dcc.Graph(id="decomp", config={"displayModeBar": False}), style={"flex": "1 1 55%"}),
                html.Div(id="readout", className="card", style={"flex": "1 1 45%"})])),
            dcc.Tab(label="Experiments", value="thesis", children=html.Div(style={"padding": "8px"}, children=[
                html.Div(id="obj-summary", className="card", children=P("Run the situation comparison from Assumptions.")),
                dcc.Loading(dcc.Graph(id="obj-fig", config={"displayModeBar": False})),
                html.Div(id="rev-summary", className="card", children=P("Run changing conditions from Assumptions.")),
                dcc.Loading(dcc.Graph(id="rev-fig", config={"displayModeBar": False}))])),
            dcc.Tab(label="Population", value="pop", children=html.Div(className="bottom", children=[
                html.Div(dcc.Graph(id="pop-fig", config={"displayModeBar": False}), style={"flex": "1 1 55%"}),
                html.Div(id="pop-stats", className="card", style={"flex": "1 1 45%"})])),
        ]),
    ]),
    dcc.Store(id="influences", data=[]),
])


# ---------------------------------------------------------------------------
# Callbacks
# ---------------------------------------------------------------------------
def _kv(ids, values):
    return {i["key"]: v for i, v in zip(ids, values)}


@app.callback(Output("case-card", "children"), Input("case", "value"))
def case_card(key):
    c = CASES[key]
    kids = [html.B(c["title"]), P("Case preview · press Load case to apply. An illustrative reconstruction; coordinates and coefficients are not fitted to this case."),
            html.Span(f"  literature tag: {c['grade']}", style={"fontSize": "11px", "color": GRADE_COLOR[c["grade"]]}),
            P(c["text"]), html.Div([html.B("Try: "), c["try_"]], style={"fontSize": "12.5px", "color": INK2})]
    if c.get("note"):
        kids.append(P(c["note"], fontStyle="italic"))
    return kids


@app.callback(
    Output({"type": "lever", "key": ALL}, "value"),
    Output({"type": "trait", "key": ALL}, "value"),
    Output("probe-x", "value"), Output("probe-y", "value"), Output("probe-z", "value"), Output("probe-w", "value"),
    Output("b-x", "value", allow_duplicate=True), Output("b-y", "value", allow_duplicate=True),
    Output("b-z", "value", allow_duplicate=True), Output("b-w", "value"), Output("b-on", "value"),
    Output("influences", "data", allow_duplicate=True),
    Input("btn-load", "n_clicks"), Input("btn-reset", "n_clicks"), Input("btn-zero", "n_clicks"),
    State("case", "value"),
    State({"type": "lever", "key": ALL}, "id"), State({"type": "trait", "key": ALL}, "id"),
    prevent_initial_call=True,
)
def load_case(_a, _b, _c, case_key, lever_ids, trait_ids):
    trig = dash.ctx.triggered_id
    keep = (no_update,) * 10
    if trig == "btn-zero":
        return ([0 for _ in lever_ids], [0 for _ in trait_ids]) + keep
    if trig == "btn-reset":
        return ([DEFAULT_LEVERS[i["key"]] for i in lever_ids], [0 for _ in trait_ids], -20, 20, -20, 0,
                55, 55, 45, -45, [], [])
    c = CASES[case_key]
    traits = c.get("traits", {})
    b = c.get("probe_b")
    b_vals = (*b, ["on"]) if b else (*(no_update,) * 4, [])
    return ([c["levers"][i["key"]] for i in lever_ids], [traits.get(i["key"], 0) for i in trait_ids],
            *c["probe"], *b_vals, [dict(d) for d in c.get("influences", [])])


@app.callback(
    Output("probe-x", "value", allow_duplicate=True), Output("probe-y", "value", allow_duplicate=True),
    Output("probe-z", "value", allow_duplicate=True),
    Output("inf-x", "value"), Output("inf-y", "value"), Output("inf-z", "value"),
    Output("b-x", "value"), Output("b-y", "value"), Output("b-z", "value"),
    Input("graph", "clickData"), State("click-mode", "value"), prevent_initial_call=True,
)
def on_click(click, mode):
    out = [no_update] * 9
    if not click or not click.get("points"):
        return out
    pt = click["points"][0]
    if not all(k in pt for k in ("x", "y", "z")):
        return out
    xyz = [round(float(pt[k])) for k in ("x", "y", "z")]
    slot = {"probe": 0, "influence": 3, "probe_b": 6}.get(mode)
    if slot is not None:
        out[slot:slot + 3] = xyz
    return out


@app.callback(
    Output("influences", "data"),
    Input("inf-add", "n_clicks"), Input("inf-undo", "n_clicks"), Input("inf-clear", "n_clicks"),
    State("influences", "data"), State("inf-type", "value"), State("inf-strength", "value"),
    State("inf-radius", "value"), State("inf-axis", "value"),
    State("inf-x", "value"), State("inf-y", "value"), State("inf-z", "value"),
)
def edit_influences(_a, _u, _c, data, kind, strength, radius, axis, x, y, z):
    data = list(data or [])
    trig = dash.ctx.triggered_id
    if trig == "inf-add":
        data.append(dict(type=kind, strength=float(strength), radius=float(radius), axis=axis,
                         pos=[float(x or 0), float(y or 0), float(z or 0)]))
    elif trig == "inf-undo" and data:
        data.pop()
    elif trig == "inf-clear":
        data = []
    return data


@app.callback(Output("inf-list", "children"), Input("influences", "data"))
def list_influences(data):
    data = data or []
    return [html.Div(f"#{i + 1} {INFLUENCE_TYPES[d['type']]} at ({d['pos'][0]:.0f}, {d['pos'][1]:.0f}, "
                      f"{d['pos'][2]:.0f}) · s={d['strength']:.1f} · r={d['radius']:.0f}"
                      + (f" · axis {d['axis']}" if d["type"] == "polariser" else ""))
             for i, d in enumerate(data)] or [html.Span("none", style={"color": MUTED})]


def _objective(on, theory, k):
    if "on" in (on or []) and k and k > 0:
        return dict(strength=float(k), pos=np.asarray(THEORY_BY_NAME[theory]["pos"], float))
    return None


def _share_text(ends):
    counts = {}
    for p in ends:
        _, o = octant_of(*p[:3])
        counts[o["name"]] = counts.get(o["name"], 0) + 1
    top = sorted(counts.items(), key=lambda kv: -kv[1])[:3]
    return ", ".join(f"{n} {100 * c / len(ends):.0f}%" for n, c in top)


def build_readout(probe, L, Tr, comps, traj, ensemble, objective):
    p = np.asarray(probe, float)
    key, octo = octant_of(*p[:3])
    reg, dist = nearest_regime(p)
    end = traj[-1]
    _, oend = octant_of(*end[:3])
    mags = {k: float(np.linalg.norm(v)) for k, v in comps.items()}
    total_mag = sum(mags.values()) or 1.0
    top = sorted(mags.items(), key=lambda kv: -kv[1])[:5]
    phi0, phi1 = float(felt_objectivity(p[None], L)[0]), float(felt_objectivity(end[None], L)[0])
    strain = float(moral_strain(end[None], L, Tr)[0])
    obj_share = 100 * mags.get("objective", 0.0) / total_mag
    kids = [
        html.Div([html.B(octo["name"]), html.Span(f"  ·  nearest regime: {reg['name']}",
                                                   style={"color": MUTED, "fontSize": "12px"})]),
        P(octo["desc"] + " Typical acts: " + octo["acts"]),
        html.Div(style={"display": "grid", "gridTemplateColumns": "auto 1fr", "gap": "2px 10px",
                        "fontSize": "12px"}, children=[
            html.Span("scope", style={"color": MUTED}), html.Span(f"{p[0]:.0f} · {band('x', p[0])}"),
            html.Span("binding", style={"color": MUTED}), html.Span(f"{p[1]:.0f} · {band('y', p[1])}"),
            html.Span("processing", style={"color": MUTED}), html.Span(f"{p[2]:.0f} · {band('z', p[2])}"),
            html.Span("tilt", style={"color": MUTED}), html.Span(f"{p[3]:.0f} · {band('w', p[3])}"),
        ]),
        html.Hr(),
        html.Div([html.B("Illustrative endpoint after 40 iterations: "), oend["name"],
                  f" ({end[0]:.0f}, {end[1]:.0f}, {end[2]:.0f}, w {end[3]:.0f})"], style={"fontSize": "12.5px"}),
    ]
    if ensemble is not None and ensemble.shape[1] > 0:
        kids.append(html.Div([html.B("Cohort split: "), _share_text(ensemble[-1])], style={"fontSize": "12.5px"}))
    kids += [
        html.Div([html.B("Felt-certainty index: "), f"{phi0:.2f} → {phi1:.2f}",
                  html.Span("  (stipulated 0–1 index; not a measured probability)",
                            style={"color": MUTED})], style={"fontSize": "12.5px"}),
        html.Div([html.B("Commitment/pressure index: "), f"{strain:.2f}"], style={"fontSize": "12.5px"}),
        html.Hr(),
        html.B("Initial modeled pushes", style={"fontSize": "12.5px"}),
        html.Ul([html.Li(f"{COMPONENT_LABEL[k]} ({100 * m / total_mag:.0f}% of component magnitudes): {COMPONENT_MECH[k]}.",
                         style={"fontSize": "12px"}) for k, m in top if m > 0.5]),
        P(f"Noise σ = {float(noise_sigma(L)):.1f} per model unit. Component shares can cancel; they are not shares of endpoint change. "
          + (f"The fixed attractor contributes {obj_share:.0f}% of component magnitudes."
             if objective else "No fixed attractor is active. The deterministic line omits noise; cohort paths include it."), fontWeight=600),
    ]
    return kids


def disagreement_readout(now, after):
    sh = now["share"]
    parts = ", ".join(f"{AXIS_TOPIC[i]} {100 * sh[i]:.0f}%" for i in np.argsort(-sh) if sh[i] > 0)
    direction = "decreases" if after["distance"] < now["distance"] else "increases" if after["distance"] > now["distance"] else "stays unchanged"
    return [
        html.Div([html.B("Structural comparison A ↔ B: "), now["level"]]),
        P(f"Weighted distance {now['distance']:.1f}. " + (f"Squared-distance shares: {parts}." if parts else "The configurations coincide; no axis dominates.")),
        P(f"Illustrative tension index {now['intensity']:.2f}; overlap proxy {now['intelligibility']:.2f}. "
          "These are chosen transforms of distance, not measured disagreement or mutual understanding. "
          "Distance uses x/y/z weight 1 and colour-axis w weight 0.6."),
        P(f"After 40 iterations under the same conditions, distance {direction} to {after['distance']:.1f}. "
          "Structural similarity does not establish agreement on a verdict."),
    ]


@app.callback(
    Output("graph", "figure"), Output("decomp", "figure"), Output("readout", "children"),
    Output("pop-fig", "figure"), Output("pop-stats", "children"), Output("pop-controls", "style"),
    Input({"type": "lever", "key": ALL}, "value"), Input({"type": "trait", "key": ALL}, "value"),
    Input("probe-x", "value"), Input("probe-y", "value"), Input("probe-z", "value"), Input("probe-w", "value"),
    Input("influences", "data"), Input("view", "value"), Input("overlays", "value"),
    Input("obj-on", "value"), Input("obj-theory", "value"), Input("obj-k", "value"),
    Input("pop-init", "value"), Input("pop-n", "value"), Input("pop-steps", "value"),
    Input("cohort", "value"), Input("click-mode", "value"),
    Input("b-on", "value"), Input("b-x", "value"), Input("b-y", "value"), Input("b-z", "value"), Input("b-w", "value"),
    State({"type": "lever", "key": ALL}, "id"), State({"type": "trait", "key": ALL}, "id"),
)
def update(lever_vals, trait_vals, px, py, pz, pw, influences, view, overlays, obj_on, obj_theory, obj_k,
           pop_init, pop_n, pop_steps, cohort, click_mode, b_on, bx, by, bz, bw, lever_ids, trait_ids):
    L = to_unit(_kv(lever_ids, lever_vals))
    traits = _kv(trait_ids, trait_vals)
    tr = np.array([float(traits.get(k, 0) or 0) for k in TRAIT_KEYS])
    probe = np.clip(np.array([px or 0, py or 0, pz or 0, pw or 0], float), -100, 100)
    objective = _objective(obj_on, obj_theory, obj_k)
    influences = influences or []
    overlays = overlays or []

    titles = {"probe": "One starting configuration · 40 model iterations",
              "field": "Modeled drift · w = 0 slice · no personal anchors",
              "population": "Synthetic configurations under the current conditions"}
    fig = base_figure(titles[view])
    if "octants" in overlays:
        add_octant_labels(fig)
    if "regimes" in overlays:
        add_regime_clouds(fig)
    if "theories" in overlays:
        add_theories(fig)
    if "phi" in overlays:
        add_objectivity_isosurface(fig, L, w_slice=probe[3])
    if objective:
        add_objective_marker(fig, objective["pos"], objective["strength"])
    add_influences(fig, influences)
    if click_mode != "off" and view != "population":
        add_click_lattice(fig)

    # Probe decomposition and paths (always computed; drives the Explanation panel).
    comps = {k: v[0] for k, v in components(probe[None], L, tr[None], influences=influences,
                                             objective=objective).items()}
    net = sum(comps.values())
    traj = simulate(probe[None], L, tr[None], steps=40, influences=influences, objective=objective,
                    noise=False)[:, 0, :]
    ensemble = None
    if cohort:
        rng = np.random.default_rng(7)
        S0 = np.clip(probe[None] + rng.normal(0, 6, size=(int(cohort), 4)), -100, 100)
        TrC = np.clip(tr[None] + rng.normal(0, 0.9, size=(int(cohort), 5)), -3, 3)
        ensemble = simulate(S0, L, TrC, steps=40, influences=influences, objective=objective, seed=3)

    probe_b, dis = None, None
    if "on" in (b_on or []):
        probe_b = np.clip(np.array([bx or 0, by or 0, bz or 0, bw or 0], float), -100, 100)
        traj_b = simulate(probe_b[None], L, tr[None], steps=40, influences=influences, objective=objective,
                          noise=False)[:, 0, :]
        dis = (disagreement(probe, probe_b, L), disagreement(traj[-1], traj_b[-1], L))

    pop_style = {"display": "none"}
    pop_fig, pop_stats = octant_share_figure([], "Switch to Population view to simulate"), P("—")
    if view == "probe":
        add_probe(fig, probe, net, traj, ensemble)
    elif view == "field":
        add_field(fig, L, tr, influences, objective)
        add_probe(fig, probe, net, traj, ensemble)
    else:
        pop_style = {"display": "flex", "gap": "6px", "alignItems": "center"}
        n = int(np.clip(pop_n or 200, 20, 400))
        steps = int(np.clip(pop_steps or 60, 10, 200))
        S0, Tr = init_population(pop_init, n, seed=1)
        hist = simulate(S0, L, Tr, steps=steps, influences=influences, objective=objective, coupled=True, seed=2)
        add_population_animation(fig, hist)
        end = hist[-1]
        pop_fig = octant_share_figure(end, f"{n} simulated endpoints after {steps} iterations")
        phi = felt_objectivity(end, L)
        sd0, sd1 = hist[0].std(axis=0), end.std(axis=0)
        pop_stats = [
            html.B("Population summary"),
            P(f"Mean position ({end[:, 0].mean():.0f}, {end[:, 1].mean():.0f}, {end[:, 2].mean():.0f}), "
              f"tilt {end[:, 3].mean():.0f}."),
            P(f"Spread (SD x/y/z/w): start {sd0[0]:.0f}/{sd0[1]:.0f}/{sd0[2]:.0f}/{sd0[3]:.0f} → "
              f"end {sd1[0]:.0f}/{sd1[1]:.0f}/{sd1[2]:.0f}/{sd1[3]:.0f}. Spread reflects stipulated trait variation, disposition anchors and simulated noise."),
            P(f"Mean certainty index {phi.mean():.2f}; {100 * (phi > 0.7).mean():.0f}% exceed the arbitrary 0.7 display threshold."),
            P("Press ▶ Play in the 3D view to watch the drift. Conformity is local: people converge on "
              "neighbours, so subcultures can form."),
        ]

    if probe_b is not None and view != "population":
        add_probe_b(fig, probe, probe_b, traj_b,
                    drift(probe_b[None], L, tr[None], influences=influences, objective=objective)[0])

    if "attractors" in overlays and view in ("field", "probe"):
        add_attractors(fig, find_attractors(L, tr, influences=influences, objective=objective, grid=4))

    readout = build_readout(probe, L, tr, comps, traj, ensemble, objective)
    if dis is not None:
        readout = disagreement_readout(*dis) + [html.Hr(), html.B("Probe A", style={"fontSize": "12px"})] + readout
    return fig, decomposition_heatmap(comps), readout, pop_fig, pop_stats, pop_style


@app.callback(
    Output("obj-fig", "figure"), Output("obj-summary", "children"),
    Output("bottom-tabs", "value", allow_duplicate=True),
    Input("run-obj", "n_clicks"), State("obj-theory", "value"), State("obj-k", "value"),
    prevent_initial_call=True,
)
def run_objectivity(_n, theory, k):
    pos = np.asarray(THEORY_BY_NAME[theory]["pos"], float)
    k_user = float(k) if k is not None else 0.0
    res = objectivity_test(ECOLOGIES, pos, show_strengths=(0.0, k_user))
    ks = res["strengths"]
    i_user = ks.index(k_user)
    b0, w0 = res["spread"][0], res["within"][0]
    bu, wu = res["spread"][i_user], res["within"][i_user]
    bm, wm = res["spread"][-1], res["within"][-1]
    summary = [
        html.B("Situation-dependence experiment"),
        P(f"At k = 0: between-situation RMS spread {b0:.1f}; within-situation spread {w0:.1f}; "
          f"η² = {res['eta2'][0]:.2f}. These describe only this generated sample."),
        P(f"For the chosen reference '{theory}', at k = {k_user:g}: between spread {bu:.1f}, within spread {wu:.1f}. "
          f"At k = {ks[-1]:g}: {bm:.1f} and {wm:.1f}. A fixed pull changes these spreads by construction."),
        P("The starting configurations, traits and random draws are paired. Noise amplitudes can differ with the conditions. "
          "No observed dataset is compared, so this experiment does not test whether moral realism explains human behaviour. "
          "The cooperation core is explicitly supplied, not independently discovered."),
    ]
    return objectivity_test_figure(res, pos, k_user), summary, "thesis"


@app.callback(
    Output("rev-fig", "figure"), Output("rev-summary", "children"),
    Output("bottom-tabs", "value", allow_duplicate=True),
    Input("run-rev", "n_clicks"), State("obj-theory", "value"), State("obj-k", "value"),
    prevent_initial_call=True,
)
def run_reversal(_n, theory, k):
    rv = reversal_test(REVERSAL_PHASES)
    strength = float(k) if k is not None else 0.0
    obj = dict(strength=strength, pos=np.asarray(THEORY_BY_NAME[theory]["pos"], float))
    rv_obj = reversal_test(REVERSAL_PHASES, objective=obj)
    M, Mo, b = rv["means"], rv_obj["means"], rv["bounds"]
    ends = [e for _, e, _ in b]
    x_pre, x_sec, x_war, x_peace = (M[e, 0] for e in ends)
    phi_end = [rv["phi"][e] for e in ends]
    peak = b[int(np.argmax(phi_end))][2]
    drop, drop_o = x_sec - x_war, Mo[ends[1], 0] - Mo[ends[2], 0]
    summary = [
        html.B("Reversal test"),
        P(f"Scope: {x_pre:.0f} under precarity → {x_sec:.0f} under security → {x_war:.0f} when war returns → "
          f"{x_peace:.0f} after peace (residue from the earlier phases: {x_peace - x_sec:+.0f}). Felt objectivity "
          f"at phase ends: " + ", ".join(f"{lbl} {v:.2f}" for (_, _, lbl), v in zip(b, phi_end))
          + f" — highest in '{peak}'."),
        P(f"The security-to-war scope difference is {drop:.1f} units without the fixed pull and {drop_o:.1f} "
          f"with the reference '{theory}' at k = {strength:g}. Both runs share initial conditions and random draws. "
          "This is a sensitivity experiment under the chosen equations; reversal does not establish or refute any moral theory."),
    ]
    return reversal_figure(rv, rv_obj), summary, "thesis"


# Keep control panes mounted: the main callback depends on controls from every
# tab, including pattern-matching lever/trait inputs. Tabs select visibility only.
def _mount_tab_panes(tabs, prefix):
    panes = []
    for tab in tabs.children:
        panes.append(html.Div(tab.children, id=f"{prefix}-{tab.value}",
                              style={"display": "block" if tab.value == tabs.value else "none"}))
        tab.children = None
    return html.Div(panes)


laboratory = app.layout
left, right = laboratory.children[:2]
left.children.append(_mount_tab_panes(left.children[1], "lab-pane"))
right.children.append(_mount_tab_panes(right.children[-1], "lab-result"))


@app.callback(*[Output(f"lab-pane-{key}", "style") for key in
                ("scenario", "levers", "person", "influences", "thesis")], Input("left-tabs", "value"))
def show_lab_pane(active):
    return [{"display": "block" if active == key else "none"}
            for key in ("scenario", "levers", "person", "influences", "thesis")]


@app.callback(*[Output(f"lab-result-{key}", "style") for key in ("explain", "thesis", "pop")],
              Input("bottom-tabs", "value"))
def show_lab_result(active):
    return [{"display": "block" if active == key else "none"} for key in ("explain", "thesis", "pop")]


from .guided import build_layout, register_callbacks  # noqa: E402

app.layout = html.Div([
    html.Header(className="site-nav", children=[
        html.A([html.Span("MT", className="brand-mark"), "Moral Topology"], href="#", className="brand"),
        dcc.RadioItems(id="workspace-mode", value="laboratory", inline=True,
                      options=[{"label": "Full model", "value": "laboratory"},
                               {"label": "Guided exploration", "value": "guided"}], className="workspace-switch"),
        html.Span("Decision-mapping studio", className="nav-caption"),
        html.Span(f"v{__version__}", className="nav-build"),
    ]),
    html.Main(build_layout(), id="guided-workspace", style={"display": "none"}),
    html.Main([html.Div("Full model · independent sandbox. Controls here do not change the guided comparison.",
                        className="lab-notice"), laboratory], id="lab-workspace"),
])
register_callbacks(app)


@app.callback(Output("guided-workspace", "style"), Output("lab-workspace", "style"),
              Input("workspace-mode", "value"))
def show_workspace(active):
    return ({"display": "block" if active == "guided" else "none"},
            {"display": "block" if active == "laboratory" else "none"})


app.index_string = """<!DOCTYPE html>
<html><head>{%metas%}<title>{%title%}</title>{%favicon%}{%css%}</head>
<body>{%app_entry%}<footer>{%config%}{%scripts%}{%renderer%}</footer></body></html>"""


def find_free_port(start=8150, tries=50):
    for port in range(start, start + tries):
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            try:
                s.bind(("127.0.0.1", port))
                return port
            except PermissionError:
                raise PermissionError("Local preview requires permission to bind a loopback port") from None
            except OSError:
                continue
    raise RuntimeError("no free port found")


def main():
    port = find_free_port()
    print(f"Moral Decision Topology v{__version__} → http://127.0.0.1:{port}")
    app.run(debug=False, port=port)


if __name__ == "__main__":
    main()

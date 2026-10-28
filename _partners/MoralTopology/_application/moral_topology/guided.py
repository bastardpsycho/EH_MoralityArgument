"""Guided consumer experience for paired moral-topology comparisons."""

from __future__ import annotations

import json
import time
from typing import Any

import plotly.graph_objects as go
from dash import Input, Output, State, ctx, dcc, html, no_update

from . import __version__
from .comparison import compare_conditions
from .levers import LEVER_BY_KEY, LEVERS
from .scenarios import CASES
from .space import band


AXIS_GUIDE = {
    "x": {
        "question": "Who counts?",
        "ends": "Self \u2194 sentient life",
        "short": "Scope",
        "axis_title": "Who counts?",
        "ticktext": ["Self", "Society", "Sentient"],
    },
    "y": {
        "question": "What holds the norm in place?",
        "ends": "External sanction \u2194 inner conviction",
        "short": "Binding",
        "axis_title": "What holds the norm?",
        "ticktext": ["Outside", "Mixed", "Conviction"],
    },
    "z": {
        "question": "How is the decision made?",
        "ends": "Fast intuition \u2194 slow reflection",
        "short": "Processing",
        "axis_title": "How is it decided?",
        "ticktext": ["Intuition", "Mixed", "Reflection"],
    },
    "w": {
        "question": "Which concerns get more weight?",
        "ends": "Care and fairness \u2194 loyalty, authority and sanctity",
        "short": "Foundation tilt",
        "axis_title": "Foundation tilt (shown in endpoint cards)",
        "ticktext": [],
    },
}


# Each example changes one lever so the paired comparison isolates one model input.
SUGGESTIONS: dict[str, tuple[str, int]] = {
    "everyday": ("scarcity", 9),
    "milgram": ("empathy_i", 8),
    "bystander": ("threat", 8),
    "battalion": ("conformity", 0),
    "rescuer": ("contact", 0),
    "whistleblower": ("delib", 2),
    "fraud": ("stakes", 10),
    "disaster": ("shared_fate", 0),
    "famine_lowtrust": ("rule_of_law", 9),
    "honour": ("rule_of_law", 9),
    "sacred": ("market", 0),
    "war_fusion": ("threat", 0),
    "outrage": ("contact", 8),
    "pandemic": ("pathogen", 0),
    "trolley": ("delib", 9),
    "ea": ("scarcity", 8),
    "markets": ("kin_intensity", 8),
    "animals": ("scarcity", 8),
    "theocracy": ("contact", 8),
    "dispute": ("contact", 8),
    "reform": ("contact", 9),
}

BASELINE_RUN = {"case_key": None, "lever_key": None, "value": None, "mode": "baseline", "result": None}
DEFAULT_CASE = "everyday"
DEFAULT_LEVER, DEFAULT_VALUE = SUGGESTIONS[DEFAULT_CASE]


def _lever_value(case_key: str, lever_key: str) -> float:
    return float(CASES[case_key]["levers"].get(lever_key, LEVER_BY_KEY[lever_key].default))


def _lever_label(lever_key: str) -> str:
    return LEVER_BY_KEY[lever_key].label


def _placeholder_figure(is_2d: bool = False) -> go.Figure:
    fig = go.Figure()
    if is_2d:
        fig.update_layout(
            xaxis=dict(title="Who counts?", range=[-100, 100], gridcolor="#243653", zerolinecolor="#446184"),
            yaxis=dict(title="What holds the norm?", range=[-100, 100], gridcolor="#243653",
                       zerolinecolor="#446184", scaleanchor="x", scaleratio=1),
            annotations=[dict(text="Run a comparison to see where the paths move", x=0, y=0,
                              xref="x", yref="y", showarrow=False, font=dict(color="#9fb0cc", size=14))],
            margin=dict(l=24, r=24, t=18, b=36),
        )
    else:
        fig.update_layout(
            xaxis=dict(visible=False), yaxis=dict(visible=False),
            scene=dict(
                xaxis=dict(title="Who counts?", range=[-100, 100], backgroundcolor="#0b1428",
                           gridcolor="#243653", zerolinecolor="#446184", tickvals=[-100, 0, 100],
                           ticktext=["Self", "Society", "Sentient"]),
                yaxis=dict(title="What holds the norm?", range=[-100, 100], backgroundcolor="#0b1428",
                           gridcolor="#243653", zerolinecolor="#446184", tickvals=[-100, 0, 100],
                           ticktext=["Outside", "Mixed", "Conviction"]),
                zaxis=dict(title="How is it decided?", range=[-100, 100], backgroundcolor="#0b1428",
                           gridcolor="#243653", zerolinecolor="#446184", tickvals=[-100, 0, 100],
                           ticktext=["Intuition", "Mixed", "Reflection"]),
                bgcolor="#0b1428", aspectmode="cube",
            ),
            annotations=[dict(text="Run a comparison to see where the paths move", x=0.5, y=0.5,
                              xref="paper", yref="paper", showarrow=False,
                              font=dict(color="#9fb0cc", size=14))],
            margin=dict(l=0, r=0, t=8, b=0),
        )
    fig.update_layout(
        paper_bgcolor="rgba(0,0,0,0)", plot_bgcolor="#0b1428", font=dict(family="Avenir Next, Inter, sans-serif", color="#e8f0ff", size=11),
        hoverlabel=dict(bgcolor="#172a46", bordercolor="#365274", font=dict(color="#e8f0ff", size=12)),
        showlegend=False, uirevision="guide-empty",
    )
    return fig


def _case_context(case_key: str) -> html.Div:
    case = CASES[case_key]
    contents: list[Any] = [
        html.P(case["text"], className="guide-case-copy"),
        html.P([html.Strong("Try this in Full model. "), case.get("try_", "")], className="guide-case-prompt"),
        html.P(
            f"Case library evidence tag: {case.get('grade', 'unrated')}. Illustrative reconstruction; "
            "literature tags do not validate coordinates.",
            className="guide-case-caveat",
        ),
    ]
    if case.get("note"):
        contents.append(html.P(case["note"], className="guide-case-note"))
    if case.get("probe_b") is not None:
        contents.append(html.P(
            "This case includes configurations A and B. The guided comparison follows A. Choose Full model "
            "and load this case to inspect both configurations and their structural comparison.",
            className="guide-case-caveat",
        ))
    return html.Div(contents)


def _axis_legend() -> html.Div:
    return html.Div(
        className="guide-axis-legend",
        children=[
            html.Div(className="guide-axis-legend-title", children="Read the space as four questions"),
            html.Div(
                className="guide-axis-legend-grid",
                children=[
                    html.Div(className="guide-axis-legend-item", children=[
                        html.Span(axis.upper(), className=f"guide-axis-dot guide-axis-dot-{axis}"),
                        html.Div([html.Strong(meta["question"]), html.Span(meta["ends"])])
                    ])
                    for axis, meta in AXIS_GUIDE.items()
                ],
            ),
        ],
    )


def build_layout() -> html.Div:
    """Return the standalone guided page content; the host app supplies top navigation."""
    case_options = [{"label": case["title"], "value": key} for key, case in CASES.items()]
    lever_options = [
        {"label": f"{lever.label}  ·  {lever.group}", "value": lever.key}
        for lever in LEVERS
    ]
    default_suggestion = SUGGESTIONS[DEFAULT_CASE]
    selected_lever = LEVER_BY_KEY[default_suggestion[0]]
    baseline_value = _lever_value(DEFAULT_CASE, default_suggestion[0])
    initial_result = compare_conditions(DEFAULT_CASE, {default_suggestion[0]: default_suggestion[1]},
                                        steps=40, seed=7, n=40)
    initial_record = _run_record(DEFAULT_CASE, default_suggestion[0], default_suggestion[1],
                                 "suggested", initial_result)
    initial_cards, initial_shift = _render_outcomes(initial_result)

    return html.Div(id="guide-page", className="guide-page", children=[
        dcc.Store(id="guide-run-store", data=initial_record),
        html.Header(className="guide-masthead", children=[
            html.Div(className="guide-masthead-copy", children=[
                html.Div(className="guide-kicker", children=[
                    html.Span(className="guide-kicker-mark"), "Moral Topology · Guided exploration"
                ]),
                html.H1(["Same decision.", html.Span("Different pressures.")]),
                html.P(
                    "Explore how circumstances can reshape a judgement: who matters, what feels binding, and how "
                    "we decide. Change one condition to compare two paths.",
                    className="guide-lede",
                ),
                html.Div(className="guide-method-strip", children=[
                    html.Span("One changed condition"), html.Span("Shared starting point"),
                    html.Span("Four dimensions to explore"),
                ]),
            ]),
            html.Div(className="guide-orbit-art", **{"aria-hidden": "true"}, children=[
                html.I(className="guide-orbit-ring guide-orbit-ring-one"),
                html.I(className="guide-orbit-ring guide-orbit-ring-two"),
                html.I(className="guide-orbit-ring guide-orbit-ring-three"),
                html.I(className="guide-orbit-core"),
                html.Span("ONE CHANGE / TWO PATHS", className="guide-orbit-caption"),
            ]),
        ]),
        html.Div(className="guide-workspace", children=[
            html.Aside(className="guide-sidebar", children=[
                html.Section(className="guide-control-block", children=[
                    html.Div(className="guide-step-label", children=[html.Span("01"), " Choose a situation"]),
                    html.Label("Situation", htmlFor="guide-case-select", className="guide-label"),
                    dcc.Dropdown(
                        id="guide-case-select", options=case_options, value=DEFAULT_CASE,
                        clearable=False, searchable=True, className="guide-dropdown",
                    ),
                    html.Details(className="guide-context-details", children=[
                        html.Summary("Read the case context and source note"),
                        html.Div(id="guide-case-context", children=_case_context(DEFAULT_CASE)),
                    ]),
                ]),
                html.Section(className="guide-control-block guide-condition-block", children=[
                    html.Div(className="guide-step-label", children=[html.Span("02"), " Change a condition"]),
                    html.Label("Condition to change", htmlFor="guide-lever-select", className="guide-label"),
                    dcc.Dropdown(
                        id="guide-lever-select", options=lever_options, value=default_suggestion[0],
                        clearable=False, searchable=True, className="guide-dropdown",
                    ),
                    html.Div(id="guide-lever-mechanism", className="guide-mechanism", children=selected_lever.mechanism),
                    html.Div(className="guide-lever-readout", children=[
                        html.Div([html.Span("Case baseline"), html.Strong(id="guide-baseline-value",
                                   children=f"{baseline_value:g} / 10")]),
                        html.Div([html.Span("Changed condition"), html.Strong(id="guide-value-label",
                                   children=f"{default_suggestion[1]} / 10")]),
                    ]),
                    dcc.Slider(
                        id="guide-lever-slider", min=0, max=10, step=1, value=default_suggestion[1],
                        marks={0: "0", 5: "5", 10: "10"}, updatemode="mouseup",
                        tooltip={"placement": "bottom", "always_visible": True, "template": "{value}"},
                        className="guide-slider",
                    ),
                    html.Div(id="guide-suggestion-copy", className="guide-suggestion-copy", children=[
                        html.Strong("Suggested change · "),
                        f"{selected_lever.label}: {default_suggestion[1]} / 10. ",
                        "You can choose any lever and value.",
                    ]),
                    html.Div(className="guide-button-row", children=[
                        html.Button("Try suggested change", id="guide-suggest-button",
                                    className="guide-button guide-button-soft", n_clicks=0),
                        html.Button("Reset to case baseline", id="guide-reset-button",
                                    className="guide-button guide-button-text", n_clicks=0),
                    ]),
                    html.Button("Run comparison", id="guide-run-button",
                                className="guide-button guide-button-primary", n_clicks=0),
                    html.Div(
                        id="guide-status", className="guide-status", role="status", **{"aria-live": "polite"},
                        children=_status_for(initial_record, initial_result),
                    ),
                ]),
                html.Div(className="guide-sidebar-footnote", children=[
                    html.Span("A model experiment, not a verdict."),
                    "Use it to compare framings, surface assumptions, and decide what to investigate in real life.",
                ]),
            ]),
            html.Main(className="guide-stage-column", children=[
                html.Section(className="guide-map-stage", children=[
                    html.Div(className="guide-stage-heading", children=[
                        html.Div([html.Div(className="guide-step-label guide-step-label-dark",
                                           children=[html.Span("03"), " See what moved"]),
                                  html.H2("Two paths through the same space"),
                                  html.P("The original case and the changed condition share a start "
                                         "and the same simulated setup. The map is fitted to the paths; Full space shows all axes.", className="guide-stage-subtitle")]),
                        dcc.Checklist(
                            id="guide-projection-toggle", options=[{"label": "2D view", "value": "2d"},
                                                                  {"label": "Full space", "value": "full"}],
                            value=[], className="guide-projection-toggle",
                        ),
                    ]),
                    dcc.Graph(
                        id="guide-map", figure=_comparison_figure(initial_result), className="guide-map",
                        config={"displayModeBar": "hover", "displaylogo": False, "scrollZoom": False,
                                "responsive": True},
                        responsive=True,
                    ),
                    html.Div(className="guide-path-key", children=[
                        html.Span([html.I(className="guide-path-swatch guide-swatch-baseline"),
                                   html.Strong("Original case")]),
                        html.Span([html.I(className="guide-path-swatch guide-swatch-changed"),
                                   html.Strong("Changed condition")]),
                        html.Span(className="guide-path-key-note", children="Both paths share a start. Hover for model iteration and w position."),
                    ]),
                    _axis_legend(),
                ]),
                html.Section(className="guide-readout-section", children=[
                    html.Div(className="guide-section-heading", children=[
                        html.Div([html.Span("Endpoint readout", className="guide-eyebrow"),
                                  html.H2("Where did the probe finish?")]),
                        html.Span("Coordinate ranges describe model configurations, not moral worth.",
                                  className="guide-section-note"),
                    ]),
                    html.Div(id="guide-outcome-cards", className="guide-outcome-grid", children=initial_cards),
                    html.Div(id="guide-shift-summary", className="guide-shift-summary", children=initial_shift),
                ]),
                html.Div(className="guide-detail-grid", children=[
                    html.Section(className="guide-detail-card guide-forces-card", children=[
                        html.Span("At the starting point", className="guide-eyebrow"),
                        html.H3("Which initial forces differed?"),
                        html.P("Largest signed contribution differences at the shared probe, before "
                               "integration or noise. Feedback along the path can change their later effects.",
                               className="guide-detail-intro"),
                        html.Div(id="guide-force-differences", children=_force_differences(initial_result)),
                    ]),
                    html.Section(className="guide-detail-card guide-cohort-card", children=[
                        html.Span("Across simulated people", className="guide-eyebrow"),
                        html.H3("How much did the cohort vary?"),
                        html.Div(id="guide-cohort-readout", children=_cohort_readout(initial_result)),
                    ]),
                ]),
                html.Section(className="guide-assumptions", children=[
                    html.Details(children=[
                        html.Summary("Assumptions and limits"),
                        html.Div(className="guide-assumption-copy", children=[
                            html.P("Iterations are model steps, not clock time. This illustrative model is "
                                   "not calibrated to predict individual decisions, diagnose people, or "
                                   "establish which choice is morally correct."),
                            html.P("Both arms use the same starting probe, cohort members, trait settings, "
                                   "and seeded noise draws. The probe itself runs without noise. Cohort "
                                   "ranges show simulated variation and are not statistical confidence intervals."),
                            html.P("A lever changes a stipulated model input. A resulting path is a consequence "
                                   "of those rules, not evidence that changing the real-world condition would "
                                   "cause the same outcome."),
                        ]),
                    ]),
                    html.Div(className="guide-export-row", children=[
                        html.Span("Keep a reproducible copy of these inputs and results."),
                        html.Button("Download comparison JSON", id="guide-download-button",
                                    className="guide-button guide-download-button", n_clicks=0),
                        dcc.Download(id="guide-download"),
                    ]),
                ]),
            ]),
        ]),
    ])


def _empty_outcome_card(axis: str) -> html.Div:
    meta = AXIS_GUIDE[axis]
    return html.Article(className=f"guide-outcome-card guide-outcome-{axis}", children=[
        html.Div(className="guide-outcome-top", children=[
            html.Span(axis.upper(), className=f"guide-axis-code guide-axis-code-{axis}"),
            html.Span(meta["short"], className="guide-outcome-axis"),
        ]),
        html.H3(meta["question"]),
        html.Div(meta["ends"], className="guide-outcome-ends"),
        html.Div(className="guide-endpoint-pair", children=[
            html.Div([html.Span("Original"), html.Strong("—", className="guide-baseline-endpoint")]),
            html.Div([html.Span("Changed"), html.Strong("—", className="guide-changed-endpoint")]),
        ]),
        html.Div(className="guide-delta-row", children=[
            html.Span("Changed − original", className="guide-delta-label"),
            html.Strong("—", className="guide-delta-value"),
        ]),
    ])


def _axis_text(axis: str, value: float) -> str:
    return f"{value:+.1f} · {band(axis, value)}"


def _format_delta(value: float) -> str:
    return f"{value:+.1f}" if abs(value) >= 0.05 else "0.0"


def _outcome_card(axis: str, baseline: float, changed: float) -> html.Article:
    meta = AXIS_GUIDE[axis]
    delta = changed - baseline
    return html.Article(className=f"guide-outcome-card guide-outcome-{axis}", children=[
        html.Div(className="guide-outcome-top", children=[
            html.Span(axis.upper(), className=f"guide-axis-code guide-axis-code-{axis}"),
            html.Span(meta["short"], className="guide-outcome-axis"),
        ]),
        html.H3(meta["question"]),
        html.Div(meta["ends"], className="guide-outcome-ends"),
        html.Div(className="guide-endpoint-pair", children=[
            html.Div([html.Span("Original"), html.Strong(_axis_text(axis, baseline), className="guide-baseline-endpoint")]),
            html.Div([html.Span("Changed"), html.Strong(_axis_text(axis, changed), className="guide-changed-endpoint")]),
        ]),
        html.Div(className="guide-delta-row", children=[
            html.Span("Changed \u2212 original", className="guide-delta-label"),
            html.Strong(_format_delta(delta), className="guide-delta-value"),
        ]),
    ])


def _vector(value: Any) -> list[float]:
    if not isinstance(value, (tuple, list)) or len(value) < 4:
        return [0.0, 0.0, 0.0, 0.0]
    return [float(component) for component in value[:4]]


def _path(arm: dict[str, Any], fallback: list[float]) -> list[list[float]]:
    raw = arm.get("path")
    if not isinstance(raw, list) or not raw:
        start = _vector(arm.get("start", fallback))
        end = _vector(arm.get("end", start))
        return [start, end]
    return [_vector(point) for point in raw]


def _comparison_figure(result: dict[str, Any], is_2d: bool = False, full_space: bool = False) -> go.Figure:
    probe = result.get("probe", {})
    start = _vector(probe.get("initial", [0, 0, 0, 0]))
    baseline_path = _path(probe.get("baseline", {}), start)
    changed_path = _path(probe.get("changed", {}), start)
    # Use an equal numerical span on all spatial axes so fitted views preserve
    # relative geometry. Both arms share the same ranges and the full space is
    # always available; this is presentation only.
    points = baseline_path + changed_path
    lows = [min(p[i] for p in points) for i in range(3)]
    highs = [max(p[i] for p in points) for i in range(3)]
    span = min(200.0, max(45.0, max(b-a for a, b in zip(lows, highs)) + 20.0))
    centers = [max(-100 + span/2, min(100 - span/2, (a+b)/2)) for a,b in zip(lows,highs)]
    ranges = [[-100,100]]*3 if full_space else [[c-span/2,c+span/2] for c in centers]
    fig = go.Figure()
    arms = [
        ("Original case", baseline_path, "#57DDF5", "dash", "circle-open"),
        ("Changed condition", changed_path, "#F38BC8", "solid", "diamond"),
    ]
    for name, points, color, dash, endpoint_symbol in arms:
        xs = [point[0] for point in points]
        ys = [point[1] for point in points]
        zs = [point[2] for point in points]
        custom = [[index, point[3]] for index, point in enumerate(points)]
        if is_2d:
            fig.add_trace(go.Scatter(
                x=xs, y=ys, mode="lines", name=name, line=dict(color=color, width=3, dash=dash),
                customdata=custom,
                hovertemplate=("<b>%{fullData.name}</b><br>iteration %{customdata[0]}<br>"
                               "scope x=%{x:.1f}<br>binding y=%{y:.1f}<br>foundation tilt w=%{customdata[1]:.1f}"
                               "<extra></extra>"),
            ))
            fig.add_trace(go.Scatter(
                x=[xs[-1]], y=[ys[-1]], mode="markers", name=f"{name} endpoint", showlegend=False,
                marker=dict(size=10, color=color, symbol=endpoint_symbol,
                            line=dict(color="#e8f0ff", width=1.5)),
                customdata=[[len(points) - 1, points[-1][3]]],
                hovertemplate=(f"<b>{name} endpoint</b><br>scope x=%{{x:.1f}}<br>binding y=%{{y:.1f}}<br>"
                               "foundation tilt w=%{customdata[1]:.1f}<extra></extra>"),
            ))
        else:
            fig.add_trace(go.Scatter3d(
                x=xs, y=ys, z=zs, mode="lines", name=name, line=dict(color=color, width=6, dash=dash),
                customdata=custom,
                hovertemplate=("<b>%{fullData.name}</b><br>iteration %{customdata[0]}<br>"
                               "x=%{x:.1f} · y=%{y:.1f} · z=%{z:.1f}<br>w=%{customdata[1]:.1f}"
                               "<extra></extra>"),
            ))
            fig.add_trace(go.Scatter3d(
                x=[xs[-1]], y=[ys[-1]], z=[zs[-1]], mode="markers", name=f"{name} endpoint", showlegend=False,
                marker=dict(size=7, color=color, symbol=endpoint_symbol,
                            line=dict(color="#e8f0ff", width=1.3)),
                customdata=[[len(points) - 1, points[-1][3]]],
                hovertemplate=(f"<b>{name} endpoint</b><br>x=%{{x:.1f}} · y=%{{y:.1f}} · z=%{{z:.1f}}<br>"
                               "w=%{customdata[1]:.1f}<extra></extra>"),
            ))
    if is_2d:
        fig.add_trace(go.Scatter(
            x=[start[0]], y=[start[1]], mode="markers", name="Shared start",
            marker=dict(size=8, color="#e8f0ff", symbol="circle-open", line=dict(width=2)),
            customdata=[[start[3]]],
            hovertemplate="<b>Shared start</b><br>x=%{x:.1f} · y=%{y:.1f}<br>w=%{customdata[0]:.1f}<extra></extra>",
        ))
        fig.update_layout(
            xaxis=dict(title="Scope · x", range=ranges[0], nticks=5,
                       gridcolor="#243653", zerolinecolor="#446184", tickfont=dict(color="#9fb0cc")),
            yaxis=dict(title="Binding · y", range=ranges[1], nticks=5,
                       gridcolor="#243653", zerolinecolor="#446184", tickfont=dict(color="#9fb0cc",
                       ), scaleanchor="x", scaleratio=1),
            legend=dict(orientation="h", yanchor="bottom", y=1.02, x=0, font=dict(color="#e8f0ff")),
            margin=dict(l=30, r=22, t=28, b=38),
        )
    else:
        fig.add_trace(go.Scatter3d(
            x=[start[0]], y=[start[1]], z=[start[2]], mode="markers", name="Shared start",
            marker=dict(size=5, color="#e8f0ff", symbol="circle-open", line=dict(width=2)),
            customdata=[[start[3]]],
            hovertemplate="<b>Shared start</b><br>x=%{x:.1f} · y=%{y:.1f} · z=%{z:.1f}<br>w=%{customdata[0]:.1f}"
                          "<extra></extra>",
        ))
        fig.update_layout(
            scene=dict(
                xaxis=dict(title="Scope · x", range=ranges[0], nticks=4, backgroundcolor="#0b1428",
                           gridcolor="#243653", zerolinecolor="#446184", color="#9fb0cc"),
                yaxis=dict(title="Binding · y", range=ranges[1], nticks=4, backgroundcolor="#0b1428",
                           gridcolor="#243653", zerolinecolor="#446184", color="#9fb0cc"),
                zaxis=dict(title="Processing · z", range=ranges[2], nticks=4, backgroundcolor="#0b1428",
                           gridcolor="#243653", zerolinecolor="#446184", color="#9fb0cc"),
                bgcolor="#0b1428", aspectmode="cube",
                camera=dict(eye=dict(x=1.45, y=1.45, z=1.18)),
            ),
            legend=dict(orientation="h", yanchor="bottom", y=0.02, x=0.02,
                        bgcolor="rgba(11,20,40,.85)", font=dict(color="#e8f0ff")),
            margin=dict(l=0, r=0, t=10, b=8),
        )
    fig.update_layout(
        paper_bgcolor="rgba(0,0,0,0)", plot_bgcolor="#0b1428", font=dict(family="Avenir Next, Inter, sans-serif", color="#e8f0ff", size=11),
        hoverlabel=dict(bgcolor="#172a46", bordercolor="#365274", font=dict(color="#e8f0ff", size=12)),
        showlegend=False,
        uirevision=f"{result.get('case', {}).get('key', 'case')}:{'2d' if is_2d else '3d'}:{full_space}",
    )
    return fig


def _render_outcomes(result: dict[str, Any]) -> tuple[list[html.Article], html.Div]:
    probe = result["probe"]
    baseline = _vector(probe["baseline"]["end"])
    changed = _vector(probe["changed"]["end"])
    cards = [_outcome_card(axis, baseline[index], changed[index])
             for index, axis in enumerate(("x", "y", "z", "w"))]
    deltas = [changed[index] - baseline[index] for index in range(4)]
    axis = ("x", "y", "z", "w")[max(range(4), key=lambda index: abs(deltas[index]))]
    amount = deltas[("x", "y", "z", "w").index(axis)]
    if abs(amount) < 0.05:
        summary = "This paired run ended at the same probe coordinates in both conditions."
    else:
        summary = (
            f"Largest coordinate shift for the single-decision probe: {AXIS_GUIDE[axis]['short']} "
            f"{_format_delta(amount)} points (changed minus original). This describes the model run."
        )
    notes = [html.P(summary)]
    changed_keys = {c["key"] for c in result["changed_controls"]}
    if "noise" in changed_keys:
        notes.append(html.P("This probe is deterministic, so its path does not respond to the noise control. "
                            "Read the simulated cohort changes below to see the effect of variability."))
    if "probe_b" in result:
        notes.append(html.P("These paths and cards follow configuration A. This case also includes configuration B: "
                            "open Full model and load the contested-issue case to compare both structures."))
    return cards, html.Div(notes, className="guide-shift-copy")


def _force_differences(result: dict[str, Any]) -> html.Div:
    contributions = result.get("probe", {}).get("initial_force_contributions", {})
    original = contributions.get("baseline", {})
    changed = contributions.get("changed", {})
    original_parts = original.get("components", {})
    changed_parts = changed.get("components", {})
    labels = {**original.get("component_labels", {}), **changed.get("component_labels", {})}
    differences: list[tuple[float, str, str, float]] = []
    axes = ["x", "y", "z", "w"]
    for component in dict.fromkeys([*original_parts, *changed_parts]):
        a = _vector(original_parts.get(component, [0, 0, 0, 0]))
        b = _vector(changed_parts.get(component, [0, 0, 0, 0]))
        for index, axis in enumerate(axes):
            delta = b[index] - a[index]
            if abs(delta) > 1e-8:
                differences.append((abs(delta), component, axis, delta))
    differences.sort(reverse=True, key=lambda item: item[0])
    top = differences[:3]
    if not top:
        return html.P("No initial component contribution differed at this probe in the paired run.",
                      className="guide-muted")
    return html.Div(className="guide-force-list", children=[
        html.Div(className="guide-force-row", children=[
            html.Span(f"{labels.get(component, component)} · {AXIS_GUIDE[axis]['short']}",
                      className="guide-force-name"),
            html.Strong(_format_delta(delta), className="guide-force-delta"),
        ])
        for _, component, axis, delta in top
    ])


def _cohort_readout(result: dict[str, Any]) -> html.Div:
    cohort = result.get("cohort", {})
    ranges = cohort.get("empirical_delta_range_10_90", {})
    p10 = _vector(ranges.get("p10", [0, 0, 0, 0]))
    p90 = _vector(ranges.get("p90", [0, 0, 0, 0]))
    mean = _vector(cohort.get("paired_mean_delta", [0, 0, 0, 0]))
    n = result.get("settings", {}).get("cohort_size", 40)
    return html.Div(children=[
        html.P(f"{n} simulated people · paired endpoint changes", className="guide-cohort-count"),
        html.Div(className="guide-cohort-rows", children=[
            html.Div(className="guide-cohort-row", children=[
                html.Span(f"{AXIS_GUIDE[axis]['short']} ({axis})"),
                html.Strong(f"mean {_format_delta(mean[index])}"),
                html.Span(f"10th–90th: {_format_delta(p10[index])} to {_format_delta(p90[index])}"),
            ])
            for index, axis in enumerate(("x", "y", "z", "w"))
        ]),
        html.P(ranges.get("interpretation", "Simulated variation, not a confidence interval."),
               className="guide-cohort-caveat"),
    ])


def _run_record(case_key: str, lever_key: str, value: float, mode: str, result: dict[str, Any]) -> dict[str, Any]:
    return {"case_key": case_key, "lever_key": lever_key, "value": float(value), "mode": mode, "result": result}


def register_callbacks(app: Any) -> None:
    """Register all callbacks for the guided page on the host Dash app."""

    @app.callback(
        Output("guide-case-context", "children"),
        Output("guide-lever-select", "value"),
        Output("guide-lever-slider", "value"),
        Output("guide-lever-mechanism", "children"),
        Output("guide-baseline-value", "children"),
        Output("guide-suggestion-copy", "children"),
        Input("guide-case-select", "value"),
        Input("guide-lever-select", "value"),
        Input("guide-reset-button", "n_clicks"),
        Input("guide-suggest-button", "n_clicks"),
        State("guide-lever-slider", "value"),
        prevent_initial_call=False,
    )
    def update_case_and_controls(case_key: str, lever_key: str, _reset: int, _suggest: int,
                                 slider_value: float):
        case_key = case_key if case_key in CASES else DEFAULT_CASE
        triggered = ctx.triggered_id
        suggested_key, suggested_value = SUGGESTIONS[case_key]
        if triggered == "guide-case-select" or triggered is None:
            lever_key, slider_value = suggested_key, suggested_value
        elif triggered == "guide-suggest-button":
            lever_key, slider_value = suggested_key, suggested_value
        elif triggered == "guide-reset-button":
            slider_value = _lever_value(case_key, lever_key)
        elif triggered == "guide-lever-select":
            lever_key = lever_key if lever_key in LEVER_BY_KEY else suggested_key
            # Preserve the suggestion when its own control update lands as a second trigger.
            if not (lever_key == suggested_key and float(slider_value) == suggested_value):
                slider_value = _lever_value(case_key, lever_key)
        lever_key = lever_key if lever_key in LEVER_BY_KEY else suggested_key
        slider_value = int(float(slider_value if slider_value is not None else suggested_value))
        selected_lever = LEVER_BY_KEY[lever_key]
        baseline_value = _lever_value(case_key, lever_key)
        suggestion_lever = LEVER_BY_KEY[suggested_key]
        suggestion_children = [
            html.Strong("Suggested change · "),
            f"{suggestion_lever.label}: {suggested_value} / 10. You can choose any lever and value.",
        ]
        return (
            _case_context(case_key), lever_key, slider_value, selected_lever.mechanism,
            f"{baseline_value:g} / 10", suggestion_children,
        )

    @app.callback(
        Output("guide-value-label", "children"),
        Input("guide-lever-slider", "value"),
    )
    def update_value_label(value: float):
        return f"{float(value):g} / 10"

    @app.callback(
        Output("guide-run-store", "data"),
        Output("guide-map", "figure"),
        Output("guide-outcome-cards", "children"),
        Output("guide-shift-summary", "children"),
        Output("guide-force-differences", "children"),
        Output("guide-cohort-readout", "children"),
        Output("guide-status", "children"),
        Input("guide-case-select", "value"),
        Input("guide-lever-select", "value"),
        Input("guide-lever-slider", "value"),
        Input("guide-run-button", "n_clicks"),
        Input("guide-reset-button", "n_clicks"),
        Input("guide-suggest-button", "n_clicks"),
        Input("guide-projection-toggle", "value"),
        State("guide-run-store", "data"),
        prevent_initial_call=False,
    )
    def run_or_invalidate(case_key: str, lever_key: str, value: float, _run: int, _reset: int,
                          _suggest: int, projection: list[str] | None, current: dict[str, Any] | None):
        case_key = case_key if case_key in CASES else DEFAULT_CASE
        lever_key = lever_key if lever_key in LEVER_BY_KEY else SUGGESTIONS[case_key][0]
        value = int(float(value if value is not None else SUGGESTIONS[case_key][1]))
        triggered = ctx.triggered_id
        is_2d = "2d" in (projection or [])
        mode = None
        chosen_key, chosen_value = lever_key, value
        if triggered == "guide-run-button":
            mode = "manual"
        elif triggered == "guide-reset-button":
            chosen_value = int(_lever_value(case_key, lever_key))
            mode = "baseline"
        elif triggered == "guide-suggest-button":
            chosen_key, chosen_value = SUGGESTIONS[case_key]
            mode = "suggested"

        if mode is not None:
            result = compare_conditions(case_key, {chosen_key: chosen_value}, steps=40, seed=7, n=40)
            record = _run_record(case_key, chosen_key, chosen_value, mode, result)
            cards, shift = _render_outcomes(result)
            label = _lever_label(chosen_key)
            if mode == "baseline":
                status = f"Showing the case baseline: {label} is {chosen_value:g} / 10 in both arms."
            elif mode == "suggested":
                status = f"Showing the suggested comparison: {label} at {chosen_value:g} / 10 versus the case baseline."
            else:
                status = f"Showing the run: {label} at {chosen_value:g} / 10 versus the case baseline."
            settings = result.get("settings", {})
            status += (f" {settings.get('steps', 40)} model iterations · "
                       f"{settings.get('cohort_size', 40)} simulated people · seed {settings.get('seed', 7)}.")
            return (
                record, _comparison_figure(result, is_2d, full_space="full" in (projection or [])), cards, shift,
                _force_differences(result), _cohort_readout(result), status,
            )

        current = current or BASELINE_RUN
        same_settings = (
            current.get("case_key") == case_key
            and current.get("lever_key") == lever_key
            and current.get("value") == float(value)
            and isinstance(current.get("result"), dict)
        )
        if same_settings:
            result = current["result"]
            cards, shift = _render_outcomes(result)
            return (
                current, _comparison_figure(result, is_2d, full_space="full" in (projection or [])), cards, shift,
                _force_differences(result), _cohort_readout(result),
                _status_for(current, result),
            )
        if triggered == "guide-projection-toggle" and isinstance(current.get("result"), dict):
            result = current["result"]
            return (
                current, _comparison_figure(result, is_2d, full_space="full" in (projection or [])),
                *_render_outcomes(result), _force_differences(result), _cohort_readout(result),
                _status_for(current, result),
            )
        return (
            BASELINE_RUN, _placeholder_figure(is_2d),
            [_empty_outcome_card(axis) for axis in AXIS_GUIDE],
            "Run a comparison to see its endpoint differences.",
            html.P("Run a comparison to inspect the starting forces.", className="guide-muted"),
            html.P("Cohort variation will appear after a run.", className="guide-muted"),
            "Selections changed. Run comparison to update the displayed result.",
        )

    @app.callback(
        Output("guide-download", "data"),
        Input("guide-download-button", "n_clicks"),
        State("guide-run-store", "data"),
        prevent_initial_call=True,
    )
    def download_result(clicks: int, current: dict[str, Any] | None):
        if not clicks or not current or not isinstance(current.get("result"), dict):
            return no_update
        result = current["result"]
        case_key = current["case_key"]
        lever_key = current["lever_key"]
        timestamp_ms = time.time_ns() // 1_000_000
        payload = {
            "__version__": __version__,
            "ts_ms": timestamp_ms,
            "inputs": {
                "case_key": case_key,
                "case_title": CASES[case_key]["title"],
                "changed_levers_ui_0_to_10": {lever_key: current["value"]},
                "steps": result.get("settings", {}).get("steps", 40),
                "seed": result.get("settings", {}).get("seed", 7),
                "n": result.get("settings", {}).get("cohort_size", 40),
                "mode": current.get("mode"),
            },
            "result": result,
        }
        filename = f"moral-topology-{case_key}-{timestamp_ms}.json"
        return dcc.send_string(json.dumps(payload, ensure_ascii=False, indent=2), filename)


def _status_for(current: dict[str, Any], result: dict[str, Any]) -> str:
    key = current.get("lever_key")
    value = current.get("value")
    label = _lever_label(key) if key in LEVER_BY_KEY else "condition"
    mode = current.get("mode")
    if mode == "baseline":
        lead = f"Showing the case baseline: {label} is {value:g} / 10 in both arms."
    elif mode == "suggested":
        lead = f"Showing the suggested comparison: {label} at {value:g} / 10 versus the case baseline."
    else:
        lead = f"Showing the run: {label} at {value:g} / 10 versus the case baseline."
    settings = result.get("settings", {})
    return (f"{lead} {settings.get('steps', 40)} model iterations · "
            f"{settings.get('cohort_size', 40)} simulated people · seed {settings.get('seed', 7)}.")


__all__ = ["build_layout", "register_callbacks"]

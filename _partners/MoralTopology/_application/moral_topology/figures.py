"""Plotly figure builders: 3D scene, overlays, decomposition heatmap, thesis-test charts."""

import numpy as np
import plotly.graph_objects as go
from plotly.subplots import make_subplots

from .forces import COMPONENT_LABEL, INFLUENCE_TYPES, drift, felt_objectivity
from .space import (AXIS_TICKS, AXIS_TITLES, OCTANTS, REGIMES, SCALE, THEORIES, octant_of)

# Shared midnight-observatory palette; fixed categories retain distinct hues.
SERIES = ["#57ddf5", "#f38bc8", "#ae9bff", "#85a9ff", "#ffcb88", "#69dec0", "#d2a5ed", "#ff9da8"]
INK, INK2, MUTED, GRID = "#e8f0ff", "#9fb0cc", "#8193b2", "#243653"
SURFACE = "#101d33"
MAP_BG, MAP_INK, MAP_MUTED, MAP_GRID = "#0b1428", "#e8f0ff", "#9fb0cc", "#243653"
DIVERGING = [[0.0, "#287a90"], [0.5, "#182840"], [1.0, "#9d477d"]]
W_COLORSCALE = [[0.0, "#57ddf5"], [0.5, "#ae9bff"], [1.0, "#f38bc8"]]

INFLUENCE_STYLE = {
    "attractor": ("diamond", "#69dec0"),
    "repeller": ("x", "#f38bc8"),
    "amplifier": ("circle", "#ffcb88"),
    "stabiliser": ("square", "#57ddf5"),
    "polariser": ("cross", "#ae9bff"),
}

W_COLORBAR = dict(title=dict(text="Tilt w", side="right"), tickvals=[-100, 0, 100],
                  ticktext=["Indiv.", "0", "Cohesive"], len=0.5, thickness=12, x=1.0)


def _scene_axis(key):
    ax = dict(title=dict(text=AXIS_TITLES[key], font=dict(size=12, color=MAP_INK)), range=[-SCALE, SCALE],
              backgroundcolor=MAP_BG, gridcolor=MAP_GRID, zerolinecolor="#446184", showspikes=False,
              tickfont=dict(size=10, color=MAP_MUTED))
    if key in AXIS_TICKS:
        ax["tickvals"], ax["ticktext"] = AXIS_TICKS[key]
    return ax


def base_figure(title):
    fig = go.Figure()
    fig.update_layout(
        title=dict(text=title, font=dict(size=14, color=MAP_INK), x=0.01),
        uirevision="lock-view",
        scene=dict(xaxis=_scene_axis("x"), yaxis=_scene_axis("y"), zaxis=_scene_axis("z"),
                   bgcolor=MAP_BG, aspectmode="cube", camera=dict(eye=dict(x=1.6, y=-1.6, z=0.9))),
        margin=dict(l=0, r=0, t=36, b=60),
        paper_bgcolor=MAP_BG,
        font=dict(family="Avenir Next, Inter, sans-serif", color=MAP_INK),
        hoverlabel=dict(bgcolor="#172a46", bordercolor="#365274", font=dict(color=MAP_INK)),
        legend=dict(orientation="h", x=0.0, y=0.0, yanchor="top", bgcolor="rgba(11,20,40,0.9)",
                    font=dict(size=10), itemsizing="constant"),
    )
    for xs, ys, zs in (([-SCALE, SCALE], [0, 0], [0, 0]), ([0, 0], [-SCALE, SCALE], [0, 0]),
                       ([0, 0], [0, 0], [-SCALE, SCALE])):
        fig.add_trace(go.Scatter3d(x=xs, y=ys, z=zs, mode="lines", line=dict(color="#446184", width=2),
                                   showlegend=False, hoverinfo="skip"))
    return fig


def add_octant_labels(fig):
    xs, ys, zs, txt = [], [], [], []
    for (sx, sy, sz), o in OCTANTS.items():
        xs.append(62 * sx), ys.append(62 * sy), zs.append(62 * sz), txt.append(o["name"])
    fig.add_trace(go.Scatter3d(x=xs, y=ys, z=zs, mode="text", text=txt,
                               textfont=dict(size=11, color=MAP_MUTED), name="Octant names",
                               hoverinfo="skip", legendgroup="octants"))


def add_regime_clouds(fig, n=160):
    for i, r in enumerate(REGIMES):
        rng = np.random.default_rng(100 + i)
        c = np.asarray(r["center"][:3], float)
        pts = np.clip(rng.normal(c, r["spread"], size=(n, 3)), -SCALE, SCALE)
        fig.add_trace(go.Scatter3d(
            x=pts[:, 0], y=pts[:, 1], z=pts[:, 2], mode="markers",
            marker=dict(size=2.5, color=SERIES[i % len(SERIES)], opacity=0.16),
            name=r["name"], legendgroup="regimes", legendgrouptitle_text="Illustrative regime clouds",
            hovertemplate=f"<b>{r['name']}</b><br>{r['desc']}<extra></extra>"))
        fig.add_trace(go.Scatter3d(x=[c[0]], y=[c[1]], z=[c[2] + r["spread"][2] + 4], mode="text",
                                   text=[r["name"]], textfont=dict(size=10, color=MAP_MUTED),
                                   showlegend=False, hoverinfo="skip", legendgroup="regimes"))


def add_theories(fig):
    P = np.array([t["pos"] for t in THEORIES], float)
    fig.add_trace(go.Scatter3d(
        x=P[:, 0], y=P[:, 1], z=P[:, 2], mode="markers+text", text=[t["name"] for t in THEORIES],
        textposition="top center", textfont=dict(size=10, color=MAP_INK),
        marker=dict(size=6, symbol="diamond-open", color=P[:, 3], colorscale=W_COLORSCALE, cmin=-100,
                    cmax=100, line=dict(width=2)),
        name="Illustrative theory positions",
        hovertemplate="<b>%{text}</b><br>author-assigned reference position<br>"
                      "x=%{x:.0f} y=%{y:.0f} z=%{z:.0f}<extra></extra>"))


def add_click_lattice(fig, n=9):
    g = np.linspace(-90, 90, n)
    X, Y, Z = np.meshgrid(g, g, g, indexing="ij")
    fig.add_trace(go.Scatter3d(x=X.ravel(), y=Y.ravel(), z=Z.ravel(), mode="markers",
                               marker=dict(size=2, color="#8193b2", opacity=0.07),
                               name="Click targets", showlegend=False,
                               hovertemplate="click: (%{x:.0f}, %{y:.0f}, %{z:.0f})<extra></extra>"))


def _arrow(fig, start, vec, color, name, scale=0.35, max_len=45.0, showlegend=True):
    v = np.asarray(vec[:3], float)
    mag = float(np.linalg.norm(v))
    if mag < 1e-6:
        return
    length = min(max_len, 6.0 + scale * mag)
    u = v / mag
    end = np.asarray(start[:3], float) + u * length
    fig.add_trace(go.Scatter3d(x=[start[0], end[0]], y=[start[1], end[1]], z=[start[2], end[2]],
                               mode="lines", line=dict(color=color, width=7), name=name,
                               showlegend=showlegend, hoverinfo="name"))
    fig.add_trace(go.Cone(x=[end[0]], y=[end[1]], z=[end[2]], u=[u[0]], v=[u[1]], w=[u[2]],
                          anchor="tip", sizemode="absolute", sizeref=7, showscale=False,
                          colorscale=[[0, color], [1, color]], hoverinfo="skip", showlegend=False))


def add_probe(fig, probe, drift_vec, traj, ensemble=None):
    p = np.asarray(probe, float)
    if ensemble is not None:
        xs, ys, zs = [], [], []
        for k in range(ensemble.shape[1]):
            xs += list(ensemble[:, k, 0]) + [None]
            ys += list(ensemble[:, k, 1]) + [None]
            zs += list(ensemble[:, k, 2]) + [None]
        fig.add_trace(go.Scatter3d(x=xs, y=ys, z=zs, mode="lines", line=dict(color="#699fc6", width=2),
                                   opacity=0.45, name="Synthetic cohort paths", hoverinfo="skip"))
        end = ensemble[-1]
        fig.add_trace(go.Scatter3d(
            x=end[:, 0], y=end[:, 1], z=end[:, 2], mode="markers",
            marker=dict(size=4, color=end[:, 3], colorscale=W_COLORSCALE, cmin=-100, cmax=100,
                        line=dict(width=0.5, color="#ffffff"), colorbar=W_COLORBAR),
            name="Simulated cohort endpoints",
            hovertemplate="outcome (%{x:.0f}, %{y:.0f}, %{z:.0f})<extra></extra>"))
    fig.add_trace(go.Scatter3d(x=traj[:, 0], y=traj[:, 1], z=traj[:, 2], mode="lines+markers",
                               line=dict(color="#57ddf5", width=5), marker=dict(size=2.5, color="#57ddf5"),
                               name="Deterministic probe path", hoverinfo="skip"))
    fig.add_trace(go.Scatter3d(x=[p[0]], y=[p[1]], z=[p[2]], mode="markers",
                               marker=dict(size=9, color="#57ddf5", symbol="circle", line=dict(width=2, color="#fff")),
                               name="Decision probe",
                               hovertemplate="probe (%{x:.0f}, %{y:.0f}, %{z:.0f})<extra></extra>"))
    _arrow(fig, p, drift_vec, "#f38bc8", "Net drift (mean)")


def add_probe_b(fig, A, B, trajB, drift_b):
    A, B = np.asarray(A, float), np.asarray(B, float)
    fig.add_trace(go.Scatter3d(x=[A[0], B[0]], y=[A[1], B[1]], z=[A[2], B[2]], mode="lines",
                               line=dict(color="#ae9bff", width=4, dash="dash"), name="Structural separation A–B",
                               hoverinfo="name"))
    fig.add_trace(go.Scatter3d(x=trajB[:, 0], y=trajB[:, 1], z=trajB[:, 2], mode="lines",
                               line=dict(color="#ae9bff", width=3), name="Probe B path", hoverinfo="skip"))
    fig.add_trace(go.Scatter3d(x=[B[0]], y=[B[1]], z=[B[2]], mode="markers+text", text=["B"],
                               textposition="top center", textfont=dict(size=13, color="#ae9bff"),
                               marker=dict(size=9, color="#ffffff", line=dict(width=3, color="#ae9bff")),
                               name="Probe B", hovertemplate="probe B (%{x:.0f}, %{y:.0f}, %{z:.0f})<extra></extra>"))
    _arrow(fig, B, drift_b, "#ae9bff", "Net drift at B", showlegend=False)


def add_field(fig, L, traits_row, influences, objective, n=7):
    g = np.linspace(-85, 85, n)
    X, Y, Z = np.meshgrid(g, g, g, indexing="ij")
    S = np.stack([X.ravel(), Y.ravel(), Z.ravel(), np.zeros(X.size)], axis=1)
    Tr = np.tile(np.asarray(traits_row, float), (len(S), 1))
    V = drift(S, L, Tr, influences=influences, objective=objective)
    mag = np.linalg.norm(V[:, :3], axis=1)
    top = float(np.percentile(mag, 95)) or 1.0
    rel = np.clip(mag / top, 0, 1)
    U = V[:, :3] / np.maximum(mag, 1e-9)[:, None] * (0.3 + 0.7 * rel)[:, None]
    fig.add_trace(go.Cone(
        x=S[:, 0], y=S[:, 1], z=S[:, 2], u=U[:, 0], v=U[:, 1], w=U[:, 2],
        sizemode="scaled", sizeref=0.35, anchor="center", customdata=np.c_[V[:, :3], mag],
        colorscale=[[0, "#33466e"], [1, "#57ddf5"]], cmin=0, cmax=1.0,
        colorbar=dict(title=dict(text="rel. |drift|", side="right"), len=0.4, thickness=12, x=1.0, y=0.25),
        name="Force field (w = 0 slice)", showlegend=True, opacity=0.8,
        hovertemplate="at (%{x:.0f}, %{y:.0f}, %{z:.0f})<br>drift (%{customdata[0]:.0f}, %{customdata[1]:.0f}, "
                      "%{customdata[2]:.0f}) |%{customdata[3]:.0f}|<extra></extra>"))


def add_attractors(fig, attractors):
    if not attractors:
        return
    P = np.array([a["pos"] for a in attractors])
    labels = []
    for a in attractors:
        _, o = octant_of(*a["pos"][:3])
        labels.append(f"{o['name']} ({a['share'] * 100:.0f}% of sampled starts)")
    fig.add_trace(go.Scatter3d(
        x=P[:, 0], y=P[:, 1], z=P[:, 2], mode="markers+text", text=labels, textposition="bottom center",
        textfont=dict(size=11, color=MAP_INK),
        marker=dict(size=[8 + 18 * a["share"] for a in attractors], symbol="diamond", color=P[:, 3],
                    colorscale=W_COLORSCALE, cmin=-100, cmax=100, line=dict(width=2, color=MAP_INK)),
        customdata=[a["speed"] for a in attractors],
        name="Endpoint clusters (no personal anchors)",
        hovertemplate="%{text}<br>(%{x:.0f}, %{y:.0f}, %{z:.0f})<br>max residual drift %{customdata:.2f}<br>finite horizon; equilibrium unproven<extra></extra>"))


def _sphere(center, r, color, name, opacity=0.08, res=14):
    u, v = np.meshgrid(np.linspace(0, 2 * np.pi, res), np.linspace(0, np.pi, res))
    return go.Surface(x=center[0] + r * np.cos(u) * np.sin(v), y=center[1] + r * np.sin(u) * np.sin(v),
                      z=center[2] + r * np.cos(v), opacity=opacity, showscale=False,
                      colorscale=[[0, color], [1, color]], hoverinfo="skip", name=name, showlegend=False)


def add_influences(fig, influences):
    for i, inf in enumerate(influences or ()):
        sym, col = INFLUENCE_STYLE.get(inf["type"], ("circle", INK))
        p = inf["pos"]
        label = f"#{i + 1} {INFLUENCE_TYPES[inf['type']]}"
        if inf["type"] == "polariser":
            label += f" [{inf.get('axis', 'x')}]"
        fig.add_trace(_sphere(p, float(inf.get("radius", 25)), col, label))
        fig.add_trace(go.Scatter3d(x=[p[0]], y=[p[1]], z=[p[2]], mode="markers+text", text=[f"#{i + 1}"],
                                   textposition="top center", textfont=dict(size=11, color=MAP_INK),
                                   marker=dict(size=9, symbol=sym, color=col, line=dict(width=1, color="#fff")),
                                   name=label, legendgroup="influences",
                                   hovertemplate=f"{label}<br>strength {inf.get('strength', 0.5):.2f}, "
                                                 f"reach {inf.get('radius', 25):.0f}<extra></extra>"))


def add_objectivity_isosurface(fig, L, w_slice=0.0, level=0.7):
    g = np.linspace(-100, 100, 16)
    X, Y, Z = np.meshgrid(g, g, g, indexing="ij")
    S = np.stack([X.ravel(), Y.ravel(), Z.ravel(), np.full(X.size, w_slice)], axis=1)
    phi = felt_objectivity(S, L)
    if phi.max() < level:
        return
    fig.add_trace(go.Isosurface(
        x=S[:, 0], y=S[:, 1], z=S[:, 2], value=phi, isomin=level, isomax=1.0, surface_count=2,
        opacity=0.12, colorscale=[[0, "#ffcb88"], [1, "#f38bc8"]], showscale=False, caps=dict(x_show=False,
        y_show=False, z_show=False), name=f"Illustrative certainty index ≥ {level}", showlegend=True,
        hovertemplate="stipulated high certainty index<extra></extra>"))


def add_objective_marker(fig, pos, strength):
    fig.add_trace(go.Scatter3d(x=[pos[0]], y=[pos[1]], z=[pos[2]], mode="markers+text",
                               text=[f"Hypothetical objective attractor (k={strength:.2f})"],
                               textposition="top center", textfont=dict(size=11, color="#f38bc8"),
                               marker=dict(size=12, symbol="diamond", color="#ffffff",
                                           line=dict(width=3, color="#f38bc8")),
                               name="Objective attractor (hypothesis)", hoverinfo="name"))


def add_population_animation(fig, hist, frame_every=2):
    """Append an animated population trace; frames update only that trace."""
    idx = len(fig.data)
    S = hist[0]
    marker = dict(size=3.5, color=S[:, 3], colorscale=W_COLORSCALE, cmin=-100, cmax=100,
                  colorbar=W_COLORBAR, line=dict(width=0))
    fig.add_trace(go.Scatter3d(x=S[:, 0], y=S[:, 1], z=S[:, 2], mode="markers", marker=marker,
                               name="Population", hovertemplate="(%{x:.0f}, %{y:.0f}, %{z:.0f})<extra></extra>"))
    frames, steps = [], list(range(0, len(hist), frame_every))
    if steps[-1] != len(hist) - 1:
        steps.append(len(hist) - 1)
    for t in steps:
        St = hist[t]
        frames.append(go.Frame(name=str(t), traces=[idx], data=[go.Scatter3d(
            x=St[:, 0], y=St[:, 1], z=St[:, 2], marker=dict(marker, color=St[:, 3]))]))
    fig.frames = frames
    fig.update_layout(
        updatemenus=[dict(type="buttons", showactive=False, x=0.01, y=0.95, xanchor="left", yanchor="top",
                          direction="left", bgcolor="#172a46", bordercolor="#365274", font=dict(color=MAP_INK),
                          buttons=[dict(label="▶ Play", method="animate",
                                        args=[None, dict(frame=dict(duration=120, redraw=True),
                                                         fromcurrent=True, transition=dict(duration=0))]),
                                   dict(label="❚❚", method="animate",
                                        args=[[None], dict(frame=dict(duration=0, redraw=False),
                                                           mode="immediate")])])],
        sliders=[dict(active=len(steps) - 1, x=0.16, y=0.99, yanchor="top", len=0.6, pad=dict(t=0, b=0), font=dict(size=9),
                      bgcolor="#57ddf5", bordercolor="#365274", activebgcolor="#ae9bff",
                      currentvalue=dict(prefix="step ", font=dict(size=11, color=MAP_INK)),
                      steps=[dict(label=str(t), method="animate",
                                  args=[[str(t)], dict(frame=dict(duration=0, redraw=True), mode="immediate")])
                             for t in steps])])
    # Start on the final state so the static view shows the outcome.
    fig.data[idx].update(x=hist[-1][:, 0], y=hist[-1][:, 1], z=hist[-1][:, 2],
                         marker=dict(marker, color=hist[-1][:, 3]))


# ---------------------------------------------------------------------------
# 2D charts
# ---------------------------------------------------------------------------
def _chart_layout(fig, title, height=300):
    fig.update_layout(title=dict(text=title, font=dict(size=13, color=INK), x=0.01),
                      paper_bgcolor=SURFACE, plot_bgcolor=SURFACE, height=height,
                      font=dict(family="Avenir Next, Inter, sans-serif", size=11, color=INK2),
                      margin=dict(l=10, r=10, t=40, b=30),
                      hoverlabel=dict(bgcolor="#172a46", bordercolor="#365274", font=dict(color=INK)))
    fig.update_xaxes(gridcolor=GRID, zeroline=False, linecolor="#365071")
    fig.update_yaxes(gridcolor=GRID, zeroline=False, linecolor="#365071")
    return fig


def decomposition_heatmap(comps, min_mag=0.5):
    """comps: {key: (4,) vector}. Rows = forces with non-trivial effect, sorted by magnitude."""
    rows = [(k, np.asarray(v, float)) for k, v in comps.items() if np.linalg.norm(v) >= min_mag]
    rows.sort(key=lambda kv: -np.linalg.norm(kv[1]))
    total = sum(np.asarray(v, float) for v in comps.values())
    labels = [COMPONENT_LABEL[k] for k, _ in rows] + ["<b>Σ net drift</b>"]
    Z = np.array([v for _, v in rows] + [total]) if rows else np.array([total])
    lim = float(np.max(np.abs(Z))) or 1.0
    fig = go.Figure(go.Heatmap(
        z=Z, x=["Δ scope x", "Δ binding y", "Δ processing z", "Δ tilt w"], y=labels,
        colorscale=DIVERGING, zmin=-lim, zmax=lim, text=np.round(Z).astype(int), texttemplate="%{text}",
        textfont=dict(size=10, color="#ffffff"), xgap=2, ygap=2,
        colorbar=dict(thickness=10, len=0.8, title=dict(text="push", side="right")),
        hovertemplate="%{y}: %{x} %{z:.1f}<extra></extra>"))
    fig.update_yaxes(autorange="reversed")
    return _chart_layout(fig, "Initial modeled pushes · signed model units",
                         height=max(260, 26 * len(labels) + 80))


def _ecology_scatter(fig, endpoints, objective_pos, col, showlegend):
    for i, (nm, E) in enumerate(endpoints.items()):
        c_ = SERIES[i % len(SERIES)]
        fig.add_trace(go.Scatter(x=E[:, 0], y=E[:, 3], mode="markers", marker=dict(size=5, color=c_, opacity=0.4),
                                 name=nm, legendgroup=nm, showlegend=showlegend,
                                 hovertemplate=f"{nm}<br>scope %{{x:.0f}}, tilt %{{y:.0f}}<extra></extra>"), 1, col)
        c = E.mean(axis=0)
        fig.add_trace(go.Scatter(x=[c[0]], y=[c[3]], mode="markers+text", text=[nm], textposition="top center",
                                 textfont=dict(size=9, color=INK), showlegend=False, legendgroup=nm,
                                 marker=dict(size=12, color=c_, line=dict(width=2, color="#fff")),
                                 hoverinfo="skip"), 1, col)
    fig.add_trace(go.Scatter(x=[objective_pos[0]], y=[objective_pos[3]], mode="markers",
                             marker=dict(size=14, symbol="diamond-open", color="#f38bc8", line=dict(width=3)),
                             name="objective point", showlegend=showlegend, legendgroup="obj",
                             hovertemplate="hypothetical objective point<extra></extra>"), 1, col)
    fig.update_xaxes(title_text="scope x (self → sentient)", range=[-100, 100], row=1, col=col)
    fig.update_yaxes(title_text="tilt w (indiv. → cohesive)", range=[-100, 100], row=1, col=col)


def objectivity_test_figure(res, objective_pos, k_user):
    fig = make_subplots(rows=1, cols=3, column_widths=[0.3, 0.35, 0.35], horizontal_spacing=0.07,
                        subplot_titles=("How much ecology and individuals still matter",
                                        "Naturalistic only (k = 0)",
                                        f"With objective attractor (k = {k_user:g})"))
    k = [f"{v:g}" for v in res["strengths"]]
    for vals, nm, col in ((res["spread"], "between ecologies", SERIES[0]),
                          (res["within"], "between people within an ecology", SERIES[1])):
        fig.add_trace(go.Scatter(x=k, y=vals, mode="lines+markers", line=dict(color=col, width=2),
                                 marker=dict(size=7), name=nm, legendgroup="curves",
                                 hovertemplate=f"k=%{{x}}<br>{nm}: %{{y:.1f}}<extra></extra>"), 1, 1)
        fig.add_annotation(x=k[-1], y=vals[-1], text=nm, showarrow=False,
                           xanchor="right", yshift=10, font=dict(size=10, color=INK2), row=1, col=1)
    fig.update_xaxes(title_text="objective attractor strength k", type="category", row=1, col=1)
    fig.update_yaxes(title_text="RMS spread (space units)", rangemode="tozero", row=1, col=1)
    ks = sorted(res["endpoints"])
    _ecology_scatter(fig, res["endpoints"][ks[0]], objective_pos, 2, True)
    _ecology_scatter(fig, res["endpoints"][min(ks, key=lambda v: abs(v - k_user))], objective_pos, 3, False)
    fig.update_layout(legend=dict(orientation="h", y=-0.28, font=dict(size=10)))
    return _chart_layout(fig, "", height=400)


def reversal_figure(rv, rv_obj=None):
    fig = make_subplots(rows=2, cols=1, shared_xaxes=True, row_heights=[0.68, 0.32], vertical_spacing=0.08,
                        subplot_titles=("Population mean position through changing ecologies",
                                        "Illustrative certainty index (0–1)"))
    M = rv["means"]
    t = np.arange(len(M))
    names = ["scope x", "binding y", "processing z", "tilt w"]
    for i in range(4):
        fig.add_trace(go.Scatter(x=t, y=M[:, i], mode="lines", line=dict(color=SERIES[i], width=2), name=names[i],
                                 hovertemplate=f"{names[i]} %{{y:.0f}}<extra></extra>"), 1, 1)
    if rv_obj is not None:
        fig.add_trace(go.Scatter(x=t, y=rv_obj["means"][:, 0], mode="lines",
                                 line=dict(color=SERIES[0], width=2, dash="dot"),
                                 name="scope x with objective attractor",
                                 hovertemplate="scope x (with O) %{y:.0f}<extra></extra>"), 1, 1)
    fig.add_trace(go.Scatter(x=t, y=rv["phi"], mode="lines", line=dict(color=SERIES[4], width=2),
                             name="felt objectivity", hovertemplate="Φ %{y:.2f}<extra></extra>"), 2, 1)
    for a, b, label in rv["bounds"]:
        fig.add_vline(x=a, line=dict(color="#365071", width=1))
        fig.add_annotation(x=(a + b) / 2, y=1.0, yref="y domain", text=label, showarrow=False,
                           font=dict(size=10, color=INK2), row=1, col=1)
    fig.update_yaxes(range=[-80, 80], row=1, col=1)
    fig.update_yaxes(range=[0, 1], row=2, col=1)
    fig.update_xaxes(title_text="Model iteration (no real-time calibration)", row=2, col=1)
    fig.update_layout(legend=dict(orientation="h", y=-0.2), hovermode="x unified")
    return _chart_layout(fig, "", height=420)


def octant_share_figure(end_states, title="Where the people end up"):
    counts = {}
    for p in end_states:
        _, o = octant_of(*p[:3])
        counts[o["name"]] = counts.get(o["name"], 0) + 1
    names = [o["name"] for o in OCTANTS.values()]
    vals = [100.0 * counts.get(nm, 0) / max(len(end_states), 1) for nm in names]
    fig = go.Figure(go.Bar(x=vals, y=names, orientation="h", marker=dict(color=SERIES[0]),
                           text=[f"{v:.0f}%" if v >= 1 else "" for v in vals], textposition="outside",
                           hovertemplate="%{y}: %{x:.1f}%<extra></extra>"))
    fig.update_yaxes(autorange="reversed")
    fig.update_xaxes(range=[0, 110], title_text="% of simulated configurations")
    return _chart_layout(fig, title, height=300)

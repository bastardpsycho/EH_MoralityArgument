"""Illustrative integration, endpoint clustering and assumption experiments.

Iterations and dt are dimensionless model units, not elapsed human time.
"""

import numpy as np

from .forces import CORE, EVERYDAY_NORM, HABIT_RATE, clamp_state, drift, felt_objectivity, noise_sigma
from .levers import to_unit

MAX_STEP = 25.0
CONFORMITY_BANDWIDTH = 30.0

POPULATIONS = {
    "Diverse mix": dict(center=(0, 0, 0, 0), spread=(45, 45, 45, 40)),
    "Everyday community": dict(center=tuple(CORE), spread=(20, 20, 20, 20)),
    "WEIRD urban": dict(center=(25, 15, 20, -25), spread=(25, 25, 25, 25)),
    "Kin-intensive village": dict(center=(-50, -10, -35, 45), spread=(20, 20, 20, 20)),
    "New recruits": dict(center=(0, 10, -10, 10), spread=(30, 30, 30, 30)),
}


def init_population(kind, n, seed=0):
    rng = np.random.default_rng(seed)
    spec = POPULATIONS[kind]
    S = rng.normal(spec["center"], spec["spread"], size=(n, 4))
    Tr = np.clip(rng.normal(0.0, 1.0, size=(n, 5)), -3, 3)
    return clamp_state(S), Tr


def local_norm(S, bandwidth=CONFORMITY_BANDWIDTH):
    """Kernel-weighted neighbour mean: what each agent sees 'people like me around me' doing."""
    d2 = np.sum((S[:, None, :3] - S[None, :, :3]) ** 2, axis=2)
    Wt = np.exp(-d2 / (2.0 * bandwidth * bandwidth))
    return (Wt @ S) / Wt.sum(axis=1, keepdims=True)


def simulate(S0, L, Tr=None, *, steps=40, dt=0.15, influences=(), objective=None,
             coupled=False, noise=True, seed=0, home=None, disposition=True, return_home=False):
    """Euler-Maruyama integration. Returns history (steps+1, N, 4).

    disposition=True gives each agent a home position (default: where they start) that pulls them back
    and slowly absorbs where they have been (habit), faster under gradual escalation.
    """
    rng = np.random.default_rng(seed)
    S = clamp_state(np.atleast_2d(np.asarray(S0, dtype=float)).copy())
    n = S.shape[0]
    Tr = np.zeros((n, 5)) if Tr is None else np.atleast_2d(Tr)
    if disposition and home is None:
        home = S.copy()
    if not disposition:
        home = None
    rate = HABIT_RATE + 0.3 * L["escalation"]
    hist = [S.copy()]
    for _ in range(steps):
        norm = local_norm(S) if coupled else np.tile(EVERYDAY_NORM, (n, 1))
        v = drift(S, L, Tr, norm=norm, home=home, objective=objective, influences=influences)
        step = dt * v
        if noise:
            sig = noise_sigma(L, S, influences)
            step = step + np.sqrt(dt) * np.asarray(sig).reshape(-1, 1) * rng.normal(size=S.shape)
        mag = np.linalg.norm(step, axis=1, keepdims=True)
        step = np.where(mag > MAX_STEP, step * MAX_STEP / np.maximum(mag, 1e-9), step)
        S = clamp_state(S + step)
        if home is not None:
            home = home + rate * (S - home)
        hist.append(S.copy())
    hist = np.array(hist)
    return (hist, home) if return_home else hist


def find_attractors(L, traits_row=None, *, influences=(), objective=None, grid=5, steps=160, dt=0.2,
                    merge=14.0):
    """Cluster finite-horizon endpoints, not proven attractors or empirical basin probabilities.

    Uses no disposition anchors, unlike individual trajectories. ``speed`` is the
    largest residual drift in each cluster; share refers only to the sampled grid.
    """
    g = np.linspace(-80, 80, grid)
    X, Y, Z, Wv = np.meshgrid(g, g, g, np.array([-40.0, 40.0]), indexing="ij")
    S0 = np.stack([X.ravel(), Y.ravel(), Z.ravel(), Wv.ravel()], axis=1)
    Tr = None if traits_row is None else np.tile(np.asarray(traits_row, dtype=float), (len(S0), 1))
    end = simulate(S0, L, Tr, steps=steps, dt=dt, influences=influences, objective=objective,
                   noise=False, disposition=False)[-1]
    speed = np.linalg.norm(drift(end, L, Tr, influences=influences, objective=objective), axis=1)
    clusters = []
    for p, sp in zip(end, speed):
        for c in clusters:
            if np.linalg.norm(c["sum"] / c["n"] - p) < merge:
                c["sum"] += p
                c["n"] += 1
                c["speed"] = max(c["speed"], sp)
                break
        else:
            clusters.append(dict(sum=p.copy(), n=1, speed=sp))
    total = len(end)
    res = [dict(pos=c["sum"] / c["n"], share=c["n"] / total, speed=float(c["speed"])) for c in clusters]
    return sorted(res, key=lambda r: -r["share"])


def eta_squared(groups):
    """Share of total variance (all 4 axes) explained by group membership."""
    allp = np.concatenate(groups, axis=0)
    mu = allp.mean(axis=0)
    total = np.sum((allp - mu) ** 2)
    between = sum(len(g) * np.sum((g.mean(axis=0) - mu) ** 2) for g in groups)
    return float(between / total) if total > 0 else 0.0


def centroid_spread(groups):
    """RMS distance of group centroids from their grand mean: how much the ecology decides."""
    cents = np.array([g.mean(axis=0) for g in groups])
    return float(np.sqrt(np.mean(np.sum((cents - cents.mean(axis=0)) ** 2, axis=1))))


def within_spread(groups):
    """Mean RMS distance of people from their own ecology's centroid: how much individuals still differ."""
    return float(np.mean([np.sqrt(np.mean(np.sum((g - g.mean(axis=0)) ** 2, axis=1))) for g in groups]))


def objectivity_test(ecologies, objective_pos, strengths=(0, 0.25, 0.5, 1, 2, 4, 8), n=120, steps=150,
                     seed=11, population="Diverse mix", show_strengths=(0,)):
    """Same people, same starting beliefs, different ecologies — with and without an objective pull.

    For each strength k: between-ecology centroid spread, within-ecology spread, eta^2, and mean
    distance of ecology centroids to the objective point. Endpoints kept for `show_strengths`.
    """
    S0, Tr = init_population(population, n, seed)
    names = list(ecologies)
    strengths = sorted(set(float(k) for k in strengths) | set(float(k) for k in show_strengths))
    opos = np.asarray(objective_pos, dtype=float)
    res = dict(strengths=strengths, eta2=[], spread=[], within=[], dist=[], names=names, endpoints={})
    for k in strengths:
        obj = dict(strength=k, pos=opos) if k > 0 else None
        # Common random draws keep ecology/attractor comparisons paired. Noise
        # amplitude may still differ because that is part of each ecology.
        ends = [simulate(S0, to_unit(ecologies[nm]), Tr, steps=steps, objective=obj, coupled=True,
                         seed=seed)[-1] for nm in names]
        res["eta2"].append(eta_squared(ends))
        res["spread"].append(centroid_spread(ends))
        res["within"].append(within_spread(ends))
        res["dist"].append(float(np.mean([np.linalg.norm(e.mean(axis=0) - opos) for e in ends])))
        if any(np.isclose(k, ks) for ks in show_strengths):
            res["endpoints"][k] = dict(zip(names, ends))
    return res


def reversal_test(phases, n=150, seed=5, population="Everyday community", objective=None):
    """Run one population through successive ecologies. Returns per-step means and phase boundaries."""
    S, Tr = init_population(population, n, seed)
    home = None
    means, phi, bounds = [S.mean(axis=0)], [float(felt_objectivity(S, to_unit(phases[0][1])).mean())], []
    t = 0
    for j, (label, levers, steps) in enumerate(phases):
        L = to_unit(levers)
        hist, home = simulate(S, L, Tr, steps=steps, coupled=True, seed=seed + j, home=home,
                              objective=objective, return_home=True)
        for st in hist[1:]:
            means.append(st.mean(axis=0))
            phi.append(float(felt_objectivity(st, L).mean()))
        bounds.append((t, t + steps, label))
        t += steps
        S = hist[-1]
    return dict(means=np.array(means), phi=np.array(phi), bounds=bounds)

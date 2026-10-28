"""Paired, headless what-if comparisons for the guided decision-mapping demo.

This module replays one case under its original controls and a caller-supplied set of
lever overrides. It uses shared initial conditions and seeded cohort noise so the
reported differences describe the changed controls under the same simulated setup.
The model is uncalibrated and the results are illustrative, not person diagnostics or
claims about moral correctness.
"""

from __future__ import annotations

from collections.abc import Mapping
from copy import deepcopy
from math import isfinite
from numbers import Integral, Real
from typing import Any

import numpy as np

from .dynamics import simulate
from .forces import COMPONENT_LABEL, clamp_state, components
from .levers import DEFAULT_LEVERS, LEVER_BY_KEY, LEVER_KEYS, TRAIT_KEYS, to_unit
from .scenarios import CASES
from .space import AXES, AXIS_TITLES


MAX_STEPS = 250
MAX_COHORT_SIZE = 300
COHORT_POPULATION = "Case-centered synthetic cohort"
COHORT_START_JITTER_SD = 6.0
COHORT_TRAIT_SPREAD_SD = 0.9
MODEL_DT = 0.15


def _validate_count(name: str, value: Any, *, minimum: int, maximum: int | None = None) -> int:
    if isinstance(value, bool) or not isinstance(value, Integral):
        raise TypeError(f"{name} must be an integer")
    result = int(value)
    if result < minimum:
        raise ValueError(f"{name} must be at least {minimum}")
    if maximum is not None and result > maximum:
        raise ValueError(f"{name} must be at most {maximum}")
    return result


def _validate_seed(seed: Any) -> int:
    if isinstance(seed, bool) or not isinstance(seed, Integral):
        raise TypeError("seed must be a non-negative integer")
    result = int(seed)
    if result < 0:
        raise ValueError("seed must be a non-negative integer")
    return result


def _validate_case_key(case_key: Any) -> str:
    if not isinstance(case_key, str):
        raise TypeError("case_key must be a string")
    if case_key not in CASES:
        raise ValueError(f"unknown case_key: {case_key!r}")
    return case_key


def _validate_overrides(changed_levers: Any) -> dict[str, float]:
    if not isinstance(changed_levers, Mapping):
        raise TypeError("changed_levers must be a mapping of lever keys to values")
    overrides: dict[str, float] = {}
    for key, raw_value in changed_levers.items():
        if not isinstance(key, str):
            raise TypeError("changed_levers keys must be strings")
        if key not in LEVER_BY_KEY:
            raise ValueError(f"unknown lever key: {key!r}")
        if isinstance(raw_value, bool) or not isinstance(raw_value, Real):
            raise TypeError(f"lever {key!r} must have a numeric value from 0 to 10")
        value = float(raw_value)
        if not isfinite(value) or not 0.0 <= value <= 10.0:
            raise ValueError(f"lever {key!r} must have a finite value from 0 to 10")
        overrides[key] = value
    return overrides


def _case_trait_matrix(case: Mapping[str, Any]) -> np.ndarray:
    traits = np.zeros((1, len(TRAIT_KEYS)), dtype=float)
    for key, value in case.get("traits", {}).items():
        traits[0, TRAIT_KEYS.index(key)] = float(value)
    return traits


def _init_case_cohort(
    probe_start: tuple[float, ...],
    case_traits: Mapping[str, float],
    n: int,
    seed: int,
) -> tuple[np.ndarray, np.ndarray, np.ndarray]:
    rng = np.random.default_rng(seed)
    center = np.asarray(probe_start, dtype=float)
    starts = clamp_state(
        center[None, :] + rng.normal(0.0, COHORT_START_JITTER_SD, size=(n, len(AXES)))
    )
    trait_center = np.zeros(len(TRAIT_KEYS), dtype=float)
    for key, value in case_traits.items():
        trait_center[TRAIT_KEYS.index(key)] = float(value)
    traits = np.clip(
        rng.normal(trait_center, COHORT_TRAIT_SPREAD_SD, size=(n, len(TRAIT_KEYS))),
        -3.0,
        3.0,
    )
    return starts, traits, trait_center


def _json_vector(values: Any) -> list[float]:
    return [float(value) for value in np.asarray(values, dtype=float).reshape(-1)]


def _json_matrix(values: Any) -> list[list[float]]:
    return [[float(value) for value in row] for row in np.asarray(values, dtype=float)]


def _initial_force_contributions(
    states: np.ndarray,
    traits: np.ndarray,
    lever_values: Mapping[str, float],
    *,
    influences: tuple[dict[str, Any], ...],
) -> dict[str, Any]:
    force_parts = components(
        states,
        to_unit(lever_values),
        traits,
        norm=None,
        home=states,
        influences=influences,
    )
    means = {key: np.asarray(value, dtype=float).mean(axis=0) for key, value in force_parts.items()}
    total = sum(means.values(), np.zeros(len(AXES), dtype=float))
    return {
        "meaning": "Mean instantaneous drift contribution at the shared initial state, before integration and noise.",
        "axis_order": list(AXES),
        "component_labels": {key: COMPONENT_LABEL.get(key, key) for key in means},
        "components": {key: _json_vector(value) for key, value in means.items()},
        "total": _json_vector(total),
    }


def _probe_arm(history: np.ndarray) -> dict[str, Any]:
    path = _json_matrix(history[:, 0, :])
    return {"path": path, "start": path[0], "end": path[-1]}


def _cohort_arm(history: np.ndarray) -> dict[str, Any]:
    mean_path = _json_matrix(history.mean(axis=1))
    return {
        "mean_path": mean_path,
        "start_mean": mean_path[0],
        "end_mean": mean_path[-1],
        "endpoints": _json_matrix(history[-1]),
    }


def _probe_result(
    start: tuple[float, ...],
    traits: np.ndarray,
    baseline_history: np.ndarray,
    changed_history: np.ndarray,
    baseline_levers: Mapping[str, float],
    changed_levers: Mapping[str, float],
    influences: tuple[dict[str, Any], ...],
) -> dict[str, Any]:
    baseline_path = baseline_history[:, 0, :]
    changed_path = changed_history[:, 0, :]
    return {
        "initial": _json_vector(start),
        "traits": {key: float(traits[0, index]) for index, key in enumerate(TRAIT_KEYS)},
        "baseline": _probe_arm(baseline_history),
        "changed": _probe_arm(changed_history),
        "delta": _json_vector(changed_path[-1] - baseline_path[-1]),
        "delta_path": _json_matrix(changed_path - baseline_path),
        "initial_force_contributions": {
            "baseline": _initial_force_contributions(
                np.asarray([start], dtype=float),
                traits,
                baseline_levers,
                influences=influences,
            ),
            "changed": _initial_force_contributions(
                np.asarray([start], dtype=float),
                traits,
                changed_levers,
                influences=influences,
            ),
        },
    }


def _cohort_result(
    starts: np.ndarray,
    traits: np.ndarray,
    initial_center: tuple[float, ...],
    trait_center: np.ndarray,
    scenario_traits: Mapping[str, float],
    baseline_history: np.ndarray,
    changed_history: np.ndarray,
    baseline_levers: Mapping[str, float],
    changed_levers: Mapping[str, float],
    influences: tuple[dict[str, Any], ...],
) -> dict[str, Any]:
    paired_deltas = changed_history[-1] - baseline_history[-1]
    p10, p90 = np.quantile(paired_deltas, (0.1, 0.9), axis=0)
    baseline_arm = _cohort_arm(baseline_history)
    changed_arm = _cohort_arm(changed_history)
    return {
        "initial": {
            "population": COHORT_POPULATION,
            "center": _json_vector(initial_center),
            "start_jitter_sd": COHORT_START_JITTER_SD,
            "starts": _json_matrix(starts),
            "traits": _json_matrix(traits),
            "trait_order": list(TRAIT_KEYS),
            "trait_center": {
                key: float(trait_center[index]) for index, key in enumerate(TRAIT_KEYS)
            },
            "trait_spread_sd": COHORT_TRAIT_SPREAD_SD,
            "trait_clip_range": [-3.0, 3.0],
            "start_mean": _json_vector(starts.mean(axis=0)),
            "scenario_trait_centers": {
                key: float(value) for key, value in scenario_traits.items()
            },
        },
        "baseline": baseline_arm,
        "changed": changed_arm,
        "mean_path_delta": _json_matrix(
            changed_history.mean(axis=1) - baseline_history.mean(axis=1)
        ),
        "paired_endpoint_deltas": _json_matrix(paired_deltas),
        "paired_mean_delta": _json_vector(paired_deltas.mean(axis=0)),
        "empirical_delta_range_10_90": {
            "label": "Empirical 10th to 90th percentile of paired simulated agent endpoint deltas",
            "interpretation": "Descriptive simulated variation across this cohort; not a confidence interval.",
            "p10": _json_vector(p10),
            "p90": _json_vector(p90),
        },
        "initial_force_contributions": {
            "baseline": _initial_force_contributions(
                starts,
                traits,
                baseline_levers,
                influences=influences,
            ),
            "changed": _initial_force_contributions(
                starts,
                traits,
                changed_levers,
                influences=influences,
            ),
        },
    }


def compare_conditions(
    case_key: str,
    changed_levers: Mapping[str, float],
    steps: int = 40,
    seed: int = 7,
    n: int = 40,
) -> dict[str, Any]:
    """Compare one case with selected lever changes under paired initial conditions.

    `steps` counts model iterations and has no real-time interpretation. Probe paths are
    deterministic (noise disabled); cohort paths use shared seeded standard-normal draws
    in both arms. The changed arm starts from the case's original controls and applies
    only `changed_levers`.

    Raises TypeError for wrong input types and ValueError for unknown keys or values
    outside the supported ranges. No invalid input is replaced with a default.
    """
    case_key = _validate_case_key(case_key)
    overrides = _validate_overrides(changed_levers)
    steps = _validate_count("steps", steps, minimum=0, maximum=MAX_STEPS)
    n = _validate_count("n", n, minimum=1, maximum=MAX_COHORT_SIZE)
    seed = _validate_seed(seed)

    case = CASES[case_key]
    baseline_levers = {key: float(case["levers"][key]) for key in LEVER_KEYS}
    changed_lever_values = dict(baseline_levers)
    changed_lever_values.update(overrides)
    changed_controls = [
        {
            "key": key,
            "label": LEVER_BY_KEY[key].label,
            "baseline": baseline_levers[key],
            "changed": changed_lever_values[key],
        }
        for key in LEVER_KEYS
        if baseline_levers[key] != changed_lever_values[key]
    ]
    same_controls = not changed_controls
    influences = tuple(deepcopy(item) for item in case.get("influences", ()))

    probe_start = tuple(float(value) for value in case["probe"])
    probe_traits = _case_trait_matrix(case)
    probe_starts = np.asarray([probe_start], dtype=float)
    baseline_probe_history = simulate(
        probe_starts,
        to_unit(baseline_levers),
        probe_traits,
        steps=steps,
        dt=MODEL_DT,
        influences=influences,
        objective=None,
        coupled=False,
        noise=False,
        seed=seed,
        disposition=True,
    )
    changed_probe_history = (
        baseline_probe_history.copy()
        if same_controls
        else simulate(
            probe_starts,
            to_unit(changed_lever_values),
            probe_traits,
            steps=steps,
            dt=MODEL_DT,
            influences=influences,
            objective=None,
            coupled=False,
            noise=False,
            seed=seed,
            disposition=True,
        )
    )

    cohort_starts, cohort_traits, cohort_trait_center = _init_case_cohort(
        probe_start,
        case.get("traits", {}),
        n,
        seed,
    )
    cohort_seed = seed + 1
    baseline_cohort_history = simulate(
        cohort_starts,
        to_unit(baseline_levers),
        cohort_traits,
        steps=steps,
        dt=MODEL_DT,
        influences=influences,
        objective=None,
        coupled=False,
        noise=True,
        seed=cohort_seed,
        disposition=True,
    )
    changed_cohort_history = (
        baseline_cohort_history.copy()
        if same_controls
        else simulate(
            cohort_starts,
            to_unit(changed_lever_values),
            cohort_traits,
            steps=steps,
            dt=MODEL_DT,
            influences=influences,
            objective=None,
            coupled=False,
            noise=True,
            seed=cohort_seed,
            disposition=True,
        )
    )

    control_provenance = {
        key: {
            "label": LEVER_BY_KEY[key].label,
            "group": LEVER_BY_KEY[key].group,
            "model_default": float(DEFAULT_LEVERS[key]),
            "baseline_source": "case-specific scenario levers",
            "changed_source": "what-if override" if key in overrides else "inherited case lever",
            "overridden_by_request": key in overrides,
        }
        for key in LEVER_KEYS
    }
    result: dict[str, Any] = {
        "case": {
            "key": case_key,
            "title": case["title"],
            "grade": case.get("grade"),
            "model_status": "Uncalibrated illustrative decision-mapping model",
            "interpretation_boundary": (
                "Outputs trace consequences of the model's stated assumptions; they do not diagnose a person "
                "or establish moral correctness."
            ),
        },
        "axes": [{"key": key, "title": AXIS_TITLES[key]} for key in AXES],
        "settings": {
            "steps": steps,
            "steps_semantics": "Model iterations; not elapsed or real-world time.",
            "dt": MODEL_DT,
            "dt_semantics": "Internal numerical integration increment; no clock-time mapping.",
            "disposition": True,
            "coupled": {"probe": False, "cohort": False},
            "objective": None,
            "seed": seed,
            "cohort_size": n,
            "cohort_population": COHORT_POPULATION,
            "cohort_start_jitter_sd": COHORT_START_JITTER_SD,
            "cohort_trait_spread_sd": COHORT_TRAIT_SPREAD_SD,
            "cohort_trait_clip_range": [-3.0, 3.0],
            "probe_noise_enabled": False,
            "cohort_noise_enabled": True,
            "cohort_paired_noise_draws": True,
            "cohort_noise_method": (
                "Both arms replay the same seeded standard-normal draws; each arm's noise control and state "
                "determine the applied scale."
            ),
            "noise_effective_by_arm": {
                "baseline": float(baseline_levers["noise"]) > 0.0,
                "changed": float(changed_lever_values["noise"]) > 0.0,
            },
        },
        "controls": {
            "baseline": dict(baseline_levers),
            "changed": dict(changed_lever_values),
            "requested_overrides": dict(overrides),
            "value_scale": "0 to 10 UI scale; model converts values to 0 to 1",
            "provenance": control_provenance,
        },
        "changed_controls": changed_controls,
        "influences": [dict(item) for item in influences],
        "initial_conditions": {
            "probe_source": "case probe",
            "probe_start": _json_vector(probe_start),
            "probe_traits": {key: float(probe_traits[0, index]) for index, key in enumerate(TRAIT_KEYS)},
            "cohort_source": "seeded synthetic cohort centered on the selected case probe",
            "cohort_center": _json_vector(probe_start),
            "cohort_starts_and_traits_shared_between_arms": True,
            "scenario_traits_used_as_cohort_trait_centers": True,
            "influences_shared_between_arms": True,
        },
        "probe": _probe_result(
            probe_start,
            probe_traits,
            baseline_probe_history,
            changed_probe_history,
            baseline_levers,
            changed_lever_values,
            influences,
        ),
        "cohort": _cohort_result(
            cohort_starts,
            cohort_traits,
            probe_start,
            cohort_trait_center,
            case.get("traits", {}),
            baseline_cohort_history,
            changed_cohort_history,
            baseline_levers,
            changed_lever_values,
            influences,
        ),
    }

    if "probe_b" in case:
        probe_b_start = tuple(float(value) for value in case["probe_b"])
        probe_b_starts = np.asarray([probe_b_start], dtype=float)
        baseline_probe_b_history = simulate(
            probe_b_starts,
            to_unit(baseline_levers),
            probe_traits,
            steps=steps,
            dt=MODEL_DT,
            influences=influences,
            objective=None,
            coupled=False,
            noise=False,
            seed=seed,
            disposition=True,
        )
        changed_probe_b_history = (
            baseline_probe_b_history.copy()
            if same_controls
            else simulate(
                probe_b_starts,
                to_unit(changed_lever_values),
                probe_traits,
                steps=steps,
                dt=MODEL_DT,
                influences=influences,
                objective=None,
                coupled=False,
                noise=False,
                seed=seed,
                disposition=True,
            )
        )
        result["probe_b"] = _probe_result(
            probe_b_start,
            probe_traits,
            baseline_probe_b_history,
            changed_probe_b_history,
            baseline_levers,
            changed_lever_values,
            influences,
        )

    return result

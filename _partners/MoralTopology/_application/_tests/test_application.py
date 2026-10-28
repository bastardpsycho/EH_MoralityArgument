"""Regressions at the Dash boundary: mounted inputs and zero-valued experiments."""

import ast
import json
from pathlib import Path
import unittest
from types import SimpleNamespace
from unittest.mock import patch

import _path  # noqa: F401
from moral_topology import app as application
from moral_topology import __version__
from moral_topology.dynamics import objectivity_test, reversal_test
from moral_topology.levers import LEVERS, TRAITS
from moral_topology.comparison import compare_conditions
from moral_topology.guided import _run_record


def walk(component):
    if isinstance(component, (list, tuple)):
        for child in component:
            yield from walk(child)
    elif hasattr(component, "to_plotly_json"):
        yield component
        yield from walk(getattr(component, "children", None))


class TestApplicationBoundary(unittest.TestCase):
    def test_opening_view_contains_vector_field_and_cohort_traces(self):
        nodes = list(walk(application.app.layout))
        controls = {node.id: node for node in nodes if isinstance(getattr(node, "id", None), str)}
        self.assertEqual(controls["workspace-mode"].value, "laboratory")
        self.assertEqual(controls["view"].value, "field")
        self.assertEqual(set(controls["overlays"].value), {"octants", "attractors"})
        self.assertEqual(application.show_workspace("laboratory"),
                         ({"display": "none"}, {"display": "block"}))
        levers = [node for node in nodes if isinstance(getattr(node, "id", None), dict)
                  and node.id.get("type") == "lever"]
        traits = [node for node in nodes if isinstance(getattr(node, "id", None), dict)
                  and node.id.get("type") == "trait"]
        def value(key):
            return controls[key].value
        fig, *_ = application.update(
            [node.value for node in levers], [node.value for node in traits],
            *[value(f"probe-{axis}") for axis in "xyzw"], [], value("view"), value("overlays"),
            value("obj-on"), value("obj-theory"), value("obj-k"), value("pop-init"),
            value("pop-n"), value("pop-steps"), value("cohort"), value("click-mode"),
            value("b-on"), *[value(f"b-{axis}") for axis in "xyzw"],
            [node.id for node in levers], [node.id for node in traits])
        field = next(trace for trace in fig.data if trace.name == "Force field (w = 0 slice)")
        self.assertEqual(field.type, "cone")
        self.assertGreater(len(field.x), 100)
        names = {trace.name for trace in fig.data}
        self.assertTrue({"Synthetic cohort paths", "Simulated cohort endpoints", "Octant names",
                         "Endpoint clusters (no personal anchors)"}.issubset(names))

    def test_module_entry_declares_current_version_as_literal(self):
        entry = Path(application.__file__).with_name("__main__.py")
        declarations = [node.value for node in ast.parse(entry.read_text()).body
                        if isinstance(node, ast.Assign)
                        and any(isinstance(target, ast.Name) and target.id == "__version__"
                                for target in node.targets)]
        self.assertEqual(len(declarations), 1)
        self.assertIsInstance(declarations[0], ast.Constant)
        self.assertEqual(declarations[0].value, __version__)

    def test_download_http_callback_preserves_paired_result_and_epoch_ms(self):
        result = compare_conditions("everyday", {"scarcity": 9}, steps=3, seed=7, n=4)
        record = _run_record("everyday", "scarcity", 9, "manual", result)
        response = application.app.server.test_client().post("/_dash-update-component", json={
            "output": "guide-download.data",
            "outputs": {"id": "guide-download", "property": "data"},
            "inputs": [{"id": "guide-download-button", "property": "n_clicks", "value": 1}],
            "state": [{"id": "guide-run-store", "property": "data", "value": record}],
            "changedPropIds": ["guide-download-button.n_clicks"],
        })
        self.assertEqual(response.status_code, 200)
        download = response.json["response"]["guide-download"]["data"]
        payload = json.loads(download["content"])
        self.assertIsInstance(payload["ts_ms"], int)
        self.assertGreater(payload["ts_ms"], 1_000_000_000_000)
        self.assertEqual(payload["result"], result)
        self.assertEqual(payload["inputs"]["n"], 4)
        self.assertEqual(payload["inputs"]["steps"], 3)
        self.assertEqual(payload["inputs"]["changed_levers_ui_0_to_10"], {"scarcity": 9})
        self.assertTrue(download["filename"].endswith(f"-{payload['ts_ms']}.json"))

    def test_all_controls_mounted_outside_tabs_and_ids_unique(self):
        nodes = list(walk(application.app.layout))
        ids = [repr(node.id) for node in nodes if hasattr(node, "id")]
        self.assertEqual(len(ids), len(set(ids)))
        self.assertTrue(all(getattr(node, "children", None) is None
                            for node in nodes if type(node).__name__ == "Tab"))
        lever_ids = [node.id for node in nodes if isinstance(getattr(node, "id", None), dict)
                     and node.id.get("type") == "lever"]
        self.assertEqual({node["key"] for node in lever_ids}, {lever.key for lever in LEVERS})
        client = application.app.server.test_client()
        self.assertEqual(client.get("/_dash-layout").status_code, 200)
        self.assertEqual(client.get("/_dash-dependencies").status_code, 200)

    def test_everyday_reset_clears_second_probe_and_influences(self):
        ids = [{"type": "lever", "key": item.key} for item in LEVERS]
        traits = [{"type": "trait", "key": item.key} for item in TRAITS]
        with patch.object(application.dash, "ctx", SimpleNamespace(triggered_id="btn-reset")):
            result = application.load_case(0, 1, 0, "dispute", ids, traits)
        self.assertEqual(result[-2:], ([], []))
        self.assertEqual(result[6:10], (55, 55, 45, -45))

    def test_zero_fixed_pull_is_honored_by_both_experiment_callbacks(self):
        def small_comparison(ecologies, position, **kwargs):
            return objectivity_test(ecologies, position, n=6, steps=3, **kwargs)

        with patch.object(application, "objectivity_test", side_effect=small_comparison) as fn:
            application.run_objectivity(1, "Kantian deontology", 0)
        self.assertEqual(fn.call_args.kwargs["show_strengths"], (0.0, 0.0))

        def small_reversal(phases, **kwargs):
            return reversal_test([(name, values, 2) for name, values, _ in phases], n=6, **kwargs)

        with patch.object(application, "reversal_test", side_effect=small_reversal) as fn:
            application.run_reversal(1, "Kantian deontology", 0)
        self.assertEqual(fn.call_args.kwargs["objective"]["strength"], 0.0)


if __name__ == "__main__":
    unittest.main()

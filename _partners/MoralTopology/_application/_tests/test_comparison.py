"""Paired what-if comparisons preserve their inputs and report only simulated effects."""

import json
import unittest

import numpy as np

import _path  # noqa: F401
from moral_topology.comparison import compare_conditions
from moral_topology.dynamics import simulate
from moral_topology.levers import TRAIT_KEYS, to_unit
from moral_topology.scenarios import CASES


class TestCompareConditions(unittest.TestCase):
    def test_unchanged_controls_produce_exact_zero_paired_deltas(self):
        result = compare_conditions("everyday", {"rule_of_law": 5}, steps=8, seed=3, n=8)

        self.assertEqual(result["changed_controls"], [])
        np.testing.assert_array_equal(result["probe"]["delta"], [0.0] * 4)
        np.testing.assert_array_equal(result["probe"]["delta_path"], np.zeros((9, 4)))
        np.testing.assert_array_equal(result["cohort"]["paired_endpoint_deltas"], np.zeros((8, 4)))
        np.testing.assert_array_equal(result["cohort"]["paired_mean_delta"], [0.0] * 4)
        self.assertEqual(result["probe"]["baseline"], result["probe"]["changed"])

    def test_seeded_result_is_reproducible_and_json_serializable(self):
        kwargs = dict(case_key="disaster", changed_levers={"shared_fate": 0}, steps=10, seed=17, n=9)
        first = compare_conditions(**kwargs)
        second = compare_conditions(**kwargs)

        self.assertEqual(first, second)
        encoded = json.dumps(first, allow_nan=False)
        self.assertIsInstance(encoded, str)
        self.assertEqual(first["settings"]["steps_semantics"], "Model iterations; not elapsed or real-world time.")
        self.assertIn("not a confidence interval", first["cohort"]["empirical_delta_range_10_90"]["interpretation"])

    def test_changed_control_changes_probe_and_records_signed_endpoint_delta(self):
        result = compare_conditions("disaster", {"shared_fate": 0}, steps=16, seed=5, n=12)
        probe = result["probe"]
        expected_delta = np.asarray(probe["changed"]["end"]) - np.asarray(probe["baseline"]["end"])

        self.assertNotEqual(probe["baseline"]["end"], probe["changed"]["end"])
        self.assertEqual(probe["delta"], expected_delta.tolist())
        self.assertEqual(result["changed_controls"], [{
            "key": "shared_fate",
            "label": "Shared fate / common predicament",
            "baseline": 9.0,
            "changed": 0.0,
        }])
        self.assertEqual(result["controls"]["provenance"]["rule_of_law"]["changed_source"], "inherited case lever")
        self.assertEqual(result["controls"]["provenance"]["shared_fate"]["changed_source"], "what-if override")

    def test_case_influences_are_used_for_both_arms(self):
        result = compare_conditions("reform", {"contact": 8}, steps=7, seed=11, n=6)
        case = CASES["reform"]
        probe_traits = np.zeros((1, len(TRAIT_KEYS)))
        starts = np.asarray([case["probe"]], dtype=float)
        expected = simulate(
            starts,
            to_unit(case["levers"]),
            probe_traits,
            steps=7,
            influences=case["influences"],
            coupled=False,
            noise=False,
            seed=11,
        )[:, 0, :]

        np.testing.assert_array_equal(result["probe"]["baseline"]["path"], expected)
        self.assertEqual(result["influences"], case["influences"])
        self.assertTrue(result["initial_conditions"]["influences_shared_between_arms"])
        self.assertEqual(result["cohort"]["initial"]["scenario_trait_centers"], {})

    def test_case_traits_and_second_probe_are_preserved(self):
        result = compare_conditions("rescuer", {}, steps=0, seed=2, n=30)
        self.assertEqual(result["probe"]["traits"]["empathy"], 2.0)
        cohort = result["cohort"]["initial"]
        self.assertEqual(cohort["scenario_trait_centers"], {"empathy": 2.0})
        self.assertEqual(cohort["center"], list(CASES["rescuer"]["probe"]))
        self.assertEqual(cohort["trait_center"]["empathy"], 2.0)
        self.assertTrue(np.all(np.abs(np.asarray(cohort["start_mean"]) - cohort["center"]) < 4.0))
        self.assertTrue(np.all(np.abs(cohort["traits"]) <= 3.0))
        self.assertEqual(result["settings"]["coupled"], {"probe": False, "cohort": False})
        self.assertEqual(result["settings"]["dt"], 0.15)

        dispute = compare_conditions("dispute", {}, steps=3, seed=2, n=5)
        self.assertIn("probe_b", dispute)
        self.assertEqual(dispute["probe_b"]["initial"], list(CASES["dispute"]["probe_b"]))
        self.assertEqual(dispute["probe_b"]["delta"], [0.0] * 4)

    def test_invalid_inputs_raise_instead_of_falling_back(self):
        invalid_calls = (
            (("missing", {}, 1, 1, 1), ValueError),
            (("everyday", {"not_a_lever": 1}, 1, 1, 1), ValueError),
            (("everyday", {"noise": 10.1}, 1, 1, 1), ValueError),
            (("everyday", {"noise": True}, 1, 1, 1), TypeError),
            (("everyday", {}, 1.5, 1, 1), TypeError),
            (("everyday", {}, 1, -1, 1), ValueError),
            (("everyday", {}, 1, 1, 0), ValueError),
            (("everyday", None, 1, 1, 1), TypeError),
        )
        for args, error in invalid_calls:
            with self.subTest(args=args):
                with self.assertRaises(error):
                    compare_conditions(*args)


if __name__ == "__main__":
    unittest.main()

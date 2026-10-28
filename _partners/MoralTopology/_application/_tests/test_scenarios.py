"""Case library and ecology definitions are complete and runnable."""

import unittest

import numpy as np

import _path  # noqa: F401
from moral_topology.dynamics import simulate
from moral_topology.forces import INFLUENCE_TYPES
from moral_topology.levers import LEVER_KEYS, TRAIT_KEYS, to_unit
from moral_topology.scenarios import CASES, ECOLOGIES, REVERSAL_PHASES


class TestCases(unittest.TestCase):
    def test_cases_are_complete(self):
        for key, c in CASES.items():
            with self.subTest(case=key):
                self.assertEqual(set(c["levers"]), set(LEVER_KEYS))
                self.assertTrue(all(0 <= v <= 10 for v in c["levers"].values()))
                self.assertEqual(len(c["probe"]), 4)
                self.assertIn(c["grade"], ("robust", "mixed", "contested"))
                self.assertTrue(set(c.get("traits", {})) <= set(TRAIT_KEYS))
                for inf in c.get("influences", []):
                    self.assertIn(inf["type"], INFLUENCE_TYPES)

    def test_cases_simulate(self):
        for key, c in CASES.items():
            with self.subTest(case=key):
                h = simulate([c["probe"]], to_unit(c["levers"]), steps=20, influences=c.get("influences", ()))
                self.assertFalse(np.isnan(h).any())

    def test_ecologies_and_phases_are_complete(self):
        for name, e in ECOLOGIES.items():
            with self.subTest(ecology=name):
                self.assertEqual(set(e), set(LEVER_KEYS))
        for label, levers, steps in REVERSAL_PHASES:
            self.assertEqual(set(levers), set(LEVER_KEYS))
            self.assertGreater(steps, 0)


if __name__ == "__main__":
    unittest.main()

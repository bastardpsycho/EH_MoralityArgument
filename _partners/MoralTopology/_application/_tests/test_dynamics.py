"""Integration and finite-horizon sensitivity checks on the chosen equations."""

import unittest

import numpy as np

import _path  # noqa: F401
from moral_topology.dynamics import find_attractors, init_population, objectivity_test, reversal_test, simulate
from moral_topology.levers import to_unit
from moral_topology.scenarios import ECOLOGIES, REVERSAL_PHASES, lv


class TestIntegration(unittest.TestCase):
    def test_states_stay_in_bounds(self):
        S0, Tr = init_population("Diverse mix", 60, seed=0)
        L = to_unit(lv(scarcity=10, threat=10, power=10, noise=10, escalation=10))
        hist = simulate(S0, L, Tr, steps=30, coupled=True)
        self.assertTrue(np.all(np.abs(hist) <= 100.0))
        self.assertFalse(np.isnan(hist).any())

    def test_seeded_runs_are_reproducible(self):
        S0, Tr = init_population("Diverse mix", 20, seed=0)
        L = to_unit(lv())
        np.testing.assert_array_equal(simulate(S0, L, Tr, seed=4), simulate(S0, L, Tr, seed=4))


class TestEndpointClusters(unittest.TestCase):
    def test_identity_fusion_separates_endpoint_clusters(self):
        at = find_attractors(to_unit(lv(ingroup=9, threat=6)), grid=4)
        ys = sorted(a["pos"][1] for a in at if a["share"] > 0.1)
        self.assertGreaterEqual(len(ys), 2)
        self.assertGreater(ys[-1] - ys[0], 25)

    def test_everyday_has_single_endpoint_cluster(self):
        self.assertEqual(len(find_attractors(to_unit(lv()), grid=4)), 1)


class TestAssumptionExperiments(unittest.TestCase):
    def test_fixed_pull_reduces_generated_spread(self):
        pos = (70, 85, 80, -30)
        res = objectivity_test(ECOLOGIES, pos, strengths=(0, 8), n=40, steps=60)
        self.assertGreater(res["spread"][0], 20)
        self.assertLess(res["spread"][-1], 0.6 * res["spread"][0])
        self.assertLess(res["within"][-1], res["within"][0])

    def test_scope_tracks_conditions_in_reversal(self):
        rv = reversal_test(REVERSAL_PHASES, n=40)
        ends = [e for _, e, _ in rv["bounds"]]
        x = rv["means"][ends, 0]
        self.assertGreater(x[1], x[0] + 30)   # security widens
        self.assertLess(x[2], x[1] - 20)      # war narrows
        self.assertGreater(x[3], x[2] + 20)   # peace re-widens


if __name__ == "__main__":
    unittest.main()

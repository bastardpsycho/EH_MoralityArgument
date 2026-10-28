"""Force model: decomposition integrity and the documented qualitative behaviours."""

import unittest

import numpy as np

import _path  # noqa: F401
from moral_topology.forces import components, disagreement, drift, felt_objectivity
from moral_topology.levers import LEVER_KEYS


def L0(**over):
    d = {k: 0.0 for k in LEVER_KEYS}
    d.update(over)
    return d


def comp(S, key, L, Tr=None):
    return components(np.atleast_2d(np.asarray(S, float)), L, Tr)[key]


class TestDecomposition(unittest.TestCase):
    def test_components_sum_to_drift(self):
        rng = np.random.default_rng(0)
        S = rng.uniform(-100, 100, size=(50, 4))
        L = {k: float(v) for k, v in zip(LEVER_KEYS, rng.uniform(0, 1, len(LEVER_KEYS)))}
        infl = [dict(type="amplifier", pos=[0, 0, 0], strength=0.5, radius=30),
                dict(type="polariser", pos=[10, 0, 0], strength=0.5, radius=40, axis="y")]
        total = sum(components(S, L, influences=infl).values())
        np.testing.assert_allclose(total, drift(S, L, influences=infl))

    def test_no_levers_leaves_only_cooperation_core(self):
        S = np.array([[50.0, -50.0, 40.0, 30.0]])
        c = components(S, L0())
        for k, v in c.items():
            if k != "core":
                self.assertAlmostEqual(float(np.abs(v).sum()), 0.0, places=9, msg=k)

    def test_objective_term_absent_unless_requested(self):
        S = np.array([[0.0, 0.0, 0.0, 0.0]])
        self.assertEqual(float(np.abs(comp(S, "objective", L0())).sum()), 0.0)
        c = components(S, L0(), objective=dict(strength=1.0, pos=(80, 80, 80, 0)))["objective"]
        self.assertGreater(c[0, 0], 0)


class TestMechanisms(unittest.TestCase):
    def test_threat_pulls_to_ingroup_from_both_sides(self):
        L = L0(threat=1.0)
        self.assertGreater(comp([-95, 0, 0, 0], "threat", L)[0, 0], 0)   # selfish widen
        self.assertLess(comp([80, 0, 0, 0], "threat", L)[0, 0], 0)       # universalists narrow

    def test_scarcity_inverted_u(self):
        at_ingroup = [-35, 0, 0, 0]
        moderate = comp(at_ingroup, "scarcity", L0(scarcity=0.5))[0, 0]
        extreme = comp(at_ingroup, "scarcity", L0(scarcity=1.0))[0, 0]
        self.assertAlmostEqual(moderate, 0.0, delta=1.0)
        self.assertLess(extreme, -20)

    def test_shared_fate_reverses_scarcity_contraction(self):
        L = L0(scarcity=0.7, shared_fate=0.9)
        S = [-40, 0, 0, 0]
        self.assertGreater(comp(S, "scarcity", L)[0, 0] + comp(S, "shared_fate", L)[0, 0], 0)

    def test_anonymity_only_moves_externally_bound(self):
        L = L0(anonymity=1.0)
        ext = abs(comp([0, -60, 0, 0], "anonymity", L)[0, 0])
        internal = abs(comp([0, 60, 0, 0], "anonymity", L)[0, 0])
        self.assertGreater(ext, 10 * max(internal, 1e-6))

    def test_authority_threshold_depends_on_traits(self):
        L = L0(authority=0.7)
        S = [20, 40, 0, 0]
        compliant = comp(S, "authority", L, np.array([[0, -1.5, 0, 1.5, 1.5]]))
        autonomous = comp(S, "authority", L, np.array([[1.5, 1.5, 0, -1.5, -1.5]]))
        self.assertLess(compliant[0, 1], 5 * autonomous[0, 1])
        self.assertLess(abs(autonomous[0, 1]), abs(compliant[0, 1]) * 0.2)

    def test_market_backfires_on_sacralised_values(self):
        L = L0(market=0.9)
        self.assertGreater(comp([0, 85, 0, 85], "market", L)[0, 1], 0)    # entrench
        self.assertLess(comp([0, 60, 0, -60], "market", L)[0, 1], 0)      # calculative

    def test_power_amplifies_existing_forces(self):
        S = np.array([[0.0, 0.0, 0.0, 0.0]])
        base = drift(S, L0(threat=0.8))
        with_power = drift(S, L0(threat=0.8, power=1.0))
        self.assertGreater(np.linalg.norm(with_power[0, 1:]), 1.8 * np.linalg.norm(base[0, 1:]))

    def test_deliberation_direction_depends_on_stakes(self):
        S = [0, 0, 0, 0]
        low = comp(S, "deliberation", L0(delib=1.0, stakes=0.0))[0, 0]
        high = comp(S, "deliberation", L0(delib=1.0, stakes=1.0))[0, 0]
        self.assertGreater(low, 0)
        self.assertLess(high, 0)


class TestPhenomenologyAndDisagreement(unittest.TestCase):
    def test_felt_objectivity_has_two_routes(self):
        L = L0(conformity=0.5)
        sacred = felt_objectivity(np.array([[-30, 80, -80, 70]]), L)[0]
        reflective = felt_objectivity(np.array([[80, 80, 80, -40]]), L)[0]
        mixed = felt_objectivity(np.array([[0, 80, 0, 0]]), L)[0]
        self.assertGreater(sacred, mixed)
        self.assertGreater(reflective, mixed)

    def test_contact_lowers_felt_objectivity(self):
        S = np.array([[0, 60, -60, 40]])
        self.assertLess(felt_objectivity(S, L0(contact=1.0))[0], felt_objectivity(S, L0())[0])

    def test_disagreement_distance_and_sacralisation(self):
        L = L0()
        same = disagreement([0, 0, 0, 0], [0, 0, 0, 0], L)
        self.assertAlmostEqual(same["distance"], 0.0)
        plain = disagreement([-30, 60, -50, 0], [50, 60, 40, 0], L)
        sacred = disagreement([-30, 80, -50, 85], [50, 60, 40, 0], L)
        self.assertGreater(sacred["modifier"], plain["modifier"])
        self.assertEqual(plain["main_axis"], 2)


if __name__ == "__main__":
    unittest.main()

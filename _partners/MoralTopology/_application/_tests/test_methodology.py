"""Model comparisons must not invent separation or silently change assumptions."""

import unittest

import numpy as np
import _path  # noqa: F401
from moral_topology.dynamics import objectivity_test
from moral_topology.forces import disagreement
from moral_topology.levers import to_unit
from moral_topology.scenarios import lv


class TestPairedEcologies(unittest.TestCase):
    def test_identical_conditions_have_no_between_group_spread(self):
        result = objectivity_test({"a": lv(), "b": lv()}, (30, 30, 30, 0),
                                 strengths=(0, 0.5), n=12, steps=10,
                                 show_strengths=(0, 0.5))
        np.testing.assert_array_equal(result["spread"], [0, 0])
        for endpoints in result["endpoints"].values():
            np.testing.assert_array_equal(endpoints["a"], endpoints["b"])

    def test_same_point_has_no_invented_dominant_axis(self):
        result = disagreement([0, 0, 0, 0], [0, 0, 0, 0], to_unit(lv()))
        self.assertIsNone(result["main_axis"])
        self.assertEqual(result["distance"], 0)
        self.assertEqual(result["level"], "No structural separation")


if __name__ == "__main__":
    unittest.main()

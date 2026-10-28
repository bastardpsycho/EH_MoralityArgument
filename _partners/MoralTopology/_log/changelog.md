# Moral Decision Topology — living changelog

Organised by item. Each entry carries `[pass · date]` tags that join it to the `_output/` folder of
the pass that produced it.

## Package / structure
- [pass2 · 20260926-1436Z] Registered MTOP with arch/core/state, build 1.1.0 and no production live version.
  Shared HOWTO reconciliation is signed; MTOP-2/3 retain comprehension and numerical-sensitivity
  follow-ups. The source brief and all 21 case definitions are byte-identical to the Git baseline.
- [pass2 · 20260926-1412Z] Established local Git on main, preserving the incoming app and source brief in
  a baseline commit. Canonical identity is MTOP, standalone application in Social Tools; folder
  stays in place and runtime remains independent of trading infrastructure. Added project.md and
  pointer-only companions. Shared 0_Codex venv is the required interpreter; no packages installed.
- [1.0.a · 20260925Z] New package `_application/moral_topology/`. It was factored and extended from
  `../PlotMoralElevation-GPT5.v001.py`, which had the amplifier bomb and 4 regimes, and from the
  `v999-backup-prerefresh` concepts (consensus field, re-keying planes, 7 blobs). Both originals are
  left untouched. Runs with the `0_Dash/venv` interpreter; the port comes from `find_free_port()`,
  starting at 8150.

## State space
- [1.0.a · 20260925Z] The x/y/z axes are kept as in the summary. Added w, the moral-foundation tilt,
  shown as colour. The octants are named. The x axis has named scope bands.
- [1.0.a · 20260925Z] Octant (−,+,−) was renamed from "Devoted loyalty" to "Felt local obligation" so
  that it also covers everyday kindness. Octant (−,−,−) was renamed from "Coerced survival" to
  "Compliance under pressure", because Milgram-type states land there.

## Force model
- [1.0.a · 20260925Z] 24 levers across 5 groups, each with its mechanism, sources and evidence grade.
  The former random-per-point drift is replaced by deterministic trait-modulated forces plus explicit
  noise.
- [1.0.a · 20260925Z] Linear pulls averaged every case into the centre. Fixed with convex lever gains
  (1.5·L²).
- [1.0.a · 20260925Z] Populations collapsed to consensus (within-ecology SD ≈ 5). Fixed with:
  - a disposition anchor (k = 0.8, habit 0.004 per step);
  - trait thresholds for authority and propaganda;
  - temperament-dependent core targets;
  - larger noise.
- [1.0.a · 20260925Z] No multistability at first. Steepened three loops: fusion (y > 45, k 2.0), the
  corruption trap (y < −5, k 1.5) and sacred entrenchment (w, y > 45, k 2.0). The fusion, honour,
  sacred-value and war cases now show two basins.
- [1.0.a · 20260925Z] Scarcity changed to an inverted-U to match summary §III: moderate scarcity pulls
  to the ingroup and collapse pulls to self. Previously it pulled to kin first.
- [1.0.a · 20260925Z] Defect: the scarcity collapse gate leaked about 1e-7 of gain at scarcity 0.
  Fixed by multiplying the gate by scarcity. Found by `test_no_levers_leaves_only_cooperation_core`.

## Felt objectivity
- [1.0.a · 20260925Z] First version: a single intuitive-sacred route.
- [1.0.a · 20260925Z] Superseded by a two-route version to match summary §V, which adds the
  reflective-universal route (justification that reads as discovery). Coerced compliance now scores
  low (Milgram case Φ ≈ 0.14).

## Disagreement geometry
- [pass2 · 20260926-1412Z] Removed clinical and predictive language from calculated indices. Identical
  configurations no longer report a dominant disagreement axis. A/B text reports the actual
  direction of distance change instead of always promising convergence. Distance weights remain
  explicit model choices; endpoint clusters expose residual drift and no longer assert equilibrium.
- [1.0.a · 20260925Z] Added probe B, the A–B distance, axis shares, intelligibility, and intensity
  modulated by sacralisation, fusion and enforcement (summary §IV). Added the case "Two sides of a
  contested issue".

## Influences (amplifier bomb generalised)
- [1.0.a · 20260925Z] Placeable attractor, repeller, amplifier bomb, stabiliser and polariser, each
  with Gaussian reach. Cases can preload influences (the "Reform movement" case).

## Thesis tests
- [pass2 · 20260926-1412Z] Reframed as assumption experiments. Preserved the philosophical source and
  numerical mechanism, but removed claims that a generated pattern establishes realism's
  redundancy. Situation comparisons now share random draws across conditions; zero-strength
  inputs remain zero. Tests describe generated spread and finite endpoint clusters, not validated
  sociological predictions or proven attractor stability.
- [1.0.a · 20260925Z] Ecology-dependence test.
  - Defect: the first metric, η², is scale-invariant and stayed at 0.75 for every k, so it could not
    discriminate. Superseded by absolute between- and within-ecology spreads plotted against k (0–8),
    with scatter plots at k = 0 and at the user's k.
- [1.0.a · 20260925Z] Reversal test.
  - The summary claims ("peaks during war", "damps") were first hard-coded. They are now computed
    from the run.
  - The text now says plainly that a weak objective pull produces almost no damping.

## UI
- [pass5 · 20261005-2223Z] Restored full-model opening experience after operator reported sparse guided chart. Default workspace is Full model, view Force field, with octant names and endpoint clusters enabled. Field view now includes the existing simulated cohort traces/endpoints (previously omitted in field mode). Dark theme and 3600px layout retained. Earlier c75a4a5 introduced guided-first startup and empty overlays; styling passes did not remove the field engine.
- [pass4 · 20261005-2011Z] Expanded both workspace containers to 3600px. At viewport widths >=2300px, guided/full-model graph heights are 1640/1700px so inner plotting canvases exceed 1600px after chart margins. Browser at 3840x2160 measured guided canvas 3022x1622 and full model 3017x1604; 390px mobile remains 340px high without horizontal overflow. Build/local preview 1.2.1.
- [pass3 · 20261005-1922Z] Astra midnight-observatory makeover: navy panels, cyan/pink paired paths, violet accents, orbital artwork, responsive native controls and coordinated Plotly figures. Visible v1.2.0 badge; canonical local preview restarted on 8150 after verifying project ownership of the prior 8151 process. Numerical model and 21 cases preserved.
- [pass2 · 20260926-1412Z] Added a consumer-first guided comparison with paired starts, traits and noise,
  one-condition interventions, plain-language four-axis outcomes, dark map/light editorial theme,
  responsive reading and a reproducible JSON brief. All cases and advanced tools remain in the
  independent full-model workspace. Every control pane remains mounted so callbacks can read
  controls across tabs; reset also clears the second probe. Full model copy distinguishes model
  indices, assumed cloud/theory positions, simulation iterations and inherited literature tags.
- [1.0.a · 20260925Z] Left tabs: Case, Levers, Person, Influences, Thesis. Views: probe + cohort,
  force field (cones) + attractors, population (animated). Bottom tabs: Explanation (decomposition
  heatmap + readout), Thesis tests, Population.
- [1.0.a · 20260925Z] The legend was moved below the scene, the click lattice was faded, cone sizes
  were normalised, and the animation controls were moved to the top.

## Tests
- [pass5 · 20261005-2223Z] 37 tests pass, including actual default callback output with vector cones, cohort paths/endpoints and default overlays. Local preview v1.2.2 started on 8150. Browser refresh blocked by browser-tool security policy; new screenshot and visual readback unavailable in this pass.
- [pass3 · 20261005-1922Z] 36 tests pass, including literal module-entry version parity. Desktop and 390px browser checks cover reset/run, second case, 2D view, dropdowns and full-model controls; no horizontal overflow or console errors observed.
- [pass2 · 20260926-1436Z] Final suite: 35 passing tests; all 21 unchanged-case comparisons give exact zero.
  HTTP JSON export provenance is verified; embedded-browser file-save completion remains unverified.
  Desktop and 390px layouts checked, including the corrected 350px mobile graph.
- [pass2 · 20260926-1412Z] Added paired-comparison, invalid-input and methodology regression checks;
  browser and callback verification are recorded in this pass's _output handover. No prior
  behavioural test was retired; attractor/thesis test names were clarified to match what they prove.
- [1.0.a · 20260925Z] Added `_tests/test_forces.py`, `test_dynamics.py` and `test_scenarios.py`
  (stdlib unittest, 23 tests).

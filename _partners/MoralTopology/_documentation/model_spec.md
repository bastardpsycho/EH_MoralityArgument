# Moral Topology — model specification

Source concept: `_source/MoralTopology2pageSummary.rtf` (preserved unchanged).
This implementation is an illustrative decision-mapping mechanism. Its coefficients,
coordinates, thresholds and transforms are author choices, not fitted measurements.
The source's philosophical thesis is motivation; a self-contained simulation does
not validate that thesis or settle moral realism.

## What a point represents

A point describes the structure of a judgement. It does not encode a person, their
moral worth, a policy position, or an action verdict. Different configurations can
produce the same conclusion; identical coordinates can omit decisive context.

| Axis | −100 → +100 | Interpretation |
|---|---|---|
| x | Self → all sentient beings | Scope: who counts |
| y | Outside sanction → internal conviction | Binding: what holds the norm in place |
| z | Intuitive/affective → reflective | Processing: how the judgement is formed |
| w | Care/fairness → loyalty/authority/sanctity | A deliberately compressed value tilt |

All axes use arbitrary model units. Positive is not morally better. The bipolar w
axis cannot represent high or low emphasis on both ends simultaneously. The 3D map
projects out w; full-model markers can encode it as colour. Guided paths use colour
for the comparison arms, with w reported in the outcome reading.

Bands, octant names, theory positions and regime-cloud locations are interpretive
annotations. The clouds are generated from chosen centres and spreads, not observed
population densities. Moving across a band boundary changes a label discontinuously,
although the underlying coordinate changes continuously.

## Dynamics

`ds/dt = sum(F_i) + influence terms + power amplification + noise`

Most terms are target pulls: `gain × axis coefficient × (target − current state)`.
Lever values 0–10 are converted to 0–1; salience uses `1.5 × lever²`. The model
includes threshold gates and feedback for authority, propaganda, fusion, sacred
value entrenchment and externally held norms. These generate illustrative nonlinear
responses; their existence in the code is not independent evidence for them.

- The cooperation core is always active, with a temperament-adjusted base target
  `(−30, 20, −20, 0)`. Zeroing all levers does not remove it.
- Individual trajectories have a home/disposition pull of 0.8. Home updates at
  `0.004 + 0.3 × escalation` per iteration. This is explicitly a discrete update;
  changing the integration interval does not preserve a calibrated physical process.
- Population conformity uses a Gaussian neighbour mean, bandwidth 30 on x/y/z.
  Lone probes and uncoupled comparison cohorts use a fixed everyday norm.
- Local influences retain Gaussian reach and the original attractor, repeller,
  amplifier, stabiliser and polariser mechanisms. Multiple influences are additive
  on drift; overlapping strong effects can produce unusual outcomes.
- Noise is stochastic but reproducible with fixed seeds. It can depend on the
  situation and local stabilisers. A deterministic probe path omits noise.
- Euler–Maruyama updates use dimensionless `dt`; step vectors are capped at 25 and
  states clipped to ±100. These numerical choices can affect extreme runs.

Model iterations are not elapsed hours or years. Real export provenance uses integer
`ts_ms` epoch milliseconds and is separate from iteration indices.

## Guided paired comparison

`comparison.compare_conditions` starts both arms from the selected case, including
its probe, trait offsets and local influences. It uses identical cohort starts,
traits, random draws and iteration count. Only the explicitly changed levers differ.
If a changed lever affects noise amplitude, the underlying draws remain paired while
amplitude changes as part of the modeled intervention. The fixed attractor is absent
in this guided experiment; it remains available in the full model.

The deterministic endpoint difference, cohort mean endpoint difference and empirical
10th–90th percentiles of paired cohort differences answer different questions.
The cohort range is generated variation, not a confidence interval, prediction
interval or estimate of population uncertainty. Unchanged inputs yield exactly zero
paired differences. Initial force differences explain the immediate local change;
nonlinear path feedback means they are not a causal decomposition of the endpoint.

## Full-model readings

- Signed component vectors sum to instantaneous drift. Shares based on vector norms
  are shares of component magnitudes, not of net drift or explained endpoint change;
  opposing terms can cancel. Starting-force readouts do not describe the entire path.
- Felt certainty and commitment/pressure are illustrative 0–1 indices. Neither is
  a measured probability, diagnosis, validated psychological scale or clinical risk.
- A/B distance uses axis weights `(1, 1, 1, 0.6)` before Euclidean distance. Axis
  shares use squared weighted differences. Identical points have no dominant axis.
- The overlap proxy `exp(−distance/120)` and tension transform are stipulated. They
  do not predict mutual understanding, agreement or intractability.
- Endpoint clusters come from deterministic grid starts without personal anchors.
  Shares refer to that finite grid and horizon only. Residual speed is exposed;
  neither convergence nor equilibrium stability is proven. They are not probabilities
  of where a real population settles, and use different dynamics from anchored probes.

## Assumption experiments

The situation experiment holds starts, traits and random draws fixed across the seven
presets and each fixed-attractor strength. It reports between-centroid RMS spread,
mean within-group RMS spread and η² across all four axes. A fixed pull tends to
shrink dispersion by construction; this cannot establish the redundancy of realism.
The chosen k=0 is honoured as zero in both experiment callbacks.

The reversal experiment carries the cohort and home anchors through four presets.
The comparison with a fixed pull uses paired draws and reports observed model
changes without promising that shared conditions always cause convergence.

## Boundaries and next evidence

The historical and research-inspired cases remain intact, with their source text
and inherited literature tags. This pass does not independently audit that
literature. Tags do not validate a numerical reconstruction. Stronger real-world
claims would need defined constructs, calibration, held-out validation, sensitivity
checks and competing mechanisms. First-use comprehension testing is the most useful
next step for the present consumer demonstrator.

Run/test recipes are in `plumbing.md`; consumer framing is in `consumer_experience.md`.

# Moral Topology — consumer redesign and mechanism review

Pass2 · build 1.1.0 · 26 September 2026 UTC

The project now opens as a decision-mapping studio. A visitor changes one condition
and sees how the same starting configuration develops under the original and changed
conditions. This makes the mechanism operational: there is a specified intervention,
a controlled comparison, a readable result and an inspectable set of assumptions.

The supplied `_source/MoralTopology2pageSummary.rtf` was read in full. The actual
folder is `_source/`, singular. It and all 21 original case definitions are unchanged.
Cold storage was not inspected. This pass reviewed the implementation against its
intended explanatory function; it did not independently audit the inherited literature.

## What is delivered

- A guided landing experience with a worked example immediately visible, all 21
  cases, one-condition changes, suggested interventions and a genuine zero-difference reset.
- Paired comparisons with the same starts, traits, random draws and horizon in both
  arms. Case traits and local influences are retained. The engine is independent of Dash.
- Four plain-language outcome cards: who counts, what binds, how the judgement is
  processed, and which concerns get more weight. Each shows original, changed and difference.
- A dark teal map with distinct original/changed paths, fitted equal-scale axes,
  a full-space option and a 2D alternative. The fourth axis has its own numerical
  card; the 3D picture is not the sole explanation.
- A warm ivory theme, serif headings, readable data, keyboard-capable controls and
  a stacked narrow-screen layout. The Dash responsive-height override was corrected.
- Starting-force differences and paired cohort variation, with their meanings stated.
- A JSON export containing epoch-millisecond `ts_ms`, version, inputs and full results.
- The original full-model sandbox, including both probes, population, field views,
  local influences, traits and assumption experiments. Its state stays independent
  of the guided workspace.

## Methodological findings and treatment

| Finding | Consequence | Treatment |
|---|---|---|
| A model whose forces are stipulated can reproduce its own assumptions. | Generated patterns cannot independently establish moral realism's redundancy or explain actual behaviour. | Reframed thesis tests as assumption experiments; retained the philosophical source and numerical mechanisms. |
| Different random seeds were used across ecology conditions. | Random variation contaminated the comparison of conditions. | Matched draws across conditions and fixed-pull strengths; added an identical-conditions regression test. |
| A zero-valued fixed-pull control was replaced by a default. | The visible setting did not describe the computation. | Honoured zero in both experiment callbacks and tested the callback boundary. |
| Finite-horizon endpoint clusters were called attractors without stability evidence. | Readers could mistake a sampled endpoint pattern for a proven equilibrium. | Relabeled them, exposed residual drift and documented the grid/horizon/anchor differences. |
| Clinical-sounding injury risk, intelligibility and conflict labels lacked calibration. | Interface language overstated the meaning of invented indices. | Reworded them as modeled commitment/pressure, overlap and tension; removed predictive certainty. |
| Component vector norms were presented as explanation shares. | Cancellation and later feedback made that reading misleading. | Identified them as component-magnitude shares; guided mode shows signed starting differences rather than endpoint attribution. |
| A/B commentary promised convergence; coincident points still had a dominant axis. | Text could contradict the actual result. | Reported measured distance direction and no dominant axis at zero distance. |
| Tab contents unmounted controls used by callbacks elsewhere. | Cross-tab experiments could lose their required input components. | Kept all control panes mounted and toggled their visibility; verified unique IDs. |
| Reset retained the second probe and influences. | A supposed baseline could carry prior case state. | Cleared both and added a regression test. |

Some limits are deliberate and remain visible. Axis units, coefficients, theory
positions, band thresholds and distance weights are authored. The bipolar foundation
tilt compresses several concerns and cannot express high emphasis on both ends.
Positive coordinates are not morally better. The model maps a configuration, not
whether a person will obey, help, harm or choose a particular policy.

The cohort's 10th–90th percentile range describes simulated variation; it is not a
confidence interval. Its guided population is a local sample around the case probe,
not a representative population. Guided cohorts are uncoupled and use the fixed norm;
the full-model coupled population is a different experiment. A deterministic probe
omits noise, so the noise lever can affect the cohort without changing that probe.
The two-sided dispute case follows probe A in guided mode; both probes remain in the
full model and comparison export.

Numerical clipping, step caps, horizon and clustering tolerance can matter. The home
anchor updates per iteration, so changing `dt` does not automatically preserve an
equivalent process. These are reasons to avoid stronger dynamical claims, not reasons
to discard a useful mechanism demonstrator.

## A meaningful consumer presentation

The promise is **make the assumptions behind a judgement discussable**. The tool is
well suited to a facilitated conversation, teaching demonstration or workshop about
how circumstances affect the structure of a decision.

1. Open the everyday case. Show scarcity rising from 0 to 9. The default deterministic
   run changes scope by about −22.0, binding by −9.5, processing by −14.3 and foundation
   tilt by +5.9 model points. Explain those four movements without calling them better
   or worse. The inputs, horizon and seed remain visible.
2. Reset to the case baseline. Every paired difference becomes zero. This establishes
   how to read a comparison before introducing additional complexity.
3. Change to the disaster case and try the suggested removal of shared fate. Scope
   shifts by about −9.3 and binding by −5.2, while processing and foundation tilt remain
   unchanged in this run. Discuss the stipulated interaction between scarcity and shared fate.
4. Open the starting forces and assumptions. Ask which assumption a participant would
   challenge and what observation would make them reconsider it.
5. Move to Full model for multiple changes, traits, both sides of a dispute or population
   dynamics. Explain that this is an independent sandbox rather than the same controlled run.

The next useful product evidence is first-use comprehension: can someone identify
what changed, interpret the four outcomes and distinguish model configuration from
moral verdict? Custom authoring and saved/shared sessions can follow that evidence.
Neither empirical calibration nor public hosting is claimed by this delivery.

## Validation and practical limits

- 35 unit and HTTP-callback tests passed using the required shared Python environment.
  These test mechanisms and software integrity, not sociological truth.
- All 21 cases simulated; unchanged comparisons were additionally checked across all
  cases for exact zero paired differences.
- Browser checks covered the initial comparison, reset, manual slider changes and
  stale-result invalidation, suggested changes, the disaster case, 2D view, Full model,
  its mounted lever controls, population output and a zero-strength assumption run.
- Desktop and 390×844 layouts were visually inspected. At narrow width, the document
  remained within the viewport and the guided graph was exactly 350px high.
- No browser console errors were observed. The Dash layout/dependency routes and the
  actual HTTP download callback returned successfully.
- JSON response contents, inputs, cohort size, horizon and `ts_ms` are tested. The
  embedded browser did not expose a completed download event, so saving the file on
  the user's device is not claimed as verified. A generated comparison JSON is included
  in this pass folder as directly accessible evidence.
- The source brief and scenarios are byte-identical to the incoming Git baseline.
  No dependency was installed. No public deployment was made.

## Organization and continuation

MTOP is registered as a standalone **application / Social Tools** project in the shared
cross-op database. The folder remains in place. The register has `arch`, `core`, current
`state`, build 1.1.0, and a NULL production `live_version`. Registration was checked in
a guarded transaction with `integrity_check=ok`; a receipt is included here.

`MTOP-STATE` holds durable boundaries. `MTOP-1` records this completed pass. `MTOP-2`
tracks comprehension testing and `MTOP-3` tracks numerical sensitivity work before
stronger dynamical claims. The shared HOWTO reconciliation ledger is signed for MTOP.

The independent local Git repository has an incoming baseline on `main`; the redesign,
documentation and current pass evidence are committed separately. No remote is configured.
Pre-existing output outside this pass and cold storage were not ingested.

Use `project.md` for durable orientation, `_documentation/model_spec.md` for the model,
`_documentation/consumer_experience.md` for the product framing and
`_documentation/plumbing.md` for launch/test recipes. The loopback preview is available
at http://127.0.0.1:8150/ while its local process remains running.

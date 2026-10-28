# Moral Topology v2 — Astra assessment and revised design

## Current contract and supersession

The Operator clarified that **each influence carries all three axes**. This document supersedes the earlier three-scalar, axis-exclusive model and its differential shared response coefficients. The current model has **three vector influence groups, nine signed scalar controls**: Personal A [x,y,z], Personal B [x,y,z], and Shared scenario [x,y,z]. Public and local versions expose the same manageable interactive controls. This revision is the current implementation target.

The five fictional case starts and three common axis meanings remain. All numerical coordinates, response scales, and stories are authored assumptions. They are not measurements of people, demographic predictions, or an assessment of moral worth.

All five examples are deliberately constructed to permit a meeting. This is a teaching-example selection criterion, not a claim that disagreements generally converge. Ordinary settings can preserve, reduce, or increase separation. No time evolution, noise, hidden attraction, consensus target, fourth dimension, cohort, fitted coefficients, policy threshold, or moral score exists.

## Common axes and signs

| Axis | Label | Meaning |
|---|---|---|
| x | Personal agency | Relative weight given to the directly affected person's control over their own life and choices. |
| y | Preventing harm | Relative weight given to avoiding serious burdens or harms to affected people; each case names the relevant burdens. |
| z | Shared responsibility | Relative weight given to obligations and practical responsibilities beyond the immediate individual or pair, including communities and institutions. |

Fixed chart bounds are **−150 to +150** arbitrary illustration units on every axis. Zero is an authored reference level, not absence of concern. Negative coordinates mean lower relative emphasis than this reference, not rejection of the consideration; positive coordinates mean higher emphasis, not moral superiority. Weights are independent, not percentages summing to 100. The same three axes apply to every case and every view.

Octants are geometric regions only. Do not name them as ideologies, character types, or virtues. Starts occupy six different octants and contain no zero coordinate. Coordinates do not follow from the characters' religion, age, occupation, or family role.

## Deterministic model

Let `a=[ax,ay,az]`, `b=[bx,by,bz]`, and `g=[gx,gy,gz]`. Each scalar is in `[-1,1]`; UI step is `.01`. All scales are explicitly authored and identical across cases:

```text
personalA_scale = [50,50,50]
personalB_scale = [50,50,50]
shared_scale    = [25,25,25]

A = A0 + 50*a + 25*g
B = B0 + 50*b + 25*g
A - B = (A0 - B0) + 50*(a - b)
```

Multiplication and addition are componentwise. Personal A can change all three coordinates of A and none of B. Personal B can change all three coordinates of B and none of A. The shared vector is **the same displacement applied to both points** on all three axes. There is no differential shared response and no hidden rescaling or target pull.

The shared vector changes the displayed common context but **cannot change the pair's separation**: `A-B` is independent of `g`. This is an exact algebraic feature of this representation, not a psychological claim that shared conditions cannot affect disagreement in real life. A shared scenario producing different real responses would require a different model. Do not describe this equal translation as bringing people closer.

Signed components describe the chosen direction and size of an assumed emphasis shift. A positive component increases that axis's emphasis; a negative component decreases it; zero leaves it unchanged. They are not amounts of factual evidence and negative does not mean ignoring, opposing, or disbelieving the named issue. The context-specific cues below say which consideration the slider concerns. The model does not predict that the described encounter causes the selected change.

Every full-domain position stays inside the fixed chart: the largest absolute start component is 60, and `60+50+25=135<150`. No clipping or auto-rescaling is necessary or permitted. Validate all nine finite bounded inputs and vector shapes. The model has no general need to solve a meeting: the five authored witness values are data and should be checked by substitution.

Intersection is tested from the unrounded raw three-coordinate difference with a stated small floating-point tolerance, e.g. `1e-9` illustration units. Do not round the displayed distance and then declare equality. Avoid reporting a rounded `0` gap while claiming separated endpoints: show `<0.001` when a positive raw gap rounds away. No tolerance is a psychological agreement zone.

## Final starts and explicit nine-control witnesses

For every case the witness uses `g=[.2,-.2,.2]`, hence the common shift is `[5,-5,5]`. It uses `a=(B0-A0)/100` and `b=-a`. Personal movements therefore take each viewpoint to the initial midpoint before the common translation. These are transparent construction choices; the interface does not force them.

| ID | A0 | B0 | Personal A witness a | Personal B witness b | Shared witness g | Meeting coordinate |
|---|---|---|---|---|---|---|
| abortion | [-60,40,-40] | [20,-40,5] | [.8,-.8,.45] | [-.8,.8,-.45] | [.2,-.2,.2] | [-15,-5,-12.5] |
| punishment | [-50,-15,10] | [10,30,-35] | [.6,.45,-.45] | [-.6,-.45,.45] | [.2,-.2,.2] | [-15,2.5,-7.5] |
| climate | [35,50,5] | [-40,10,-40] | [-.75,-.4,-.45] | [.75,.4,.45] | [.2,-.2,.2] | [2.5,25,-12.5] |
| privacy | [-30,-20,-40] | [5,40,5] | [.35,.6,.45] | [-.35,-.6,-.45] | [.2,-.2,.2] | [-7.5,5,-12.5] |
| assisted-dying | [20,35,10] | [-55,-25,-20] | [-.75,-.6,-.3] | [.75,.6,.3] | [.2,-.2,.2] | [-12.5,0,0] |

All witness components lie on the `.01` slider grid. Set all nine components to zero for reset. If offering a partial preset, use `a=.5*a_witness`, `b=.5*b_witness`, and `g=[0,0,0]`; it halves the original separation without reaching a meeting. Such a preset would include `.005` increments in some cases, so either allow `.005` steps consistently or omit that unnecessary preset. Reset and constructed-meeting controls are sufficient.

Useful nonmeeting and divergence examples:

- Set a=b=[0,0,0] and vary any or all g components: both points move but their separation stays exactly constant.
- At any witness, change ax by +.1 where allowed: the points separate by 5 units on x. No other component compensates automatically.
- In the privacy case, set a=[-1,0,0], b=g=[0,0,0]. Initial x separation 35 increases to 85. Squared full separation rises from 6850 to 12850. This is divergence from the starting pair, not merely departure from an already constructed meeting.

## Five fictional cases and starting recommendations

These descriptions and possible shared options remain authored story possibilities. Starting-position cards remain visible after controls change. The app never infers a policy answer from coordinates or silently revises either person's recommendation.

### Abortion: conviction and a grandfather's concern

Elise, a pregnant adult, is considering ending a pregnancy. Mara and Daniel discuss what public rules and family support should allow. Neither represents a religion, age group, sex, or family role.

**A — Mara, fictional religious friend:** Her religious conviction gives developing fetal life strong moral significance. She currently favors restricting elective abortion, with an exception when the pregnant person's life is threatened. This is an individual authored position, not a characterization of religious people generally.

**B — Daniel, Elise's fictional grandfather:** He currently favors keeping abortion legally available and helping Elise make her own decision. He focuses on her wishes and practical family circumstances. Being a grandfather implies neither this position nor any coordinate.

**Possible shared practical option — support without coercion:** They could both agree to offer practical help and a confidential opportunity for Elise to discuss her wishes, without making their help conditional on her choice. This concerns their conduct toward Elise; it does not settle the opposing legal positions, resolve fetal moral status, or decide for her.

### Punishment: prison and repair

An adult has committed a serious property offence that harmed a household. This fictional case provides no real-world recidivism or sentencing evidence.

**A — Leila, member of the harmed household:** She currently favors a substantial prison sentence as an expression of accountability.

**B — Owen, community volunteer:** He currently favors a supervised restorative program with enforceable repair obligations.

**Possible shared practical option — enforceable repair with a suspended sentence:** They could both support a supervised repair program backed by a suspended sentence and explicit compliance review. This differs from both starting recommendations. The story does not establish suitability, legality in a jurisdiction, or effectiveness.

### Climate: a household and a town transition

A town is considering a rapid restriction on high-emission private vehicles. A household faces difficult travel and care arrangements. No emissions, cost, or effectiveness estimate is supplied.

**A — Noor, household carer:** They currently favor delaying the restriction until the household has a workable alternative.

**B — Ellis, local organizer:** They currently favor introducing the restriction soon with a transition scheme.

**Possible shared practical option — a staged restriction with access support:** They could both accept an announced start date, temporary care-related exemptions, and funded travel alternatives before exemptions expire. Their possible acceptance is an additional story assumption. The diagram does not establish effectiveness or determine the start date.

### Privacy: public cameras and safeguards

A town is debating expanded public cameras after reported incidents. No crime rate, effectiveness estimate, or actual technical system is supplied.

**A — Mina, shopkeeper:** She currently favors expanding cameras in public areas, subject to stated oversight.

**B — Jules, resident:** They currently favor declining the expansion and using less intrusive responses.

**Possible shared practical option — a limited, reviewable pilot:** They could both accept a short pilot in a narrowly specified area, no facial recognition, limited retention and access, independent resident oversight, and an explicit end date unless review justifies renewal. This is a modified proposal, not a coordinate-derived verdict or certification of safeguards.

### Assisted dying: choice and continued care

A seriously ill adult is discussing assisted dying and continued care. No jurisdiction, eligibility rule, prognosis, or clinical recommendation is specified.

**A — Ren, patient advocate:** They currently favor making assisted dying available under safeguards to a person who persistently requests it.

**B — Ada, caregiver:** She currently favors continuing care without providing assisted dying, while respecting the person's account of suffering.

**Possible shared practical option — a care and wishes plan now:** They could both support immediate dependable care, a private opportunity for the person to express their wishes, and a further discussion explicitly checking for felt obligation. This is agreement on a next step, not agreement to provide or refuse assisted dying. Keep that narrower scope visible.

## Context-specific cues for all nine sliders

Each row is one influence card with three scalar controls. Each cue identifies the consideration whose **relative emphasis** is raised or lowered by its signed component; it does not assert a causal response. Display `Less emphasis ← 0 → More emphasis` or equally clear direction wording, plus the numerical signed value and maximum displacement. Retain common axis names beside these specific cues.

| Case / influence group | Group title | x cue: personal agency | y cue: preventing harm | z cue: shared responsibility |
|---|---|---|---|---|
| abortion / Personal A | Conversation with Elise | Elise's control over her own decision | The burdens Elise describes | Responsibilities beyond Mara and Elise |
| abortion / Personal B | Family deliberation | Elise's independence from family pressure | Health, care, and family burdens | The wider family's responsibilities |
| abortion / Shared scenario | Available community support | Choice within the offered support | Burdens the support is meant to address | Community obligations to provide support |
| punishment / Personal A | Accountability conversation | The offender's agency in acknowledging and repairing harm | Burdens on the harmed household | Community responsibilities for accountability |
| punishment / Personal B | Repair planning | Participants' choice and participation in repair | Possible continuing harm | Duties to sustain a repair program |
| punishment / Shared scenario | Public supervision setting | Agency within the proposed response | Harms the response is meant to prevent | Institutions' supervision responsibilities |
| climate / Personal A | Household travel deliberation | Household discretion over travel | Travel and care burdens on the household | The household's share in collective change |
| climate / Personal B | Transition planning | Residents' choice among workable alternatives | Burdens on households without alternatives | Shared obligations in the town's transition |
| climate / Shared scenario | Funded transition context | Choice within the transition arrangements | Burdens the arrangements should address | Duties to provide transition support |
| privacy / Personal A | Residents' accounts | Control over everyday conduct in public | Burdens associated with incidents and monitoring | Responsibilities toward other residents |
| privacy / Personal B | Safeguards assessment | Control over personal information and conduct | Anticipated privacy and safety harms | Duties to scrutinize the proposed system |
| privacy / Shared scenario | Public oversight setting | Agency under the oversight arrangements | Harms the oversight should address | Residents' and institutions' oversight duties |
| assisted-dying / Personal A | Wishes and pressure deliberation | The person's expressed choice | Suffering and burdens of felt obligation | Responsibilities beyond the advocate and patient |
| assisted-dying / Personal B | Care deliberation | The person's control over care choices | Burdens of unwanted continued suffering | The wider care network's obligations |
| assisted-dying / Shared scenario | Dependable care setting | Choice within the available care | Burdens the care is meant to address | Duties to sustain dependable care |

The shared cues name the same modeled shift for both viewpoints. They do not introduce different per-person coefficients. At a constructed witness, a negative component in one personal group simply means the authored example gives that consideration less relative emphasis there. It is not a claim about what the encounter must do or which speaker has improved.

## Rendering and interaction

Use three compact influence cards, each containing x/y/z sliders, for **nine controls grouped as three vectors**. On desktop keep the chart and control cards visible together; on mobile stack cleanly with no horizontally clipped labels. Case switching resets all nine values to zero and clearly says so. Provide reset, constructed-meeting, and private JSON-download actions. Camera/projection buttons are display settings, not model influences.

There are three legend families and **four applied resultant arrows**: A's personal vector, B's personal vector, and the same global vector applied at each personal endpoint. Each resultant can run in any 3D direction; the old requirement for axis-parallel resultants is superseded. Optional x/y/z component guides may be shown faintly but should not overwhelm the three-group structure.

Draw personal resultants from each start to its personal endpoint, then shared resultants to its final endpoint. This is a vector-addition diagram, not a temporal trajectory; addition commutes. Start markers are hollow; final markers filled. Use A/B letters and distinguishable marker shapes as well as color. At coincident endpoints, both identities remain identifiable. Shared arrows have the same world-space length and direction in the same projection.

Provide a fixed oblique 3D chart and x/y, x/z, y/z projections. State the omitted depth in orthogonal views. In 3D, mention that a 2D image can hide separation. Never infer meeting from pixel overlap; use all three numerical differences. Preserve fixed equal axis scales, labeled ticks, origin planes, and a legible legend.

The text table gives A/B starting coordinates, personal displacement, shared displacement, final coordinates, and per-axis difference. Numeric presentation must not pretend rounded values are exact. Small nonzero gaps retain a truthful label. Public and local versions use the same pure model and browser rendering; no Python/backend simulation is required.

Each native slider has a specific visible label, numeric value, bounds, keyboard operation, and an accessible name identifying the influence and axis. No color-only distinction or required motion. Keep focus visible and updates intelligible with assistive technology. A textual coordinate reading must remain useful without seeing the chart. Browser QA covers mobile layout and real interaction, beyond source-level tests.

Starting recommendations remain alongside the chart or immediately below. The possible shared practical option stays independently visible and explicitly hypothetical. If a meeting preset reveals it, say that the story stipulates possible acceptance: matching coordinates does not produce that acceptance. Shared practical agreement is sometimes narrower than the original policy dispute, and the abortion/assisted-dying cases must say so.

Recommended concise framing: “Two fictional viewpoints. Three vector influences. Adjust each influence across agency, harm, and shared responsibility. The numbers are authored illustrations; meeting here does not establish agreement on what to do.” Never label the meeting correct, resolved, morally aligned, or proof of consensus.

## Export and evidence contract

A standalone JSON export contains integer epoch-millisecond `ts_ms`, model/schema version, axis meanings and ranges, signed-reference semantics, all scale vectors and formulas, complete case prompt/viewpoints/starting recommendations, all nine named cues, shared practical option and its scope, case notes, all starts and current controls, personal and global displacements, final coordinates, raw coordinate difference/gap, and authored witness. Export actual current fields; do not reference obsolete arrays that disappear during JSON serialization.

The independent role of the shared option, invented coefficients, and equal-translation limitation travel with the export. The file is a user-controlled download, with no inferred traits, tracking, accounts, or server submission. Controls are dimensionless; they are never timestamps or time steps.

Convergence in this self-contained construction cannot be empirical proof of intersubjectivity, antirealism, or the redundancy of objective moral facts. Different philosophical accounts could accept the same invented geometry. Matching three weights neither establishes identical reasons nor determines actions. These claims are limits of the construction, not a declaration that one metaethical account wins.

The fictional examples need no fabricated citations. Real factual claims about medicine, law, climate policy, punishment, surveillance effectiveness, or psychological effects would need appropriate primary sources before inclusion. Present none of the assumed numerical shifts as empirical effects.

## Revised acceptance criteria

1. Exactly five cases and two viewpoint starts each; three vector groups, exactly nine independently adjustable bounded scalar components.
2. Changing any component of a affects only that axis of A; changing b affects only that axis of B. Changing a g component moves the corresponding axis of both by exactly the same amount. Other components stay fixed.
3. Zero vectors preserve starts. Every nine-value witness reproduces the declared meeting. All six octants remain represented by nonzero starts.
4. Every vertex of the nine-control cube stays within fixed ±150 bounds (512 vertices per case, 2,560 total); all arbitrary interior values stay bounded because the model is affine. No clipping.
5. Global-only changes preserve the entire A−B vector and distance across multiple values and cases, including nonzero personal settings. It cannot be described as attraction.
6. Witness-plus-personal perturbation separates endpoints. Privacy's stated divergence increases squared separation from 6850 to 12850.
7. Raw numerical difference controls the coincidence claim. A near-witness with a small nonzero residual is never rounded into a meeting. Display rounding does not claim exactness.
8. Four resultant arrows have correct origins/endpoints and represent full 3D vectors. Global arrows are equal. Projection changes do not affect model values. Omitted axes are honestly identified.
9. Starting recommendations do not change automatically. Every case has a distinct authored shared practical option with accurate limits and no coordinate-to-policy inference.
10. Export JSON includes complete current narratives, nine cue labels, signed scales, formulas, and assumptions, in addition to numeric state; timestamp is integer epoch ms.
11. Tests validate behavior and meaningful counterexamples, not hardcoded build versions or just element counts. Real desktop/mobile browser checks cover nine-slider readability, keyboard use, case reset, witness application, projections, truthful near-zero display, and downloads.
12. Work stays in the new `_application_v2/` sibling. Preserve original partner files and keep source briefs, historical output, nested Git metadata, private records, and original Python runtime out of public packaging. Main task owns byte-preservation and deployment checks.

## Bounded implementation review status

The earlier assembly review independently verified the original three-scalar numeric table, its witnesses, and boundary settings. That verification does **not** validate this revised nine-control implementation. It identified rounded-gap false coincidence, incomplete narrative exports, and transitional app/schema/test mismatches; these remain items to verify in the completed rewrite rather than claims about final behavior.

This document provides the revised contract. A final bounded read and targeted execution of the completed new model, cases, chart, app, and tests is still required. No original snapshot, Git state, register, running process, or deployment was changed by this design revision.

Independent calculation of the revised design verified all five nine-value witnesses, all 2,560 vertices of the nine-control domain inside ±150, and the privacy divergence calculation 6850 → 12850 squared illustration units. These checks validate the declared arithmetic contract, not the still-in-progress implementation.

### Completed nine-control implementation check

The completed `model.mjs`, `cases.mjs`, `app.mjs`, `chart.mjs`, `index.html`, and both model/UI test files were subsequently reviewed against this revised design. This supersedes the assembly-only limitations above for those sources. All **19 model and simulated-DOM UI tests passed** in the reviewer's own execution. Independent assertions additionally checked the five exact meeting coordinates against the design table and confirmed that all 45 contextual cues survive JSON serialization.

Verified: nine signed independent components grouped as three vectors; personal-component isolation; identical full-vector global translation preserving separation; all 2,560 domain vertices within fixed ±150 axes; no clipping; explicit constructed witnesses; divergence and meeting perturbation; unchanged starting recommendations; authored shared practical options with their limited scope; 45 context-specific cues; four full-vector resultant arrows with correct addition origins/endpoints; truthful omitted-depth labels and complete three-axis coordinate table; case reset and presets; epoch-ms exports carrying current narratives, control values, scales, formulas, signed-reference assumptions, witness, endpoints, arrows, and shared-option scope. The five cases make no newly introduced empirical claims.

Earlier defects are resolved: the app uses the final case schema, exports the actual influence/shared-option fields, and applies the `1e-9` coincidence cutoff to the **raw** gap. A tiny positive residual above this tolerance remains visibly nonzero. The asynchronous UI-test fixture now awaits its file read. These tests exercise a simulated DOM; they are not real browser, screen-reader, or mobile usability evidence.

Two small presentation corrections were reported and then independently verified in the owning sources: the default projection's visible label and button now read **“Oblique 3D”**, accurately describing its unequal projected axis lengths while retaining the internal `iso` key; the no-script copy now says **“three vector influences.”** Neither changes the model.

**Final bounded assessment: accepted against this illustrative nine-control design, with no remaining source/design defect identified in the reviewed scope.** This is not philosophical or empirical validation. The main task owns real browser checks, accessibility and mobile assessment, source-snapshot preservation, packaging, and deployment; this review makes no independent claim about those operational results.

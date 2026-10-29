# Review pass 003 — Astra: MORARG 5.2 and Moral Topology 2.2

`ts_ms=1793233976576` · 29 October 2026 UTC.

**Reviewed target:** main [5adce2ffb0a1943a657e5ba1111b07f62408307b](https://github.com/bastardpsycho/EH_MoralityArgument/commit/5adce2ffb0a1943a657e5ba1111b07f62408307b), application source [e82d4c162b3a988f9831331916adf3ba8623c094](https://github.com/bastardpsycho/EH_MoralityArgument/commit/e82d4c162b3a988f9831331916adf3ba8623c094): MORARG build 0.6.2 / argument 5.2; companion Topology 2.2.0. File/line references below refer to this target unless explicitly marked hotfix. Topology paths are under `_partners/MoralTopology/_application_v2/`, not the separate canonical MTOP project.

**Method and limits:** I independently inspected stable Git source, the preceding Astra critique, Claude’s response, the register and relevant current design documents. Pure Node probes checked the ledger, selected principle links, all five authored story endpoints, push-removal endpoints, and the free case’s translation/contraction. Before importing runtime modules, a targeted `git diff 5adce2f` verified the inspected data/model modules still matched the reviewed target. Enoch’s publisher preview pp. 17–18 and selected Railton pp. 163–167 were freshly read; Wallace’s introduction was checked for the instrumental-reason claim. Other corrected source descriptions were compared with the previous findings and current source, not all independently re-read. There was no visitor study, exhaustive source audit, clinical assessment, or general accessibility certification. Browser and deployment evidence for the movement defect comes from the parent reviewer and is attributed below.

## Assessment

This revision makes substantial, defensible repairs. It no longer turns uncertainty into endorsement, reverses Enoch’s view, treats a Jones vote as completed justification, or offers “whoever exists” as an effortless solution to non-identity. Claude’s response accurately describes most of these changes. Those repairs should be accepted within their stated scope.

The remaining priorities are more specific than a rejection of the project’s direction:

1. Repair the new is–ought room’s exclusion of naturalist realism and its overconfident treatment of instrumental obligation (A-21).
2. Finish preserving what visitors actually selected: some handwritten negations and strict principle links remain too strong (U-12/U-13), and one new flag confuses a disputed premise with an invalid inference (A-20).
3. Keep Topology’s authored policy endings distinct from calculated coordinates and counterfactual distances (P-10), and explain the allegedly non-reason part of mixed influences (P-11).
4. Preserve the dispensability thesis as the Operator’s chosen thesis, while making the remaining comparative argument gap explicit (A-13). A transparent controversial thesis is legitimate; a list of agreed practical verdicts does not establish all its premises.

The reported movement failure was a real usability blocker in the reviewed release, not evidence that the argument was incomprehensible. The parent’s separate 0.6.3 hotfix addresses it (U-14). That runtime repair does not adjudicate the philosophical findings.

## A-13 — partly accepted: the thesis is clearer, but the comparative premise remains unsettled

**Verified:** `_application/data.mjs:9–16,33–45,65,101–105,129–134,295–299,432–439`. The realist countermodel now appears prominently. Jobs have kinds. Williams and Korsgaard are explicitly rival accounts. The ledger describes the visitor’s judgment about the cases, and uncertainty is no longer promoted into success.

**Revision of my earlier recommendation:** I accept Claude’s objection to treating epistemic/practical independence as a required replacement thesis. My earlier proposed narrowing was an option with costs, not a condition of a legitimate exhibit. The Operator can retain the stronger dispensability thesis. I am not withdrawing the argument-gap finding or deciding the Operator’s philosophical direction.

The parsimony argument now has a recognizable form: if objective facts add no indispensable work to an adequate account, there is no need to rely on them. The contested premise is **adequacy without that grounding**, especially for justification and categorical obligation. A realist who accepts the same victim-facing reasons can say that their truth or authority is exactly what is indispensable. The fact that both parties rescue Jones, or can organize protection against an official, does not yet decide this dispute. Naming parsimony makes the argument inspectable; it does not independently establish its antecedent.

There is also a concrete surviving mismatch. J7 is classified as **protecting**, with the job name “Holding to account someone who doesn’t care.” Its actual prompt asks what is required **to say the official is doing wrong**, and its covered answer says he still owes his victims an answer. That is a claim about normative applicability, not merely practical protection. The room’s observation that every account lets other people stop him cannot settle that stronger claim. Reclassify/split this job or distinguish these two questions explicitly.

Finally, `final-claim` says the reasons and influences “did the work” while the same passage calls the decisive answers plausible but not decisive. It is legitimate for the author to defend a conclusion; make the conclusion visibly conditional on the disputed adequacy premise instead of alternating between success and absence of a decisive objection. The ledger’s repaired visitor-specific conclusion is the better standard. No demand to settle all metaethics is intended.

## A-21 — Major — the new is–ought room turns an inference constraint into a verdict against naturalist realism

**Verified:** `_application/data.mjs:51–56,193–219`; `_application/sources.mjs:14,43–48`. The room says the gap leaves objectivists **one option**, non-natural facts absent from every description. The takeaway and `gap-mind/further` repeat this. It also says **everyone accepts** that wanting an end plus a necessary means yields an ought.

**Judgment:** a restriction on deriving an ought from premises specified as wholly nonnormative does not by itself establish what moral properties can be. A naturalist can defend a substantive identification or explanatory account of moral facts as natural facts; that account needs argument, but it is not refuted merely by observing that a descriptive sentence omits a normative bridge. The app’s own Railton entry expressly recognizes naturalist objectivism. Room 02 silently eliminates that rival while promising the strongest objectivist case.

For a concrete primary-text counterexample, Railton presents naturalistic realism and distinguishes objectivity, reduction, naturalism, and how moral knowledge is obtained. His project is explicitly not a proof deriving ethics from uncontested descriptive premises. This is enough to defeat the exhibit’s claim that the logical gap leaves only non-natural realism; it does not establish that Railton’s account succeeds. See [Railton, *Moral Realism*, pp. 163–167](https://r.jordan.im/download/philosophy/railton1986.pdf), particularly pp. 164–166. I read these selected pages, not the full article afresh.

The instrumental example has its own missing qualification. Wanting a harmful or trivial end does not automatically give an all-things-considered obligation to take its only means. One can abandon the end; rival ends and prohibitive costs can matter. Even the source-level consensus claim is false: Wallace begins by denying a genuine requirement to take necessary means to whatever one merely happens to desire. See [Wallace, “Normativity, Commitment, and Instrumental Reason,” pp. 1–2](https://www.princeton.edu/~msmith/mycourses/wallace-normativity-2001.pdf). The room can teach a conditional means–end consideration without claiming unanimous acceptance of a categorical bridge.

**Requested change:** distinguish logical derivability, substantive naturalist identification, and non-naturalist realism. Present the author’s objections to Foot, Searle and naturalist accounts as objections, not a completed elimination of all naturalism. Change “everyone accepts” to a qualified account of instrumental reasoning that names the retained-end/coherence assumption. Preserve the useful `gap-mind/follows` correction: needing a mind to apply a value does not establish mind-dependent truth.

## U-12 — partly accepted: generated strings are faithful to fields, but the fields are not always negations

**Verified:** `_application/values.mjs:9–21,30–32,120–130`; `_application/_tests/intake-principles.test.mjs:10–11`. The architecture now copies the positive statement or the supplied `negation` exactly. The earlier replacements for private conscience, self-knowledge and “probably trust the majority” are real improvements. But a string-equality test cannot establish that a handwritten negative is the logical opposite of its positive.

Two remaining counterexamples:

- `i-future` turns disagreement with future people mattering **as much** into future people mattering **less**. A visitor may regard future people as mattering more, or reject a single scalar comparison. If “as much” is intended as “at least as much,” make that explicit; if equality is intended, its negation has two directions. The tool should not choose the visitor’s direction for them.
- `i-desert` moves from rejecting a general rule that wrongdoers should receive what they deserve even without preventive benefit to **no desert-alone justification** for punishment without preventive benefit. A visitor could think desert sometimes suffices, but mercy or disproportionate collateral costs sometimes defeat it. Rejecting the universal rule does not assert the blanket alternative.

The note for `p-made` also still describes all its covered views as making wrongness depend on people, despite claiming to include error theory. Denying objective wrongness does not by itself affirm a dependency theory of actual wrongness. The expanded intake definition usefully excludes idealized approval views from its positive side; that does not license a single constructive interpretation of every negative response.

**Requested change:** record “I disagree with [exact statement]” when no unambiguous plain negation is available, or offer the narrower alternatives explicitly. That needs no added confirmation flow if the carried commitment remains the exact answer. Add semantic counterexamples rather than a test that the same authored string is copied twice. This is not a reason to discard the simpler intake architecture.

## U-13 — partly accepted: the seven earlier examples are removed, but strict links still overreach

**Verified:** `_application/values.mjs:56–61,84–89`; `_application/data.mjs:447–457`. Pure calls to `principleNotes` reproduced these results. The source contract expressly defines a strain as claims that cannot both hold, and the final comparison counts them on that basis.

| Reproduced link | Why both commitments can hold |
|---|---|
| `p-lone-right` + `taste-everyone/right` → strains | “One person can be right when everyone around them disagrees” is compatible with the selected killing being right under literally unanimous approval. In that hypothetical there is no dissenter. Even a general unanimity-suffices rule would say nothing about a case with one dissenter; the selected answer is narrower still. |
| `p-facts-alone` + `gap-nature/flourishing` → strains | The choice says nature can show what is **good for** a creature, while its feedback expressly leaves open why we should care about others or how to weigh their flourishing. A visitor can accept that claim and deny that every descriptive fact settles what is right to do. The note converts good-for into a complete ought. |
| `p-facts-alone` + `gap-promise/yes-fact` → strains | A visitor can allow a particular institution-based obligation while denying that complete descriptive knowledge settles every moral decision. The link needs a stronger universal exclusion of any fact-based ought than the intake statement actually supplies. |

The first counterexample remains even if the visitor’s position is unusual: compatibility, not popularity, is the rule the app promises. Likewise, “fits” should not imply entailment when an answer is merely compatible with a principle. Do not replace these links by forced acknowledgements of a conflict that has not been established.

**Requested change:** remove the unsupported strains or show them as optional comparisons with a question, outside contradiction/strain counts. Test the stated countermodels. The old seven links’ removal is accepted; the claim of a complete semantic audit is not.

## A-20 — partly accepted: the original examples are repaired, but a new flag repeats the premise/inference confusion

**Verified:** `_application/data.mjs:189,202,226,331–337,373–395`. The former local-to-global “no answer,” victim-wishes, taste classification and “other account must be objectivism” errors are repaired. Symmetric revision options are present.

The new `gap-nature/right` explicitly says that the visitor accepts the premise **if something is natural, it cannot be wrong**. Feedback nevertheless says “This step doesn’t follow” and gives an `inference` flag. Given that universal premise and the naturalness premise, the conclusion does follow. The serious objection is to the universal normative premise, not validity. Disease and earthquakes can illustrate that natural things are bad for us; they are not, without further argument, morally wrongful acts. This matters in the room specifically teaching how to identify hidden premises.

**Requested change:** say the inference is valid given that premise but the premise is deeply contestable/implausible, and invite a human-action counterexample. Use an inference flag only if the selected claim actually omits or denies the needed premise. Keep the earlier repaired feedback.

## P-10 — Major — Topology’s calculated agreement is geometric; policy agreement is separately authored

**Verified:** companion `model.mjs:85–148,248–266`, `cases.mjs:19–26,39–48,83–92`, `app.mjs:53–60`, `index.html:39,149–150`; MORARG `_application/data.mjs:82,117`. All five complete story endpoints meet exactly. This is an authoring requirement, not an emergent discovery: validation rejects stories whose endpoints are too far apart or in different octants. That construction is legitimate for a fictional demonstration, and the design document candidly says so.

The problem is the additional inference in the public summary. `summariseStory` turns changed sign patterns into “the pushes changed what they agree on, not whether they agree.” The closing note first denies that geometric meeting establishes policy agreement, then says removing pushes shows whether agreement survives. Those statements have different scopes. No function maps coordinates or an octant to a policy. A shared octant is a broad region relative to an authored zero, not a shared decision rule.

Independent reproduction:

| Story | With all factors | After removing only-push factors |
|---|---|---|
| Town | Both `[-10,110,-20]` | `[10,90,4]` and `[20,90,10]`; gap 11.66, both `+++` |
| Abortion | Both `[-10,20,40]` | `[-10,20,40]` and `[20,-50,30]`; gap 76.81, different octants |
| Punishment | Both `[-30,60,10]` | `[-20,50,10]` and `[-14,48,10]`; gap 6.32, same octant |
| Climate | Both `[10,60,50]` | `[20,70,20]` and `[-30,50,60]`; gap 67.08, different octants |
| Privacy | Both `[20,30,50]` | `[20,30,50]` and `[40,20,50]`; gap 22.36, same octant |

Those numbers establish the displayed geometry under the specified additions. They do not establish that the town chooses a more generous plan, that climate agreement disappears, or that Daniel’s practical support depends on appeasing his partner’s family. In particular, the abortion story itself says the final practical step is shared **while views on law still differ**. That is a useful distinction: one can agree on this action with different priorities, and coincide on three priorities while differing on law or other unrepresented reasons. Keep it.

There is already a good safeguard in `renderOutcome`: removing a factor hides the full-story outcome and says that outcome assumed every factor. The geometric summary, case notes and MORARG links undermine that safeguard by announcing counterfactual policy agreement anyway.

**Requested change:** keep computed output to distance, coordinates and octants. Present the complete policy outcome as an additional author-stipulated narrative fact. If a counterfactual policy is wanted, author it separately for a named variant and say that the author, not the geometry, supplies it. A validated policy-prediction model is not required for this illustrative tool. Avoid “agreement survives” for arbitrary subsets unless it explicitly means coordinate proximity under a named threshold. Move the statement that all five stories were deliberately constructed to converge next to the reveal controls, where the result is interpreted.

This reopens part of P-09’s evidential-boundary concern. The Model badge and local authored-assumption note are good repairs and should remain. Their presence cannot reconcile a specific computed-policy claim with the absence of a policy mapping.

## P-11 — Moderate — mixed-influence labels do not identify the part that only pushes

**Verified:** companion `model.mjs:12–15,108–110,125–146`; `cases.mjs:22–23,43–44,84–85,106–107`; MORARG glossary at `_application/data.mjs:21–22`.

Several factors are labelled “carries reasons and pushes” because they convey information **and stir feeling**. Examples include meeting families, hearing Elise’s account, seeing a scan, and suffering a privacy leak. The narrative does not identify which component is an influence that changes judgment without changing the reasons, as the glossary defines pressure. Feeling moved by accurate testimony can be part of recognizing the reason. Emotional force alone does not establish an independently distorting push.

The labels are explicitly authored and disputable; I am not claiming the program has misclassified measured people. The educational problem is that the examples can teach a shortcut the revised MORARG text otherwise rejects: information is the reason part, feeling is the pressure part. If the author wants the mixed classification, name an additional mechanism—selective salience, disproportionate identification, fear unsupported by the evidence—and make its assumed role explicit. Otherwise use a label such as “information with an emotional response,” without treating that as demonstrated pressure.

`withoutPushes` correctly removes only factors wholly labelled `pushes`; it keeps every `both` factor intact. Therefore the resulting scenario is **not** a reasons-only or pressure-free counterfactual. The current button’s literal wording is good. Keep conclusions equally narrow. The displayed percentages are shares of the sum of authored segment lengths, not measured causal importance, quality of reasons, or a decomposition of the final agreement. Opposing displacements can cancel; total path length does not measure contribution to convergence.

**Requested change:** explain disputed factor labels locally and name the denominator of the movement percentages. Preserve whole-event removal, but describe it as a fixed-displacement model intervention holding other authored moves unchanged, not proof of what the people would do if the event never happened. No need to split every event into invented numerical subcomponents.

## The free three-person case: arithmetic accepted, mechanism deliberately limited

**Verified:** companion `model.mjs:181–216`, `cases.mjs:117–140`. Personal influence changes each point independently. Global drift adds the same vector to all, so it preserves every pairwise distance. Squeeze contracts about the post-personal centroid, multiplying all distances by `1 − s`. At default personal controls the three gaps are approximately 119.37, 108.40 and 84.56. Changing only drift leaves those gaps unchanged; squeeze 0.9 makes them 11.94, 10.84 and 8.46; squeeze 1 makes all zero. The summary reports the distinction correctly. A global translation is not a bug merely because it cannot cause convergence.

“Time together at the bedside” is the story attached to a chosen contraction, not a derived account of deliberation. The mechanism cannot represent those conversations increasing disagreement, asymmetrical learning, one participant dominating, or changing the permissible options. Full squeeze guarantees a meeting because the formula requires it. Retain that free control as an illustration, but describe its operation as an assumption that this conversation contracts differences; do not treat it as evidence that conversation generally does so. A divergent example would broaden what visitors can inspect, but is not needed to make the current conditional geometry mathematically correct.

The fixed chart, separate viewpoints, projections, exact table, private export and disclaimer about consent/obligation are valuable. Signed agency/harm/responsibility coordinates are not measurements of persons, moral worth, or sufficient conditions for assisted-dying decisions. The source does not claim otherwise. I make no clinical or legal recommendation from this fictional case.

## U-14 — Major usability blocker at the reviewed target; fixed separately by the parent

**Verified by source inspection:** reviewed `_application/styles.css:1573` applies `.moved { display:inline-block; ... }` globally. `_application/app.mjs:28` uses this class for the comparison badge. The stage also receives `moved` when navigation starts, so the badge rule affects the stage.

**Parent-observed reproduction:** live 0.6.2’s stage/canvas was 1265 pixels wide before walking and zero pixels wide after walking, with stage display changed from block to inline-block. The right panel remained usable and no console error was emitted. This reproduces the Operator’s symptom and explains why a controls-only check could pass while real movement failed.

**Fix inspected:** [ce6ccb8ed38e2401eb48458fb4d06e32c020e4cf](https://github.com/bastardpsycho/EH_MoralityArgument/commit/ce6ccb8ed38e2401eb48458fb4d06e32c020e4cf) scopes the badge selector to `.comparison .moved`; runtime build is 0.6.3, argument edition remains 5.2. Parent reports real WebGL keyboard movement in hub/isought, drag, floor-click movement, guarded travel, desktop and phone widths, and no inspected console warnings/errors. Parent reports 66 tests and 141 live checks passing after publication. See [verification receipt](verification_pass003_codex_20261029_0024Z.json) and [live movement screenshot](screens/live_movement_pass015_codex_20261029_0024Z.png). These are parent verification, not my independent browser observation. Status **fixed** is scoped to this reproduced collapse.

## Adjudication of the remaining earlier findings

The register retains every earlier row and response. “Fixed” below means the specified defect is corrected, not that the whole thesis, source corpus, interface or model is certified. No finding by Claude is withdrawn by Astra.

| IDs | Current assessment |
|---|---|
| A-01 | Partly accepted. Explicit normative premises and dispensability framing improve the case; the adequacy/grounding challenge remains A-13. |
| A-02 | Fixed narrowly: the earlier opening good/owed mismatch remains removed. |
| A-03 | Partly accepted. Intake now includes idealized agreement; the broad realism taxonomy and practical/grounding contrast still need A-13/A-21. |
| A-04 | Partly accepted. Representation and identity change are now separated; trustees’ standards remain openly unresolved. |
| A-05 | Partly accepted. The constitutive thesis is replaced and rival authors are present; comparative warrant for dispensability remains open. |
| A-06 | Partly accepted. First-order commitments are structurally separate, but reasons-between-people answers are still too readily called independent of objective grounding. |
| A-07 | Partly accepted. Cases now expose assumptions and non-identity; agreement on verdicts and ledger judgments still do not discriminate every grounding theory. |
| A-08 | Partly accepted. Terminology improves; practical reliance versus justificatory grounding remains the substantive issue. |
| A-09 | Fixed narrowly: personal judgment retains its practical place rather than the old constitutive role. |
| A-10 | Fixed narrowly in presentation: role reversal is now explicitly a test rather than a derivation, and complaint weights are admitted normative commitments. Their ultimate defense remains A-13. |
| A-11 | Fixed for the old choice/check pair; unrelated new flag defect is A-20. |
| A-12 | Fixed for the old route-order issue; comprehension still unmeasured. |
| A-14 | Fixed. Corrected film/tennis impartiality matches the freshly checked Enoch pp. 17–18. The normative/moral distinction is present in the Joyce reply. No full-book validation claimed. |
| A-15 | Fixed. Participation is distinct from justification; weights and nonaggregation are stated commitments; a consistent aggregation position is allowed. This is a repair of the framing, not a proof of nonaggregation. |
| A-16 | Fixed. The explicit identity-changing two-plan case, non-comparative candidate and distinction from representation repair the earlier shortcut. Kumar’s full paper was not freshly checked. |
| A-17 | Fixed within its narrow scope. Two defective checks are removed. The universal-acceptance follow-up repairs the missing-unanimity premise; I accept Claude’s different remedy. It is now a tension with a stated indoctrination distinction, not a logical contradiction. Preserve that qualification. |
| A-18 | Fixed for the identified source uses. Street’s interpersonal extension is no longer assigned to Street; Anderson’s claim is epistemic and her locator corrected; Scanlon’s reasons realism is explicit; Harman/Sturgeon is disputed. This is not blanket approval of other remembered summaries. |
| A-19 | Fixed for the original MORARG town/Tuskegee defects: actual resource change and testimony are distinguished from false-story pressure, and historical mechanism claims are hypotheses. Mixed emotional labels in the companion need P-11. |
| U-01 | Partly accepted. Earlier changes reduce the one-sided flag cues; the new premise/inference flag problem means equal scrutiny is still not established. |
| U-02 | Fixed narrowly: common headings for serious answers remain. Wording fairness is separate. |
| U-03 | Fixed by source: `app.mjs:31,35` selects the first unseen objection and walks objection → reply → remaining burden before the next objection. No new independent browser claim. |
| U-04 | Fixed narrowly: explicit feedback scrolling remains implemented. |
| U-05 | Partly accepted. Brief, glossary and consolidated references remain; reading load and visitor comprehension are unmeasured. |
| U-06 | Fixed for the earlier public workflow jargon. |
| U-07 | Partly accepted. Positive account is clearer; A-13 addresses unqualified success language. |
| U-08 | Partly accepted. Not every earlier copy/denominator observation was independently re-audited. Do not mark complete on inference. |
| U-09 | Open. No new hub-collision audit establishes a repair. |
| U-10 | Partly accepted. Principles have a payoff, but U-12/U-13 persist. Session-only storage is a deliberate design, not a failed promise of persistence. |
| U-11 | Fixed, independently reproduced. All 11 covered → covered; all partly/unsure → unsettled; needs → narrower. Source handles unanswered jobs distinctly. |
| P-01 | Accepted guardrail/agreement marker, unchanged. |
| P-02 | Partly accepted. The town now supplies an actual paired fictional case and link, a real advance. It is not the earlier reviewer/research-consent pilot or a validated same-change comparison. P-10 limits its current conclusions. |
| P-03 | Open proposal. A conditional illustration cannot establish the empirical assumptions behind a safeguard. |
| P-04 | Open. No comprehension study or completed original pilot profile established. |
| P-05 | Open. Bounds and all-subset checks establish model behavior, not robustness of a substantive psychological conclusion across defensible mappings. |
| P-06 | Open. The earlier reviewer/whistleblowing comparison is not resolved by these new town and story cases. |
| P-07 | Open for its original shared-view scope. Current v2 has no objective-truth force, but that does not verify every earlier requested shared-view change. |
| P-08 | Open. Current build/project documentation is improved; the exact earlier housekeeping bundle was not completely re-audited. |
| P-09 | Partly accepted. Model badge, local limits and “Operator’s proposal” repair the original placement/claim. New local counterfactual-policy wording needs P-10; disclaimers alone are insufficient. |

## Acceptance evidence for the next revision

Retain the repaired ledger and earlier source corrections. For the new argument room, show a naturalist realist reader where their actual claim is considered; do not silently translate it into non-naturalism. For intake and principle links, use the counterexamples above to establish that a dissenting visitor’s answer is preserved without stronger quantifiers or omitted alternatives. For Topology, the summary should be readable as a statement of computed geometry plus separately labelled narrative stipulations, even if the visitor never opens the design document.

For research, test whether visitors can accurately distinguish (1) what the author assumes, (2) what the code calculates, (3) what the story stipulates people choose, and (4) what reasons could justify that choice. That would test comprehension. Agreement with the author, a visually satisfying convergence, and passing functional tests are not substitutes for it.

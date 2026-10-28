# Shared cases for MORARG and Moral Topology

Status: proposed design, pass007. The Operator requested a concrete plan; implementation and deployment are not part of this pass. Current inspected source builds are MORARG 0.5.0 / argument edition 4 and MTOP 1.2.2. Draft example artifacts beside this plan are design fixtures, not runtime inputs or calibrated models.

## 1. Product decision

Build two independently usable applications around a small shared case catalogue. Give each case two invitations:

- **Examine the reasons — MORARG:** What may be demanded, by whom, of whom, and on what justification?
- **Explore the pressures — Moral Topology:** What follows from this model of how a particular judgment might form?

Add a return step: **Reconsider the case:** What changed in the facts, assumptions or reasons, and what remains unresolved?

MORARG continues to defend its constitutive account openly and preserve serious rivals. MTOP does not become evidence for that thesis. Neither app requires a visit to the other, a shared account, an application database or a background connection. A visitor may begin in either, skip the companion, retain their view or decline to answer.

Keep MORARG's 12-room journey and reading/controls-only alternatives. Add a shared-case panel linked from the appropriate room and accessible directly from a case index. It has its own responses and progress, not additional compulsory questions in the existing journey. Keep MTOP's full vector-field explorer as its ordinary opening. An explicit shared-case link selects its guided comparison workspace; it does not change the independent default or overwrite the full-model workspace.

## 2. First release: one fully fictional case

**Case ID:** `research-consent-pressure`. **Title:** Research consent: pressure on the reviewer. **Draft revision:** `draft-1`.

**Decision:** An independent reviewer must decide whether a research protocol can be offered as written, needs redesign, or should be deferred or refused.

**Affected parties:** prospective adult participants, the reviewer, the research team, other contributors and potential future beneficiaries. Their roles must remain distinct. **MTOP's modeled actor is the fictional reviewer**, not the participant, the visitor, or a whole institution. In the baseline, the only stated institutional pressure is the director's request to that reviewer; the case does not stipulate participant coercion.

**Baseline stipulated facts:**

- Participation entails a disclosed, meaningful privacy risk through identifiable records; no numerical risk estimate is claimed.
- Prospective participants understand the disclosed terms, can ask questions and can decline. Ordinary care and existing entitlements are unaffected by refusal.
- Potential research benefit is uncertain; a less identifiable design is feasible but less informative. Delaying for redesign also has costs.
- A senior institutional director asks the reviewer to approve promptly. No explicit threat or reward is stipulated. The reviewer may recommend approval with safeguards, redesign, or defer/refuse.
- These are invented teaching facts, not a reconstruction of Tuskegee, Milgram or an observed participant. No law or medical recommendation is asserted by the exercise.

**MORARG prompts:** Whose claims need an answer? Which facts are uncertain? Is comprehension enough for meaningful consent? What makes the burden permissible, if anything? Which alternative do you favor, and what is the strongest objection? What would change your judgment? A separate optional grounding prompt lets visitors distinguish interpersonal justification from an independently grounded account; disagreement earns no penalty.

**Choices:** offer with explicitly defended safeguards; require redesign; defer/refuse pending a specified condition; withhold judgment and identify the missing fact. These are starting positions, not preassigned correct verdicts. A reason field and objection field accompany the selection. Do not duplicate existing claim-check rules unless their exact conditions actually apply to this new case.

### Three deliberately different comparisons

| Comparison | What changes | What remains fixed | What it can show |
|---|---|---|---|
| A: model sensitivity | The authored numerical encoding of authority pressure: 2 versus 8 on MTOP's 0–10 input | The entire baseline story, actor, probe, other controls, traits, local influences, horizon and paired draws | How two assumptions about the same stated director request change this model's output |
| B: changed circumstance | Declining participants must now wait four additional weeks for the same ordinary care | All other narrative facts, including the director's request and available protocol designs | Whether this added burden changes the visitor's reasons; MTOP has no approved direct mapping for this fact in the pilot |
| C: unchanged-input control | Nothing; the same scenario and model inputs appear in both arms | Everything | Exactly zero paired model difference; a useful operational and comprehension control |

Comparison A is **not** a claim that the director became more coercive in reality. It changes the strength assigned by the model author. Label it “Same facts; different model assumption.” Its current authority mechanism describes a stipulated agentic shift; the draft mapping must say why its fit to an independent reviewer is limited. Neither 2 nor 8 is a measurement or estimated treatment effect.

Comparison B is a separate narrative variant, not a lever movement. Participants retain both enroll and decline options, but the cost of declining changes: ordinary-care access is delayed. Record these participant options separately from the reviewer's protocol choices; this is an access-cost change, not the disappearance of the decline option. Label it “Changed fact; model does not represent this change.” MTOP can display the changed case and missing representation, but must not generate a comparative result by silently reusing baseline controls or claim zero moral importance. A later authored mapping would be a new mapping revision needing its own explanation. This intentional limit makes the model's blind spots visible.

Changing facts can change valid reasons. The interface must not classify all context as mere bias or assume that a visitor's changed verdict is irrational. A must also permit the answer “I reject this model assumption.” No preferred direction or positive endpoint is rewarded.

**Initial authored numerical profile:** included as a separate draft example. It lists all 25 lever values explicitly, a single reviewer probe, zero trait offsets, no placed influences, 40 iterations, dt 0.15, cohort 40 and seed 7. These are reproducible teaching settings, not a neutral or representative person. The fixed-reference attractor is absent. No numerical output or behavioral prediction has been generated in this design pass.

## 3. Visitor journey and screen copy

1. **Read the common case card.** Show title, “Fictional teaching case,” named actor, affected parties, known/unknown facts and available choices. A small always-visible label identifies the selected variant. Case revision belongs in details, not the primary flow.
2. **Make a provisional judgment in MORARG.** Record choice, reason, strongest objection and what could change it. Allow skip. Show “These are your reasons, not inputs to a psychological profile.”
3. **Open the companion optionally.** “Explore this case in Moral Topology” opens a separate tab using only public catalogue IDs. The current MORARG tab retains its in-memory notes. If MTOP is unavailable, show the complete exercise explanation and an explicit case-file download; do not pretend a simulation ran. Reload still loses unsaved MORARG state, so retain its existing private-download affordance.
4. **Inspect assumptions before Run.** MTOP presents “Modeled actor: fictional reviewer,” paired inputs, changed factor, invariants and mapping limitations. The three comparisons above are separately named. Free slider edits move the user into “Custom model assumptions” and detach the preset experiment identity; they never edit narrative facts automatically.
5. **Read two kinds of output separately.** First the four axis changes, including the color axis in text, with synthetic cohort variation and starting-force contributions. Then “What these results leave unanswered”: validity of consent, standing, justification, actual behavior and the missing narrative dimensions. Rename y to “Motivational binding” in this shared experience. No correctness badge, moral ranking or implied accuracy percentage.
6. **Reconsider voluntarily.** On returning, MORARG asks “Did a fact change, a model assumption change, or both?”, then “Keep, revise or withhold your judgment?” and “Which reason supports that choice?” It also asks whether the model left out a relevant claim. A baseline result and a prior judgment can be viewed side by side; neither changes the other automatically.
7. **Finish independently.** Each tool provides a useful standalone summary. The visitor may export its own record. Completing one app or agreeing with MORARG is never a prerequisite for exploring the other.

A visitor starting in MTOP sees the same case card and can open “Examine the reasons” without a run. For a visitor who began in MORARG, the return instruction is “Return to your original MORARG tab”; a new link is labeled “Open a fresh MORARG case” and explicitly does not restore prior responses. No opener messaging or hidden state transfer is implied. Direct entry shows sufficient normative context; it does not require traversing all MORARG rooms. Keyboard-only, narrow-screen and no-3D paths expose the same facts, controls and limitations. Charts have a plain four-axis result table, labeled comparison arms and no color-only distinctions.

## 4. Content contract: three different objects

**Shared case dossier** contains case ID/revision, title, fictional/historical status, stable party/fact/alternative IDs, decision, uncertainties, sources with scope, and explicit narrative variants. It contains no numerical moral scale and no visitor responses. MORARG interpretation and MTOP assumptions are separate linked objects. Factual claims, normative premises and illustrative assumptions carry distinct types.

**MTOP mapping** references the exact dossier bytes/revision, actor and allowed variant. It declares model/build compatibility, all control settings, probe/trait/influence assumptions, named comparisons and limitations. Every numerical value is authored rather than inferred from text, values or answers. A narrative feature may be explicitly `unrepresented`; absence of a mapping is not a value of zero. MORARG content likewise references the dossier plus its own prompt/argument revision.

**Visitor/model records** remain app-owned. MORARG stores qualitative judgments and their context. MTOP stores model-run inputs and results. The common case does not become a merged personality or moral score.

At implementation, place reviewed catalogue releases under the SocialTools shared stewardship, proposed `99_shared/moral_cases/`. Each app vendors an identical approved release into its own package and can run with the other app and shared directory unavailable. There is no runtime filesystem dependency on the register or shared folder. The examples in this plan are not that published catalogue. Release tooling must verify the exact dossier bytes in both packages.

Use immutable revision IDs and SHA-256 over the exact UTF-8 distributed bytes; never regenerate those bytes in the browser to check identity. The dossier, mapping and authored prompts each have their own identity/hash. A spelling change publishes a new revision in v1 rather than overwriting known content. Hashes establish content identity, not scientific credibility or trust in an arbitrary imported file. Each app trusts only its bundled allowlist; custom case authoring is out of scope for the pilot.

## 5. Handoff and state contract

Use ordinary links for the public case selection and explicit local JSON files for results. No backend, account, cross-origin synchronization, iframe integration or global session is needed.

**Link fields:** case ID, revision, variant ID and optionally experiment ID. Resolve known IDs locally; never accept arbitrary endpoint URLs from an imported file. Tool addresses are locally configured, not fixed to a presumed live port. No reasons, answer IDs, values, notes, unique session identifiers or timestamps in the URL. Links select known content; they do not run a simulation or replace active responses without displaying the intended case change.

**Case handoff envelope:** `kind=shared-case-selection`, `schema_version=1`, `ts_ms`, source app/build, and case/revision/hash/variant/experiment references. The preview renders the receiving app's allowlisted dossier; transferred prose cannot override it. A case-only download has no private response history. It is a distinct button from MORARG's existing private record download.

**Model result envelope:** `kind=shared-case-model-result`, schema version, export `ts_ms`, source app/build and model revision; case/revision/hash/variant, mapping revision/hash, experiment and run ID; full baseline/changed controls, actor, probe/traits/influences, seed, cohort size, horizon, dt and numeric limits; paired outputs and their interpretation boundary. `run_ts_ms` and export `ts_ms` have different meanings. Iteration counts never become clock time. A complete run fingerprint binds these inputs and output-producing model identity. A timestamp is not identity, authenticity or permission to overwrite another record.

**Pilot import policy:** MORARG imports only a recognized, bounded model-result file into a read-only attachment panel after a preview. It cannot overwrite answers or trigger logical flags. MTOP imports only a known case selection; it does not import MORARG private answers, notes or collected values. Imported results are labeled as file-provided output until independently reproduced, even when structurally valid. A malformed or mismatched file is rejected without changing existing state; a well-formed older supported result may be inspected as historical, never silently relabeled current. Unknown schema/case/mapping revisions receive an unsupported-file explanation. Existing generic MTOP exports remain usable on their own but cannot be attached as a current shared-case run without the new metadata. Existing MORARG exports are never treated as case files.

For v1, define a 2 MiB maximum bridge file, strict bounded arrays (up to existing MTOP limits of 250 steps/300 cohort members), finite numbers, valid ranges, plain text and no embedded HTML, code or fetch URLs. Validate both before any UI-state mutation and before an MTOP server callback consumes a selection. Recomputing a fingerprint checks consistency, not authorship. Descriptions never execute. These are importer requirements, not new restrictions on ordinary use of either application.

**Response context:** MORARG shared-case answers bind to case/revision/variant/actor and prompt revision, in addition to existing branch dependency snapshots. Each explicit context switch increments a local context generation. Returning A→B→A shows old A responses as retained and requiring reconfirmation; it does not silently revive them. A model assumption change alone does not make an otherwise same-case normative answer invalid. It creates an optional reflection, whose context also includes the exact result/run ID. Changing that result makes the dependent reflection need reconfirmation. Original judgments and later reflections remain distinguishable.

**Result context:** MTOP run identity includes the complete selected case, mapping, model build and run settings, not just the visible lever. A changed control marks the prior run historical and disables presenting it as the current result until rerun; returning to a previous setting does not silently resurrect it. Projection/view changes preserve a valid run but may never bypass this identity check. MORARG can retain a baseline result as an explicitly labeled comparison reference when viewing variant B; it cannot present it as a run of B. Duplicate imports by run/content identity do not duplicate history. Importing an older record never overwrites newer local work based on ts_ms ordering.

No full-journey restore/import is required for this pilot. Existing private exports remain readable records, and new shared-case records are additive sections; legacy files do not gain implied current-context status.

## 6. Concrete implementation slices

| Stage | Deliverables and likely owning files | Completion condition |
|---|---|---|
| 1. Freeze the pilot content | Review dossier, separately authored MORARG prompts and MTOP mapping; publish approved immutable catalogue and fixtures | Both apps would show exactly the same facts/variants; actor and every numeric assumption identified; missing representation explicit |
| 2. Independent case views | MORARG new `shared-cases.mjs` and case panel with reading equivalent; update `app.mjs`, `page.mjs`, `scaffold.mjs` allowlist. MTOP new mapping/selection helper, new versioned scenario key and `SUGGESTIONS` entry; update `guided.py` | Each app can explain and complete its own pilot without the other running; existing entry/navigation retained |
| 3. Paired exercise and public links | Known-ID route adapters; MTOP experiment selector and complete run identity; MORARG per-case response context | A is a reproducible paired sensitivity experiment; C yields exactly zero difference; B exposes missing coverage and produces no invented result |
| 4. Explicit result handoff and reflection | Separate bridge validator/export/import adapters; MORARG read-only result panel and bound reflection; expanded MTOP export metadata | Preview/import/reject/duplicate/historical/mismatch paths work; no private reasoning transferred and no automatic answer replacement |
| 5. Validation and small visitor pilot | Feature checks, browser walkthroughs, comprehension observations and revised copy | Technical boundaries pass and visitors can distinguish changed facts, model assumptions, outputs and justifying reasons |

This sequence delivers something usable at stage 2 and avoids making file transfer a prerequisite for testing the core experience. A single unified runtime, live sync, automatic trait inference, calibrated prediction and a combined moral score are outside these slices.

**Existing-code fit:** MTOP `compare_conditions` accepts only keys from global `CASES`; its probe, traits and influences come from that entry. Add a reviewed versioned case mapping and preserve that explicit lookup for v1, rather than mutating the global catalogue from uploads or inventing coefficients with a language model. Full variant-comparison APIs are unnecessary while B is explicitly unrepresented. MTOP's current guided record keys only case/lever/value and has no case importer. MORARG's branch engine snapshots dependent choices but does not bind responses to case revision; use an isolated shared-case state wrapper and do not change the meaning of all existing answers. Neither existing export is an interchangeable bridge format.

## 7. Verification and acceptance

- Run existing MORARG and MTOP suites after application changes. Tests must be feature-named, not tied to a build number. No existing historical examples or source inputs are removed.
- Assert catalogue parity, identity resolution and exact variant deltas. A changes only authority input; C changes nothing; B changes one narrative fact and is unrepresented numerically. Neither chooses coefficients from a visitor's answers.
- Assert paired starts, traits and draws; deterministic replay with the same inputs; all inputs retained in the result. Passing this is an implementation claim, not empirical calibration.
- Exercise stale branch answers, changed narrative contexts, A→B→A reconfirmation, changed run/settings/mapping, viewing projection changes, duplicate import, tampered/oversized/nonfinite/unknown-schema files, and an unrelated case's result. Failed imports are atomic.
- Compare exports and URL fields against their allowed lists. No notes/values/private full-journey material can leak through the case-only path. Inspect actual Dash callback payloads for that boundary.
- Test both starting orders, companion absent, direct entry, keyboard navigation, mobile/no-3D reading, return-to-existing-tab and an intentionally closed/reloaded tab. Do not claim durable save where only an export exists.
- Ask 6–8 new visitors of differing philosophical views to explain: who is modeled; what changed in A; what changed in B; what the graph cannot decide; and why an unchanged graph would not settle a changed claim. Have them keep or revise a judgment with a reason and recover from a mismatched file. Record misunderstandings manually with agreement, not new default telemetry.
- A recurring confusion between motivation and authority, or between illustrative movement and moral improvement, blocks expansion until the wording/flow is revised and checked again. Agreement with MORARG is not success; disagreement is not failure. Small-sample comprehension work is not validation of the psychological model.

## 8. Second and third cases, only after the pilot

| Candidate | Shared question | Possible MTOP experiment | Required normative content |
|---|---|---|---|
| Whistleblowing under workplace pressure | When should someone report a harmful practice? | Independently specified authority or personal-stakes assumption for a fictional employee | Reliability of evidence, confidentiality, retaliation, affected parties and feasible reporting channels; pressure never establishes whether an allegation is true |
| Scarce support and group membership | How should a community allocate limited support? | Shared-fate or ingroup assumption for a fictional allocator, with resource facts fixed | Actual need, justified special responsibilities, exclusions, distribution and appeal; broader scope is not an automatic verdict |

These are new fictional dossiers with explicit actor and counterpart exercise, not relabeled historical examples. Admit a case only when it adds a distinct reasoning issue and has a defensible, limited mapping. Do not port the whole MTOP library or MORARG corpus at once.

## 9. Review, ownership and remaining decisions

MORARG owns argument prompts, source scope, reasons and claim checks. MTOP owns numerical mechanisms, mapping provenance and simulated outputs. Shared catalogue changes require both perspectives to be reviewed; no update changes the counterpart's facts silently. Record each build and test pass under its owning project; maintain independent launch instructions and package versions. Future builds must update project scope documents to permit this explicit companion interface while preserving the exclusion of MTOP as a proof engine. No deployment or external process manipulation is implicit in this design.

The plan chooses the first case, baseline, experiment types, handoff and implementation order. The remaining design review before coding is the exact authored prompt/feedback copy and whether the authority mechanism is a useful illustration for the reviewer. The included numerical settings are reviewable draft assumptions; they are not approved empirical mappings. Before stage-1 release, resolve the model to an immutable artifact hash and preserve cohort jitter/spread/clip and numerical engine settings; a mutable version label alone is insufficient. If that mechanism is judged misleading, replace the mapping or choose the second candidate case—do not hide the mismatch with smoother copy.

## 10. Evidence and pass limits

Design informed by current `project.md`, SocialTools MORARG/MTOP context/state/tasks, MORARG `data.mjs:372`, `journey.mjs:20`, `reasoning.mjs:66`, `app.mjs:12` and local development contract; MTOP `comparison.py:258`, `guided.py:597` and `:747`. A Luna Max read-only review confirmed the absence of importers, global-case constraint and need for case-aware invalidation, then checked the written plan and JSON examples. Its title/actor and participant-option clarifications were incorporated; immutable model identity remains an explicit stage-1 release requirement. This pass created only design artifacts and MORARG coordination records; it did not execute new model runs, modify application code or rerun application tests.

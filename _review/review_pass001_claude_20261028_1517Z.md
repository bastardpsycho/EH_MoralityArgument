# Review pass 001 (Claude): argument, presentation and the Moral Topology pairing

`ts_ms=1793200620000` · Inspected: `main` @ `9e2e350`, build 0.5.1, argument edition `morarg-argument-4`.

## Scope, method and limits

- **Read:** `project.md`, `AGENTS.md`, `README.md`, and every file in `_documentation/` (`ILLUSTRATION_PROMPTS.md` and `VISUAL_ASSET_MANIFEST.json` only skimmed), including the earlier Astra, Luna and Terra reviews and the two shared-case fixtures. Read in full: `_application/data.mjs`, `paths.mjs` and `fairness.mjs`. Read in part: `app.mjs`, `page.mjs` and `presentation.mjs`.
- **Ran:** `npm --prefix _application run build`. The build left no git diff and all 31 feature tests passed. I served the app locally and drove it with headless Chromium at 1440×900 desktop, 390×844 phone and `?view=controls`. I also ran scripted counts over the exported `steps`, `rooms` and `objections`. Each count is stated next to the finding that uses it.
- **Not done:** I had no access to Moral Topology (MTOP). Part C relies only on `assessment_pass006_codex_20261027_2332Z.md`, `SHARED_CASE_PAIRING_PLAN.md` and the two JSON fixtures. I did no live-site check and no visitor study. Where I describe philosophical literature from my own knowledge, rather than from sources quoted in this repository, I say so. I didn't re-check those descriptions against primary texts in this pass.
- **Labels:** "Verified" marks something checked against code, documents or the running app. Everything else is judgement, open to dispute.

Severity: **Critical** means the headline claim isn't supported as worded. **Major** means a structural problem in the argument or the experience. **Moderate** means a significant but local problem. **Minor** means polish.

## Summary

The project is unusually careful. It keeps description, normative argument and metaethics apart, and it is candid about how much of each source it actually read. The earlier reviews moved it toward fairness to rival views, and that work holds up.

The caution has now overtaken the argument, though. The project's own documents concede that the decisive constitutive step has no comparative support over the realist countermodel they describe (A-05). The headline and conclusion still say "We argue that human morality… [is] constituted by…". More seriously, the theory passes its own hardest tests only by bringing in normative constraints that don't depend on the procedure. That is the hybrid position the project presents as a rival (A-01). Astra's review concluded that "no material blocker remained". I disagree: the thesis as worded isn't supported by the argument as worded.

Three further structural problems:

- The opening asks about "good", but the theory is about what is "owed" (A-02).
- The opening taxonomy classifies the project's own view as the realist challenge (A-03).
- The constitutive relation is undefined for affected parties who can't receive a justification (A-04).

On presentation:

- The main button leads to a quiz that bypasses the exhibits carrying the argument (U-03).
- Flags can be predicted from surface wording (U-01).
- The headings shown after a choice favour the author's view (U-02).
- On phones, the reading edition runs to about 165 screens, mostly citation apparatus (U-05).

On the pairing: the pass006 judgement ("related partners with a deliberate bridge") is sound and its guardrails are right. But the pilot case contains no comparison where both tools address the same change (P-02). I propose a principled seam for joining them later: MTOP tests the empirical assumptions behind MORARG's procedural safeguards, never its verdicts (P-03).

---

## Part A: Argument and logic

### A-01 · Critical · The failure conditions and the preferred answer to the hardest test assume moral authority that doesn't come from the procedure

**Verified.**

- `AUTHORITY_ARGUMENT.md:69`: if "a credible wrong survives every stated condition", treat it "as a counterexample to sufficiency or scope".
- `data.mjs` `reciprocity-adequacy`, fourth point: "If a well-supported wrong survives the stated tests, revise their sufficiency or scope."
- `paths.mjs:125–129`: `path-authority-defeater` describes a fully inclusive, uncoerced, fully informed process that permits a severe bodily burden in exchange for many trivial conveniences. The preferred answer, `revise`, is labelled "the exhibit's preferred challenge" and has kind `commitment`. It reads: "The weighting needs a substantive limit; inclusion alone cannot justify this result."
- `AUTHORITY_ARGUMENT.md` §"Underived commitments": equal standing and the weight of interests "are not derived here".

**Why this is the central problem.** For a verdict reached under every stated condition to be overturned by a "credible wrong", that wrongness must be recognisable, and must carry authority, independently of the procedure. Only two readings are available:

- (i) Its authority comes from some further justifiability relation. Then that relation needs specifying, along with why it outranks the first one. That invites a regress, or at least a problem about which relation takes priority.
- (ii) Its authority doesn't come from justifiability at all. Then some interpersonal moral authority doesn't depend on the procedure. That is the Scanlon-style "prior reasons" view, or the "local construction plus realist reasons" hybrid. The project names both as rivals (`realist-reasons`, `path-authority-ground/conditional`).

The weighting case makes this concrete. A limit on aggregation is used to defeat a process that met every condition. On that reading, the limit does the constitutive work and the justification relation merely passes it on.

**Consequence.** The defensible core of the argument is roughly this: the deontic status of interpersonal demands (wrong, owed, may be demanded) is constituted by justifiability, given reasons and weights whose authority is not shown to be constituted. As I understand Scanlon's position (my recollection; the repository's `PRIMARY_REVIEW.md` describes his 2009 lecture the same way), that is close to his view: constructivist about wrongness, non-constructivist about reasons. The documents half-concede this ("the resulting view may be a hybrid", AUTHORITY_ARGUMENT §Underived). But the visitor-facing thesis (`data.mjs:8`), `conclusion-case` and the synthesis option `framework` all still state the unqualified constitutive thesis. Earlier passes filed this under "remaining burden". I think it is a tension inside the argument, and it should change the headline claim, not just the caveats.

**Options for the Operator:**

- (a) Make the hybrid the thesis: "Interpersonal moral demands get their authority from justifiability to those affected; we do not claim that the reasons and weights justification uses are themselves constructed." The realist dispute then narrows to the layer of reasons, which the project can honestly leave open.
- (b) Keep the strong thesis and supply a constructivist account of the weights. Examples are a Street-style account from within the practical standpoint, or a Darwall- or Korsgaard-style derivation from the second-person standpoint. Then say in procedure-internal terms what makes a wrong "credible".
- (c) Restate the failure conditions so they don't presuppose a rival ground. The defeater becomes a better-informed, more inclusive instance of the same relation, not a wrong from outside it. That keeps the theory consistent and still testable at the level of how the procedure is specified.

I recommend (a) for the headline and (c) for the failure table.

**Consistency suggestion.** Hold the author's preferred path to the same standard as the case rules. The pair `objectivity-role/construct` + `path-authority-defeater/revise` should raise a *tradeoff* note, not a flag: "You hold that justification constitutes validity, and that a limit not set by the procedure can defeat a fully inclusive result. Which grounds the limit?"

### A-02 · Major · The opening asks about "good"; the theory is about what is owed

**Verified.**

- Room 00 is titled "Good, Bad and Objective?", with the question "When would a judgment of 'good' be objective?".
- Its Good-and-bad section has three exhibits and three questions.
- `good-senses` (`data.mjs:127–130`) asks what "good" should require us to examine. The thesis-aligned option, `claims`, reads "Ask whether the burdens can be justified to those who bear them", with feedback "This is the proposed moral test."
- `AUTHORITY_ARGUMENT.md:9` limits the account to "what people may demand of one another and what they owe one another. It does not establish that every reason, value or evaluative truth is constructed."

**Problem.** Evaluative terms ("morally good", said of outcomes, character or states of affairs) differ from deontic ones ("wrong", "owed", "may demand"). The authority argument, premises 1–6, is entirely deontic and second-personal. The opening never bridges the two. The `claims` feedback quietly equates "morally good" with "justifiable to those burdened", which contradicts the scope limit in AUTHORITY_ARGUMENT:9. (From memory: Darwall and Scanlon both confine their accounts to the deontic, second-personal part of morality.)

**Scope drift across documents.** Three different scopes appear:

- `data.mjs:8`: "human morality"
- `project.md`: "human moral standards"
- `AUTHORITY_ARGUMENT.md`: "interpersonal moral demand"

**Fix.**

- Frame the opening around "owed / may demand / wrong to someone". Keep the distinctions between good-for-a-purpose and good-for-someone as groundwork: they show why talk of "good" leaves the deontic question open.
- Add one sentence: "Our account concerns what we owe each other. It does not analyse every use of 'morally good' (the goodness of a flourishing life, of compassion, of a landscape)."
- Change the `claims` feedback to "the proposed test of what is owed".
- Use "interpersonal morality (what we owe each other)" consistently everywhere.

### A-03 · Major · The opening taxonomy labels the project's own view as the realist challenge

**Verified.**

- `objectivity-target/truth` (`data.mjs:122`): "Moral truth is not made true by our approval." Its feedback: "This is the central realist challenge."
- `objective-senses` uses "independently of our evaluative approval" as the mark of realism.
- But `objective-proposal` (`data.mjs:32`) says: "Those justificatory relations constitute the standard; actual approval does not."
- And `AUTHORITY_ARGUMENT.md:9` says: "The relevant relation may obtain before anyone recognises it."

**Problem.** The project also holds that moral truth is not made true by (actual) approval. A visitor who agrees with the project should therefore pick `truth`, and they're told they've picked the realist challenge. The real line between this account and realism isn't independence from approval. It is whether moral facts are constituted by what an idealised, reciprocal, informed standpoint would accept (constructivism), or are independent even of any idealised standpoint ratifying them (realism). That is the standard way the distinction is drawn; for example, Shafer-Landau defines realism in terms of independence from any actual or hypothetical perspective (from memory, not re-checked). Without the actual/idealised distinction, the opening can't say why the project isn't realism, and A-01 can't be stated precisely.

A related point: "intersubjective" (`data.mjs:8`) suggests constitution by actual shared attitudes. The account is really about idealised justifiability, which holds independently of every actual attitude.

**Fix.**

- Split `truth` into two options: (i) not made true by anyone's actual approval, a view realists and this project share; and (ii) not made true even by what idealised, informed, reciprocal reasoners would accept, which is realism proper.
- Rewrite `objective-senses` to match.
- Consider "relational" or "justificatory" in place of "intersubjective" in the headline, or define "intersubjective" immediately as idealised justifiability, not actual agreement.

### A-04 · Major · "Justifiable to X" is undefined when X can't receive reasons; proxies close an epistemic gap, not a metaphysical one

**Verified.**

- The thesis says "justified to those affected".
- `reciprocity-outsiders` (`data.mjs:54`) sets out proxy safeguards.
- `path-representation/interests` (`paths.mjs:35`, kind `commitment`): "Affected interests can ground a claim before any ability to answer is present."
- `path-future-claim` asks about the claims of future people.
- `reciprocity-case` (`data.mjs:46`) asks for a "relevant difference" before a comparable claim may be treated differently.

**Problem.** Being "justifiable to X" requires X to be someone who can be addressed with reasons, actually or ideally. Infants, future people, many animals and people with profound cognitive impairments can't be. Proxy safeguards (record known wishes, disclose conflicts, allow independent challenge) improve how well someone estimates X's interests. They don't make a demand justifiable *to X*.

If X's claim is grounded in X's interests, as the `commitment`-labelled option says, then for these beings authority comes from interests, not from an answerability relation with X. That is a trustee model grounded in value, and it is where constitutive and interest-based realist views come apart most visibly.

Separately, the standing criterion the account appears to favour is "affected interests". Its own relevant-difference test then asks what difference excludes sentient animals from "human interpersonal" morality. The project currently files this as a "scope challenge", but its own test seems to require an answer.

**Fix.** State explicitly that the constitutive claim covers relations among reason-givers, under idealisation. For affected beings who can't reason, the account adopts a trustee extension. Its authority is either (a) derived from what reasoners could not reasonably reject on their behalf, or (b) grounded directly in interests. Say which, and acknowledge that (b) concedes a ground that isn't constituted by justification. See A-07 for testing this in the ozone room.

### A-05 · Major · No argument favours constitution over the countermodel; the strongest available one (Street) appears only as a target

**Verified.**

- AUTHORITY_ARGUMENT premise 5 (`:21`) says the grounding claim "does not follow from relational vocabulary, usefulness, consensus, a lack of extra predictions, or counting fewer entities". It calls the preference "candidly a defended interpretive commitment, not an established abductive victory".
- `conclusion-case`: "We favour this integrated account…"
- `fairness-bridge` (`fairness.mjs:11`): "An evolutionary explanation neither proves nor disproves moral realism."
- `realism-evolution` (`data.mjs:181`) presents Street only as a challenge, and flags the straw version (`settled`).
- `grep -i korsgaard` over `_application/sources.mjs` and `_documentation/*.md` finds no matches.

**Problem.** Explanatory fit is declared equal and parsimony is disowned. That leaves "legitimate human authorship" as the stated reason for preferring constitution. Preferring a metaethical theory because its truth would be valuable is no evidence that it is true, unless the link is argued for. By the documents' own account, then, the argument gives no comparative support for its decisive step, while the headline says "We argue that…". Either supply an argument that discriminates between the views, or change the headline to "We propose / we prefer".

**Candidates the project already has most of the material for:**

- **Street's Darwinian dilemma** (`street-2006` is cited). On my reading, its conclusion is that evolutionary influence creates a reliability problem for realism that constructivism avoids. That is the asymmetric relevance the fairness room denies. "Neither proves nor disproves" is true of *proof*. But Street's argument is about relative epistemic standing, and it is the strongest published argument on the project's side. Railton's naturalism, already cited, is the strongest reply. Staging that exchange would give visitors a real comparative test.
- **Darwall's "wrong kind of reasons" point**: second-personal reasons can't be derived from third-personal value. This tells against outcome-based realism, but not against relational realism. Say which rivals it defeats.
- **Korsgaard's "normative question"**: the main constructivist argument about why normative claims have authority. Enoch's "shmagency" paper (`enoch-2006`) is cited as the reply to a family of arguments like it. Citing the reply without the argument is lopsided.
- **The epistemic-access argument**: on constitution, moral knowledge is just good practical reasoning, while realism owes an account of how we come to know moral facts. Railton answers this too.

**Fix.** Add a "Why constitution rather than discovery?" exhibit: Street with Railton's reply, and either Korsgaard with Enoch's reply or no shmagency framing at all. If no argument is judged adequate, change the thesis to "We propose" and `conclusion-case` to match.

### A-06 · Moderate · Two layers are bundled together, and the "same verdict" countermodel only matches one of them

**Verified.**

- `realist-pressure` (`data.mjs:43`): the strongest rival "accepts … the same justified outcome".
- `agency-judgment`: "minor convenience normally cannot justify another person's grave injury … No complete metric is supplied here."

**Problem.** The project's distinctive commitments at the level of verdicts (individual complaints, anti-aggregation, a "relevance" view of numbers) belong to first-order ethics and can be separated from the metaethical claim. A constructivist can endorse aggregation, and a realist can be a contractualist. Choosing a realist rival who reaches the same verdicts makes the metaethical dispute inert at the level of cases: by construction, no case can tell the two apart. The rival that cases *could* test is the welfarist realist, who reaches different verdicts in aggregation cases. That is exactly where the project's weighting principle is least developed.

**Fix.** Name both layers in the thesis section and in `ARGUMENT_STRUCTURE.md`, and say which rooms test which layer. The case rooms test the first-order layer, and that's fine if it's said.

### A-07 · Moderate · The case rooms don't tell the views apart, and the ozone room skips the hardest case for contractualism

**Verified.** The three case rooms hold 9 main and 6 conditional decisions. `path-future-claim` mentions identity-changing policies only in one choice's feedback.

**Problem.**

- Every serious theory condemns Tuskegee.
- The Norway study bears on first-order policy and empirical questions.
- Ozone burden-sharing is a first-order question about distribution.

So 3 of the 12 rooms don't bear on the thesis that separates the project from its strongest rival. Showing "the method applied" is legitimate. But the rooms are introduced as tests ("An actual research abuse tests the difference between institutional approval and justification"), and realists also deny that approval makes something right. What Tuskegee tests is subjectivism, not the rival the project names as strongest.

For future people, the non-identity problem (Parfit) is where "justifiable to each" is weakest. A policy that changes who will exist is hard to call wrong *to* people who would otherwise never have existed. The ozone room is the natural place to raise it.

**Fix.**

- In each case room, ask once: "Would your verdict change if you held the rival grounding? If not, what does this case show about the thesis?"
- Add a non-identity variant to the ozone room. It also tests A-04.
- Consider replacing one case with an aggregation case, which tests A-06.

### A-08 · Moderate · "Valid", "justified", "authoritative" and "true" are used interchangeably; the reply to error theory quietly concedes a revisionary view

**Verified.**

- The thesis says standards are "constituted".
- `objectivity-target` talks of "moral truth".
- AUTHORITY_ARGUMENT talks of "the authority of a valid interpersonal moral demand".
- The error-theory objection's reply (`data.mjs:110`): "If ordinary language demands more, that may require revising its interpretation."

**Problem.** There are three possible claims here:

- (i) a claim about what makes moral sentences true;
- (ii) a claim about what gives demands their normative force;
- (iii) a claim about what makes a standard "valid".

These come apart. An error theorist can accept practical reasons of type (ii) while denying (i). If ordinary moral claims purport authority independent of any stance (the error theorist's premise), the project's reply amounts to a revisionary or reformist reading of moral language. That is a significant position. It belongs at the front of the argument, not in the tenth objection alcove. The opening spends three exhibits on what "good" means, but says nothing about what "wrong" means.

**Fix.** Add one glossary exhibit defining valid, authoritative and true. Say whether the account describes ordinary moral meaning or proposes to revise it.

### A-09 · Moderate · Personal judgment appears in the thesis but does no constitutive work; "A Framework with a Conscience" implies a standard beyond the framework

**Verified.**

- `data.mjs:8`: "…with personal judgment and accountability".
- `ARGUMENT_STRUCTURE.md`: "Personal judgment applies and challenges the framework."
- `agency-rule/refuse` (kind `commitment`): "I would refuse a rule that crosses a sufficiently serious moral limit."

**Problem.** If validity just is justifiability, personal judgment is epistemic (estimating what is justifiable) and practical (acting under uncertainty). It has no place in a statement of what makes standards valid. As for conscience challenging "the framework": if that means the actual, shared rule, fine. But say so, because otherwise it reads as a second, independent standard, which feeds A-01.

**Fix.** Rewrite the thesis along these lines: "…constituted by idealised justifiability to those affected. Individuals must judge, under uncertainty, what that requires of them, and they answer for those judgments."

### A-10 · Moderate · Reciprocity defends equal standing only formally; the hierarchist simply moves the dispute to which differences are relevant

**Verified.**

- `reciprocity-case` (`data.mjs:46`): "a claim to govern both of you should withstand that exchange of positions".
- The `circularity` objection's reply: "hereditary status cannot alone justify dismissing the complaint against that status."
- `path-constitution/standing` takes the same line.

**Problem.** "Status can't justify discounting a complaint against status" is a good reply to one self-serving argument. But hierarchists rarely cite bare status. They cite merit, contribution, capacity, religious role or species, and which differences are relevant is the whole dispute. Exchanging positions doesn't settle that. The minority-exclusion case (scarce capacity, past contributions) actually raises exactly this question, which is good, but the room gives no principle for deciding relevance.

**Fix.** Either give a substantive account of what makes a difference relevant, or present the exchange test as a heuristic for detecting special pleading rather than as a derivation of equal standing. The documents already call equal standing a commitment; the visitor-facing text should say no more than that.

### A-11 · Minor · One consistency rule reads a conditional answer as a categorical one

**Verified.**

- `same-killing-reasons` (`paths.mjs:137`) pairs `killing-complaint/skeptic` with `killing-no-reasons/none`.
- `skeptic` reads: "I oppose the act for nonmoral reasons while doubting moral truth."
- `none` reads: "That rejection by itself proves nobody has any reason to oppose the killing." It answers the question "What follows *if* you reject stance-independent moral facts?"
- The rule's explanation says: "The second says nobody has any reason to oppose the same act."

**Problem.**

- `none` is a claim about what follows from a hypothetical rejection.
- `skeptic` reports *doubt*, not rejection.

Someone can coherently believe "if there were no stance-independent facts, nobody would have a reason", while only doubting that there are none, and still oppose the act on nonmoral grounds they take themselves to have. Also, `none` is already flagged as an inference error, so a visitor who picks it gets flagged twice for one choice.

**Fix.**

- Either tighten `skeptic` to "I reject stance-independent moral facts and oppose the act for nonmoral reasons", or reclassify the rule as a tradeoff to clarify. In both cases, correct the explanation so it describes the conditional accurately.
- Separately, `killing-no-reasons/reject` (`data.mjs:167`), "stance-independent moral truth is needed", leaves open what it is needed for. Spell it out.

### A-12 · Minor · Route order and the evolved-fairness detour

- The thesis is stated in room 00 but only argued in room 04 ("Reasons in Both Directions"). Before that, visitors pass through the evolved-fairness room (01), the preference room (02) and the strongest realist rival (03).
- Room 01 covers seven empirical studies and ends on a negative conclusion ("does not settle"). Its real dialectical relevance, Street (A-05), belongs next to the realist room.
- Suggested order: 00 (narrowed per A-02/A-03), then the positive argument, then the preference objection, then the realist rival with the Street exchange, then conscience and dissent, then the cases, the objections and the synthesis. Make the fairness room an optional side room.

---

## Part B: Interface and presentation

### U-01 · Major · Flags can be predicted from surface wording, and none target realist-side overreach

**Verified** by script over the exported `steps`:

- All 13 flagged choices contain an absolute cue word ("alone", "proves", "automatically", "logically", "directly", "conclusively", "fully"…). Only 6 of 199 unflagged choices do.
- Flagged choices never appear in the first position.
- Flags target antirealist or debunking overreach (`none`, `settled`, `objections-authority/truth`, `synthesis-claim/proof`), shortcuts that favour the thesis (`reciprocity-exception/proof`), naive naturalism and empirical overreach.
- No choice offers the realist-side overreach. In particular, nothing offers the commonest popular inference against the thesis: "if morality is constructed, then whatever people agree on is right / might makes right". The killing room exists to defuse the mirror image of that inference.

**Problem.** The "reasoning check" mostly tests whether a visitor notices words like "proves" and "alone". Luna's pass001 review raised this (point 4). It has been softened but not solved.

**Fix.**

- Add flagged options that are genuinely invalid but have no cue words. Examples: "people disagree, so there is no fact of the matter"; "justified rules reduce harm, so any rule that reduces harm is justified"; equivocating on "objective"; and the realist-side "constructed, therefore consensus makes it right".
- Put cue words into some valid options, e.g. "this alone does not settle…".
- Vary where flagged options appear.

### U-02 · Major · The headings shown after a choice favour the author's view

**Verified.** `app.mjs:39` picks the feedback heading from the choice's kind:

- `contested` gets "The disagreement to work through".
- `commitment` gets "The commitment you are making".

Across the realist options, enumerated by ID (list in the appendix), all 24 are `contested`. Of 15 options aligned with the thesis, 13 are `commitment`; only `good-ground/shared` and `path-authority-ground/construct` are `contested`.

**Problem.** By the project's own account, its grounding step is "a defended interpretive commitment". It is as contested as realism. The badge text defines a commitment as "a normative premise defended with reasons", which describes realism equally well. A visitor who picks realism is told they have a disagreement to work through; a visitor who picks the author's view is told they've made a commitment.

**Fix.** Use one heading for every serious position, such as "The position you are taking, and its burden", and reserve a different heading for flags only. Alternatively, label the thesis options `contested` too.

### U-03 · Major · The primary button bypasses the argument

**Verified.**

- The room card's "Follow the argument →" (`app.mjs:25`, `data-progress=nextIndex`) jumps to the next unanswered decision.
- In room 00 in the browser, it opens "1 / 6 on this path" immediately and shows none of the six exhibits.
- Exhibits appear only as lecterns in the 3D scene, or as a separate list on the room card.

**Problem.** A visitor who follows the primary button can answer all the decisions without reading any of the 49 exhibit and objection texts, which are where the argument actually is. The progress counter counts only decisions, which reinforces this. For a product whose purpose is an argument, the main route is effectively a quiz.

**Fix.** Give each step the exhibit or exhibits it depends on (e.g. `after:['objective-senses']`), and have the "Follow the argument" sequence show exhibit, then question, then feedback. Alternatively, rename the button "Answer the decisions" and make "Walk the argument" the primary action.

### U-04 · Moderate · After a choice, the feedback stays below the fold

**Verified** at 1440×900 (`screens/feedback_below_fold_1440.png`):

- After picking an option on the first question, focus moves to `#feedback-title` with `focus({preventScroll:true})`.
- The feedback section's top is at y≈969, below the 900 px viewport, and the card's `scrollTop` stays at 0.
- Sighted visitors see only the selected button change. The reasoning feedback needs a manual scroll.

**Fix.** Scroll the feedback into view with `scrollIntoView({block:'nearest'})`, respecting reduced-motion, or render the feedback directly under the chosen option.

### U-05 · Moderate · The reading edition is very long, mostly apparatus, and phones open on it

**Verified** at 390×844, headless Chromium:

- Page height is about 139,700 px, around 165 screens.
- About 20,400 words are visible, with 622 links and 830 `<details>` elements.
- 568 collapsed "What this source supports" blocks hold about 32,000 words in the DOM, mostly repeats of the same 41 source notes.
- The exhibit and objection text that makes the argument is about 3,600 words. Step prompts, choices, feedback and evidence come to about 9,400 words.

**Problem.** Visitors on phones start in the reading edition, and there is no "argument in brief" at the top.

**Fix.**

- Above the fold, add "The argument in six lines" (AUTHORITY_ARGUMENT premises 1–6) and "Where it is weakest" (the honest versions of A-01 and A-05).
- Collapse each question's choice set by default.
- Print each source's access note once, in a bibliography, and link to it instead of repeating it at every citation.

### U-06 · Moderate · Internal process vocabulary is visible to the public

**Verified.**

- The built reading page contains 610 occurrences of "pass00N", e.g. "inspected in pass002".
- Source notes name a sub-agent ("…inspected by Terra").
- The codename appears in the HUD ("MORARG · Human morality"), in the page title "MORARG · Morality, Between Us", and in 15 visitor-facing strings across `data`, `paths`, `fairness`, `sources` and `values`.
- Developer terms such as "selected-claim checks", "branch" and "stale" also appear in visitor copy.

**Fix.** Write a public copy layer, e.g. "Reviewed: selected sections (Oct 2026)". Keep pass, agent and codename provenance in `_documentation/`.

### U-07 · Moderate · So many hedges that the positive case is hard to find

**Verified.** 33 of the 49 exhibit and objection texts contain a concession marker ("a realist can/may", "does not", "not by itself", "remains open"). 87 of their 261 sentences contain a negation.

**Problem.** Visitors meet a run of disclaimers. Earlier reviews were right to push for fairness, but the response was to add a local caveat everywhere rather than state the position once and gather its limits in one place.

**Fix.** Give each exhibit one positive claim and its reason. Collect the concessions into a single "Where this is weakest" panel per room and into the synthesis. Combined with A-01, the honest version is also the shorter one.

### U-08 · Minor · Copy that doesn't fit its situation

**Verified.**

- When the only issue is unanswered questions, the exit dialog still says "Review the precise reasons, explain your position…" and "You can keep a disputed position. The check identifies the particular claim…" (`data.mjs` `exitReview`; `page.mjs:26`). See `screens/exit_dialog_unanswered_only_1440.png`.
- The room card labels the room's *conclusion* "The case to examine" (`app.mjs:25`), and shows it before the argument.
- The controls-only view says "The 3D view is unavailable" (`page.mjs:23`) even when the visitor chose it deliberately.
- Two denominators appear: "0/39 decisions" on the journey card and "1/6 on this path" on the room card. The first grows as follow-ups activate.

### U-09 · Minor · Labels collide in the 3D scene

**Verified** at 1440×900 in the hub (`screens/hub_label_collisions_1440.png`):

- "What would make a demand authoritative?" is overlapped by "Public answerability".
- "Truth beyond us" overlaps the portal label "Dissent, Power and Reform".
- The journey card hides the portal label "Reasons in Both Directions".

### U-10 · Minor · Values have no payoff, and a reload loses everything

- Collected values never feed back into anything. The synthesis room could ask: "You kept X and Y; which of your answers did they pull on?"
- A reload loses a session of up to 53 decisions. Offer opt-in `localStorage`. It still needs no server and fits the existing privacy stance.

---

## Part C: Sanity check of the MORARG ↔ Moral Topology pairing

**Basis:** only the two documents and the two fixtures. Everything said about MTOP here is as reported in them.

**Verified mechanically:**

- The `dossier_sha256` in the mapping fixture equals the SHA-256 of `research_consent_case.example.json` (`5135395c…`).
- The mapping lists all 25 controls, as the plan says.
- The variant list and `unmapped_variants` agree with each other.
- The identity control's expected zero delta is consistent with the plan's paired-draws claim (§2, §7).

### P-01 · Agreement · The category judgement and guardrails are right

Both tools address morality, but one asks what makes a judgment *justified* and the other models how a judgment *forms*. Neither can stand in for the other.

The adjustments in pass006 are correct and should be preserved in any shared design:

- y means "motivational binding", not authority.
- Scope breadth and processing style are not measures of adequacy.
- The w axis can't represent MORARG's independently chosen values.
- Convergence or stability is never evidence for MORARG's thesis.
- Traits are never inferred from answers.

### P-02 · Major · No comparison in the pilot has both tools speaking to the same change

- **Comparison A** varies an authored model parameter, and is explicitly *not* a fact about the case. It is a lesson about the model. MORARG has nothing to say about it, because the director's request doesn't change whether the protocol is justifiable.
- **Comparison B** changes the one fact that bears on participants' consent: refusing now costs four weeks of ordinary care, which raises a question of coercion or undue inducement. It matters to MORARG, but MTOP explicitly doesn't represent it.
- **Comparison C** is a control.

So, by construction, the shared case demonstrates that the tools don't overlap. That teaches one point ("pressure isn't a reason, and the model doesn't see the morally relevant change"), wrapped in a five-stage engineering plan.

**Root cause.** MORARG's decision ("May the protocol be offered…?") is about the participants and the protocol. MTOP's modelled actor is the *reviewer*.

**Fix.** Point the MORARG question at the modelled actor: "What does the reviewer owe participants, the director and the institution under this pressure? Is recusal, a second reviewer, documentation or delay required?" Comparison A then becomes evidence for a premise MORARG actually needs: whether pressure could distort this reviewer's judgment enough to require a safeguard. MORARG's adequacy conditions already include such premises: "examine coercion, retaliation, inaccessible information and control of the procedure" (AUTHORITY_ARGUMENT §adequacy). The baseline facts, which stipulate participant understanding and unaffected care, already settle most of the consent questions anyway, so the participant-focused framing leaves MORARG little to deliberate.

### P-03 · Proposal · How the two could eventually become one system: join at the procedural premises, never at verdicts

MORARG's adequacy conditions and safeguard decisions rest on empirical assumptions about psychology:

- pressure and hierarchy distort judgment;
- challenge and protected dissent correct it;
- representation reduces neglect of absent parties;
- deliberation improves how considerations are weighed;
- anonymity and diffusion change felt responsibility.

These are the kinds of mechanisms MTOP is reported to model (authority, conformity, diffusion, deliberation, anonymity, empathy levers). That suggests a reusable seam:

1. Tag each MORARG adequacy condition and safeguard question (`reform-safeguard`, `agency-rule`, the proxy safeguards) with the empirical assumption behind it.
2. For each assumption, define one family of MTOP experiments that varies the corresponding mechanism. Run them paired, and test robustness across backgrounds (P-05).
3. MORARG then asks: "If this mechanism is as strong as the model assumes, which safeguard is required, and does that change what can be justified?" MTOP informs the procedural part of justification, which the theory itself says depends on facts. It never decides validity.

This gives one mapping per *type of safeguard* rather than a bespoke mapping per case, and it respects every guardrail in pass006. It turns MTOP's main limitation, being uncalibrated, into an explicit "what if" instead of a hidden one. It also feeds back into MORARG's argument. Suppose a safeguard MORARG treats as essential makes no difference under any plausible MTOP parameterisation, or one it ignores matters a lot. Either result is a prompt to revisit the sufficiency of the procedure (A-01).

In the reverse direction, MORARG can annotate MTOP trajectories with the conviction-versus-warrant question: was this movement responsive to reasons, or only to pressure?

### P-04 · Moderate · Test the teaching premise before building the transfer contract

The plan puts the 6–8 visitor comprehension test at stage 5. That comes after importers, envelopes, run fingerprints and context generations (stages 3–4). The main risk is about meaning (visitors confusing motivation with authority), not engineering.

**Fix.**

- Run the comprehension test straight after stage 2, using manual links and a printed case sheet. Build stages 3–4 only if it passes. The plan's own blocking rule (§7, final bullet) already points this way.
- SHA-256 identities, 2 MiB caps and strict bounded arrays suit a published system, but they're over-specified for a one-case pilot with no users. Define a pilot profile instead: case ID, revision and variant in the link, plus a JSON download with inputs and seed. Defer the rest.

### P-05 · Moderate · Comparison A needs a robustness check across backgrounds

The other 24 controls, the probe `[20,20,20,0]` and the zero trait offsets are authored placeholders. A single paired delta (authority 2→8) at one background may be an artefact of that background, because authority can interact with conformity, rule of law, surveillance and so on. Visitors will read one number as *the* effect.

**Fix.** Before showing A to visitors, run it across a small grid of backgrounds and probes, and report the range and whether the sign is stable. Otherwise label it explicitly "at this background only".

### P-06 · Moderate · The authority mechanism fits an independent reviewer poorly; the whistleblowing case is the better first case

As reported, MTOP's authority lever implements an agentic shift, i.e. obedience in the moment. The plan itself flags that the fit is limited. An independent reviewer asked to "approve promptly" is closer to time pressure, career incentive or deference.

The whistleblowing candidate (§8) fits the mechanism better. Pressure there changes *both* motivation and genuine reasons, because the cost to oneself is a real moral consideration about how demanding a duty is. That makes it the best case for practising the reason-versus-pressure distinction the pairing exists to teach. If the reviewer case is kept, apply P-02.

### P-07 · Minor · Hide theory markers and the objective force in shared views

Pass006 recommends relabelling MTOP's theory markers and fixed-reference force as sensitivity experiments. For any shared-case view I'd go further and hide them. Metaethical theories aren't configurations of judgment, and plotting "realism" as a point in a judgment space contradicts MORARG's central distinction whatever the label says.

### P-08 · Minor · Documentation housekeeping

- The pass006 changelog entry points to `_output/pass006_…/assessment…`, but the file is in `_documentation/`.
- `project.md` and `AGENTS.md` still exclude "the separate 3D moral mechanism". If that means MTOP, the pairing work needs an explicit scope change first, as plan §9 notes.
- The plan inspected build 0.5.0. Live is 0.5.1, which changed only the build identity, so this doesn't matter.

---

## Suggested order of work

1. **Operator decision on the thesis (A-01, A-05):** a hybrid headline, or a discriminating argument. The synthesis options, conclusion exhibits and failure table all follow from this.
2. **Opening taxonomy and explanandum (A-02, A-03):** cheap to fix, and they frame everything after them.
3. **Interleave exhibits with decisions and add the argument in brief (U-03, U-05).**
4. **Symmetric headings and rebalanced flags (U-01, U-02).**
5. **Pairing:** rewrite the shared-case MORARG question around the reviewer, or switch to whistleblowing (P-02, P-06). Run comprehension testing before stages 3–4 (P-04).

## Appendix: reproducibility

The count scripts import `_application/data.mjs` in Node 22 and iterate `steps`, `rooms`, `roomExhibits()` and `objections`.

- **Absolute cue words** are matched with `/\b(alone|proves?|automatically|logically|every|all|already|directly|conclusively|fully|same moral concept|no nonhuman)\b/i`.
- **The 24 realist options:** `objectivity-target/truth`, `good-ground/realist`, `objectivity-bridge/naturalist`, `objectivity-role/discover`, `fairness-authority/realist`, `killing-complaint/realist`, `killing-no-reasons/reject`, `killing-refuser/realist`, `realism-best/natural`, `realism-best/reasons`, `realism-evolution/reply`, `realism-discriminates/realist`, `reform-dissenter/truth`, `consent-foundation/realist`, `ozone-facts/realist`, `objections-authority/discover`, `synthesis-position/realist`, `path-constitution/prior`, `path-refusal/independent`, `path-realist-reasons/reason`, `path-realist-reasons/natural`, `path-circularity/prior`, `path-authority-ground/realist`, `path-authority-defeater/independent`.
- **The 15 thesis-aligned options:** `good-senses/claims`, `good-ground/shared`, `objectivity-role/construct`, `killing-complaint/reciprocal`, `reciprocity-exception/difference`, `reciprocity-priority/recognition`, `reform-dissenter/reasons`, `objections-authority/construct`, `synthesis-position/framework`, `path-constitution/standing`, `path-refusal/claim`, `path-realist-reasons/sufficiency`, `path-authority-ground/construct`, `path-circularity/partial`, `path-circularity/mutual`.
- **Browser measurements** came from Playwright with Chromium, served locally by `npm --prefix _application run dev`, using SwiftShader WebGL. Headless rendering may differ slightly from GPU rendering.
- **Reading-page word counts** use `innerText` of `#guide`, which excludes the contents of collapsed `<details>`. The 32,000-word source-note figure was measured separately from the built `index.html`.

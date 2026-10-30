# Argument and interaction structure (edition 5, revision 3)

Edition 5 revision 3 (`morarg-argument-5.3`, build 0.7.0) keeps the edition 5 question, set at the Operator's direction (28 October 2026):

> **Do we need objective moral facts to settle how we treat each other?**

The exhibit argues that we don't. Facts about the world never settle on their own what we should do. The reasons we can give the people affected, plus an honest look at the influences on judgment, can do the work we need morality to do. The exhibit does not try to prove that objective moral facts don't exist. It argues that we never need to rely on them, and it says plainly where that claim is weakest.

Revision 2 answers Astra's pass002 review (`_review/review_pass002_astra_20261028_1647Z.md` on the `review` branch) and adds a room on the is–ought gap. What changed and why is in `EDITION5_REVISION2.md`. The earlier constitutive thesis (`AUTHORITY_ARGUMENT.md`, `ARGUMENT_MAP.json`) is retained as history only.

Revision 3 adds the independent second island on evaluation: standards, evidence, subjective attitudes, and the gap between a rule and its application. See `EVALUATION_FOUNDATIONS.md` for research scope and design. Existing IDs and eleven ledger jobs are preserved; later display numbers shift by one. Earlier review disagreements remain open.

## The claim, stated exactly

The Operator chose dispensability, not merely practical independence. The runtime states it once (`data.mjs::brief`, "What it claims, exactly") and keeps to it:

- **Claimed:** in *explaining* moral judgments, *justifying* decisions to one another, *protecting* people and *making sense of* our own reasoning, we never need to rely on objective moral facts.
- **Not claimed:** that objective moral facts don't exist.
- **The countermodel, stated in the opening:** a realist can accept the same reasons and safeguards and say they are correct because they track objective truths. The exhibit's argument against that extra layer is that if nothing in our practice depends on it, it does no work. This is a parsimony argument, and the exhibit says so; it is not a proof.
- **Jobs have kinds** (`data.mjs::jobKinds`): explaining, justifying, protecting, reasoning. A run of "covered" answers of one kind is not presented as many independent confirmations.

## Three ideas, defined in plain words

Every visitor-facing use matches the glossary in `data.mjs`:

- **Objective moral fact:** a moral truth that would hold no matter what anyone thinks, feels or would agree to, even if everyone, reasoning carefully and fairly, concluded otherwise.
- **Reasons between people:** what we owe each other is settled by the reasons we can give the people our choices affect, reasons they could accept if well informed, free to object and treated as equals. This is not a vote or current agreement. It adapts Scanlon and Habermas; the glossary notes that Scanlon himself is a realist about reasons.
- **Influences:** anything that changes how someone judges. Some carry reasons (new information, testimony, a real change in options or burdens); some only push (a misleading story, obedience, wanting to fit in, self-interest dressed as principle). The same event can do both. **Pressures** are the influences that only push. This replaces edition 5's categorical list of "pressures", which treated whole categories of circumstance (scarcity, contact, self-interest) as non-reasons (Astra A-19).
- **Is and ought:** a fact says how things are; an "ought" says what should be done; getting from one to the other always needs a want, a value or a commitment.

## The route: context, eleven jobs, and a closing ledger

| # | Room (id) | Job (ledger) | Kind | Main literature, both sides |
|---|---|---|---|---|
| 00 | Do We Need Objective Morality? (`hub`) | sets the question | | Railton, Enoch, Parfit; Scanlon, Habermas |
| 01 | What Even Is Right & Wrong? (`evaluation`) | independent context; no ledger job | | Geach, Hume, Moore, Finlay, Ross, Railton |
| 02 | Where Do Moral Feelings Come From? (`fairness`) | J1 | explaining | Sturgeon, Huemer vs Harman, Street; primate and infant studies |
| 03 | Can Facts Tell Us What to Do? (`isought`) | J2 | justifying | Hume; Moore; Searle vs Hare; Foot; Putnam; Parfit and Enoch (non-naturalists who accept the gap) |
| 04 | Is It Just Opinion, Then? (`commute`) | J3 | justifying | Parfit vs Scanlon, Blackburn; Mackie, Joyce |
| 05 | Why Do Decent People Disagree? (`climate`) | J4 | justifying | Enoch (impartiality argument, corrected) vs Habermas, Rawls, Wong; Milgram, Pettigrew & Tropp |
| 06 | Can a Whole Society Be Wrong? (`commons`) | J5 | justifying | Huemer, Railton vs Anderson, Scanlon |
| 07 | Can a Fair Agreement Be Terrible? (`village`) | J6 | justifying | Parfit, Enoch vs Scanlon (transmitter room); openly the weakest point |
| 08 | Why Should Someone Who Doesn't Care Listen? (`access`) | J7 | protecting | Parfit, Enoch vs Williams *or* Korsgaard (rival routes), Darwall |
| 09 | Case: Tuskegee and Consent (`postcode`) | J8 | justifying | CDC record, Belmont |
| 10 | Case: What Is Punishment For? (`places`) | J9 | justifying | Bhuller et al. (Norway) |
| 11 | Case: The Ozone Layer and People Not Yet Born (`commonstead`) | J10 | justifying | WMO 2022, Montreal Protocol Art. 10, Parfit (non-identity), Kumar |
| 12 | Objections That Remain (`hall`) | J11 | reasoning | Enoch, Joyce, Cuneo, Dworkin, Parfit, Huemer, Mackie |
| 13 | Where Do You Stand? (`charter`) | ledger, comparison, final view | | |

### Room 03: Can Facts Tell Us What to Do?

Written for a well-read teenager: one concrete everyday case first, then the logic, then the attempted bridges and their hidden planks.

- **Situation:** the doctor's "if you keep smoking, there's about a one-in-two chance it will shorten your life". Where did "so you should stop" come from?
- **Exhibits:** Hume's surprise (1740, T 3.1.1.27); Spot the hidden premise (natural, everyone does it, legal, evolution favoured it, the data shows it works); Attempts to build a bridge (Searle's promise, Foot's natural goodness, Putnam's thick concepts); Where each bridge needs a hidden plank (Hare's reply to Searle, flourishing still needs weighing, "cruel" carries its value inside it); What the gap shows, and what it doesn't.
- **The key distinction, stated in the room.** The popular summary ("no description of reality contains instructions; deciding needs a mind bringing values, and needing a mind rules out objectivity") is right about the first half. The second half does not follow by itself. "Needs a mind" can mean that a mind must *apply* a value (true of arithmetic too, and arithmetic is objective) or that the value's *truth* depends on minds (the point in dispute). Non-naturalist objectivists (Moore, Parfit, Enoch) accept the gap completely. The gap rules out reading morality off the world. Together with the rest of the exhibit (if nothing in practice relies on non-natural moral facts, they do no work), it supports the thesis; on its own, it does not refute objectivity.
- **Decisions:** `gap-smoking` (what fills the gap: a want, a value, nothing [flagged], unsure); `gap-nature` (natural so right [flagged], a hidden premise, a different kind of fact, flourishing); `gap-promise` (Searle: facts suffice / only inside the practice / a reason, not a fact / unsure); `gap-mind` ("needs a mind, so not objective" [flagged as not following] / a further argument is needed / values are objective anyway / depends what "needs a mind" means); `gap-job` (J2 ledger).

## Opening questions, principles and the comparison

- **Twelve opening questions** (`values.mjs::intakeItems`), five-point scale, skippable. Each is tested in one room; the hall of objections has none. `i-facts` ("If we knew every fact about what is happening and what it will cause, we would know what is right to do.") is new and replaces `i-plural`.
- **Intake principles are exactly the answer given** (Astra U-12). The *agree* principle's sentence is the statement itself; the *disagree* principle's sentence is its plain negation (`values.mjs::ia`, `id_`). No stronger or different commitment is attributed. Each room has three principles: the two intake principles and one method principle. The hall's three are not linked to the intake.
- **Strict links** (Astra U-13). A principle "fits" or "pulls against" an answer only when the two cannot both be held as stated (or, for fits, when the answer relies on the principle). Probabilistic or existential principles do not strain a single exception: "some things are wrong whatever we agree" does not strain "this killing would be right if everyone approved"; "a feeling can't usually be trusted by itself" does not strain trusting it in one case. "A job is covered" never strains "objective facts exist". Several principles therefore have few or no links; that is deliberate.
- **Comparison.** Unchanged in form: answers before and after, the direction of movement, and the decisions that fitted or strained each opening answer. It compares answers to authored questions; it is not a measurement of values or of persuasion.

## The ledger and what it reports

Each job has one ledger question with four answers: needs objective facts, covered by reasons and influences, partly, unsure. `data.mjs::ledgerOutcome` reports no more than the answers show (Astra U-11):

| Outcome | When | What the visitor reads |
|---|---|---|
| `open` | nothing answered | nothing |
| `narrower` | any job answered "needs" | which jobs; the claim fails there |
| `covered` | every job answered "covered" | covered across the named kinds; this doesn't show objective facts don't exist |
| `unsettled` | otherwise | no job was answered "needs", but that is not the same as showing none does; the partly/unsure jobs are named and the claim is "not established" for them; unanswered jobs are counted |

## Choices and their consequences

Every choice has a **label**, a **follows** line shown before choosing, and **feedback** shown after. All serious positions share one kind (`contested`) and one feedback heading. Only `inference` and `unsupported` choices are flagged. The prior rooms retain eleven flags, each a specific step that does not follow or claims more than the evidence: `origin-monkey/fairness`, `origin-debunk/debunked`, `origin-debunk/proves`, `gap-smoking/nothing`, `gap-nature/right`, `gap-mind/follows`, `disagree-swing/discredit`, `prison-evidence/programme`, `prison-evidence/universal`, `ozone-facts/recovered`, `ozone-facts/proof`. `taste-same/same` is no longer flagged (Astra A-20): calling cruelty and a taste both attitudes is a coherent position, though the feedback explains why the difference in object still matters.

The evaluation room adds four narrow inference checks within its choices: counting preferences does not by itself justify a normative standard; needing a judge does not establish attitude-dependent truth; a possible condition is not established; and an unknown condition is not thereby false. Neither subjectivism nor realism is itself flagged. Its three principles are independent of the opening intake.

## Checks

`paths.mjs::consistencyRules` holds five, each a specific pair (or triple) of answers that really pull against each other as stated:

| Check | Kind | Answers |
|---|---|---|
| `evolved-but-objective` | tension (a reliability question) | seeing a moral fact (00) + Street's "lucky accident" (02) |
| `promise-and-gap` | tension | Searle's facts suffice (03) + getting to "ought" is covered by values we bring (03) |
| `agreement-makes-right` | tension | universal approval makes it right (04) + slavery would still be wrong even if *everyone*, the enslaved included, accepted it (05 follow-up) |
| `vote-versus-the-excluded` | tension | wrong because unjustifiable to the enslaved (06) + let the vote decide about Jones (07) |
| `no-facts-then-a-fact` | contradiction | no objective facts (00) + Jones rescued because his suffering "objectively outweighs" (07) |

Removed (Astra A-17): `unknowable-but-findable` (read a conditional "even if no one can show it" as asserted impossibility) and `covered-then-needed` (job-specific reliance is an allowed position). `agreement-makes-right` previously compared "everyone alive" with "nearly every free person"; it now fires only against the new follow-up `society-adaptive`, which makes the acceptance genuinely universal. Fairness is not measured by counting checks per camp.

## Interaction

- **Walkthrough** in every room, including the hall of objections, whose main button now opens the first unread objection (Astra U-03).
- **Exhibit links.** An exhibit may carry a `link`. The disagreement room's "A model you can play with" (badge *Model*) opens the same town in Moral Topology 2.2 (`./topology/?case=town&from=climate`). There the visitor unveils the town's events one at a time as factors that move two neighbours to the same plan, then removes the false story and sees that they would still agree, but on a different plan. The exhibit states that the numbers are authored assumptions and a meeting in the model is not evidence that people would agree (Astra P-09). The punishment room's influences exhibit links to the punishment case. Topology's back link returns to the room. The town's shared record is `_documentation/shared_cases/town_housing_case.json`, checked by `npm --prefix _application run test:shared`.
- **Ledger** shows each job's kind and the faithful outcome above.
- Unchanged: feedback scrolls into view; the room summary appears only after its decisions; the reading edition has a brief, glossary and single bibliography.

## Engine contract (unchanged)

The pure reasoning engine (`reasoning.mjs`), branch activation, stale/inactive answers, signature-bound explanations, epoch-millisecond `ts_ms` records, in-page state with no persistence or network, and the 3D layout contract are unchanged. `stepsIn(room)` is the full reading catalogue; `stepsIn(room, answers)` is the current interactive path. The new room uses the generic room arc, its own palette and one wall slot for its diagram.

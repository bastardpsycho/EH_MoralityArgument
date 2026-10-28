# Argument and interaction structure (edition 5)

Edition 5 (`morarg-argument-5`, build 0.6.0) rebuilds the argument around one plain question, at the Operator's direction (28 October 2026):

> **Do we need objective moral facts to settle how we treat each other?**

The exhibit argues that we don't. The reasons we can give the people affected, plus an honest account of the pressures that shape judgment, can do every job we need morality to do. It does not try to prove that objective moral facts don't exist. It tries to make them unnecessary, and it says plainly where that claim is weakest. This matches the companion Moral Topology model, which demonstrates (illustratively, not empirically) that pressures on judgment can move moral decisions between wider and narrower circles of concern.

Earlier editions defended a "constitutive" thesis ("standards are constituted by justifiability"). That thesis, its numbered authority argument (`AUTHORITY_ARGUMENT.md`) and its argument map (`ARGUMENT_MAP.json`) are retained as history and no longer describe the runtime. The reasons for the change are in `_review/review_pass001_claude_20261028_1517Z.md` (on the `review` branch) and in `EDITION5_REBUILD.md`.

## Three ideas, defined in plain words

Every visitor-facing use of these terms matches the glossary in `data.mjs`:

- **Objective moral fact:** a moral truth that would hold no matter what anyone thinks, feels or would agree to, even if everyone, reasoning carefully and fairly, concluded otherwise. Supporters are called *objectivists* (philosophers say *moral realists*).
- **Reasons between people:** what we owe each other is settled by the reasons we can give the people our choices affect, reasons they could accept if well informed, free to object and treated as equals. This is not a vote or current agreement (Scanlon, Habermas).
- **Pressures:** forces that push judgment without being reasons, such as fear, scarcity, loyalty, obedience to authority, conformity, distance and self-interest.

Terms such as "approval", "authority", "constituted", "stance-independent", "normative" and "validity" are no longer used in visitor copy without explanation.

## The route: one job per room

Each concept room has the same shape: a link back to the previous room, a concrete **situation**, the **strongest case that the job needs objective facts**, the **best answer without them**, sometimes a **still open** exhibit, then decisions. Each concept room and case room contains one **ledger** question with four answers: needs objective facts, covered by reasons and pressures, partly, or unsure.

| # | Room | Job tested (ledger) | Main literature, both sides |
|---|---|---|---|
| 00 | Do We Need Objective Morality? | (sets the question; your starting view) | Railton, Enoch, Parfit; Scanlon, Habermas; Milgram |
| 01 | Where Do Moral Feelings Come From? | J1 Explaining where moral feelings come from | Sturgeon, Huemer vs Harman, Street; primate and infant studies; Curry |
| 02 | Is It Just Opinion, Then? | J2 Making cruelty more than taste | Parfit vs Scanlon, Blackburn; Mackie, Joyce |
| 03 | Why Do Decent People Disagree? | J3 Explaining and settling disagreement | Enoch (fairness argument) vs Habermas, Rawls, Wong; Milgram, Darley & Batson, Pettigrew & Tropp, Graham et al. |
| 04 | Can a Whole Society Be Wrong? | J4 Showing a whole society can be wrong | Huemer, Railton vs Anderson (abolition), Scanlon |
| 05 | Can a Fair Agreement Be Terrible? | J5 Ruling out terrible agreements | Parfit, Enoch vs Scanlon (transmitter room); openly the weakest point |
| 06 | Why Should Someone Who Doesn't Care Listen? | J6 Holding to account someone who doesn't care | Parfit, Enoch vs Williams, Korsgaard, Darwall |
| 07 | Case: Tuskegee and Consent | J7 | CDC record, Belmont |
| 08 | Case: What Is Punishment For? | J8 | Bhuller et al. (Norway) |
| 09 | Case: The Ozone Layer and People Not Yet Born | J9 | WMO 2022, Montreal Protocol Art. 10, Parfit (non-identity problem) |
| 10 | Objections That Remain | J10 Making sense of our own moral reasoning | Enoch, Cuneo, Dworkin, Parfit, Huemer, Mackie, Joyce |
| 11 | Where Do You Stand? | (ledger, comparison, final view) | |

In the case rooms, the three exhibits are *what happened*, *the pressures*, and *the reasons*, so the influence half and the reasons half of the model are visible on real material.

The exhibit's own conclusion (room 11) is honest about the result. Reasons plus pressures did the work in every job tested, with two weaker points: limits on what a fair agreement may impose (room 05), and duties to those who cannot take part, such as future people and animals (room 09). In both, the answer without objective facts is plausible but not decisive.

## Opening questions, principles and the comparison

- **Twelve opening value questions** (`values.mjs::intakeItems`) are rated on a five-point scale (strongly disagree to strongly agree) and can be skipped. Each is tested in one room.
- **Principles** replace the old "values". Each room has three. Each is a plain sentence ("Agreement isn't enough: I won't call something right just because most people agree with it."). Two per room are the *agree* and *disagree* versions of that room's opening question; the third is a method principle.
- **Pre-selection.** On entering a room, the principle matching the visitor's opening answer is kept automatically and marked "from your opening answers" (`journey.mjs::intakePicks`). A neutral or skipped answer selects nothing. A visitor can release it, and a release is never overridden.
- **Fit and tension.** Each principle lists the answers that *fit* it and those that *pull against* it, with one reason for each (`fits`, `strains`, `fitNote`, `strainNote`). Before choosing, the decision card lists held principles that bear on the question. After choosing, it shows "Fits / Pulls against your principle …" with the reason. Saying a job is *covered* never pulls against believing objective facts *exist*, because existing and being needed are different claims.
- **Comparison.** The last room asks the twelve statements again and shows, for each: the starting answer, the current answer and the direction of movement; how many decisions fitted or pulled against the starting position, listing each tension with its reason; the visitor's first and last answers on objective facts; and the ledger.

## Choices and their consequences

Every choice has:

- a **label**: what the visitor would say;
- **follows**: what the choice commits you to, shown *before* choosing, under the label;
- **feedback**: what the answer means, shown after choosing.

All serious positions on either side share one kind (`contested`), and the feedback heading is the same for all of them ("What this answer means"). Only `inference` and `unsupported` choices are flagged ("This step doesn't follow"). There are nine flags. They target specific steps that do not follow, in both directions: evolution proves feelings false; evolution proves them right; denying objective facts makes cruelty taste; influence means "wrong"; overstated study claims; and "the science proves the treaty morally right". Holding a view is never flagged.

## Checks that run in both directions

`paths.mjs::consistencyRules` holds six checks, each a specific pair of answers with an explanation and scope:

| Check | Tests | Pair |
|---|---|---|
| `evolved-but-objective` | objectivism | seeing a moral fact (00) + Street's dilemma (01) |
| `unknowable-but-findable` | objectivism | an answer no one can show (00) + "find out which side is objectively right" (03) |
| `agreement-makes-right` | relativism | universal approval makes it right (02) + slavery was wrong (04) |
| `vote-versus-the-excluded` | the reasons view | wrong because unjustifiable to the enslaved (04) + let the fair vote decide about Jones (05) |
| `no-facts-then-a-fact` | objective-fact skeptics | no objective facts (00) + Jones rescued because suffering "objectively outweighs" (05) |
| `covered-then-needed` | the reasons view | society job covered (04) + objective reason for Jones (05) |

A visitor can revise an answer, record a change of mind, explain a distinction, or keep both. Explanations are recorded, not graded, and bind to the exact answers. A changed answer retires them.

## Interaction changes

- **Walkthrough.** A room's main button reads the exhibits in order ("Start: read, then decide"), and the last exhibit leads into the decisions. Previously the main button skipped every exhibit.
- After choosing, the feedback is scrolled into view.
- The room's "Where this room ends up" summary appears only once its decisions are answered, so it is not a spoiler.
- The exit dialog's wording matches the situation (unanswered, a step that doesn't follow, or a tension).
- The controls-only view no longer says the 3D view is "unavailable".
- The reading edition opens with the argument in brief and a glossary. It cites sources by linking to a single bibliography, instead of repeating each source's notes at every citation (the number of collapsible sections fell from 830 to 167). It also lists the opening questions, the ledger and the checks.
- Internal process vocabulary (pass numbers, agent names, the codename) has been removed from public copy.

## Engine contract (unchanged)

The pure reasoning engine (`reasoning.mjs`), branch activation, stale/inactive answer handling, signature-bound explanations, epoch-millisecond `ts_ms` records, in-page state with no persistence or network, and the 3D layout contract are unchanged. `stepsIn(room)` is the full reading catalogue; `stepsIn(room, answers)` is the current interactive path.

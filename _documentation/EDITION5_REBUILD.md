# Edition 5 rebuild: what changed, why, and what to review

Branch: `rebuild-argument` (cut from `main` @ `8c53014`). Build 0.6.0, argument edition `morarg-argument-5`. Not deployed. Written by Claude at the Operator's request (28 October 2026). This edition is intended for Codex review next.

## Why rebuild

The Operator's assessment after the review on the `review` branch:

- Visitors could not follow the questions and choices. Statements appeared without context; terms such as *approval* and *authority* were used without explanation; principles ("values") did not say what keeping them meant; case descriptions did not give a scenario a person could act on.
- The thesis was worded in terms ("constituted by justification") that visitors could not use.
- The argument's direction was forced rather than tested.

The Operator set the criteria for the rebuild:

- a clear path, with each step linked to the next;
- open, clear choices with their consequences stated;
- literature added on both sides where it had been left out;
- an opening questionnaire of 10 to 12 value questions, linked to the principles, pre-selected in each room, with tensions and support highlighted and a before/after comparison at the end;
- the overarching principle shared with Moral Topology: an intersubjective-plus-influence model can handle human moral conflicts, which does not disprove objectivity but aims to make it unnecessary.

## How the review findings were handled

Finding IDs refer to `_review/review_pass001_claude_20261028_1517Z.md` on the `review` branch.

| Finding | How edition 5 handles it |
|---|---|
| A-01 Failure conditions assume moral authority that doesn't come from the procedure | The thesis is now a claim that objective facts are *not needed*, not a claim about what constitutes morality. Room 05 is built on the exact problem (Scanlon's transmitter room plus a fair vote). It states openly that comparing complaints one person at a time may be an objective rule in disguise, and that if so, the claim narrows. A ledger answer of "needs" is treated as evidence against the claim, not as a mistake. |
| A-02 "Good" versus "owed" | The opening is about how we treat each other. The "good" semantics section is removed. |
| A-03 The taxonomy labelled the project's own view as realist | An objective moral fact is defined as holding regardless of what anyone *would agree to* even under ideal conditions. "Reasons between people" is defined as idealised, not as current agreement. |
| A-04 Parties who can't take part | Room 09 (non-identity problem, Parfit) and objection 7 address this directly and name it as the weakest point. |
| A-05 No argument favoured the thesis over its rival; Street was used only as a target | Room 01 stages Harman and Street against Sturgeon and Huemer. Street's dilemma is presented as counting against objectivism specifically, with the objectivist reply alongside. Korsgaard and Williams are added. |
| A-06 Two layers bundled together | The thesis is now explicitly about dispensability. First-order positions (desert, aggregation, autonomy) are kept as separate principles and choices. |
| A-07 Cases didn't tell the views apart | Each case has a "did you need an objective fact anywhere?" ledger question, plus pressures and reasons exhibits. The ozone room adds the non-identity problem. |
| A-08 Valid, true and authoritative used interchangeably | A glossary is added. Objection 10 states the revisionary consequence (Mackie, Joyce). |
| A-09 Personal judgment in the thesis | Moved to room 11, "The method can't decide for you". |
| A-10 Reciprocity was formal only | Room 02 grounds the argument in the victim, who cannot be given a reason he could accept, rather than in a formal swap test. The circularity objection is kept and answered. |
| A-11 A check read a conditional as categorical | All checks are rewritten. Each check now tests a direct pair of answers. |
| A-12 Route order | The positive account (the three ideas) comes first. The rooms then proceed job by job. |
| U-01 Flags predictable from cue words; no realist-side overreach | Nine flags in both directions. Several have no cue words. |
| U-02 Headings favoured the author | One kind and one heading for every serious position. |
| U-03 The main button skipped the exhibits | Walkthrough added: exhibits, then decisions. |
| U-04 Feedback below the fold | Feedback now scrolls into view. |
| U-05 Reading length and repeated notes | Argument in brief and a single bibliography added; collapsible sections fell from 830 to 167. The full reading edition is still long (about 20,000 visible words), because it includes every question and answer. |
| U-06 Internal jargon in public copy | Removed. |
| U-07 Hedging density | Concessions are collected into "For objectivity" and "Still open" exhibits and the room summary, instead of a caveat on every exhibit. |
| U-08 Copy mismatches | Fixed. |
| U-09 3D label collisions | Not addressed. The layout code is unchanged. |
| U-10 Values had no payoff; no persistence | Principles now drive the fit and tension notes and the comparison. Persistence is still deliberately absent; a test forbids persistent storage. |
| P-02 to P-06 Pairing | Not implemented. The influence half (pressures exhibits) and the shared vocabulary prepare for the pairing. See "Moral Topology" below. |

## Literature added

| Side | Works |
|---|---|
| Against needing objective facts | Harman 1977; Street 2006 (now used for, not only against); Mackie 1977; Blackburn 1998; Scanlon 1998 (transmitter room); Habermas 1990; Wong 2006; Williams 1981; Korsgaard 1996; Anderson 2016 |
| For objectivity | Sturgeon 1985; Huemer 2016; Parfit 2011; Enoch 2011 (fairness and deliberation arguments); Dworkin 1996; Cuneo 2007 |
| Puzzles for every view | Parfit 1984 (non-identity) |
| Pressures | Milgram 1963; Darley and Batson 1973; Pettigrew and Tropp 2006; Graham, Haidt and Nosek 2009 |

**Honesty about access.** Most of these were not re-read for this edition. Their source entries say so ("summary written from knowledge of the work; publication details checked 28 October 2026"). Three were checked against text in this pass:

- Anderson 2016: author manuscript, pp. 3 and 16–17. This is the source of the quotations "power makes people morally blind" and "we do not already possess an independent standard of moral rightness".
- Sturgeon 1985: via an MIT OpenCourseWare handout that quotes and paraphrases the essay.
- WMO 2022: executive summary highlights; the 2066, 2045 and 2040 projections.

Some links are library catalogue records rather than full texts, and each entry is labelled as such.

## What reviewers should press on

1. **Room 05 framing.** Does the exhibit state the strongest objectivist case fairly? Is the claim "plausible but not decisive" honest, or too generous to the exhibit's side?
2. **Principle links.** Each `fits` and `strains` link in `values.mjs` is an authored judgement. Check that no "pulls against" note fires where the two positions are actually compatible. The "covered does not contradict exists" rule is deliberate.
3. **The six checks.** Check that each is a genuine tension or contradiction, and that their spread across views is fair. Currently two test objectivism, one tests relativism, two test the reasons view, and one tests objective-fact skeptics.
4. **Summaries written from knowledge.** Verify the characterisations of Harman, Sturgeon, Huemer, Parfit, Williams, Korsgaard, Dworkin, Cuneo, Habermas, Wong, Blackburn and Mackie against the primary texts, especially Enoch's fairness argument and Parfit's normativity argument.
5. **Plain language.** Is every question understandable without the glossary? Do the "follows" lines describe real consequences?
6. **Tuskegee pressures exhibit.** Its analysis of pressures (authority, prejudice, distance, momentum) is labelled as the exhibit's own interpretation, not a sourced finding. Check that the label is adequate.
7. **The Laplace anecdote** in room 00 is hedged ("is said to have answered"). Decide whether to keep it.

## Moral Topology

The shared principle is now explicit. MORARG covers the *reasons* half; Moral Topology covers the *pressures* half. The pressures exhibits in rooms 03 and 07–09 name the kinds of forces Topology models (authority, conformity, scarcity, contact, distance), and room 03 refers to Topology by name as a demonstration, not as evidence. No technical link was built. The recommendation in `_review` (P-03) still stands: join the two at the factual assumptions behind MORARG's procedural safeguards ("pressure distorts judgment; protected dissent corrects it"), never at verdicts.

## Not done in this pass

- No deployment, register update or Moral Topology integration.
- No persistent storage.
- No change to the 3D scene layout (U-09).
- `ARGUMENT_MAP.json`, `AUTHORITY_ARGUMENT.md`, `ARGUMENT_CORPUS.md`, `PRIMARY_REVIEW.md` and the earlier reviews describe editions 1–4 and are retained as history.

## Verification

- `npm --prefix _application run build`: generated, with 70 runtime assets verified.
- `npm --prefix _application test`: 35 of 35 pass. The content-specific tests were rewritten: standpoints, branches and checks, and intake and principles. The engine, layout, export and browser-boundary tests are unchanged.
- `npm --prefix _application run build:rooms && npm --prefix _application run test:hosting`: 3 of 3 pass, after building the git-ignored `_hosting/dist`.
- Headless Chromium checks: a scripted full run through all 12 rooms in controls-only mode with an intake; desktop 1440×900 at the intake, walkthrough and decision feedback; a 390×844 phone at the reading top and the intake. Confirmed:
  - the expected principle notes appeared;
  - all five checks the scripted answers could reach fired, and the sixth, `vote-versus-the-excluded`, was covered by unit tests;
  - the ledger filled correctly;
  - the before/after comparison showed movement;
  - there were no page errors and no horizontal overflow at phone width.

  This is not a visitor study.

# Edition 5, revision 2: Astra's corrections and the is–ought room

Branch: `edition5-revision`, cut from `main` @ `32bf430`. Build 0.6.2, argument edition `morarg-argument-5.2`. Not deployed: public MORARG stays 0.5.1. Written by Claude at the Operator's request, 28 October 2026.

The Operator asked for three things:

1. assess Astra's pass002 review, make the corrections I agree with and push back on the rest;
2. add a room on the is–ought problem;
3. assess Moral Topology v2 and how to integrate it.

The point-by-point response to Astra is on the `review` branch (`_review/response_pass002_claude_20261028_2130Z.md`). The Topology assessment is `TOPOLOGY_V2_ASSESSMENT.md`. The current contract is `ARGUMENT_STRUCTURE.md`.

## What changed

| Area | Change | Finding |
|---|---|---|
| Thesis scope | Stated once, exactly: we never need to *rely* on objective facts to explain, justify, protect or reason. Existence is not denied. A realist-contractualist countermodel is stated in the opening. The argument against the extra layer is given as a parsimony argument (it does no work), not a proof. Jobs are tagged by kind. | A-13 (partly accepted; see pushback) |
| Enoch | Rewritten from the checked preview (ch. 2 §2.1, pp. 17–18). Enoch's point is that preference clashes call for impartial compromise, while in moral disputes standing firm is appropriate; non-objectivist views seem to treat moral disputes like preference clashes. The reply engages that point directly. Joyce's manuscript reply is added, separating normative from moral truths. | A-14 |
| Room 06 (fair agreement) | A separate exhibit on the vote says what the vote shows (participation is not justification). "Compare complaints one at a time" and "don't add up small gains against one person's agony" are stated as commitments to defend, not derived from a role swap. | A-15 |
| Room 10 (ozone) | A small two-plan, identity-changing hypothetical. "Better for this person" is kept separate from "better lives for whoever exists". Choices: a non-comparative threshold, objective badness, impersonal concern, unsure. "Sidesteps" and "handles neatly" are removed. Animals are separated from non-identity. | A-16 |
| Checks | `unknowable-but-findable` and `covered-then-needed` are removed. `agreement-makes-right` now fires only when the visitor says slavery would be wrong even under *universal* acceptance (new follow-up, `society-adaptive`). All checks are labelled tension or contradiction. A new `promise-and-gap` check is added. | A-17 |
| Sources | Street: reflective scrutiny, not interpersonal justification; the "lucky accident" label is relabelled. Anderson: an epistemic point, with the locators corrected to p. 1, p. 3 and pp. 15–16. Scanlon: a realist about reasons, and the adaptation is labelled. Harman and Sturgeon: the restatement reply is framed as disputed. | A-18 |
| Influences | "Pressures" is replaced by **influences**: some carry reasons, some only push, and the same event can do both. The room 04 town has three events: a false story, an employer closing (fewer real options) and meeting the families (testimony). The Tuskegee mechanisms are given as hypotheses. | A-19 |
| Feedback | `start-neighbours/no-answer` is scoped to this case. `prison-victim` choices are reworded (the victim's voice counts, not decides). `taste-same/same` is unflagged. `objections-if/drop` no longer says "objectivism wins". `final-change` offers evidence that would move the visitor in either direction (towards objectivism or towards the exhibit's claim), plus "nothing I can think of". | A-20 |
| Ledger | `ledgerOutcome` reports `open`, `narrower`, `covered` (only if every job is covered) or `unsettled` (names partly/unsure jobs; the claim is "not established" for them). The ledger shows each job's kind. | U-11 |
| Intake principles | Each intake principle's sentence is the statement answered, or its plain negation, and nothing stronger. | U-12 |
| Principle links | Every link is audited for modal strength, quantifier and scope. Several are removed, including after this pass's own browser check: `p-gut-check` no longer strains `start-cat/fact` or `limit-why/feeling` ("can't *usually* trust" admits exceptions). Counterexample tests are added. | U-13 |
| Hall walkthrough | The main button opens the first unread objection. | U-03 |
| Topology mention | A *Model* badge; the exhibit says its numbers are authored assumptions and that a meeting in the model is not evidence of agreement. | P-09 |
| Laplace anecdote | Removed. | press-point 7 |
| Diagram renderer | Two-line board labels no longer overlap their details. This bug predates the revision and showed on the hub board. | (found in this pass) |
| Room references | Copy names rooms instead of numbering them, because numbering shifted with the new room. | (maintenance) |

## The is–ought room (02, `isought`)

**Placement.** Between "Where do moral feelings come from?" and "Is it just opinion, then?". Room 01 ends with "explaining a feeling doesn't show it is right". The is–ought gap is the general form of that point, and room 03 opens with tastes, which the gap room's last decision leads into.

**Level.** Written for a well-read teenager:

- every exhibit starts from something familiar (the doctor and smoking, "it's natural", "everyone does it", "it's legal", crime data, a bail algorithm, a promise);
- the logic is stated once, plainly;
- the "trick exceptions" footnote (Prior) is there for anyone who knows logic.

**The Operator's quote, and where the room goes beyond it.** The quote's first half is right: no description of reality contains instructions for what we should do, so a value has to be brought in. The second half ("needing a human mind is the exact exclusion that negates the possibility of objectivity") does not follow as stated, and the room says why.

- "Needs a mind" can mean that a mind must *apply* a value. That is true of arithmetic too, and arithmetic is objective. Or it can mean that the value's *truth* depends on minds, which is the point in dispute and needs its own argument.
- Moore, Parfit and Enoch accept the gap completely. They take moral facts to be a non-natural kind of fact, which is exactly why no description of the world contains them.

So the decision `gap-mind/follows` is flagged as a step that doesn't follow.

This makes the exhibit stronger, not weaker. The gap rules out every *naturalistic* route to objective morality: reading it off nature, evolution, law, majority opinion or data. That leaves objectivists one route: non-natural facts that no description contains. The rest of the exhibit then asks whether anything in our practice ever needs to rely on such facts. The gap plus dispensability supports the thesis; the gap alone does not refute objectivity. Saying so is what lets a careful visitor trust the rest.

**Content:**

- five exhibits: Hume's surprise; Spot the hidden premise; Attempts to build a bridge (Searle, Foot, Putnam); Where each bridge needs a hidden plank (Hare and others); What the gap shows, and what it doesn't;
- four decisions plus ledger job J2;
- one new intake question (`i-facts`) with its two principles, plus a method principle ("Find the hidden premise");
- a new diagram board;
- sources: Hume (T 3.1.1.27, re-read at Hume Texts Online), Moore 1903, Searle 1964, Foot 2001, Putnam 2002, plus Parfit, Enoch and Mackie.

## Pushback (summary; details in the review-branch response)

- **A-13, scope.** Astra recommends epistemic/practical independence. A realist already accepts that, so as a thesis it would make the exhibit uncontroversial and idle. The Operator chose dispensability. That is a legitimate thesis *if* it is stated precisely and its argument is given, so I kept it, stated it precisely, gave the parsimony argument, and stated the realist countermodel. Astra is right that the edition 5 copy slid between the two claims; that slide is fixed.
- **A-17, `agreement-makes-right`.** I agree the original pair was not a contradiction. I did not delete the check: I repaired it with a follow-up that makes acceptance genuinely universal, because the relativist position does face that question.
- **U-12, the attribution problem.** I accept it. The fix is exact wording rather than a confirmation step, which would add a click to every principle without changing what is attributed.

## Verification

- `npm --prefix _application run build`: 71 local assets verified.
- `npm --prefix _application test`: 39 of 39 pass. New tests cover:
  - all four ledger outcomes (all covered, all partly, all unsure, mixed, and one job that needs objective facts), plus job kinds;
  - intake principles equalling the statement or its negation;
  - strict-link counterexamples (conditional truth-independence, universal versus partial acceptance, probabilistic rule plus exception, "can" versus "this case");
  - the repaired check firing only on universal acceptance;
  - the removal of the two unsound checks;
  - the is–ought flags.
- `npm --prefix _application run build:rooms && npm --prefix _application run test:hosting`: 4 of 4 pass. Rooms still preserves public MORARG 0.5.1.
- Headless Chromium (controls-only view, 1440×900):
  - a scripted run through all 13 rooms with an intake. All four checks the scripted answers could reach fired (the fifth, `vote-versus-the-excluded`, is covered by unit tests), the ledger showed the faithful "narrower" outcome, and the before/after comparison rendered.
  - The hall's main button opens objection 1; the Topology link renders.
  - Board SVGs inspected.
  - Phone at 390×844: no horizontal overflow, no page errors.
  - This is not a visitor study.

## Not done

No deployment. No change to Topology. No register update: the SocialTools register lives on the Operator's machine. The 3D layout collisions (U-09) and persistence are unchanged. Of the remembered literature summaries, only Enoch, Joyce, Anderson, Street, Scanlon (lectures/abstract) and Hume were checked against text in this pass.

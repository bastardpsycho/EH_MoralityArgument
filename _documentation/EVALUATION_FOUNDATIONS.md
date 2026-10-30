# What even is right and wrong? (room 01, `evaluation`)

Rewritten by Claude at the Operator's request, 30 October 2026, for argument edition 5.4 (build 0.7.1). It replaces the pass018 version written by Codex, which remains in Git history at commit `9d6e181`.

## What the Operator asked for

A consumer-friendly, layman-friendly room that demonstrates a fundamental difficulty with assessing a moral action or decision as right or wrong, good or bad, *even if* we accept a universal fact about morality.

## Why the pass018 room was rewritten

The pass018 room mostly asked a different question: what words like "good" mean, and where the yardstick for a verdict comes from. It was careful and well sourced. But its central exhibits turned on terms such as "response-dependent truth", "conditional verdict" and "epistemic uncertainty", and a visitor could finish it without seeing why judging an actual act is hard. It also did not take the step the brief asked for: grant a universal moral fact, then show what is still left to decide.

These pieces were kept or adapted:
- the pry-bar case ("perfect rulebook, imperfect case file"), which was already exactly this point;
- the honest framing that difficulty does not refute realism;
- the narrow, valid inference flags;
- Ross as an objectivist who accepts that duties must be weighed.

The picnic, bus-route, "good at what?", yardstick and calculation exhibits, and their sources (Geach, Hume's *Enquiry*, Finlay), were dropped. They answer the semantic question, not this one.

## The room's argument

**Granted for the whole room:** two universal moral facts. Rule 1: lying is wrong. Rule 2: letting an innocent person come to serious harm, when you could easily prevent it, is wrong.

**Shown:** to get from those facts to "that act was wrong", someone still has to do six things. Each is a judgment the facts do not supply, and honest, well-informed people make it differently.

| Step | Everyday case | Source |
|---|---|---|
| Name the act | Is a surprise party a lie? A poker bluff? "I'm fine"? Distinguish what counts as a false declaration from Constant's question of who is owed the truth; the everyday readings are authored examples. | Kant 1797, quoting Constant |
| Weigh colliding rules | The man with a knife at the door: Kant (never lie), Constant (the duty is owed only to those with a right to the truth), Ross (weigh; "the decision rests with perception") | Kant 1797; Ross 1930 |
| Find out the facts | The pry bar and the stranger under the gate. The rule is complete; the facts are not. | Ross 1930 (broken engagement to prevent an accident) |
| Act, person or outcome | Two equally careless drivers, one of whom hits a child; Kant's own case of a lie that accidentally sends the murderer to the friend | Nagel 1979; Kant 1797 |
| When to stop counting | The old man at the frontier whose horse ran away; a drug that works for five years before a side effect appears | Huainanzi ch. 18 |
| Where the line falls | A white lie, a padded CV, a false alibi; a broken arm versus a missed bus; the heap of sand | (no source needed) |

Constant's own remark, as Kant quotes it, states the thesis: when a true principle seems inapplicable, "it is because we do not know the middle principle" that shows how it applies.

**Not shown, and the room says so twice:** that there are no moral facts. Hard to apply is not false. An objectivist can reply that there are objective facts about descriptions, weights and lines too. That is coherent, and Ross believed something like it. But nobody is handed those facts, so in practice we still decide by giving each other reasons. That leads into the rest of the exhibit, which asks whether, once we do that judging anyway, we need the objective facts at all.

## Decisions

There are six decisions. None is a ledger job, and none feeds a consistency check.

| Step | Serious positions (never flagged) | Flagged as not following |
|---|---|---|
| `eval-party` | wrong but small (Kant); not a lie (consent); outweighed (Ross); the rule must settle it | — |
| `eval-door` | lie; tell the truth (Kant); dodge; an objective ranking exists | "they clash, so one is false" (needs a further premise that many objectivists deny) |
| `eval-gate` | find out; state the conditional | possibility treated as proof; not knowing treated as "no" |
| `eval-drivers` | the first did worse; neither did; separate verdicts | inferring the worse person from the outcome |
| `eval-drug` | judged at the time; judged by results; two verdicts | "consequences never end, so no verdict is possible" |
| `eval-so-what` | yes with enough facts; it narrows the argument; "what work are the facts doing?" | "hard to apply, so there are no moral facts" |

The last flag guards against the anti-realist overreach the room could otherwise invite.

## Principles

There are three optional principles, not linked to the intake. Each link is strict:
- **Name it carefully** fits `eval-party/not-a-lie`.
- **Act, person, outcome** fits the separating answers and strains the answers that read one verdict off another.
- **Check the case file** fits finding out and stating the conditional, and strains the two knowledge errors.

## Sources and how they were checked

- **Kant, "On a Supposed Right to Tell Lies from Benevolent Motives" (1797)**, Abbott translation. Read in full for this edition. It includes Constant's passages as Kant quotes them. Some scholars read Kant more narrowly than the usual strict reading reported here.
- **Ross, *The Right and the Good* (1930), chapter II**, public transcription. The prima facie duty, broken engagement and conflict passages were read, including "the decision rests with perception" and "highly fallible, but it is the only guide we have to our duty". Print page numbers were not checked.
- **Nagel, "Moral Luck" (1979)**. Not re-read. The summary was checked against a university course summary quoting pp. 28–29. The two-driver version is the exhibit's own, and the source entry says so.
- **The Huainanzi, ch. 18** (Major, Queen, Meyer and Roth translation, 2010, pp. 728–729). Checked against a published retelling citing that translation, not the translation itself. The source entry says so, and links the publisher's catalogue page.

## Integration (unchanged from pass018)

- Room id `evaluation`, number 01, between `hub` and `fairness`.
- The palette, wall slot and four-card diagram renderer are kept. The board text now reads "A true rule meets a real case": name it, weigh it, find out, judge what?
- Eleven ledger jobs are unchanged.
- The static reader carries the same exhibits, decisions and sources.

Pass019 release correction: checked the cited Abbott translation directly. Constant limits the duty of truthfulness rather than redefining lying; the everyday-case readings are not attributed as Kant’s or Constant’s own verdicts.

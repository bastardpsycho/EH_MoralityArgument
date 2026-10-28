# Independent counterpoint review — pass001 baseline and pass002 second read

`ts_ms=1793120064000`  
**Status:** Baseline review only. The Astra rewrite was not available at this review point; I will inspect it separately when the lead supplies it.  
**Scope:** `_documentation/ARGUMENT_CORPUS.md` and `_application/data.mjs`, read alongside `project.md` and the MORARG register state. This is a philosophical/content critique, not an app or implementation review.

## Assessment

The corpus is careful about the distinction between social explanation, normative justification, and metaethics. It names the procedure’s authority problem and the values it assumes. That is a strong foundation. The current visitor questions do not yet turn that foundation into a persuasive, fair argument: most choices test an easy inference error, while the serious alternatives get brief labels. The questions also lack a sustained case in which visitors can see the competing values and test how their own judgment changes as the facts or procedure change.

The thesis that moral practice is intersubjective while individuals make decisions is compatible with moral realism. A realist can agree that people learn standards socially, deliberate with others, and need public procedures to correct bias, while holding that moral truths do not depend on the procedure’s acceptance. The exhibit should present intersubjective justification as a substantive account with reasons in its favor, then make clear what that account establishes and what remains open about truthmakers and authority.

## A realist’s strongest case

A naturalist realist need not posit supernatural commands or claim that existing consensus is always right. Peter Railton’s account connects value and rightness to natural facts about people and their interests; he treats moral inquiry as continuous with empirical inquiry, allows moral properties to be relational, and says current moralities can be wrong. On this view, social discussion is one way of finding out about human needs, consequences, and mistaken standards. A community’s dissenters can be right because its current practice fails to track the relevant facts. See Railton’s primary article, [“Moral Realism” (1986)](https://www.filosoficas.unam.mx/docs/1110/files/Railton%20Moral%20realism.pdf).

A robust realist presses a different point: moral deliberation seems to presuppose that some considerations really count in favor of action, even when an agent does not want them to. David Enoch’s positive case for robust realism appeals to this deliberative indispensability and to the thought that objectivity best explains why morality deserves to be taken seriously. A constructivist cannot answer that simply by pointing to successful coordination; the realist can treat a fair procedure as a tool for discovering reasons or as a good political practice. See Enoch’s primary book, [*Taking Morality Seriously*](https://academic.oup.com/book/26213).

The strongest pressure test is therefore not “Can a whole society be wrong?” Both a realist and a well-developed constructivist can answer yes. It is: **does fair public justification discover independent reasons, constitute justified standards, or help people coordinate without deciding the metaphysics?** Practical justification does not by itself refute realism.

The intersubjective case can still be made persuasively. Rules govern people and distribute burdens; a rule’s authority is suspect when it cannot answer the people it constrains, especially when they were excluded or coerced. A procedure that gives affected people standing, checks facts and unequal burdens, permits dissent, and remains revisable can offer a non-majoritarian account of justified standards while preserving each person’s role in judgment. But standing, reciprocity, and the relevance of burdens are normative commitments, not neutral facts. Scanlon’s own reasonable-rejection discussion recognizes that the test does not begin from a morally empty foundation: it holds a background of claims in place while examining a principle and rejects the idea that one supposedly neutral measure settles every case. [Scanlon, *What We Owe to Each Other*, chapter 6 excerpt](https://e-edu.nbu.bg/pluginfile.php/314832/mod_resource/content/0/scanlon_6.pdf).

## Concrete weaknesses in the baseline

1. **The objectivity item leads the visitor.** `definition-objective` (lines 97–100) asks whether rejecting stance-independent facts rejects *every* sense of objectivity. The “yes” option says “objective has only one possible meaning,” then receives an unsupported-inference flag. A visitor may instead mean that *the relevant philosophical use* of “objective” is stance-independence. That is a defensible stipulation, not a refusal to acknowledge dictionary senses. The item should ask which claim is under discussion and make no sense of the word do argumentative work by itself.

2. **The strong realist case is named but not argued.** `realism-origins` (lines 105–108) correctly says origins alone do not refute realism, but its flagged response—“Evolution produced intuitions, so realism is refuted”—is a genetic-fallacy caricature. Street’s Darwinian dilemma is more demanding: evolutionary forces shaped evaluative attitudes, so the realist must explain how those influences relate to independent evaluative truths and why the resulting beliefs are reliable. A realist can challenge Street’s explanatory premises or offer a naturalist account; the exhibit should put those moves beside the challenge. See Street’s primary article, [“A Darwinian Dilemma for Realist Theories of Value” (2006)](https://sites.pitt.edu/~mthompso/readings/street.pdf), and Railton above.

3. **The individualist conflict item misstates the rival.** `individual-conflict` (lines 109–112) tests whether a person’s feeling makes a demand bind *everyone*. An informed subjectivist or relativist need not make that universal claim; the person may hold that verdicts are true relative to an agent or framework. The serious issue is whether parties with incompatible standards can criticize one another or justify a rule for joint life. Ask that question directly instead of attributing universal authority to private approval.

4. **Several distractors are too easy, and this creates a response asymmetry.** Examples include “any consensus is automatically justified,” “newer norms are necessarily better,” and “successful coordination disproves realism” (lines 117–120, 129–132, 161–164). These are cleanly rejectable claims, but they do little to test an informed visitor. Serious alternatives such as realism and personal subjectivism appear as short `contested` options, while weak formulations of the opposing views receive inference flags and an exit warning. The app says flags assess claims rather than people; the repeated pattern can still make the preferred route feel like the one unflagged answer. Retain flags only for a clearly stated invalid inference, and give real alternatives comparable space and charitable feedback.

5. **Coordination and metaphysics are distinguished, but the test is too obvious.** The current “Does successful shared coordination disprove realism?” item has an unmistakable answer, and the `realist` option already concedes that coordination does not settle metaphysics. Replace it with a scenario in which the same fair procedure can be read in rival ways: realist as inquiry into independent reasons, constructivist as part of what constitutes justified standards, and error theorist as practically useful without objective moral truth. Ask what additional argument would distinguish those readings.

6. **The practical objection about killing is missing.** The baseline correctly separates error theory, expressivism, subjectivism, and constructivism, but it never directly preempts the common inference “if no objective morality, killing is not bad / everything is just preference.” State that this is not one inference but a conflation of distinct views. Denying stance-independent truth does not by itself entail that all preferences have equal authority, that no intersubjective standards exist, or that no one has reasons to oppose killing. At the same time, do not claim that a constructivist’s condemnation proves mind-independent wrongness. An error theorist specifically may deny categorical moral facts while retaining prudential, legal, emotional, or social reasons to oppose the act.

7. **There is no sustained case study or visible three-value structure.** The room exhibits mostly explain abstractions; the only examples are analogies such as language and promises. No case is carried through realism, social construction, personal agency, research, and public justification. The visitor therefore cannot see how the three levels affect a concrete decision or how an individual retains responsibility within a shared procedure. In every case-study room, name exactly three live values, give each a plausible advocate, state relevant uncertainty, and avoid building in a single obvious answer.

## Replacement wording and pressure tests

**Objectivity prompt:**

> People use “objective” in several ways. Which claim do you mean here?
>
> - A moral claim’s truth is not made true or false by anyone’s endorsement or disapproval; it may still depend on facts about sentient beings, such as their pain, needs, agency, or relationships.
> - People can test a claim against evidence, consistency, and reasons that others can inspect.
> - A rule is justified only if it can be defended through a fair process that gives affected people standing.
> - These claims can come apart; I need the distinction before choosing.

Feedback should say that these are different dimensions, not grade one as the only legitimate meaning. “Stance-independent” here means the truth is not constituted by anyone’s endorsement; it does not mean that moral facts must remain if no sentient beings or experiences existed. A Railton-style realist may endorse public evidence and fair procedure while retaining stance-independent truth grounded in natural facts about people and their interests. A constructivist may defend procedural objectivity while leaving stance-independence open. The exhibit should then state which sense it is defending.

**Anti-realism / “everything is preference” prompt:**

> Suppose someone denies that moral truths are independent of every human perspective. Consider a familiar case: a person deliberately kills an innocent, non-threatening stranger to avoid a minor inconvenience. Does the metaethical denial alone show that the victim’s interests count no more than the killer’s convenience, or that the act is no worse than any alternative?
>
> - Yes; without independent moral facts, every preference has equal standing.
> - No; that conclusion does not follow. An intersubjective account can condemn the act by reasons about severe harm, agency, and equal standing, while still needing to defend those premises.
> - A realist can agree the act is wrong and say its wrongness does not depend on anyone’s approval.
> - An error theorist can deny categorical moral truth while opposing the act on prudential, legal, emotional, or social grounds.

Feedback should distinguish the views rather than report a single verdict: the first answer conflates anti-realism with preference equality; the second is the project’s conditional argument; the third is realism; the fourth is error theory. Anti-realism is a metaethical position, not a practical attitude of indifference: an anti-realist may be strongly committed to condemning the act, while an amoralist is indifferent to or dismissive of moral demands and could hold any metaethical theory. Do not imply that practical opposition is the same as categorical moral wrongness.

**Case-study prompt for a recurring room sequence:**

> A floodplain town can fund one of two protection plans. One plan lowers the expected danger across more households but shifts substantial risk onto a smaller downstream group. The other prevents the downstream group’s worst danger but leaves more households exposed to less severe losses and costs more. Forecasts are uncertain, the affected residents disagree, and the group bearing the concentrated risk had little say in earlier planning. No plan avoids every burden.

Use the same facts as the visitor moves through different questions. Put three live values in view in each case room: (1) preventing serious harm, (2) distributing risk fairly and giving each affected group standing, and (3) respecting residents’ agency and attachment to place. Ask which reason the visitor gives priority and what factual change or objection would make them revise it. Do not count a value as decisive merely because the author favors it.

**Procedure-versus-truth prompt:**

> Imagine the town reaches a stable rule after an informed, non-coercive process. What does that success show?
>
> - It may show that the process produced a defensible public rule.
> - It may support a realist’s claim that the process helped identify independent reasons.
> - A constructivist may argue that the constrained procedure helps constitute what is justified.
> - By itself it does not decide which metaethical explanation is true.

This prompt tests the project’s scope rather than rewarding visitors for spotting an obvious invalid inference. A follow-up should ask what justifies the process’s own requirements—standing, reciprocity, and protection against coercion—especially to a dissenter who rejects them.

**Dissent / relativism prompt:**

> Two residents endorse incompatible standards for the same rule. One says her verdict is true relative to her informed commitments; the other denies that those commitments settle what they owe each other. What does their disagreement alone establish?
>
> - Nothing yet about which standard is true or whether the parties owe one another a shared rule.
> - It may expose a need for a further account of truth, authority, or joint justification.
> - A realist can say both positions answer to independent reasons, even if the parties do not agree.

Do not flag a person for choosing a relativist or realist option. If the visitor asserts that private approval automatically binds everyone, flag that inference specifically and explain the missing bridge.

## Pressure tests for the finished argument

- **Reform against unanimous custom:** Can the project say a unanimous town is wrong when its rule excludes one group, without simply declaring equal standing true by definition? Show the proposed grounds and let the realist explain why they think the same case calls for independent moral facts.
- **Dissenter who rejects reciprocity:** Is the rule justified to that person, merely justifiable to others under the procedure, or binding regardless of their acceptance? Distinguish these claims and acknowledge any remaining authority gap.
- **Practical success:** Would the procedure still be valuable if moral realism were true? If yes, explain why public justification supports the thesis without serving as a proof against realism.
- **No convergence:** If informed and fair participants reasonably disagree, show what provisional action the framework licenses and who bears the burden of that decision.
- **Agency:** Who makes the final decision, what constraints shape their choice, and which facts or objections can make them revise it? Do not let “the community decided” erase individual responsibility or structural power.

## Source and access note

I read Railton’s primary article text and selected the argument structure and abstract of Enoch’s primary book from the publisher page. I reviewed the relevant six-page excerpt of Scanlon’s chapter 6. Street’s full article was not rendered in the browser because the PDF exceeded the tool limit; the introduction and abstract were available in search output. These sources support a fair challenge, not a claim that realism or constructivism has won.

## Pass002 second read of Astra’s rewritten data

`ts_ms=1793120287000`  
**Status:** I read the rewritten `_application/data.mjs` (33 steps, four choices each) while the lead was still preparing source and value materials. These findings describe that data draft and may need a quick reconciliation against the incoming materials and any Astra fixes. I did not edit application files.

The rewrite makes a substantial improvement. `objective-senses`, `objective-target`, and `objective-bridge` now distinguish empirical consequences, public testing, and truth independent of endorsement. The text explicitly allows a realist to ground truths in facts about human interests and says realism need not imagine morality without humans. The killing sequence makes the ordinary case concrete and directly blocks the inference from anti-realism to indifference: `killing-reasons`, `killing-nihilism`, `killing-no-reasons`, and `killing-refuser` explain the stakes, distinguish error theory from practical indifference, and leave the authority problem open. The realist receives naturalist and irreducible-reasons arguments, replies to evolutionary debunking, and a final option to retain realism. The ten flags I inspected target specific factual errors or invalid inferences; they do not penalize a visitor merely for choosing realism, skepticism, or another disputed position.

Three remaining changes would materially strengthen the case.

1. **`prison-victim` overstates the cited study.** The prompt says “evidence suggests no extra protection from the additional hardship,” then asks whether a victim’s request for a harsher penalty should prevail. But the room’s own `prison-limits` exhibit says the Norway study does not tell us the effect of an additional year. Bhuller et al.’s published study uses a random-judge design to estimate the effect of incarceration for defendants whose treatment changes with judge stringency; it does not estimate the marginal effect of a longer sentence in this hypothetical case. The prompt can preserve its values conflict by marking the premise as a separate stipulation: “Suppose separate, case-specific evidence—not the Norway study—suggests that a longer sentence here would not reduce future harm. A victim still wants a harsher penalty. What should follow?” Remove `bhuller-2020` from this question’s evidence attribution unless the question explicitly says the study does not establish that premise. See the [published study](https://www.journals.uchicago.edu/doi/10.1086/705330).

2. **The positive case still risks reading as a useful method rather than the constitutive account the project wants to defend.** `reciprocity-case` and `reciprocity-ground` start the right argument: a demand to govern another person needs reasons the burdened person can assess; agency and error-correction matter; mutual advantage alone can exclude the powerless. But other central statements call the proposal a “method,” “practice,” or “framework,” and `objective-proposal` says it defends public justification without stating that justification constitutes moral validity. Add one clear thesis and then defend its starting conditions: “Here is the account we are arguing for, not just a decision method: a rule governing people is morally justified when its principle can be justified to each affected person as an equal, using accurate evidence and without coercion. Actual approval is neither necessary nor sufficient. Interests, harms and agency are inputs to that justification; they do not make a rule right merely because someone prefers it. We defend equal standing because a demand that one person accept burdens while another claims an unexplained exemption cannot be justified reciprocally. This premise remains open to challenge.” Then retain the distinction that a realist may interpret the same inquiry as discovery: the cases illustrate the proposed account; they do not prove its metaethics. The text should continue to expose the circularity and authority objections rather than treating the new thesis as settled by definition.

3. **`realist-reasons` labels Scanlon too simply.** It opens with “A different realist says” and then groups Scanlon with Enoch. Scanlon’s 2014 book defends a qualified cognitivist view of irreducible normative truths and rejects construction, but his view’s classification and account of mind-dependence are nuanced. Enoch is the clearer explicit robust-realist example. A more exact replacement is: “One view affirms irreducible normative truths. Scanlon defends normative cognitivism about reasons and argues that such truths are not constructed; Enoch offers an explicit robust-realist case that deliberation is best explained by objective normativity.” See the [Oxford University Press description of Scanlon’s book](https://academic.oup.com/book/6445).

The three case choices are relevant but run in a direction favorable to the proposal: Tuskegee shows institutional approval can fail; the Norway study complicates simple punishment claims; the Montreal Protocol supplies an example of coordinated policy with observable benefits. Their limit notes help. Keep the cases framed as tests of justification, not evidence that moral truth is constituted by procedure. Also, the current Tuskegee `caseStudy.alternatives` has only two routes—participation with safeguards or lower-risk redesign—while the surrounding `consent-foundation` step gives agency, harm, and fair distribution as three distinct live values. If the companion values material does not already show all three within that case room, add a third plausible route, such as pausing the study unless fair selection and access to alternatives can be secured. The prison and ozone case schemas already give three alternatives each.

One minor wording refinement would help visitors keep the objectivity senses apart: rename “Three different claims” in `objective-senses` to “Three questions people call objective,” and say that effects independent of wishes are an empirical question, public testability is a method question, and endorsement-independent truth is a truthmaker question. The current version already avoids the central caricature by clarifying that endorsement independence does not mean independence from the existence or interests of sentient beings.

The flag check found no additional case of a sound realist or anti-realist position being marked wrong. The strongest surviving issue is the prison prompt’s unsupported marginal-effect premise; the strongest argument-design issue is making the intended constitutive thesis explicit rather than allowing the visitor to infer only a practical procedure.

## Verification after Astra’s targeted revisions

`ts_ms=1793120564000`  
**Status:** I checked the later pass002 data and values after the argument lead applied the requested fixes. The earlier findings above are retained as a record of the review state; this addendum records which ones are resolved in the current draft.

The current thesis and opening now explicitly say that standards’ validity is constituted by what can be justified to affected people. `objective-proposal` names reciprocal, informed and unforced consideration, separates this from actual approval, and openly states the normative starting points. `objective-test`, `reciprocity-case`, and `reciprocity-ground` give a positive argument from interpersonal claims, agency, error correction, and the failure of mutual advantage to protect the powerless. The conclusion states the sufficiency premise and admits that a realist may reject it. This now defends the intended constitutive account rather than leaving the whole experience reducible to a practical method; the cases remain illustrations of the account, not evidence that proves its metaethics.

The prison-victim question now calls its marginal-effect premise a separate local hypothetical and no longer attributes that claim to Bhuller et al. The Scanlon passage now distinguishes his qualified normative cognitivism from Enoch’s explicit robust realism. The Tuskegee history states that effective treatment became available before it was withheld. `values.mjs` now contains exactly three values for every room, including each of the three case-study rooms; the earlier concern that the requested three-value structure was missing is withdrawn. Tuskegee’s case-study decision schema itself still offers two alternatives, but its three-value set and the surrounding four-choice questions supply a broader test, so a third alternative is optional unless the interface presents those two as exhaustive.

## Final second read: evolved fairness room

`ts_ms=1793120813000`  
**Status:** I inspected `_application/fairness.mjs` and `_documentation/EVOLVED_FAIRNESS_RESEARCH.md` after the parent integrated the room. I made no application changes. The core argument and evidence are well-scoped. Astra applied the source-specificity and study-design wording refinements I sent during review.

The room is a fair addition. `fairness-original` reports the 2003 observation without equating refusal with a justice concept. `fairness-contested` presents the 2024 pooled null and later positive/context-dependent results together. Three evidence statements appear on `fairnessSteps[1]` before the mixed-results choice, so visitors see the disagreement before they interpret it. The `fairness-bridge` and `fairness-authority` content correctly separates observable behavior, a proposed psychological precursor, a normative rule, and moral authority. It explicitly rejects both the inference “evolved, therefore right” and the genetic-fallacy reverse (“evolved, therefore false”). The research note discloses what was not read in full and cautions against generalizing beyond the tested tasks.

The 2024 meta-analysis is described with the right limit: it concerns available accept/reject data rather than every possible animal response. The [primary article](https://doi.org/10.1098/rspb.2024.1452) obtained data for 23 of 30 eligible studies; the source note records that limitation. Its disappointment model also found a significant rise in refusals when higher-value food was presented, including when it was not given to the partner. Stating this alongside the null inequity result would make the contrast explanation an observed result, not only a possible alternative. The [2025 capuchin study](https://doi.org/10.1016/j.anbehav.2025.123257), [2026 chimpanzee group study](https://pubmed.ncbi.nlm.nih.gov/42156064/), and [September 2026 four-species study](https://pubmed.ncbi.nlm.nih.gov/42709475/) are accurately treated as distinct designs with context-specific results. Astra also added the positive studies to `fairness-bridge`’s sources.

One final copy edit: `fairness-mixed` now accurately describes the 25%/50% design, but “later group tasks and tasks where inequity occurred…” repeats “tasks.” “Later group-context studies and a study varying how often inequity occurred” would read more cleanly.

The constitutive thesis is now explicit in the main data and carried into this room: animal responses may illuminate capacities relevant to moral practice, but they do not determine the content or authority of standards. This is a useful compatibility point for the defended account, not empirical proof of its metaethics.

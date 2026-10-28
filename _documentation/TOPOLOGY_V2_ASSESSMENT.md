# Moral Topology v2: assessment against the brief, and how to integrate it with MORARG

Written by Claude at the Operator's request, 28 October 2026. Target: `_partners/MoralTopology/_application_v2` (model 2.0.0) as merged on `main`, published at `rooms.engineeringhumanity.org/morality/topology/`. I read `README.md`, `_documentation/ASTRA_DESIGN.md`, `model.mjs`, `cases.mjs` and the relevant parts of `app.mjs`, and I ran the case data through Node (below). I did not run a visitor study or open the live site. No Topology files were changed.

## Short answer

The build meets the **letter** of the brief: five fictional case pairs; three influences each; contrasting starting octants; a constructed meeting for every pair; one control set per person plus a global control; a static Cloudflare build at the requested path; a small link from the MORARG splash page; and the full interactive version in the repo. It is careful and honest: it says plainly that meetings are constructed and that a meeting is not agreement.

It misses the **point** of the brief in one critical respect. The brief's purpose (the Operator's overarching principle) is to demonstrate that an intersubjective-plus-influence model can handle moral conflict. As built, the model cannot demonstrate that, for two structural reasons:

1. **The global influence cannot bring people together.** It moves both people by the same vector (`A = A0 + 50a + 25g`, `B = B0 + 50b + 25g`), so the gap `A − B` does not depend on `g` at all. Astra's design document states this openly ("Do not describe this equal translation as bringing people closer"). The consequence is that the one control that represents *social* influence has, by construction, nothing to do with convergence. In the model, shared circumstances can never reconcile anyone.
2. **Influences have no direction of their own, so every meeting is trivial.** Each person's influence is three free sliders (x, y, z), each running from −1 to +1. The influence's title ("Conversation with Elise", "Repair planning") does not fix which way it pushes. Any two points can be made to meet by pushing each towards the other, and that is exactly what every authored meeting does. I checked all five: in every case the witness is `a = (B0 − A0)/100`, `b = −a` and `g = [0.2, −0.2, 0.2]`. In other words, both people move halfway to the midpoint along the line between them, and the global vector is identical in all five cases and plays no part. The chart therefore demonstrates vector addition, not anything about influences.

A third point is a known limit rather than a defect, but it matters for integration. The three axes (personal agency, preventing harm, shared responsibility) do not contain the issue each dispute actually turns on: the moral status of the fetus, desert, or how much risk of coerced death is acceptable. The case notes admit this ("Matching all three displayed coordinates has not resolved Mara's view of fetal moral status"). So a visual "intersection" shows agreement on three generic weights, while the disagreement that matters stays off the chart.

None of this makes v2 wrong or dishonest. It is a well-built, well-labelled vector toy. But it does not yet carry the claim the two projects share.

## Checked against the brief, item by item

| Brief | v2 | Verdict |
|---|---|---|
| Stripped-down v2 in a new `_partners` folder; original untouched | `_application_v2`, 50 original files byte-identical (per CHANGELOG pass013) | Met |
| Decision cases moved by influences | Five fictional cases; positions moved by slider vectors | Met in form; see point 2 |
| Each case has three influences | Personal A, personal B, shared, each with three axis components (nine sliders) | Met (following the Operator's clarification that each influence carries all three axes) |
| Contrasting starting octants (e.g. religious friend vs grandfather) | All five pairs start in different octants; four are fully opposite; climate shares the y sign | Met |
| Pairs must approach and intersect | Every pair has an authored witness that meets exactly | Met, trivially: the witness is always the midpoint |
| 5–6 case pairs | 5 | Met |
| One individual vector control each, plus a global control | Implemented as three sliders per person plus three global sliders | Met in form; the global control cannot affect the meeting (point 1) |
| Deduce the relevant influences | Each influence has a title and per-axis cue text | Partly: the influences are named, but their direction is not authored, so naming them changes nothing in the model |
| Publish at `/morality/topology/`; small link on MORARG splash; Cloudflare static | Built by `build:rooms` (Topology 2.0.0, 7 public assets); splash footer link "Explore Moral Topology ↗"; back link to MORARG | Met (I checked the local build and splash, not the live site) |
| Full interactive version in the repo | Yes | Met |

## A reading of the brief that fixes points 1 and 2

The brief asked for "one individual vector control each plus a global influence control". The build read "vector control" as *three sliders making a vector*. It can equally be read as *one slider that moves a person along an authored vector*. I recommend the second reading. It is closer to the wording, and it gives influences content.

**Proposed v2.1 (small, deterministic and testable, with no time evolution):**

1. **Personal influences: one magnitude slider each, along an authored direction.** For each case, author a unit direction `uA` for "Conversation with Elise" acting on Mara, and `uB` for "Family deliberation" acting on Daniel. That direction is what a plausible version of that event would do to that person's emphases. Then `A1 = A0 + sA·m·uA`, with `sA ∈ [0,1]` and `m` a fixed scale. The visitor controls *how much* each person is moved, not *where to*. Whether they can meet now depends on the authored content. Sometimes they can't, and that is informative.
2. **The global influence: a pull towards, or push away from, a shared reference.** One slider `g ∈ [−1, 1]`:
   `A = R + (1 − k·g)(A1 − R)` and `B = R + (1 − k·g)(B1 − R)`, with `0 < k ≤ 1`.
   The gap scales by exactly `|1 − k·g|`: positive `g` contracts it, negative `g` expands it (polarisation), and zero leaves it alone. This is the deterministic core of v1's "target pull" (`gain × (target − state)`) without noise or time steps. `R` must be authored and labelled: for example, "where the case's shared practical option sits". It is not a right answer.
3. **Mark each influence as carrying reasons, only pushing, or both, and make the two act differently.** This is the step that joins the two projects. A simple version gives the global setting two sliders:
   - **shared information and options** (reasons), which pulls both people towards `R`, the option both could accept;
   - **social pressure** (pushes), which pulls both towards `N`, the stronger party's or the majority's position.

   Both can produce a "meeting". Only one produces a meeting the weaker party could accept. The chart can then show, without any objective moral fact, the difference between agreement reached through reasons and agreement produced by pressure. That is MORARG's thesis made visible. The labels are authored and disputable, so show them and let the visitor relabel them.
4. **Keep everything v2 got right:** fictional cases; no trait inference; no score; exact coordinate table; "the story stipulates" language for shared options; case notes saying what a meeting does not settle.

**Tests to add** (all algebraic, so cheap):

- with `g = 0` the gap equals the personal-only gap;
- the gap scales by `|1 − k·g|`;
- for each case there is at least one magnitude setting that meets, or an explicit authored statement that it can't;
- a pressure-only meeting lands nearer `N` than `R`;
- no witness is simply `b = −a`.

## Integration with MORARG: recommended design

**Principle (unchanged from the review, P-03 and P-09):** join the two at MORARG's *procedural* premises (influences can distort judgment; reasons and protected dissent can correct it), never at verdicts. Topology illustrates *how* convergence can happen. MORARG asks *whether* a given convergence could be justified to the people affected. Neither tool scores the visitor or infers their position, and nothing flows from MORARG answers into Topology coordinates.

**What is done in this revision (MORARG side only):**

- The disagreement room (04) has a *Model* exhibit, "A model you can play with", linking to Topology. It is labelled as an illustrative model whose numbers are authored assumptions, and it says that a meeting in the model is not evidence that people would agree (Astra P-09). It asks the room's question: did they move closer because the reasons changed, or because something only pushed?
- MORARG's vocabulary now matches what a v2.1 needs: *influences* (some carry reasons, some only push; the same event can do both), instead of a categorical list of "pressures" (Astra A-19).

**Update, v2.2 (same branch):** at the Operator's direction, the one-direction-per-person design below was replaced. Each person now has three real-life factors, each a 3D displacement, unveiled one at a time and applied prescriptively, plus one free three-person case with a global drift and a squeeze. The reasons-versus-pressure point is now carried by factor labels and a "remove the factors that only push" switch, rather than by two shared pulls. The critique of v2.0 above still stands; see `DESIGN_V2_1.md` for the current design.

**Status of v2.1 (28 October 2026, branch `topology-v2-1`):** steps 1–3 are implemented, and step 4 for punishment. See `_partners/MoralTopology/_application_v2/_documentation/DESIGN_V2_1.md`. Differences from the proposal below:
- the shared setting has two controls (reasons towards `R`, pressure towards `N`), as in point 3 of the proposal;
- `N` is always the favoured side's starting position;
- the pressure range is −0.5 to 1, so backlash keeps every point on the fixed axes;
- the ozone ↔ "climate" link was not added: Topology's climate case is about a vehicle restriction, not future people, so the pairing would mislead.

**Next steps, in order (as proposed):**

1. **Add MORARG's town as Topology case six** (the brief allowed six). Room 04's town already has three authored events: a false crime story (pushes only), the employer closing (changes the real options), and residents meeting the refugee families (testimony; both). These map directly onto the three v2.1 influence types. The same case in both tools is the cleanest join. It needs a shared case record (`_documentation/shared_cases`).
2. **Deep links.** Topology accepts `?case=<id>` (it doesn't yet). MORARG's model exhibit then opens the town case directly. Topology's back link returns to the room it came from (for example `../?room=climate`), not only the splash page. (Correction: MORARG already routes `#<room>` hashes into a room, so no new parameter is needed.)
3. **Implement v2.1** as above, as a new model version (2.1.0), keeping v2.0 reproducible.
4. **Then link from the case rooms**: punishment (room 09) ↔ Topology "punishment"; ozone and future people (room 10) ↔ "climate". Each link asks the same single question. Abortion, privacy and assisted dying stay Topology-only unless MORARG gains matching rooms.
5. **Do not embed Topology inside the MORARG 3D scene.** Two WebGL contexts in one page is a performance and accessibility cost for no argumentative gain. A link (new tab) with a matching case is enough.

**What not to claim**, in either tool: that the model shows people *would* converge; that convergence shows who was right; or that the two tools together are a validated explanatory account. The honest claim is conditional: *if* influences work roughly like this, *then* this is how agreement through reasons can be told apart from agreement through pressure, and no objective moral fact is needed to tell them apart.

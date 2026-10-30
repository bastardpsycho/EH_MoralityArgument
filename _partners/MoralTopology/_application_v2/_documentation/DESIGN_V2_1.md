# Moral Topology v2.1 and v2.2: design

Written by Claude at the Operator's request, 28 October 2026. `ASTRA_DESIGN.md` describes v2.0 and remains its record.

## History

- **v2.0** (Codex, Astra design). Nine free sliders: three per person and three for a global vector added equally to both. As MORARG's `TOPOLOGY_V2_ASSESSMENT.md` found, the global vector could never change the distance between the two people, and every authored meeting was the exact midpoint, reached with `b = −a`.
- **v2.1** (Claude, branch `topology-v2-1`, commit `f80176b`; never deployed). Each person was reduced to one slider along one authored direction, plus shared "reasons" and "pressure" pulls towards two reference points.
- **v2.2** (this version). The Operator pointed out that one direction per person implies a single cause, which was never the intent: decisions move because several things in a life change at once. v2.2 restores three-way movement per person, gives each direction a real-life cause, and moves people prescriptively rather than by optional sliders. One free case is kept, and it has three people.

## v2.2.1 (Astra pass003, P-10 and P-11)

- **Geometry only in computed text (P-10).** Computed summaries and case notes now report distances, positions and octants only. The story's outcome is shown as "the story's outcome, not computed". Removing factors is described as a change in the model's coordinates, not a prediction of what anyone would decide. The reveal controls say that every story was written so the pair meet with all factors included.
- **Naming the push (P-11).** Every factor labelled "both" now names the part the story counts as a push, for example "two vivid faces can weigh more in Pat's mind than the many families Pat never meets".
- **Stating the denominator (P-11).** The movement percentages are described as the summed length of the authored pushes, not a measure of how much each mattered.
- **What the remove button does.** It removes whole factors labelled "only pushes"; factors labelled "both" stay in.
- **Tests** check that no computed story summary claims agreement and that every "both" factor names its pushing part.

## Story cases (five)

**What the visitor sees:**
1. The raw circumstances: two people, their starting positions, far apart and in different octants.
2. "Unveil the next factor". Each factor is something happening in one person's life, or in both, for example:
   - Mara, opposed in principle, applies for a demanding new job and reconsiders where the boundaries of the choice lie;
   - Daniel, firmly pro-choice, has a new partner whose family is strongly opposed, and he badly wants to get on with them.

   Unveiling moves the person along the factor's authored 3D displacement, animated unless the visitor prefers reduced motion. No slider is involved: the story says what the factor does.
3. Once everything is unveiled, the pair land on the same point and the case's outcome appears (for example, "both back practical, unconditional support for Elise, with the decision left to her").
4. Then the question MORARG cares about. Each factor carries the story's label: carries reasons, only pushes, or both. The summary gives each person's movement by kind. Any factor can be unticked, and "Remove the factors that only push" shows whether the agreement survives.

**Rules for authoring, checked by `validateScenario` and the tests:**
- Each person is moved by exactly three factors. A factor may move one person or both; a shared event can move two people differently.
- Each person's factors are not all parallel, so movement is genuinely three-way.
- With every factor, the pair end in the same octant within 25 units. All five authored stories meet exactly.
- Each person's net movement is at least 80 units, a considerable part of the ±150 chart. The pairs start more than 160 units apart.
- Every one of the 2^n combinations of factors stays on the fixed axes.

**The cases deliberately teach different lessons when the pushes are removed** (tested):

| Case | Without the factors that only push |
|---|---|
| Town (Pat and Sam) | still close (12 apart) and sharing an octant, but a different one: the false crime story changed *what* they agree on, not *whether* |
| Abortion (Mara and Daniel) | 77 apart, different octants: Daniel's agreement rests on wanting to get on with his partner's family |
| Punishment (Leila and Owen) | still almost together: the agreement rests on reasons |
| Climate (Noor and Ellis) | over 60 apart: pressure on both sides carries the agreement |
| Privacy (Mina and Jules) | still sharing an octant, about 22 apart |

Each case's axes have a case-specific reading (`axisCues`). In the abortion case, for example, y is "protecting developing fetal life". The generic axis names stay on the chart.

The original v2 starting coordinates were kept for town (adjusted in v2.1), abortion and punishment. Climate and privacy were re-authored so each person's position matches their stated view, and all story coordinates were then doubled so journeys cross a substantial part of the chart. Doubling every authored number changes no meeting, octant or proportion; only distances double.

## Free case (assisted dying, three people)

Ren (patient advocate), Ada (caregiver) and Theo (the person's son) start in three different octants.

- **Own influences.** Each has three signed sliders, one per axis, labelled with a real influence in that person's life. For example, Theo's are "his father always insisted on deciding for himself", "guilt about living abroad" and "family expectations back home". Up to 50 units per axis.
- **Global drift**, "the wider care setting changes". The same three-component displacement for everyone, up to 25 units per axis. It can carry them into the same octant but cannot bring them closer.
- **Squeeze**, "time together at the bedside". Pulls everyone towards their centroid and multiplies every distance by exactly `(1 − s)`.

There are two presets:
- "Bedside conversations": a squeeze of 0.9 plus a small drift puts all three in one octant.
- "Same octant, no squeeze": their own influences plus a small drift put all three in one octant while they stay more than 30 units apart. Sharing an octant is not meeting.

The bounds are checked at the corners that bound every endpoint coordinate: for a fixed squeeze each coordinate is nondecreasing in every slider on that axis, and it is linear in the squeeze. Sampled settings are also checked.

## What is unchanged from v2.0

The following carry over unchanged:
- axes and their general meanings, fixed ±150 bounds, and no clipping or autoscaling;
- the four projections and the coordinate table;
- fictional people only, with no trait inference and no score;
- no persistence or network, and a private JSON export;
- the seven-file public allowlist.

## Limits

- Every factor, displacement, label and outcome is authored, and different authors would choose differently. The tool makes those choices inspectable; it does not justify them.
- The stories are constructed to meet. That is the point of a demonstration ("this is how two people could end up deciding the same thing"), not evidence that people do.
- A factor's kind is the story's label. MORARG's disagreement room asks visitors to sort the same town events for themselves.
- In the oblique view, movement along the viewing direction looks shorter than it is. The other projections and the table show it.
- This is not a visitor study and not a model of real people.

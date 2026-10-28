# Moral Topology v2.1: design

Written by Claude at the Operator's request, 28 October 2026. It implements the proposal in MORARG's `_documentation/TOPOLOGY_V2_ASSESSMENT.md`. `ASTRA_DESIGN.md` describes v2.0 and remains its record.

## Why v2.0 changed

The Operator's purpose for the tool is to demonstrate that an intersubjective-plus-influence model can handle moral conflict. Two features of v2.0 prevented that:

1. **The global influence was a pure translation.** It added the same vector to both people, so it could never change the distance between them (ASTRA_DESIGN states this). Shared circumstances could never reconcile anyone.
2. **Influences had no direction of their own.** Each was three free sliders, so any meeting was constructed by pushing each person towards the other. All five authored meetings were the exact midpoint, reached with `b = −a`, and used the same global vector.

## What v2.1 does

**Four controls instead of nine.** The visitor chooses *how much*, and the authored case decides *which way*.

| Control | Range | Effect |
|---|---|---|
| `a` | −1 to 1 | Moves A along `dA`, the authored effect of A's encounter. Negative: it backfired. |
| `b` | −1 to 1 | Moves B along `dB`. |
| `r` | 0 to 1 | Shared reasons: pulls both towards `R`, the case's shared practical option. |
| `p` | −0.5 to 1 | Shared pressure: pulls both towards `N`, the starting position of the side the pressure favours. Below zero: backlash, pushing both away from `N`. |

**Shared influences are homotheties** (scalings about a centre). Applied to both people with one centre and one factor, a homothety multiplies the distance between them by exactly that factor. So:

`|A − B| = |1 − p| · (1 − r) · |A1 − B1|`

The coordinate table prints the three factors and their product, and a test checks the identity on 300 sampled settings per case.

**The point of the demonstration.** Shared reasons and shared pressure can both bring two people together, but not to the same place. Reasons land on the shared option, with both people moving. Pressure lands on the favoured side's position, and the other side does the moving. The summary under the controls states, for the current settings:
- the gap and the three factors;
- how far each person moved;
- how far their midpoint is from `R` and from `N`;
- which influence did most of the narrowing.

Every case has two presets: "meet through shared reasons" (`a = b = 1`, `r = 1`) and "meet through pressure" (`p = 1`). There are also mixed and backlash examples.

**Influence labels.** Each personal influence carries an authored label: carries reasons, only pushes, or both. Each case says what that influence does and why. The visitor can record their own reading of each one. The reading is exported but does not move the points: the model does not decide what kind of influence an event was. The two shared controls are reasons and pressure by definition, and each case's text says why its event belongs there. For example, the false crime story "changes no fact about the families or the homes".

## Guarding against rigging

v2.0's meetings were rigged in the sense that they were constructed. v2.1's tests check that the new geometry is not:

- **Directions are not aimed at the other person:** the cosine with the line between them is below 0.9 for every personal direction (the authored values are 0.25–0.71).
- **Encounters alone never close the gap:** across the whole personal range, the best they can do is multiply it by more than 0.5 (actual: 0.62–0.90). Any meeting needs a shared influence.
- **R is placed apart:** it is neither start (more than 20 units from each) nor the midpoint (more than 5 units away).
- **The two meetings land in different places:** more than 20 units apart in every case (actual minimum: 48.5).
- **No direction pair is equal and opposite.**

My first draft of the directions failed the first two checks, with cosines up to 1.00 and one case where the encounters alone narrowed the gap to 9%. They were re-authored before the tests were finalised.

## The town case

This is the invented town from MORARG (rooms 00 and 04). Pat says the town's first duty is to its own residents; Sam says the town owes the refugee families help.

| MORARG event | v2.1 influence | Label |
|---|---|---|
| A frightening crime story that turns out to be false | shared pressure, favouring Pat | only pushes (by definition) |
| The employer closes: really less money and housing | shared reasons, with the real figures published | carries reasons |
| Residents meet the families | Pat's encounter | both |
| (added) Sam meets residents on the waiting list | Sam's encounter | both |

The fourth event is added so each neighbour meets the people the other is speaking for. The shared record is `_documentation/shared_cases/town_housing_case.json` in MORARG, and a MORARG test checks that its references exist.

The case note says what neither meeting shows: which neighbour was right. The further question, which meeting could be justified to everyone affected, is MORARG's.

## Unchanged from v2.0

The following are unchanged:

- axes and meanings, fixed ±150 bounds, and no clipping or autoscaling;
- the four projections and the coordinate table;
- fictional cases and the starting coordinates of the original five;
- each case's "shared practical option" text, which is stipulated by the story and never computed;
- no persistence or network, and the private JSON export;
- the seven-file public allowlist.

The bounds are checked at the 16 corners of the control box. Each endpoint is multilinear in its own personal amount, `r` and `p`, so its extremes lie at corners.

## Limits

- Every direction, `R` and `N` is authored, and different authors would choose differently. The tool makes those choices visible; it does not justify them.
- "Full strength means complete adoption" is an extreme simplification.
- Pressure is modelled as pulling towards one side's starting position. Real pressure can favour a position neither side holds.
- The chart stays small because the cases lie within about ±60 on fixed ±150 axes. The coordinate table and summary carry the exact values. A fixed close-up view is a possible later addition.
- This is not a visitor study and not a model of real people.

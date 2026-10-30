import { MODEL_VERSION, validateScenario } from "./model.mjs";

// All people, starting points, factors, displacements, labels and outcomes are authored fictional
// assumptions in signed illustrative units. A factor's displacement is what that event plausibly does to
// that person's emphases; it is the story's claim, not a measurement. Factors are listed in the order
// they are unveiled. A factor may move one person or both (a shared event can move two people differently).
export const CASES = [
  {
    id: "town",
    mode: "story",
    title: "Housing: two neighbours and the refugee families",
    prompt: "Refugee families have just arrived in an invented town and need housing. The town has empty homes, and some residents are already waiting for housing. Pat and Sam are neighbours. Both are calm, informed and sincere, and they start far apart.",
    axisCues: { x: "people's own say over where they live (families and residents)", y: "protecting people from hardship and harm", z: "obligations beyond the town, such as national schemes for people fleeing danger" },
    A0: [-90, 100, -110], B0: [100, 60, 120],
    viewpoints: [
      { label: "A", name: "Pat", role: "Fictional neighbour", proposal: "Starts by saying the town's first duty is to its own residents, some of whom are already waiting for housing." },
      { label: "B", name: "Sam", role: "Fictional neighbour", proposal: "Starts by saying the town owes the families help: they fled danger, and the town has empty homes." },
    ],
    factors: [
      { id: "false-story", kind: "pushes", title: "A frightening crime story spreads", text: "A story about crime by newcomers goes round the town and later turns out to be false. It changes no fact about the families or the homes, but it makes both neighbours more wary.", moves: { A: [-20, 20, -24], B: [-30, 20, -30] } },
      { id: "closure", kind: "reasons", title: "The biggest employer closes", text: "There really is less money and housing to go round. Pat learns that a national resettlement grant would pay to repair the empty council homes, which the town could not otherwise afford. Sam's housing charity loses half its budget.", moves: { A: [20, 0, 50], B: [-30, 20, -60] } },
      { id: "families", kind: "both", title: "Pat meets two of the families", text: "Pat hears what they fled and who they are. That is real information. The story counts part of its effect as a push: two vivid faces can weigh more in Pat's mind than the many families Pat never meets.", moves: { A: [80, -10, 64] } },
      { id: "waiting-list", kind: "both", title: "Sam meets residents on the waiting list", text: "Sam spends an evening with families who have waited two years for housing. That is real information about burdens Sam had not weighed. The story counts part of its effect as a push: one evening's stories can loom larger than the waiting-list figures that would put them in proportion.", moves: { B: [-50, 10, -50] } },
    ],
    outcome: { title: "What they end up backing", text: "Both back the same cautious plan: house two families now in council homes repaired with the national grant, keep the waiting list moving, and review in a year." },
    caseNote: "With every factor, their points meet. Remove the false story and the points stay close, but move to a different octant. The chart cannot say what plan they would then back; the story only stipulates the outcome with every factor included. Neither tool can say which neighbour was right; Morality, Between Us asks which plan could be justified to everyone affected.",
  },
  {
    id: "abortion",
    mode: "story",
    title: "Abortion: a friend's conviction and a grandfather's new partner",
    prompt: "Elise, a pregnant adult, is considering ending a pregnancy. Her friend Mara and her grandfather Daniel are discussing what support and rules should allow. No character speaks for a religion, age group, sex, or family role.",
    axisCues: { x: "Elise's control over the decision", y: "protecting developing fetal life", z: "family and community responsibility for support" },
    A0: [-120, 80, -80], B0: [40, -80, 10],
    viewpoints: [
      { label: "A", name: "Mara", role: "Elise's friend", proposal: "Starts in favour of restricting elective abortion: her religious conviction gives developing fetal life strong moral significance." },
      { label: "B", name: "Daniel", role: "Elise's grandfather, widowed, with a new partner", proposal: "Starts firmly in favour of keeping abortion available and leaving the decision to Elise." },
    ],
    factors: [
      { id: "new-job", kind: "reasons", title: "Mara applies for a demanding new job", text: "Imagining being pregnant now, Mara sees how much the timing of a pregnancy shapes a life. In principle she is still opposed, but she reconsiders where the boundaries of the choice lie.", moves: { A: [80, -20, 0] } },
      { id: "partner-family", kind: "pushes", title: "Daniel's new partner's family", text: "Daniel's new partner and her family are strongly opposed to abortion, and he badly wants to get on with them. Nothing about Elise's situation has changed; his wish to belong has.", moves: { B: [-30, 70, 10] } },
      { id: "support-centre", kind: "reasons", title: "Mara volunteers at a family support centre", text: "She sees how much practical help decides what people can manage.", moves: { A: [10, -10, 90] } },
      { id: "scan", kind: "both", title: "Daniel sees the scan", text: "Elise shares the scan with the family. It is information. The story counts part of its effect as a push: an image can move him further than anything it actually shows about the decision.", moves: { B: [-10, 30, 0] } },
      { id: "elise-story", kind: "both", title: "Mara hears Elise in her own words", text: "Elise describes her situation. It is testimony from the person most affected. The story counts part of its effect as a push: loyalty to a friend can make Mara give Elise's account more weight than she would give a stranger's.", moves: { A: [20, -30, 30] } },
      { id: "family-help", kind: "reasons", title: "Daniel learns the family could help", text: "His daughter and son-in-law say they could genuinely help raise a child.", moves: { B: [-10, 0, 20] } },
    ],
    outcome: { title: "What they end up backing", text: "Both back the same next step: practical, unconditional support for Elise, with the decision left to her. Their views on the law still differ." },
    caseNote: "They reach the same point by different routes: most of Mara's movement comes from factors labelled as carrying reasons, most of Daniel's from the one labelled as only pushing. Remove that factor and Daniel's point ends far from Mara's, in a different octant. The chart cannot say what either would then decide. Note too that the story's outcome is a shared next step while their views on the law still differ: matching points are not matching views on everything.",
  },
  {
    id: "punishment",
    mode: "story",
    title: "Punishment: prison and repair",
    prompt: "An adult has committed a serious property offence that harmed a household. Leila belongs to the household; Owen is a community volunteer. The case supplies no real-world recidivism or sentencing evidence.",
    axisCues: { x: "the offender's own part in making amends", y: "preventing further harm", z: "the community's role in accountability" },
    A0: [-100, -30, 20], B0: [20, 60, -70],
    viewpoints: [
      { label: "A", name: "Leila", role: "Member of the harmed household", proposal: "Starts in favour of a substantial prison sentence as accountability." },
      { label: "B", name: "Owen", role: "Community volunteer", proposal: "Starts in favour of a supervised restorative programme with repair obligations." },
    ],
    factors: [
      { id: "letter", kind: "reasons", title: "The offender writes to Leila", text: "In a supervised meeting he answers her questions and sets out how he will repair the damage.", moves: { A: [50, 30, -10] } },
      { id: "household-visit", kind: "reasons", title: "Owen visits the household", text: "He sees how frightened they still are.", moves: { B: [-14, 8, 20] } },
      { id: "be-tough", kind: "pushes", title: "Neighbours tell Leila to be tough", text: "Leila keeps hearing that she must be seen to be tough. It adds nothing about what would work.", moves: { A: [-10, 10, 0] } },
      { id: "suspended", kind: "reasons", title: "Owen learns about suspended sentences", text: "The court can back a repair order with a suspended sentence that takes effect if the order is broken.", moves: { B: [-20, -20, 60] } },
      { id: "insurer", kind: "reasons", title: "Leila's insurer delays", text: "Only a court repair order would pay for the damage quickly.", moves: { A: [30, 50, 0] } },
      { id: "news", kind: "pushes", title: "A news story about a repeat offender", text: "A story about someone who reoffended in a different programme circulates. It says nothing about this case.", moves: { B: [-16, 12, 0] } },
    ],
    outcome: { title: "What they end up backing", text: "Both back a supervised repair order backed by a suspended sentence." },
    caseNote: "Remove the two factors labelled as only pushing and their points stay almost together: most of the movement here comes from factors labelled as carrying reasons. What they would then decide is not something the chart computes.",
  },
  {
    id: "climate",
    mode: "story",
    title: "Climate: a household and a town transition",
    prompt: "A town is considering a rapid restriction on high-emission private vehicles. Noor cares for a family member and depends on a car; Ellis organises for the restriction. No emissions, costs or effects are estimated.",
    axisCues: { x: "households' own choice over how they travel", y: "protecting households from hardship", z: "shared responsibility for cutting emissions" },
    A0: [70, 100, -60], B0: [-80, -20, 110],
    viewpoints: [
      { label: "A", name: "Noor", role: "Household carer", proposal: "Starts in favour of delaying the restriction until her household has a workable alternative." },
      { label: "B", name: "Ellis", role: "Local organiser", proposal: "Starts in favour of introducing the restriction soon." },
    ],
    factors: [
      { id: "asthma", kind: "both", title: "Noor's son's asthma", text: "It gets worse on high-pollution days. That is real information about harm. The story counts part of its effect as a push: worry for her own child can outweigh what she knows about how much the restriction would actually change the air on her street.", moves: { A: [-10, -10, 60] } },
      { id: "father-shifts", kind: "both", title: "Ellis's father can't get to work", text: "He is a carer and cannot reach his hospital shifts without a car. That is real information about burdens. The story counts part of its effect as a push: one family member's case can stand in, in Ellis's mind, for households whose situations differ.", moves: { B: [30, 50, -20] } },
      { id: "car-share", kind: "reasons", title: "A car-share opens on Noor's street", text: "It is funded and close enough to use for care trips.", moves: { A: [-40, -20, 20] } },
      { id: "fund-halved", kind: "reasons", title: "The transition fund is halved", text: "The council can now support far fewer households through the change.", moves: { B: [20, 20, -30] } },
      { id: "petition", kind: "pushes", title: "Noor's street signs the petition", text: "Every neighbour signs in favour of the restriction, and Noor doesn't want to be the odd one out.", moves: { A: [-10, -10, 30] } },
      { id: "business-threat", kind: "pushes", title: "A business group threatens Ellis", text: "They will back Ellis's opponent at the next election unless the plan slows down.", moves: { B: [40, 10, -10] } },
    ],
    outcome: { title: "What they end up backing", text: "Both back a staged restriction with care exemptions and funded alternatives." },
    caseNote: "Remove the factors labelled as only pushing and their points end over 60 apart, in different octants: in this story, pressure on both sides does much of the moving. What they would then decide is not something the chart computes.",
  },
  {
    id: "privacy",
    mode: "story",
    title: "Privacy: public cameras and safeguards",
    prompt: "A town is debating an expanded public camera system after reported incidents. Mina keeps a shop; Jules is a resident. No crime rate, effectiveness estimate, or real system is supplied.",
    axisCues: { x: "residents' control over their own conduct and information", y: "preventing harm from incidents", z: "duties of public oversight" },
    A0: [-80, 90, -40], B0: [90, -40, 60],
    viewpoints: [
      { label: "A", name: "Mina", role: "Shopkeeper", proposal: "Starts in favour of expanding cameras across public areas." },
      { label: "B", name: "Jules", role: "Resident", proposal: "Starts in favour of declining the expansion." },
    ],
    factors: [
      { id: "leak", kind: "both", title: "Footage from Mina's own shop is leaked", text: "A contractor posts it online. It is information about how such systems fail. The story counts part of its effect as a push: being the one exposed can make a rare failure feel typical.", moves: { A: [60, -20, 30] } },
      { id: "followed", kind: "both", title: "Jules's teenager is followed home", text: "One evening, by a stranger. It is information about a real risk. The story counts part of its effect as a push: fear after one incident can make Jules overestimate how often it happens.", moves: { B: [-30, 50, 0] } },
      { id: "caught", kind: "reasons", title: "The incidents were one person", text: "That person has now been caught.", moves: { A: [10, -30, 10] } },
      { id: "spec", kind: "reasons", title: "Jules reads the proposal", text: "No facial recognition, and footage deleted after seven days.", moves: { B: [-20, 10, -10] } },
      { id: "board", kind: "reasons", title: "Mina joins the oversight board", text: "She is asked to sit on the residents' board that would supervise any system.", moves: { A: [30, -10, 50] } },
      { id: "viral", kind: "pushes", title: "A viral video at Jules's work", text: "Safety becomes the only topic in the office. It adds nothing about cameras.", moves: { B: [-20, 10, 0] } },
    ],
    outcome: { title: "What they end up backing", text: "Both back a short, limited pilot with independent resident oversight and an end date." },
    caseNote: "Without the one factor labelled as only pushing, their points still share an octant, about 22 apart. What they would then decide is not something the chart computes.",
  },
  {
    id: "assisted-dying",
    mode: "free",
    title: "Assisted dying: three people at one bedside (free exploration)",
    prompt: "A seriously ill adult is discussing assisted dying and continued care. Three people around them start in three different places. Move each with their own influences, move all three with the wider setting, and draw them together with time at the bedside. The example specifies no jurisdiction, eligibility rule or clinical recommendation.",
    axisCues: { x: "the person's own say over their care and death", y: "protecting the person from pressure and harm, including feeling a burden", z: "duties of the wider family and care system" },
    viewpoints: [
      { label: "A", name: "Ren", role: "Patient advocate", start: [55, -25, -15], proposal: "Starts in favour of making assisted dying available under safeguards to a person who persistently requests it.",
        cues: { title: "Ren's influences", x: "a friend's long illness made the person's own say feel urgent", y: "stories of people pressured into decisions", z: "trust in the wider health service" } },
      { label: "B", name: "Ada", role: "Caregiver", start: [-45, 40, -20], proposal: "Starts in favour of continuing care without assisted dying, while respecting the person's account of suffering.",
        cues: { title: "Ada's influences", x: "years of seeing patients' wishes overridden", y: "fear that vulnerable patients feel a burden", z: "loyalty to the hospice team's ethos" } },
      { label: "C", name: "Theo", role: "The person's son", start: [-20, 10, 55], proposal: "Starts wanting every option for care tried first, and the family involved in any decision.",
        cues: { title: "Theo's influences", x: "his father always insisted on deciding for himself", y: "guilt about living abroad", z: "family expectations back home" } },
    ],
    shared: {
      drift: { title: "The wider care setting changes", text: "Moves all three by the same amount in the same direction. It can carry them into the same octant, but it cannot bring them closer together.", x: "a new law on patient choice", y: "a hospice funding crisis", z: "a public debate about duties of care" },
      squeeze: { title: "Time together at the bedside", text: "Long conversations pull all three towards one another. It multiplies every distance between them by (1 − strength); full strength would put them on one point, which is an extreme." },
    },
    caseNote: "Matching coordinates leaves questions of consent, obligation, safeguards and the permissible action unresolved.",
  },
];

export const FREE_PRESETS = Object.freeze({
  squeeze: Object.freeze({ label: "Bedside conversations", note: "Squeeze at 0.9 shrinks every distance to a tenth; a small shift in the wider setting then carries all three into one octant. Nobody's own influences change.", controls: Object.freeze({ people: [[0, 0, 0], [0, 0, 0], [0, 0, 0]], g: [0.4, 0.1, 0.1], s: 0.9 }) }),
  octant: Object.freeze({ label: "Same octant, no squeeze", note: "Each person's own influences, plus a small drift, put all three in the same octant. They are still far apart: sharing an octant is not meeting.", controls: Object.freeze({ people: [[0, 0.6, 0.6], [1, -0.4, 0.8], [0.6, 0.2, -0.4]], g: [0.3, 0.3, 0.3], s: 0 }) }),
});

if (CASES.length !== 6) throw new Error("Moral Topology v2.2 must contain exactly six fictional cases.");
const ids = new Set();
for (const scenario of CASES) {
  if (ids.has(scenario.id)) throw new Error(`Duplicate case id: ${scenario.id}`);
  ids.add(scenario.id);
  validateScenario(scenario);
  scenario.version = MODEL_VERSION;
}

export function getCase(id) {
  const scenario = CASES.find((candidate) => candidate.id === id);
  if (!scenario) throw new RangeError(`Unknown case: ${id}`);
  return scenario;
}

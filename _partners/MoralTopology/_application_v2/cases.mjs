import { MODEL_VERSION, validateScenario } from "./model.mjs";

export const CONTROLS_DEFAULT = Object.freeze({ a: 0, b: 0, r: 0, p: 0 });

// Presets are the same for every case; their outcomes differ because each case's directions, R and N differ.
export const PRESETS = Object.freeze({
  reasons: Object.freeze({ label: "Meet through shared reasons", controls: Object.freeze({ a: 1, b: 1, r: 1, p: 0 }), note: "Both encounters at full strength, then shared reasons at full strength: both end at the shared option. Full strength means complete adoption, an extreme assumption." }),
  pressure: Object.freeze({ label: "Meet through pressure", controls: Object.freeze({ a: 0, b: 0, r: 0, p: 1 }), note: "Pressure alone at full strength: both end at the louder side's starting position. The quieter side did all the moving." }),
  mixed: Object.freeze({ label: "Mixed example", controls: Object.freeze({ a: 0.6, b: 0.4, r: 0.5, p: 0.3 }), note: "Partial encounters, partial reasons, some pressure." }),
  backlash: Object.freeze({ label: "Backlash example", controls: Object.freeze({ a: -0.5, b: -0.5, r: 0, p: -0.5 }), note: "Both encounters backfire and pressure provokes backlash: the gap widens." }),
});

// Coordinates, directions (in signed units at full strength), R and N are authored fictional assumptions.
// Each personal direction is what a plausible version of that event would do to that person's emphases.
// It is not chosen to point at the other person. R is where the case's shared practical option sits.
// N is the starting position of the side the case's pressure favours.
export const CASES = [
  {
    id: "town",
    title: "Housing: two neighbours and the refugee families",
    prompt: "Refugee families have just arrived in an invented town and need housing. The town has empty homes, and some residents are already waiting for housing. In one month, a frightening crime story spreads and turns out to be false; the town's biggest employer closes, so there really is less money and housing; and residents meet people they had only heard about.",
    A0: [-45, 50, -55], B0: [50, 30, 60], R: [5, 50, 10],
    viewpoints: [
      { label: "A", name: "Pat", role: "Fictional neighbour", proposal: "Currently says the town's first duty is to its own residents, some of whom are already waiting for housing.", context: "Calm, informed and sincere. This is Pat's authored position, not a characterization of any group." },
      { label: "B", name: "Sam", role: "Fictional neighbour", proposal: "Currently says the town owes the families help: they fled danger, and the town has empty homes.", context: "Calm, informed and sincere. This is Sam's authored position, not a characterization of any group." },
    ],
    influences: {
      personalA: { title: "Pat meets the families", kind: "both", direction: [50, 35, 10], text: "Pat meets two of the families and hears what they fled. That is real information about who they are and what they face, and it also stirs feeling. Here it raises Pat's weight on the families' own choices and on the harms they fled, and only slightly on obligations beyond the town." },
      personalB: { title: "Sam hears from the waiting list", kind: "both", direction: [-15, 25, -10], text: "Sam meets residents who have waited two years for housing. That is real information about burdens Sam had not weighed, and it also stirs feeling. Here it raises Sam's weight on preventing harm (now including those residents) and slightly lowers the weight on newcomers' choices and on obligations beyond the town." },
      reasons: { title: "The closure and the real figures", text: "The employer's closure changes what the town can actually offer, and the council publishes the real numbers of homes and money. Shared reasons pull both towards an option both could accept on those figures." },
      pressure: { title: "The false crime story", side: "A", text: "A frightening crime story spreads and turns out to be false. It changes no fact about the families or the homes. It pulls both towards Pat's starting position, the louder side while the story circulates." },
    },
    sharedOption: { title: "A smaller plan on the real figures", text: "Pat and Sam could both accept housing four families now in council-owned empty homes, keeping the waiting list moving with published figures, and reviewing in six months. This is a possible agreement about one next step; it does not settle what the town owes in general. The story stipulates it; no coordinate produces it." },
    caseNote: "A meeting under pressure lands on Pat's side because the false story favours Pat's position, not because Pat was right. A meeting under shared reasons lands on the shared option. Neither shows which neighbour was right. The further question is which meeting could be justified to everyone affected, including the families and the residents waiting.",
  },
  {
    id: "abortion",
    title: "Abortion: conviction and a grandfather's concern",
    prompt: "Elise, a pregnant adult, is considering ending a pregnancy. Mara and Daniel are discussing what public rules and family support should allow. No character speaks for a religion, age group, sex, or family role.",
    A0: [-60, 40, -40], B0: [20, -40, 5], R: [-10, 15, -5],
    viewpoints: [
      { label: "A", name: "Mara", role: "Fictional religious friend", proposal: "Currently favors restricting elective abortion, with an exception when the pregnant person's life is threatened.", context: "Her religious conviction gives developing fetal life strong moral significance. This is her authored position, not a characterization of religious people generally." },
      { label: "B", name: "Daniel", role: "Elise's fictional grandfather", proposal: "Currently favors keeping abortion legally available and helping Elise make her own decision.", context: "He is focused on Elise's ability to choose and her family's practical circumstances. Being a grandfather does not imply this position or any coordinate." },
    ],
    influences: {
      personalA: { title: "Conversation with Elise", kind: "reasons", direction: [45, 5, 15], text: "Mara listens to Elise describe her situation. This is testimony from the person most affected. Here it raises Mara's weight on Elise's control and slightly on Elise's burdens and on support beyond the two of them." },
      personalB: { title: "Family deliberation", kind: "both", direction: [-10, 30, 15], text: "Daniel talks through health risks and care with the family. Some of this is information, and some is family expectation. Here it raises his weight on preventing harm and on the family's shared responsibilities." },
      reasons: { title: "Available community support, accurately described", text: "Accurate information about what help is actually available. Shared reasons pull both towards an option both could accept." },
      pressure: { title: "A loud local campaign", side: "A", text: "A noisy campaign presses for restriction. It adds no information about Elise's situation. It pulls both towards Mara's starting position." },
    },
    sharedOption: { title: "Support without coercion", text: "Mara and Daniel could both agree to offer Elise practical help and a confidential opportunity to discuss her wishes, without making their help conditional on her choice. This is a concrete agreement about their conduct toward Elise; it does not settle their opposing legal positions or decide for her. Present it as a possible choice, never as an output of the meeting calculation." },
    caseNote: "At any meeting, the two policy cards remain different. Matching all three displayed coordinates does not resolve Mara's view of fetal moral status or establish agreement on legal access: that question is not one of the axes.",
  },
  {
    id: "punishment",
    title: "Punishment: prison and repair",
    prompt: "An adult has committed a serious property offence that harmed a household. The case asks how a community should respond; it supplies no real-world recidivism or sentencing evidence.",
    A0: [-50, -15, 10], B0: [10, 30, -35], R: [-15, 15, -5],
    viewpoints: [
      { label: "A", name: "Leila", role: "Member of the harmed household", proposal: "Currently favors a substantial prison sentence as an expression of accountability.", context: "This proposal reflects Leila's authored view of the fictional case." },
      { label: "B", name: "Owen", role: "Community volunteer", proposal: "Currently favors a supervised restorative program with enforceable repair obligations.", context: "This proposal reflects Owen's authored view of the fictional case." },
    ],
    influences: {
      personalA: { title: "Accountability conversation", kind: "reasons", direction: [30, 5, 15], text: "Leila hears the offender acknowledge the harm and set out concrete repair. Here it raises her weight on the offender's own agency in repairing harm and on the community's part in holding him to it." },
      personalB: { title: "Repair planning", kind: "reasons", direction: [-10, 15, 25], text: "Owen learns how the household is still affected. Here it raises his weight on preventing continuing harm and on the community's responsibility for accountability, and slightly lowers the weight on participants' choice alone." },
      reasons: { title: "An open review of what each option requires", text: "A clear account of what each response would involve and who would supervise it. Shared reasons pull both towards an option both could accept." },
      pressure: { title: "Public anger after the offence", side: "A", text: "Angry local coverage demands toughness. It adds no information about what either response would achieve. It pulls both towards Leila's starting position." },
    },
    sharedOption: { title: "Enforceable repair with a suspended sentence", text: "Leila and Owen could both support a supervised repair program backed by a suspended sentence and explicit review of compliance. This modified option differs from both starting recommendations. The story stipulates their possible acceptance; no coordinate proves it suitable, lawful in a particular jurisdiction, or effective." },
    caseNote: "Even at a coordinate meeting, accountability can still be interpreted differently, and the preferred responses remain explicitly displayed.",
  },
  {
    id: "climate",
    title: "Climate: a household and a town transition",
    prompt: "A town is considering a rapid restriction on high-emission private vehicles. A household faces difficult travel and care arrangements. These circumstances are assumed without estimating emissions, costs, or policy effectiveness.",
    A0: [35, 50, 5], B0: [-40, 10, -40], R: [0, 30, -10],
    viewpoints: [
      { label: "A", name: "Noor", role: "Household carer", proposal: "Currently favors delaying the restriction until their household has a workable alternative.", context: "Individual discretion and possible household burdens receive relatively high starting emphasis." },
      { label: "B", name: "Ellis", role: "Local organizer", proposal: "Currently favors introducing the restriction soon with a transition scheme.", context: "This is Ellis's authored proposal for the fictional town." },
    ],
    influences: {
      personalA: { title: "Household travel deliberation", kind: "reasons", direction: [-30, -10, 20], text: "Noor works through the household's real travel options. Here it lowers the weight on household discretion and raises the weight on the household's share in collective change." },
      personalB: { title: "Transition planning", kind: "reasons", direction: [10, 30, -5], text: "Ellis maps which households have no workable alternative. Here it raises the weight on burdens for households without one, and slightly on residents' choice among alternatives." },
      reasons: { title: "A funded transition, with the details published", text: "Published details of the alternatives and their funding. Shared reasons pull both towards an option both could accept." },
      pressure: { title: "The town majority's impatience", side: "B", text: "Most residents want a quick start, and Noor's household feels outnumbered. That adds no information about the household's options. It pulls both towards Ellis's starting position." },
    },
    sharedOption: { title: "A staged restriction with access support", text: "Noor and Ellis could both accept an announced start date, temporary care-related exemptions, and funded travel alternatives before those exemptions expire. This combines a definite transition with accommodation of concrete burdens. Their possible agreement is an additional story assumption, not an inference from matching coordinates." },
    caseNote: "The meeting does not decide a start date or show that either policy is effective. Different timing judgments remain possible with identical displayed weights.",
  },
  {
    id: "privacy",
    title: "Privacy: public cameras and safeguards",
    prompt: "A town is debating an expanded public camera system after reported incidents. No crime rate, effectiveness estimate, or real technical system is supplied.",
    A0: [-30, -20, -40], B0: [5, 40, 5], R: [-10, 15, -10],
    viewpoints: [
      { label: "A", name: "Mina", role: "Shopkeeper", proposal: "Currently favors expanding cameras in public areas, subject to stated oversight.", context: "This is Mina's authored position about the fictional town." },
      { label: "B", name: "Jules", role: "Resident", proposal: "Currently favors declining the expansion and using less intrusive responses.", context: "This is Jules's authored position about the fictional town." },
    ],
    influences: {
      personalA: { title: "Residents' accounts", kind: "both", direction: [30, 10, -10], text: "Mina hears residents describe being watched. Some of this is information and some is feeling. Here it raises her weight on residents' control over their everyday conduct and slightly on monitoring harms." },
      personalB: { title: "Safeguards assessment", kind: "reasons", direction: [0, -20, 15], text: "Jules reviews what oversight could limit. Here it lowers the weight on anticipated privacy harms and raises the weight on shared duties of oversight." },
      reasons: { title: "Public oversight with clear limits", text: "A clear statement of what oversight would and would not allow. Shared reasons pull both towards an option both could accept." },
      pressure: { title: "Fear after a widely shared incident video", side: "A", text: "A frightening video circulates. It adds no information about whether cameras would help. It pulls both towards Mina's starting position." },
    },
    sharedOption: { title: "A limited, reviewable pilot", text: "Mina and Jules could both accept a short pilot in a narrowly specified area, no facial recognition, limited retention and access, independent resident oversight, and an explicit end date unless review justifies renewal. This is a changed proposal they might both choose. The diagram does not establish effectiveness or the adequacy of these safeguards." },
    caseNote: "A meeting under pressure lands on Mina's side because fear favours expansion, not because expansion is right. A meeting under shared reasons lands on the pilot.",
  },
  {
    id: "assisted-dying",
    title: "Assisted dying: choice and continued care",
    prompt: "A seriously ill adult is discussing assisted dying and continued care. The example specifies no jurisdiction, eligibility rule, prognosis, or clinical recommendation.",
    A0: [20, 35, 10], B0: [-55, -25, -20], R: [-15, 5, 0],
    viewpoints: [
      { label: "A", name: "Ren", role: "Patient advocate", proposal: "Currently favors making assisted dying available under safeguards to a person who persistently requests it.", context: "This is Ren's authored position for the fictional case." },
      { label: "B", name: "Ada", role: "Caregiver", proposal: "Currently favors continuing care without providing assisted dying, while respecting the person's account of suffering.", context: "This is Ada's authored position for the fictional case." },
    ],
    influences: {
      personalA: { title: "Wishes and pressure deliberation", kind: "reasons", direction: [-25, -10, 15], text: "Ren checks carefully whether the person feels an obligation to die. Here it lowers the weight on the expressed choice taken alone and raises the weight on wider responsibilities." },
      personalB: { title: "Care deliberation", kind: "both", direction: [35, 5, -10], text: "Ada spends time with the person's account of suffering. Some of this is information, some is feeling. Here it raises her weight on the person's control over their care." },
      reasons: { title: "Dependable care with an independent check of wishes", text: "Assured care plus an independent check that the person's wishes are their own. Shared reasons pull both towards an option both could accept." },
      pressure: { title: "Institutional caution about liability", side: "B", text: "Fear of legal exposure discourages any discussion of assisted dying. It adds no information about the person's wishes. It pulls both towards Ada's starting position." },
    },
    sharedOption: { title: "A care and wishes plan now", text: "Ren and Ada could both support immediate dependable care, a private opportunity for the person to express their wishes, and a further discussion that explicitly checks for felt obligation. This is agreement on their next practical step, not agreement to provide or refuse assisted dying. The narrower scope must stay visible: the model does not decide the permissible action." },
    caseNote: "Matching coordinates leaves questions of consent, obligation, safeguards, and the permissible action unresolved. The action cards remain visible.",
  },
];

if (CASES.length !== 6) throw new Error("Moral Topology v2.1 must contain exactly six fictional case pairs.");
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

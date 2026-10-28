import { MODEL_VERSION, validateScenario } from "./model.mjs";

export const CONTROLS_DEFAULT = Object.freeze({ a: [0, 0, 0], b: [0, 0, 0], g: [0, 0, 0] });
export const EXAMPLE_CONTROLS = Object.freeze({ a: [0.2, 0.1, 0], b: [-0.1, -0.2, 0.15], g: [0.1, -0.1, 0.1] });

// The coordinates and responses are authored fictional assumptions, in signed illustration units.
export const CASES = [
  {
    id: "abortion",
    title: "Abortion: conviction and a grandfather's concern",
    prompt: "Elise, a pregnant adult, is considering ending a pregnancy. Mara and Daniel are discussing what public rules and family support should allow. No character speaks for a religion, age group, sex, or family role.",
    A0: [-60, 40, -40], B0: [20, -40, 5],
    witness: { a: [0.8, -0.8, 0.45], b: [-0.8, 0.8, -0.45], g: [0.2, -0.2, 0.2] },
    viewpoints: [
      { label: "A", name: "Mara", role: "Fictional religious friend", proposal: "Currently favors restricting elective abortion, with an exception when the pregnant person's life is threatened.", context: "Her religious conviction gives developing fetal life strong moral significance. This is her authored position, not a characterization of religious people generally." },
      { label: "B", name: "Daniel", role: "Elise's fictional grandfather", proposal: "Currently favors keeping abortion legally available and helping Elise make her own decision.", context: "He is focused on Elise's ability to choose and her family's practical circumstances. Being a grandfather does not imply this position or any coordinate." },
    ],
    influences: {
      personalA: { title: "Conversation with Elise", cues: { x: "Elise's control over her own decision", y: "The burdens Elise describes", z: "Responsibilities beyond Mara and Elise" } },
      personalB: { title: "Family deliberation", cues: { x: "Elise's independence from family pressure", y: "Health, care, and family burdens", z: "The wider family's responsibilities" } },
      shared: { title: "Available community support", cues: { x: "Choice within the offered support", y: "Burdens the support is meant to address", z: "Community obligations to provide support" } },
    },
    sharedOption: { title: "Support without coercion", text: "Mara and Daniel could both agree to offer Elise practical help and a confidential opportunity to discuss her wishes, without making their help conditional on her choice. This is a concrete agreement about their conduct toward Elise; it does not settle their opposing legal positions or decide for her. Present it as a possible choice, never as an output of the meeting calculation." },
    caseNote: "At a constructed meeting, the two policy cards remain different. Matching all three displayed coordinates has not resolved Mara's view of fetal moral status or established agreement on legal access.",
  },
  {
    id: "punishment",
    title: "Punishment: prison and repair",
    prompt: "An adult has committed a serious property offence that harmed a household. The case asks how a community should respond; it supplies no real-world recidivism or sentencing evidence.",
    A0: [-50, -15, 10], B0: [10, 30, -35],
    witness: { a: [0.6, 0.45, -0.45], b: [-0.6, -0.45, 0.45], g: [0.2, -0.2, 0.2] },
    viewpoints: [
      { label: "A", name: "Leila", role: "Member of the harmed household", proposal: "Currently favors a substantial prison sentence as an expression of accountability.", context: "This proposal reflects Leila's authored view of the fictional case." },
      { label: "B", name: "Owen", role: "Community volunteer", proposal: "Currently favors a supervised restorative program with enforceable repair obligations.", context: "This proposal reflects Owen's authored view of the fictional case." },
    ],
    influences: {
      personalA: { title: "Accountability conversation", cues: { x: "The offender's agency in acknowledging and repairing harm", y: "Burdens on the harmed household", z: "Community responsibilities for accountability" } },
      personalB: { title: "Repair planning", cues: { x: "Participants' choice and participation in repair", y: "Possible continuing harm", z: "Duties to sustain a repair program" } },
      shared: { title: "Public supervision setting", cues: { x: "Agency within the proposed response", y: "Harms the response is meant to prevent", z: "Institutions' supervision responsibilities" } },
    },
    sharedOption: { title: "Enforceable repair with a suspended sentence", text: "Leila and Owen could both support a supervised repair program backed by a suspended sentence and explicit review of compliance. This modified option differs from both starting recommendations. The story stipulates their possible acceptance; no coordinate proves it suitable, lawful in a particular jurisdiction, or effective." },
    caseNote: "Even at a coordinate meeting, accountability can still be interpreted differently, and the preferred responses remain explicitly displayed.",
  },
  {
    id: "climate",
    title: "Climate: a household and a town transition",
    prompt: "A town is considering a rapid restriction on high-emission private vehicles. A household faces difficult travel and care arrangements. These circumstances are assumed without estimating emissions, costs, or policy effectiveness.",
    A0: [35, 50, 5], B0: [-40, 10, -40],
    witness: { a: [-0.75, -0.4, -0.45], b: [0.75, 0.4, 0.45], g: [0.2, -0.2, 0.2] },
    viewpoints: [
      { label: "A", name: "Noor", role: "Household carer", proposal: "Currently favors delaying the restriction until their household has a workable alternative.", context: "Individual discretion and possible household burdens receive relatively high starting emphasis." },
      { label: "B", name: "Ellis", role: "Local organizer", proposal: "Currently favors introducing the restriction soon with a transition scheme.", context: "This is Ellis's authored proposal for the fictional town." },
    ],
    influences: {
      personalA: { title: "Household travel deliberation", cues: { x: "Household discretion over travel", y: "Travel and care burdens on the household", z: "The household's share in collective change" } },
      personalB: { title: "Transition planning", cues: { x: "Residents' choice among workable alternatives", y: "Burdens on households without alternatives", z: "Shared obligations in the town's transition" } },
      shared: { title: "Funded transition context", cues: { x: "Choice within the transition arrangements", y: "Burdens the arrangements should address", z: "Duties to provide transition support" } },
    },
    sharedOption: { title: "A staged restriction with access support", text: "Noor and Ellis could both accept an announced start date, temporary care-related exemptions, and funded travel alternatives before those exemptions expire. This combines a definite transition with accommodation of concrete burdens. Their possible agreement is an additional story assumption, not an inference from matching coordinates." },
    caseNote: "The meeting does not decide a start date or show that either policy is effective. Different timing judgments remain possible with identical displayed weights.",
  },
  {
    id: "privacy",
    title: "Privacy: public cameras and safeguards",
    prompt: "A town is debating an expanded public camera system after reported incidents. No crime rate, effectiveness estimate, or real technical system is supplied.",
    A0: [-30, -20, -40], B0: [5, 40, 5],
    witness: { a: [0.35, 0.6, 0.45], b: [-0.35, -0.6, -0.45], g: [0.2, -0.2, 0.2] },
    viewpoints: [
      { label: "A", name: "Mina", role: "Shopkeeper", proposal: "Currently favors expanding cameras in public areas, subject to stated oversight.", context: "This is Mina's authored position about the fictional town." },
      { label: "B", name: "Jules", role: "Resident", proposal: "Currently favors declining the expansion and using less intrusive responses.", context: "This is Jules's authored position about the fictional town." },
    ],
    influences: {
      personalA: { title: "Residents' accounts", cues: { x: "Control over everyday conduct in public", y: "Burdens associated with incidents and monitoring", z: "Responsibilities toward other residents" } },
      personalB: { title: "Safeguards assessment", cues: { x: "Control over personal information and conduct", y: "Anticipated privacy and safety harms", z: "Duties to scrutinize the proposed system" } },
      shared: { title: "Public oversight setting", cues: { x: "Agency under the oversight arrangements", y: "Harms the oversight should address", z: "Residents' and institutions' oversight duties" } },
    },
    sharedOption: { title: "A limited, reviewable pilot", text: "Mina and Jules could both accept a short pilot in a narrowly specified area, no facial recognition, limited retention and access, independent resident oversight, and an explicit end date unless review justifies renewal. This is a changed proposal they might both choose. The diagram does not establish effectiveness or the adequacy of these safeguards." },
    caseNote: "The shared global vector moves both points equally and cannot change their gap. Any reduction or increase in this case comes from the distinct personal A and B vectors.",
  },
  {
    id: "assisted-dying",
    title: "Assisted dying: choice and continued care",
    prompt: "A seriously ill adult is discussing assisted dying and continued care. The example specifies no jurisdiction, eligibility rule, prognosis, or clinical recommendation.",
    A0: [20, 35, 10], B0: [-55, -25, -20],
    witness: { a: [-0.75, -0.6, -0.3], b: [0.75, 0.6, 0.3], g: [0.2, -0.2, 0.2] },
    viewpoints: [
      { label: "A", name: "Ren", role: "Patient advocate", proposal: "Currently favors making assisted dying available under safeguards to a person who persistently requests it.", context: "This is Ren's authored position for the fictional case." },
      { label: "B", name: "Ada", role: "Caregiver", proposal: "Currently favors continuing care without providing assisted dying, while respecting the person's account of suffering.", context: "This is Ada's authored position for the fictional case." },
    ],
    influences: {
      personalA: { title: "Wishes and pressure deliberation", cues: { x: "The person's expressed choice", y: "Suffering and burdens of felt obligation", z: "Responsibilities beyond the advocate and patient" } },
      personalB: { title: "Care deliberation", cues: { x: "The person's control over care choices", y: "Burdens of unwanted continued suffering", z: "The wider care network's obligations" } },
      shared: { title: "Dependable care setting", cues: { x: "Choice within the available care", y: "Burdens the care is meant to address", z: "Duties to sustain dependable care" } },
    },
    sharedOption: { title: "A care and wishes plan now", text: "Ren and Ada could both support immediate dependable care, a private opportunity for the person to express their wishes, and a further discussion that explicitly checks for felt obligation. This is agreement on their next practical step, not agreement to provide or refuse assisted dying. The narrower scope must stay visible: the model cannot manufacture resolution of the substantive disagreement." },
    caseNote: "Matching coordinates leaves questions of consent, obligation, safeguards, and the permissible action unresolved. The action cards remain visible.",
  },
];

if (CASES.length !== 5) throw new Error("Moral Topology v2 must contain exactly five fictional case pairs.");
const ids = new Set();
for (const scenario of CASES) {
  if (ids.has(scenario.id)) throw new Error(`Duplicate case id: ${scenario.id}`);
  ids.add(scenario.id);
  validateScenario(scenario);
  if (scenario.viewpoints.length !== 2) throw new Error(`${scenario.id} must have exactly two viewpoints.`);
  scenario.version = MODEL_VERSION;
}

export function getCase(id) {
  const scenario = CASES.find((candidate) => candidate.id === id);
  if (!scenario) throw new RangeError(`Unknown case: ${id}`);
  return scenario;
}

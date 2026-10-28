"""Case library, ecologies and the reversal-test phases.

Each case sets levers (on top of the everyday defaults), a probe start (x, y, z, w) and optional
traits. `try_` tells the user which lever to move to see the phenomenon's signature effect.
"""

from .levers import DEFAULT_LEVERS, LEVER_KEYS


def lv(**over):
    d = dict(DEFAULT_LEVERS)
    d.update(over)
    return d


def zero(**over):
    d = {k: 0 for k in LEVER_KEYS}
    d["noise"] = 2
    d.update(over)
    return d


CASES = {
    "everyday": dict(
        title="Everyday life in a stable town",
        levers=lv(),
        probe=(-20, 20, -20, 0),
        text="The default: reciprocity and reputation among familiars, moderate institutions. Most moral "
             "life is intuitive, local and mostly internalised.",
        try_="Raise Scarcity past 8 and watch the collapse threshold; then add Shared fate.",
        grade="robust",
    ),
    "milgram": dict(
        title="Obedience lab (Milgram, voice-feedback condition)",
        levers=lv(authority=8, escalation=7, empathy_i=3, empathy_b=3, surveillance=3, conformity=3),
        probe=(30, 40, 10, 0),
        text="An ordinary volunteer, broadly decent and internalised, is walked down to the agentic state "
             "by a legitimate-seeming authority in 15-volt increments.",
        try_="Raise Empathy intensity (victim proximity: touch condition) — obedience weakens. "
             "Set Escalation to 0 — the slide is shallower.",
        grade="mixed",
        note="Burger 2009 replicated to 150 V; Haslam & Reicher recast obedience as engaged identification "
             "with the experimenter's cause — in this model that is ingroup + internalisation, not bare coercion.",
    ),
    "bystander": dict(
        title="Bystander in a crowd",
        levers=lv(diffusion=9, anonymity=6, conformity=7, delib=2),
        probe=(20, 10, -10, 0),
        text="Many witnesses, nobody acts: responsibility diffuses and pluralistic ignorance makes "
             "inaction look like the norm.",
        try_="Raise Violent intergroup threat (clear danger): the bystander effect attenuates (Fischer 2011).",
        grade="robust",
    ),
    "battalion": dict(
        title="Ordinary men (Reserve Police Battalion 101)",
        levers=lv(authority=6, conformity=9, propaganda=6, escalation=8, threat=5, ingroup=8, surveillance=3),
        probe=(10, 20, -10, 20),
        text="Middle-aged reservists were offered an opt-out; most did not take it. Browning's account: "
             "conformity and not wanting to leave comrades to do the dirty work, more than ideology or fear.",
        try_="Zero Conformity and notice how much of the drift disappears (see the explanation heatmap).",
        grade="mixed",
    ),
    "rescuer": dict(
        title="Rescuer under persecution",
        levers=lv(threat=7, surveillance=7, propaganda=5, empathy_i=8, empathy_b=9, contact=7, delib=3),
        probe=(60, 70, -40, -30),
        traits=dict(empathy=2.0),
        text="Oliner & Oliner found rescuers of Jews were marked by 'extensivity': inclusive upbringing, "
             "contact, felt obligation to strangers. Most described acting without deliberation.",
        try_="Set trait empathy to 0 and Contact to 0: the same situation now drives the probe to the ingroup.",
        grade="mixed",
    ),
    "whistleblower": dict(
        title="Whistleblower",
        levers=lv(authority=5, stakes=6, surveillance=4, delib=8, education=7, conformity=5),
        probe=(50, 60, 50, -20),
        traits=dict(nfc=1.5, empathy=1.0),
        text="Internalised, reasoned broad commitments against authority, career stakes and peer norms. "
             "High moral-strain readout: the classic moral-injury configuration.",
        try_="Drop Deliberation to 2 with Stakes high — reasoning stops protecting the broad scope.",
        grade="mixed",
    ),
    "fraud": dict(
        title="Organisational fraud slide",
        levers=lv(stakes=8, conformity=7, escalation=7, diffusion=6, authority=4, anonymity=3, market=8, delib=6),
        probe=(20, 0, 30, -20),
        text="Small accounting shortcuts, normalised by peers and incentives, become large ones. "
             "Deliberation is recruited to justify rather than restrain (motivated reasoning).",
        try_="Watch Deliberation's contribution: with high stakes it points toward self.",
        grade="mixed",
    ),
    "disaster": dict(
        title="Acute disaster with shared fate",
        levers=lv(scarcity=7, shared_fate=9, rule_of_law=4),
        probe=(-40, 0, -20, 0),
        text="Disaster research consistently finds mutual aid, not panic: scarcity with a common "
             "predicament widens concern to everyone affected.",
        try_="Drop Shared fate to 0: the same scarcity now contracts scope.",
        grade="robust",
    ),
    "famine_lowtrust": dict(
        title="Chronic scarcity, low trust (amoral familism)",
        levers=lv(scarcity=8, rule_of_law=1, kin_intensity=6, stakes=6, contact=1, market=2),
        probe=(-20, 10, -10, 20),
        text="Banfield's village: maximise the material advantage of the nuclear family, assume others do "
             "the same. Explained by precarity plus distrust, not by moral ignorance.",
        try_="Raise Rule of law to 9 over several runs (population view) and watch the trust radius grow.",
        grade="mixed",
    ),
    "honour": dict(
        title="Honour culture insult",
        levers=lv(kin_intensity=6, ingroup=7, outrage=7, rule_of_law=1, surveillance=1, conformity=7, threat=4),
        probe=(-40, 10, -30, 40),
        text="Herding ecologies with weak states: reputation for retaliation is protection. "
             "Cohen & Nisbett found insulted Southern US men showed cortisol and testosterone responses.",
        try_="Raise Rule of law: the ecological reason for honour weakens.",
        grade="mixed",
    ),
    "sacred": dict(
        title="Sacred value offered a price",
        levers=lv(religion=8, ingroup=8, market=8, threat=5),
        probe=(0, 70, -40, 70),
        text="Ginges et al. 2007: offering material compensation to give up a sacred value increased "
             "opposition and outrage. In the model, market pressure on a sacralised point reverses sign.",
        try_="Move the probe to w = -40 (non-sacralised) and the same market lever pulls toward calculation.",
        grade="mixed",
    ),
    "war_fusion": dict(
        title="Wartime identity fusion",
        levers=lv(threat=9, ingroup=9, propaganda=5, authority=5),
        probe=(20, 40, 0, 20),
        text="Fused frontline fighters report willingness to die for the group; war exposure raises ingroup "
             "egalitarianism and parochialism together.",
        try_="Start the probe at x=-90 (a selfish person): the threat pulls them outward to the group.",
        grade="robust",
    ),
    "outrage": dict(
        title="Online outrage pile-on",
        levers=lv(outrage=8, anonymity=7, conformity=8, ingroup=7, contact=1, delib=2),
        probe=(30, 30, 0, 0),
        text="Outrage expressions are socially rewarded (likes), which trains more outrage; targets are "
             "excluded from scope while participants feel maximally righteous.",
        try_="Check the felt-objectivity readout: outrage + consensus make judgements feel like facts.",
        grade="robust",
    ),
    "pandemic": dict(
        title="Epidemic purity turn",
        levers=lv(pathogen=9),
        probe=(20, 10, 0, -20),
        traits=dict(disgust=1.0),
        text="Contagion threat shifts moral weight toward purity, local custom and outgroup avoidance.",
        try_="Set trait disgust sensitivity to -2: same epidemic, much smaller shift.",
        grade="mixed",
    ),
    "trolley": dict(
        title="Sacrificial dilemma under time pressure",
        levers=lv(delib=1, empathy_i=6, empathy_b=4),
        probe=(40, 30, 0, -20),
        text="Greene's dual-process account: fast affective aversion to personal harm vs slower "
             "cost-benefit reasoning. Load and time-pressure effects are real but smaller than first reported.",
        try_="Raise Deliberation to 9: the probe moves toward the reflective, impartial region.",
        grade="mixed",
    ),
    "ea": dict(
        title="Impartial effective giving",
        levers=lv(delib=9, education=9, empathy_b=9, empathy_i=4, market=6, rule_of_law=9, scarcity=0, ingroup=2),
        probe=(0, 20, 20, 0),
        text="Reflective universalism needs security, abstraction training and broad empathy — "
             "remove them and it doesn't survive.",
        try_="Add Scarcity 8 and watch the reflective region lose its pull.",
        grade="mixed",
    ),
    "markets": dict(
        title="Fairness to strangers (market integration)",
        levers=lv(market=9, rule_of_law=6, religion=5, kin_intensity=1),
        probe=(-40, 0, -20, 20),
        text="Across 15 small-scale societies, market integration and world-religion participation "
             "predicted fairer offers to anonymous strangers.",
        try_="Set Market to 0 and Kinship intensity to 8: stranger fairness recedes.",
        grade="robust",
    ),
    "animals": dict(
        title="Expanding circle: sentient beings",
        levers=lv(contact=8, education=8, delib=7, empathy_b=9, empathy_i=5, rule_of_law=8, scarcity=0),
        probe=(40, 40, 20, -40),
        text="Scope extending beyond humans tracks security, education and exposure — the same "
             "levers that extended it across ethnic lines.",
        try_="Raise Scarcity or Threat: the outer circle is the first to go.",
        grade="mixed",
    ),
    "theocracy": dict(
        title="Theocratic order",
        levers=lv(religion=9, authority=7, surveillance=7, pathogen=4, ingroup=7, conformity=8, market=2),
        probe=(20, 20, 20, 0),
        text="Sanctity-weighted, strongly bound, with morality experienced as given rather than chosen "
             "(high felt objectivity).",
        try_="Add Contact 8: felt objectivity drops (Sarkissian et al. 2011).",
        grade="mixed",
    ),
}

CASES["dispute"] = dict(
    title="Two sides of a contested issue (disagreement geometry)",
    levers=lv(outrage=5, conformity=6, ingroup=6, contact=1),
    probe=(-30, 75, -55, 70),
    probe_b=(55, 55, 45, -45),
    text="The same policy question judged from two configurations: A — a sacralised, intuitive, "
         "community-scoped judgement; B — a broad, reasoned, individualising one. They are not disagreeing "
         "about one fact; they differ in who counts, which values weigh, and how the question should be decided.",
    try_="Raise Positive outgroup contact and lower Outrage: watch the A–B distance after drift and the "
         "intensity level fall. Raise Ingroup identity past 6: fusion makes it intractable.",
    grade="mixed",
    note="Distance predicts mutual unintelligibility; sacralisation, fusion and enforcement coupling predict "
         "intensity (Tetlock 2003; Ginges et al. 2007; Swann et al. 2012; Graham, Haidt & Nosek 2009).",
)
CASES["reform"] = dict(
    title="Reform movement and principled dissent",
    levers=lv(contact=6, empathy_i=6, empathy_b=8, education=6, outrage=4, delib=5, conformity=5),
    probe=(-30, 10, -20, 30),
    influences=[dict(type="attractor", strength=0.8, radius=45, axis="x", pos=[55.0, 60.0, 20.0]),
                dict(type="amplifier", strength=0.6, radius=40, axis="x", pos=[0.0, 20.0, 0.0])],
    text="A consistent minority of exemplars (attractor #1) plus media attention (amplifier bomb #2) and "
         "rising contact: the moral circle widens without anyone discovering a new fact — the conditions "
         "and the exemplars changed (Moscovici on minority influence; abolition and civil-rights histories).",
    try_="Switch to Population view and press Play; then remove the exemplar (Influences → Undo) and rerun.",
    grade="mixed",
)

# Ecologies for the objectivity test: whole societies as lever bundles.
ECOLOGIES = {
    "Secure market democracy": zero(rule_of_law=9, surveillance=3, market=9, kin_intensity=1, religion=2,
                                    ingroup=3, contact=7, conformity=3, education=8, delib=6, empathy_b=6,
                                    empathy_i=4, pathogen=1, scarcity=1),
    "Kin-intensive agrarian": zero(scarcity=5, rule_of_law=2, market=2, kin_intensity=9, religion=6,
                                   ingroup=7, contact=1, conformity=7, education=2, pathogen=5, empathy_i=4,
                                   empathy_b=2, delib=3),
    "Pastoral honour": zero(scarcity=5, threat=5, rule_of_law=1, kin_intensity=7, ingroup=8, surveillance=1,
                            outrage=4, conformity=6, empathy_i=3, empathy_b=2, delib=3, education=2),
    "Wartime mobilisation": zero(threat=9, authority=7, propaganda=6, ingroup=9, conformity=7,
                                 surveillance=6, rule_of_law=4, delib=3, education=4, empathy_i=3, empathy_b=3),
    "Chronic scarcity, low trust": zero(scarcity=8, rule_of_law=1, kin_intensity=6, stakes=6, contact=1,
                                        conformity=4, delib=3, education=2, empathy_i=3, empathy_b=2),
    "Theocratic order": zero(religion=9, authority=7, surveillance=7, pathogen=4, ingroup=7, conformity=8,
                             market=2, rule_of_law=5, delib=3, education=3, empathy_i=3, empathy_b=4),
    "Acute disaster, shared fate": zero(scarcity=7, shared_fate=9, rule_of_law=5, empathy_i=6, empathy_b=6,
                                        conformity=5, delib=3, education=4),
}

# Reversal test: security builds, then is withdrawn.
REVERSAL_PHASES = [
    ("Precarity", ECOLOGIES["Chronic scarcity, low trust"], 40),
    ("Security + trust", ECOLOGIES["Secure market democracy"], 60),
    ("War returns", ECOLOGIES["Wartime mobilisation"], 50),
    ("Peace restored", ECOLOGIES["Secure market democracy"], 50),
]

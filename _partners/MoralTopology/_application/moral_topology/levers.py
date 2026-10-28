"""Lever (situational parameter) and trait definitions, with mechanism and evidence notes.

Levers are 0-10 in the UI and 0-1 inside the model. Traits are individual differences in
standard-deviation units (-3..+3) that modulate how strongly a person responds to each lever.

Evidence grades: robust = replicated / meta-analytic support; mixed = real but contested in size or
generality; contested = plausible but replication problems — used lightly and flagged.
"""

from dataclasses import dataclass


@dataclass(frozen=True)
class Lever:
    key: str
    label: str
    group: str
    default: int
    mechanism: str
    evidence: str
    grade: str


LEVER_GROUPS = ("Ecology", "Institutions", "Social field", "Individual state", "Process")

LEVERS = [
    # --- Ecology -------------------------------------------------------------
    Lever("scarcity", "Scarcity / precarity", "Ecology", 0,
          "Narrows scope toward kin, then self past a collapse threshold; taxes cognitive bandwidth; "
          "under low trust shifts binding to enforcement.",
          "Life-history theory; Mani et al. 2013 (bandwidth); Banfield 1958 (amoral familism).", "mixed"),
    Lever("threat", "Violent intergroup threat", "Ecology", 0,
          "Pulls scope TO the ingroup from both sides (selfish agents widen, universalists narrow); "
          "raises loyalty/authority; fast processing.",
          "Bauer et al. 2016 meta-analysis (war → ingroup cooperation); Choi & Bowles 2007 (parochial altruism).",
          "robust"),
    Lever("pathogen", "Disease / contagion threat", "Ecology", 0,
          "Behavioural immune system: raises purity/sanctity, outgroup avoidance, conformity to local custom.",
          "Schaller & Park 2011; Fincher & Thornhill 2012; van Leeuwen et al. 2012.", "mixed"),
    Lever("shared_fate", "Shared fate / common predicament", "Ecology", 0,
          "Re-draws the ingroup around everyone in the same boat; converts scarcity's contraction into "
          "communal expansion (disaster communitas).",
          "Drury et al. 2009 (crowd resilience); Gaertner & Dovidio (common ingroup identity); "
          "Quarantelli (panic myth).", "robust"),
    # --- Institutions --------------------------------------------------------
    Lever("rule_of_law", "Rule of law / institutional trust", "Institutions", 5,
          "Extends the trust radius to strangers; reduces coercion needed; lowers volatility; "
          "weakens reliance on cohesive foundations.",
          "Herrmann, Thöni & Gächter 2008 (antisocial punishment); Enke 2019; Gächter & Schulz 2016.", "robust"),
    Lever("surveillance", "Surveillance / sanction certainty", "Institutions", 3,
          "Moves binding external; crowds out intrinsic motivation; behaviour held this way collapses "
          "when monitoring stops.",
          "Gneezy & Rustichini 2000; Frey & Jegen 2001 (crowding out); Bateson et al. 2006 (watching eyes, mixed).",
          "robust"),
    Lever("authority", "Authority command", "Institutions", 0,
          "Threshold 'agentic shift': responsibility displaced upward, victim drops out of scope, "
          "deliberation suspended. Resisted by victim proximity and trait autonomy.",
          "Milgram 1963/1974; Burger 2009 partial replication; Haslam & Reicher 2012 (engaged followership).",
          "mixed"),
    Lever("market", "Market integration", "Institutions", 4,
          "Fair dealing with strangers; calculative processing; individualising fairness. "
          "Backfires on sacralised values (taboo trade-offs).",
          "Henrich et al. 2010 (15 societies); Ginges et al. 2007 (sacred-value backfire); Tetlock 2003.",
          "robust"),
    Lever("kin_intensity", "Kinship intensity", "Institutions", 3,
          "Clan/cousin-marriage structures keep scope at kin, bind by shame and conformity, raise loyalty.",
          "Schulz et al. 2019 (Science); Enke 2019.", "robust"),
    Lever("religion", "Moralising religion / ritual", "Institutions", 3,
          "Supernatural monitoring extends cooperation to co-religionists (bounded); internalises binding; "
          "raises sanctity/authority.",
          "Norenzayan 2013; Purzycki et al. 2016 (Nature).", "mixed"),
    # --- Social field --------------------------------------------------------
    Lever("ingroup", "Ingroup identity salience", "Social field", 4,
          "Pulls scope to the ingroup; above a threshold, with internalised binding, identity fusion "
          "self-reinforces (sacrifice, sacred values).",
          "Tajfel & Turner; Swann et al. 2012 (identity fusion); Whitehouse 2018.", "robust"),
    Lever("contact", "Positive outgroup contact", "Social field", 3,
          "Widens scope, reduces purity weighting and felt moral objectivity; stronger with institutional support.",
          "Pettigrew & Tropp 2006 meta-analysis; Sarkissian et al. 2011 (exposure → relativism).", "robust"),
    Lever("propaganda", "Dehumanising propaganda", "Social field", 0,
          "Excludes the target from scope but RAISES conviction: violence becomes righteous, not amoral. "
          "Stronger when authority-backed; contact inoculates.",
          "Bandura 1999 (moral disengagement); Fiske & Rai 2014 (virtuous violence); "
          "Yanagizawa-Drott 2014 (RTLM radio, Rwanda).", "robust"),
    Lever("conformity", "Conformity / perceived consensus", "Social field", 4,
          "Pulls each agent toward the local norm (population neighbours, or the everyday norm for a lone probe).",
          "Asch 1956; Cialdini et al. 1990 (descriptive norms); Bond & Smith 1996 meta-analysis.", "robust"),
    Lever("anonymity", "Anonymity / deindividuation", "Social field", 0,
          "Removes reputational constraint: externally bound agents slide to self-scope; "
          "internally bound agents are unaffected — anonymity reveals which kind of binding held.",
          "Zhong et al. 2010; Postmes & Spears 1998 meta-analysis (SIDE model).", "mixed"),
    Lever("diffusion", "Diffusion of responsibility", "Social field", 0,
          "Many bystanders: personal scope of responsibility shrinks, agents look to others. "
          "Attenuated when danger is clear.",
          "Darley & Latané 1968; Fischer et al. 2011 meta-analysis.", "robust"),
    # --- Individual state ----------------------------------------------------
    Lever("empathy_i", "Empathy intensity", "Individual state", 3,
          "Affective, felt concern. A spotlight: with low breadth it narrows to the identifiable victim; "
          "with high breadth it widens scope.",
          "Batson et al. 1995 (empathy-induced unfairness); Bloom 2016; Small & Loewenstein 2003.", "robust"),
    Lever("empathy_b", "Empathy breadth", "Individual state", 4,
          "Who the empathy is allocated to: parochial ↔ universal.",
          "Oliner & Oliner 1988 ('extensivity'); Crimston et al. 2016 (moral expansiveness).", "mixed"),
    Lever("delib", "Deliberation capacity / time", "Individual state", 3,
          "Raises reflective processing. Direction of reasoning depends on stakes: with low stakes it "
          "tends to impartiality; with high personal stakes it becomes motivated reasoning toward self.",
          "Greene et al. 2001/2008; Kunda 1990; Haidt 2001 (social intuitionism).", "mixed"),
    Lever("outrage", "Moral outrage (anger)", "Individual state", 0,
          "Fast, righteous, punitive; raises conviction and cohesion; the target leaves scope.",
          "Crockett 2017; Brady et al. 2021 (social reinforcement of outrage).", "robust"),
    Lever("stakes", "Personal stakes / temptation", "Individual state", 0,
          "Pulls scope toward self and binding toward detection calculus — resisted in proportion to "
          "internalised binding (people cheat 'a little', to stay good in their own eyes).",
          "Becker 1968; Mazar, Amir & Ariely 2008 (self-concept maintenance).", "mixed"),
    Lever("power", "Power over others", "Individual state", 0,
          "Amplifier, not a direction: multiplies whatever forces already act; reduces perspective-taking "
          "and exposure to sanctions.",
          "Chen, Lee-Chai & Bargh 2001; Keltner et al. 2003; Galinsky et al. 2006.", "mixed"),
    Lever("education", "Education / abstraction training", "Individual state", 3,
          "Hypothetical, decontextualised reasoning; modest widening of scope.",
          "Luria 1976; Flynn 2007; Enke et al. (universalism & education).", "mixed"),
    # --- Process -------------------------------------------------------------
    Lever("escalation", "Gradual escalation", "Process", 0,
          "Each small step re-anchors what counts as normal, so the restoring pull follows the agent; "
          "amplifies authority and conformity.",
          "Freedman & Fraser 1966 (foot-in-the-door); Milgram increments; Browning 1992.", "mixed"),
    Lever("noise", "Unmodelled variability", "Process", 2,
          "Idiosyncratic, unmeasured influences (mood, framing, history). Explicitly naturalistic noise, "
          "not a moral-truth term.",
          "—", "n/a"),
]

LEVER_BY_KEY = {lv.key: lv for lv in LEVERS}
LEVER_KEYS = [lv.key for lv in LEVERS]
DEFAULT_LEVERS = {lv.key: lv.default for lv in LEVERS}


@dataclass(frozen=True)
class Trait:
    key: str
    label: str
    mechanism: str


TRAITS = [
    Trait("empathy", "Trait empathic concern", "Stronger empathy effects; widens baseline scope; resists authority."),
    Trait("nfc", "Need for cognition", "Stronger deliberation; resists authority and propaganda."),
    Trait("disgust", "Disgust / threat sensitivity", "Stronger pathogen, threat and propaganda effects."),
    Trait("conform", "Conformity orientation", "Stronger conformity and authority effects."),
    Trait("sdo", "Social dominance orientation", "Stronger authority/propaganda effects; weaker contact effect."),
]
TRAIT_KEYS = [t.key for t in TRAITS]


def to_unit(levers_0_10):
    """UI lever dict (0-10) -> model dict (0-1), filling any missing key with its default."""
    return {k: float(levers_0_10.get(k, DEFAULT_LEVERS[k])) / 10.0 for k in LEVER_KEYS}

"""Geometry of the moral decision space: axes, bands, octants, regimes, located moral theories."""

import numpy as np

SCALE = 100.0
AXES = ("x", "y", "z", "w")
AXIS_INDEX = {a: i for i, a in enumerate(AXES)}

AXIS_TITLES = {
    "x": "Scope (Self ↔ Sentient)",
    "y": "Binding (External ↔ Internalised)",
    "z": "Processing (Intuitive ↔ Deliberative)",
    "w": "Foundation tilt (Individualising ↔ Cohesive)",
}

# Scope bands: who counts. Positions are the targets forces pull toward.
X_SELF, X_KIN, X_INGROUP, X_SOCIETY, X_HUMANITY, X_SENTIENT = -90.0, -65.0, -35.0, 0.0, 60.0, 90.0

AXIS_TICKS = {
    "x": ([X_SELF, X_KIN, X_INGROUP, X_SOCIETY, X_HUMANITY, X_SENTIENT],
          ["Self", "Kin", "Ingroup", "Society", "Humanity", "Sentient"]),
    "y": ([-90, -45, 0, 45, 90], ["Coerced", "Sanctioned", "Mixed", "Identity", "Conviction"]),
    "z": ([-90, -45, 0, 45, 90], ["Reflex", "Intuitive", "Mixed", "Reasoned", "Reflective"]),
}

def band(axis, v):
    v = float(v)
    if axis == "x":
        if v <= -78:
            return "Self"
        if v <= -50:
            return "Kin / intimates"
        if v <= -17:
            return "Ingroup / community"
        if v <= 30:
            return "Society / co-members"
        if v <= 75:
            return "Humanity"
        return "All sentient beings"
    if axis == "y":
        if v <= -60:
            return "Coerced (sanction / force)"
        if v <= -20:
            return "Mostly external (reputation, rules)"
        if v <= 20:
            return "Mixed"
        if v <= 60:
            return "Mostly internalised (identity)"
        return "Conviction / sacred"
    if axis == "z":
        if v <= -60:
            return "Reflexive / affective"
        if v <= -20:
            return "Mostly intuitive"
        if v <= 20:
            return "Dual-process"
        if v <= 60:
            return "Mostly deliberative"
        return "Reflective / abstract"
    if v <= -50:
        return "Individualising (care / fairness)"
    if v <= -15:
        return "Leans individualising"
    if v <= 15:
        return "Balanced"
    if v <= 50:
        return "Leans cohesive"
    return "Cohesive (loyalty / authority / sanctity)"


# ---------------------------------------------------------------------------
# Octants: the eight "decision potentials" of the (x, y, z) space.
# ---------------------------------------------------------------------------
OCTANTS = {
    (-1, -1, -1): dict(
        name="Compliance under pressure",
        desc="Concern narrowed; behaviour held by command, threat or punishment; fast heuristics.",
        acts="Following orders; hoarding under collapse; informing to save oneself.",
    ),
    (-1, -1, +1): dict(
        name="Strategic self-interest",
        desc="Rules are costs; the question is detection probability times penalty.",
        acts="Tax-evasion calculus; opportunistic fraud; 'is it worth the risk?'.",
    ),
    (-1, +1, -1): dict(
        name="Felt local obligation",
        desc="Felt, unquestioned duty to family, community or team; from everyday kindness to honour and sacrifice.",
        acts="Helping neighbours; protecting kin against the law; self-sacrifice for comrades.",
    ),
    (-1, +1, +1): dict(
        name="Principled partisanship",
        desc="Reasoned, self-endorsed commitment to one's group or cause.",
        acts="Party ideologue; communitarian activist; principled nationalist.",
    ),
    (+1, -1, -1): dict(
        name="Conventional civic conformity",
        desc="Broad impersonal norms followed by habit and expectation of others.",
        acts="Queueing; paying fares unobserved-ish; 'what decent people do'.",
    ),
    (+1, -1, +1): dict(
        name="Contractual impartiality",
        desc="Impartial rules applied because the system requires; procedural fairness.",
        acts="Judge applying law; compliance officer; blind grading.",
    ),
    (+1, +1, -1): dict(
        name="Intuitive compassion",
        desc="Spontaneous felt concern for strangers; action without calculation.",
        acts="Stranger rescue (Carnegie heroes); rescuers of persecuted neighbours.",
    ),
    (+1, +1, +1): dict(
        name="Reflective universalism",
        desc="Reasoned, internalised impartial concern.",
        acts="Principled dissent; impartial philanthropy; ethical veganism.",
    ),
}


def octant_of(x, y, z):
    key = (1 if x >= 0 else -1, 1 if y >= 0 else -1, 1 if z >= 0 else -1)
    return key, OCTANTS[key]


# ---------------------------------------------------------------------------
# Regime clouds: empirically recognisable clusters of decision configurations.
# centre = (x, y, z, w); spread = (sx, sy, sz)
# ---------------------------------------------------------------------------
REGIMES = [
    dict(name="Local-cooperative (everyday)", center=(-25, 25, -25, 5), spread=(18, 16, 18), color="#2e8b57",
         desc="Reciprocity and reputation among familiars; the default cooperation core."),
    dict(name="Survival / self-scope", center=(-82, -45, -65, 35), spread=(12, 15, 14), color="#333333",
         desc="Scarcity and threat collapse scope and horizon."),
    dict(name="Agentic state (authority)", center=(-30, -75, -45, 55), spread=(14, 10, 14), color="#b22222",
         desc="Responsibility displaced up a hierarchy (Milgram)."),
    dict(name="Honour / reputation", center=(-55, -15, -45, 60), spread=(14, 16, 14), color="#8b4513",
         desc="Shame-based, reputation-enforced kin/clan loyalty."),
    dict(name="Fused / sacrificial", center=(-35, 85, -65, 75), spread=(12, 8, 12), color="#daa520",
         desc="Identity fusion and sacred values; willingness to die for the group."),
    dict(name="Market-contractual", center=(35, -25, 45, -40), spread=(16, 16, 14), color="#4682b4",
         desc="Fair dealing with strangers, enforced by contract and reputation."),
    dict(name="Civic-institutional", center=(35, 10, 15, -15), spread=(16, 16, 16), color="#6a5acd",
         desc="Impersonal prosociality under trusted institutions."),
    dict(name="Universal-reflective", center=(75, 65, 70, -45), spread=(12, 12, 12), color="#4b0082",
         desc="Broad, internalised, reasoned impartial concern."),
    dict(name="Intuitive rescuer", center=(65, 70, -45, -40), spread=(12, 12, 14), color="#008b8b",
         desc="Extensive, felt care for strangers; heroism is usually fast, not reasoned."),
    dict(name="Righteous outrage", center=(-10, 70, -70, 45), spread=(16, 12, 12), color="#ff6347",
         desc="Moralised anger; high conviction, low deliberation, target excluded from scope."),
]


# ---------------------------------------------------------------------------
# Normative theories located in the space (interpretive placement).
# Each has been proposed as THE objective morality; they sit in different places.
# ---------------------------------------------------------------------------
THEORIES = [
    dict(name="Kantian deontology", pos=(70, 85, 80, -30)),
    dict(name="Utilitarianism", pos=(90, 40, 90, -70)),
    dict(name="Divine command", pos=(0, 10, -10, 80)),
    dict(name="Natural-law tradition", pos=(10, 50, 35, 60)),
    dict(name="Confucian role ethics", pos=(-25, 45, 10, 55)),
    dict(name="Honour code", pos=(-55, -20, -50, 60)),
    dict(name="Hobbesian contract", pos=(30, -60, 70, 0)),
    dict(name="Ubuntu", pos=(5, 60, -30, 20)),
    dict(name="Ethical egoism", pos=(-85, 60, 60, -40)),
    dict(name="Care ethics", pos=(-15, 70, -30, -40)),
]
THEORY_BY_NAME = {t["name"]: t for t in THEORIES}


def nearest_regime(p):
    p = np.asarray(p, dtype=float)[:3]
    best = min(REGIMES, key=lambda r: float(np.linalg.norm(p - np.asarray(r["center"][:3]))))
    return best, float(np.linalg.norm(p - np.asarray(best["center"][:3])))

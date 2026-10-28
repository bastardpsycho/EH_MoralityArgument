"""The force model: every drift is a sum of named naturalistic components.

Most forces are *target pulls*: force = gain * k_axis * (target_axis - state_axis). A pull has a
place it drags decisions toward, weakens as the decision arrives, and never pushes past it. When
only pulls act, the equilibrium is the gain-weighted average of their targets, so a moral position
is a negotiated resultant of the pressures on the person.

Lever gains are convex (1.5 * L^2): intense situational pressures dominate construal, background
ones recede (Ross & Nisbett, "the power of the situation"). Moderators such as (1 - trust) stay linear.

Non-linear terms (thresholds, state-dependent gates, sacred-value backfire, identity fusion,
anonymity acting only on externally bound agents, power as an amplifier, conformity coupling)
create multiple attractors, hysteresis and path dependence.

Shapes: S is (N, 4) states [x, y, z, w]; Tr is (N, 5) traits [empathy, nfc, disgust, conform, sdo].
L is a dict of lever values in 0-1 (see levers.to_unit).
"""

import numpy as np

from .space import X_INGROUP, X_KIN, X_SELF, X_SOCIETY, SCALE

# Everyday cooperation core: where reciprocity / reputation among familiars settles people.
CORE = np.array([-30.0, 20.0, -20.0, 0.0])
# Default perceived norm for a lone probe (no population to conform to).
EVERYDAY_NORM = np.array([-20.0, 15.0, -15.0, 5.0])
# Strength of the pull back to a person's own socialised position (person-situation balance).
DISPOSITION_K = 0.8
# Per-step rate at which a person's disposition absorbs where they have been (habit / socialisation).
HABIT_RATE = 0.004

COMPONENTS = [
    # key, label, mechanism (one line, used in the automatic explanation)
    ("core", "Cooperation core", "evolved kin-, reciprocity- and reputation-based cooperation pulls toward the local community"),
    ("disposition", "Personal disposition", "upbringing and habit pull the person back toward who they already are"),
    ("scarcity", "Scarcity", "scarcity narrows who counts and taxes deliberative bandwidth"),
    ("shared_fate", "Shared fate", "a common predicament redraws the ingroup around everyone affected"),
    ("threat", "Intergroup threat", "violent threat pulls concern to the ingroup and raises loyalty/authority"),
    ("pathogen", "Pathogen threat", "the behavioural immune system raises purity concerns and outgroup avoidance"),
    ("rule_of_law", "Rule of law", "trusted institutions extend the trust radius to strangers"),
    ("surveillance", "Surveillance", "sanction certainty moves binding outside the person"),
    ("authority", "Authority", "the agentic shift displaces responsibility up the hierarchy"),
    ("market", "Market integration", "market exchange rewards calculative fairness with strangers"),
    ("kin_intensity", "Kinship intensity", "clan structures keep concern at kin and bind by shame"),
    ("religion", "Moralising religion", "shared supernatural monitoring internalises norms for co-religionists"),
    ("ingroup", "Ingroup identity", "salient identity pulls concern to the group; fusion hardens commitment"),
    ("contact", "Outgroup contact", "positive contact widens the moral circle"),
    ("propaganda", "Dehumanisation", "dehumanising narratives exclude targets while raising righteous conviction"),
    ("conformity", "Conformity", "people converge on what they see others doing"),
    ("anonymity", "Anonymity", "without reputational stakes, externally held norms fall away"),
    ("diffusion", "Diffusion of responsibility", "among many bystanders, 'someone else will' shrinks personal scope"),
    ("empathy", "Empathy", "felt concern spotlights its target: narrow or wide depending on breadth"),
    ("deliberation", "Deliberation", "reasoning raises reflection, toward impartiality or self-serving justification by stakes"),
    ("education", "Education", "abstraction training supports hypothetical, impartial framing"),
    ("outrage", "Moral outrage", "anger makes judgement fast, righteous and exclusionary"),
    ("stakes", "Personal stakes", "temptation pulls toward self in proportion to how external the binding is"),
    ("internalization", "Dissonance internalisation", "moderate outside pressure makes people adopt the norm as their own"),
    ("objective", "Objective attractor (HYPOTHESIS)", "a condition-independent pull toward a fixed 'true' morality"),
    ("influences", "Placed influences", "local sources (leaders, institutions, media) act within their reach"),
    ("power", "Power amplification", "power amplifies whatever forces already act and reduces perspective-taking"),
]
COMPONENT_LABEL = {k: lbl for k, lbl, _ in COMPONENTS}
COMPONENT_MECH = {k: m for k, _, m in COMPONENTS}

INFLUENCE_TYPES = {
    "attractor": "Attractor (leader / exemplar)",
    "repeller": "Repeller (stigma / taboo)",
    "amplifier": "Amplifier bomb (salience spotlight)",
    "stabiliser": "Stabiliser (institution / damping)",
    "polariser": "Polariser (echo chamber split)",
}


def sigmoid(v):
    return 1.0 / (1.0 + np.exp(-np.clip(v, -60, 60)))


def pull(S, gain, **axes):
    """gain * k * (target - S) on chosen axes. axes: x=(target, k) ... ; gain scalar or (N,)."""
    out = np.zeros_like(S)
    for name, (target, k) in axes.items():
        i = "xyzw".index(name)
        out[:, i] = k * (target - S[:, i])
    g = np.asarray(gain, dtype=float)
    return out * (g[:, None] if g.ndim == 1 else g)


def zero_traits(n):
    return np.zeros((n, 5))


def _gaussian_reach(S, pos, radius):
    d2 = np.sum((S[:, :3] - np.asarray(pos, dtype=float)[None, :3]) ** 2, axis=1)
    return np.exp(-d2 / (2.0 * radius * radius))


def gain(v):
    """Convex situational salience: 0.3 -> 0.14, 0.5 -> 0.38, 1.0 -> 1.5."""
    return 1.5 * v * v


def components(S, L, Tr=None, *, norm=None, home=None, objective=None, influences=()):
    """Return an ordered dict {component_key: (N, 4) array}. Their sum is the mean drift.

    home: (N, 4) personal disposition anchors (None = no specific person, e.g. the field view).
    """
    S = np.atleast_2d(np.asarray(S, dtype=float))
    n = S.shape[0]
    Tr = zero_traits(n) if Tr is None else np.atleast_2d(Tr)
    x, y, z, w = S.T
    E, NFC, DS, CF, SDO = Tr.T

    ext = sigmoid(-y / 20.0)           # how externally held the binding is (0..1)
    ext_sharp = sigmoid(-(y + 5.0) / 8.0)   # sharp version: 'held mainly by outside eyes' 
    inte = 1.0 - ext

    s, F, V, P = L["scarcity"], L["shared_fate"], L["threat"], L["pathogen"]
    T, M, A, K = L["rule_of_law"], L["surveillance"], L["authority"], L["market"]
    Q, R, G, C = L["kin_intensity"], L["religion"], L["ingroup"], L["contact"]
    H, Nf, Y, B = L["propaganda"], L["conformity"], L["anonymity"], L["diffusion"]
    Ei, Eb, D, O = L["empathy_i"], L["empathy_b"], L["delib"], L["outrage"]
    I, W, U, X = L["stakes"], L["power"], L["education"], L["escalation"]

    out = {}

    # Cooperation core (always on): universal, evolved. Its exact target is temperament-dependent
    # (political/moral orientations are ~30-40% heritable: Hatemi et al. 2014; Smith et al. 2011).
    core = np.tile(CORE, (n, 1))
    core[:, 0] += 8.0 * E
    core[:, 1] += 5.0 * E - 8.0 * CF
    core[:, 2] += 15.0 * NFC
    core[:, 3] += 18.0 * DS + 10.0 * SDO - 8.0 * E
    out["core"] = 0.3 * (core - S)
    # Personal disposition: pull back toward the person's socialised home position.
    out["disposition"] = np.zeros_like(S) if home is None else DISPOSITION_K * (np.atleast_2d(home) - S)

    # Scarcity: contraction (kin, then self past collapse), bandwidth tax, enforcement under low trust.
    # Inverted-U: moderate scarcity consolidates the ingroup; past the collapse threshold scope falls to self.
    collapse = s * sigmoid((s - 0.8) / 0.05)
    out["scarcity"] = (pull(S, gain(s) * (1 - F) * (1 - collapse), x=(X_INGROUP, 0.6))
                       + pull(S, collapse * (1 - F), x=(X_SELF, 0.9))
                       + pull(S, gain(s), z=(-60.0, 0.5), w=(40.0, 0.25))
                       + pull(S, gain(s) * (1 - T), y=(-60.0, 0.4)))

    # Shared fate: common-ingroup expansion, stronger when the predicament is severe.
    out["shared_fate"] = pull(S, gain(F) * (0.3 + 0.7 * s), x=(X_SOCIETY, 0.6), y=(40.0, 0.3))

    # Intergroup threat: two-sided pull to the ingroup band (parochial altruism).
    g_threat = gain(V) * np.exp(0.3 * DS + 0.2 * SDO)
    out["threat"] = pull(S, g_threat, x=(X_INGROUP, 0.8), y=(-40.0 + 80.0 * G, 0.4),
                         z=(-70.0, 0.6), w=(70.0, 0.6))

    # Pathogen: purity up, outgroup avoidance (only ever narrows scope), local-custom conformity.
    g_path = gain(P) * np.exp(0.5 * DS)
    path = pull(S, g_path, w=(85.0, 0.6), z=(-60.0, 0.35), y=(-10.0, 0.2))
    path[:, 0] += g_path * 0.4 * (np.minimum(x, X_INGROUP) - x)
    out["pathogen"] = path

    # Rule of law: trust radius widens; civic norms internalise; lower reliance on cohesion.
    out["rule_of_law"] = pull(S, gain(T), x=(20.0, 0.45), y=(30.0, 0.3), z=(20.0, 0.2), w=(-20.0, 0.25))

    # Surveillance: external binding; the powerful are less exposed to it.
    m_eff = gain(M) * (1.0 - 0.6 * W)
    out["surveillance"] = pull(S, m_eff, y=(-80.0, 0.7), z=(10.0, 0.2), x=(0.0, 0.15))

    # Authority: agentic shift past a personal threshold (trait-dependent), so a strong command
    # splits a population into compliers and refusers; weakened by victim proximity (empathy intensity).
    theta_a = 0.6 + 0.1 * (NFC + E - CF - SDO)
    g_auth = gain(A) * sigmoid((A - theta_a) / 0.08) * (1.0 - 0.5 * Ei) * (1.0 + X)
    out["authority"] = pull(S, g_auth, y=(-85.0, 0.9), x=(-40.0, 0.5), z=(-40.0, 0.45), w=(60.0, 0.35))

    # Market: stranger fairness, calculative — but taboo trade-offs entrench sacred values.
    sacral = sigmoid((w - 45.0) / 6.0) * sigmoid((y - 45.0) / 6.0)
    out["market"] = (pull(S, gain(K) * (1 - sacral), x=(40.0, 0.45), y=(0.0, 0.25), z=(40.0, 0.35), w=(-40.0, 0.35))
                     + pull(S, gain(K) * sacral, y=(95.0, 2.0), z=(-70.0, 0.3), w=(90.0, 0.6)))

    out["kin_intensity"] = pull(S, gain(Q), x=(X_KIN, 0.6), y=(-30.0, 0.35), z=(-40.0, 0.25), w=(60.0, 0.5))
    out["religion"] = pull(S, gain(R), x=(X_SOCIETY - 5.0, 0.4), y=(60.0, 0.5), z=(-30.0, 0.25), w=(65.0, 0.5))

    # Ingroup identity + fusion (self-reinforcing once binding is internal).
    fusion = sigmoid((G - 0.6) / 0.07) * sigmoid((y - 45.0) / 6.0)
    out["ingroup"] = (pull(S, gain(G), x=(X_INGROUP, 0.5), w=(50.0, 0.4))
                      + pull(S, gain(G) * fusion, y=(95.0, 2.0), z=(-60.0, 0.5)))

    g_contact = gain(C) * (0.4 + 0.6 * T) * np.exp(0.3 * E - 0.3 * SDO)
    out["contact"] = pull(S, g_contact, x=(60.0, 0.5), w=(-30.0, 0.35))

    theta_h = 0.5 + 0.1 * (NFC - SDO - DS) + 0.3 * C       # contact inoculates
    g_prop = gain(H) * (0.6 + 0.4 * A) * sigmoid((H - theta_h) / 0.08)
    out["propaganda"] = pull(S, g_prop, x=(-45.0, 0.7), y=(60.0, 0.45), z=(-70.0, 0.55), w=(80.0, 0.55))

    if norm is None:
        norm = np.tile(EVERYDAY_NORM, (n, 1))
    g_conf = gain(Nf) * np.exp(0.5 * CF) * (1.0 + X)
    out["conformity"] = 0.5 * g_conf[:, None] * (norm - S)

    out["anonymity"] = pull(S, gain(Y) * ext_sharp, x=(X_SELF, 0.6), z=(-40.0, 0.3))
    out["diffusion"] = pull(S, gain(B) * (1.0 - 0.5 * V), x=(-60.0, 0.4), y=(-30.0, 0.25), z=(-20.0, 0.25))

    g_emp = gain(Ei) * np.exp(0.5 * E)
    out["empathy"] = (pull(S, g_emp * (1 - Eb), x=(-50.0, 0.5))
                      + pull(S, g_emp * Eb, x=(80.0, 0.6))
                      + pull(S, g_emp, z=(-60.0, 0.4), y=(50.0, 0.25), w=(-50.0, 0.35)))

    g_del = gain(D) * np.exp(0.4 * NFC)
    out["deliberation"] = (pull(S, g_del, z=(80.0, 0.5), w=(-40.0, 0.2))
                           + pull(S, g_del * (1 - I), x=(50.0, 0.3))
                           + pull(S, g_del * I, x=(-70.0, 0.35)))

    out["education"] = pull(S, gain(U), z=(60.0, 0.3), x=(50.0, 0.25), w=(-30.0, 0.2))
    out["outrage"] = pull(S, gain(O), z=(-80.0, 0.7), y=(80.0, 0.45), x=(-25.0, 0.35), w=(50.0, 0.3))
    # Only agents whose binding is mostly external are fully exposed; the detection calculus in turn
    # externalises binding further — a self-reinforcing slide (corruption trap).
    out["stakes"] = pull(S, gain(I) * (0.15 + 0.85 * ext_sharp), x=(X_SELF, 0.6), y=(-60.0, 1.5), z=(40.0, 0.25))

    # Insufficient justification: moderate pressure (not overwhelming) gets internalised.
    p = float(np.clip((M + A + Nf) / 3.0, 0.0, 1.0))
    out["internalization"] = pull(S, 0.25 * 4.0 * p * (1.0 - p) * ext, y=(60.0, 1.0))

    if objective is not None and objective.get("strength", 0) > 0:
        opos = np.asarray(objective["pos"], dtype=float)
        out["objective"] = 0.6 * float(objective["strength"]) * (opos[None, :] - S)
    else:
        out["objective"] = np.zeros_like(S)

    base = sum(out.values())

    infl = np.zeros_like(S)
    for inf in influences or ():
        g = float(inf.get("strength", 0.5)) * _gaussian_reach(S, inf["pos"], float(inf.get("radius", 25)))
        kind = inf.get("type", "attractor")
        pos3 = np.asarray(inf["pos"], dtype=float)[:3]
        if kind == "attractor":
            infl[:, :3] += 1.2 * g[:, None] * (pos3[None, :] - S[:, :3])
        elif kind == "repeller":
            d = S[:, :3] - pos3[None, :]
            nrm = np.linalg.norm(d, axis=1, keepdims=True) + 1e-6
            infl[:, :3] += 60.0 * g[:, None] * d / nrm
        elif kind == "amplifier":
            infl += 1.5 * g[:, None] * base
        elif kind == "stabiliser":
            infl -= 0.8 * g[:, None] * base
        elif kind == "polariser":
            i = "xyz".index(inf.get("axis", "x"))
            infl[:, i] += 50.0 * g * np.tanh((S[:, i] - pos3[i]) / 10.0)
    out["influences"] = infl

    pre = base + infl
    out["power"] = W * pre + pull(S, gain(W) * (1.0 - 0.5 * np.tanh(E)), x=(-70.0, 0.3))
    return out


def drift(S, L, Tr=None, **kw):
    return sum(components(S, L, Tr, **kw).values())


def noise_sigma(L, S=None, influences=()):
    """Per-unit-time noise scale. Low trust, scarcity, outrage and escalation make choices volatile."""
    base = L["noise"] * (12.0 + 20.0 * (1 - L["rule_of_law"]) + 10.0 * L["scarcity"]
                         + 8.0 * L["outrage"] + 8.0 * L["escalation"])
    if S is None:
        return base
    damp = np.ones(np.atleast_2d(S).shape[0])
    for inf in influences or ():
        if inf.get("type") == "stabiliser":
            damp *= 1.0 - 0.8 * float(inf.get("strength", 0.5)) * _gaussian_reach(
                np.atleast_2d(S), inf["pos"], float(inf.get("radius", 25)))
    return base * damp


def felt_objectivity(S, L):
    """0-1: how much a judgement made here *feels* like a mind-independent fact to the person.

    Two routes (both end in 'this is simply true'):
      intuitive-sacred: conviction arrives as self-evident perception (Skitka 2010; Wright et al. 2013);
      reflective-universal: broad, internalised, reasoned judgement produces justification that reads as
        discovery (cf. PhilPapers 2020: most professional philosophers accept moral realism).
    Both are raised by internalised binding, perceived consensus and epistemic coherence (trust), and
    lowered by exposure to other moral communities (Goodwin & Darley 2012; Sarkissian et al. 2011).
    Mixed, dual-process judgements in the middle of the z axis feel least like facts.
    """
    S = np.atleast_2d(S)
    x, y, z, w = S.T
    intuitive = sigmoid((-z - 20.0) / 20.0) * (0.6 + 0.4 * sigmoid((w - 20.0) / 20.0))
    reflective = sigmoid((z - 20.0) / 20.0) * sigmoid((x - 20.0) / 20.0)
    v = (0.03 * y + 1.3 * intuitive + 1.3 * reflective
         + 1.6 * L["conformity"] + 0.8 * L["rule_of_law"] + 0.8 * L["religion"] + 0.6 * L["outrage"]
         - 1.5 * L["contact"] - 1.9)
    return sigmoid(v)


def moral_strain(S, L, Tr=None):
    """Illustrative 0-1 commitment/pressure index, not a clinical risk estimate."""
    S = np.atleast_2d(S)
    inte = sigmoid((S[:, 1] - 20.0) / 15.0)
    pressure = (L["authority"] + L["surveillance"] * 0.5 + L["propaganda"] * 0.5
                + L["escalation"] * 0.5 + L["stakes"] * 0.5 + L["threat"] * 0.3)
    return np.clip(inte * pressure / 1.8, 0.0, 1.0)


def clamp_state(S):
    return np.clip(S, -SCALE, SCALE)


AXIS_TOPIC = {0: "who counts (scope)", 1: "what makes it binding", 2: "how the question should be decided",
              3: "which values carry weight"}


def sacralisation(S):
    """0-1 non-negotiability: internalised conviction on cohesive/sanctity-weighted content (Tetlock; Atran)."""
    S = np.atleast_2d(S)
    return sigmoid((S[:, 3] - 45.0) / 8.0) * sigmoid((S[:, 1] - 45.0) / 8.0)


def disagreement(A, B, L):
    """Structural account of a disagreement between two decision configurations.

    Distance is the first-order predictor; sacralisation, identity fusion and enforcement coupling modulate
    how intense the conflict becomes.
    """
    A, B = np.asarray(A, float), np.asarray(B, float)
    diff = (A - B) * np.array([1.0, 1.0, 1.0, 0.6])
    dist = float(np.linalg.norm(diff))
    share = diff ** 2 / max(float(np.sum(diff ** 2)), 1e-9)
    P = np.vstack([A, B])
    sac = sacralisation(P)
    fusion = sigmoid((L["ingroup"] - 0.6) / 0.07) * sigmoid((P[:, 1] - 45.0) / 6.0)
    ext = sigmoid(-P[:, 1] / 20.0)
    enforcement = ext * min(1.0, (L["surveillance"] + L["authority"]) / 1.2)
    modifier = 1.0 + 1.5 * float(sac.max()) + 1.0 * float(fusion.mean()) + 0.8 * float(enforcement.mean())
    intensity = (dist / 150.0) * modifier
    if dist == 0:
        level = "No structural separation"
    elif intensity < 0.5:
        level = "Low modeled tension"
    elif intensity < 1.0:
        level = "Moderate modeled tension"
    elif intensity < 1.8:
        level = "High modeled tension"
    else:
        level = "Very high modeled tension"
    return dict(distance=dist, intelligibility=float(np.exp(-dist / 120.0)), share=share,
                main_axis=int(np.argmax(share)) if dist > 0 else None, sacral=sac, fusion=fusion, enforcement=enforcement,
                modifier=modifier, intensity=float(intensity), level=level)

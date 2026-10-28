# Moral Topology v2.1

This folder is a self-contained, dependency-free browser application. Run `npm test` for the model and UI checks, `npm run build` to create the publication allowlist in `site/`, or `npm run dev` to serve the source locally. The public build copies only the seven names exported by `scaffold.mjs`.

Version 2.1 keeps v2's axes (personal agency, preventing harm, shared responsibility), fixed chart bounds and five fictional cases, and adds a sixth, the town from Morality, Between Us. It replaces v2's nine free sliders with four controls whose effects come from the authored case. The design and the reasons for the change are in `_documentation/DESIGN_V2_1.md`; `_documentation/ASTRA_DESIGN.md` describes v2.0 and is kept as history. v2.0 is reproducible from Git (commit `e994a55` on `edition5-revision`, or `main` at the pass013 merge).

The pure model in `model.mjs`:

```text
A1 = A0 + a*dA                 B1 = B0 + b*dB             personal encounters, a, b in [-1, 1]
A2 = R + (1 - r)(A1 - R)       B2 likewise                shared reasons, r in [0, 1]
A  = N + (1 - p)(A2 - N)       B  likewise                shared pressure, p in [-0.5, 1]
|A - B| = |1 - p| * (1 - r) * |A1 - B1|
```

`dA` and `dB` are authored directions: what a plausible version of each encounter would do to that person's emphases. `R` is where the case's shared practical option sits. `N` is the starting position of the side the case's pressure favours. A negative personal value means the encounter backfired; a negative pressure value is backlash, pushing both away from `N`. At full strength the model assumes complete adoption of `R` or `N`, which is an extreme, by construction.

All coordinates, directions, `R`, `N` and influence labels are authored assumptions in signed illustrative units. They are not measurements of people, demographic predictions or assessments of moral worth. A meeting is not agreement. The model's one claim is conditional: if influences work roughly like this, agreement reached through reasons can be told apart from agreement produced by pressure by asking where it lands and who had to move.

Deep links: `?case=<id>` opens a case; `?from=<room>` points the back link at `../#<room>` in Morality, Between Us (lowercase room ids only; anything else is ignored).

The browser stores no user state. "Download local JSON" creates a user-controlled file with an integer epoch-millisecond `ts_ms`, the current controls, the visitor's optional readings of the two personal influences, every stage of the geometry and the exact gap factors. The app makes no network requests and uses no external fonts, scripts or services.

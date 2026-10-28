# Moral Topology v2.2

This folder is a self-contained, dependency-free browser application. Run `npm test` for the model and UI checks, `npm run build` to create the publication allowlist in `site/`, or `npm run dev` to serve the source locally. The public build copies only the seven names exported by `scaffold.mjs`.

v2.2 keeps v2's three axes (personal agency, preventing harm, shared responsibility), fixed ±150 bounds, four projections and coordinate table. It has six cases of two kinds. The design and its history are in `_documentation/DESIGN_V2_1.md` (it covers 2.1 and 2.2); `_documentation/ASTRA_DESIGN.md` describes v2.0. Earlier versions are reproducible from Git.

**Story cases (five).** Two people start far apart, in different octants. Each is moved by three real-life factors, such as a new job, a new partner's family, or a child's illness. Every factor is an authored 3D displacement labelled by the story as carrying reasons, only pushing, or both. The visitor unveils the factors one at a time, and each moves its person automatically; there are no sliders. With every factor included, the pair end up at the same point. Any factor can then be unticked, and "Remove the factors that only push" shows whether the agreement would survive without them. The summary reports, for each person, how much of their movement came from each kind of factor.

```text
end = start + sum of the displacements of the included factors that move this person
```

**Free case (one, three people).** Each person has three signed sliders, one per axis, each labelled with a real influence in that person's life. A three-component global drift moves everyone equally, so it can carry them into the same octant but cannot change their distances. A squeeze pulls everyone towards their centroid:

```text
P1 = P0 + 50 * p                      each person's own influences
C  = centroid of the P1; P2 = C + (1 - s)(P1 - C)
P  = P2 + 25 * g                      the same drift for everyone
every pairwise distance = (1 - s) * its distance after personal influences
```

All people, starting points, factors, displacements, labels and outcomes are authored assumptions in signed illustrative units. They are not measurements of people, demographic predictions or assessments of moral worth. A meeting is not agreement about what anyone should do.

Deep links: `?case=<id>` opens a case. `?from=<room>` points the back link at `../#<room>` in Morality, Between Us; only lowercase room ids are accepted, and anything else is ignored.

The browser stores no user state. "Download local JSON" creates a user-controlled file with an integer epoch-millisecond `ts_ms`, the case, what was unveiled and included (or the free settings), every step and the summary. The app makes no network requests and uses no external fonts, scripts or services. Unveiling animates unless the visitor prefers reduced motion.

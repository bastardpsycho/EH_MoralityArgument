# Moral Topology v2

This folder is a self-contained, dependency-free browser application. Run `npm test` for the model and UI checks, `npm run build` to create the publication allowlist in `site/`, or `npm run dev` to serve the source locally. The public build copies only the seven names exported by `scaffold.mjs`.

Version 2 replaces the earlier model's axes and bindings with personal agency, preventing harm, and shared responsibility. Its signed coordinates and nine controls are not numerically compatible with v1. Do not convert or reinterpret saved v1 coordinates as v2 data. Every case and influence is fictional and authored; the model does not score truth, virtue, policy quality, or personal worth.

The pure model in `model.mjs` applies the three vector families componentwise: each A coordinate is `A0 + 50*a + 25*g`, and each B coordinate is `B0 + 50*b + 25*g`. The identical shared vector translates both points and preserves their complete difference. Axis bounds are fixed at `[-150,150]`, control components at `[-1,1]`, and no endpoint is clipped or autoscaled. Meeting settings are explicit authored witnesses; the controls never move automatically toward one.

The browser stores no user state. “Download local JSON” creates a user-controlled file with an integer epoch-millisecond `ts_ms` and the current assumptions and geometry. The app makes no network requests and uses no external fonts, scripts, or services.

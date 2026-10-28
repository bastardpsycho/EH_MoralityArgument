# Replacing the demo argument

This guide follows the P001 MXDivine extraction guidance in its `VISUAL_ARGUMENT.md`. It is included here so this folder can move without that project. The runtime has no dependency on UPE or MXDivine.

| File | Role and replacement boundary |
| --- | --- |
| `engine.mjs` | Shared WebGL renderer, camera, geometry, picking and textures. Retained unchanged. |
| `rooms.mjs` | Room layouts, palettes, portals, art slots and animations. Keep navigation; replace topic-specific road, village and model-table props when needed. |
| `data.mjs` | Room content, IDs/order, exhibit definitions, objections, values, categories, scoring, choices, wall-art metadata and helpers. Inherited demo fixtures. |
| `sources.mjs` | References and case studies supporting the inherited topic. Replace with sources for the new argument. |
| `app.mjs` | Shared interaction controller alongside topic calculators, labels, score UI and export fields. Replace the topic sections together with the data. |
| `page.mjs` | HTML shell and complete reading guide generator, including topic explanations. Rebuild after editing. |
| `styles.css` | Scene HUD, cards, board, reading layout, responsive and reduced-motion rules. |
| `*.jpg` | Forty wall pictures and one case-study photograph. Replace artwork and `wallArt` metadata together; preserve attribution/licensing for anything kept. |
| `scaffold.mjs` | Standalone package identity, version, demo flag and explicit browser asset list. Keep the list in sync with additions/removals. |
| `scripts/` | Node standard-library build and loopback preview. These operate only within the moved package. |
| `_tests/` | Feature tests adapted to this local package. No source-project catalog or route dependency. |

The `provides`, `design`, `condition` and `office` relations encode the original argument's position. Replacement must consider their meter thresholds, costs, calculators, authored conclusions, reading text, JSON fields and board together. Keeping room IDs as internal geometry keys is practical; changing them also requires updating palettes, art slots, portals and routes.

Persistent downloads use `ts_ms` epoch milliseconds. Animation and timeout clocks remain transient elapsed durations. Choices stay in page memory and clear on reload. There are no accounts, analytics, cookies, application database, storage or service calls. Citation links are ordinary external links opened by the visitor.

The inherited room tests validate retained demo integrity, including topic-specific arithmetic and scoring. When the new content supersedes those contracts, retire the affected tests explicitly and keep applicable geometry, reachability, source-reference, reading parity, two-click collection, image and independence tests. A UPE test enforcing its site-specific image-credit display policy was omitted; provenance records and photo licensing were retained.

After retheming, rebuild and run the feature tests, then check desktop and narrow-screen entry, WebGL navigation, value collection, objections, the final board/export and the reading fallback. No publishing command or remote deployment setup is included.

## MORARG adaptation

The guide above describes the imported skeleton. MORARG now uses `art.mjs` for retained wall metadata, replaces the remote-work content and source library, and replaces value scoring/calculators with sequential response choices and conditional exit review. See `DEVELOPMENT.md` and `ARGUMENT_STRUCTURE.md` for the current contract. `_documentation/preview.png` is the inherited scaffold screenshot; current verification images belong in the per-pass `_output/` directory.

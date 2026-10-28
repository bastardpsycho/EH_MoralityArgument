# Morality, Between Us

A sourced argument about human morality, personal judgment and justifiability to those affected, explored through twelve interactive rooms and a complete reading edition. Serious alternatives, normative commitments and source-access limits stay visible.

The dependency-free static application lives in `_application/`. Browser responses, values and notes remain in page memory; private JSON export uses epoch-millisecond `ts_ms` fields. There is no backend, account, analytics or database.

Research is documented in [`_documentation/ARGUMENT_CORPUS.md`](_documentation/ARGUMENT_CORPUS.md) and the linked primary/evidence reviews. [`_research/`](_research/README.md) additionally preserves the historical source-access snapshots and critique reports, with a 41-source index and a provenance manifest. These records document selected access and continuing limits; they are not an offline collection of the original papers/books.

```sh
npm --prefix _application run build
npm --prefix _application test
npm --prefix _application run dev
```

## Debate Rooms hosting

`_hosting/` packages a separate Engineering Humanity Debate Rooms index and two experiences:

- `https://rooms.engineeringhumanity.org/morality/`: MORARG, copied from the explicit runtime allowlist.
- `https://rooms.engineeringhumanity.org/after-the-commute/`: the preserved After the Commute v03 publication snapshot. Its argument and artwork belong to the original UPE project; `commute-provenance.json` records exact source hashes. Only two catalog-navigation labels change during packaging.

```sh
npm --prefix _application run build:rooms
npm --prefix _application run test:hosting
wrangler deploy --dry-run --no-autoconfig --config _hosting/wrangler.jsonc
```

Deployment instructions and current release status are in `_documentation/HOSTING.md`. This repository contains active application, tests, documentation and the preserved v03 publication assets. Local operational output, credentials, Wrangler caches, source/input and cold storage are excluded.

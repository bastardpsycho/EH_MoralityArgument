# Morality, Between Us

Do we need objective moral facts to settle how we treat each other? A sourced argument in twelve interactive rooms and a complete reading edition. It argues that reasons we can give the people affected, plus an honest account of the pressures on judgment, do every job, and it tests that claim job by job against the strongest objectivist case. Visitors start with twelve value questions, which pre-select principles in each room; at the end they see a ledger of jobs and how their values moved. See `_documentation/ARGUMENT_STRUCTURE.md` and `_documentation/EDITION5_REBUILD.md`.

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

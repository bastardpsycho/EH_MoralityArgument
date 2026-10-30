# Debate Rooms hosting and migration

## Evaluation introduction live release — pass018

Build 0.7.0 / argument edition 5.3 is published at [the new second island](https://debates.engineeringhumanity.org/morality/#evaluation). Fourteen rooms retain stable legacy IDs; the new context room has eight exhibits and five non-ledger decisions. The Operator explicitly authorized the source commits, GitHub push and Cloudflare publication with `monkeyballs`.

Baseline commit `bb66fe7` preserves the previous local migration. Application source `9d6e1810711bd5990a152d5eb52d6821203f4890` is selected by publication configuration commit `d47edf01242ad59085f225aff80d64a7feae8608` with no HTML transform. Both were pushed to main before deployment. Live Rooms/Debates Worker: `3253008c-ec2e-4e89-966b-22225ec15710`; rollback: `898a045c-c2c5-4a62-91f8-2f351ff3b452`. Existing Rooms alias remains. Models and Projects were not redeployed.

All 67 tests pass (40 MORARG, 21 Topology, 2 shared-case, 4 hosting), and all 143 live asset/hash/header/redirect/private-file checks pass. Wrangler uploaded 13 contents and reused 121. Artifact comparison found two new paths, eleven changed paths, no removals and 123 unchanged files; Topology and Commute assets remain byte-identical. Preflight's sole mismatch was generated `build.json.ts_ms`; its remaining fields and every application asset matched the previous live release.

Desktop and 390px browser checks cover the inserted route, all exhibits and decisions, source disclosures, choice revisions, private notes, principles, reading and controls-only views, and actual WebGL movement/look/floor walking. Fresh live room01 loaded with no warning/error logs. Nested branches, stale-response paths and export semantics were checked by automated tests, not a fresh complete browser walkthrough. Focused QA is not a full accessibility audit or visitor study, and publication does not close the existing philosophical review findings. Pass evidence and screenshot are under `_output/pass018_evaluation_codex_20261030_1420Z/`; the exact release receipt is `_hosting/release.json`.

## Previous Debates live release — pass017

The Operator supplied `monkeyballs` and authorized the prepared rename. The public index is now [Debates](https://debates.engineeringhumanity.org/), with MORARG at `/morality/`, Topology at `/morality/topology/` and Commute at `/after-the-commute/`. The existing `rooms` Worker serves the new custom domain and retains the old hostname as a reachable alias. No hostname redirect was added. Direct source URLs now use Debates in the root canonical, Projects button, Models Commute aliases and UPE-owned Projects button generator. The generator updates an already installed button on future runs. Historical release sections below retain their original addresses.

Live versions and rollback versions:

| Worker | Published | Rollback |
| --- | --- | --- |
| rooms (Debates) | `898a045c-c2c5-4a62-91f8-2f351ff3b452` | `e35bebb2-8f32-4c38-81e3-17c12b2d8f8c` |
| models | `710de16c-56cc-419b-aecf-a355806b0d36` | `81363ee7-f0c9-4721-9a79-f269702503ef` |
| projects-for-humanity | `62255d9b-9432-4f21-a915-ea2e174b1fee` | `263b0600-e215-408c-bdd1-2ae3a5e7243b` |

Preflight matched all 351 baseline checks against current production and saved a fresh Projects API baseline. All 357 final migration checks and 141 Debates-specific asset/header/route/private-file checks pass. The Projects API remains byte-identical with 29 entries. Browser checks followed Projects → Debates → MORARG → Topology and the old Models Commute link with `?view=controls#commute`; both query and fragment survive, and its catalog back-link returns directly to Debates. New-host DNS briefly remained negatively cached locally after creation; public DNS and certificate-verified HTTPS were checked, and the final checks pass through normal hostname resolution. The initial DNS-only failed receipt is retained as diagnostic history.

Wrangler uploaded four changed Debates contents and reused 128; Models needed no updated asset contents (redirect configuration only), and Projects uploaded only its changed index and reused 33. MORARG and Topology application sources/versions/publication pin and immutable Commute snapshot are unchanged. Only the generated Commute catalog labels change. Applied source guards and backups are in `_output/pass017_publish_codex_20261029_1446Z/`. The UPE discovery test's old host/label expectation was superseded by the requested rename; its idempotence/destination checks pass. No D1 writes, API/backend/schema edits, unrelated process changes, package installs or Proposals Worker deployment occurred. MORARG-14 is complete. Source edits remain local; this operation did not push GitHub changes.


## Debates hostname preparation — pass016 (historical; published in pass017)

The Operator requested `debates.engineeringhumanity.org` as the public hostname and direct source replacements for old links. A live read-only audit of 46 published text assets, Projects/Models landing pages and two Models redirects confirms no hardcoded Rooms hostname in MORARG, Topology or Commute application assets. Pinned MORARG and Topology text matches local sources exactly. The direct references are the root canonical URL, Projects discovery button, Models Commute redirect targets and the UPE-owned Projects button generator. The new hostname did not resolve at the audit time. Current live Worker remains `e35bebb2-8f32-4c38-81e3-17c12b2d8f8c`, build 0.6.3; `_hosting/release.json` remains the historical live receipt.

The candidate updates the root title/navigation/canonical URL to Debates, corrects its stale twelve-room MORARG description to thirteen, updates the generated Commute back-link labels, hosting aliases and live verifiers, and adds the new custom domain to the same `rooms` Worker. The old custom domain is retained as an alias during cutover; there is no new hostname redirect in this candidate. If a bookmark redirect is later wanted, use a Cloudflare zone redirect rule: Workers static-assets `_redirects` does not support domain-level source rules. All application paths and pinned application versions are preserved.

`node scripts/prepare-debates.mjs` stages three hash-guarded sibling source changes and Models/Projects publication snapshots inside `_hosting/debates-integration/`; it does not write siblings or deploy. The staged generator normalizes an already installed button as well as creating the renamed button, and is idempotent. Re-running preparation refreshes the two snapshots; capture a fresh read-only Projects `/api/sites` baseline at `projects-api.json` in that staging directory before live verification. The generic `apply-integration.mjs` is for the historical initial migration and must not be used for this new staging directory.

Four hosting tests, generator idempotence/hash preconditions and a scan of all 164 candidate public text files pass; no candidate public text contains the old hostname. Three Wrangler dry runs pass, preserving the Projects Worker/API and D1 bindings. The existing Commute catalog-label test expectation was superseded by the requested terminology; its snapshot/hash checks remain intact. Application runtime source, MORARG publication pin, original companion source and immutable Commute snapshot are unchanged. All source application bytes remain selected by the existing publication contracts.

Publication remains gated by the Operator's explicit `monkeyballs` confirmation for sibling and live-hosting changes. Recheck current Worker versions, the three source hashes and each snapshot against live baselines before publishing; do not overwrite intervening work. Publish the new hostname first, verify direct application links, then apply the three reviewed source replacements and publish Models/Projects with their staged configs. Their public destinations must point directly to Debates. Finally run `scripts/verify-topology-live.py` and `scripts/verify-live-release.py` with new report paths. No remote database/schema operation is part of this rename.

## Room navigation hotfix — pass015

Build 0.6.3 fixes the zero-width room canvas reported after the first movement. The comparison badge's broad `.moved` CSS rule also matched the stage's movement state, changed the stage to `inline-block`, and collapsed its width because its children are absolutely positioned. Scoping the badge rule to `.comparison .moved` preserves the full stage. Argument edition 5.2 and Topology 2.2.0 are unchanged.

Immutable source `ce6ccb8ed38e2401eb48458fb4d06e32c020e4cf` is selected by publication configuration `9170296`. Live Rooms Worker: `e35bebb2-8f32-4c38-81e3-17c12b2d8f8c`; rollback: `4d5dc5e0-ca97-486c-b7fc-da1627ce9a97`. Wrangler uploaded four changed asset contents and reused 128. All 66 existing tests and 141 live asset/route checks pass. Actual WebGL checks cover keyboard movement, drag-to-look, floor walking, guarded travel into the new is–ought room, and movement at 390px phone width. Before the fix, walking changed the stage/canvas from 1265px wide to 0px; afterwards they remain 1265px (375px at phone width). No warnings/errors were observed. The prior release checks exercised controls-only room flows and therefore missed this movement regression; these actual WebGL checks close that specific gap.

Astra's fresh philosophical and pairing critique is committed separately on `review`, never merged into `main`. Publication and the navigation repair do not resolve the critique's argument or model interpretation findings.

## Previous full-site release — pass014

The Operator requested the full MORARG edition 5.2 (build 0.6.2), replacing the prior topology-only publication. Claude's committed `edition5-revision` and `topology-v2-1` changes were fast-forwarded into main through `e82d4c1`; `_review` remains only on the separate review branch (`888146b`). Release configuration `e0a8744` selects that immutable application revision in `_hosting/morality-publication.json` with `html_transform: none`. The public application now matches all 71 selected runtime assets byte-for-byte, including the new is–ought room. Topology 2.2.0 is published alongside it with its seven-file allowlist and shared-case links. The package version metadata was aligned to its existing 2.2.0 runtime version.

Published addresses: [MORARG 5.2](https://rooms.engineeringhumanity.org/morality/) and [Moral Topology 2.2](https://rooms.engineeringhumanity.org/morality/topology/). Rooms Worker `4d5dc5e0-ca97-486c-b7fc-da1627ce9a97`; rollback `c3952bfa-43d3-4939-9b08-b05a5ca63589`. Wrangler uploaded only 33 new/changed asset contents and reused 99 already uploaded files. Local comparison found one new path, 32 changed paths, no removals, and 101 unchanged files (including the two unchanged hosting rule files). Models, Projects and D1 were not changed.

All 66 tests pass: 39 MORARG, 21 Topology, 4 hosting and 2 shared-case checks. All 141 live asset/hash/header/redirect/private-file checks pass. Browser checks cover the new room and exhibit, 13-room reading route, linked town factor reveal and outcome, the free three-person case, and 390px layouts without page overflow or observed console warnings/errors. The live new-room title, room count and build 0.6.2 were checked. This is release QA, not a new philosophical/source review or visitor study.

The publication helper preserves the legacy `companion-links` transform only for reproducing older releases. Full 5.2 uses `none`, preventing a duplicate-link patch and ensuring exact selected-source publication. Future promotions must update the pinned commit/version/edition explicitly. Standard build/test/Wrangler commands below remain applicable; older release sections are historical.


The requested destination is a new `rooms` Cloudflare Worker in account `a5692f39f5b6f22aae67e4c0ef8ca8f7`, with custom domain `rooms.engineeringhumanity.org`. This follows the existing Engineering Humanity Workers/static-assets architecture. Rooms has no D1 binding. The Projects directory keeps its own API and existing D1 binding.

Pass009 published build/live 0.5.1 after the Operator's explicit `monkeyballs` confirmation. Live URLs below are verified. Rooms Worker version: `27a776bc-ea29-40d2-b0ff-f697a062ab9b`; Models: `81363ee7-f0c9-4721-9a79-f269702503ef`; Projects: `263b0600-e215-408c-bdd1-2ae3a5e7243b`. GitHub `main` contains the initial source snapshot and release documentation. Deployment metadata is tracked in `_hosting/release.json`.

All 349 release checks pass: 245 published asset hashes and applicable headers/MIME checks, 100 old-path redirects including queries, three 404 boundaries and the unchanged Projects API (29 entries). Live browser checks verified desktop/phone Projects discovery, following its Rooms link, phone MORARG reading-to-interactive entry, and an old Commute link arriving in The Commute with both `?view=controls` and `#commute` intact. All 34 MORARG/hosting, 108 UPE and 27 Projects tests pass.

The UPE-owned `library/projects-feature.mjs` also retains both bubbles and their CSS on future installer runs. A new idempotence regression test covers that ownership boundary. UPE's former assertion requiring one Commute catalog entry is superseded by the requested move; it now expects none. UPE stays at application 0.9.10; this migration is identified by P033/MORARG pass009 and Worker versions.

## Topology v2 publication (pass013)

Published and verified at [Moral Topology v2](https://rooms.engineeringhumanity.org/morality/topology/). Rooms Worker version `c3952bfa-43d3-4939-9b08-b05a5ca63589`; rollback version `27a776bc-ea29-40d2-b0ff-f697a062ab9b`. Release source commit `859c829a82edb137d36cd339323d43c746d05abd`. All 140 live hash/header/route/private-file checks pass; 19 v2, 35 MORARG and 4 hosting tests pass. The live companion link and initialized controls were checked; prepublication browser QA covered all five authored meetings, private JSON download and 390px layout, with no console warnings/errors in the inspected flows. Models and Projects were not republished. This release leaves the argument edition at 0.5.1.

The companion at `/morality/topology/` is the complete browser application from `_partners/MoralTopology/_application_v2/`. It has five fictional case-pairs and three vector groups: personal A, personal B and global, each with x/y/z controls. The browser performs its own calculations; no Python service, D1, account, remote calculation or new Worker binding is involved. Only seven allowlisted runtime files enter the published topology directory. The original partner application's source, brief, historical outputs and nested Git metadata stay outside the public assets.

In pass013, public MORARG was deliberately pinned to its verified 0.5.1 source commit in `_hosting/morality-publication.json`. `scripts/published-morality.mjs` reads that commit from Git history and adds only the small companion link in the splash and phone reading view. The working 0.6.1/edition 5 argument remains separate because its Astra findings are unresolved. Building Rooms does not silently publish the working argument. A shallow clone must fetch the pinned source commit/full history before building; unavailable history is a build error. Promoting a new argument edition requires an explicit publication-config change and its own review.

```bash
npm --prefix _partners/MoralTopology/_application_v2 test
npm --prefix _application test
npm --prefix _application run build:rooms
npm --prefix _application run test:hosting
wrangler deploy --dry-run --no-autoconfig --config _hosting/wrangler.jsonc
```

The public build regenerates the v2 `site/` directory and copies its exact runtime allowlist into Rooms. `node scripts/preview-rooms.mjs` starts a loopback-only QA server; `/lab/` previews the same v2 source directly and is never a published route. `npm --prefix _partners/MoralTopology/_application_v2 run dev` runs the standalone tool.

After an authorized `wrangler deploy --no-autoconfig --config _hosting/wrangler.jsonc`, run the project Python interpreter with `scripts/verify-topology-live.py <report-path>`. This verifies every candidate Rooms asset hash, JS MIME/CSP, query-preserving topology redirect and private-file 404 boundaries. Record Worker version and source commits in `_hosting/release.json`; keep the previous version for rollback. The pass009 migration details below remain historical. No other Cloudflare project is republished for this companion release.

## Routes

| Address | Behavior |
| --- | --- |
| `rooms.engineeringhumanity.org/` | Debate Rooms index |
| `rooms.engineeringhumanity.org/morality/` | Morality, Between Us (retained public edition) |
| `rooms.engineeringhumanity.org/morality/topology/` | Interactive Moral Topology v2 |
| `rooms.engineeringhumanity.org/after-the-commute/` | After the Commute v03 |
| Models `/after-the-commute/` and `/after-the-commute-v03/`, including asset paths | Permanent redirects to the new Commute path |
| Models v01 and v02 paths | Preserved |

Directory requests without the final slash redirect to the slash form so relative module/image URLs remain correct. Unknown routes return 404. Redirect rules use Cloudflare's static-assets `_redirects` format; query and browser-fragment behavior must be checked at publication.

## Preparation

1. Run `npm --prefix _application run build:rooms`, the application tests and hosting tests. For future Rooms-only publication, these steps plus the Rooms config are sufficient; the one-time migration steps below are historical and will reject already-applied changes.
2. Run `node scripts/prepare-integration.mjs`. It writes exclusively to ignored `_hosting/integration/`. It stages five guarded source changes: Projects `public/index.html` and `public/models/featured.css`; UPE `models.mjs`, `_redirects` and `scripts/build.mjs`.
3. Review the staged files and `changes.json`. Projects gains the exact label **Explore Debate Rooms** beside its existing Visual Models bubble. Buttons wrap at intermediate widths and stack as needed on phones. Models removes only v03 from its catalog while preserving its source and assets behind redirects. Its build copies the new redirect rules so future builds retain the migration.
4. Compare the existing public sites with their local baseline: use the recorded Python environment to run `scripts/verify-existing-live.py <report-path>`.
5. Dry-run the Rooms config and the staged `models.wrangler.json` and `projects.wrangler.json`. The staged Projects config retains the existing Worker code, API routing and D1 binding.

## Authorized publication

After explicit Operator confirmation, recheck deployment versions and all staged source hashes. Use `node scripts/apply-integration.mjs --operator-confirmed` only with that authorization. It validates all five preconditions before writing any sibling source file. Record corresponding changes in each owning project's changelog/register; do not overwrite pre-existing decisions or unrelated tasks.

Publish Rooms first and verify the custom domain and both experiences. Then publish the staged Models redirects and catalog, and finally the staged Projects assets. Use the three prepared configs with `wrangler deploy --no-autoconfig --config <config>`. Verify old URLs, query/fragment navigation, JS/image MIME types, CSP, unknown-file 404s, desktop/phone layouts, and an unchanged Projects `/api/sites` response. Recheck every unrelated public file hash. Do not execute remote database/schema commands.

Migration rollback versions: Models `20130e77-2be4-419a-90b5-f000959bf2dc`; Projects `7cdb02b7-81f9-4cc2-9bc5-e7c4e67ad474`. Re-read current versions before any future release. Preserve the Rooms domain while any redirect still targets it. The inherited security/accessibility/physical-device audit tasks remain separate from this publication's functional checks.

## Source control

Repository: `https://github.com/bastardpsycho/EH_MoralityArgument`, verified empty and public at pass008 start. Initial commit `d0ee00f6d4886525f61c25e235bd257e8daf681e` is pushed on `main`; subsequent release documentation is committed separately. Git excludes credentials, local caches, generated deployment directories, operational reports, input and cold storage. The companion v03 publication snapshot is tracked with hashes; Rooms rebuilds need no access to sibling projects. `scripts/verify-live-release.py <report-path>` verifies the three-site migration against the retained local integration snapshots.

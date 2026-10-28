# Debate Rooms hosting and migration

The requested destination is a new `rooms` Cloudflare Worker in account `a5692f39f5b6f22aae67e4c0ef8ca8f7`, with custom domain `rooms.engineeringhumanity.org`. This follows the existing Engineering Humanity Workers/static-assets architecture. Rooms has no D1 binding. The Projects directory keeps its own API and existing D1 binding.

Pass009 published build/live 0.5.1 after the Operator's explicit `monkeyballs` confirmation. Live URLs below are verified. Rooms Worker version: `27a776bc-ea29-40d2-b0ff-f697a062ab9b`; Models: `81363ee7-f0c9-4721-9a79-f269702503ef`; Projects: `263b0600-e215-408c-bdd1-2ae3a5e7243b`. GitHub `main` contains the initial source snapshot and release documentation. Deployment metadata is tracked in `_hosting/release.json`.

All 349 release checks pass: 245 published asset hashes and applicable headers/MIME checks, 100 old-path redirects including queries, three 404 boundaries and the unchanged Projects API (29 entries). Live browser checks verified desktop/phone Projects discovery, following its Rooms link, phone MORARG reading-to-interactive entry, and an old Commute link arriving in The Commute with both `?view=controls` and `#commute` intact. All 34 MORARG/hosting, 108 UPE and 27 Projects tests pass.

The UPE-owned `library/projects-feature.mjs` also retains both bubbles and their CSS on future installer runs. A new idempotence regression test covers that ownership boundary. UPE's former assertion requiring one Commute catalog entry is superseded by the requested move; it now expects none. UPE stays at application 0.9.10; this migration is identified by P033/MORARG pass009 and Worker versions.

## Routes

| Address | Behavior |
| --- | --- |
| `rooms.engineeringhumanity.org/` | Debate Rooms index |
| `rooms.engineeringhumanity.org/morality/` | Morality, Between Us |
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

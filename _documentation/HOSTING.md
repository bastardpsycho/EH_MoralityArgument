# Debate Rooms hosting and migration

The requested destination is a new `rooms` Cloudflare Worker in account `a5692f39f5b6f22aae67e4c0ef8ca8f7`, with custom domain `rooms.engineeringhumanity.org`. This follows the existing Engineering Humanity Workers/static-assets architecture. Rooms has no D1 binding. The Projects directory keeps its own API and existing D1 binding.

Pass008 prepares build 0.5.1. Publication and changes to the other projects await the Operator's `monkeyballs` confirmation required by the workspace rules. A successful build or dry run does not establish live publication.

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

1. Run `npm --prefix _application run build:rooms`, the application tests and hosting tests.
2. Run `node scripts/prepare-integration.mjs`. It writes exclusively to ignored `_hosting/integration/`. It stages five guarded source changes: Projects `public/index.html` and `public/models/featured.css`; UPE `models.mjs`, `_redirects` and `scripts/build.mjs`.
3. Review the staged files and `changes.json`. Projects gains the exact label **Explore Debate Rooms** beside its existing Visual Models bubble. Buttons wrap at intermediate widths and stack as needed on phones. Models removes only v03 from its catalog while preserving its source and assets behind redirects. Its build copies the new redirect rules so future builds retain the migration.
4. Compare the existing public sites with their local baseline: use the recorded Python environment to run `scripts/verify-existing-live.py <report-path>`.
5. Dry-run the Rooms config and the staged `models.wrangler.json` and `projects.wrangler.json`. The staged Projects config retains the existing Worker code, API routing and D1 binding.

## Authorized publication

After explicit Operator confirmation, recheck deployment versions and all staged source hashes. Use `node scripts/apply-integration.mjs --operator-confirmed` only with that authorization. It validates all five preconditions before writing any sibling source file. Record corresponding changes in each owning project's changelog/register; do not overwrite pre-existing decisions or unrelated tasks.

Publish Rooms first and verify the custom domain and both experiences. Then publish the staged Models redirects and catalog, and finally the staged Projects assets. Use the three prepared configs with `wrangler deploy --no-autoconfig --config <config>`. Verify old URLs, query/fragment navigation, JS/image MIME types, CSP, unknown-file 404s, desktop/phone layouts, and an unchanged Projects `/api/sites` response. Recheck every unrelated public file hash. Do not execute remote database/schema commands.

Prior verified deployment versions: Models `20130e77-2be4-419a-90b5-f000959bf2dc`; Projects `7cdb02b7-81f9-4cc2-9bc5-e7c4e67ad474`. Re-read before release; do not assume these remain current. Roll back affected Workers to their recorded prior versions if publication fails, and preserve the Rooms domain while any redirect still targets it.

## Source control

Requested repository: `https://github.com/bastardpsycho/EH_MoralityArgument`, verified empty and public at pass008 start. Initialize this project on `main`, commit the active state, and push only after the workspace confirmation gate is satisfied. Git excludes credentials, local caches, generated deployment directories, operational reports, input and cold storage. The companion v03 publication snapshot is tracked with hashes; rebuilds need no access to sibling projects.

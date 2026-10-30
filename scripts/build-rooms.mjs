import {readFile, writeFile, mkdir, copyFile, rm} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {__version__ as workingVersion} from '../_application/scaffold.mjs';
import {publication, publishedAssets, publishedAsset, publishedEdition} from './published-morality.mjs';
import {PUBLIC_ASSETS, __version__ as topologyVersion} from '../_partners/MoralTopology/_application_v2/scaffold.mjs';
import {execFileSync} from 'node:child_process';

const hosting = new URL('../_hosting/', import.meta.url);
const dist = new URL('dist/', hosting);
const snapshot = JSON.parse(await readFile(new URL('commute-provenance.json', hosting), 'utf8'));
// Only this owned, generated directory is replaced.
await rm(dist, {recursive:true, force:true});
await mkdir(new URL('morality/', dist), {recursive:true});
await mkdir(new URL('after-the-commute/', dist), {recursive:true});
for (const file of publishedAssets) await writeFile(new URL(`morality/${file}`, dist), publishedAsset(file));
execFileSync(process.execPath, [new URL('../_partners/MoralTopology/_application_v2/scripts/build-public.mjs', import.meta.url).pathname], {stdio:'inherit'});
await mkdir(new URL('morality/topology/',dist), {recursive:true});
for (const file of PUBLIC_ASSETS) {
  if (!/^[a-z0-9-]+\.(html|css|mjs|svg)$/.test(file)) throw Error(`Invalid topology asset ${file}`);
  await copyFile(new URL(`../_partners/MoralTopology/_application_v2/site/${file}`,import.meta.url),new URL(`morality/topology/${file}`,dist));
}
for (const [file, sha256] of Object.entries(snapshot.files)) {
  if (!/^[a-z0-9-]+\.(html|css|mjs|jpg|svg)$/.test(file)) throw Error(`Invalid snapshot asset ${file}`);
  const body = await readFile(new URL(`commute-v03/${file}`, hosting));
  if (createHash('sha256').update(body).digest('hex') !== sha256) throw Error(`Snapshot changed: ${file}`);
  // Relocate only the two catalog links; argument, controls, artwork and CSS stay intact.
  const content = file === 'index.html' ? body.toString().replace('aria-label="All Engineering Humanity proposals"', 'aria-label="All Engineering Humanity debates"').replace('← All proposals', '← All debates') : body;
  await writeFile(new URL(`after-the-commute/${file}`, dist), content);
}
for (const file of ['index.html','rooms.css','_headers','_redirects']) await copyFile(new URL(file, hosting), new URL(file, dist));
await copyFile(new URL('../_application/favicon.svg', import.meta.url), new URL('favicon.svg', dist));
await writeFile(new URL('404.html', dist), '<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Debate not found</title><h1>Debate not found</h1><p><a href="/">Explore the debates</a></p></html>\n');
await writeFile(new URL('build.json', dist), JSON.stringify({ts_ms:Date.now(),version:publication.build_version,argument_edition:publishedEdition,working_version:workingVersion,morality_source_commit:publication.source_commit,topology_version:topologyVersion,site:'debates',hosting_pass:'pass018',routes:['/morality/','/morality/topology/','/after-the-commute/'],commute_snapshot_ts_ms:snapshot.ts_ms}, null, 2)+'\n');
console.log(`Rooms: public MORARG ${publication.build_version}, ${publishedAssets.length} morality assets, Topology ${topologyVersion} (${PUBLIC_ASSETS.length} public assets), ${Object.keys(snapshot.files).length} preserved commute assets.`);

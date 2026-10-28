import {readFile, writeFile, mkdir, copyFile, rm} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {runtimeAssets, __version__} from '../_application/scaffold.mjs';

const hosting = new URL('../_hosting/', import.meta.url);
const dist = new URL('dist/', hosting);
const snapshot = JSON.parse(await readFile(new URL('commute-provenance.json', hosting), 'utf8'));
// Only this owned, generated directory is replaced.
await rm(dist, {recursive:true, force:true});
await mkdir(new URL('morality/', dist), {recursive:true});
await mkdir(new URL('after-the-commute/', dist), {recursive:true});
for (const file of runtimeAssets) await copyFile(new URL(`../_application/${file}`, import.meta.url), new URL(`morality/${file}`, dist));
for (const [file, sha256] of Object.entries(snapshot.files)) {
  if (!/^[a-z0-9-]+\.(html|css|mjs|jpg|svg)$/.test(file)) throw Error(`Invalid snapshot asset ${file}`);
  const body = await readFile(new URL(`commute-v03/${file}`, hosting));
  if (createHash('sha256').update(body).digest('hex') !== sha256) throw Error(`Snapshot changed: ${file}`);
  // Relocate only the two catalog links; argument, controls, artwork and CSS stay intact.
  const content = file === 'index.html' ? body.toString().replace('aria-label="All Engineering Humanity proposals"', 'aria-label="All Engineering Humanity debate rooms"').replace('← All proposals', '← All debate rooms') : body;
  await writeFile(new URL(`after-the-commute/${file}`, dist), content);
}
for (const file of ['index.html','rooms.css','_headers','_redirects']) await copyFile(new URL(file, hosting), new URL(file, dist));
await copyFile(new URL('../_application/favicon.svg', import.meta.url), new URL('favicon.svg', dist));
await writeFile(new URL('404.html', dist), '<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Room not found</title><h1>Room not found</h1><p><a href="/">Explore the debate rooms</a></p></html>\n');
await writeFile(new URL('build.json', dist), JSON.stringify({ts_ms:Date.now(),version:__version__,site:'rooms',routes:['/morality/','/after-the-commute/'],commute_snapshot_ts_ms:snapshot.ts_ms}, null, 2)+'\n');
console.log(`Rooms: MORARG ${__version__}, ${runtimeAssets.length} morality assets, ${Object.keys(snapshot.files).length} preserved commute assets.`);

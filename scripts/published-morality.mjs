// Publish the explicitly selected immutable MORARG revision, independently of future work.
import {execFileSync} from 'node:child_process';
import {readFile} from 'node:fs/promises';
export const publication = JSON.parse(await readFile(new URL('../_hosting/morality-publication.json', import.meta.url), 'utf8'));
if (!/^[0-9a-f]{40}$/.test(publication.source_commit)) throw Error('Invalid MORARG publication commit');
export function baselineAsset(file) {
  if (!/^[a-z0-9-]+\.(html|svg|css|mjs|jpg)$/.test(file)) throw Error('Invalid MORARG asset');
  try { return execFileSync('git', ['show', `${publication.source_commit}:_application/${file}`], {cwd:new URL('../',import.meta.url),maxBuffer:8*1024*1024}); }
  catch { throw Error(`Published MORARG source ${publication.source_commit} is unavailable; fetch complete Git history before building.`); }
}
const scaffold = baselineAsset('scaffold.mjs').toString();
export const publishedVersion = scaffold.match(/export const __version__ = '([^']+)'/)[1];
if(publication.build_version !== publishedVersion) throw Error('Published MORARG version does not match its pinned source');
export const publishedEdition = baselineAsset('data.mjs').toString().match(/export const edition\s*=\s*['"]([^'"]+)['"]/)[1];
if(publication.argument_edition && publication.argument_edition !== publishedEdition) throw Error('Published MORARG edition does not match its pinned source');
const htmlTransform=publication.html_transform ?? 'companion-links';
if(!['none','companion-links'].includes(htmlTransform)) throw Error('Unknown publication HTML transform');
export const publishedAssets = JSON.parse(scaffold.match(/export const runtimeAssets = (\[[\s\S]*?\]);/)[1]);
export function addTopologyLink(html) {
  if (html.includes('href="./topology/"')) throw Error('Topology link already applied');
  const intro = /(<a class="intro-read" href="\?view=controls#hub">[^<]+<\/a>)/g;
  if ([...html.matchAll(intro)].length !== 1) throw Error('MORARG splash link anchor changed');
  const reading = '<p class="g-3d"';
  if (html.split(reading).length !== 2) throw Error('MORARG reading link anchor changed');
  return html.replace(intro, '$1 · <a class="intro-read" href="./topology/">Explore Moral Topology ↗</a>')
    .replace(reading, '<p class="small"><a href="./topology/">Explore Moral Topology ↗</a></p>'+reading);
}
export function publishedAsset(file) {
  const body = baselineAsset(file);
  return file === 'index.html' && htmlTransform === 'companion-links' ? Buffer.from(addTopologyLink(body.toString())) : body;
}

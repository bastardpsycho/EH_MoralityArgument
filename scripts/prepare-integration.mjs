// Stage integration changes inside MORARG. This script never writes to sibling projects.
import {readFile, writeFile, mkdir, cp, copyFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
const root = fileURLToPath(new URL('../', import.meta.url));
const social = fileURLToPath(new URL('../../', import.meta.url));
const upe = social+'4_UtopianProvisioningEconomy_UPE/_application/upe/';
const projects = social+'6_FrontPageCollection/_application/';
const stage = root+'_hosting/integration/';
await mkdir(stage, {recursive:true});
const sha = text => createHash('sha256').update(text).digest('hex');
const changes = [];
async function change(target, staged, transform) {
  let before;
  try { before = await readFile(target); } catch(error) { if(error.code !== 'ENOENT') throw error; }
  const after = transform(before?.toString() ?? '');
  if(before && after === before.toString()) throw Error(`No change: ${target}`);
  await writeFile(stage+staged, after);
  changes.push({target, staged, before_sha256:before ? sha(before) : null, after_sha256:sha(after)});
  return after;
}
const projectsHTML = await change(projects+'public/index.html', 'projects-index.html', html => {
  const button = '<a class="visual-models-button" href="https://models.engineeringhumanity.org/">Explore the visual models <span aria-hidden="true">↗</span></a>';
  if(html.split(button).length !== 2) throw Error('Projects button boundary changed');
  return html.replace(button, '<div class="explore-buttons">'+button+'\n<a class="visual-models-button debate-rooms-button" href="https://debates.engineeringhumanity.org/">Explore Debates <span aria-hidden="true">↗</span></a></div>');
});
const projectsCSS = await change(projects+'public/models/featured.css', 'projects-featured.css', css => css+'\n/* MORARG pass008: companion discovery links wrap together beside search. */\n.project-discovery{flex-wrap:wrap;gap:18px}.project-discovery .search{flex:1 1 320px}.explore-buttons{display:flex;flex-wrap:wrap;gap:12px}.debate-rooms-button{background:linear-gradient(180deg,#d5f4dc,#98dbba 50%,#70c59e);border-color:#bae6cb;color:#143b2b;box-shadow:inset 0 2px 0 #effff4,inset 0 -3px 0 #4da77f,0 6px 18px #49b9821a}@media(max-width:760px){.project-discovery .search{flex:auto}.explore-buttons{width:100%}.explore-buttons .visual-models-button{font-size:14px;gap:12px;padding:14px 20px}}\n');
const modelSource = await change(upe+'models.mjs', 'upe-models.mjs', source => {
  const marker = "slug: 'after-the-commute-v03', host: 'models', path: '/after-the-commute-v03/', title:";
  if(source.split(marker).length !== 2) throw Error('Commute registry boundary changed');
  return source.replace(marker, "slug: 'after-the-commute-v03', host: 'models', path: '/after-the-commute-v03/', listed: false, title:");
});
const redirects = ['/after-the-commute','/after-the-commute-v03'].flatMap(path => [
  `${path} https://debates.engineeringhumanity.org/after-the-commute/ 301`,
  `${path}/* https://debates.engineeringhumanity.org/after-the-commute/:splat 301`
]).join('\n')+'\n';
await change(upe+'_redirects', 'upe-redirects', prior => prior+redirects);
await change(upe+'scripts/build.mjs', 'upe-build.mjs', source => {
  const marker = "for(const file of ['favicon.svg','_headers'])";
  if(source.split(marker).length !== 2) throw Error('Models build boundary changed');
  return source.replace(marker, "await copyFile(root+'_redirects',outputs.models.root+'/_redirects');\n"+marker);
});
// Prepare deployable snapshots using existing build artifacts. Preserve every unrelated asset.
await cp(projects+'public', stage+'projects-public', {recursive:true, filter:path => !path.endsWith('.DS_Store')});
await writeFile(stage+'projects-public/index.html', projectsHTML);
await writeFile(stage+'projects-public/models/featured.css', projectsCSS);
await cp(upe+'dist', stage+'models-dist', {recursive:true, filter:path => !path.endsWith('.DS_Store')});
await writeFile(stage+'models-dist/_redirects', redirects);
const {renderLibrary} = await import(new URL('library/render.mjs', 'file://'+upe));
const {models} = await import('data:text/javascript;base64,'+Buffer.from(modelSource).toString('base64'));
await writeFile(stage+'models-dist/index.html', renderLibrary(models));
const manifest = JSON.parse(await readFile(stage+'models-dist/build.json','utf8'));
manifest.ts_ms = Date.now();
manifest.catalog = manifest.catalog.filter(slug => slug !== 'after-the-commute-v03');
manifest.files = [...new Set([...manifest.files,'_redirects'])];
await writeFile(stage+'models-dist/build.json', JSON.stringify(manifest,null,2)+'\n');
await writeFile(stage+'models.wrangler.json',JSON.stringify({name:'models',account_id:'a5692f39f5b6f22aae67e4c0ef8ca8f7',compatibility_date:'2026-10-12',routes:[{pattern:'models.engineeringhumanity.org',custom_domain:true}],workers_dev:false,preview_urls:false,assets:{directory:'./models-dist'}},null,2)+'\n');
const projectConfig = JSON.parse((await readFile(projects+'wrangler.jsonc','utf8')).replace(/^\s*\/\/.*$/gm,''));
projectConfig.main = projects+'src/index.js';
projectConfig.account_id = 'a5692f39f5b6f22aae67e4c0ef8ca8f7';
projectConfig.assets.directory = './projects-public';
await writeFile(stage+'projects.wrangler.json', JSON.stringify(projectConfig,null,2)+'\n');
await writeFile(stage+'changes.json',JSON.stringify({ts_ms:Date.now(),changes},null,2)+'\n');
console.log(`Prepared ${changes.length} guarded sibling source changes and two deployment snapshots. No sibling files modified.`);

// Prepare the rename inside MORARG; never modify sibling sources or publish.
import {readFile, writeFile, mkdir, cp, rm} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';

const social = fileURLToPath(new URL('../../', import.meta.url));
const upe = social+'4_UtopianProvisioningEconomy_UPE/_application/upe/';
const projects = social+'6_FrontPageCollection/_application/';
const stage = new URL('../_hosting/debates-integration/', import.meta.url);
const oldHost = 'https://rooms.engineeringhumanity.org/';
const newHost = 'https://debates.engineeringhumanity.org/';
const sha = body => createHash('sha256').update(body).digest('hex');
await mkdir(stage, {recursive:true});
// Rebuild snapshots without retaining files removed from their owning source.
for (const directory of ['projects-public/','models-dist/']) await rm(new URL(directory,stage), {recursive:true,force:true});
const changes=[];
async function change(target, staged, transform) {
  const before=await readFile(target);
  const after=transform(before.toString());
  if(after===before.toString()) throw Error(`Expected rename missing in ${target}`);
  await writeFile(new URL(staged,stage),after);
  changes.push({target,staged,before_sha256:sha(before),after_sha256:sha(after)});
  return after;
}
const rename = text => text.replaceAll(oldHost,newHost).replaceAll('Explore Debate Rooms','Explore Debates');
const html=await change(projects+'public/index.html','projects-index.html',rename);
const redirects=await change(upe+'_redirects','upe-redirects',rename);
await change(upe+'library/projects-feature.mjs','upe-projects-feature.mjs',source=>{
  const marker='  if (!html.includes(\'href="/models/featured.css"\'))';
  if(source.split(marker).length!==2) throw Error('Projects generator boundary changed');
  const normalize=`  // Keep an already installed discovery button current on future installer runs.\n  html = html.replace(/<a class="visual-models-button debate-rooms-button" href="[^"]*">[^<]*<span aria-hidden="true">↗<\\/span><\\/a>/g, '<a class="visual-models-button debate-rooms-button" href="${newHost}">Explore Debates <span aria-hidden="true">↗</span></a>');\n`;
  return rename(source).replace(marker,normalize+marker);
});
// Snapshot only publication directories; omit metadata and cold storage.
const filter=path=>!path.split('/').some(part=>part.startsWith('.')||['_archive','z_archive','_old','zold','z_old'].includes(part));
await cp(projects+'public',new URL('projects-public/',stage),{recursive:true,filter});
await writeFile(new URL('projects-public/index.html',stage),html);
await cp(upe+'dist',new URL('models-dist/',stage),{recursive:true,filter});
await writeFile(new URL('models-dist/_redirects',stage),redirects);
const config=JSON.parse((await readFile(projects+'wrangler.jsonc','utf8')).replace(/^\s*\/\/.*$/gm,''));
config.main=projects+'src/index.js';
config.account_id='a5692f39f5b6f22aae67e4c0ef8ca8f7';
config.assets.directory='./projects-public';
await writeFile(new URL('projects.wrangler.json',stage),JSON.stringify(config,null,2)+'\n');
const modelsConfig=JSON.parse((await readFile(upe+'wrangler.jsonc','utf8')).replace(/^\s*\/\/.*$/gm,''));
modelsConfig.assets.directory='./models-dist';
await writeFile(new URL('models.wrangler.json',stage),JSON.stringify(modelsConfig,null,2)+'\n');
await writeFile(new URL('changes.json',stage),JSON.stringify({ts_ms:Date.now(),changes},null,2)+'\n');
console.log(`Prepared ${changes.length} guarded source changes and two publication snapshots inside MORARG. Sibling files and live sites unchanged.`);

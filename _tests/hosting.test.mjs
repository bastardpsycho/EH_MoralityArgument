import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile, readdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {publishedAssets,publishedAsset,baselineAsset,addTopologyLink,publication,publishedVersion} from '../scripts/published-morality.mjs';
import {PUBLIC_ASSETS,__version__ as topologyVersion} from '../_partners/MoralTopology/_application_v2/scaffold.mjs';
const dist = new URL('../_hosting/dist/',import.meta.url);
const snapshot = new URL('../_hosting/commute-v03/',import.meta.url);
const sha = body => createHash('sha256').update(body).digest('hex');
test('public MORARG preserves its published edition with only the companion link',async()=>{
  assert.deepEqual((await readdir(new URL('morality/',dist))).sort(),[...publishedAssets,'topology'].sort());
  for(const file of publishedAssets) assert.equal(sha(await readFile(new URL('morality/'+file,dist))),sha(publishedAsset(file)),file);
  const index=(await readFile(new URL('morality/index.html',dist))).toString();
  assert.equal(index,addTopologyLink(baselineAsset('index.html').toString()));
  assert.equal(publication.build_version,publishedVersion);
  assert.equal((index.match(/href=".\/topology\/"/g)||[]).length,2);
});
test('the commute relocation preserves every snapshot asset except its two catalog labels',async()=>{
  const provenance=JSON.parse(await readFile(new URL('../_hosting/commute-provenance.json',import.meta.url),'utf8'));
  assert(Number.isSafeInteger(provenance.ts_ms));
  for(const [file,hash] of Object.entries(provenance.files)){
    const before=await readFile(new URL(file,snapshot));
    assert.equal(sha(before),hash,file);
    const after=await readFile(new URL('after-the-commute/'+file,dist));
    if(file==='index.html') assert.equal(after.toString(),before.toString().replace('aria-label="All Engineering Humanity proposals"','aria-label="All Engineering Humanity debate rooms"').replace('← All proposals','← All debate rooms'));
    else assert.equal(sha(after),hash,file);
  }
});
test('hosting isolates public assets and keeps both experiences reachable',async()=>{
  const index=await readFile(new URL('index.html',dist),'utf8');
  for(const path of ['morality','after-the-commute'])assert(index.includes(`href="./${path}/"`));
  const forbidden=['package.json','README.md','source-manifest.json','page.mjs','.env'];
  for(const file of forbidden)assert(!(await readdir(dist)).includes(file));
  const config=JSON.parse(await readFile(new URL('../_hosting/wrangler.jsonc',import.meta.url),'utf8'));
  assert.equal(config.workers_dev,false);
  assert.equal(config.preview_urls,false);
  assert.equal(config.assets.not_found_handling,'404-page');
  assert.equal('d1_databases' in config,false);
  const headers=await readFile(new URL('_headers',dist),'utf8');
  assert(headers.includes("connect-src 'none'"));
});

test('topology publishes the browser calculator without private project files',async()=>{
  const directory=new URL('morality/topology/',dist);
  assert.deepEqual((await readdir(directory)).sort(),[...PUBLIC_ASSETS].sort());
  const index=await readFile(new URL('index.html',directory),'utf8');
  assert.equal((index.match(/type="range"/g)||[]).length,4,'v2.1: two personal strengths, shared reasons, shared pressure');
  assert(index.includes('app.mjs'));
  assert(index.includes('Moral Topology'));
  const publicScript=await readFile(new URL('app.mjs',directory),'utf8');
  assert(publicScript.includes('model.mjs'));
  for(const file of ['package.json','README.md','_documentation','_tests','requirements.txt','.git']) assert(!PUBLIC_ASSETS.includes(file));
  const build=JSON.parse(await readFile(new URL('build.json',dist),'utf8'));
  assert(build.routes.includes('/morality/topology/'));
  assert.equal(build.topology_version,topologyVersion);
  const redirects=await readFile(new URL('_redirects',dist),'utf8');
  assert(redirects.includes('/morality/topology /morality/topology/ 301'));
});

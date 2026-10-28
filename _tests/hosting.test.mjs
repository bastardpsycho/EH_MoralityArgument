import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile, readdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {runtimeAssets} from '../_application/scaffold.mjs';
const dist = new URL('../_hosting/dist/',import.meta.url);
const snapshot = new URL('../_hosting/commute-v03/',import.meta.url);
const sha = body => createHash('sha256').update(body).digest('hex');
test('the deployed morality tree exactly matches the application runtime boundary',async()=>{
  assert.deepEqual((await readdir(new URL('morality/',dist))).sort(),[...runtimeAssets].sort());
  for(const file of runtimeAssets) assert.equal(sha(await readFile(new URL('morality/'+file,dist))),sha(await readFile(new URL('../_application/'+file,import.meta.url))),file);
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

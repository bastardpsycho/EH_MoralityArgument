import test from 'node:test';
import assert from 'node:assert/strict';
import {CASES,FREE_PRESETS,getCase} from '../cases.mjs';
import {AXES,FACTOR_KINDS,FACTORS_PER_PERSON,STORY_RULES,MODEL_VERSION,computeStory,computeFree,freeDefaults,freeCorners,withoutPushes,subsetsOf,summariseStory,summariseFree,createExportPayload,validateScenario,distance,octant,sameOctant,formatCoordinate,factorsFor,magnitude} from '../model.mjs';
import {__version__,PUBLIC_ASSETS} from '../scaffold.mjs';
import {PROJECTIONS,renderChart,renderTable} from '../chart.mjs';
const stories=CASES.filter(c=>c.mode==='story'),free=CASES.find(c=>c.mode==='free');
const close=(a,b,eps=1e-9)=>a.every((v,i)=>Math.abs(v-b[i])<=eps);
const ids=c=>c.factors.map(f=>f.id);

test('six cases: five stories and one free case with three people; version shared by model and scaffold',()=>{
  assert.equal(MODEL_VERSION,'2.2.0');assert.equal(__version__,MODEL_VERSION);
  assert.equal(CASES.length,6);assert.equal(stories.length,5);assert.equal(CASES[0].id,'town');
  assert.equal(free.id,'assisted-dying');assert.equal(free.viewpoints.length,3);
  for(const c of CASES)assert.equal(validateScenario(c),true);
});

test('every story person is moved by exactly three real factors, each a full 3D displacement with an authored kind',()=>{
  for(const c of stories)for(const person of ['A','B']){
    const factors=factorsFor(c,person);assert.equal(factors.length,FACTORS_PER_PERSON,`${c.id} ${person}`);
    for(const f of factors){assert(FACTOR_KINDS[f.kind]);assert(f.title&&f.text);assert.equal(f.moves[person].length,3);}
    // Not one-dimensional: a person's three factors span more than a single direction.
    const [u,v,w]=factors.map(f=>f.moves[person]);
    const cross=[u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0]];
    assert(magnitude(cross)>0||magnitude([w[1]*v[2]-w[2]*v[1],w[2]*v[0]-w[0]*v[2],w[0]*v[1]-w[1]*v[0]])>0,`${c.id} ${person}: factors are not all parallel`);
  }
});

test('with nothing unveiled people stay at their starts; each included factor adds exactly its displacement',()=>{
  for(const c of stories){
    const none=computeStory(c,[]);assert.deepEqual(none.A,c.A0);assert.deepEqual(none.B,c.B0);
    for(const f of c.factors){const r=computeStory(c,[f.id]);for(const p of ['A','B']){const start=c[`${p}0`],end=r[p];assert(close(end,f.moves[p]?start.map((v,i)=>v+f.moves[p][i]):start));}}
  }
});

test('the factors alone bring each story pair together: same octant within the stated gap, after a considerable journey',()=>{
  for(const c of stories){
    const r=computeStory(c);
    assert(r.gap<=STORY_RULES.maxFinalGap&&r.sameOctant,c.id);
    assert(r.startGap>160,`${c.id}: they start far apart`);
    assert(!sameOctant(c.A0,c.B0),`${c.id}: they start in different octants`);
    for(const p of ['A','B'])assert(r.people[p].net>=STORY_RULES.minMovement,`${c.id} ${p}`);
  }
});

test('every combination of factors stays on the fixed axes',()=>{
  let count=0;for(const c of stories)for(const subset of subsetsOf(ids(c))){const r=computeStory(c,subset);for(const point of [r.A,r.B])point.forEach((v,i)=>assert(v>=AXES['xyz'[i]].min&&v<=AXES['xyz'[i]].max));count++;}
  assert.equal(count,stories.reduce((n,c)=>n+2**c.factors.length,0));
});

test('removing the factors that only push gives different lessons in different cases, as the stories say',()=>{
  const without=id=>{const c=getCase(id);return {c,all:computeStory(c),bare:computeStory(c,withoutPushes(c))};};
  const abortion=without('abortion');assert(!abortion.bare.sameOctant&&abortion.bare.gap>30,'Daniel’s agreement depends on a push');
  const climate=without('climate');assert(!climate.bare.sameOctant&&climate.bare.gap>30,'pressure on both sides carries the climate agreement');
  const punishment=without('punishment');assert(punishment.bare.sameOctant&&punishment.bare.gap<10,'the punishment agreement rests on reasons');
  const town=without('town');assert(town.bare.sameOctant&&town.bare.octants.A!==town.all.octants.A,'the false story changes what they agree on, not whether');
  assert.match(summariseStory(town.c,town.all,ids(town.c)),/changed what they agree on, not whether they agree/);
  assert.match(summariseStory(abortion.c,abortion.all,ids(abortion.c)),/in different octants\.$/);
});

test('movement is attributed to factor kinds by path length, and partial factors animate between stages',()=>{
  const c=getCase('abortion'),r=computeStory(c);
  for(const p of ['A','B']){const sum=Object.values(r.people[p].byKind).reduce((a,b)=>a+b,0);assert(Math.abs(sum-r.people[p].path)<1e-9);}
  assert.equal(r.people.A.byKind.pushes,0);assert(r.people.B.byKind.pushes>r.people.B.byKind.reasons);
  const half=computeStory(c,['new-job'],{id:'new-job',t:.5});assert(close(half.A,c.A0.map((v,i)=>v+.5*c.factors[0].moves.A[i])));
  assert.throws(()=>computeStory(c,['nope']));assert.throws(()=>computeStory(c,[],{id:'new-job',t:2}));
});

test('octants are sign patterns, and a zero coordinate is on a boundary, in no octant',()=>{
  assert.equal(octant([1,-2,3]),'+−+');assert.equal(octant([0,1,1]),null);assert(!sameOctant([0,1,1],[0,1,1]));
});

test('free case: personal sliders, a squeeze that scales every distance by (1 − s), and a drift that moves everyone equally',()=>{
  const zero=freeDefaults(free);const base=computeFree(free,zero);
  free.viewpoints.forEach((p,i)=>assert(close(base.ends[i],p.start)));
  const moved={...structuredClone(zero),people:[[.4,-.2,.6],[1,.3,-.5],[-.7,.9,.1]]};
  const personal=computeFree(free,moved);
  for(const s of [0,.25,.5,1]){const r=computeFree(free,{...structuredClone(moved),s});r.gaps.forEach((pair,k)=>assert(Math.abs(pair.gap-(1-s)*personal.gaps[k].gap)<1e-9));}
  const drifted=computeFree(free,{...structuredClone(moved),g:[1,-1,.5]});
  drifted.gaps.forEach((pair,k)=>assert(Math.abs(pair.gap-personal.gaps[k].gap)<1e-9));
  drifted.ends.forEach((end,i)=>assert(close(end,personal.ends[i].map((v,j)=>v+25*[1,-1,.5][j]))));
  assert.equal(computeFree(free,{...structuredClone(zero),s:1}).spread<1e-9,true);
});

test('free presets: the squeeze brings everyone into one octant; own influences can share an octant while staying apart',()=>{
  const squeeze=computeFree(free,structuredClone(FREE_PRESETS.squeeze.controls));assert(squeeze.allSameOctant);
  const own=computeFree(free,structuredClone(FREE_PRESETS.octant.controls));assert(own.allSameOctant);assert(own.spread>30);
  assert.match(summariseFree(free,squeeze,FREE_PRESETS.squeeze.controls),/multiplies every distance by 0\.1/);
});

test('free case stays on the fixed axes at every bounding corner and at sampled settings; malformed controls are rejected',()=>{
  assert(freeCorners(free).length>=128);
  let s=3;const r=()=>(s=(s*1103515245+12345)%2147483648)/2147483648*2-1;
  for(let k=0;k<300;k++){const res=computeFree(free,{people:free.viewpoints.map(()=>[r(),r(),r()]),g:[r(),r(),r()],s:(r()+1)/2});for(const end of res.ends)end.forEach((v,i)=>assert(Math.abs(v)<=150));}
  const zero=freeDefaults(free);
  for(const bad of [null,{},{...zero,extra:1},{...zero,people:[[0,0,0]]},{...zero,g:[0,2,0]},{...zero,s:-.1},{...zero,s:1.1},{...zero,people:[[0,0,NaN],[0,0,0],[0,0,0]]}])assert.throws(()=>computeFree(free,bad));
  assert.throws(()=>computeStory(free));assert.throws(()=>computeFree(stories[0],zero));
});

test('validation rejects malformed cases',()=>{
  const c=getCase('abortion');
  assert.throws(()=>validateScenario({...c,A0:[Infinity,0,0]}));
  assert.throws(()=>validateScenario({...c,factors:c.factors.slice(1)}),/exactly 3 factors/);
  assert.throws(()=>validateScenario({...c,factors:c.factors.map((f,i)=>i?f:{...f,kind:'mystery'})}));
  assert.throws(()=>validateScenario({...c,factors:c.factors.map(f=>({...f,moves:Object.fromEntries(Object.entries(f.moves).map(([k,v])=>[k,v.map(x=>x/10)]))}))}),/same octant|at least/);
  assert.throws(()=>validateScenario({...c,mode:'other'}));
  assert.throws(()=>getCase('missing'));
  assert.notEqual(formatCoordinate(1e-8),'0');
});

test('charts draw one segment per included factor (or per stage in the free case) and the table lists each step',()=>{
  for(const c of stories){
    const r=computeStory(c),svg=renderChart(c,r,'iso');
    assert.equal((svg.match(/class="(vector|zero-arrow) /g)||[]).length,c.factors.reduce((n,f)=>n+Object.keys(f.moves).length,0));
    assert(renderTable(c,r).includes(`after “${c.factors[0].title}”`));
  }
  const r=computeFree(free,structuredClone(FREE_PRESETS.octant.controls)),svg=renderChart(free,r,'iso');
  assert.equal((svg.match(/class="(vector|zero-arrow) /g)||[]).length,9);
  assert(svg.includes('Theo start'));assert(renderTable(free,r).includes('Theo after the squeeze'));
});

test('all projection views fit the fixed cube inside the SVG viewport',()=>{
  for(const [id,view] of Object.entries(PROJECTIONS)){
    for(const x of [-150,150])for(const y of [-150,150])for(const z of [-150,150]){const [px,py]=view.project([x,y,z]);assert(px>=0&&px<=720&&py>=0&&py<=520,`${id}: ${px},${py}`);}
    assert.match(renderChart(stories[0],computeStory(stories[0],[]),id),/Fixed axis range minus 150 to plus 150/);
  }
  assert.throws(()=>renderChart(stories[0],computeStory(stories[0],[]),'missing'));
});

test('private export records the case, what was unveiled or set, every step and epoch milliseconds',()=>{
  const c=getCase('town'),ts_ms=Date.now();
  const story=JSON.parse(JSON.stringify(createExportPayload(c,{unveiled:4,included:withoutPushes(c)},ts_ms)));
  assert.equal(story.ts_ms,ts_ms);assert.equal(story.version,MODEL_VERSION);assert.deepEqual(story.case.included,withoutPushes(c));assert.deepEqual(story.case.factors,c.factors);
  assert(story.case.assumptions.factorKindsAreAuthoredAndDisputable);
  const freeExport=JSON.parse(JSON.stringify(createExportPayload(free,{controls:structuredClone(FREE_PRESETS.squeeze.controls)},ts_ms)));
  assert.equal(freeExport.case.endpoints.length,3);assert.match(freeExport.formula.distances,/\(1 - s\)/);
  for(const invalid of [-1,NaN,1.5,Infinity])assert.throws(()=>createExportPayload(c,{unveiled:0,included:[]},invalid));
});

test('publication boundary contains only browser runtime assets',()=>{
  for(const file of ['index.html','app.mjs','model.mjs','cases.mjs','chart.mjs','styles.css','scaffold.mjs'])assert(PUBLIC_ASSETS.includes(file));
  assert.equal(PUBLIC_ASSETS.length,7);assert(!PUBLIC_ASSETS.some(p=>p.includes('/')||p.startsWith('.')));
});

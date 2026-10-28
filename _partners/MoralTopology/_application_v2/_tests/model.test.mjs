import test from 'node:test';
import assert from 'node:assert/strict';
import {CASES,CONTROLS_DEFAULT,getCase} from '../cases.mjs';
import {AXES,CONTROL_RANGE,INFLUENCE_SCALES,MODEL_VERSION,computeEndpoints,createExportPayload,subtractVector,distance,validateScenario,formatCoordinate} from '../model.mjs';
import {__version__,PUBLIC_ASSETS} from '../scaffold.mjs';
import {PROJECTIONS,renderChartSvg,renderCoordinateTable} from '../chart.mjs';
const zero=()=>({a:[0,0,0],b:[0,0,0],g:[0,0,0]});
const copy=x=>structuredClone(x);
const close=(a,b)=>a.every((v,i)=>Math.abs(v-b[i])<=1e-9);

test('three independent signed vector groups expose nine finite components',()=>{
  assert.deepEqual(Object.keys(AXES),['x','y','z']);
  assert.deepEqual(Object.keys(CONTROLS_DEFAULT),['a','b','g']);
  for(const vector of Object.values(CONTROLS_DEFAULT))assert.deepEqual(vector,[0,0,0]);
  assert(CONTROL_RANGE.min<0&&CONTROL_RANGE.max>0);
  assert.equal(__version__,MODEL_VERSION);
});

test('zero vectors preserve both origins and do not mutate authored case data',()=>{
  for(const c of CASES){const before=JSON.stringify(c);const r=computeEndpoints(c,zero());assert.deepEqual(r.A,c.A0);assert.deepEqual(r.B,c.B0);assert.equal(JSON.stringify(c),before);}
});

test('each component of either personal vector moves its own point only',()=>{
  for(const c of CASES)for(const group of ['a','b'])for(let axis=0;axis<3;axis++)for(const sign of [-1,1]){
    const controls=zero();controls[group][axis]=sign;const r=computeEndpoints(c,controls);
    const moved=group==='a'?r.A:r.B,origin=group==='a'?c.A0:c.B0;
    assert.deepEqual(group==='a'?r.B:r.A,group==='a'?c.B0:c.A0);
    const delta=subtractVector(moved,origin);
    for(let i=0;i<3;i++)assert.equal(delta[i],i===axis?sign*INFLUENCE_SCALES[group==='a'?'personalA':'personalB'][i]:0);
  }
});

test('all global components translate both points identically and preserve their separation',()=>{
  for(const c of CASES)for(const g of [[1,0,0],[0,-1,0],[0,0,1],[.8,-.7,.6],[-1,1,-1]]){
    const base=computeEndpoints(c,{a:[.2,-.3,.1],b:[-.1,.5,-.4],g:[0,0,0]});
    const r=computeEndpoints(c,{a:[.2,-.3,.1],b:[-.1,.5,-.4],g});
    assert(close(subtractVector(r.A,base.A),subtractVector(r.B,base.B)));
    assert(close(subtractVector(r.A,r.B),subtractVector(base.A,base.B)));
    assert(Math.abs(r.gap-base.gap)<1e-9);
    assert.deepEqual(r.arrows.globalAtA,r.arrows.globalAtB);
  }
});

test('each authored meeting is reachable without changing either starting recommendation',()=>{
  assert.equal(CASES.length,5);
  for(const c of CASES){const before=JSON.stringify([c.viewpoints,c.sharedOption]);const r=computeEndpoints(c,c.witness);assert(close(r.A,r.B),c.id);assert(r.gap<1e-9,c.id);assert.equal(JSON.stringify([c.viewpoints,c.sharedOption]),before);}
});

test('a personal perturbation separates a meeting while global movement retains it',()=>{
  for(const c of CASES){const controls=copy(c.witness);controls.a[0]+=.01;assert(computeEndpoints(c,controls).gap>.4);controls.a[0]-=.01;controls.g=[-1,1,-1];assert(computeEndpoints(c,controls).gap<1e-9);}
});

test('every corner of the nine-component control domain remains on fixed axes without clipping',()=>{
  let count=0;
  for(const c of CASES)for(let mask=0;mask<512;mask++){
    const values=Array.from({length:9},(_,i)=>(mask>>i)&1?1:-1);
    const r=computeEndpoints(c,{a:values.slice(0,3),b:values.slice(3,6),g:values.slice(6,9)});
    for(const point of [r.A,r.B])point.forEach((v,i)=>assert(v>=AXES['xyz'[i]].min&&v<=AXES['xyz'[i]].max));
    count++;
  }
  assert.equal(count,2560);
});

test('the privacy counterexample widens the gap from the original starting pair',()=>{
  const c=getCase('privacy');const before=computeEndpoints(c,zero());const controls=zero();controls.a[0]=-1;const after=computeEndpoints(c,controls);
  assert.equal(Math.round(before.gap**2),6850);assert.equal(Math.round(after.gap**2),12850);assert(after.gap>before.gap);
});

test('ten unique nonzero origins span several octants without implying a population map',()=>{
  const origins=CASES.flatMap(c=>[c.A0,c.B0]);assert.equal(new Set(origins.map(JSON.stringify)).size,10);
  assert(origins.every(p=>p.every(v=>v!==0)));assert(new Set(origins.map(p=>p.map(Math.sign).join(','))).size>=6);
});

test('finite input and fixed-domain validation reject malformed controls and source points',()=>{
  const c=CASES[0];
  for(const controls of [null,{}, {a:0,b:0,g:0},{...zero(),extra:[0,0,0]}, {...zero(),a:[0,0]}, {...zero(),b:[0,0,Infinity]}, {...zero(),g:[0,NaN,0]}, {...zero(),a:[1.01,0,0]}, {...zero(),a:[-1.01,0,0]}])assert.throws(()=>computeEndpoints(c,controls));
  assert.throws(()=>validateScenario({...c,A0:[Infinity,0,0]}));
  assert.throws(()=>validateScenario({...c,A0:[AXES.x.max+1,0,0]}));
  assert.throws(()=>validateScenario({...c,A0:[0,,0]}));
  assert.throws(()=>getCase('missing-case'));
});

test('nearby endpoints remain numerically separated and tiny nonzero coordinates remain visible',()=>{
  const c=CASES[0],controls=copy(c.witness);controls.a[0]+=.000001;
  const r=computeEndpoints(c,controls);assert(r.gap>1e-9&&r.gap<.001);
  assert.notEqual(formatCoordinate(1e-8),'0');
});

test('resultant arrows are three-dimensional and connect each origin to its actual endpoint',()=>{
  for(const c of CASES){
    const r=computeEndpoints(c,c.witness),svg=renderChartSvg(c,r,'iso');
    assert.equal((svg.match(/class="vector /g)||[]).length,4);
    assert(svg.includes('A start')&&svg.includes('B start'));
    for(const key of ['personalA','personalB','globalAtA','globalAtB'])assert(r.arrows[key].every(v=>v!==0));
    const sum=(origin,personal,global)=>origin.map((v,i)=>v+personal[i]+global[i]);
    assert(close(sum(c.A0,r.arrows.personalA,r.arrows.globalAtA),r.A));assert(close(sum(c.B0,r.arrows.personalB,r.arrows.globalAtB),r.B));
    const table=renderCoordinateTable(c,r);assert(table.includes('per-axis difference'));assert(table.includes('Shared displacement'));
  }
});

test('all projection views fit the fixed cube inside the SVG viewport and label omitted depth',()=>{
  for(const [id,view] of Object.entries(PROJECTIONS)){
    for(const x of [-150,150])for(const y of [-150,150])for(const z of [-150,150]){const [px,py]=view.project([x,y,z]);assert(px>=0&&px<=720&&py>=0&&py<=520,`${id}: ${px},${py}`);}
    assert.match(renderChartSvg(CASES[0],computeEndpoints(CASES[0],zero()),id),/Fixed axis range minus 150 to plus 150/);
  }
  assert.throws(()=>renderChartSvg(CASES[0],computeEndpoints(CASES[0],zero()),'missing'));
});

test('private export round-trips exact vectors, narratives, assumptions and epoch milliseconds',()=>{
  const c=CASES[0],controls=copy(c.witness),ts_ms=Date.now();const payload=createExportPayload(c,controls,ts_ms),json=JSON.parse(JSON.stringify(payload));
  assert.equal(json.ts_ms,ts_ms);assert.equal(json.version,MODEL_VERSION);assert.deepEqual(json.case.controls,controls);
  for(const field of ['viewpoints','influences','sharedOption','caseNote','witness','A0','B0'])assert.deepEqual(json.case[field],c[field]);
  assert(json.case.assumptions.sharedVectorIsIdenticalAtBothPoints);assert(json.case.assumptions.meetingDoesNotEstablishPolicyAgreement);
  assert.deepEqual(json.case.endpoints,{A:computeEndpoints(c,controls).A,B:computeEndpoints(c,controls).B});
  controls.a[0]=0;assert.notDeepEqual(payload.case.controls,controls);
  for(const invalid of [-1,NaN,1.5,Infinity])assert.throws(()=>createExportPayload(c,zero(),invalid));
});

test('publication boundary contains only browser runtime assets',()=>{
  for(const file of ['index.html','app.mjs','model.mjs','cases.mjs','chart.mjs','styles.css','scaffold.mjs'])assert(PUBLIC_ASSETS.includes(file));
  assert.equal(PUBLIC_ASSETS.length,7);assert(!PUBLIC_ASSETS.some(p=>p.includes('/')||p.startsWith('.')));
});

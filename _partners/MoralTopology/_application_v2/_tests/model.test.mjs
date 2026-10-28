import test from 'node:test';
import assert from 'node:assert/strict';
import {CASES,CONTROLS_DEFAULT,PRESETS,getCase} from '../cases.mjs';
import {AXES,CONTROL_RANGES,CONTROL_KEYS,MODEL_VERSION,computeEndpoints,cornerControls,createExportPayload,subtractVector,distance,validateScenario,formatCoordinate,mainDriver,summarise,pressureCentre,homothety} from '../model.mjs';
import {__version__,PUBLIC_ASSETS} from '../scaffold.mjs';
import {PROJECTIONS,renderChartSvg,renderCoordinateTable} from '../chart.mjs';
const zero=()=>({...CONTROLS_DEFAULT});
const close=(a,b,eps=1e-9)=>a.every((v,i)=>Math.abs(v-b[i])<=eps);
const cos=(u,v)=>u.reduce((s,x,i)=>s+x*v[i],0)/Math.hypot(...u)/Math.hypot(...v);
// A small deterministic generator, so the sampled settings are the same on every run.
function* samples(n,seed=7){let s=seed;const next=()=>(s=(s*1103515245+12345)%2147483648)/2147483648;for(let i=0;i<n;i++){const pick=k=>CONTROL_RANGES[k].min+(CONTROL_RANGES[k].max-CONTROL_RANGES[k].min)*next();yield {a:pick('a'),b:pick('b'),r:pick('r'),p:pick('p')};}}

test('four scalar controls with stated ranges, and a version shared by scaffold and model',()=>{
  assert.deepEqual(CONTROL_KEYS,['a','b','r','p']);
  assert.deepEqual(Object.keys(CONTROLS_DEFAULT),['a','b','r','p']);
  assert.deepEqual(CONTROL_RANGES.r,{min:0,max:1,step:.01});
  assert.equal(CONTROL_RANGES.p.min,-.5);
  assert.equal(MODEL_VERSION,'2.1.0');assert.equal(__version__,MODEL_VERSION);
});

test('six fictional cases, including the town from Morality, Between Us, each valid on every corner of the control box',()=>{
  assert.equal(CASES.length,6);assert.equal(CASES[0].id,'town');
  assert.equal(cornerControls().length,16);
  for(const c of CASES){assert.equal(validateScenario(c),true);assert(['A','B'].includes(c.influences.pressure.side));}
});

test('zero controls preserve both starts and do not mutate authored case data',()=>{
  for(const c of CASES){const before=JSON.stringify(c);const r=computeEndpoints(c,zero());assert.deepEqual(r.A,c.A0);assert.deepEqual(r.B,c.B0);assert.equal(r.gap,r.startGap);assert.equal(JSON.stringify(c),before);}
});

test('each personal influence moves only its own person, along its authored direction',()=>{
  for(const c of CASES)for(const [key,start,other,dir] of [['a','A0','B0','personalA'],['b','B0','A0','personalB']])for(const amount of [-1,-.3,.5,1]){
    const controls={...zero(),[key]:amount},r=computeEndpoints(c,controls),moved=key==='a'?r.A:r.B,still=key==='a'?r.B:r.A;
    assert(close(subtractVector(moved,c[start]),c.influences[dir].direction.map(v=>v*amount)));
    assert.deepEqual(still,c[other]);
  }
});

test('the gap factorises exactly: |A − B| = |1 − p| · (1 − r) · |A1 − B1|',()=>{
  for(const c of CASES)for(const controls of samples(300)){
    const r=computeEndpoints(c,controls);
    const personalOnly=computeEndpoints(c,{...controls,r:0,p:0});
    assert(Math.abs(r.gap-Math.abs(1-controls.p)*(1-controls.r)*personalOnly.gap)<1e-9,c.id);
    assert(Math.abs(r.gap-r.startGap*r.factors.personal*r.factors.reasons*r.factors.pressure)<1e-9,c.id);
  }
});

test('shared influences can now change the gap; v2’s equal translation could not',()=>{
  for(const c of CASES){
    const base=computeEndpoints(c,{a:.3,b:.3,r:0,p:0});
    assert(computeEndpoints(c,{a:.3,b:.3,r:.5,p:0}).gap<base.gap,'reasons narrow');
    assert(computeEndpoints(c,{a:.3,b:.3,r:0,p:.5}).gap<base.gap,'pressure narrows');
    assert(computeEndpoints(c,{a:.3,b:.3,r:0,p:-.5}).gap>base.gap,'backlash widens');
  }
});

test('full shared reasons meet at R; full pressure meets at N, the louder side’s start, and that side does not move',()=>{
  for(const c of CASES){
    const viaReasons=computeEndpoints(c,PRESETS.reasons.controls);
    assert(viaReasons.gap<1e-9);assert(close(viaReasons.A,c.R));assert(close(viaReasons.B,c.R));
    const viaPressure=computeEndpoints(c,PRESETS.pressure.controls),N=pressureCentre(c);
    assert(viaPressure.gap<1e-9);assert(close(viaPressure.A,N));
    const louder=c.influences.pressure.side;
    assert.equal(viaPressure.moved[louder],0,`${c.id}: the louder side stays put`);
    assert(viaPressure.moved[louder==='A'?'B':'A']>0);
    assert(distance(viaReasons.meetingPoint,viaPressure.meetingPoint)>20,`${c.id}: the two meetings land in different places`);
  }
});

test('the authored geometry is not rigged: directions are not aimed at the other person, and R is neither start nor midpoint',()=>{
  for(const c of CASES){
    const AB=subtractVector(c.B0,c.A0),BA=subtractVector(c.A0,c.B0);
    assert(cos(c.influences.personalA.direction,AB)<.9,`${c.id}: A’s direction`);
    assert(cos(c.influences.personalB.direction,BA)<.9,`${c.id}: B’s direction`);
    assert(!close(c.influences.personalB.direction,c.influences.personalA.direction.map(v=>-v)),`${c.id}: not equal and opposite`);
    const mid=c.A0.map((v,i)=>(v+c.B0[i])/2);
    assert(distance(c.R,mid)>5&&distance(c.R,c.A0)>20&&distance(c.R,c.B0)>20,c.id);
    // Personal encounters alone never close the gap: some shared influence is needed for any meeting.
    let best=Infinity;for(let i=-10;i<=10;i++)for(let j=-10;j<=10;j++)best=Math.min(best,computeEndpoints(c,{a:i/10,b:j/10,r:0,p:0}).factors.personal);
    assert(best>.5,`${c.id}: personal encounters alone narrow too much (${best})`);
  }
});

test('homothety scales distances about a centre by the factor',()=>{
  const C=[1,2,3],P=[4,6,3],Q=[-2,0,9];
  for(const f of [0,.3,1,1.5])assert(Math.abs(distance(homothety(P,C,f),homothety(Q,C,f))-f*distance(P,Q))<1e-12);
});

test('the summary names the main driver honestly and never calls a near miss a meeting',()=>{
  const c=getCase('town');
  assert.equal(mainDriver(computeEndpoints(c,PRESETS.reasons.controls)),'reasons');
  assert.equal(mainDriver(computeEndpoints(c,PRESETS.pressure.controls)),'pressure');
  assert.equal(mainDriver(computeEndpoints(c,PRESETS.backlash.controls)),'backlash');
  assert.equal(mainDriver(computeEndpoints(c,zero())),'none');
  const pressure=summarise(c,computeEndpoints(c,PRESETS.pressure.controls));
  assert(pressure.met);assert.match(pressure.text,/Sam does all the moving/);
  assert.match(summarise(c,computeEndpoints(c,{a:.5,b:0,r:0,p:.7})).text,/Sam does most of the moving/);assert.match(pressure.text,/not agreement/);
  const near=summarise(c,computeEndpoints(c,{a:0,b:0,r:.999999,p:0}));
  assert(!near.met);assert.match(near.text,/^Gap /);
});

test('the domain is closed: sampled settings stay on the fixed axes without clipping, and malformed input is rejected',()=>{
  for(const c of CASES)for(const controls of samples(200,11)){const r=computeEndpoints(c,controls);for(const point of [r.A,r.B])point.forEach((v,i)=>assert(v>=AXES['xyz'[i]].min&&v<=AXES['xyz'[i]].max));}
  const c=CASES[0];
  for(const controls of [null,{}, {a:0,b:0,r:0},{...zero(),extra:0},{...zero(),a:[0]},{...zero(),b:Infinity},{...zero(),r:NaN},{...zero(),a:1.01},{...zero(),r:-.01},{...zero(),p:-.51},{...zero(),p:1.01}])assert.throws(()=>computeEndpoints(c,controls));
  assert.throws(()=>validateScenario({...c,A0:[Infinity,0,0]}));
  assert.throws(()=>validateScenario({...c,R:[AXES.x.max+1,0,0]}));
  assert.throws(()=>validateScenario({...c,influences:{...c.influences,pressure:{...c.influences.pressure,side:'C'}}}));
  assert.throws(()=>validateScenario({...c,influences:{...c.influences,personalA:{...c.influences.personalA,kind:'mystery'}}}));
  assert.throws(()=>getCase('missing-case'));
  assert.notEqual(formatCoordinate(1e-8),'0');
});

test('the chart draws three stages per person, R and N, and the table shows the exact factors',()=>{
  for(const c of CASES){
    const r=computeEndpoints(c,PRESETS.mixed.controls),svg=renderChartSvg(c,r,'iso');
    assert.equal((svg.match(/class="(vector|zero-arrow) /g)||[]).length,6,'three stage segments per person, drawn as arrows or as dots when too short');
    assert(svg.includes('R · shared option')&&svg.includes('pressure-ring'));
    assert(svg.includes(c.influences.pressure.side==='A'?'A start · N':'B start · N'));
    const table=renderCoordinateTable(c,r);
    assert(table.includes('after shared reasons')&&table.includes('per-axis difference')&&table.includes('(shared pressure)'));
  }
});

test('all projection views fit the fixed cube inside the SVG viewport and label omitted depth',()=>{
  for(const [id,view] of Object.entries(PROJECTIONS)){
    for(const x of [-150,150])for(const y of [-150,150])for(const z of [-150,150]){const [px,py]=view.project([x,y,z]);assert(px>=0&&px<=720&&py>=0&&py<=520,`${id}: ${px},${py}`);}
    assert.match(renderChartSvg(CASES[0],computeEndpoints(CASES[0],zero()),id),/Fixed axis range minus 150 to plus 150/);
  }
  assert.throws(()=>renderChartSvg(CASES[0],computeEndpoints(CASES[0],zero()),'missing'));
});

test('private export round-trips controls, visitor readings, stages and epoch milliseconds',()=>{
  const c=getCase('town'),controls={...PRESETS.mixed.controls},ts_ms=Date.now();
  const payload=createExportPayload(c,controls,{a:'both',b:'nonsense'},ts_ms),json=JSON.parse(JSON.stringify(payload));
  assert.equal(json.ts_ms,ts_ms);assert.equal(json.version,MODEL_VERSION);assert.deepEqual(json.case.controls,controls);
  assert.deepEqual(json.case.visitorReadings,{a:'both',b:'unset'});
  for(const field of ['viewpoints','influences','sharedOption','caseNote','A0','B0','R'])assert.deepEqual(json.case[field],c[field]);
  assert(json.case.assumptions.visitorReadingsDoNotChangeTheGeometry);assert(json.case.assumptions.meetingDoesNotEstablishPolicyAgreement);
  assert.match(json.formula.gap,/\|1 - p\| \* \(1 - r\)/);
  for(const invalid of [-1,NaN,1.5,Infinity])assert.throws(()=>createExportPayload(c,zero(),{},invalid));
});

test('publication boundary contains only browser runtime assets',()=>{
  for(const file of ['index.html','app.mjs','model.mjs','cases.mjs','chart.mjs','styles.css','scaffold.mjs'])assert(PUBLIC_ASSETS.includes(file));
  assert.equal(PUBLIC_ASSETS.length,7);assert(!PUBLIC_ASSETS.some(p=>p.includes('/')||p.startsWith('.')));
});

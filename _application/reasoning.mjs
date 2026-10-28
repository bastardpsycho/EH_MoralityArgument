// Pure conditional reasoning over caller-owned answer and resolution records.
export function createReasoner(steps, rules = []) {
 if (!Array.isArray(steps) || !Array.isArray(rules)) throw Error('Steps and rules must be arrays');
 const byId = new Map(), deps = new Map(), children = new Map();
 for (const s of steps) {
  if (!s || typeof s.id !== 'string' || !s.id || byId.has(s.id) || typeof s.room !== 'string' || !Array.isArray(s.choices) || !s.choices.length) throw Error('Invalid or duplicate step');
  const ids = new Set();
  for (const c of s.choices) {
   if (!c || typeof c.id !== 'string' || !c.id || ids.has(c.id)) throw Error('Invalid or duplicate choice');
   ids.add(c.id);
  }
  byId.set(s.id,s);
 }
 const dependencies = condition => {
  const result = new Set();
  function visit(node) {
   if (!node || typeof node !== 'object' || Array.isArray(node)) throw Error('Invalid condition');
   const keys = Object.keys(node);
   if (keys.length === 1 && (keys[0] === 'all' || keys[0] === 'any')) {
    const list = node[keys[0]];
    if (!Array.isArray(list) || !list.length) throw Error('Empty or invalid condition');
    list.forEach(visit); return;
   }
   if (keys.length !== 2 || !keys.includes('step') || !keys.includes('choices') || typeof node.step !== 'string' || !Array.isArray(node.choices) || !node.choices.length) throw Error('Unknown condition');
   const s=byId.get(node.step);
   if (!s || node.choices.some(id=>typeof id !== 'string' || !s.choices.some(c=>c.id===id)) || new Set(node.choices).size!==node.choices.length) throw Error('Unknown condition reference or choice');
   result.add(node.step);
  }
  visit(condition); return [...result].sort();
 };
 for (const s of steps) {
  if (!Object.hasOwn(s,'branch')) { deps.set(s.id,[]); continue; }
  const b=s.branch; if (!b || typeof b!=='object' || Array.isArray(b)) throw Error('Invalid branch');
  const anchor=byId.get(b.after);
  if (!anchor || anchor.room!==s.room || s.id===b.after || !b.when) throw Error('Invalid branch anchor');
  deps.set(s.id,dependencies(b.when));
  const siblings=children.get(b.after)||[]; siblings.push(s); children.set(b.after,siblings);
 }
 const ruleById=new Map(), ruleDeps=new Map();
 for (const r of rules) {
  if (!r || typeof r.id!=='string' || !r.id || ruleById.has(r.id) || !['contradiction','tension'].includes(r.kind) || typeof r.title!=='string' || typeof r.explanation!=='string' || !('scope' in r) || !Array.isArray(r.sources)) throw Error('Invalid rule');
  ruleById.set(r.id,r); ruleDeps.set(r.id,dependencies(r.when));
 }
 // Dependency order is distinct from visual anchor order. Reject both cycles.
 const marks=new Map(), ordered=[];
 function visitDeps(id) {
  if (marks.get(id)===1) throw Error('Cyclic branch dependency');
  if (marks.get(id)===2) return;
  marks.set(id,1); for (const d of deps.get(id)) visitDeps(d); marks.set(id,2); ordered.push(byId.get(id));
 }
 steps.forEach(s=>visitDeps(s.id));
 const anchorMarks=new Map();
 function visitAnchor(id) {
  if (anchorMarks.get(id)===1) throw Error('Cyclic branch anchors');
  if (anchorMarks.get(id)===2) return;
  anchorMarks.set(id,1); const a=byId.get(id).branch?.after; if(a) visitAnchor(a); anchorMarks.set(id,2);
 }
 steps.forEach(s=>visitAnchor(s.id));
 const validTime=t=>Number.isSafeInteger(t)&&t>=0;
 const validAnswer=(s,a)=>!!a && typeof a==='object' && validTime(a.ts_ms) && s.choices.some(c=>c.id===a.choice_id);
 const matches=(node,current)=>{
  if ('all' in node) return node.all.every(n=>matches(n,current));
  if ('any' in node) return node.any.some(n=>matches(n,current));
  return !!current[node.step] && node.choices.includes(current[node.step].choice_id);
 };
 // Null captures an unanswered dependency in an any condition, making later answers invalidate the old basis.
 const basisFor=(id,current)=>Object.fromEntries(deps.get(id).map(d=>[d,current[d]?{choice_id:current[d].choice_id,ts_ms:current[d].ts_ms}:null]));
 const sameBasis=(a,b)=>{
  if (!a || typeof a!=='object' || Array.isArray(a)) return false;
  const keys=Object.keys(b); if(Object.keys(a).length!==keys.length) return false;
  return keys.every(k=>Object.hasOwn(a,k) && (b[k]===null?a[k]===null:!!a[k] && Object.keys(a[k]).length===2 && a[k].choice_id===b[k].choice_id && a[k].ts_ms===b[k].ts_ms));
 };
 function state(answers={}) {
  if (!answers || typeof answers!=='object' || Array.isArray(answers)) throw Error('Invalid answers');
  const current=Object.create(null), activeIds=new Set(), stale=[], inactive=[];
  for (const s of ordered) {
   const active=!s.branch||matches(s.branch.when,current), a=answers[s.id];
   if(active) activeIds.add(s.id);
   if(a===undefined) continue;
   if (!active) { inactive.push({step:s,answer:a,reason:'Branch conditions are not currently satisfied.'}); continue; }
   if (!validAnswer(s,a)) { stale.push({step:s,answer:a,reason:'Answer has an invalid choice or timestamp.'}); continue; }
   if (s.branch && !sameBasis(a.basis,basisFor(s.id,current))) { stale.push({step:s,answer:a,reason:'The answers on which this response depended have changed.'}); continue; }
   current[s.id]=a;
  }
  return {active:steps.filter(s=>activeIds.has(s.id)),current,stale,inactive};
 }
 function record(answers,stepId,choiceId,ts_ms) {
  const s=byId.get(stepId); if(!s || !s.choices.some(c=>c.id===choiceId) || !validTime(ts_ms)) throw Error('Invalid answer');
  const now=state(answers);
  if(!now.active.some(x=>x.id===stepId)) throw Error('Cannot answer inactive branch');
  if(now.current[stepId]?.choice_id===choiceId) return {...answers};
  if(validTime(answers?.[stepId]?.ts_ms) && ts_ms<=answers[stepId].ts_ms) throw Error('Changed answer timestamp must advance');
  const a={choice_id:choiceId,ts_ms}; if(s.branch) a.basis=basisFor(stepId,now.current);
  return {...answers,[stepId]:a};
 }
 function plan(room,answers={}) {
  const active=new Set(state(answers).active.map(s=>s.id)),out=[];
  function append(s){if(active.has(s.id))out.push(s); for(const child of children.get(s.id)||[])append(child);}
  for(const s of steps) if(!s.branch && s.room===room)append(s);
  return out;
 }
 function choice(answers,stepId){const a=state(answers).current[stepId],s=byId.get(stepId);return a?s.choices.find(c=>c.id===a.choice_id):undefined;}
 const validResolution=r=>!!r && ['changed-mind','distinction','retain'].includes(r.kind) && typeof r.text==='string' && r.text.trim().length>0 && r.text.length<=2000 && validTime(r.ts_ms) && typeof r.signature==='string';
 function checks(answers={},resolutions={}) {
  const current=state(answers).current, all=[];
  for(const rule of rules){
   const ds=ruleDeps.get(rule.id); if(!ds.every(id=>current[id])||!matches(rule.when,current))continue;
   const selections=ds.map(id=>{const a=current[id],c=byId.get(id).choices.find(c=>c.id===a.choice_id);return {step_id:id,choice_id:a.choice_id,label:c.label,ts_ms:a.ts_ms};});
   const signature=JSON.stringify([rule.id,selections.map(({step_id,choice_id,ts_ms})=>({step_id,choice_id,ts_ms}))]);
   const resolution=resolutions?.[rule.id],acknowledged=validResolution(resolution)&&resolution.signature===signature;
   all.push({...rule,selections,signature,acknowledged,...(acknowledged?{resolution}: {})});
  }
  return {all,pending:all.filter(x=>!x.acknowledged),acknowledged:all.filter(x=>x.acknowledged)};
 }
 function acknowledge(answers,resolutions,ruleId,kind,text,ts_ms) {
  if(!['changed-mind','distinction','retain'].includes(kind)||typeof text!=='string'||!text.trim()||text.length>2000||!validTime(ts_ms))throw Error('Invalid acknowledgement');
  const found=checks(answers,resolutions).all.find(r=>r.id===ruleId); if(!found)throw Error('Cannot acknowledge inactive check');
  return {...resolutions,[ruleId]:{kind,text,signature:found.signature,ts_ms}};
 }
 return {state,record,plan,choice,checks,acknowledge};
}

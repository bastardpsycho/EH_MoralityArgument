import test from 'node:test';
import assert from 'node:assert/strict';
import {steps,stepById,stepsIn,answerState,currentChoice,recordAnswer,consistencyRules,consistencyReview,acknowledgeCheck,exportJourney} from '../data.mjs';

// Build a witness from the actual authored conditions, including nested branch prerequisites.
// These authored conditions use leaves and all. Reject a new unsupported shape explicitly.
function leaves(node){if(node.all)return node.all.flatMap(leaves);if(node.any)throw Error('Witness builder needs explicit any alternatives');return [node];}
function witness(targetConditions) {
 const allowed=new Map();
 function requireCondition(node){for(const leaf of leaves(node)){
  const old=allowed.get(leaf.step),intersection=old?old.filter(c=>leaf.choices.includes(c)):[...leaf.choices];
  assert.ok(intersection.length,`Conflicting prerequisites for ${leaf.step}`);
  const changed=!old || JSON.stringify(old)!==JSON.stringify(intersection);allowed.set(leaf.step,intersection);
  if(changed){const step=stepById(leaf.step);assert.ok(step,`Unknown step ${leaf.step}`);if(step.branch)requireCondition(step.branch.when);}
 }}
 targetConditions.forEach(requireCondition);
 let answers={},ts=0;const todo=new Set(allowed.keys());
 while(todo.size){let progressed=false;for(const id of [...todo]){
  const s=stepById(id);if(!answerState(answers).active.some(x=>x.id===id))continue;
  answers=recordAnswer(answers,id,allowed.get(id)[0],++ts);todo.delete(id);progressed=true;
 } assert.ok(progressed,`Unreachable dependency cycle or deadlock: ${[...todo].join(', ')}`);}
 return {answers,ts};
}

test('every authored follow-up is reachable, with its anchor visible before it',()=>{
 for(const branch of steps.filter(s=>s.branch)){
  const {answers}=witness([branch.branch.when]);const plan=stepsIn(branch.room,answers).map(s=>s.id);
  assert.ok(plan.includes(branch.branch.after),`${branch.id}: anchor inactive`);
  assert.ok(plan.indexOf(branch.id)>plan.indexOf(branch.branch.after),`${branch.id}: not after anchor`);
  for(const c of branch.choices)assert.ok(currentChoice(recordAnswer(answers,branch.id,c.id,100),branch.id),`${branch.id}/${c.id} cannot be selected`);
 }
});

test('every authored check fires on a witness and stops for a relevant near miss',()=>{
 for(const rule of consistencyRules){
  const {answers,ts}=witness([rule.when]);
  const result=consistencyReview(answers);assert.ok(result.pending.some(x=>x.id===rule.id),`${rule.id} missing`);
  const leaf=leaves(rule.when)[0], step=stepById(leaf.step),other=step.choices.find(c=>!leaf.choices.includes(c.id));
  assert.ok(other,`${rule.id} lacks a near miss`);
  const altered=recordAnswer(answers,leaf.step,other.id,ts+1);
  assert.ok(!consistencyReview(altered).all.some(x=>x.id===rule.id),`${rule.id} incorrectly matches near miss`);
  const resolutions=acknowledgeCheck(answers,{},rule.id,'distinction','My stated distinction.',ts+2);
  assert.ok(consistencyReview(answers,resolutions).acknowledged.some(x=>x.id===rule.id));
  const restored=recordAnswer(altered,leaf.step,answers[leaf.step].choice_id,ts+3);
  assert.ok(!consistencyReview(restored,resolutions).acknowledged.some(x=>x.id===rule.id),`${rule.id} acknowledgement reused`);
 }
});

test('base changes retain, invalidate and require reconfirmation of nested consent path',()=>{
 let a={},t=1;
 a=recordAnswer(a,'consent-decision','conditional',t++);
 a=recordAnswer(a,'path-consent-terms','veto',t++);
 a=recordAnswer(a,'path-consent-withdrawal','retain',t++);
 assert.ok(consistencyReview(a).pending.some(r=>r.id==='identifiable-data-veto'));
 a=recordAnswer(a,'consent-decision','autonomy',t++);
 assert.ok(answerState(a).stale.some(x=>x.step.id==='path-consent-terms'));
 assert.ok(answerState(a).inactive.some(x=>x.step.id==='path-consent-withdrawal'));
 assert.ok(!consistencyReview(a).all.some(r=>r.id==='identifiable-data-veto'));
 a=recordAnswer(a,'consent-decision','conditional',t++);
 assert.ok(answerState(a).stale.some(x=>x.step.id==='path-consent-terms'));
 a=recordAnswer(a,'path-consent-terms','veto',t++);
 assert.ok(answerState(a).stale.some(x=>x.step.id==='path-consent-withdrawal'));
 assert.ok(!consistencyReview(a).all.some(r=>r.id==='identifiable-data-veto'));
 const saved=exportJourney(a,[],t++);assert.ok(saved.stale_responses.some(x=>x.step_id==='path-consent-withdrawal'));
 a=recordAnswer(a,'path-consent-withdrawal','retain',t++);
 assert.ok(consistencyReview(a).pending.some(r=>r.id==='identifiable-data-veto'));
});

test('coherent realism, incomplete answers and non-conflicting priorities remain unflagged',()=>{
 let a={},t=1;
 for(const [id,c] of [['objectivity-role','discover'],['realism-best','natural'],['synthesis-position','realist'],['reciprocity-scope','represent'],['ozone-future','represent']]) a=recordAnswer(a,id,c,t++);
 assert.equal(consistencyReview(a).all.length,0);
 assert.equal(consistencyReview(recordAnswer({},'killing-complaint','skeptic',t++)).all.length,0);
});

test('export separates current, inactive and stale records and reports acknowledgement state',()=>{
 let a={},t=1;
 for(const [id,c] of [['consent-decision','conditional'],['path-consent-terms','veto'],['path-consent-withdrawal','retain']])a=recordAnswer(a,id,c,t++);
 const res=acknowledgeCheck(a,{},'identifiable-data-veto','retain','I keep the tension open.',t++);
 let out=exportJourney(a,[],t++,res);
 assert.equal(out.summary.answered,3);assert.equal(out.consistency_checks.length,1);
 assert.equal(out.consistency_resolutions[0].current,true);assert.equal(out.consistency_checks[0].acknowledged,true);
 a=recordAnswer(a,'consent-decision','autonomy',t++);
 out=exportJourney(a,[],t++,res);
 assert.equal(out.summary.answered,1);assert.equal(out.stale_responses[0].step_id,'path-consent-terms');
 assert.equal(out.inactive_responses[0].step_id,'path-consent-withdrawal');
 assert.equal(out.consistency_checks.length,0);assert.equal(out.consistency_resolutions[0].current,false);
 assert.ok(!out.responses.some(x=>x.step_id==='path-consent-terms'||x.step_id==='path-consent-withdrawal'));
});

test('retained ceiling and funded-compensation terms conflict only with the explicitly contrary same-case action',()=>{
 const scenarios=[
  {root:['prison-policy','prevention'],principle:['path-prison-ceiling','separate'],action:['path-prison-exception','extra'],repair:'reassess',rule:'fixed-punishment-ceiling'},
  {root:['ozone-costs','capacity'],principle:['path-ozone-floor','funding'],action:['path-ozone-deadline','proceed'],repair:'revise',rule:'same-plan-needs-floor'}
 ];
 for(const x of scenarios){let a={},t=1;for(const [id,c] of [x.root,x.principle,x.action])a=recordAnswer(a,id,c,t++);
  assert.ok(consistencyReview(a).pending.some(c=>c.id===x.rule));
  a=recordAnswer(a,x.action[0],x.repair,t++);assert.ok(!consistencyReview(a).all.some(c=>c.id===x.rule));
 }
});

test('working reasons survive path changes with truthful current, stale and inactive export status',async()=>{
 const {recordNote,personalRecord}=await import('../journey.mjs');let a={},t=1;
 for(const [id,c] of [['consent-decision','conditional'],['path-consent-terms','veto'],['path-consent-withdrawal','retain']])a=recordAnswer(a,id,c,t++);
 const notes=recordNote({},'path-consent-withdrawal','A retained reason, not a new answer.',t++);
 const exported=()=>personalRecord(a,[],{},notes,'explore',t++).working_reasons[0];
 assert.equal(exported().path_status,'current');
 a=recordAnswer(a,'path-consent-terms','anonymous',t++);assert.equal(exported().path_status,'inactive');
 a=recordAnswer(a,'path-consent-terms','veto',t++);assert.equal(exported().path_status,'needs-reconfirmation');
 assert.equal(exported().text,'A retained reason, not a new answer.');
});

import test from 'node:test';
import assert from 'node:assert/strict';
import {steps,stepById,stepsIn,answerState,currentChoice,recordAnswer,consistencyRules,consistencyReview,acknowledgeCheck,exportJourney} from '../data.mjs';

// Build a witness from the authored conditions, including branch prerequisites. For an any, the first alternative is used.
function leaves(node){if(node.all)return node.all.flatMap(leaves);if(node.any)return leaves(node.any[0]);return [node];}
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
  if(!answerState(answers).active.some(x=>x.id===id))continue;
  answers=recordAnswer(answers,id,allowed.get(id)[0],++ts);todo.delete(id);progressed=true;
 } assert.ok(progressed,`Unreachable dependency: ${[...todo].join(', ')}`);}
 return {answers,ts};
}
const path=pairs=>{let a={},t=1;for(const [s,c] of pairs)a=recordAnswer(a,s,c,t++);return a;};

test('every follow-up question is reachable, after the answer that opens it',()=>{
 for(const branch of steps.filter(s=>s.branch)){
  const {answers}=witness([branch.branch.when]);const plan=stepsIn(branch.room,answers).map(s=>s.id);
  assert.ok(plan.includes(branch.branch.after),`${branch.id}: anchor inactive`);
  assert.ok(plan.indexOf(branch.id)>plan.indexOf(branch.branch.after),`${branch.id}: not after anchor`);
  for(const c of branch.choices)assert.ok(currentChoice(recordAnswer(answers,branch.id,c.id,100),branch.id),`${branch.id}/${c.id} cannot be selected`);
 }
});

test('every check fires on a witness, stops for a near miss, and needs a fresh explanation after a change',()=>{
 for(const rule of consistencyRules){
  const {answers,ts}=witness([rule.when]);
  assert.ok(consistencyReview(answers).pending.some(x=>x.id===rule.id),`${rule.id} missing`);
  const leaf=leaves(rule.when)[0],step=stepById(leaf.step),other=step.choices.find(c=>!leaf.choices.includes(c.id));
  assert.ok(other,`${rule.id} lacks a near miss`);
  const altered=recordAnswer(answers,leaf.step,other.id,ts+1);
  assert.ok(!consistencyReview(altered).all.some(x=>x.id===rule.id),`${rule.id} matches a near miss`);
  const resolutions=acknowledgeCheck(answers,{},rule.id,'distinction','My stated distinction.',ts+2);
  assert.ok(consistencyReview(answers,resolutions).acknowledged.some(x=>x.id===rule.id));
  const restored=recordAnswer(altered,leaf.step,answers[leaf.step].choice_id,ts+3);
  assert.ok(!consistencyReview(restored,resolutions).acknowledged.some(x=>x.id===rule.id),`${rule.id} acknowledgement reused`);
 }
});

test('checks run in both directions: against objectivist, relativist and reasons-between-people answers',()=>{
 const fires=(pairs,id)=>consistencyReview(path(pairs)).pending.some(c=>c.id===id);
 assert.ok(fires([['start-cat','fact'],['origin-debunk','street']],'evolved-but-objective'),'tests an objectivist pairing');
 assert.ok(fires([['start-neighbours','one-right'],['disagree-stuck','truth']],'unknowable-but-findable'),'tests an objectivist pairing');
 assert.ok(fires([['taste-everyone','right'],['society-wrong','yes-objective']],'agreement-makes-right'),'tests relativism');
 assert.ok(fires([['society-wrong','yes-reasons'],['limit-jones','vote']],'vote-versus-the-excluded'),'tests the reasons view');
 assert.ok(fires([['society-job','covered'],['limit-jones','rescue'],['limit-why','objective']],'covered-then-needed'),'tests the reasons view');
 assert.ok(!fires([['start-cat','fact'],['origin-debunk','realist-reply']],'evolved-but-objective'),'the objectivist reply is not a conflict');
});

test('changing the opening answer retires its follow-up and its check; returning requires a fresh answer',()=>{
 let a=path([['start-view','none'],['limit-jones','rescue'],['limit-why','objective']]);
 assert.ok(consistencyReview(a).pending.some(r=>r.id==='no-facts-then-a-fact'));
 a=recordAnswer(a,'limit-jones','wait',10);
 assert.ok(answerState(a).inactive.some(x=>x.step.id==='limit-why'));
 assert.ok(!consistencyReview(a).all.some(r=>r.id==='no-facts-then-a-fact'));
 a=recordAnswer(a,'limit-jones','rescue',11);
 assert.ok(answerState(a).stale.some(x=>x.step.id==='limit-why'),'old answer is retained but not current');
 assert.ok(!consistencyReview(a).all.some(r=>r.id==='no-facts-then-a-fact'));
 const saved=exportJourney(a,[],12);assert.ok(saved.stale_responses.some(x=>x.step_id==='limit-why'));
 a=recordAnswer(a,'limit-why','objective',13);
 assert.ok(consistencyReview(a).pending.some(r=>r.id==='no-facts-then-a-fact'));
});

test('export separates current, inactive and stale records and reports explanation state',()=>{
 let a=path([['start-view','none'],['limit-jones','rescue'],['limit-why','objective']]);
 const res=acknowledgeCheck(a,{},'no-facts-then-a-fact','changed-mind','This case changed my mind.',20);
 let out=exportJourney(a,[],21,res);
 assert.equal(out.summary.answered,3);assert.equal(out.consistency_checks.length,1);
 assert.equal(out.consistency_resolutions[0].current,true);
 a=recordAnswer(a,'limit-jones','vote',22);out=exportJourney(a,[],23,res);
 assert.equal(out.inactive_responses[0].step_id,'limit-why');
 assert.equal(out.consistency_checks.length,0);assert.equal(out.consistency_resolutions[0].current,false);
 assert.ok(out.ledger.every(r=>'answer' in r));
});

test('working reasons survive path changes with truthful current, stale and inactive export status',async()=>{
 const {recordNote,personalRecord}=await import('../journey.mjs');let a=path([['consent-pay','safeguards'],['consent-withdraw','depends']]);let t=10;
 const notes=recordNote({},'consent-withdraw','A retained reason, not a new answer.',t++);
 const exported=()=>personalRecord(a,[],{},notes,'explore',t++).working_reasons[0];
 assert.equal(exported().path_status,'current');
 a=recordAnswer(a,'consent-pay','cap',t++);assert.equal(exported().path_status,'needs-reconfirmation');
 assert.equal(exported().text,'A retained reason, not a new answer.');
 let b=path([['limit-jones','rescue'],['limit-why','any']]);const n2=recordNote({},'limit-why','why',t++);b=recordAnswer(b,'limit-jones','wait',t++);
 assert.equal(personalRecord(b,[],{},n2,'explore',t++).working_reasons[0].path_status,'inactive');
});

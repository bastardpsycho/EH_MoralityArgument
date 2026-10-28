import test from 'node:test';
import assert from 'node:assert/strict';
import {recordAnswer,choiceFor,consistencyReview,exportJourney,stepsIn} from '../data.mjs';
function path(pairs){let a={},t=100;for(const [step,id] of pairs)a=recordAnswer(a,step,id,t++);return a;}
const routes=[
 ['realist', [['objectivity-role','discover'],['realism-best','natural'],['path-authority-ground','realist'],['reciprocity-scope','represent'],['path-authority-defeater','independent'],['synthesis-position','realist']]],
 ['constitutive supporter', [['objectivity-role','construct'],['realism-best','method'],['path-authority-ground','construct'],['reciprocity-scope','represent'],['path-authority-defeater','revise'],['synthesis-position','framework']]],
 ['hybrid', [['objectivity-role','construct'],['realism-best','reasons'],['path-authority-ground','conditional'],['reciprocity-scope','relationships'],['path-authority-defeater','plural']]],
 ['withholds sufficiency', [['objectivity-role','doubt'],['realism-best','method'],['path-authority-ground','withhold'],['reciprocity-scope','unsure'],['path-authority-defeater','hidden']]]
];
for(const [name,pairs] of routes)test(`${name} can pursue and export its own explanation without a false flag`,()=>{
 const a=path(pairs),out=exportJourney(a,[],1000);
 assert.equal(consistencyReview(a).all.length,0);
 assert.ok(pairs.every(([id,c])=>!choiceFor(id,c).flag),name);
 for(const [id,c] of pairs){const result=out.responses.find(r=>r.step_id===id);assert.equal(result?.choice_id,c);assert.equal(result.feedback,choiceFor(id,c).feedback);}
 assert.match(out.responses.find(r=>r.step_id==='path-authority-ground').feedback,/realist|reason|ground|explan|inference/i);
 assert.equal(out.summary.flagged.length,0);
 assert.ok(stepsIn('climate',a).some(s=>s.id==='path-authority-ground'));
});
test('specific unsupported inference remains distinct from a worldview disagreement',()=>{
 const a=path([['objectivity-role','discover'],['objections-authority','truth']]);
 assert.equal(consistencyReview(a).all.length,0);
 assert.equal(choiceFor('objections-authority','truth').flag,true);
 assert.ok(exportJourney(a,[],1000).summary.flagged.some(item=>item.step.id==='objections-authority'));
});

test('all good/bad semantic standpoints and uncertainty are preserved without ideological flags',()=>{
 for(const [id,choices] of Object.entries({'good-senses':['purpose','welfare','claims','ends'],'good-ground':['shared','realist','individual','open'],'good-certainty':['listen','principle','experience','suspend']})){
  for(const c of choices){const a=path([[id,c]]),out=exportJourney(a,[],1000);assert.equal(choiceFor(id,c).flag,false,`${id}/${c}`);assert.equal(consistencyReview(a).all.length,0);assert.equal(out.responses[0].choice_id,c);assert.equal(out.responses[0].feedback,choiceFor(id,c).feedback);}
 }
});
test('evaluation is not treated as a definition that decides the truth of moral realism',()=>{
 for(const ground of ['realist','individual','open','shared']){
  const a=path([['good-senses','welfare'],['good-ground',ground],['good-certainty','experience']]);
  assert.equal(consistencyReview(a).all.length,0);assert.deepEqual(exportJourney(a,[],1000).summary.flagged,[]);
 }
});

import test from 'node:test';
import assert from 'node:assert/strict';
import {recordAnswer,choiceFor,consistencyReview,exportJourney,steps,stepById,ledgerReview,jobs} from '../data.mjs';
function path(pairs){let a={},t=100;for(const [step,id] of pairs)a=recordAnswer(a,step,id,t++);return a;}
// Consistent routes through the argument, one per standpoint. None should trip a flag or a check.
const routes=[
 ['consistent objectivist',[['start-view','objective'],['start-cat','fact'],['start-neighbours','one-right'],['origin-job','needs'],['origin-debunk','realist-reply'],['taste-same','objective'],['taste-job','needs'],['taste-everyone','wrong-objective'],['disagree-job','needs'],['disagree-stuck','procedure'],['society-wrong','yes-objective'],['society-job','needs'],['limit-jones','rescue'],['limit-why','objective'],['limit-job','needs'],['uncaring-what','objective'],['uncaring-job','needs'],['final-position','objective']]],
 ['reasons between people',[['start-view','exist-unneeded'],['start-cat','reasons'],['start-neighbours','better-reasons'],['origin-job','covered'],['origin-debunk','street'],['taste-same','reasons'],['taste-job','covered'],['taste-everyone','wrong-reasons'],['disagree-job','covered'],['disagree-stuck','procedure'],['society-wrong','yes-reasons'],['society-job','covered'],['limit-jones','rescue'],['limit-why','complaints'],['limit-job','covered'],['uncaring-what','answer'],['uncaring-job','covered'],['final-position','exist-unneeded']]],
 ['consistent relativist',[['start-view','none'],['start-neighbours','no-answer'],['taste-same','reasons'],['taste-everyone','right'],['society-wrong','no'],['disagree-stuck','majority'],['limit-jones','vote'],['final-position','none']]],
 ['undecided',[['start-view','unsure'],['start-cat','mix'],['origin-job','unsure'],['taste-job','unsure'],['limit-jones','unsure'],['final-position','unsure']]]
];
for(const [name,pairs] of routes)test(`a ${name} can answer throughout without a false flag or check`,()=>{
 const a=path(pairs),out=exportJourney(a,[],1000);
 assert.deepEqual(consistencyReview(a).all.map(c=>c.id),[],name);
 assert.ok(pairs.every(([id,c])=>!choiceFor(id,c).flag),name);
 for(const [id,c] of pairs){const r=out.responses.find(x=>x.step_id===id);assert.equal(r?.choice_id,c,`${name}: ${id}`);assert.equal(r.feedback,choiceFor(id,c).feedback);}
 assert.equal(out.summary.flagged.length,0);
});
test('holding a view is never a flag; flags mark only particular inferences or overstated evidence',()=>{
 for(const s of steps)for(const c of s.choices){if(c.flag)assert.ok(['inference','unsupported'].includes(c.kind),`${s.id}/${c.id}`);if(c.ledger)assert.equal(c.flag,false,`${s.id}/${c.id} ledger answers are positions`);}
 const flags=steps.flatMap(s=>s.choices.filter(c=>c.flag).map(c=>s.id+'/'+c.id));
 assert.ok(flags.includes('origin-debunk/debunked')&&flags.includes('origin-debunk/proves'),'both evolutionary overreaches are flagged');
 assert.ok(flags.includes('taste-same/same'),'denying objective facts is not taken to make cruelty taste');
});
test('every choice states its consequence before it is chosen, and every serious position uses the same kind',()=>{
 for(const s of steps){assert.ok(s.context,s.id);for(const c of s.choices){assert.ok(c.follows&&c.follows.length<200,`${s.id}/${c.id} follows`);assert.ok(['contested','reflection','inference','unsupported'].includes(c.kind),`${s.id}/${c.id} kind`);}}
 assert.ok(!steps.some(s=>s.choices.some(c=>c.kind==='commitment')),'no view is labelled the author’s commitment');
});
test('the ledger has one question per job, with the same four answers, and reports current answers only',()=>{
 for(const j of jobs){const s=stepById(j.step);assert.equal(s.job,j.id);assert.deepEqual(s.choices.map(c=>c.ledger),['needs','covered','partly','unsure']);}
 let a=path([['origin-job','needs'],['taste-job','covered'],['limit-jones','rescue'],['limit-job','partly']]);
 let l=ledgerReview(a);assert.equal(l.needs,1);assert.equal(l.covered,1);assert.equal(l.partly,1);assert.equal(l.open,jobs.length-3);
 a=recordAnswer(a,'origin-job','covered',200);l=ledgerReview(a);assert.equal(l.needs,0);assert.equal(l.covered,2);
});

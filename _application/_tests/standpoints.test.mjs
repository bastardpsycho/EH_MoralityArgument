import test from 'node:test';
import assert from 'node:assert/strict';
import {recordAnswer,choiceFor,consistencyReview,exportJourney,steps,stepById,ledgerReview,ledgerOutcome,jobs,jobKinds} from '../data.mjs';
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
 assert.ok(flags.includes('gap-mind/follows'),'“values need a mind, so morality cannot be objective” is flagged as not following');
 assert.ok(flags.includes('gap-nature/right')&&flags.includes('gap-smoking/nothing'),'both naturalistic and nihilistic misreadings of the gap are flagged');
 assert.ok(!flags.includes('taste-same/same'),'denying objective facts while calling cruelty taste is a consistent position, not a flag');
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
test('the ledger never reports more than the answers show (Astra U-11)',()=>{
 const all=k=>path(jobs.map(j=>[j.step,stepById(j.step).choices.find(c=>c.ledger===k).id]));
 assert.equal(ledgerOutcome(ledgerReview({})).verdict,'open');
 assert.equal(ledgerOutcome(ledgerReview(all('covered'))).verdict,'covered');
 for(const k of ['unsure','partly']){const o=ledgerOutcome(ledgerReview(all(k)));assert.equal(o.verdict,'unsettled',k);assert.ok(!/every job was covered/.test(o.text),k);assert.match(o.text,/not established/);}
 const mixed=ledgerOutcome(ledgerReview(path([['origin-job','covered'],['taste-job','unsure']])));
 assert.equal(mixed.verdict,'unsettled');assert.match(mixed.text,/not answered yet/);
 const one=ledgerOutcome(ledgerReview(path([['origin-job','covered'],['limit-jones','rescue'],['limit-job','needs']])));
 assert.equal(one.verdict,'narrower');assert.match(one.text,/Ruling out terrible agreements/);
 assert.ok(jobs.every(j=>jobKinds[j.kind]),'every job has a kind, so covered answers of one kind are not read as many independent confirmations');
});
test('the is–ought room separates the gap from the conclusion that morality cannot be objective',()=>{
 assert.equal(choiceFor('gap-mind','follows').kind,'inference');
 assert.equal(choiceFor('gap-mind','further').flag,false);assert.equal(choiceFor('gap-mind','objective').flag,false);
 assert.equal(choiceFor('gap-promise','yes-fact').flag,false,'Searle’s bridge is a serious position, not an error');
 assert.equal(stepById('gap-job').job,'J2');
});

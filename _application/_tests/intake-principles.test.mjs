import test from 'node:test';
import assert from 'node:assert/strict';
import {values,valuesIn,intakeItems,steps,rooms,recordAnswer,heldPrinciples,principleNotes,principlesFor,intakeComparison} from '../data.mjs';
import {recordValueAnswer,intakePicks,togglePriority,personalRecord} from '../journey.mjs';
const keys=new Set(steps.flatMap(s=>s.choices.map(c=>s.id+'/'+c.id)));
test('twelve opening questions, each tested in its own room (except the conceptual opening and hall of objections), each pre-selecting a matching principle there',()=>{
 assert.equal(intakeItems.length,12);assert.deepEqual(intakeItems.map(i=>i.room).sort(),rooms.map(r=>r.id).filter(r=>!['hall','evaluation'].includes(r)).sort());
 for(const i of intakeItems){for(const side of ['agree','disagree']){const p=values.filter(v=>v.intake?.item===i.id&&v.intake.when===side);assert.equal(p.length,1,`${i.id} ${side}`);assert.equal(p[0].room,i.room);}}
});
test('an opening-answer principle is exactly the statement answered, or its plain negation, so the tool never attributes more than was said',()=>{
 for(const i of intakeItems){assert.equal(values.find(v=>v.intake?.item===i.id&&v.intake.when==='agree').short,i.statement);assert.equal(values.find(v=>v.intake?.item===i.id&&v.intake.when==='disagree').short,i.negation);}
});
test('principle links are strict: a broad claim is not said to conflict with a narrower answer it is compatible with',()=>{
 const p=values.find(v=>v.id==='p-objective');
 const strainsOf=id=>values.find(v=>v.id===id).strains;
 for(const [id,k] of [['p-lone-right','taste-everyone/right'],['p-facts-alone','gap-nature/flourishing'],['p-facts-alone','gap-promise/yes-fact'],['p-facts-alone','gap-nature/right'],['p-purpose','prison-victim/desert'],['p-hidden-premise','gap-nature/right']])assert.ok(!strainsOf(id).includes(k),`${id} does not strain ${k} (Astra U-13 counterexamples)`);
 const future=intakeItems.find(i=>i.id==='i-future'),desert=intakeItems.find(i=>i.id==='i-desert');
 assert.match(future.statement,/at least as much/);assert.match(future.negation,/matter less/,'the negation of “at least as much” is “less”, so the tool does not choose a direction for the visitor');
 assert.match(desert.negation,/not always/,'rejecting a general rule is recorded as “not always”, not as a blanket opposite rule');
 assert.ok(!p.strains.includes('taste-everyone/right'),'“some things are wrong whatever we agree” is compatible with this one killing being right under approval');
 assert.ok(p.strains.includes('start-view/none'));
 assert.ok(!values.some(v=>v.strains.some(k=>/-job\/covered$/.test(k))&&v.id==='p-objective'),'not needing a fact never contradicts its existing');
 const link=(id,k)=>{const v=values.find(x=>x.id===id);return v.fits.includes(k)?'fits':v.strains.includes(k)?'strains':null;};
 assert.equal(link('p-objective','start-view/exist-unneeded'),null,'“they may exist” neither asserts nor denies truth-independence');
 assert.equal(link('p-made','start-view/exist-unneeded'),null);
 for(const k of ['society-wrong/yes-objective','society-wrong/yes-reasons'])assert.equal(link('p-trust-many',k),null,`${k}: slavery was never accepted by everyone, so it is no exception to “not right against everyone”`);
 assert.equal(link('p-trust-many','society-adaptive/still-reasons'),'strains','universal acceptance is the case the negation rules on');
 assert.equal(link('p-numbers','limit-jones/rescue'),null,'“can be right” to aggregate does not conflict with rescuing in one case');
});
test('distinguishing acts, people and outcomes allows an outcome-based standard of rightness',()=>{
 const held=[values.find(v=>v.id==='p-act-person-outcome')];
 assert.deepEqual(principleNotes('eval-drug','by-results',held),[],'an outcome-based criterion does not conflate the three concepts');
 assert.equal(principleNotes('eval-drivers','bad-person',held)[0].fit,'strains','inferring worse character solely from unlucky harm still conflicts');
});
test('every principle is a plain sentence whose fit and tension links point at real answers, with a reason for each',()=>{
 for(const v of values){assert.ok(/\.$/.test(v.short)&&v.short.length<140&&v.label.length<40,v.id);
  for(const k of [...v.fits,...v.strains])assert.ok(keys.has(k),`${v.id}: ${k}`);
  assert.ok(!v.fits.some(k=>v.strains.includes(k)),`${v.id} fits and strains the same answer`);
  if(v.fits.length)assert.ok(v.fitNote,v.id);if(v.strains.length)assert.ok(v.strainNote,v.id);}
 for(const r of rooms)assert.equal(valuesIn(r.id).length,3);
});
test('opening answers pre-select principles only on entering their room, never override a visitor’s release, and skip neutral answers',()=>{
 let intake=recordValueAnswer({},'i-objective',2,1);intake=recordValueAnswer(intake,'i-numbers',0,2);intake=recordValueAnswer(intake,'i-consensus',-1,3);
 assert.throws(()=>recordValueAnswer({},'i-objective',3,1));assert.throws(()=>recordValueAnswer({},'missing',1,1));
 let picks=intakePicks({},intake,'hub',{},10);assert.equal(picks['p-objective'].from,'intake');assert.equal(picks['p-made'],undefined);
 assert.equal(Object.keys(intakePicks({},intake,'village',{},10)).length,0,'a neutral answer selects nothing');
 assert.ok(intakePicks({},intake,'commute',{},10)['p-agreement'],'disagreeing selects the opposite principle');
 const released=togglePriority(picks,'p-objective',11);assert.equal(intakePicks(released,intake,'hub',{'p-objective':true},12)['p-objective'],undefined,'a release is respected');
});
test('a chosen answer is reported as fitting or pulling against each held principle, with the principle’s reason',()=>{
 const intake=recordValueAnswer({},'i-objective',2,1),held=heldPrinciples({},intake,{});
 assert.deepEqual(held.map(p=>p.id),['p-objective']);
 const strain=principleNotes('start-view','none',held);assert.equal(strain[0].fit,'strains');assert.equal(strain[0].note,values.find(v=>v.id==='p-objective').strainNote);
 assert.equal(principleNotes('start-cat','fact',held)[0].fit,'fits');
 assert.equal(principleNotes('taste-job','covered',held).length,0,'saying a job needs no objective facts does not contradict believing they exist');
 assert.ok(principlesFor('start-view',held).length);
 assert.equal(heldPrinciples({},intake,{'p-objective':true}).length,0,'released intake principles are not held');
});
test('the closing comparison reports movement and the decisions that fitted or strained each opening answer',()=>{
 const intake=recordValueAnswer({},'i-objective',2,1),outtake=recordValueAnswer({},'i-objective',1,2);
 let a=recordAnswer({},'start-view','none',3);a=recordAnswer(a,'start-cat','fact',4);
 const row=intakeComparison(intake,outtake,a).find(r=>r.item.id==='i-objective');
 assert.equal(row.moved,-1);assert.equal(row.principle.id,'p-objective');assert.equal(row.fits,1);assert.equal(row.strains[0].step.id,'start-view');
 const rec=personalRecord(a,[],{},{},'explore',5,{},intake,outtake,{});
 assert.equal(rec.opening_answers[0].score,2);assert.equal(rec.closing_answers[0].score,1);
 assert.equal(rec.value_movement.find(m=>m.item_id==='i-objective').moved,-1);
 assert.deepEqual(rec.principles_held[0].in_tension,['start-view/none']);
});

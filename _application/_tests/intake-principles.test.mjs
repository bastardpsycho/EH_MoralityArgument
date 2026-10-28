import test from 'node:test';
import assert from 'node:assert/strict';
import {values,valuesIn,intakeItems,steps,rooms,recordAnswer,heldPrinciples,principleNotes,principlesFor,intakeComparison} from '../data.mjs';
import {recordValueAnswer,intakePicks,togglePriority,personalRecord} from '../journey.mjs';
const keys=new Set(steps.flatMap(s=>s.choices.map(c=>s.id+'/'+c.id)));
test('twelve opening questions, one tested in each room, each pre-selecting a matching principle there',()=>{
 assert.equal(intakeItems.length,12);assert.deepEqual(intakeItems.map(i=>i.room).sort(),rooms.map(r=>r.id).sort());
 for(const i of intakeItems){for(const side of ['agree','disagree']){const p=values.filter(v=>v.intake?.item===i.id&&v.intake.when===side);assert.equal(p.length,1,`${i.id} ${side}`);assert.equal(p[0].room,i.room);}}
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
 const strain=principleNotes('taste-everyone','right',held);assert.equal(strain[0].fit,'strains');assert.equal(strain[0].note,values.find(v=>v.id==='p-objective').strainNote);
 assert.equal(principleNotes('start-cat','fact',held)[0].fit,'fits');
 assert.equal(principleNotes('taste-job','covered',held).length,0,'saying a job needs no objective facts does not contradict believing they exist');
 assert.ok(principlesFor('taste-everyone',held).length);
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

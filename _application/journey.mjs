// Personal record: opening and closing value answers, principles carried, working reasons. None is a vote for a philosophical conclusion.
import {values,steps,exportJourney,answerState,intakeItems,intakeSide,heldPrinciples,principleReview,intakeComparison,ledgerReview} from './data.mjs';
export const VALUE_PROMPT_MS=30000;
const timestamp=ts_ms=>{if(!Number.isSafeInteger(ts_ms)||ts_ms<0)throw Error('Invalid ts_ms');};
export const valueById=id=>values.find(v=>v.id===id);
export function crystalAction(pending,id,ts_ms){
 timestamp(ts_ms);if(!valueById(id))throw Error('Unknown value');
 if(pending?.id===id&&ts_ms>=pending.ts_ms&&ts_ms-pending.ts_ms<VALUE_PROMPT_MS)return {toggle:true,pending:null};
 return {toggle:false,pending:{id,ts_ms}};
}
export function togglePriority(picks,id,ts_ms,from='visitor'){
 timestamp(ts_ms);if(!valueById(id))throw Error('Unknown value');
 const next={...picks};if(next[id])delete next[id];else next[id]={ts_ms,from};return next;
}
export const prioritiesIn=picks=>values.filter(v=>picks[v.id]);
// Opening or closing answers: score -2..2, or null to skip.
export function recordValueAnswer(answers,itemId,score,ts_ms){
 timestamp(ts_ms);if(!intakeItems.some(i=>i.id===itemId))throw Error('Unknown value question');
 const next={...answers};if(score===null)delete next[itemId];else{if(![-2,-1,0,1,2].includes(score))throw Error('Invalid score');next[itemId]={score,ts_ms};}return next;
}
// On entering a room, keep the principle matching the visitor's opening answer, unless they have already decided about it.
export function intakePicks(picks,intake,room,decided,ts_ms){
 timestamp(ts_ms);let next=picks;
 for(const p of values.filter(v=>v.room===room&&v.intake)){const a=intake[p.intake.item];if(!a||decided[p.id]||next[p.id])continue;if(intakeSide(a.score)===p.intake.when)next={...next,[p.id]:{ts_ms,from:'intake'}};}
 return next;
}
export function recordNote(notes,stepId,text,ts_ms){
 timestamp(ts_ms);if(!steps.some(s=>s.id===stepId)||typeof text!=='string')throw Error('Invalid working reason');
 const next={...notes};if(text.trim())next[stepId]={text:text.slice(0,2000),ts_ms};else delete next[stepId];return next;
}
export function personalRecord(answers,overrides,picks,notes,mode,ts_ms,resolutions={},intake={},outtake={},released={}){
 timestamp(ts_ms);const base=exportJourney(answers,overrides,ts_ms,resolutions),state=answerState(answers),held=heldPrinciples(picks,intake,released);
 return {...base,audience_mode:mode==='stress-test'?'stress-test':'explore',
  opening_answers:intakeItems.flatMap(i=>intake[i.id]?[{item_id:i.id,statement:i.statement,score:intake[i.id].score,ts_ms:intake[i.id].ts_ms}]:[]),
  closing_answers:intakeItems.flatMap(i=>outtake[i.id]?[{item_id:i.id,statement:i.statement,score:outtake[i.id].score,ts_ms:outtake[i.id].ts_ms}]:[]),
  value_movement:intakeComparison(intake,outtake,answers).map(r=>({item_id:r.item.id,before:r.before,after:r.after,moved:r.moved,principle_id:r.principle?.id||null,decisions_fitting:r.fits,decisions_in_tension:r.strains.map(s=>({step_id:s.step.id,choice_id:s.choice.id}))})),
  values:prioritiesIn(picks).map(v=>({id:v.id,room_id:v.room,label:v.label,short:v.short,long:v.long,kind:v.kind,source_ids:[...v.sources],from:picks[v.id].from||'visitor',ts_ms:picks[v.id].ts_ms})),
  principles_held:principleReview(answers,held).map(r=>({id:r.principle.id,from_intake:r.principle.fromIntake,fits:r.fits.map(h=>h.step.id+'/'+h.choice.id),in_tension:r.strains.map(h=>h.step.id+'/'+h.choice.id)})),
  working_reasons:steps.flatMap(s=>notes[s.id]?[{step_id:s.id,path_status:state.current[s.id]?'current':state.stale.some(x=>x.step.id===s.id)?'needs-reconfirmation':state.active.some(x=>x.id===s.id)?'awaiting-response':'inactive',text:notes[s.id].text,ts_ms:notes[s.id].ts_ms}]:[]),
  collection_note:'Opening answers pre-select principles. Principles and working reasons record what you hold; they are not evidence weights or a moral score.'};
}
export {ledgerReview};

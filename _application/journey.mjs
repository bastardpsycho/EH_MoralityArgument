// Personal priorities and working reasons. None is a vote for a philosophical conclusion.
import {values,steps,exportJourney,answerState} from './data.mjs';
export const VALUE_PROMPT_MS=30000;
const timestamp=ts_ms=>{if(!Number.isSafeInteger(ts_ms)||ts_ms<0)throw Error('Invalid ts_ms');};
export const valueById=id=>values.find(v=>v.id===id);
export function crystalAction(pending,id,ts_ms){
 timestamp(ts_ms);if(!valueById(id))throw Error('Unknown value');
 if(pending?.id===id&&ts_ms>=pending.ts_ms&&ts_ms-pending.ts_ms<VALUE_PROMPT_MS)return {toggle:true,pending:null};
 return {toggle:false,pending:{id,ts_ms}};
}
export function togglePriority(picks,id,ts_ms){
 timestamp(ts_ms);if(!valueById(id))throw Error('Unknown value');
 const next={...picks};if(next[id])delete next[id];else next[id]={ts_ms};return next;
}
export const prioritiesIn=picks=>values.filter(v=>picks[v.id]);
export function recordNote(notes,stepId,text,ts_ms){
 timestamp(ts_ms);if(!steps.some(s=>s.id===stepId)||typeof text!=='string')throw Error('Invalid working reason');
 const next={...notes};if(text.trim())next[stepId]={text:text.slice(0,2000),ts_ms};else delete next[stepId];return next;
}
export function personalRecord(answers,overrides,picks,notes,mode,ts_ms,resolutions={}){
 timestamp(ts_ms);const base=exportJourney(answers,overrides,ts_ms,resolutions),state=answerState(answers);
 return {...base,audience_mode:mode==='stress-test'?'stress-test':'explore',values:prioritiesIn(picks).map(v=>({id:v.id,room_id:v.room,label:v.label,short:v.short,long:v.long,kind:v.kind,source_ids:[...v.sources],ts_ms:picks[v.id].ts_ms})),working_reasons:steps.flatMap(s=>notes[s.id]?[{step_id:s.id,path_status:state.current[s.id]?'current':state.stale.some(x=>x.step.id===s.id)?'needs-reconfirmation':state.active.some(x=>x.id===s.id)?'awaiting-response':'inactive',text:notes[s.id].text,ts_ms:notes[s.id].ts_ms}]:[]),collection_note:'Selected values and working reasons record priorities; they are not evidence weights or a moral-truth score.'};
}

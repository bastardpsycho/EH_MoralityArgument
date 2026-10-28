import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {edition,rooms,order,roomById,roomExhibits,objections,steps,stepsIn,values,valuesIn,choiceFor,recordAnswer,exitReview,exportJourney,wallArt} from '../data.mjs';
import {sources} from '../sources.mjs';
import {inheritedWallArt} from '../art.mjs';
import {artSlots,layoutRoom,buildRoom,animateRoom} from '../rooms.mjs';
import {renderPage,esc} from '../page.mjs';
import {runtimeAssets,__version__} from '../scaffold.mjs';
import {crystalAction,VALUE_PROMPT_MS,togglePriority,recordNote,personalRecord} from '../journey.mjs';
const root=new URL('../',import.meta.url);
const checkRefs=(ids,owner)=>{for(const id of ids||[])assert(sources.some(s=>s.id===id),`${owner}: missing ${id}`);};

test('the topical route, cases, values and response rationales resolve their sources',()=>{
 assert.equal(rooms.length,12);assert.equal(new Set(order).size,rooms.length);
 assert.equal(new Set(steps.map(s=>s.id)).size,steps.length);
 assert.equal(new Set(values.map(v=>v.id)).size,values.length);
 assert.equal(new Set(sources.map(s=>s.id)).size,sources.length);
 const mainRooms=steps.filter(s=>!s.branch).map(s=>s.room);assert.deepEqual(mainRooms.filter((id,i)=>!i||id!==mainRooms[i-1]),order,'reading decisions follow the room route');
 assert.equal(rooms.filter(r=>r.caseStudy).length,3);
 assert.match(rooms[0].name+' '+rooms[0].title,/objectiv/i);
 for(const r of rooms){assert(roomById(r.next));assert(r.takeaway&&r.section);assert.equal(valuesIn(r.id).length,3,`${r.id} has three optional value crystals`);assert(stepsIn(r.id).length>=3);
  for(const x of roomExhibits(r))checkRefs(x.sources,x.id);
  if(r.caseStudy){const c=r.caseStudy;for(const k of ['title','context','decision','lesson','limits'])assert(c[k],`${r.id}: ${k}`);assert(c.facts.length>=2);for(const f of c.facts){assert(f.text);assert(f.sources.length);checkRefs(f.sources,r.id+' case fact');}checkRefs(c.sources,r.id+' case');}
 }
 for(const v of values){assert(roomById(v.room));for(const k of ['label','short','long','kind'])assert(v[k],v.id+k);assert(v.long.length>v.short.length);checkRefs(v.sources,v.id);}
 assert.equal(objections.length,10);for(const o of objections){assert(o.skeptic&&o.reply&&o.burden);checkRefs(o.sources,o.id);}
 for(const s of steps){assert(roomById(s.room));assert(s.context);assert(s.choices.length>=3);assert.equal(new Set(s.choices.map(c=>c.id)).size,s.choices.length);checkRefs(s.sources,s.id);for(const x of s.evidence||[])checkRefs(x.sources||x.sourceIds,s.id);for(const c of s.choices){assert(c.label&&c.feedback);checkRefs(c.sources,s.id+'/'+c.id);if(c.kind==='contested')assert.equal(c.flag,false,'genuine disagreement remains a live option');}}
 for(const s of sources){assert.equal(new URL(s.url).protocol,'https:');for(const k of ['title','author','kind','locator','access','note','limits'])assert(String(s[k]||'').trim(),s.id+k);}
});

test('reading and interactive editions carry the same cases, reasoning, values and access limits',async()=>{
 const html=renderPage();assert.equal(await readFile(new URL('index.html',root),'utf8'),html);assert.doesNotMatch(html,/undefined|\[object Object\]/);
 const includes=(v,owner)=>assert(html.includes(esc(v)),owner+': '+v);
 for(const r of rooms){includes(r.title,r.id);includes(r.intro,r.id);includes(r.takeaway,r.id);if(r.caseStudy){for(const k of ['title','context','decision','lesson','limits'])includes(r.caseStudy[k],r.id);for(const f of r.caseStudy.facts)includes(f.text,r.id);}else if(r.id!=='hall')for(const x of roomExhibits(r)){includes(x.title,x.id);includes(x.body,x.id);if(x.topic)includes(x.topic,x.id+' topic');for(const pair of x.points||[])for(const text of pair)includes(text,x.id+' argument point');}}
 for(const o of objections)for(const k of ['title','skeptic','reply','burden'])includes(o[k],o.id);
 for(const s of steps){if(s.topic)includes(s.topic,s.id+' topic');includes(s.prompt,s.id);includes(s.context,s.id);for(const x of s.evidence||[])includes(x.text,s.id);for(const c of s.choices){includes(c.label,s.id);includes(c.feedback,s.id);}}
 for(const v of values)for(const k of ['label','short','long'])includes(v[k],v.id);
 for(const s of sources)for(const k of ['title','url','author','kind','locator','access','note','limits'])includes(s[k],s.id);
 for(const a of wallArt)includes(a.alt,a.id);
 assert.match(html,/<noscript><style>\.stage\{display:none\}<\/style><\/noscript>/);assert.match(html,/href="\?view=controls#hub"/);assert.match(html,/id="challenge-btn"/);
 assert.equal(esc('<script>"&\''),'&lt;script&gt;&quot;&amp;&#39;');
});

test('every room and crystal is reachable with clear separation from exhibits and doorways',()=>{
 const seen=new Set(['hub']),queue=['hub'];
 while(queue.length){const r=roomById(queue.shift()),layout=layoutRoom(r,roomExhibits(r),valuesIn(r.id),order);for(const p of layout.targets.filter(t=>t.kind==='portal'))if(!seen.has(p.id)){seen.add(p.id);queue.push(p.id);}}
 assert.equal(seen.size,rooms.length);
 for(const r of rooms){const ex=roomExhibits(r),vs=valuesIn(r.id),l=layoutRoom(r,ex,vs,order),a=l.valuesArea;assert(a);assert(Math.hypot(a.x,a.z)+a.radius<r.radius*.6);assert(Math.hypot(l.spawn.x,l.spawn.z)<l.bounds);
  for(const exhibit of ex)assert(l.targets.some(t=>t.kind==='exhibit'&&t.id===exhibit.id),r.id+': '+exhibit.id+' has a spatial target');
  for(const t of l.targets){assert(Math.hypot(t.x,t.z)<=r.radius,r.id+':'+t.id);if(t.kind==='portal')assert(roomById(t.id));}
  for(const v of vs)assert(l.targets.some(t=>t.kind==='value'&&t.id===v.id));
  const gems=l.targets.filter(t=>t.kind==='value');for(let i=0;i<gems.length;i++){const t=gems[i];assert(Math.hypot(t.x-a.x,t.z-a.z)+.6<a.radius);for(const other of gems.slice(i+1))assert(Math.hypot(t.x-other.x,t.z-other.z)>1.5);}
  for(const t of l.targets.filter(t=>['exhibit','reading'].includes(t.kind))){const footprint=t.id==='tally'?1.4:t.kind==='reading'?1.1:ex.find(x=>x.id===t.id)?.prop==='table'?2.4:1.05;assert(Math.hypot(t.x-a.x,t.z-a.z)>a.radius+footprint+1.0,r.id+':'+t.id+' clear of crystals');}
 }
});

test('all topical scenes build finite geometry and animate collected crystals without scoring a worldview',()=>{
 const uploaded=[];const engine={upload(mesh){for(const k of ['p','n','c'])assert(mesh[k].every(Number.isFinite),'finite '+k);uploaded.push(mesh.count);return {count:mesh.count};}};
 for(const r of rooms){const b=buildRoom(engine,r,roomExhibits(r),valuesIn(r.id),order,id=>roomById(id).theme,wallArt.filter(a=>a.room===r.id));assert.equal(b.targets.filter(t=>t.kind==='value').length,3);const state={seen:new Set(),picks:{[valuesIn(r.id)[0].id]:{ts_ms:1}},hover:null};animateRoom(b,.016,1,state,true);for(const d of b.dyn)assert([...d.t.m,...d.t.n].every(Number.isFinite),r.id+':'+d.name);}
 assert(uploaded.length>0);
});

test('topical diagrams fit their wall slots and inherited photographs retain their exact bytes',async()=>{
 assert.equal(wallArt.length,rooms.length);assert(wallArt.every(a=>a.kind==='diagram'));
 for(const a of wallArt){const slot=artSlots[a.room].find(s=>s.id===a.slot);assert(slot);assert(runtimeAssets.includes(a.file));const xml=await readFile(new URL(a.file,root),'utf8');assert.match(xml,/viewBox="0 0 1200 800"/);assert.match(xml,/<svg/);assert.doesNotMatch(xml,/<(?:script|image)\b|(?:href|src)\s*=/i);assert(Math.min(slot.w,slot.h*a.aspect)/a.aspect<=slot.h);}
 const receipt=JSON.parse(await readFile(new URL('source-manifest.json',root),'utf8'));
 assert.equal(inheritedWallArt.length,40);
 for(const x of receipt.source_files.filter(x=>x.file.endsWith('.jpg'))){const hash=createHash('sha256').update(await readFile(new URL(x.file,root))).digest('hex');assert.equal(hash,x.destination_sha256,x.file);}
});

test('response and note records require valid epoch milliseconds and preserve prior snapshots',()=>{
 const s=steps[0],c=s.choices[0],prior={};const next=recordAnswer(prior,s.id,c.id,1700000000000);assert.notEqual(next,prior);assert.deepEqual(prior,{});assert.equal(next[s.id].ts_ms,1700000000000);
 for(const t of [-1,1.5,NaN,Infinity,Number.MAX_SAFE_INTEGER+1,'1700000000000',null,undefined])assert.throws(()=>recordAnswer({},s.id,c.id,t));
 assert.throws(()=>recordAnswer({},'missing',c.id,1));assert.throws(()=>recordAnswer({},s.id,'missing',1));
 const notes=recordNote({},s.id,'My reason is provisional.',1700000000001);assert.equal(notes[s.id].text,'My reason is provisional.');assert.deepEqual(recordNote(notes,s.id,' ',1700000000002),{});assert.throws(()=>recordNote({},'missing','a',1));assert.throws(()=>recordNote({},s.id,'a',NaN));
});

test('a flagged claim can be reconsidered; serious alternatives and uncertainty are not error states',()=>{
 const s=steps.find(s=>s.choices.some(c=>c.flag));assert(s);const flag=s.choices.find(c=>c.flag),fine=s.choices.find(c=>!c.flag);let answers=recordAnswer({},s.id,flag.id,1);assert.equal(exitReview(s.room,answers).flagged.length,1);answers=recordAnswer(answers,s.id,fine.id,2);assert.equal(exitReview(s.room,answers).flagged.length,0);
 for(let i=0;i<steps.length;i++){const next=exitReview(s.room,answers).unanswered[0];if(!next)break;answers=recordAnswer(answers,next.id,next.choices.find(c=>!c.flag).id,10+i);}
 assert.equal(exitReview(s.room,answers).needsPrompt,false);
 const realistRoom=roomById('climate');let rival={};for(let i=0;i<steps.length;i++){const st=exitReview(realistRoom.id,rival).unanswered[0];if(!st)break;const c=st.choices.find(c=>c.kind==='contested')||st.choices.find(c=>!c.flag);rival=recordAnswer(rival,st.id,c.id,10+i);}assert.equal(exitReview(realistRoom.id,rival).needsPrompt,false);
 assert(exitReview('hub',{}).unanswered.length);assert.equal(exitReview('hub',{}).flagged.length,0);
});

test('crystals require inspection before a second-click pick and values can be removed without a cap',()=>{
 const v=values[0],first=crystalAction(null,v.id,1700000000000);assert.equal(first.toggle,false);assert.equal(crystalAction(first.pending,v.id,1700000000000+VALUE_PROMPT_MS-1).toggle,true);assert.equal(crystalAction(first.pending,v.id,1700000000000+VALUE_PROMPT_MS).toggle,false);assert.equal(crystalAction(first.pending,values[1].id,1700000000001).toggle,false);assert.throws(()=>crystalAction(null,'missing',1));
 let picks={};for(const v of values)picks=togglePriority(picks,v.id,1700000000010);assert.equal(Object.keys(picks).length,values.length);const next=togglePriority(picks,v.id,1700000000020);assert.equal(next[v.id],undefined);assert(picks[v.id],'prior snapshot unchanged');
});

test('private exports include actual choices, optional values and working reasons without interpreting them as a score',async()=>{
 const s=steps[0],c=s.choices[0],v=values[0],answers=recordAnswer({},s.id,c.id,1700000000000),picks=togglePriority({},v.id,1700000000001),notes=recordNote({},s.id,'A concrete private reason.',1700000000002),overrides=[{ts_ms:1700000000003,from_room:'hub',to_room:'commute',flagged:[],unanswered:[]}];
 const basic=exportJourney(answers,overrides,1700000000004);assert.equal(basic.edition,edition);const data=personalRecord(answers,overrides,picks,notes,'stress-test',1700000000004);assert.equal(data.audience_mode,'stress-test');assert.equal(data.ts_ms,1700000000004);assert.equal(data.values[0].id,v.id);assert.equal(data.values[0].long,v.long);assert.equal(data.working_reasons[0].text,notes[s.id].text);assert.equal(data.responses[0].choice_id,c.id);assert.equal(data.responses[0].feedback,c.feedback);assert.deepEqual(data.exit_overrides,overrides);assert.doesNotMatch(JSON.stringify(data),/"(?:scoreboard|remote_days|commute_hours|truth_score)"/);
 const unpicked=personalRecord(answers,overrides,{},notes,'explore',1700000000005);assert.deepEqual(unpicked.values,[]);assert.deepEqual(unpicked.responses,data.responses,'picks never infer a different response');
 assert.equal(JSON.parse(await readFile(new URL('package.json',root),'utf8')).version,__version__);
});

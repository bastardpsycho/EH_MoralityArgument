// MORARG: evidence, reasons, personal judgment. Session state is local and temporary.
import {rooms,order,roomById,roomExhibits,wallArt,artIn,artShape,artDims,badges,objections,steps,stepsIn,choiceFor,recordAnswer,roomReview,journeyReview,exitReview,values,valuesIn,stepById,answerState,currentChoice,consistencyReview,acknowledgeCheck,consistencyRules} from './data.mjs';
import {esc as e,references as refs,evidenceMarkup,caseMarkup,conditionText,argumentPoints,topicLabel} from './presentation.mjs';
import {valueById,crystalAction,togglePriority,prioritiesIn,recordNote,personalRecord} from './journey.mjs';
import {__version__} from './scaffold.mjs';
import {createEngine,hitSphere,hitFloor} from './engine.mjs';
import {buildRoom,animateRoom,palettes} from './rooms.mjs';
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const stage=$('#stage'),canvas=$('#scene'),labelsEl=$('#labels'),card=$('#card'),cardBody=$('#card-body');
const controlsOnly=new URLSearchParams(location.search).get('view')==='controls';
const motionQuery=matchMedia('(prefers-reduced-motion: reduce)');
const S={room:'hub',seen:new Set(),visited:new Set(),answers:{},overrides:[],picks:{},notes:{},mode:'explore',resolutions:{},checkDrafts:{},hover:null,motion:!motionQuery.matches,entered:false};
const D=S;
let engine=null,built=null,openId=null,busy=false,pendingRoom=null,pendingHistoryMode='push',pendingValue=null;
const cache=new Map(),keys=new Set(),tagEls=new Map();
let glide=null,walkTo=null,vel=[0,0];
const themeOf=id=>roomById(id)?.theme,exhibitsOf=room=>roomExhibits(room);
function announce(t){$('#announce').textContent=t;}
const badge=k=>`<span class="badge" title="${e(badges[k]||'')}">${e(k)}</span>`;
function openCard(html,id){keys.clear();vel=[0,0];cardBody.innerHTML=html;card.hidden=false;openId=id;stage.classList.add('card-open');card.scrollTop=0;cardBody.querySelector('h2')?.focus({preventScroll:true});}
function closeCard(){card.hidden=true;openId=null;pendingValue=null;stage.classList.remove('card-open');canvas.focus({preventScroll:true});}
function updateMeter(){const r=journeyReview(S.answers,S.resolutions);$('#meter-fill').style.height=`${r.answered/r.total*100}%`;$('#meter-score').textContent=r.answered;$('#meter-max').textContent=r.total;$('#meter-level').textContent='Decisions considered';$('#meter-sub').textContent='Current path · follow-ups adapt';$('#value-count').textContent=prioritiesIn(S.picks).length;$('#meter').setAttribute('aria-label',`${r.answered} of ${r.total} responses; ${prioritiesIn(S.picks).length} values collected`);}
function nextIndex(id){const l=stepsIn(id,S.answers),i=l.findIndex(s=>!currentChoice(S.answers,s.id));return i<0?0:i;}
const valueTile=v=>`<button class="value-tile value-${e(v.kind)}" data-inspect-value="${e(v.id)}" aria-pressed="${!!S.picks[v.id]}"><span class="gem" aria-hidden="true"></span><strong>${e(v.label)}</strong><small>${e(v.short)}</small><em>${S.picks[v.id]?'Kept ✓':'Inspect value'}</em></button>`;
function roomCard(room){const ex=exhibitsOf(room),review=roomReview(room.id,S.answers,S.resolutions);return `<p class="kicker">${e(room.kicker)}${room.caseStudy?' · CASE STUDY':''}</p><h2 tabindex="-1">${e(room.title)}</h2><p class="lead">${e(room.intro)}</p>${room.takeaway?`<div class="room-takeaway"><strong>The case to examine</strong><p>${e(room.takeaway)}</p></div>`:''}${room.caseStudy?`<p class="case-preview">${e(room.caseStudy.context)}</p><button class="ghost" data-case>Open the case file →</button>`:''}<p class="small">${review.selected.length} of ${stepsIn(room.id,S.answers).length} decisions considered on your current path.</p><p class="small">Follow-ups adapt to your answers. Revising a trigger may ask you to reconsider a dependent response.</p>${review.checks.all.length?`<button data-review-checks="${room.id}">Compare ${review.checks.all.length} selected claim pair(s)</button>`:''}<button class="go big" data-progress="${nextIndex(room.id)}">${review.selected.length?'Continue / reconsider':'Follow the argument'} →</button><h3>Three values to carry forward</h3><p class="small">Keep any number, including none. Inspect each crystal first; priorities can pull in different directions.</p><div class="room-values">${valuesIn(room.id).map(valueTile).join('')}</div><details class="room-reading"><summary>Read the exhibits and argument diagram</summary><ol class="ex-list">${ex.filter(x=>!x.objection||x.piece==='skeptic').map((x,i)=>`<li><button data-go-exhibit="${e(x.id)}"><b>${i+1}</b> ${e(x.topic?x.topic+' · '+x.title:x.title)}</button></li>`).join('')}</ol><ul class="ex-list">${artIn(room.id).map(a=>`<li><button data-go-art="${e(a.id)}">▣ ${e(a.title)}</button></li>`).join('')}</ul></details>${room.id==='charter'?'<button class="go" data-review-journey>Review your values and reasons</button>':''}<div class="card-nav"><button data-teleport="${room.next}">Next: ${e(roomById(room.next).name)} →</button></div>`;}
function exhibitCard(room,x){
 if(x.id==='tally')return summaryCard(room.id);
 if(x.objection){const o=objections.find(o=>o.id===x.objection);return `<p class="kicker">A challenge worth answering</p><h2 tabindex="-1">${e(o.title)}</h2><div class="tabs">${[['obj','Objection'],['rep','The reply'],['evi','What still needs defending']].map(([k,l])=>`<button data-go-exhibit="${k}-${o.id}" aria-pressed="${x.id.startsWith(k+'-')}">${l}</button>`).join('')}</div><p class="lead">${e(x.piece==='skeptic'?o.skeptic:x.piece==='reply'?o.reply:o.burden)}</p>${refs(o.sources)}<button data-room-card>Room overview</button>`;}
 const ex=exhibitsOf(room),i=ex.findIndex(y=>y.id===x.id),nx=ex[(i+1)%ex.length];
 return `${topicLabel(x.topic)}${badge(x.badge)}<h2 tabindex="-1">${e(x.title)}</h2><p class="lead">${e(x.body)}</p>${argumentPoints(x.points)}${x.limits?`<p class="small">Scope: ${e(x.limits)}</p>`:''}${refs(x.sources)}<div class="card-nav"><button data-go-exhibit="${e(nx.id)}">Next exhibit →</button><button class="go" data-progress="${nextIndex(room.id)}">Consider the choices</button><button data-room-card>Room overview</button></div>`;
}
function artCard(a){return `<p class="kicker">The argument at a glance</p><h2 tabindex="-1">${e(a.title)}</h2><figure class="photo art ${artShape(a)}"><img src="./${e(a.file)}" alt="${e(a.alt)}" ${artDims(a)}><figcaption>${e(a.caption)}</figcaption></figure><p class="small">${e(a.credit)}</p><button data-room-card>Room overview</button>`;}
function caseCard(){const room=roomById(S.room);openCard(`<p class="kicker">${e(room.name)}</p><h2 tabindex="-1">The case file</h2>${caseMarkup(room.caseStudy)}<button class="go" data-progress="${nextIndex(room.id)}">Make the first decision →</button><button data-room-card>Room overview</button>`,'case:'+room.id);}
function openProgress(index,{feedback=false}={}){
 const list=stepsIn(S.room,S.answers),requested=typeof index==='string'?list.findIndex(s=>s.id===index):index,i=Math.max(0,Math.min(list.length-1,requested)),s=list[i],selected=currentChoice(S.answers,s.id);
 const prior=answerState(S.answers).stale.find(a=>a.step.id===s.id);
 const firstMissing=list.findIndex(x=>!currentChoice(S.answers,x.id));
 if(firstMissing>=0&&i>firstMissing&&!selected)return openProgress(firstMissing);
 openCard(`<p class="kicker">${e(roomById(S.room).name)} · ${i+1} / ${list.length} on this path${s.branch?' · Follow-up':''}</p>${topicLabel(s.topic)}${s.branch?`<p class="branch-context">Your earlier response opens this follow-up. ${answerState(S.answers).stale.some(a=>a.step.id===s.id)?'Your triggering answers changed; reconsider your retained response below.':''}</p>`:''}<h2 tabindex="-1">${e(s.prompt)}</h2>${s.branch?`<details class="branch-trigger"><summary>Which earlier response opens this question?</summary><p>${e(conditionText(s.branch.when,stepById))}</p></details>`:''}${prior?`<p class="retained-choice"><strong>Your retained answer:</strong> ${e(choiceFor(s.id,prior.answer.choice_id)?.label||'Unknown choice')} Select an answer again to confirm it in the changed context.</p>`:''}${s.context?`<p class="step-context">${e(s.context)}</p>`:''}${evidenceMarkup(s.evidence)}<fieldset class="response-choices"><legend>${S.mode==='stress-test'?'Choose the position you can best defend.':'Where do the reasons take you?'}</legend>${s.choices.map(c=>`<button data-answer="${s.id}" data-choice="${c.id}" data-index="${i}" aria-pressed="${selected?.id===c.id}">${e(c.label)}</button>`).join('')}</fieldset>${selected?`<section class="feedback ${selected.flag?'flagged':''}" aria-labelledby="feedback-title"><h3 id="feedback-title" tabindex="-1">${selected.flag?'This claim needs repair':selected.kind==='contested'?'The disagreement to work through':selected.kind==='commitment'?'The commitment you are making':'The reason to carry forward'}</h3><p>${e(selected.feedback)}</p>${refs(selected.sources)}${S.mode==='stress-test'?'<p class="coach-prompt"><strong>Pressure test:</strong> Give the strongest objection to this reason. Would you still accept it if the roles were reversed?</p>':''}</section>`:''}${consistencyReview(S.answers,S.resolutions).pending.some(c=>c.selections.some(a=>a.step_id===s.id))?'<p class="check-notice">This answer is part of a pair worth comparing. <button data-review-checks="'+S.room+'">Compare selected claims</button></p>':''}<details class="working-reason" ${S.mode==='stress-test'?'open':''}><summary>${S.mode==='stress-test'?'Build your reply':'Keep a note of your reason'}</summary><label for="reason-note">${S.mode==='stress-test'?'What premise do you defend, and what would change your mind?':'Which fact or principle matters most to you here?'}</label><textarea id="reason-note" data-note="${s.id}" rows="4" maxlength="2000" placeholder="Your working reason…">${e(S.notes[s.id]?.text||'')}</textarea><small>Private working note. It is saved in this page only, and is not automatically graded.</small></details><div class="card-nav">${i?`<button data-progress="${list[i-1]?.id}">← Revisit</button>`:''}${i<list.length-1?`<button class="go" data-progress="${list[i+1]?.id}" ${!selected?'disabled':''}>Next decision →</button>`:`<button class="go" data-teleport="${roomById(S.room).next}" ${!selected?'disabled':''}>Leave room →</button>`}<button data-room-card>Room overview</button></div>`,'progress:'+i);
 if(feedback)$('#feedback-title')?.focus({preventScroll:true});
}
function valueCard(id){const v=valueById(id);if(!v)return;const has=!!S.picks[id];openCard(`<p class="kicker">A value to consider · ${e(v.kind)}</p><h2 tabindex="-1">${e(v.label)}</h2><p class="lead">${e(v.short)}</p><p>${e(v.long)}</p>${refs(v.sources)}<p class="note">Keeping a value records a priority. It does not settle a fact, prove a philosophy, or determine how much weight the value deserves in every case.</p><button class="go" data-pick-value="${v.id}" aria-pressed="${has}">${has?'Release this value':'Keep this value'} ${has?'':'◇'}</button><p class="small">Or click the same crystal again within 30 seconds.</p><div class="card-nav"><button data-open-collection>See your values</button><button data-room-card>Room overview</button></div>`,'value:'+id);}
function toggleValue(id){S.picks=togglePriority(S.picks,id,Date.now());pendingValue=null;updateMeter();updateCollection();if(openId==='value:'+id&&!$('#collection').open)valueCard(id);$$(`[data-pick-value="${id}"]`).forEach(b=>b.setAttribute('aria-pressed',String(!!S.picks[id])));announce(`${S.picks[id]?'Kept':'Released'}: ${valueById(id).label}.`);}
function valueTap(t){const action=crystalAction(pendingValue,t.id,Date.now());pendingValue=action.pending;if(action.toggle)toggleValue(t.id);else valueCard(t.id);}
function collectionMarkup(){return `<p class="collection-intro">${prioritiesIn(S.picks).length} of ${values.length} values kept. These are priorities to reason with, not points for a worldview. Open any card to examine its case.</p>${rooms.map(r=>`<section class="collection-room"><h3>${e(r.name)}</h3><div class="collection-grid">${valuesIn(r.id).map(v=>`<article class="collection-value value-${e(v.kind)} ${S.picks[v.id]?'kept':''}"><span class="gem" aria-hidden="true"></span><h4>${e(v.label)}</h4><p>${e(v.short)}</p><details><summary>Examine this value</summary><p>${e(v.long)}</p>${refs(v.sources)}</details><button data-pick-value="${v.id}" aria-pressed="${!!S.picks[v.id]}">${S.picks[v.id]?'Kept ✓ · Release':'Keep this value'}</button></article>`).join('')}</div></section>`).join('')}`;}
function updateCollection(){if(!$('#collection').open)return;const y=$('#collection').scrollTop,focusId=document.activeElement?.dataset?.pickValue,open=[...$('#collection-body').querySelectorAll('details')].map((d,i)=>d.open?i:-1).filter(i=>i>=0);$('#collection-body').innerHTML=collectionMarkup();const details=[...$('#collection-body').querySelectorAll('details')];for(const i of open)if(details[i])details[i].open=true;$('#collection').scrollTop=y;if(focusId)$('#collection-body').querySelector(`[data-pick-value="${focusId}"]`)?.focus({preventScroll:true});}
function openCollection(){keys.clear();vel=[0,0];pendingValue=null;$('#collection-body').innerHTML=collectionMarkup();$('#collection').showModal();$('#collection-close').focus();}
function revisionButton(step,label='Reconsider this response'){return `<button data-revise-room="${e(step.room)}" data-revise-step="${e(step.id)}">${e(label)}</button>`;}
function checksCard(roomId){
 const review=consistencyReview(S.answers,S.resolutions,roomId),title=roomId?'Compare this room’s claims':'Compare your selected claims';
 return `<p class="kicker">Consistency and tradeoffs</p><h2 tabindex="-1">${title}</h2><p>These checks compare particular claims, not your worldview. Changing your mind is legitimate. A distinction may matter; explain it or revise an answer. Recording an explanation does not prove that a conflict is resolved.</p>${!review.all.length?'<p class="empty-checks">No authored check matches your current answers. This is a bounded check, not a certificate that every belief is consistent.</p>':''}${review.all.map(c=>{const draft=S.checkDrafts[c.id]?.signature===c.signature?S.checkDrafts[c.id]:c.resolution||{};return `<article class="consistency-check ${c.acknowledged?'acknowledged':''}" data-check-id="${e(c.id)}"><p class="kicker">${c.kind==='tension'?'Tradeoff to examine':'Possible inconsistency'}${c.acknowledged?' · Explanation recorded':''}</p><h3>${e(c.title)}</h3><p>${e(c.explanation)}</p><p class="check-scope"><strong>Scope:</strong> ${e(c.scope)}</p>${c.selections.map(a=>{const st=stepById(a.step_id);return `<div class="paired-answer"><p class="small">${e(roomById(st.room).name)} · ${e(st.prompt)}</p><blockquote>${e(a.label)}</blockquote>${revisionButton(st)}</div>`;}).join('')}${refs(c.sources)}${c.acknowledged?`<p class="ack-note"><strong>${e({'changed-mind':'You reported a change of mind',distinction:'You offered a distinction',retain:'You retained the tension'}[c.resolution.kind])}:</strong> ${e(c.resolution.text)}</p>`:''}<details class="clarification" ${c.acknowledged?'':'open'}><summary>${c.acknowledged?'Revise your explanation':'Explain how these answers fit'}</summary><label>How do you understand this pair?<select data-check-kind="${e(c.id)}"><option value="">Choose an explanation</option>${[['changed-mind','My position changed'],['distinction','A distinction changes the comparison'],['retain','I retain the tension for now']].map(([k,l])=>`<option value="${k}" ${draft.kind===k?'selected':''}>${l}</option>`).join('')}</select></label><label>Your reason<textarea data-check-text="${e(c.id)}" maxlength="2000" rows="3">${e(draft.text||'')}</textarea></label><button class="go" data-ack-check="${e(c.id)}">Record explanation</button><p class="check-error" role="alert"></p></details></article>`;}).join('')}<div class="card-nav"><button data-review-journey>Your full record</button><button data-room-card>Room overview</button></div>`;
}
const conditionSteps=node=>node?.all?node.all.flatMap(conditionSteps):node?.any?node.any.flatMap(conditionSteps):node?.step?[node.step]:[];
function pastExplanations(roomId){const current=consistencyReview(S.answers,S.resolutions).acknowledged,prior=Object.entries(S.resolutions).filter(([id,r])=>!current.some(c=>c.id===id&&c.signature===r.signature)).filter(([id])=>!roomId||conditionSteps(consistencyRules.find(c=>c.id===id)?.when).some(stepId=>stepById(stepId)?.room===roomId));return prior.length?`<details class="retained-responses"><summary>${prior.length} explanation(s) retained from earlier answers</summary>${prior.map(([id,r])=>`<article><h3>${e(consistencyRules.find(c=>c.id===id)?.title||id)}</h3><p>${e(r.text)}</p><p class="small">The selected-answer pair changed. This earlier explanation does not acknowledge the current pair.</p></article>`).join('')}</details>`:'';}
function summaryCard(roomId){
 const r=roomId?roomReview(roomId,S.answers,S.resolutions):null,j=journeyReview(S.answers,S.resolutions),selected=r?r.selected:rooms.flatMap(room=>roomReview(room.id,S.answers,S.resolutions).selected),picked=prioritiesIn(S.picks).filter(v=>!roomId||v.room===roomId),state=answerState(S.answers),retained=[...state.stale.map(a=>({...a,status:'Needs reconsideration'})),...state.inactive.map(a=>({...a,status:'Outside the current path'}))].filter(a=>!roomId||a.step.room===roomId),checks=consistencyReview(S.answers,S.resolutions,roomId);
 return `<p class="kicker">Your values and reasons</p><h2 tabindex="-1">${roomId?'This room':'The case you are building'}</h2><p>${selected.length} of ${r?r.total:j.total} decisions considered on your current path. ${picked.length} values kept.</p><p class="small">The path grows or changes with your answers. Retained responses from a different context do not count toward current progress.</p><button data-review-checks="${roomId||'all'}">Compare selected claims · ${checks.pending.length} awaiting explanation</button><div class="room-values">${picked.map(valueTile).join('')}</div><button data-open-collection>Examine the full value board</button>${selected.map(a=>`<article class="response-summary ${a.choice.flag?'flagged':''}"><h3>${e(a.step.prompt)}</h3><p><strong>${e(a.choice.label)}</strong></p><p>${e(a.choice.feedback)}</p>${S.notes[a.step.id]?`<blockquote class="personal-reason">${e(S.notes[a.step.id].text)}</blockquote>`:''}${refs(a.choice.sources)}${revisionButton(a.step)}</article>`).join('')}${retained.length?`<details class="retained-responses"><summary>${retained.length} retained response(s) outside current progress</summary>${retained.map(a=>`<article><h3>${e(a.step.prompt)}</h3><p><strong>${e(a.status)}:</strong> ${e(choiceFor(a.step.id,a.answer.choice_id)?.label||'Invalid retained response')}</p><p>${e(a.reason)}</p>${S.notes[a.step.id]?`<blockquote>${e(S.notes[a.step.id].text)}</blockquote>`:''}${revisionButton(a.step,'Review this path')}</article>`).join('')}</details>`:''}${pastExplanations(roomId)}<button class="go" data-download>Download my values and reasons (JSON)</button><p class="small">Includes current and retained responses, values, working reasons, consistency explanations and epoch-millisecond timestamps. Everything stays in this page unless you download it.</p>`;
}
function revisitStep(id){let step=stepById(id),list=stepsIn(S.room,S.answers);while(step&&!list.some(s=>s.id===step.id)&&step.branch)step=stepById(step.branch.after);if(step)openProgress(step.id);}
function commitRoom(id,{historyMode='push'}={}){if(id===S.room)return;pendingValue=null;stage.scrollIntoView({block:'start',behavior:'instant'});if(historyMode==='replace')history.replaceState(null,'','#'+id);else history.pushState(null,'','#'+id);teleport(id);}
function go(id,{historyMode='push'}={}){
 if(!roomById(id)||busy||id===S.room)return;
 if($('#collection').open)$('#collection').close();
 const review=exitReview(S.room,S.answers,S.resolutions);
 if(!review.needsPrompt){commitRoom(id,{historyMode});return;}
 pendingRoom=id;pendingHistoryMode=historyMode;keys.clear();vel=[0,0];pendingValue=null;
 $('#exit-body').innerHTML=`<p>${e(review.message)}</p>${review.flagged.length?`<ul>${review.flagged.map(a=>`<li><strong>${e(a.choice.label)}</strong><p>${e(a.choice.feedback)}</p>${refs(a.choice.sources)}</li>`).join('')}</ul>`:''}${review.checks.pending.length?`<p>${review.checks.pending.length} selected claim pair(s) need comparison: ${review.checks.pending.map(c=>e(c.title)).join('; ')}. Use Reconsider to examine them.</p>`:''}${review.unanswered.length?`<p>${review.unanswered.length} decision(s) not yet considered. You may continue and return later.</p>`:''}`;
 $('#exit-review').showModal();$('#exit-back').focus();
}
function download(){const data={...personalRecord(S.answers,S.overrides,S.picks,S.notes,S.mode,Date.now(),S.resolutions),build_version:__version__};const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=`morarg-values-and-reasons-${data.ts_ms}.json`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);announce('Private values and reasons download prepared.');}

function getRoom(id){if(!cache.has(id)){const room=roomById(id),b=buildRoom(engine,room,exhibitsOf(room),valuesIn(id),order,themeOf,artIn(id));cache.set(id,b);loadPictures(b);}return cache.get(id);}
const pictures=new Map();
function loadPictures(b){for(const p of b.pics){const a=wallArt.find(x=>x.id===p.art);
 if(!pictures.has(a.file))pictures.set(a.file,new Promise((res,rej)=>{const img=new Image();img.onload=()=>res(img);img.onerror=rej;img.src='./'+a.file;}).then(img=>engine.texture(img)));
 pictures.get(a.file).then(t=>{p.texture=t;}).catch(()=>{});}}
function makeTags(){labelsEl.innerHTML='';tagEls.clear();if(!built)return;
 // The scene labels are decorative pointer controls; accessible reading links live in the HUD and Station card.
 for(const t of built.targets){const el=document.createElement('div');el.className='tag tag-'+t.kind;el.style.opacity='0';
  if(t.kind==='value'){const v=valueById(t.id);el.innerHTML=`<span class="gem" aria-hidden="true"></span><span>${e(v.label)}</span>`;el.classList.add('value-'+v.kind);}
  if(t.kind==='values-area')el.innerHTML='<strong>Values to carry forward</strong><small>Read a crystal · choose whether to keep it</small>';
  if(t.kind==='reading')el.innerHTML='<strong>Read the full argument ↓</strong><small>Every room · no 3D needed</small>';
  if(t.kind==='exhibit'){const x=t.id==='tally'?{title:'Room response review'}:exhibitsOf(built.room).find(y=>y.id===t.id);const num=built.room.id==='hall'?(x?.piece==='skeptic'?`${(t.alcove??0)+1}`:''):String(exhibitsOf(built.room).findIndex(y=>y.id===t.id)+1);el.innerHTML=`${num?`<b>${e(num)}</b>`:''}<span>${e(x?.piece==='skeptic'?x.title:x?.title)}</span>`;}
  if(t.kind==='art'){const a=wallArt.find(y=>y.id===t.id);el.innerHTML=`<span class="pic" aria-hidden="true">▣</span><span>${e(a.title)}</span>`;}
  if(t.kind==='portal'){const r=roomById(t.id);el.innerHTML=`<small>${t.role==='next'?'Next':t.id==='hub'?'Back to':'Go to'}</small><span>${e(r.name)}</span>`;}
  if(t.kind!=='values-area')el.addEventListener('click',()=>activate(t));labelsEl.append(el);tagEls.set(t,el);}
}
function updateTags(){if(!built||!engine)return;
 for(const [t,el] of tagEls){const p=engine.project(t.pos),far=t.kind==='art'?10:t.kind==='value'?12:40;
  if(!p.visible||p.dist>far){el.style.opacity='0';el.style.pointerEvents='none';continue;}
  const sc=Math.max(.72,Math.min(1.1,5.5/p.dist+.45)),labelY=p.y-(t.kind==='value'&&valuesIn(S.room).findIndex(v=>v.id===t.id)===1?46:0);el.style.opacity=String(Math.min(1,(far-p.dist)/3));el.style.pointerEvents='auto';
  el.style.transform=`translate(${p.x.toFixed(1)}px,${labelY.toFixed(1)}px) translate(-50%,-100%) scale(${sc.toFixed(3)})`;
  if(t.kind==='value')el.classList.toggle('claimed',!!S.picks[t.id]);
  el.classList.toggle('seen',t.kind==='exhibit'&&S.seen.has(t.id));el.classList.toggle('hover',S.hover===t.id);}
}
const baseFov=()=>(innerWidth<innerHeight?84:70)*Math.PI/180;
function placeCamera(sp){const c=engine.cam;c.x=sp.x;c.z=sp.z;c.yaw=sp.yaw;c.pitch=-.06;c.fov=baseFov();}
function setRoom(id){
 const room=roomById(id);S.room=id;S.visited.add(id);
 if(engine){built=getRoom(id);engine.setItems(built.items);engine.setEnv(built.env);placeCamera(built.spawn);makeTags();}
 $('#room-num').textContent=room.number;$('#room-name').textContent=room.name;
 const next=roomById(room.next);$('#next-btn').textContent=`Next: ${next.name} →`;$('#next-btn').dataset.teleport=next.id;$('#station-btn').hidden=id==='hub';
 document.title=`${room.name} · MORARG · Morality, Between Us`;$$('#rooms-list [data-teleport]').forEach(b=>b.setAttribute('aria-current',String(b.dataset.teleport===id)));
 stage.style.setProperty('--accent',palettes[room.theme].accent);
}
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
async function teleport(id,{intro=true}={}){
 if(busy||!roomById(id))return;busy=true;glide=walkTo=null;
 const sw=$('#swoosh');sw.style.setProperty('--to',palettes[themeOf(id)].accent);
 if(S.motion&&engine&&!document.hidden){sw.className='swoosh go';const t0=performance.now();const c=engine.cam,fx=Math.sin(c.yaw),fz=Math.cos(c.yaw);
  await new Promise(res=>{const f0=baseFov();const step=now=>{const k=Math.min(1,(now-t0)/420);c.fov=f0+.84*k*k;c.x-=fx*.12*k;c.z-=fz*.12*k;k<1?requestAnimationFrame(step):res();};requestAnimationFrame(step);});
  setRoom(id);const t1=performance.now();
  await new Promise(res=>{const f1=baseFov();const step=now=>{const k=Math.min(1,(now-t1)/520),q=1-(1-k)**3;engine.cam.fov=f1+.84*(1-q);k<1?requestAnimationFrame(step):res();};requestAnimationFrame(step);});
  sw.className='swoosh';}
 else{sw.className='swoosh fade';await sleep(160);setRoom(id);if(engine)engine.cam.fov=baseFov();await sleep(60);sw.className='swoosh';}
 busy=false;const room=roomById(id);announce(`${room.name}. ${room.title}`);
 if(reviseAfterTravel?.id===id){const stepId=reviseAfterTravel.stepId;reviseAfterTravel=null;revisitStep(stepId);}else if(intro)openCard(roomCard(room),'room:'+id);
}

function targetOf(kind,id){return built?.targets.find(t=>t.kind===kind&&t.id===id);}
function activate(t){if(busy)return;if(t.kind==='reading'){$('#guide').scrollIntoView({block:'start'});$('#guide').focus({preventScroll:true});location.hash='guide';}else if(t.kind==='portal')go(t.id);else if(t.kind==='value')valueTap(t);else if(t.kind==='art')openArt(t.id);else if(t.kind==='exhibit')openExhibit(t.id);}
function openExhibit(id){
 const room=roomById(S.room),x=id==='tally'?{id:'tally'}:exhibitsOf(room).find(y=>y.id===id);if(!x)return;
 
 S.seen.add(id);const t=targetOf('exhibit',id);
 if(t&&engine){const wide=innerWidth>760;startGlide(t.view.x,t.view.z,t.view.yaw-(wide?.3:0),wide?-.1:-.34);}
 openCard(exhibitCard(room,x),'ex:'+id);announce(x.title||'Room response review');
}
function openArt(id){const a=wallArt.find(x=>x.id===id);if(!a)return;const t=targetOf('art',id);
 if(t&&engine){const wide=innerWidth>760;startGlide(t.view.x,t.view.z,t.view.yaw-(wide?.32:0),t.view.pitch-(wide?0:.2));}
 openCard(artCard(a),'art:'+id);announce(a.title);}
const ease=k=>k<.5?2*k*k:1-(-2*k+2)**2/2;
function startGlide(x,z,yaw,pitch){const c=engine.cam;let dy=yaw-c.yaw;dy=Math.atan2(Math.sin(dy),Math.cos(dy));glide={from:{x:c.x,z:c.z,yaw:c.yaw,pitch:c.pitch},to:{x,z,yaw:c.yaw+dy,pitch},t:0,dur:S.motion?Math.min(1.4,.5+Math.hypot(x-c.x,z-c.z)*.09):0};walkTo=null;}
function collide(c){const b=built.bounds,d=Math.hypot(c.x,c.z);if(d>b){c.x*=b/d;c.z*=b/d;}for(const o of built.obstacles){const dx=c.x-o.x,dz=c.z-o.z,dd=Math.hypot(dx,dz),min=o.r+.35;if(dd<min&&dd>1e-3){c.x=o.x+dx/dd*min;c.z=o.z+dz/dd*min;}}}
function frame(dt,time){
 if(!built)return;const c=engine.cam;
 if(!S.entered&&S.motion){c.yaw+=dt*.05;}
 if(glide){glide.t+=dt;const k=glide.dur?Math.min(1,glide.t/glide.dur):1,q=ease(k);for(const key of ['x','z','yaw','pitch'])c[key]=glide.from[key]+(glide.to[key]-glide.from[key])*q;if(k>=1)glide=null;}
 else{
  const f=(keys.has('w')||keys.has('arrowup')?1:0)-(keys.has('s')||keys.has('arrowdown')?1:0),st=(keys.has('d')?1:0)-(keys.has('a')?1:0),turn=(keys.has('arrowleft')||keys.has('q')?1:0)-(keys.has('arrowright')||keys.has('e')?1:0);
  c.yaw+=turn*dt*1.8;const sp=3.4;const tx=(-Math.sin(c.yaw)*f+Math.cos(c.yaw)*st)*sp,tz=(-Math.cos(c.yaw)*f-Math.sin(c.yaw)*st)*sp;
  vel[0]+=(tx-vel[0])*Math.min(1,dt*10);vel[1]+=(tz-vel[1])*Math.min(1,dt*10);
  if(walkTo){const dx=walkTo.x-c.x,dz=walkTo.z-c.z,dd=Math.hypot(dx,dz);if(dd<.08||f||st)walkTo=null;else{const s=Math.min(dd,dt*(S.motion?3.6:99));c.x+=dx/dd*s;c.z+=dz/dd*s;}}
  c.x+=vel[0]*dt;c.z+=vel[1]*dt;
 }
 c.y=1.65+(S.motion&&Math.hypot(vel[0],vel[1])>.5?Math.sin(time*9)*.025:0);
 collide(c);animateRoom(built,dt,time,D,S.motion);updateTags();
}

// ---------- Picking ----------
function pick(cx,cy){if(!built)return null;const ray=engine.ray(cx,cy);let best=null,bt=Infinity;
 const reach=built.room.id==='hall'?14:40;
 for(const t of built.targets){if(t.kind==='values-area')continue;const d=hitSphere(ray,t.hit||t.pos,t.r);if(d<bt&&(t.kind==='portal'||d<reach)){bt=d;best=t;}}
 if(best)return {t:best};
 const f=hitFloor(ray);return f&&Math.hypot(f.x,f.z)<built.bounds+.5?{floor:f}:null;}
let drag=null;
canvas.addEventListener('pointerdown',ev=>{if(ev.button!==0&&ev.pointerType==='mouse')return;canvas.setPointerCapture(ev.pointerId);drag={x:ev.clientX,y:ev.clientY,sx:ev.clientX,sy:ev.clientY,moved:false};glide=null;});
canvas.addEventListener('pointermove',ev=>{
 if(drag){const dx=ev.clientX-drag.x,dy=ev.clientY-drag.y;drag.x=ev.clientX;drag.y=ev.clientY;if(Math.hypot(ev.clientX-drag.sx,ev.clientY-drag.sy)>6)drag.moved=true;if(drag.moved&&engine){stage.classList.add('moved');const k=ev.pointerType==='touch'?.006:.0045;engine.cam.yaw+=dx*k;engine.cam.pitch=Math.max(-.85,Math.min(.85,engine.cam.pitch+dy*k));walkTo=null;}return;}
 if(!engine||ev.pointerType!=='mouse')return;const p=pick(ev.clientX,ev.clientY);const id=p?.t?.id??null;if(S.hover!==id){S.hover=id;D.hover=id;canvas.style.cursor=p?.t?'pointer':'grab';}});
canvas.addEventListener('pointerup',ev=>{const d=drag;drag=null;if(!d||d.moved||!engine||busy)return;stage.classList.add('moved');const p=pick(ev.clientX,ev.clientY);if(!p)return;if(p.t)activate(p.t);else if(p.floor){const b=built.bounds,r=Math.hypot(p.floor.x,p.floor.z),k=r>b?b/r:1;walkTo={x:p.floor.x*k,z:p.floor.z*k};}});
canvas.addEventListener('pointercancel',()=>{drag=null;});
const typing=el=>el&&el.closest?.('input,textarea,select,[contenteditable="true"]');
window.addEventListener('keydown',ev=>{
 if(ev.key==='Escape'&&!typing(ev.target)&&!$('#exit-review').open&&!$('#rooms').open&&!$('#collection').open&&!card.hidden){closeCard();return;}
 if($('#exit-review').open||$('#rooms').open||$('#collection').open)return;
 if(typing(ev.target)||ev.metaKey||ev.ctrlKey||ev.altKey)return;
 const k=ev.key.toLowerCase(),moveKey=['w','a','s','d','q','e','arrowup','arrowdown','arrowleft','arrowright'].includes(k);
 if(!moveKey||!S.entered)return;
 if(k.startsWith('arrow')&&document.activeElement!==canvas&&document.activeElement!==document.body)return;
 const rect=stage.getBoundingClientRect();if(rect.bottom<80)return;
 keys.add(k);glide=null;ev.preventDefault();stage.classList.add('moved');
});
window.addEventListener('keyup',ev=>keys.delete(ev.key.toLowerCase()));
window.addEventListener('blur',()=>keys.clear());


// Accessible controls parallel every pointer interaction in the scene.
document.addEventListener('input',ev=>{const id=ev.target.dataset.checkKind||ev.target.dataset.checkText;if(!id)return;const check=consistencyReview(S.answers,S.resolutions).all.find(c=>c.id===id),el=ev.target.closest('[data-check-id]');if(check&&el)S.checkDrafts[id]={signature:check.signature,kind:el.querySelector('[data-check-kind]').value,text:el.querySelector('[data-check-text]').value,ts_ms:Date.now()};});
document.addEventListener('click',ev=>{
 const b=ev.target.closest('button,a[data-teleport]');if(!b)return;
 if(b.dataset.teleport){ev.preventDefault();$('#rooms').close();go(b.dataset.teleport);return;}
 if(b.dataset.inspectValue){pendingValue={id:b.dataset.inspectValue,ts_ms:Date.now()};valueCard(b.dataset.inspectValue);return;}
 if(b.dataset.pickValue){toggleValue(b.dataset.pickValue);return;}
 if(b.hasAttribute('data-open-collection')){openCollection();return;}
 if(b.id==='collection-close'){$('#collection').close();return;}
 if(b.hasAttribute('data-case')){caseCard();return;}
 if(b.dataset.goExhibit){openExhibit(b.dataset.goExhibit);return;}
 if(b.dataset.goArt){openArt(b.dataset.goArt);return;}
 if(b.hasAttribute('data-room-card')){openCard(roomCard(roomById(S.room)),'room:'+S.room);return;}
 if(b.hasAttribute('data-progress')){openProgress(/^\d+$/.test(b.dataset.progress)?Number(b.dataset.progress):b.dataset.progress);return;}
 if(b.dataset.answer){S.answers=recordAnswer(S.answers,b.dataset.answer,b.dataset.choice,Math.max(Date.now(),(S.answers[b.dataset.answer]?.ts_ms??-1)+1));updateMeter();openProgress(b.dataset.answer,{feedback:true});return;}
 if(b.dataset.reviewChecks){openCard(checksCard(b.dataset.reviewChecks==='all'?undefined:b.dataset.reviewChecks),'checks:'+b.dataset.reviewChecks);return;}
 if(b.dataset.ackCheck){const id=b.dataset.ackCheck,el=b.closest('[data-check-id]'),kind=el.querySelector('[data-check-kind]').value,text=el.querySelector('[data-check-text]').value;let next;try{next=acknowledgeCheck(S.answers,S.resolutions,id,kind,text,Date.now());}catch{el.querySelector('.check-error').textContent='Choose an explanation and add your reason before recording it.';return;}S.resolutions=next;const y=card.scrollTop;openCard(checksCard(openId?.slice(7)==='all'?undefined:openId?.slice(7)),openId);card.scrollTop=y;cardBody.querySelector(`[data-check-id="${id}"] .ack-note`)?.setAttribute('tabindex','-1');cardBody.querySelector(`[data-check-id="${id}"] .ack-note`)?.focus({preventScroll:true});announce('Explanation recorded; the selected claims remain available for review.');return;}
 if(b.hasAttribute('data-review-journey')){openCard(summaryCard(),'summary');return;}
 if(b.dataset.reviseRoom){const id=b.dataset.reviseRoom,stepId=b.dataset.reviseStep;if(id===S.room)revisitStep(stepId);else{reviseAfterTravel={id,stepId};go(id);}return;}
 if(b.hasAttribute('data-download')){download();return;}
 if(b.id==='exit-back'){$('#exit-review').close();pendingRoom=null;reviseAfterTravel=null;const r=roomReview(S.room,S.answers,S.resolutions),s=r.flagged[0]?.step||r.unanswered[0]||stepsIn(S.room,S.answers)[0];if(!r.flagged.length&&r.checks.pending.length)openCard(checksCard(S.room),'checks:'+S.room);else openProgress(s.id);return;}
 if(b.id==='exit-continue'){const to=pendingRoom,r=roomReview(S.room,S.answers,S.resolutions);S.overrides.push({ts_ms:Date.now(),from_room:S.room,to_room:to,flagged:r.flagged.map(a=>({step_id:a.step.id,choice_id:a.choice.id})),unanswered:r.unanswered.map(s=>s.id),checks:r.checks.pending.map(c=>({rule_id:c.id,signature:c.signature,kind:c.kind}))});$('#exit-review').close();pendingRoom=null;if(to)commitRoom(to,{historyMode:pendingHistoryMode});return;}
 if(b.id==='card-close'){closeCard();return;}
 if(b.id==='rooms-btn'){keys.clear();$('#rooms').showModal();return;}
 if(b.id==='rooms-close'){$('#rooms').close();return;}
 if(b.id==='here-btn'){openCard(roomCard(roomById(S.room)),'room:'+S.room);return;}
 if(b.id==='responses-btn'){openCard(summaryCard(),'summary');return;}
 if(b.id==='motion-btn'){S.motion=!S.motion;b.setAttribute('aria-pressed',String(!S.motion));b.textContent=S.motion?'Pause motion':'Resume motion';return;}
 if(b.id==='enter-btn'||b.id==='challenge-btn'){S.mode=b.id==='challenge-btn'?'stress-test':'explore';enter();return;}
 if(b.id==='values-btn'){openCollection();return;}
});
document.addEventListener('input',ev=>{const el=ev.target;if(el.dataset.note)S.notes=recordNote(S.notes,el.dataset.note,el.value,Date.now());});
$('#collection').addEventListener('close',()=>{if(openId?.startsWith('value:'))valueCard(openId.slice(6));else if(openId?.startsWith('room:'))openCard(roomCard(roomById(S.room)),'room:'+S.room);else if(openId==='summary')openCard(summaryCard(),'summary');});
let reviseAfterTravel=null;
$('#exit-review').addEventListener('cancel',()=>{pendingRoom=null;reviseAfterTravel=null;});
function enter(){S.entered=true;if(!roomById(location.hash.slice(1)))history.replaceState(null,'','#'+S.room);$('#intro').hidden=true;stage.classList.add('entered');if(engine&&built)placeCamera(built.spawn);openCard(roomCard(roomById(S.room)),'room:'+S.room);stage.scrollIntoView({block:'start',behavior:'instant'});}
function routeChange(){const id=location.hash.slice(1);if(!roomById(id)||id===S.room)return;if(!started)start3d();if(!S.entered){S.entered=true;$('#intro').hidden=true;stage.classList.add('entered');}history.replaceState(null,'','#'+S.room);go(id,{historyMode:'replace'});stage.scrollIntoView({block:'start'});}
window.addEventListener('hashchange',routeChange);
motionQuery.addEventListener('change',ev=>{S.motion=!ev.matches;$('#motion-btn').textContent=S.motion?'Pause motion':'Resume motion';$('#motion-btn').setAttribute('aria-pressed',String(!S.motion));});
function boot(){
 $('#rooms-list').innerHTML=rooms.map(r=>`<li><button data-teleport="${r.id}"><b>${r.number}</b><span>${e(r.name)}</span><small>${e(r.title)}</small></button></li>`).join('');
 $('#motion-btn').textContent=S.motion?'Pause motion':'Resume motion';$('#motion-btn').setAttribute('aria-pressed',String(!S.motion));
 try{if(controlsOnly)throw Error('Controls mode');engine=createEngine(canvas);}catch{engine=null;stage.classList.add('no-3d');$('#no3d').hidden=false;}
 const first=roomById(location.hash.slice(1))?location.hash.slice(1):'hub';setRoom(first);
 if(engine){engine.start(frame);new ResizeObserver(()=>{engine.resize();if(!busy)engine.cam.fov=baseFov();}).observe(canvas);document.addEventListener('visibilitychange',()=>document.hidden?engine.stop():engine.start(frame));}
 updateMeter();stage.classList.add('ready');
 if(roomById(location.hash.slice(1)))enter();
}
// A narrow screen begins with the complete reading version. 3D is opt-in.
const narrow=matchMedia('(max-width: 760px), (pointer: coarse) and (max-height: 520px)'),to3d=$('#g-3d');
let started=false;
function start3d(){if(started)return;started=true;document.body.classList.add('stage-on');to3d.hidden=true;boot();}
if(narrow.matches&&!roomById(location.hash.slice(1)))to3d.hidden=false;else start3d();
$('#to-3d').addEventListener('click',()=>{start3d();enter();});
narrow.addEventListener('change',ev=>{if(!ev.matches)start3d();});

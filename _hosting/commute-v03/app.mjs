// After the Commute · rooms edition. Explorable 3D rooms; all state stays in page memory.
import {rooms,order,roomById,roomExhibits,values,valuesIn,meterState,annualTime,groupDistance,carbonBands,bandFor,payScenario,villageChoices,investmentPlans,safeguards,phases,objections,stances,stanceTally,charterItems,coreAsk,badges,voicesNote,edition,credit,wallArt,artIn,artShape,artDims,categories,valuesOf,scored,relationLabels,costLabels,scoreboard,crystalClick,valuePrompt,VALUE_PROMPT_MS} from './data.mjs';
import {sources,cases} from './sources.mjs';
import {createEngine,hitSphere,hitFloor} from './engine.mjs';
import {buildRoom,animateRoom,palettes,relationColor} from './rooms.mjs';

const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const e=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmt=n=>Math.round(n).toLocaleString('en');
const stage=$('#stage'),canvas=$('#scene'),labelsEl=$('#labels'),card=$('#card'),cardBody=$('#card-body'),toastEl=$('#toast');
const motionQuery=matchMedia('(prefers-reduced-motion: reduce)');
const S={room:'hub',values:new Set(),seen:new Set(),visited:new Set(),stances:{},remoteDays:3,commute:{days:3,minutes:30,weeks:46},group:{workers:100,km:20,extraKm:0},
 payIn:{discount:30,equal:false},villageMode:'commuter',villageChoice:null,priority:null,safeguards:{housing:true,green:true,hub:true},phase:0,charter:new Set(),hover:null,motion:!motionQuery.matches,entered:false,board:false};
const derived=()=>({...S,pay:{...payScenario(S.payIn),equal:S.payIn.equal},meter:meterState([...S.values]),tally:stanceTally(S.stances)});
let D=derived();const refresh=()=>{D=derived();updateMeter();};
const themeOf=id=>roomById(id)?.theme;
const exhibitsOf=room=>roomExhibits(room,cases);
let engine=null,built=null,openId=null,busy=false;
const cache=new Map(),keys=new Set(),tagEls=new Map();
let glide=null,walkTo=null,vel=[0,0];

function announce(t){$('#announce').textContent=t;}
function toast(html,kind=''){toastEl.className='toast show '+kind;toastEl.innerHTML=html;clearTimeout(toast.t);toast.t=setTimeout(()=>toastEl.className='toast',3200);}
const badge=k=>`<span class="badge badge-${e(k.toLowerCase())}" title="${e(badges[k]||'')}">${e(k)}</span>`;
function refs(ids=[]){const list=ids.map(id=>sources.find(s=>s.id===id)).filter(Boolean);return list.length?`<ul class="refs">${list.map(s=>`<li><a href="${e(s.url)}" target="_blank" rel="noopener noreferrer">${e(s.title)} ↗</a></li>`).join('')}</ul>`:'';}
const limits=t=>t?`<details class="limits"><summary>Limits and scope</summary><p>${e(t)}</p></details>`:'';

// ---------- Meter ----------
function updateMeter(){
 const m=D.meter;$('#meter-fill').style.height=`${Math.round(m.fill*100)}%`;$('#meter-design').style.height=`${m.score?Math.round(m.design/m.score*100):0}%`;
 $('#meter-score').textContent=m.score;$('#meter-max').textContent=m.max;$('#meter-level').textContent=m.level;
 $('#meter-sub').textContent=m.total?[m.design?`${m.design} ${m.design===1?'needs':'need'} good design`:'',m.office?`${m.office} for the office`:'',m.condition?`${m.condition} ${m.condition===1?'condition':'conditions'}`:''].filter(Boolean).join(' · ')||'All provided directly':'Pick up what you value';
 $('#meter').classList.toggle('has-office',m.office>0);
 $('#meter').setAttribute('aria-label',`Remote provides this: ${m.score} of ${m.max} values. ${m.level}. ${m.design} need good design, ${m.office} for the office, ${m.condition} conditions.`);
}
function toggleValue(id,src='crystal'){
 const v=values.find(x=>x.id===id);if(!v)return;
 const had=S.values.has(id);had?S.values.delete(id):S.values.add(id);refresh();
 if(!had){$('#meter').classList.remove('pulse');void $('#meter').offsetWidth;$('#meter').classList.add('pulse');}
 const head={provides:'+1 · Remote can help provide this',design:'+1 · With good design, remote can help',condition:'Noted · A condition remote work must meet',office:'+1 for the office · A commercial priority'}[v.relation];
 if(!S.board){if(!had)toast(`<strong>${e(head)}</strong><span>${e(v.label)}</span><small>${e(v.short)}${v.relation==='office'?` Costs ${e(v.cost.map(c=>costLabels[c]).join(' and ').toLowerCase())}.`:''}</small>`,v.relation);else toast(`<strong>Removed</strong><span>${e(v.label)}</span>`);}
 updateBoard();const lead=S.board&&boardCat&&cardBody.querySelector('[data-cat-lead]');if(lead)lead.textContent=catLead(boardCat);
 announce(`${had?'Removed':'Picked up'}: ${v.label}. Meter ${D.meter.score} of ${D.meter.max}.`);
 $$(`[data-value="${id}"]`).forEach(b=>{b.setAttribute('aria-pressed',String(!had));});
 void src;
}

// ---------- Value crystals: read first, then decide ----------
// The first click on a crystal opens its explanation in a box above it; clicking the same crystal again adds the value
// (or removes it). Clicking anything else, Escape, travelling or the timeout closes the box and changes nothing.
const pop=$('#value-pop'),popKind={provides:'Remote can help provide this',design:'Remote can help, with good design',condition:'A condition remote work must meet',office:'A commercial priority for the office'};
let pend=null,popT=null,popTimer=0;
function popTimeout(ms){clearTimeout(popTimer);popTimer=setTimeout(closePop,ms);const bar=pop.querySelector('.pop-time');if(bar){bar.style.animation='none';void bar.offsetWidth;bar.style.animation='';}}
function closePop(){clearTimeout(popTimer);pend=popT=null;pop.hidden=true;pop.innerHTML='';}
function showPop(t,cls,html){popT=t;pop.className='value-pop '+cls;pop.innerHTML=html;pop.hidden=false;placePop();}
function valueTap(t){
 const v=values.find(x=>x.id===t.id);if(!v)return;const r=crystalClick(pend,t.id,performance.now());
 if(!r.toggle){const added=S.values.has(v.id);pend=r.pending;
  showPop(t,'rel-'+v.relation+(added?' added':''),`<button class="pop-close" data-pop-close aria-label="Close without changing">×</button><div class="pop-body"><p class="pop-kind"><span class="gem" aria-hidden="true"></span>${e(popKind[v.relation])}</p><h3>${e(v.label)}</h3><p class="pop-short">${e(v.short)}${v.relation==='office'?` <em>Costs ${e(v.cost.map(c=>costLabels[c]).join(' and ').toLowerCase())}.</em>`:''}</p><details class="pop-more"><summary>Read the case</summary><p>${e(v.long)}</p></details><p class="pop-ask">${e(valuePrompt(added))}</p></div><span class="pop-time" aria-hidden="true"></span>`);
  popTimeout(VALUE_PROMPT_MS);announce(`${v.label}. ${v.short} ${valuePrompt(added)}`);return;}
 pend=null;toggleValue(t.id);const added=S.values.has(t.id);
 showPop(t,'done rel-'+v.relation,`<p class="pop-done">${added?'✓ Added to your journey':'Removed from your journey'}</p><h3>${e(v.label)}</h3>`);popTimeout(1800);
}
// Keep the box beside the crystal without ever covering it: above its label when it fits, otherwise to the right or
// left, otherwise above or below, whichever has more room. If the room is short, the text scrolls inside the box.
function placePop(){if(pop.hidden||!popT||!engine)return;const p=engine.project(popT.pos),q=engine.project(popT.hit);
 if(!p.visible||!q.visible||p.dist>40){pop.style.opacity='0';pop.style.pointerEvents='none';return;}
 pop.style.opacity='';pop.style.pointerEvents='';
 const body=pop.querySelector('.pop-body'),W=stage.clientWidth,H=stage.clientHeight,w=pop.offsetWidth,top=70,sc=Math.max(.72,Math.min(1.1,5.5/p.dist+.45));
 const h=pop.offsetHeight+(body?body.scrollHeight-body.clientHeight:0),up=engine.project([popT.hit[0],popT.hit[1]+.4,popT.hit[2]]),rad=Math.max(14,up.visible?Math.abs(up.y-q.y):14);
 const cx=x=>Math.max(8,Math.min(W-w-8,x)),lim=(v,a,b)=>Math.max(a,Math.min(b,v)),aboveEnd=p.y-30*sc-14,belowStart=q.y+rad+14;
 let side,x,y,room;
 if(aboveEnd-top>=h){side='above';x=cx(p.x-w/2);y=aboveEnd-h;room=h;}
 else if(q.x+rad+18+w<=W-8||q.x-rad-18-w>=8){side=q.x+rad+18+w<=W-8?'right':'left';x=side==='right'?q.x+rad+18:q.x-rad-18-w;room=H-8-top;y=lim(q.y-Math.min(h,room)/2,top,H-8-Math.min(h,room));}
 else if(aboveEnd-top>=H-8-belowStart){side='above';x=cx(p.x-w/2);room=aboveEnd-top;y=aboveEnd-Math.min(h,room);}
 else{side='below';x=cx(q.x-w/2);y=belowStart;room=H-8-belowStart;}
 pop.style.maxHeight=h>room?Math.max(120,room).toFixed(0)+'px':'';
 pop.dataset.side=side;pop.style.setProperty('--arrow',(side==='above'||side==='below'?lim(q.x-x,20,w-20):lim(q.y-y,20,Math.min(h,room)-20)).toFixed(0)+'px');
 pop.style.transform=`translate(${x.toFixed(1)}px,${y.toFixed(1)}px)`;}
// Any press outside the box and the crystal's own label counts as clicking elsewhere. Canvas clicks are decided on
// pointerup, so dragging to look around keeps the box open.
document.addEventListener('pointerdown',ev=>{if(pop.hidden)return;const el=ev.target;if(el===canvas||pop.contains(el))return;const tag=el.closest?.('.tag');if(tag&&tag===tagEls.get(popT))return;closePop();},true);
pop.addEventListener('toggle',()=>{if(pend)popTimeout(VALUE_PROMPT_MS);placePop();},true);

// ---------- Cards ----------
function openCard(html,id){cardBody.innerHTML=html;card.hidden=false;openId=id;stage.classList.add('card-open');card.scrollTop=0;const h=cardBody.querySelector('h2');h?.focus({preventScroll:true});}
function closeCard(){card.hidden=true;openId=null;stage.classList.remove('card-open');canvas.focus({preventScroll:true});}
const valueButton=v=>`<button class="value-toggle rel-${v.relation}" data-value="${e(v.id)}" aria-pressed="${S.values.has(v.id)}"><span class="gem" aria-hidden="true"></span><span>${e(v.label)}</span><small>${e(relationLabels[v.relation])}</small></button>`;
function roomCard(room){
 const ex=exhibitsOf(room),vals=valuesIn(room.id);
 const list=room.id==='hall'?`<ol class="ex-list">${objections.map((o,i)=>`<li><button data-go-exhibit="obj-${e(o.id)}"><b>${i+1}</b> ${e(o.title)}${S.stances[o.id]?` <i class="st st-${S.stances[o.id]}">${e(stances.find(s=>s[0]===S.stances[o.id])[1])}</i>`:''}</button></li>`).join('')}<li><button data-go-exhibit="tally"><b>★</b> Your verdicts</button></li></ol>`:`<ol class="ex-list">${ex.map((x,i)=>`<li><button data-go-exhibit="${e(x.id)}"><b>${i+1}</b> ${e(x.title)}${S.seen.has(x.id)?' <i class="seen">seen</i>':''}</button></li>`).join('')}</ol>`;
 const next=roomById(room.next);
 return `<p class="kicker">${e(room.kicker)}</p><h2 tabindex="-1">${e(room.title)}</h2><p class="lead">${e(room.intro)}</p>${room.id==='hall'?`<p class="note">${e(voicesNote)}</p>`:''}
 ${room.id==='hub'?'<a class="read-promoted station-read" href="#guide"><span>Prefer to read?</span><strong>Read the full argument ↓</strong><small>Every room, picture and source, together on this page.</small></a>':''}
 <h3>In this room</h3>${list}${artIn(room.id).length?`<h3>On the walls</h3><ul class="ex-list art-list">${artIn(room.id).map(a=>`<li><button data-go-art="${e(a.id)}"><b aria-hidden="true">▣</b> ${e(a.title)}</button></li>`).join('')}</ul>`:''}${vals.length?`<h3>Things you might value</h3><div class="values">${vals.map(valueButton).join('')}</div>`:''}
 <div class="card-nav"><button class="go" data-teleport="${e(next.id)}">Next: ${e(next.name)} →</button>${room.id!=='hub'?'<button class="ghost" data-teleport="hub">← The Station</button>':''}</div>`;
}
function exhibitCard(room,x){
 if(x.id==='tally')return tallyCard();
 if(x.objection)return objectionCard(x);
 const w=x.widget?`<div class="widget" data-widget="${e(x.widget)}">${widget(x.widget)}</div>`:'';
 const extra=x.asks?`<ol class="asks">${coreAsk.map(a=>`<li>${e(a)}</li>`).join('')}</ol>`:'';
 const photo=x.photo==='ponta'?`<figure class="photo"><img src="./ponta.jpg" alt="Ponta do Sol’s waterfront with red-roofed buildings below green hills" loading="lazy"><figcaption>Ponta do Sol, 2009 · <a href="https://commons.wikimedia.org/wiki/File:Pontadosol1.JPG" target="_blank" rel="noopener noreferrer">Roman Klementschitz</a> · <a href="https://creativecommons.org/licenses/by/3.0/" target="_blank" rel="noopener noreferrer">CC BY 3.0</a>. Resized and cropped. The photo predates the programme.</figcaption></figure>`:'';
 const place=x.place?`<p class="kicker">${e(x.place)}</p>`:'';
 const lesson=x.lesson?`<p><strong>What to borrow:</strong> ${e(x.lesson)}</p>`:'';
 const ex=exhibitsOf(room),i=ex.findIndex(y=>y.id===x.id),nx=ex[(i+1)%ex.length];
 return `${place}${badge(x.badge)}<h2 tabindex="-1">${e(x.title)}</h2>${photo}<p class="lead">${e(x.body)}</p>${x.points?`<ul class="points">${x.points.map(([k,v])=>`<li><strong>${e(k)}</strong> ${e(v)}</li>`).join('')}</ul>`:''}${extra}${lesson}${w}${limits(x.limits)}${refs(x.sources)}
 <div class="card-nav"><button class="go" data-go-exhibit="${e(nx.id)}">Next in this room: ${e(nx.title)} →</button><button class="ghost" data-room-card>Room overview</button></div>`;
}
function artCard(a){
 const list=artIn(a.room),i=list.findIndex(y=>y.id===a.id),nx=list[(i+1)%list.length];
 return `${badge('Illustration')}<h2 tabindex="-1">${e(a.title)}</h2><figure class="photo art ${artShape(a)}"><img src="./${e(a.file)}" alt="${e(a.alt)}" ${artDims(a)}><figcaption>${e(a.caption)}</figcaption></figure>
 <div class="card-nav">${list.length>1?`<button class="go" data-go-art="${e(nx.id)}">Next picture: ${e(nx.title)} →</button>`:''}<button class="ghost" data-room-card>Room overview</button></div>`;
}
function objectionCard(x){
 const o=objections.find(y=>y.id===x.objection),i=objections.indexOf(o),st=S.stances[o.id];
 const tabs=`<div class="tabs" role="group" aria-label="Pieces of this argument">${[['skeptic','The objection'],['reply','A reply'],['evidence','The evidence']].map(([p,l])=>`<button data-go-exhibit="${p==='skeptic'?'obj':p==='reply'?'rep':'evi'}-${e(o.id)}" aria-pressed="${x.piece===p}">${l}</button>`).join('')}</div>`;
 let body='';
 if(x.piece==='skeptic')body=`<blockquote class="voice skeptic"><p>“${e(o.skeptic)}”</p><footer>A sceptic</footer></blockquote>`;
 if(x.piece==='reply')body=`<blockquote class="voice reply"><p>${e(o.reply)}</p><footer>A reply</footer></blockquote>`;
 if(x.piece==='evidence')body=`${badge(o.evidence.badge)}<p class="lead">${e(o.evidence.text)}</p>${limits(o.evidence.limits)}${refs(o.evidence.sources)}<p><strong>What would settle it:</strong> ${e(o.settle)}</p><p class="verdict"><strong>Where we land</strong>${e(o.verdict)}</p>`;
 const stanceUI=`<fieldset class="stance"><legend>Where do you land?</legend>${stances.map(([k,l])=>`<button data-stance="${e(o.id)}" data-val="${k}" aria-pressed="${st===k}" class="st-${k}">${e(l)}</button>`).join('')}</fieldset>`;
 const nxt=objections[(i+1)%objections.length];
 return `<p class="kicker">Objection ${i+1} of 10</p><h2 tabindex="-1">${e(o.title)}</h2>${tabs}${body}${stanceUI}<p class="note">${e(voicesNote)}</p>
 <div class="card-nav"><button class="go" data-go-exhibit="obj-${e(nxt.id)}">Next objection: ${e(nxt.title)} →</button><button class="ghost" data-room-card>All ten</button></div>`;
}
function tallyCard(){const t=D.tally,n=t.convinced+t.unsure+t.objection;return `<p class="kicker">The Great Hall</p><h2 tabindex="-1">Your verdicts</h2><p class="lead">${n?`You have weighed ${n} of 10 objections.`:'Visit an alcove and decide where you land.'}</p><ul class="tally"><li class="st-convinced"><b>${t.convinced}</b> reply convinces me</li><li class="st-unsure"><b>${t.unsure}</b> not sure yet</li><li class="st-objection"><b>${t.objection}</b> objection still holds</li></ul><p class="note">An objection that still holds isn’t a failure. It is exactly where the proposal needs more evidence or a better safeguard.</p><div class="card-nav"><button class="go" data-teleport="charter">The Charter Room →</button><button class="ghost" data-room-card>All ten</button></div>`;}

const outs={
 clock(){const a=annualTime(S.commute);return `<div class="big-number"><b>${fmt(a.hours)}</b><span>hours a year back</span></div><p class="small">That’s about <strong>${a.workdays.toLocaleString('en',{maximumFractionDigits:1})}</strong> eight-hour working days. Arithmetic: days × minutes × 2 × weeks ÷ 60. You decide what the time is for; work may absorb some of it.</p>`;},
 road(){const g=groupDistance({...S.group,days:S.remoteDays});return `<div class="big-number"><b>${fmt(g.net)}</b><span>net vehicle-km avoided each week</span></div><p class="small">${fmt(g.avoided)} km before extra driving.${g.net<0?' <strong>Here the extra driving outweighs the saving.</strong>':''} Distance isn’t carbon: mode, energy and buildings matter too.</p>`;},
 gradient(){const b=bandFor(S.remoteDays);return `<ul class="bands">${carbonBands.map(x=>`<li class="${x===b?'on':''}"><b>${e(x.label)}</b> ${e(x.text)}</li>`).join('')}</ul>`;},
 pay(){const p=payScenario(S.payIn);return `<div class="pay"><div><span>Worker A · near the office</span><b>€${fmt(p.reference)}</b></div><div><span>Worker B · another community</span><b>€${fmt(p.b)}</b></div></div><p class="outcome ${S.payIn.equal?'good':''}">${S.payIn.equal?'Same work, same band. Moving home doesn’t change it.':p.gap?`Worker B is paid €${fmt(p.gap)} less a year for the same work, only because of where B lives.`:'At 0% both are paid the same.'}</p>`;}
};
const out=kind=>`<div class="w-out" aria-live="polite">${outs[kind]()}</div>`;
function widget(kind){
 if(kind==='clock')return `<label>One-way commute <output>${S.commute.minutes} min</output><input type="range" min="0" max="120" step="5" value="${S.commute.minutes}" data-input="commute.minutes"></label><label>Days a week you could work remotely <output>${S.commute.days}</output><input type="range" min="0" max="5" value="${S.commute.days}" data-input="commute.days"></label><label>Working weeks a year <output>${S.commute.weeks}</output><input type="range" min="0" max="52" value="${S.commute.weeks}" data-input="commute.weeks"></label>${out('clock')}`;
 if(kind==='road')return `<label>Remote days a week <output>${S.remoteDays}</output><input type="range" min="0" max="5" value="${S.remoteDays}" data-input="remoteDays"></label><p class="small">The road around this room shows fewer cars as remote days rise. It’s an illustration, not a traffic model.</p><label>Drivers in the group <input type="number" min="1" max="10000" step="1" value="${S.group.workers}" data-input="group.workers"></label><label>One-way commute <output>${S.group.km} km</output><input type="range" min="0" max="100" value="${S.group.km}" data-input="group.km"></label><label>Extra driving per person per week <output>${S.group.extraKm} km</output><input type="range" min="0" max="500" step="5" value="${S.group.extraKm}" data-input="group.extraKm"></label>${out('road')}`;
 if(kind==='gradient')return `<label>Remote days a week <output>${S.remoteDays}</output><input type="range" min="0" max="5" value="${S.remoteDays}" data-input="remoteDays"></label>${out('gradient')}`;
 if(kind==='lights')return `<div class="seg" role="group" aria-label="Village weekday"><button data-village-mode="commuter" aria-pressed="${S.villageMode==='commuter'}">Commuter village</button><button data-village-mode="local" aria-pressed="${S.villageMode==='local'}">People work locally</button></div><p class="small">${S.villageMode==='local'?'Most windows stay lit at midday. People buy lunch, use the post office and meet at the school gate.':'At midday most homes are empty. The shop sees a morning and evening rush, then nothing.'}</p>`;
 if(kind==='village'){const c=villageChoices.find(v=>v.id===S.villageChoice);return `<div class="choices">${villageChoices.map(v=>`<button data-village-choice="${v.id}" aria-pressed="${S.villageChoice===v.id}">${e(v.label)}</button>`).join('')}</div>${c?`<p class="outcome ${c.recommended?'good':''}">${e(c.outcome)}${c.recommended?' <strong>This is the order we recommend.</strong>':''}</p>`:'<p class="small">Choose one to see what happens.</p>'}`;}
 if(kind==='pay'){const p=payScenario(S.payIn);return `<label>Residence discount <output>${p.discount}%</output><input type="range" min="0" max="50" step="5" value="${p.discount}" data-input="payIn.discount" ${S.payIn.equal?'disabled':''}></label>${out('pay')}<button class="go" data-pay-apply>${S.payIn.equal?'Remove the rule':'Apply the equal-pay rule'}</button><p class="small">Invented €60,000 reference. Equal gross base pay doesn’t mean equal take-home pay, purchasing power or benefits.</p>`;}
 if(kind==='invest'){const p=investmentPlans.find(x=>x.id===S.priority);return `<div class="choices">${investmentPlans.map(x=>`<button data-priority="${x.id}" aria-pressed="${S.priority===x.id}">${e(x.title)}</button>`).join('')}</div>${p?`<p class="outcome">${e(p.gain)}</p><p><strong>What waits:</strong> ${e(p.wait)}</p><p><strong>Check:</strong> ${e(p.check)}</p>`:'<p class="small">Choose one. The model on the table lights up what you chose.</p>'}`;}
 if(kind==='safeguards'){return `<div class="checks">${safeguards.map(x=>`<label><input type="checkbox" data-safeguard="${x.id}" ${S.safeguards[x.id]?'checked':''}> ${e(x.label)}</label>`).join('')}</div><ul class="risks">${safeguards.filter(x=>!S.safeguards[x.id]).map(x=>`<li>${e(x.risk)}</li>`).join('')||'<li class="ok">All three safeguards are in the plan. That makes a stronger starting design, not a proven optimum.</li>'}</ul>`;}
 if(kind==='phases'){const p=phases[S.phase];return `<div class="seg" role="group" aria-label="Phases">${phases.map((x,i)=>`<button data-phase="${i}" aria-pressed="${S.phase===i}">${i+1}</button>`).join('')}</div><h3>${S.phase+1}. ${e(p.title)}</h3><p>${e(p.body)}</p><p class="small"><strong>Before the next phase:</strong> ${e(p.check)}</p>`;}
 if(kind==='summary'){const m=D.meter,t=D.tally,picked=values.filter(v=>S.values.has(v.id));return `<div class="big-number"><b>${m.score}<small>/${m.max}</small></b><span>${e(m.level)}</span></div>${picked.length?`<ul class="picked">${picked.map(v=>`<li class="rel-${v.relation}"><span class="gem" aria-hidden="true"></span>${e(v.label)} <small>${e(relationLabels[v.relation].toLowerCase())}</small></li>`).join('')}</ul>${m.office?`<p class="small"><strong>${m.office}</strong> for the office · <strong>${m.condition}</strong> ${m.condition===1?'condition':'conditions'} to meet.</p>`:''}`:'<p class="small">You haven’t picked up any values yet. Every room has crystals to collect, and the Station has several by the entrance.</p>'}<p><strong>The Great Hall:</strong> ${t.convinced} convinced · ${t.unsure} unsure · ${t.objection} objection holds.</p><p class="small">Your commute clock: ${fmt(annualTime(S.commute).hours)} hours a year.${S.villageChoice?` Village: ${e(villageChoices.find(v=>v.id===S.villageChoice).label.toLowerCase())}.`:''}${S.priority?` Commonstead: ${e(investmentPlans.find(p=>p.id===S.priority).title.toLowerCase())}.`:''}</p><button class="go" data-open-board>Open your charter board →</button>`;}
 if(kind==='charter')return `<ol class="asks">${coreAsk.map(a=>`<li>${e(a)}</li>`).join('')}</ol><div class="checks">${charterItems.map(c=>`<label><input type="checkbox" data-charter="${c.id}" ${S.charter.has(c.id)?'checked':''}> <span>${e(c.text)}<small>${e(c.audience)} · ${e(c.action)}</small></span></label>`).join('')}</div><button class="go" data-download>Download my charter (JSON)</button><p class="small">The file holds your values, verdicts, choices and charter with a timestamp. Nothing is sent anywhere.</p>`;
 return '';
}
function rerenderWidget(){const w=cardBody.querySelector('.widget');if(!w)return;const kind=w.dataset.widget,active=document.activeElement;const key=active?.dataset?.priority||active?.dataset?.villageChoice||active?.dataset?.villageMode||active?.dataset?.phase;const sel=active&&w.contains(active)&&active.tagName==='BUTTON'?[...w.querySelectorAll('button')].indexOf(active):-1;w.innerHTML=widget(kind);if(sel>=0)w.querySelectorAll('button')[sel]?.focus();void key;}
function refreshOutputs(){const w=cardBody.querySelector('.widget');const o=w?.querySelector('.w-out');if(o&&outs[w.dataset.widget])o.innerHTML=outs[w.dataset.widget]();}

// ---------- Rooms & camera ----------
function getRoom(id){if(!cache.has(id)){const room=roomById(id),b=buildRoom(engine,room,exhibitsOf(room),valuesIn(id),order,themeOf,artIn(id));cache.set(id,b);loadPictures(b);}return cache.get(id);}
const pictures=new Map();
function loadPictures(b){for(const p of b.pics){const a=wallArt.find(x=>x.id===p.art);
 if(!pictures.has(a.file))pictures.set(a.file,new Promise((res,rej)=>{const img=new Image();img.onload=()=>res(img);img.onerror=rej;img.src='./'+a.file;}).then(img=>engine.texture(img)));
 pictures.get(a.file).then(t=>{p.texture=t;}).catch(()=>{});}}
function makeTags(){labelsEl.innerHTML='';tagEls.clear();if(!built)return;
 // The scene labels are decorative pointer controls; accessible reading links live in the HUD and Station card.
 for(const t of built.targets){const el=document.createElement('div');el.className='tag tag-'+t.kind;el.style.opacity='0';
  if(t.kind==='reading')el.innerHTML='<strong>Read the full argument ↓</strong><small>Every room · no 3D needed</small>';
  if(t.kind==='values-area')el.innerHTML='<strong>Values area</strong><small>Click to read · click again to keep</small>';
  if(t.kind==='exhibit'){const x=t.id==='tally'?{title:'Your verdicts'}:exhibitsOf(built.room).find(y=>y.id===t.id);const num=built.room.id==='hall'?(x?.piece==='skeptic'?`${(t.alcove??0)+1}`:''):String(exhibitsOf(built.room).findIndex(y=>y.id===t.id)+1);el.innerHTML=`${num?`<b>${e(num)}</b>`:''}<span>${e(x?.piece==='skeptic'?x.title:x?.title)}</span>`;}
  if(t.kind==='value'){const v=values.find(y=>y.id===t.id);el.classList.add('rel-'+v.relation);el.innerHTML=`<span class="gem"></span><span>${e(v.label)}</span>`;}
  if(t.kind==='art'){const a=wallArt.find(y=>y.id===t.id);el.innerHTML=`<span class="pic" aria-hidden="true">▣</span><span>${e(a.title)}</span>`;}
  if(t.kind==='portal'){const r=roomById(t.id);el.innerHTML=`<small>${t.role==='next'?'Next':t.id==='hub'?'Back to':'Go to'}</small><span>${e(r.name)}</span>`;}
  if(t.kind!=='values-area')el.addEventListener('click',()=>activate(t));labelsEl.append(el);tagEls.set(t,el);}
}
function updateTags(){if(!built||!engine)return;const hall=built.room.id==='hall';
 for(const [t,el] of tagEls){const p=engine.project(t.pos);const far=t.kind==='portal'?40:t.kind==='value'||t.kind==='art'?(S.hover===t.id||popT===t?30:t.kind==='art'?6.5:7.5):hall?(t.id==='tally'||t.id.startsWith('obj-')?40:9.5):26;
  // Names appear on inspection, so the values area does not borrow the exhibits' labels behind it.
  if(!p.visible||p.dist>far||(t.kind==='value'&&S.hover!==t.id&&popT!==t)){el.style.opacity='0';el.style.pointerEvents='none';continue;}
  const sc=Math.max(.72,Math.min(1.1,5.5/p.dist+.45));el.style.opacity=String(Math.min(1,(far-p.dist)/3));el.style.pointerEvents=t.kind==='values-area'?'none':'auto';
  el.style.transform=`translate(${p.x.toFixed(1)}px,${p.y.toFixed(1)}px) translate(-50%,-100%) scale(${sc.toFixed(3)})`;
  el.classList.toggle('seen',t.kind==='exhibit'&&S.seen.has(t.id));el.classList.toggle('claimed',t.kind==='value'&&S.values.has(t.id));el.classList.toggle('hover',S.hover===t.id);el.classList.toggle('pending',popT===t&&!!pend);}
}
const baseFov=()=>(innerWidth<innerHeight?84:70)*Math.PI/180;
function placeCamera(sp){const c=engine.cam;c.x=sp.x;c.z=sp.z;c.yaw=sp.yaw;c.pitch=-.06;c.fov=baseFov();}
function setRoom(id){
 const room=roomById(id);S.room=id;S.visited.add(id);closePop();
 if(engine){built=getRoom(id);engine.setItems(built.items);engine.setEnv(built.env);placeCamera(built.spawn);makeTags();}
 $('#room-num').textContent=room.number;$('#room-name').textContent=room.name;
 const next=roomById(room.next);$('#next-btn').textContent=`Next: ${next.name} →`;$('#next-btn').dataset.teleport=next.id;$('#station-btn').hidden=id==='hub';
 document.title=`${room.name} · After the Commute`;$$('#rooms-list [data-teleport]').forEach(b=>b.setAttribute('aria-current',String(b.dataset.teleport===id)));
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
 if(intro)openCard(roomCard(room),'room:'+id);
}
function go(id){if(location.hash!=='#'+id)location.hash=id;else teleport(id);}
function targetOf(kind,id){return built?.targets.find(t=>t.kind===kind&&t.id===id);}
function openExhibit(id){
 const room=roomById(S.room),x=id==='tally'?{id:'tally'}:exhibitsOf(room).find(y=>y.id===id);if(!x)return;
 if(id==='charter'){S.seen.add(id);openBoard();return;}
 S.seen.add(id);const t=targetOf('exhibit',id);
 if(t&&engine){const wide=innerWidth>760;startGlide(t.view.x,t.view.z,t.view.yaw-(wide?.3:0),wide?-.1:-.34);}
 openCard(exhibitCard(room,x),'ex:'+id);announce(x.title||'Your verdicts');
}
function openArt(id){const a=wallArt.find(x=>x.id===id);if(!a)return;const t=targetOf('art',id);
 if(t&&engine){const wide=innerWidth>760;startGlide(t.view.x,t.view.z,t.view.yaw-(wide?.32:0),t.view.pitch-(wide?0:.2));}
 openCard(artCard(a),'art:'+id);announce(a.title);}
function activate(t){if(busy)return;if(t.kind==='reading'){$('#guide').scrollIntoView({block:'start'});$('#guide').focus({preventScroll:true});location.hash='guide';}else if(t.kind==='portal')go(t.id);else if(t.kind==='value')valueTap(t);else if(t.kind==='art')openArt(t.id);else openExhibit(t.id);}
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
 collide(c);animateRoom(built,dt,time,D,S.motion);updateTags();placePop();
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
canvas.addEventListener('pointerup',ev=>{const d=drag;drag=null;if(!d||d.moved||!engine||busy)return;stage.classList.add('moved');const p=pick(ev.clientX,ev.clientY);if(!pop.hidden&&!(p?.t?.kind==='value'&&p.t.id===popT?.id))closePop();if(!p)return;if(p.t)activate(p.t);else if(p.floor){const b=built.bounds,r=Math.hypot(p.floor.x,p.floor.z),k=r>b?b/r:1;walkTo={x:p.floor.x*k,z:p.floor.z*k};}});
canvas.addEventListener('pointercancel',()=>{drag=null;});
const typing=el=>el&&el.closest?.('input,textarea,select,[contenteditable="true"]');
window.addEventListener('keydown',ev=>{
 if(ev.key==='Escape'&&!typing(ev.target)){if(!pop.hidden){closePop();return;}if(S.board){closeBoard();return;}if(!card.hidden){closeCard();return;}}
 if(S.board)return;
 if(typing(ev.target)||ev.metaKey||ev.ctrlKey||ev.altKey)return;
 const k=ev.key.toLowerCase(),moveKey=['w','a','s','d','q','e','arrowup','arrowdown','arrowleft','arrowright'].includes(k);
 if(!moveKey||!S.entered)return;
 if(k.startsWith('arrow')&&document.activeElement!==canvas&&document.activeElement!==document.body)return;
 const rect=stage.getBoundingClientRect();if(rect.bottom<80)return;
 keys.add(k);glide=null;ev.preventDefault();stage.classList.add('moved');
});
window.addEventListener('keyup',ev=>keys.delete(ev.key.toLowerCase()));
window.addEventListener('blur',()=>keys.clear());

// ---------- The charter board ----------
// A visual board of every value, grouped by category in two columns, with a scoreboard. The side panel explains one
// category at a time; clicking a value on the board toggles it and switches the panel to its category.
const board=$('#board');let boardCat=null;
const icon={
 time:'<circle cx="12" cy="12" r="8.5"/><path d="M12 7v5l3.5 2"/>',
 freedom:'<path d="M6 21V4h9l3 3v14"/><path d="M14 13h.01"/><path d="M3 21h18"/>',
 community:'<circle cx="8.5" cy="8" r="3"/><circle cx="16" cy="9" r="2.5"/><path d="M3 20c0-3.5 2.5-6 5.5-6s5.5 2.5 5.5 6M14 15c3 0 6 1.5 6 5"/>',
 planet:'<path d="M5 19c0-8 5-13 14-14-1 9-6 14-14 14z"/><path d="M5 19l8-8"/>',
 fairness:'<path d="M12 4v16M6 20h12M4 8h16"/><path d="M4 8l-2.5 6h5zM20 8l-2.5 6h5z"/>',
 places:'<path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/>'
};
const catIcon=id=>`<svg class="cat-ico" viewBox="0 0 24 24" aria-hidden="true">${icon[id]}</svg>`;
const sortRel={provides:0,design:1,condition:2,office:3};
const inCat=id=>valuesOf(id).sort((a,b)=>sortRel[a.relation]-sortRel[b.relation]);
const costText=v=>v.cost.map(c=>costLabels[c]).join(' and ');
function chip(v){
 return `<button class="chip rel-${v.relation}" data-value="${e(v.id)}" data-chip aria-pressed="${S.values.has(v.id)}"><span class="gem" aria-hidden="true"></span><span class="chip-text"><strong>${e(v.label)}</strong><small>${e(v.short)}</small></span><em class="chip-tag">${e(relationLabels[v.relation])}${v.relation==='office'?` · costs ${e(costText(v).toLowerCase())}`:''}</em></button>`;
}
function catCounts(id){const l=valuesOf(id),on=l.filter(v=>S.values.has(v.id));return {remote:on.filter(scored).length,office:on.filter(v=>v.relation==='office').length,of:l.filter(scored).length};}
function scoreHTML(){
 const s=scoreboard([...S.values]),tot=s.remote+s.office,rp=tot?Math.round(s.remote/tot*100):50;
 return `<div class="score-row"><div class="side remote"><b>${s.remote}</b><span>Remote work</span><small>of ${s.max} human, planet and fairness values</small></div>
 <div class="tug" role="img" aria-label="Remote work ${s.remote}, the office ${s.office}"><span class="tug-remote" style="width:${rp}%"></span><span class="tug-office" style="width:${100-rp}%"></span></div>
 <div class="side office"><b>${s.office}</b><span>The office</span><small>of ${s.officeMax} commercial priorities</small></div></div>
 <p class="verdict v-${s.kind}">${e(s.lead)}</p>
 ${s.against.length?`<ul class="costs">${s.against.map(a=>`<li><strong>${e(a.label)}</strong> costs ${e(a.cost.map(c=>costLabels[c]).join(' and ').toLowerCase())}, against <em>${e(a.against)}</em>.</li>`).join('')}</ul>`:''}
 ${s.conditions?`<p class="conds">You’ll hold remote work to ${s.conditions} ${s.conditions===1?'condition':'conditions'}. They count for neither side; they are what remote work has to get right.</p>`:''}`;
}
function tilesHTML(){
 return categories.map(c=>{const n=catCounts(c.id),l=inCat(c.id),pos=l.filter(v=>v.relation!=='office'),off=l.filter(v=>v.relation==='office');
  return `<section class="cat cat-${c.id}" aria-labelledby="cat-h-${c.id}"><header>${catIcon(c.id)}<h3 id="cat-h-${c.id}"><button class="cat-open" data-category="${c.id}">${e(c.name)}</button></h3><span class="cat-count" data-count="${c.id}">${n.remote}/${n.of}${n.office?` · ${n.office} office`:''}</span></header><p class="cat-intro">${e(c.intro)}</p>
  <div class="chips">${pos.map(chip).join('')}</div>${off.length?`<p class="chips-sep">Commercial priorities</p><div class="chips">${off.map(chip).join('')}</div>`:''}</section>`;}).join('');
}
function asksHTML(){
 return `<h3>Your asks</h3><p class="small">Turn what you value into a request: tick the proposals you would put your name to.</p><div class="checks">${charterItems.map(c=>`<label><input type="checkbox" data-charter="${c.id}" ${S.charter.has(c.id)?'checked':''}> <span>${e(c.text)}<small>${e(c.audience)} · ${e(c.action)}</small></span></label>`).join('')}</div>
 <button class="go" data-download>Download my charter (JSON)</button><p class="small">The file holds your values, scoreboard, verdicts, choices and asks with a timestamp. Nothing is sent anywhere.</p>
 <p class="note">This board makes the case for remote work. Commercial priorities are described as we see them; the Great Hall gives the strongest good-faith objections and what the evidence says.</p>`;
}
function renderBoard(){$('#board-score').innerHTML=scoreHTML();$('#board-cats').innerHTML=tilesHTML();$('#board-asks').innerHTML=asksHTML();}
function updateBoard(){if(!S.board)return;$('#board-score').innerHTML=scoreHTML();for(const c of categories){const n=catCounts(c.id),el=board.querySelector(`[data-count="${c.id}"]`);if(el)el.textContent=`${n.remote}/${n.of}${n.office?` · ${n.office} office`:''}`;}}
function detail(v,focus){
 const has=S.values.has(v.id),office=v.relation==='office',against=office?values.find(x=>x.id===v.against):null;
 return `<article class="vd rel-${v.relation}${focus?' focus':''}" id="vd-${e(v.id)}"><h3><span class="gem" aria-hidden="true"></span>${e(v.label)}</h3>
 <p class="vd-tag">${e(relationLabels[v.relation])}${office?` · costs ${e(costText(v).toLowerCase())}`:''}</p>
 ${office?`<p class="claim"><span>What they say</span>“${e(v.claim)}”</p>`:''}<p>${e(v.long)}</p>
 ${office?`<p class="small"><strong>Works against:</strong> ${e(against.label)}</p>`:''}${refs(v.sources)}
 <button class="vd-toggle" data-value="${e(v.id)}" aria-pressed="${has}"><span class="on">${office?'Backed':'In my charter'} ✓</span><span class="off">${office?'Back this priority':'Add to my charter'}</span></button></article>`;
}
function catLead(id){const c=categories.find(x=>x.id===id),n=catCounts(id);return `${c.intro} You hold ${n.remote} of ${n.of} values here${n.office?`, and back ${n.office} commercial ${n.office===1?'priority':'priorities'}`:''}.`;}
function categoryCard(id,focus){
 const c=categories.find(x=>x.id===id);
 return `<p class="kicker">Your charter · ${categories.indexOf(c)+1} of ${categories.length}</p><h2 tabindex="-1">${e(c.name)}</h2><p class="lead" data-cat-lead>${e(catLead(id))}</p>
 <div class="cat-tabs" role="group" aria-label="Categories">${categories.map(x=>`<button data-category="${x.id}" aria-pressed="${x.id===id}">${catIcon(x.id)}<span>${e(x.name)}</span></button>`).join('')}</div>
 ${inCat(id).map(v=>detail(v,v.id===focus)).join('')}`;
}
function showCategory(id,focus){
 if(boardCat!==id||card.hidden){boardCat=id;openCard(categoryCard(id,focus),'cat:'+id);}
 else{cardBody.querySelectorAll('.vd.focus').forEach(x=>x.classList.remove('focus'));}
 const el=focus&&cardBody.querySelector('#vd-'+CSS.escape(focus));if(el){el.classList.add('focus');el.scrollIntoView({block:'nearest',behavior:S.motion?'smooth':'auto'});}
}
function openBoard(cat){
 closePop();S.board=true;board.hidden=false;stage.classList.add('board-open');glide=walkTo=null;keys.clear();renderBoard();
 const first=cat||values.find(v=>S.values.has(v.id))?.category||categories[0].id;boardCat=null;
 if(innerWidth>760)showCategory(first);else closeCard();
 $('#board-title').focus({preventScroll:true});announce('Your charter board. '+scoreboard([...S.values]).lead);
}
function closeBoard(){S.board=false;board.hidden=true;stage.classList.remove('board-open');boardCat=null;if(openId?.startsWith('cat:'))closeCard();canvas.focus({preventScroll:true});}

// ---------- UI events ----------
document.addEventListener('click',ev=>{
 const b=ev.target.closest('button,a[data-teleport]');if(!b)return;
 if(b.hasAttribute('data-pop-close')){closePop();return;}
 if(b.dataset.teleport){ev.preventDefault();$('#rooms').close?.();go(b.dataset.teleport);return;}
 if(b.dataset.goExhibit){const id=b.dataset.goExhibit;openExhibit(id);return;}
 if(b.dataset.goArt){openArt(b.dataset.goArt);return;}
 if(b.hasAttribute('data-room-card')){openCard(roomCard(roomById(S.room)),'room:'+S.room);return;}
 if(b.dataset.value){const v=values.find(x=>x.id===b.dataset.value);toggleValue(b.dataset.value,'button');if(b.hasAttribute('data-chip')&&v)showCategory(v.category,v.id);return;}
 if(b.dataset.category){showCategory(b.dataset.category);return;}
 if(b.hasAttribute('data-open-board')){openBoard();return;}
 if(b.id==='board-close'){closeBoard();return;}
 if(b.dataset.stance){S.stances[b.dataset.stance]=b.dataset.val;refresh();$$(`[data-stance="${b.dataset.stance}"]`).forEach(x=>x.setAttribute('aria-pressed',String(x.dataset.val===b.dataset.val)));toast(`<strong>Noted</strong><span>${e(stances.find(s=>s[0]===b.dataset.val)[1])}</span>`);announce('Stance recorded.');return;}
 if(b.dataset.villageMode){S.villageMode=b.dataset.villageMode;refresh();rerenderWidget();return;}
 if(b.dataset.villageChoice){S.villageChoice=b.dataset.villageChoice;rerenderWidget();return;}
 if(b.dataset.priority){S.priority=b.dataset.priority;refresh();rerenderWidget();return;}
 if(b.dataset.phase){S.phase=+b.dataset.phase;refresh();rerenderWidget();return;}
 if(b.hasAttribute('data-pay-apply')){S.payIn.equal=!S.payIn.equal;refresh();rerenderWidget();if(S.payIn.equal)toast('<strong>Rule applied</strong><span>Same work, same pay band.</span>','provides');return;}
 if(b.hasAttribute('data-download')){download();return;}
 if(b.id==='card-close'){closeCard();return;}
 if(b.id==='rooms-btn'){$('#rooms').showModal?.();return;}
 if(b.id==='rooms-close'){$('#rooms').close?.();return;}
 if(b.id==='here-btn'){openCard(roomCard(roomById(S.room)),'room:'+S.room);return;}
 if(b.id==='values-btn'){openCard(valuesCard(),'values');return;}
 if(b.id==='motion-btn'){S.motion=!S.motion;b.setAttribute('aria-pressed',String(!S.motion));b.textContent=S.motion?'Pause motion':'Resume motion';return;}
 if(b.id==='enter-btn'){enter();return;}
});
document.addEventListener('input',ev=>{const el=ev.target;if(!el.dataset.input)return;if(el.type==='number'&&(el.value===''||!el.validity.valid)){el.setAttribute('aria-invalid','true');return;}el.removeAttribute('aria-invalid');
 const [a,b]=el.dataset.input.split('.');const v=Number(el.value);if(b)S[a][b]=v;else S[a]=v;refresh();
 const out=el.parentElement.querySelector('output');if(out)out.textContent=el.dataset.input==='group.km'?`${v} km`:el.dataset.input==='group.extraKm'?`${v} km`:el.dataset.input==='commute.minutes'?`${v} min`:el.dataset.input==='payIn.discount'?`${v}%`:String(v);
 refreshOutputs();});
document.addEventListener('change',ev=>{const el=ev.target;if(el.dataset.safeguard){S.safeguards[el.dataset.safeguard]=el.checked;refresh();rerenderWidget();}if(el.dataset.charter){el.checked?S.charter.add(el.dataset.charter):S.charter.delete(el.dataset.charter);}});
function valuesCard(){return `<p class="kicker">The meter</p><h2 tabindex="-1">Things you value</h2><p class="lead">The meter rises for values remote work can help provide; striped segments need good design. Dark red blocks are commercial priorities that pull work back to the office, and blue gems are conditions remote work has to meet. The charter board in the last room adds them up.</p>${rooms.filter(r=>valuesIn(r.id).length).map(r=>`<h3>${e(r.name)}</h3><div class="values">${valuesIn(r.id).map(valueButton).join('')}</div>`).join('')}<div class="card-nav">${S.room==='charter'?'<button class="go" data-open-board>Open your charter board →</button>':'<button class="go" data-teleport="charter">See your charter →</button>'}</div>`;}
function download(){const m=D.meter;const data={ts_ms:Date.now(),edition,kind:'Private After the Commute charter (not submitted)',values:values.filter(v=>S.values.has(v.id)).map(v=>({id:v.id,label:v.label,category:v.category,relation:v.relation})),meter:{score:m.score,max:m.max,level:m.level,needs_design:m.design,conditions:m.condition,office:m.office},scoreboard:(({remote,office,conditions,costs,kind,lead})=>({remote,office,conditions,costs,kind,lead}))(scoreboard([...S.values])),verdicts:objections.filter(o=>S.stances[o.id]).map(o=>({id:o.id,objection:o.title,stance:S.stances[o.id]})),choices:{commute:annualTime(S.commute),remote_days:S.remoteDays,village:S.villageChoice,commonstead_first:S.priority,safeguards:S.safeguards,equal_pay_rule:S.payIn.equal},charter:charterItems.filter(c=>S.charter.has(c.id)).map(c=>c.text)};
 const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=`after-the-commute-charter-${data.ts_ms}.json`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);toast('<strong>Download prepared</strong><span>Your charter stays with you.</span>');}

function enter(){S.entered=true;$('#intro').hidden=true;stage.classList.add('entered');const id=roomById(location.hash.slice(1))?location.hash.slice(1):'hub';if(id!==S.room)teleport(id);else{if(engine&&built)placeCamera(built.spawn);openCard(roomCard(roomById(id)),'room:'+id);}canvas.focus({preventScroll:true});stage.scrollIntoView({block:'start',behavior:'instant'});}
window.addEventListener('hashchange',()=>{const id=location.hash.slice(1);if(roomById(id)&&id!==S.room){if(!S.entered){S.entered=true;$('#intro').hidden=true;stage.classList.add('entered');}teleport(id);stage.scrollIntoView({block:'start'});}});
motionQuery.addEventListener('change',ev=>{S.motion=!ev.matches;$('#motion-btn').textContent=S.motion?'Pause motion':'Resume motion';});

// ---------- Boot ----------
function boot(){
 $('#rooms-list').innerHTML=rooms.map(r=>`<li><button data-teleport="${r.id}"><b>${r.number}</b><span>${e(r.name)}</span><small>${e(r.title)}</small></button></li>`).join('');
 $('#motion-btn').textContent=S.motion?'Pause motion':'Resume motion';$('#motion-btn').setAttribute('aria-pressed',String(!S.motion));
 try{engine=createEngine(canvas);}catch(err){engine=null;stage.classList.add('no-3d');$('#no3d').hidden=false;}
 const first=roomById(location.hash.slice(1))?location.hash.slice(1):'hub';setRoom(first);
 if(engine){if(!S.motion)engine.cam.yaw+=.4;engine.start(frame);new ResizeObserver(()=>{engine.resize();if(!busy)engine.cam.fov=baseFov();}).observe(canvas);document.addEventListener('visibilitychange',()=>document.hidden?engine.stop():engine.start(frame));}
 refresh();stage.classList.add('ready');
}
// Phones (narrow, or a short touch screen held sideways) open the reading guide first; the 3D rooms start only when asked for, or when the address names a room.
const narrow=matchMedia('(max-width: 760px), (pointer: coarse) and (max-height: 520px)'),to3d=$('#g-3d');
let started=false;
function start3d(){if(started)return;started=true;document.body.classList.add('stage-on');to3d.hidden=true;boot();}
if(narrow.matches&&!roomById(location.hash.slice(1)))to3d.hidden=false;else start3d();
$('#to-3d').addEventListener('click',()=>{start3d();stage.scrollIntoView({block:'start'});});
narrow.addEventListener('change',ev=>{if(!ev.matches)start3d();});

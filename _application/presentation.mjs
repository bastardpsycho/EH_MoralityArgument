// Shared accessible presentation for case facts and evidence. No browser state or I/O.
import {sources} from './sources.mjs';
export const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const topicLabel=topic=>topic?`<p class="topic-label">${esc(topic)}</p>`:'';
export function argumentPoints(points=[]){return points.length?`<ol class="argument-points">${points.map(([label,text])=>`<li><strong>${esc(label)}</strong><p>${esc(text)}</p></li>`).join('')}</ol>`:'';}
export function references(ids=[]){return ids.length?`<ul class="refs">${[...new Set(ids)].map(id=>sources.find(s=>s.id===id)).filter(Boolean).map(s=>`<li><a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${esc(s.title)}</a><small>${esc(s.kind)} · ${esc(s.locator)}</small><details class="source-access"><summary>What this source supports</summary><p>${esc(s.note)}</p><p><strong>Access:</strong> ${esc(s.access)}</p><p><strong>Limits:</strong> ${esc(s.limits)}</p></details></li>`).join('')}</ul>`:'';}
export function evidenceMarkup(items=[]){return items.length?`<div class="evidence-stack">${items.map(item=>`<article class="evidence-item"><span class="evidence-kind">${esc({fact:'Evidence',commitment:'Value premise',argument:'Argument'}[item.kind]||'Case fact')}</span><p>${esc(item.text)}</p>${item.limits?`<p class="small evidence-limit">Scope: ${esc(item.limits)}</p>`:''}${references(item.sources||item.sourceIds||[])}</article>`).join('')}</div>`:'';}
export function caseMarkup(c){if(!c)return '';return `<section class="case-study"><p class="kicker">Case study</p><h3>${esc(c.title)}</h3><p class="case-context">${esc(c.context)}</p>${evidenceMarkup(c.facts)}<div class="decision-point"><strong>The decision</strong><p>${esc(c.decision)}</p></div>${c.alternatives?.length?`<ul class="case-alternatives">${c.alternatives.map(a=>`<li><strong>${esc(a.label)}</strong><p>${esc(a.consequence)}</p></li>`).join('')}</ul>`:''}<p class="case-lesson">${esc(c.lesson)}</p>${c.limits?`<details class="limits"><summary>What this case does and does not show</summary><p>${esc(c.limits)}</p></details>`:''}${references(c.sources)}</section>`;}

// The full reading alternative describes every conditional path, including untaken ones.
export function conditionText(node,lookup){
 if(node.all)return node.all.map(n=>'('+conditionText(n,lookup)+')').join(' AND ');
 if(node.any)return node.any.map(n=>'('+conditionText(n,lookup)+')').join(' OR ');
 const step=lookup(node.step);
 return `“${step.prompt}” → ${node.choices.map(id=>'“'+step.choices.find(c=>c.id===id).label+'”').join(' or ')}`;
}

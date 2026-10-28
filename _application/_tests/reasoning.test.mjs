import test from 'node:test';
import assert from 'node:assert/strict';
import {createReasoner} from '../reasoning.mjs';
const choice=(id)=>({id,label:id});
const base=(id)=>({id,room:'one',choices:['a','b'].map(choice)});
const leaf=(step,...choices)=>({step,choices});
const steps=[base('foundation'),base('method'),{...base('follow'),branch:{after:'foundation',when:leaf('foundation','a')}},{...base('deep'),branch:{after:'follow',when:{all:[leaf('follow','a'),{any:[leaf('foundation','a'),leaf('method','a')]}]}}}];
const rules=[{id:'conflict',kind:'contradiction',title:'Conflict',when:{all:[leaf('foundation','a'),leaf('method','b')]},explanation:'Two claims conflict.',scope:'journey',sources:[]},{id:'tension',kind:'tension',title:'Tension',when:{all:[leaf('foundation','b'),leaf('method','a')]},explanation:'A tension.',scope:'journey',sources:[]}];
const build=()=>createReasoner(steps,rules);

test('branch activation, context changes and switchback cannot restore a previous answer',()=>{
 const r=build(); let a={};
 assert.deepEqual(r.plan('one',a).map(x=>x.id),['foundation','method']);
 assert.throws(()=>r.record(a,'follow','a',1),/inactive/);
 a=r.record(a,'foundation','a',1); a=r.record(a,'follow','a',2);
 assert.deepEqual(r.plan('one',a).map(x=>x.id),['foundation','follow','deep','method']);
 a=r.record(a,'deep','a',3); assert.equal(r.choice(a,'deep').id,'a');
 a=r.record(a,'foundation','b',4); assert.deepEqual(r.state(a).inactive.map(x=>x.step.id),['follow','deep']);
 a=r.record(a,'foundation','a',5); const result=r.state(a);
 assert.equal(result.current.follow,undefined); assert.equal(result.stale[0].step.id,'follow'); assert.equal(result.inactive[0].step.id,'deep');
 assert.throws(()=>r.record(a,'foundation','b',5),/timestamp/);
});
test('nested any dependencies record unanswered values and invalidate when they appear',()=>{
 const r=build(); let a={};
 a=r.record(a,'foundation','a',1); a=r.record(a,'follow','a',2); a=r.record(a,'deep','b',3);
 assert.equal(a.deep.basis.method,null); a=r.record(a,'method','a',4);
 assert.equal(r.state(a).stale.find(x=>x.step.id==='deep').answer.choice_id,'b');
 a=r.record(a,'deep','b',5); assert.equal(r.choice(a,'deep').id,'b');
 const old=a.deep; a=r.record(a,'deep','b',6); assert.equal(a.deep,old);
});
test('checks require all current answers; consistent realist-style selections produce no warning',()=>{
 const r=build(); let a=r.record({},'foundation','a',1);
 assert.equal(r.checks(a).all.length,0);
 a=r.record(a,'method','a',2); assert.equal(r.checks(a).all.length,0);
 a=r.record(a,'method','b',3); assert.equal(r.checks(a).pending[0].id,'conflict');
});
test('acknowledgements are signature-bound, explanation-bearing and reopen after relevant changes',()=>{
 const r=build(); let a=r.record({},'foundation','a',1); a=r.record(a,'method','b',2);
 let resolution=r.acknowledge(a,{},'conflict','distinction','Different senses of authority.',3);
 assert.equal(r.checks(a,resolution).acknowledged.length,1);
 assert.equal(r.checks(a,{conflict:{...resolution.conflict,text:'  '}}).pending.length,1);
 a=r.record(a,'follow','b',4); assert.equal(r.checks(a,resolution).acknowledged.length,1);
 a=r.record(a,'method','a',5); assert.equal(r.checks(a,resolution).all.length,0);
 a=r.record(a,'method','b',6); assert.equal(r.checks(a,resolution).pending.length,1);
 assert.throws(()=>r.acknowledge(a,resolution,'conflict','retain',' ',7),/Invalid/);
 assert.throws(()=>r.acknowledge(a,resolution,'tension','retain','answer',7),/inactive/);
});
test('invalid graph, references and unknown conditions fail closed',()=>{
 assert.throws(()=>createReasoner([{...base('x'),branch:{after:'missing',when:leaf('x','a')}}]),/anchor/);
 assert.throws(()=>createReasoner([base('x'),{...base('y'),branch:{after:'x',when:leaf('x','missing')}}]),/choice/);
 assert.throws(()=>createReasoner([base('x')],[{...rules[0],when:{not:leaf('x','a')}}]),/condition/);
 const cyclic=[base('root'),{...base('x'),branch:{after:'root',when:leaf('y','a')}},{...base('y'),branch:{after:'root',when:leaf('x','a')}}];
 assert.throws(()=>createReasoner(cyclic),/Cyclic/);
 const anchorCycle=[{...base('x'),branch:{after:'y',when:leaf('root','a')}},{...base('y'),branch:{after:'x',when:leaf('root','a')}},base('root')];
 assert.throws(()=>createReasoner(anchorCycle),/Cyclic/);
});

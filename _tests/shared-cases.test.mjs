import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {stepById,roomById,roomExhibits,edition} from '../_application/data.mjs';
import {getCase} from '../_partners/MoralTopology/_application_v2/cases.mjs';
import {MODEL_VERSION} from '../_partners/MoralTopology/_application_v2/model.mjs';

const record=JSON.parse(await readFile(new URL('../_documentation/shared_cases/town_housing_case.json',import.meta.url),'utf8'));

test('the shared town record points at real steps, rooms, exhibits and Topology influences',()=>{
  assert.equal(record.morarg.edition,edition);
  assert.equal(record.topology.model_version,MODEL_VERSION);
  for(const id of [record.morarg.introduced_in_step,record.morarg.sorting_step])assert(stepById(id),id);
  assert(stepById(record.morarg.sorting_step).choices.some(c=>c.id===record.morarg.sorting_answer_matching_story_labels));
  const room=roomById(record.morarg.room),exhibit=roomExhibits(room).find(x=>x.id===record.morarg.model_exhibit);
  assert.equal(exhibit.link.href,record.morarg.model_link);
  const scenario=getCase(record.topology.case_id);
  for(const e of record.events)assert(scenario.influences[e.topology_influence],e.event);
  assert.equal(scenario.viewpoints[0].name,'Pat');assert.equal(scenario.viewpoints[1].name,'Sam');
});

test('every MORARG link into Topology names a case that exists and a room that exists',()=>{
  for(const l of record.other_links){
    const exhibit=roomExhibits(roomById(l.morarg_room)).find(x=>x.id===l.morarg_exhibit);
    assert.equal(exhibit.link.href,l.link);
    const params=new URLSearchParams(l.link.split('?')[1]);
    assert(getCase(params.get('case')));assert(roomById(params.get('from')));
  }
});

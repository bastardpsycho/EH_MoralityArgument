// Run only after the Operator's explicit monkeyballs confirmation in this chat.
import {readFile, writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
if(!process.argv.includes('--operator-confirmed')) throw Error('Explicit Operator confirmation is required before modifying sibling projects.');
const stage = new URL('../_hosting/integration/', import.meta.url);
const {changes} = JSON.parse(await readFile(new URL('changes.json',stage),'utf8'));
const sha = body => createHash('sha256').update(body).digest('hex');
// Check every precondition before the first write. Preserve drafts in the sibling projects.
for(const item of changes) {
  let body;
  try { body=await readFile(item.target); } catch(error) { if(error.code!=='ENOENT') throw error; }
  if((body ? sha(body) : null)!==item.before_sha256) throw Error(`Sibling source changed; restage and review: ${item.target}`);
  if(sha(await readFile(new URL(item.staged,stage)))!==item.after_sha256) throw Error(`Staged source changed: ${item.staged}`);
}
for(const item of changes) await writeFile(item.target, await readFile(new URL(item.staged,stage)));
console.log(`Applied ${changes.length} reviewed source changes. No deployment performed.`);

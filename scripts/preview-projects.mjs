// Read-only preview of the staged Projects static files. Never starts its API or D1.
import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../_hosting/integration/projects-public/',import.meta.url));
const types={html:'text/html; charset=utf-8',css:'text/css; charset=utf-8',js:'text/javascript; charset=utf-8',mjs:'text/javascript; charset=utf-8',svg:'image/svg+xml',jpg:'image/jpeg',png:'image/png',json:'application/json'};
const server=createServer(async(req,res)=>{
  if(!['GET','HEAD'].includes(req.method)){res.writeHead(405).end();return;}
  let path;
  try{path=decodeURIComponent(new URL(req.url,'http://localhost').pathname);}catch{res.writeHead(400).end();return;}
  if(path==='/api/sites'){const data=await readFile(new URL('../_hosting/integration/projects-api.json',import.meta.url));res.writeHead(200,{'Content-Type':'application/json'}).end(data);return;}
  const target=resolve(root,'.'+(path==='/'?'/index.html':path));
  if(!target.startsWith(root)||path.split('/').some(p=>p.startsWith('.'))){res.writeHead(404).end();return;}
  try{const body=await readFile(target);res.writeHead(200,{'Content-Type':types[target.split('.').at(-1)]??'application/octet-stream','X-Content-Type-Options':'nosniff','Content-Length':body.length});res.end(req.method==='HEAD'?undefined:body);}catch{res.writeHead(404).end();}
});
server.listen(0,'127.0.0.1',()=>console.log(`Staged Projects preview http://127.0.0.1:${server.address().port}/`));
for(const signal of ['SIGINT','SIGTERM'])process.on(signal,()=>server.close());

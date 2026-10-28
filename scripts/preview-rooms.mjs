// Own-process QA server. /lab/ exists only here, never in the publication assets.
import {createServer} from 'node:http';
import {readFile,readdir} from 'node:fs/promises';
const dist=new URL('../_hosting/dist/',import.meta.url);
const lab=new URL('../_partners/MoralTopology/_application_v2/',import.meta.url);
const labAssets=new Set(['index.html','styles.css','app.mjs','cases.mjs','model.mjs','chart.mjs','scaffold.mjs']);
const published=new Set();
async function walk(base,prefix=''){
  for(const item of await readdir(base,{withFileTypes:true})){
    if(item.isDirectory())await walk(new URL(item.name+'/',base),prefix+item.name+'/');
    else if(!item.name.startsWith('_'))published.add(prefix+item.name);
  }
}
await walk(dist);
const types={html:'text/html; charset=utf-8',mjs:'text/javascript; charset=utf-8',css:'text/css; charset=utf-8',svg:'image/svg+xml',jpg:'image/jpeg',json:'application/json'};
const server=createServer(async(req,res)=>{
  if(!['GET','HEAD'].includes(req.method)){res.writeHead(405).end();return;}
  let route;try{route=decodeURIComponent(new URL(req.url,'http://localhost').pathname).slice(1);}catch{res.writeHead(400).end();return;}
  if(!route||route.endsWith('/'))route+='index.html';
  let base=dist,name=route;
  if(route.startsWith('lab/')){base=lab;name=route.slice(4);if(!labAssets.has(name)){res.writeHead(404).end();return;}}
  else if(!published.has(route)){res.writeHead(404).end();return;}
  try{const data=await readFile(new URL(name,base));res.writeHead(200,{'Content-Type':types[name.split('.').at(-1)]||'application/octet-stream','Cache-Control':'no-store','Content-Security-Policy':"default-src 'none'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'none'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'; form-action 'none'"});res.end(req.method==='HEAD'?undefined:data);}catch{res.writeHead(404).end();}
});
server.listen(0,'127.0.0.1',()=>console.log(`Rooms QA: http://127.0.0.1:${server.address().port}/morality/topology/ · interactive: /lab/`));
for(const signal of ['SIGINT','SIGTERM'])process.on(signal,()=>server.close());

import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
import {runtimeAssets, __version__} from '../_application/scaffold.mjs';

const root = new URL('../_application/', import.meta.url);
const allowed = new Set(runtimeAssets);
const types = {html:'text/html; charset=utf-8', css:'text/css; charset=utf-8', mjs:'text/javascript; charset=utf-8', svg:'image/svg+xml', jpg:'image/jpeg'};

export function createPreviewServer() {
  return createServer(async (req, res) => {
    if (!['GET', 'HEAD'].includes(req.method)) {
      res.writeHead(405, {'Allow':'GET, HEAD'}).end(); return;
    }
    let name;
    try { name = decodeURIComponent(new URL(req.url, 'http://localhost').pathname).slice(1) || 'index.html'; }
    catch { res.writeHead(400).end(); return; }
    if (!allowed.has(name)) { res.writeHead(404).end('Not found'); return; }
    try {
      const body = await readFile(new URL(name, root));
      res.writeHead(200, {
        'Content-Type': types[name.split('.').at(-1)],
        'Content-Length': body.length,
        'Cache-Control':'no-store',
        'X-Content-Type-Options':'nosniff',
        'Referrer-Policy':'no-referrer',
        'Content-Security-Policy': "default-src 'none'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'none'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'; form-action 'none'"
      });
      res.end(req.method === 'HEAD' ? undefined : body);
    } catch { res.writeHead(500).end('Asset unavailable'); }
  });
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const port = Number(process.env.TRANSPLANT_PORT || 4201);
  if (!Number.isInteger(port) || port < 0 || port > 65535) throw Error('Invalid TRANSPLANT_PORT');
  const server = createPreviewServer();
  server.on('error', error => { console.error(error.message); process.exitCode = 1; });
  server.listen(port, '127.0.0.1', () => console.log(`MORARG ${__version__}: http://127.0.0.1:${server.address().port}/`));
  for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => server.close());
}

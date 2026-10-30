import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createPreviewServer} from '../../scripts/preview.mjs';
import {runtimeAssets} from '../scaffold.mjs';
import {renderPage} from '../page.mjs';

const appRoot = new URL('../', import.meta.url);

async function dispatch(server, method, url) {
  let status;
  let headers = {};
  let body;
  const response = {
    writeHead(code, fields = {}) {
      status = code;
      headers = Object.fromEntries(Object.entries(fields).map(([key, value]) => [key.toLowerCase(), value]));
      return this;
    },
    end(value) { body = value; return this; }
  };
  await server.listeners('request')[0]({method, url}, response);
  return {status, headers, body};
}

test('browser modules use local imports and make no automatic network or persistent-state calls', async () => {
  const browserModules = runtimeAssets.filter(file => file.endsWith('.mjs'));
  assert(browserModules.length > 0);
  const forbidden = /\b(?:fetch|XMLHttpRequest|WebSocket|EventSource|sendBeacon|localStorage|sessionStorage|indexedDB)\b|\beval\b(?!-)|new Function|document\.cookie/;

  for (const file of browserModules) {
    const source = await readFile(new URL(file, appRoot), 'utf8');
    assert.doesNotMatch(source, forbidden, file);
    for (const [, , specifier] of source.matchAll(/(?:from\s+|import\()(['"])([^'"]+)\1/g)) {
      assert.match(specifier, /^\.\/[a-z][a-z0-9-]*\.mjs$/, `${file}: ${specifier}`);
      assert(runtimeAssets.includes(specifier.slice(2)), `${file}: imported module ${specifier} must be served`);
    }
  }

  const app = await readFile(new URL('app.mjs', appRoot), 'utf8');
  assert.match(app, /view.*controls/, 'an explicit non-WebGL control path is available');
});

test('the old calculator and ideological scoring runtime has no data or app entry points', async () => {
  const data = await import('../data.mjs');
  const retiredExports = [
    'annualTime', 'groupDistance', 'bandFor', 'payScenario', 'meterState',
    'scoreboard', 'scored', 'stanceTally'
  ];
  for (const name of retiredExports) assert.equal(name in data, false, `${name} is not part of the MORARG data API`);

  const runtime = await Promise.all(['app.mjs', 'data.mjs', 'page.mjs', 'rooms.mjs'].map(async file =>
    [file, await readFile(new URL(file, appRoot), 'utf8')]
  ));
  const retiredLogic = /\b(?:annualTime|groupDistance|payScenario|meterState|scoreboard|stanceTally)\b/;
  for (const [file, source] of runtime) assert.doesNotMatch(source, retiredLogic, file);
});

test('the preview serves only packaged assets with a restrictive CSP and refuses writes', async () => {
  const server = createPreviewServer();
  assert.equal(new Set(runtimeAssets).size, runtimeAssets.length, 'the browser allowlist has no duplicates');
  for (const asset of runtimeAssets) {
    assert.equal(asset.split('/').length, 1, `${asset} is a package-local asset`);
    const response = await dispatch(server, 'HEAD', `/${asset}`);
    assert.equal(response.status, 200, asset);
    assert.equal(response.body, undefined, `${asset} HEAD response has no body`);
  }

  const home = await dispatch(server, 'GET', '/');
  assert.equal(home.status, 200);
  assert.equal(home.body.toString(), renderPage());
  const csp = home.headers['content-security-policy'];
  assert(csp, 'the preview sets a Content Security Policy');
  for (const directive of [
    "default-src 'none'", "script-src 'self'", "connect-src 'none'", "object-src 'none'",
    "base-uri 'none'", "frame-ancestors 'none'", "form-action 'none'"
  ]) assert(csp.includes(directive), directive);
  assert.match(csp, /style-src 'self'/);
  assert.match(csp, /img-src 'self'/);
  assert.equal(home.headers['x-content-type-options'], 'nosniff');
  assert.equal(home.headers['referrer-policy'], 'no-referrer');

  for (const path of [
    '/README.md', '/source-manifest.json', '/verification.json', '/package.json',
    '/page.mjs', '/scripts/preview.mjs', '/.env', '/%ZZ',
    '/%2e%2e/_documentation/TRANSPLANT_GUIDE.md', '/%2e%2e%2f_documentation/TRANSPLANT_GUIDE.md'
  ]) {
    const response = await dispatch(server, 'GET', path);
    assert([400, 404].includes(response.status), `${path} is outside the packaged asset allowlist`);
  }
  const write = await dispatch(server, 'POST', '/');
  assert.equal(write.status, 405);
  assert.equal(write.headers.allow, 'GET, HEAD');
});

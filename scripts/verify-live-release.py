"""Verify published Rooms, the prepared discovery release and old-route redirects."""
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
import hashlib
import json
import sys
import time
import urllib.error
import urllib.request

root = Path(__file__).resolve().parents[1]
stage = root / '_hosting/debates-integration'
headers = {'User-Agent': 'Mozilla/5.0', 'Accept': '*/*'}
def digest(body):
    return hashlib.sha256(body).hexdigest()

class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, *args, **kwargs):
        return None

def request(url, follow=True):
    opener = urllib.request.build_opener() if follow else urllib.request.build_opener(NoRedirect)
    req = urllib.request.Request(url, headers={**headers, 'Referer': 'https://projects.engineeringhumanity.org/'})
    try:
        return opener.open(req, timeout=25)
    except urllib.error.HTTPError as error:
        return error

checks = []
for host, directory in [('debates', root/'_hosting/dist'), ('models', stage/'models-dist'), ('projects', stage/'projects-public')]:
    for path in directory.rglob('*'):
        if not path.is_file() or path.name.startswith('.') or path.name in ('_headers', '_redirects'):
            continue
        relative = path.relative_to(directory).as_posix()
        route = relative.removesuffix('index.html') if relative.endswith('index.html') else relative.removesuffix('.html') if relative.endswith('.html') else relative
        if host == 'models' and relative.startswith(('after-the-commute/', 'after-the-commute-v03/')):
            tail = route.split('/', 1)[1]
            checks.append({'kind':'redirect','url':f'https://models.engineeringhumanity.org/{route}', 'location':'https://debates.engineeringhumanity.org/after-the-commute/'+tail})
        else:
            checks.append({'kind':'asset','url':f'https://{host}.engineeringhumanity.org/{route}', 'sha256':digest(path.read_bytes())})
for old in ['after-the-commute','after-the-commute-v03']:
    checks.append({'kind':'redirect','url':f'https://models.engineeringhumanity.org/{old}?view=controls', 'location':'https://debates.engineeringhumanity.org/after-the-commute/?view=controls'})
for route in ['morality/package.json','morality/page.mjs','unknown-route']:
    checks.append({'kind':'404','url':'https://debates.engineeringhumanity.org/'+route})

def verify(check):
    try:
        with request(check['url'], follow=check['kind'] != 'redirect') as response:
            body=response.read()
            row={**check,'status':response.status}
            if check['kind']=='asset':
                row['match']=response.status==200 and digest(body)==check['sha256']
            elif check['kind']=='redirect':
                row['actual_location']=response.headers.get('Location')
                row['match']=response.status==301 and row['actual_location']==check['location']
            else:
                row['match']=response.status==404
            if check['url'].endswith('.mjs') and check['kind']=='asset':
                row['mime']=response.headers.get('Content-Type')
                row['match']=row['match'] and 'javascript' in (row['mime'] or '')
            if 'debates.engineeringhumanity.org' in check['url'] and check['kind']=='asset':
                row['match']=row['match'] and "connect-src 'none'" in response.headers.get('Content-Security-Policy','')
            return row
    except Exception as error:
        return {**check,'match':False,'error':str(error)}

with ThreadPoolExecutor(max_workers=12) as pool:
    results=list(pool.map(verify, checks))
with request('https://projects.engineeringhumanity.org/api/sites') as response:
    body=response.read()
    results.append({'kind':'api','status':response.status,'match':response.status==200 and digest(body)==digest((stage/'projects-api.json').read_bytes()),'entries':len(json.loads(body).get('sites',[]))})
report={'ts_ms':time.time_ns()//1_000_000,'checks':results}
Path(sys.argv[1]).write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps({'checked':len(results),'passed':sum(row['match'] for row in results),'failures':[row for row in results if not row['match']]},indent=2))
sys.exit(0 if all(row['match'] for row in results) else 1)

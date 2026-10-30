"""Verify this Rooms artifact after publication; does not change any service."""
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
import hashlib
import json
import sys
import time
import urllib.error
import urllib.parse
import urllib.request

ROOT = Path(__file__).resolve().parents[1]
BASE = 'https://debates.engineeringhumanity.org/'
class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, *args, **kwargs):
        return None

def get(route, follow=True):
    opener = urllib.request.build_opener() if follow else urllib.request.build_opener(NoRedirect)
    request = urllib.request.Request(BASE+route, headers={'User-Agent':'Mozilla/5.0'})
    try:
        return opener.open(request, timeout=25)
    except urllib.error.HTTPError as error:
        return error

checks=[]
for path in (ROOT/'_hosting/dist').rglob('*'):
    if not path.is_file() or path.name.startswith(('_','.')):
        continue
    relative=path.relative_to(ROOT/'_hosting/dist').as_posix()
    route=relative.removesuffix('index.html') if relative.endswith('index.html') else relative
    checks.append({'kind':'asset','route':route,'sha256':hashlib.sha256(path.read_bytes()).hexdigest()})
for route in ['morality/topology/package.json','morality/topology/_documentation/ASTRA_DESIGN.md','morality/topology/_tests/model.test.mjs','morality/topology/.git/config','morality/package.json','morality/page.mjs','lab/','unknown-route']:
    checks.append({'kind':'404','route':route})
checks.append({'kind':'redirect','route':'morality/topology?view=example','target':'morality/topology/?view=example'})

def check(row):
    try:
        with get(row['route'],follow=row['kind']!='redirect') as response:
            body=response.read();result={**row,'status':response.status}
            if row['kind']=='asset':
                result['match']=response.status==200 and hashlib.sha256(body).hexdigest()==row['sha256']
                result['csp']=response.headers.get('Content-Security-Policy','')
                result['match'] &= "connect-src 'none'" in result['csp']
                if row['route'].endswith('.mjs'):
                    result['mime']=response.headers.get('Content-Type','');result['match'] &= 'javascript' in result['mime']
            elif row['kind']=='404':
                result['match']=response.status==404
            else:
                result['location']=response.headers.get('Location','')
                result['match']=response.status==301 and urllib.parse.urljoin(BASE,result['location'])==BASE+row['target']
            return result
    except Exception as error:
        return {**row,'match':False,'error':str(error)}

with ThreadPoolExecutor(max_workers=8) as pool:
    results=list(pool.map(check,checks))
report={'ts_ms':time.time_ns()//1_000_000,'checks':results}
Path(sys.argv[1]).write_text(json.dumps(report,indent=2)+'\n')
failed=[r for r in results if not r['match']]
print(json.dumps({'checks':len(results),'passed':len(results)-len(failed),'failures':failed},indent=2))
sys.exit(1 if failed else 0)

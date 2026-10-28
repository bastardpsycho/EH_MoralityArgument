"""Read-only comparison of the existing published sites against local build assets."""
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
import hashlib
import json
import sys
import time
import urllib.request

social = Path(__file__).resolve().parents[2]
roots = {
    'models': social / '4_UtopianProvisioningEconomy_UPE/_application/upe/dist',
    'projects': social / '6_FrontPageCollection/_application/public',
}
items = []
for host, root in roots.items():
    for path in root.rglob('*'):
        if not path.is_file() or path.name.startswith('.') or path.name in ('_headers', '_redirects'):
            continue
        relative = path.relative_to(root).as_posix()
        route = relative.removesuffix('index.html') if relative.endswith('index.html') else relative.removesuffix('.html') if relative.endswith('.html') else relative
        items.append((host, relative, route, hashlib.sha256(path.read_bytes()).hexdigest()))

def check(item):
    host, relative, route, expected = item
    url = f'https://{host}.engineeringhumanity.org/{route}'
    try:
        request = urllib.request.Request(url, headers={'User-Agent': 'MORARG-release-verification'})
        with urllib.request.urlopen(request, timeout=30) as response:
            actual = hashlib.sha256(response.read()).hexdigest()
            return {'host': host, 'file': relative, 'status': response.status, 'match': actual == expected}
    except Exception as error:
        return {'host': host, 'file': relative, 'match': False, 'error': str(error)}

with ThreadPoolExecutor(max_workers=12) as pool:
    results = list(pool.map(check, items))
report = {'ts_ms': time.time_ns() // 1_000_000, 'checks': results}
Path(sys.argv[1]).write_text(json.dumps(report, indent=2) + '\n')
print(json.dumps({'checked': len(results), 'matched': sum(item['match'] for item in results), 'mismatches': [item for item in results if not item['match']]}, indent=2))
sys.exit(0 if all(item['match'] for item in results) else 1)

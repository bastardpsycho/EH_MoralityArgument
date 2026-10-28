"""Record the verified local-preview makeover; preserve unrelated MTOP work."""
import json
import sqlite3
import time
from datetime import datetime, timezone
from pathlib import Path

root = Path(__file__).resolve().parents[2]
receipt = Path(__file__).with_name("register_receipt_pass3_codex_20261005_1914Z.json")
validation = json.loads(Path(__file__).with_name("validation_pass3_codex_20261005_1914Z.json").read_text())
assert validation["tests_passed"] == 36
assert validation["browser_verified"] is True
stamp = datetime.now(timezone.utc).strftime("%Y%m%d-%H%MZ")
ts_ms = time.time_ns() // 1_000_000
state = f"""Pass3 observatory makeover complete; build 1.2.0; ts_ms={ts_ms}.
User-requested local process restart and Astra visual design: midnight navy,
cyan baseline/actions, pink changed paths, violet highlights. Guided and full-model
surfaces and figures share the dark palette. Header shows current version.
36 tests pass. Browser QA covers desktop and 390px layouts, guided reset/run,
2D view, dropdown, full-model controls and console errors. All case definitions
and numerical model files remain unchanged. Runtime module entry now declares a
literal __version__, checked against the package by a resting test.
Local development preview restarted from canonical project at http://127.0.0.1:8150/;
live_version=1.2.0 refers only to deploy_slot=local_preview, not production.
MTOP-2/3 comprehension and numerical-sensitivity follow-ups remain open.
Evidence: _output/pass3_observatory_codex_20261005_1914Z. No packages installed."""
conn = sqlite3.connect("/Users/Shared/7_PythonApps/0_Codex/99_shareddata/cross_op_register.db")
conn.row_factory = sqlite3.Row
try:
    conn.execute("BEGIN IMMEDIATE")
    old = dict(conn.execute("SELECT * FROM project_context WHERE project='MTOP'").fetchone())
    assert old["project_root"] == str(root)
    assert old["build_version"] == "1.1.0"
    assert old["deploy_slot"] == "local_preview"
    conn.execute("UPDATE project_context SET state=?,build_version=?,live_version=?,updated_utc=? WHERE project=? AND build_version=?", (state,"1.2.0","1.2.0",stamp,"MTOP","1.1.0"))
    assert conn.execute("SELECT changes()").fetchone()[0] == 1
    row = dict(conn.execute("SELECT * FROM project_context WHERE project='MTOP'").fetchone())
    assert row["state"] == state and row["build_version"] == row["live_version"] == "1.2.0"
    assert row["arch"] == old["arch"] and row["core"] == old["core"]
    assert conn.execute("PRAGMA integrity_check").fetchone()[0] == "ok"
    conn.commit()
except BaseException:
    conn.rollback()
    raise
finally:
    conn.close()
with sqlite3.connect("file:/Users/Shared/7_PythonApps/0_Codex/99_shareddata/cross_op_register.db?mode=ro", uri=True) as readback:
    readback.row_factory = sqlite3.Row
    verified = dict(readback.execute("SELECT * FROM project_context WHERE project='MTOP'").fetchone())
    assert verified == row
receipt.write_text(json.dumps({"ts_ms":ts_ms,"before":old,"after":verified,"integrity_check":"ok"},indent=2)+"\n")
print(json.dumps({"project":"MTOP","build_version":verified["build_version"],"live_version":verified["live_version"],"deploy_slot":verified["deploy_slot"],"integrity_check":"ok"}))

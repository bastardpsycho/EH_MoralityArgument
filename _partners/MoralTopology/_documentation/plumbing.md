# Local operation

Use the shared interpreter; no packages were installed for the consumer redesign.

```bash
cd /Users/Shared/7_PythonApps/0_Dash/Py/Social/MoralTopology/_application
/Users/Shared/7_PythonApps/0_Codex/.venv/bin/python -m moral_topology
```

The launcher prints its loopback URL, choosing the first available port from 8150.
The application has no database dependency at runtime and serves its assets locally.
Stop the process with Ctrl-C. A local preview is not a production deployment.

```bash
cd /Users/Shared/7_PythonApps/0_Dash/Py/Social/MoralTopology
/Users/Shared/7_PythonApps/0_Codex/.venv/bin/python -m unittest discover -s _application/_tests -v
```

Tests exercise model behaviour and comparison integrity, not empirical validity.
For UI changes, also inspect the running browser: change case and condition, reset,
download the brief, visit full-model control panes, run population and assumption
experiments, and check a narrow viewport.

Git is local on `main`. The initial commit preserves the incoming application and
source brief; the redesign is a separate commit. No remote is configured. Generated
caches, cold-storage folders, secrets and QA screenshots are ignored.

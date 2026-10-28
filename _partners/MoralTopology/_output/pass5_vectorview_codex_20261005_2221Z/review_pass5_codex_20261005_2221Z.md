# Pass5 — Restore the exploratory opening view

Git comparison confirms c75a4a5 introduced guided-first startup and disabled default
full-model overlays. The prior e166b41 interface offered field and population views,
with octants and endpoint clusters enabled. The styling and large-canvas passes did
not remove the vector-field implementation.

Build 1.2.2 opens Full model in Force field view, with octants and endpoint clusters.
Field mode now includes the already-computed cohort trajectories and endpoints,
which had previously been omitted in that view. Numerical mechanisms are unchanged.
Guided exploration remains a secondary workspace; navy styling and 4K sizing remain.

37 tests pass. New regression executes the real initial callback and verifies field
cones, cohort traces/endpoints, octants and endpoint clusters. Local server starts
as 1.2.2 at 127.0.0.1:8150. Browser-tool security policy blocked selecting the existing
tab; no circumvention attempted. Browser visual verification remains unperformed;
operator should refresh the tab to load the new opening view.

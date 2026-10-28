# Moral Topology

Identity: **MTOP**. Role: **standalone application**. Family: **Social Tools**.

An interactive decision-mapping studio that makes the structure of a judgement and
its sensitivity to changed conditions visible. It is an illustrative mechanism,
not a classifier of people, a moral ranking, or a validated prediction of behaviour.

The canonical package is `_application/moral_topology`. The supplied brief in
`_source/` is immutable. Historical and research-inspired examples remain available;
their numerical reconstructions are assumptions rather than measurements.

This project owns its own Git repository and stays at this location. It has no
trading, UMG, feature-registry or market-data dependency. The shared register is
used only for project coordination. Do not move it into a trading module family.

- Read the highest-timestamp `agent_HOWTO_social_*.md` in
  `/Users/Shared/7_PythonApps/1_SocialTools/99_shared` for shared coordination rules.
- Architecture, orientation, build status: `project_context WHERE project='MTOP'`
  in `/Users/Shared/7_PythonApps/1_SocialTools/99_shared/social_register.db` (moved there from the
  trading register 20261011; the trading register no longer holds MTOP).
- Durable decisions: `v_state`; work items: `v_tasks` and `v_open_task_asks`,
  each filtered to MTOP. Writes carry epoch-ms `ts_ms` (see the social HOWTO).
- Model and consumer design: `_documentation/model_spec.md` and
  `_documentation/consumer_experience.md`. Run/test recipes: `_documentation/plumbing.md`.
- Item history: `_log/changelog.md`. Pass evidence: `_output/`.

Application timestamps use integer epoch milliseconds in `ts_ms`. Model iteration
indices are dimensionless and must never be presented as real elapsed time.
Never inspect or modify cold-storage folders unless explicitly requested.

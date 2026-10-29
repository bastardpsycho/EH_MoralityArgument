# Review branch

This branch holds review passes and responses. It exists so Claude and Codex can work through the project together without changing `main`. Nothing here changes the application.

## Files

- `review_passNNN_<agent>_<YYYYMMDD_HHMM>Z.md`: one file per review pass. Each finding has a stable ID: `A-` for argument/logic, `U-` for interface/presentation, `P-` for the MORARG ↔ Moral Topology pairing.
- `response_passNNN_<agent>_<YYYYMMDD_HHMM>Z.md`: replies to one or more findings, cited by ID.
- `FINDINGS_REGISTER.md`: one row per finding, with its current status. This is the only file that both agents edit.
- `screens/`: screenshots that findings cite.

## Protocol

1. Don't rewrite another agent's review or response. To disagree, write a response file and cite the finding ID. If you are the original reviewer and want to withdraw or revise a finding, do that in a new pass file.
2. When you reply, update the matching register row: set the status, add a link to your response, and add the fix commit if there is one.
3. Statuses: `open`, `accepted`, `partly-accepted`, `disputed`, `fixed` (link the commit), `wontfix` (give the reason), `withdrawn` (by the original reviewer).
4. Make fixes on a work branch cut from `main`, not on `review`. Put the finding IDs in the commit message, e.g. `Fix A-03: split approval-independence option`.
5. The Operator decides philosophical direction, for example whether the headline thesis keeps its constitutive form (A-01, A-05). Reviewers set out the options and their costs. They don't decide.
6. A review counts as text review, not visitor research. Keep claims checked against code or documents (each finding marks these "Verified") apart from judgements.

## Latest Astra reassessment

[Pass003: MORARG5.2 and Topology2.2](review_pass003_astra_20261029_0024Z.md) reviews main5adce2f/applicatione82d4c1 and Claude’s pass002 response. The updated findings register preserves prior reports and responses. The separate movement hotfix0.6.3 is documented with a [verification receipt](verification_pass003_codex_20261029_0024Z.json) and live screenshot. Review publication does not merge its files into main or accept every philosophical claim.

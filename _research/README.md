# Research records

This folder preserves research-access records and argument critiques that were present in local pass outputs but absent from GitHub. It complements the existing research documentation; it does not replace the current argument or bundle the third-party papers and books.

At pass010, most final research material was already tracked in `_documentation/` and `_application/sources.mjs`. The additional material selected here consists of **ten historical files, 142,013 bytes**: three source-access snapshots and seven authored critique reports. Across the snapshots there are **41 distinct source IDs**; the 30/36/41 entries are successive editions, not 107 independent sources.

No saved primary-paper PDFs or full-text collection was found in the inspected non-cold MORARG project files. `_input/` contained no substantive files. This inventory does not cover cold storage, global caches, other projects or transient browser/tool results. It makes no claim to have recovered every page or passage ever viewed.

## Start here

- [Source index](SOURCE_INDEX.md): the current argument's 41 references, URLs, exact locators, recorded access, use and limits, generated from the already-tracked source records.
- [Provenance manifest](MANIFEST.json): original paths, byte counts, SHA-256 hashes, original timestamps where recorded, packaging `ts_ms`, existing canonical references and exclusions.
- [Argument corpus](../_documentation/ARGUMENT_CORPUS.md): the developed thesis, source notes, serious alternatives and unresolved questions.
- [Primary-text review](../_documentation/PRIMARY_REVIEW.md) and [evolved-fairness research](../_documentation/EVOLVED_FAIRNESS_RESEARCH.md): what was inspected and what it can support.

## Historical source-access snapshots

| Pass | Records | File |
| --- | ---: | --- |
| pass002 | 30 | [Source access](source_access/source_access_pass002_codex_20261027_1636Z.json) |
| pass003 | 36 | [Source access](source_access/source_access_pass003_codex_20261027_1719Z.json) |
| pass004 | 41 | [Source access](source_access/source_access_pass004_codex_20261027_1807Z.json) |

The pass004 snapshot exactly matched `_application/sources.mjs` when this folder was assembled. These are access notes and bibliographic/provenance records, not copies of full primary works. An entry may record selected passages, a draft/mirror, a synopsis, failed direct access or other limits. Preserve those distinctions. Historical `checked_ts_ms` values are not refreshed just because a file is copied or indexed. No links were newly fetched or revalidated in this preservation pass.

## Historical critiques and their sequence

Read these as records of the text available to each reviewer at the time. A filename containing `FINAL` is scoped to that review point; it does not by itself establish the final status of every subsequent edit. Earlier defects are not automatically current defects.

| Record | What it preserves |
| --- | --- |
| [pass003 counterpoint](reviews/pass003/COUNTERPOINT_pass003_codex_20261027_1719Z.md) | Skeptical argument/case review, proposed prompt changes, exact-scope consistency checks and later second-read notes. It contains successive review states. |
| [Luna authority, initial](reviews/pass004/LUNA_AUTHORITY_REVIEW_pass004_codex_20261027_1807Z.md) | Relational authority versus its disputed ground, adequacy conditions, realist countermodel and source limitations. |
| [Luna authority, follow-up](reviews/pass004/LUNA_AUTHORITY_FINAL_pass004_codex_20261027_1807Z.md) | Follow-up critique that still observed pre-revision visitor wording. It precedes the saved visitor-copy review below. |
| [Terra authority, initial](reviews/pass004/TERRA_AUTHORITY_REVIEW_pass004_codex_20261027_1807Z.md) | Same-verdict realist challenge, refusal/representation/competing-claim tests and proposed diagnostic feedback. |
| [Luna semantics, follow-up](reviews/pass004/LUNA_SEMANTICS_FINAL_pass004_codex_20261027_1830Z.md) | Saved Good/bad/objectivity section, source roles, correction status and optional precision. |
| [Luna saved visitor copy](reviews/pass004/LUNA_VISITOR_REVIEW_pass004_codex_20261027_1807Z.md) | Later review records the earlier objective-test wording defect as closed while retaining the substantive grounding dispute. |
| [Terra authority and semantics, follow-up](reviews/pass004/TERRA_AUTHORITY_FINAL_pass004_codex_20261027_1807Z.md) | Revised saved argument, negative controls, seven focused checks and continuing philosophical limits. |

The current [authority argument](../_documentation/AUTHORITY_ARGUMENT.md), [Astra argument review](../_documentation/ASTRA_ARGUMENT_REVIEW.md) and [argument map](../_documentation/ARGUMENT_MAP.json) provide the developed synthesis. Original critiques remain byte-identical so their chronology and limitations are inspectable. Where a report has no original epoch-millisecond timestamp, the manifest leaves `source_ts_ms` null.

## Related material already in the repository

- [Luna counterpoint review](../_documentation/LUNA_COUNTERPOINT_REVIEW.md) and [Terra user review](../_documentation/TERRA_USER_REVIEW.md).
- [MORARG/Moral Topology sibling assessment](../_documentation/assessment_pass006_codex_20261027_2332Z.md).
- [Shared-case pairing plan](../_documentation/SHARED_CASE_PAIRING_PLAN.md) and its [draft case](../_documentation/shared_cases/research_consent_case.example.json) / [model profile](../_documentation/shared_cases/research_consent_mtop_profile.example.json).

The local pass006 assessment and pass007 pairing-plan copies exactly duplicate their tracked documentation counterparts, so they are linked rather than copied again.

## Preservation boundary

Original files under `_output/` remain untouched. Register/database backups, register-operation scripts, deployment caches, routine handovers, screenshots, browser records and test/hash receipts are operational material and are excluded from this research collection. Cold-storage folders were not inspected. Third-party source works remain at the cited URLs; this is not a complete offline literature library.

This folder is versioned source documentation. The Cloudflare packaging allowlists do not include `_research/`; adding it to GitHub does not publish it into the live website or require a deployment. No fresh literature review, philosophical endorsement, empirical validation or model integration is claimed by copying these records.

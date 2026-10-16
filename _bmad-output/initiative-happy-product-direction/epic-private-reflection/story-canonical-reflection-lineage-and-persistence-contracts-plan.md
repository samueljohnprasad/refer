---
title: "Canonical reflection lineage and persistence contracts"
type: "feature"
ticket: "1"
created: "2026-10-15"
status: done
route: "full"
route_source: "auto"
review: "quick"
review_source: "pinned"
lenses_ran: ["quick"]
review_loop_iteration: 0
context:
  - "/Users/samuelprasad/Desktop/happy/journals/PRODUCT.md"
  - "/Users/samuelprasad/Desktop/happy/journals/DESIGN.md"
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Existing journaling writes to `journal_records` without preserving path/practice lineage. Without an atomic, schema-guarded `ReflectionContextV1` record, post-practice reflections cannot be distinguished from standalone journals or verified as guided learning evidence for CAP-3 and future CAP-4 insights.

**Approach:** Define the canonical `ReflectionContextV1` contract and a dedicated `journal_reflection_lineage` persistence store. Provide atomic insertion linking a `journal_records` row and its guided lineage under `auth.uid()`, with database-level cascading deletion and strict RLS.

## Boundaries & Constraints

**Always:** Scoped strictly by `auth.uid()`; enforce `source: "guided"`, non-null path and practice identifiers, and one-to-one mapping to `journal_records.id`; ensure cascading delete when a journal aggregate is removed.

**Never:** Do not store health-adjacent telemetry or free-text in logs or analytics; do not allow standalone entries without lineage to count as guided practice evidence; do not invoke unverified AI processing.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|---------------|----------------------------|----------------|
| HAPPY_PATH | Valid journal text + valid ReflectionContextV1 input | Atomically writes journal record & lineage; returns typed aggregate | Rollback transaction on failure |
| MISSING_LINEAGE | Journal write without required lineage | Standalone record created with source "standalone"; not counted as guided | Rejected by guided repo if called as guided |
| CASCADE_DELETE | User deletes journal record | journal_records row deleted; matching lineage row deleted via ON DELETE CASCADE | Handled natively by database FK |
| RLS_ISOLATION | User attempts to read/write another user's lineage | Operation filtered or denied by auth.uid() check | Supabase RLS error returned |

</frozen-after-approval>

## Code Map

- `supabase/migrations/20261015190000_journal_reflection_lineage.sql` -- schema migration for `journal_reflection_lineage` table, foreign keys, RLS, indexes, and atomic RPC.
- `src/domains/journal/model/reflectionLineage.ts` -- `ReflectionContextV1` interface and validation predicates.
- `src/domains/journal/data/reflectionLineage.repo.ts` -- repository for atomic creation, querying, and verification of guided reflection lineage.

## Tasks & Acceptance

**Execution:**
- [x] Create migration `supabase/migrations/20261015190000_journal_reflection_lineage.sql` with RLS and cascade.
- [x] Create `src/domains/journal/model/reflectionLineage.ts` with `ReflectionContextV1` contracts.
- [x] Create `src/domains/journal/data/reflectionLineage.repo.ts` with atomic persistence and query functions.

**Acceptance Criteria:**
- Given a valid guided reflection, when saved, both the `journal_records` row and `journal_reflection_lineage` row are written atomically.
- Given a saved guided reflection, when queried, its `ReflectionContextV1` lineage is accurately reconstructed.
- Given a journal record without lineage, when checked with `isGuidedReflectionRecord`, it returns `false`.
- Given an existing guided reflection, when the journal record is deleted, the corresponding lineage record is automatically cascaded and removed.

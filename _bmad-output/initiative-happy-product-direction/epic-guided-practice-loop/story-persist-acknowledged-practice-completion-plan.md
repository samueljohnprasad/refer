---
title: 'Persist acknowledged practice completion'
type: 'feature'
ticket: '2'
created: '2026-10-15'
status: done
review: 'quick'
review_source: 'pinned'
lenses_ran: ['quick']
route: 'full'
route_source: 'auto'
review: ''
review_source: ''
lenses_ran: []
review_loop_iteration: 0
context:
  - '/Users/samuelprasad/Desktop/happy/journals/PRODUCT.md'
  - '/Users/samuelprasad/Desktop/happy/journals/DESIGN.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Completing a StarterPath practice currently saves the exercise entry, but it does not produce the normalized, retry-safe practice completion contract required by reflection and insight work.

**Approach:** Connect the existing exercise completion boundary to one domain-owned acknowledged completion path. Preserve the stable practice session across retries, attach StarterPath lineage, and expose only acknowledged completion downstream.

## Boundaries & Constraints

**Always:** Use the authenticated Supabase user ID; keep `practice_session_id` stable for retries; deduplicate completion by session; distinguish saved from unsynced; preserve existing exercise completion behavior.

**Never:** Do not count client state, XP, analytics, or a raw exercise attempt as normalized completion; do not add reflection or insight behavior; do not claim clinical benefit.

**Decision:** Use a new Practice-owned normalized completion table and mutation boundary, with RLS and idempotent session deduplication.

</frozen-after-approval>

## Code Map

- `src/screens/ExerciseFlowScreen/useExerciseFlowActions.ts` -- authoritative UI completion boundary after `save(payload, ..., status=completed)` is acknowledged.
- `src/hooks/useExerciseMutation.ts` -- existing durable `exercise_entries` write path and completion timestamp behavior; reuse rather than creating a second exercise save path.
- `src/domains/journey/model/starterPath.ts` -- immutable path and practice lineage to attach to completion.
- `src/domains/journey/data/starterPathProgress.repo.ts` -- existing path progress boundary; do not make it the practice completion store.
- `supabase/migrations/` -- migration source of truth; no normalized practice completion table or `PracticeCompletionV1` contract currently exists.
- `_bmad-output/initiative-happy-product-direction/architecture-happy-product-direction/architecture-happy-product-direction.md` -- AD-2, AD-3, AD-8 define the required normalized contract and idempotency rules.

## Tasks & Acceptance

**Execution:**
- [ ] Add the Practice-owned canonical completion table, RLS, and mutation boundary.
- [ ] Generate one stable practice session at practice start and carry it through acknowledged completion.
- [ ] Deduplicate retries and preserve StarterPath lineage without changing existing exercise content.

**Acceptance Criteria:**
- Given a started StarterPath practice, when completion is durably acknowledged, then one normalized completion contains the authenticated user, stable session ID, practice reference, path lineage, and completion timestamp.
- Given a retry of the same practice session, when completion is acknowledged again, then no duplicate completion evidence is created.
- Given a failed or unsynced write, when the user returns, then the UI does not present the completion as acknowledged or downstream-ready.

## Implementation Notes

- Added the Practice-owned `practice_completions` table with authenticated RLS and a unique `(user_id, practice_session_id)` key.
- Threaded StarterPath session and lineage through the existing exercise-flow route.
- Acknowledged normalized completion only after the existing `exercise_entries` save succeeds.

## Plan Change Log

## Review Triage Log

## Verification

**Commands:**
- `git diff --check` -- passed.
- `npx oxlint src/domains/practice/data/practiceCompletion.repo.ts src/screens/ExerciseFlowScreen/useExerciseFlowActions.ts src/screens/ExerciseFlowScreen/ExerciseFlowRunner.tsx src/screens/ExerciseFlowScreen/ExerciseFlowScreen.tsx src/domains/journey/model/starterPath.ts src/screens/StarterPathScreen/StarterPathScreen.tsx` -- passed with existing complexity warnings only.

**Manual checks (if no CLI):**
- Complete one StarterPath practice, retry it, reload, and confirm one acknowledged completion remains available for downstream consumers.

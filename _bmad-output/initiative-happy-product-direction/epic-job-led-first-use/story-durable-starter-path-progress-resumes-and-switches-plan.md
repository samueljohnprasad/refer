---
title: 'Durable starter path progress resumes and switches safely'
type: 'feature'
ticket: 3
created: '2026-10-12'
status: 'in-progress'
baseline_revision: '656f03223e38af81c8ddd4ecafd74b77135cfeb1'
route: 'full'
route_source: 'manual'
review: ''
review_source: ''
lenses_ran: []
review_loop_iteration: 0
context:
  - '/Users/samuelprasad/Desktop/happy/journals/PRODUCT.md'
  - '/Users/samuelprasad/Desktop/happy/journals/DESIGN.md'
  - '/Users/samuelprasad/Desktop/happy/journals/_bmad-output/initiative-happy-product-direction/architecture-happy-product-direction/architecture-happy-product-direction.md'
  - '/Users/samuelprasad/Desktop/happy/journals/_bmad-output/initiative-happy-product-direction/epic-job-led-first-use/epic-job-led-first-use.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** The starter tracer is currently local and the existing Redux course state is not the durable, versioned `StarterPathV1` contract required for resume and path switching. A returning user can lose the selected next action, and a path change can overwrite progress without an explicit ownership or concurrency rule.

**Approach:** Add the Journey-owned `StarterPathV1` persistence boundary around the existing typed bundle and course progress. Persist one active-path pointer plus per-path progress keyed by user, path, and version. Make completion and switching serialized, revision-aware mutations; preserve old path progress and derive one current next action without moving data across paths.

## Boundaries & Constraints

**Always:** Keep durable ownership under `auth.uid()`/`user.id`; use the existing anonymous session; persist `path_id`, `path_version`, status, last completed step, next action, revision, and timestamps; make retries idempotent; keep existing course/exercise routes reusable; preserve the active path after relaunch and identity linking; keep analytics metadata-only.

**Never:** Add a second guest identity; silently discard or merge path progress; infer a next action from sensitive reflection text; rewrite immutable path definitions; make signup or paywall required; let a stale completion overwrite a newer path switch.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| RESUME | Authenticated or anonymous user has saved active path progress | Same path/version and next action load after relaunch | Retry load without clearing local state |
| SWITCH | User selects another valid path | New path becomes active; prior path progress remains preserved | Reject invalid path/version without changing active pointer |
| COMPLETE | Current step completes with current revision | Progress and next action advance once | Duplicate idempotency key is a no-op |
| STALE_WRITE | Completion uses an old revision after a switch | Completion cannot overwrite the switched path state | Return conflict and reload current progress |

</frozen-after-approval>

## Code Map

- `src/domains/journey/model/starterPath.ts` -- existing typed bundle; extend only with the persistence-facing progress contract.
- `src/domains/journey/state/journeySlice.ts` and selectors -- current in-memory active course/progress state; adapt consumers to the durable active-path result without removing existing course state.
- `hooks/journey/useActiveCourse.ts` and `hooks/journey/useJourneyMap.ts` -- current course selection and progress loading; use the Journey persistence boundary as the source for active path state.
- `hooks/data/useCompleteOnboarding.ts` -- existing completion boundary; seed the selected starter path after onboarding without making completion depend on a second identity.
- `supabase/migrations/` and `supabase/functions/` -- add the Journey-owned table/RPC boundary with RLS and revision-aware mutations.
- `supabase/functions/database.types.ts` -- update generated database types for the new persistence contract.

## Tasks & Acceptance

**Execution:**

- [ ] Add `user_starter_path_progress` and the active-path pointer to Supabase with `auth.uid()` ownership, unique `(user_id, path_id, path_version)`, revision, and RLS.
- [ ] Add typed read/switch/complete operations with idempotency and compare-and-swap behavior; return the current next action from Journey.
- [ ] Connect onboarding, active-course loading, and resume selectors to the durable state while preserving existing direct course routes.
- [ ] Preserve inactive path progress and make invalid/stale mutations retryable without clearing data.

**Acceptance Criteria:**

- Given saved starter progress, when the user relaunches, then the same path/version and next action are restored.
- Given progress on path A, when the user switches to valid path B, then B becomes active and A remains readable with its prior progress.
- Given a current revision, when a step completes twice with the same idempotency key, then progress advances once and the same next action is returned.
- Given a stale revision after a switch, when completion is attempted, then the write is rejected without overwriting the active path and the caller can reload.
- Given an anonymous user who later links identity, when progress reloads, then rows remain owned by the same effective Supabase user id.

## Implementation Notes

- Added the user-owned `user_starter_path_progress` schema with RLS and an `active_path_id` pointer on `user_preferences`.
- Added the typed `StarterPathProgressV1` model and updated the checked-in database types.
- Added the Journey repository with resume reads, active-path updates, and revision compare-and-swap writes; the starter tracer now restores goal/lesson/practice state after relaunch.
- Added persisted idempotency-key handling so replayed completion requests are no-ops.
- Added a reusable `useStarterPathProgress` hook for resume, reload, and future path switching.
- Added a Home next-action card that reads the durable starter progress and opens the linked practice while leaving the existing Journey catalog reachable.
- Fixed path switching so returning to an existing path reads its saved progress instead of resetting it.
- Connected the active-path pointer to resume loading and onboarding completion so the durable record becomes the source of truth after activation.
- Moved completion idempotency and revision compare-and-swap into the Supabase RPC `complete_starter_path_step` so concurrent devices cannot both advance the same step.
- Normalized the RPC's stale-revision error into the repository's `{ conflict: true }` result so callers can reload and retry without treating a concurrency race as an unknown failure.
- A visible multi-path switcher remains intentionally unimplemented because the approved product bundle currently contains only one path; the plan remains `in-progress` pending a second authored path.

## Plan Change Log

## Review Triage Log

## Design Notes

Resume should feel quiet and obvious: show the active path's next action first, keep switching reversible, and avoid exposing database or conflict language in the user-facing surface. Use existing Journey visual primitives and sentence-case copy.

## Verification

**Commands:**

- `npm run types` -- expected: generated Supabase types include the new table/RPC contract.
- `npx tsc --noEmit --pretty false` -- expected: no new errors in touched Journey/auth files.
- `git diff --check` -- expected: no whitespace errors.

**Manual checks:**

- Relaunch with an anonymous user and verify the active path and next action resume.
- Switch paths, relaunch, and verify both path records remain intact.
- Replay a completion request and simulate a stale revision; confirm no overwrite.
- Link the anonymous identity and verify the same user owns the durable progress.

Runtime evidence: the iPhone 17 completed the authored anxious-thoughts lesson, created the remote progress row at revision 1, returned Home with `YOUR NEXT ACTION`, and showed the same card after relaunch. Multi-path switching, duplicate replay, stale revision, and identity-link verification remain pending because only one authored path is available in the approved bundle.

---
title: 'One sitting, one row, one count on Home'
type: 'feature'
ticket: '1'
created: '2026-11-15'
status: 'built'
baseline_revision: '4edcd5ebce422cef296a278aef82c6441de63cef'
route: 'full'
route_source: 'auto'
risk: 'high'
review: 'quick'
review_source: 'pinned'
lenses_ran: ['quick']
review_loop_iteration: 0
context: ['_bmad-output/initiative-happy-product-direction/architecture-engagement-logging/architecture-engagement-logging.md']
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** A Thought Catcher sitting writes with no id, so any later write to it would create a second row, and Home's ring and lifetime count come from a phone-local cache while Practice counts Supabase rows, so the two can disagree.

**Approach:** The wizard creates one client-side entry id and one local `selected_date` at sitting start and passes both on every write. Two pure rules (`entryRung`, `countsAsPractice`) and a `usePracticeCounts` hook read completed `exercise_entries` rows; Home's ring and count read that hook.

## Boundaries & Constraints

**Always:** Rules in `src/domains/exercises/domain` are pure: no React, no I/O, no clock read (`now` is an argument). A day or week bucket uses `selected_date` only (AD-25). The week is Monday to Sunday local. Practice is any row of any exercise type with status `completed`, `summary` or `checker_completed`; `in_progress` and `draft` never count (AD-16). Query key is `["practice_counts", userId]`, disabled with no user. The saved response shape and `schema_version` stay unchanged. No shadows, no XP, no streak.

**Never:** No `trap` field, trap step, step-up, draft storage or outbox (stories 3, 4, 6). No change to `happy.reflections` writes or the reflection card. No week-leaf, garden or per-topic counts (stories 8, 9). No change to Thought Reframing or the generic flow. No new dependency.

**Decisions (human, 2026-11-15):** Guests can write `exercise_entries` (anonymous sign-in is on and policy allows it). Built directly on `main` with a dirty working tree, no branch.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Finish a sitting | One wizard run | One row; id and `selected_date` equal those at sitting start; Home ring and count rise by one on return | A failed save is swallowed as today; no count moves |
| Retry or second write, same sitting | Same id | Upsert of the same row, count unchanged | None |
| Mixed rows | completed breathing, `summary` legacy, `in_progress` fear ladder | First two count, third does not | None |
| Week edge | Row `selected_date` is Sunday, now is Monday | Counts in lifetime, not this week | None |
| No user or loading | `user.id` undefined | Hook disabled; Home shows 0 and 0 | None |
| Ring over goal | thisWeek is 5 | Ring receives min(5, `WEEKLY_GOAL`) | None |
| Null `selected_date` | Legacy row | Counts in lifetime, never this week | None |

</frozen-after-approval>

## Code Map

- `src/domains/thoughtCatcher/ui/containers/ThoughtCatcherContainer.tsx` -- mount at `:24` starts a sitting; `finish` at `:85-91` calls `save(buildEntryPayload(draft))` with no id. Add `useState(() => randomUUID())` and `useRef(new Date())`.
- `src/domains/thoughtCatcher/data/buildEntryPayload.ts` -- already takes `now: Date`, uses local `ymd(now)` for `selected_date`; pass the sitting start. Do not change the payload shape.
- `src/hooks/useExerciseMutation.ts` -- `save(payload, id)` upserts by id (`:51-53`); `onSuccess` invalidate list at `:73-81` lacks `practice_counts`. Reuse; add the key only.
- `src/screens/StarterPathScreen/StarterPathScreen.tsx:4` -- `import { randomUUID } from "expo-crypto"`; reuse that import.
- `src/hooks/insights/useExerciseStats.ts:63-93` -- copy the `useAuth` / `supabase` / `useQuery` pattern (`@/src/context/AuthContext`, `@/src/network/auth/supabase`, `"exercise_entries" as any`).
- `src/domains/home/ui/containers/HomeContainer.tsx` -- `lifetimeCount`/`weeklyCount` are `useState` fed by `getReflectionCount`/`getWeeklyCount` at `:34-35, :48-51`; props go on to `HomeSceneHeader`, `ReflectionsSection`, `AccountSheet` unchanged. Keep `getMostRecent`.
- `src/domains/home/data/reflectionsStorage.ts` -- keep `WEEKLY_GOAL`, `getMostRecent`, `appendReflection`; leave the two count functions as unused exports.
- `src/types/exerciseFlow.ts:31,109,283` -- `ExerciseType`, `ExerciseStatus`, `ExerciseEntry`; import as `import type` only.
- `src/domains/exercises/{domain,ui/containers}` -- exist; domain files import types relatively or with `import type`.
- Jest: `package.json` has `preset: jest-expo`, no alias mapping; `@types/jest` absent, so tests import from `@jest/globals`; run with `npx jest <path>`.

## Tasks & Acceptance

**Execution:**
- [ ] `src/domains/exercises/domain/practice.ts` -- add `entryRung(entry)`, `countsAsPractice(entry)`, `practiceCounts(entries, now)` returning `{ lifetime, thisWeek }`, and `weekBoundsYmd(now)` -- one pure source for the rules
- [ ] `src/domains/exercises/domain/practice.test.ts` -- table tests for both rules and the week edge, mixed-status and null-date rows -- the story's two required rule tests
- [ ] `src/domains/exercises/ui/containers/usePracticeCounts.ts` -- `useQuery` on completed-status rows (select only `exercise_type,status,selected_date`, never `response`), key `["practice_counts", user?.id]`, enabled on user, returns counts via `practiceCounts(rows, new Date())`
- [ ] `src/hooks/useExerciseMutation.ts` -- add `["practice_counts"]` to `onSuccess` invalidations
- [ ] `src/domains/thoughtCatcher/ui/containers/ThoughtCatcherContainer.tsx` -- generate id and start date at mount; `save(buildEntryPayload(draft, startedAt), entryId)`
- [ ] `src/domains/home/ui/containers/HomeContainer.tsx` -- replace the two count states with `usePracticeCounts`; pass `data?.lifetime ?? 0` and `Math.min(data?.thisWeek ?? 0, WEEKLY_GOAL)`; drop the count calls from `refresh`

**Acceptance Criteria:**
- Given a finished Thought Catcher sitting, when it is saved, then exactly one `exercise_entries` row exists whose id is the one generated at sitting start.
- Given Home is mounted, when the user returns from a finished sitting, then ring and lifetime count increase by one without restarting.
- Given the rule tests, when `npx jest practice` runs, then every table case passes.
- Given a user with no session, when Home renders, then it shows 0 and 0 and does not throw.

## Implementation Notes

## Plan Change Log

## Review Triage Log

Pass 1 (quick lens): 0 high, 0 medium, 1 low (rejected), 3 false/rejected. No patches, no loopback.

| Finding | Verdict | Route | Evidence |
|---|---|---|---|
| `useExerciseMutation.ts:77-78` extra `exercise_in_progress` / `exercise_entry_status` invalidations | false | rejected | Not this story's change: those two lines were added in the earlier Practice review fix, before baseline `4edcd5eb`, so they show in the diff only because the baseline predates them. The story added only `practice_counts`. |
| `usePracticeCounts.ts` fetches all rows, PostgREST default cap about 1000 | low | rejected | Real only past about 1000 completed exercises for one user; `useCBTHistory` and `useExerciseStats` have the same shape. The fix (server-side head counts or paging) adds a second query and branches. |
| `practice.ts:26-27` `ExerciseType \| string` collapses to `string` | low | rejected | Cosmetic; the rule compares string literals and legacy rows can carry other values, so narrowing risks type errors for no behaviour gain. |
| No test for the ring-over-goal row (`Math.min` in `HomeContainer.tsx:39`) | false | rejected | The product owner said not to write tests (2026-11-15); the plan's manual checks cover the ring on a device. |

## Design Notes

`entryRung` here only needs to be total for this story (thought_catcher with a non-empty trimmed `balancedThought` → 3, without → 2, thought_reframing → 4, else null); it is exported now because the later stories import it.

```ts
countsAsPractice({ status: 'completed', exercise_type: 'box_breathing' }) // true
countsAsPractice({ status: 'in_progress', exercise_type: 'fear_ladder' })  // false
```

## Verification

**Commands:**
- `npx jest src/domains/exercises/domain/practice` -- expected: all tests pass
- `npx tsc --noEmit -p . 2>&1 | grep -E 'domains/(exercises|thoughtCatcher|home)|useExerciseMutation'` -- expected: no output for touched files

**Manual checks (if no CLI):**
- On a device: finish a Thought Catcher sitting; in Supabase exactly one new row with the generated id; Home's ring and count rise by one.

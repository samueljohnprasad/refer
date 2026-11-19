---
title: 'Week leaf from completed exercises and mood logs'
type: 'feature'
ticket: '8'
created: '2026-11-16'
status: 'built'
baseline_revision: '4edcd5ebce422cef296a278aef82c6441de63cef'
route: 'full'
route_source: 'auto'
risk: 'medium'
lenses_ran: ['quick']
review_loop_iteration: 0
review: 'quick'
review_source: 'pinned'
context: ['_bmad-output/initiative-happy-product-direction/architecture-engagement-logging/architecture-engagement-logging.md']
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** The week strip counts any exercise row from the last 7 days by `created_at`, including unfinished ones, and ignores mood logs, so a day you logged a mood shows empty.

**Approach:** One hook, `useWeekShowedUp`, returns the local Monday to Sunday days that have a completed exercise or a mood log, bucketed by `selected_date`. The strip and the Practice mood chart read it.

## Boundaries & Constraints

**Always:** AD-16/AD-25: week is Monday to Sunday in local time via `weekBoundsYmd`; a day is filled by an `exercise_entries` row that `countsAsPractice` or by a `moods` row; an in-progress row never fills a day. Mood `selected_date` may be a UTC ISO timestamp (the emotion logger writes one) or a plain `YYYY-MM-DD`; a timestamp is converted to its local day before bucketing. Query key `["week_showed_up", userId]`, invalidated by the exercise save and by the mood log (which also invalidates `practice_counts`). The strip starts on Monday, shows seven empty rings when nothing is logged, and its image label names each logged day. Presence only, never a streak or a count of missed days. The Practice mood chart week starts on Monday and marks days from the same set.

**Never:** No story 5 items (`moodBand`, `isHardEntry`, saved card). No change to how moods are written or read elsewhere. No tests, new keys, dependency or commit.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Mood only | Mood logged, no exercise | That day filled at once | None |
| In-progress row | `status: in_progress` | Day not filled | None |
| Completed row | `completed`, `selected_date` today | Day filled | None |
| Monday start | Any weekday | Strip runs Mon to Sun | None |
| Late-night mood | UTC timestamp falls on another local day | Filled on the local day | None |
| Nothing logged | No rows | Seven empty rings, no "0 days" | Query error: empty strip |

</frozen-after-approval>

## Code Map

- `src/screens/ExercisesScreen/hooks/useWeekPracticeDays.ts` -- rolling 7 days by `created_at`, offsets set; replace with `src/domains/exercises/ui/containers/useWeekShowedUp.ts` and delete the old file.
- `src/domains/exercises/domain/practice.ts` -- reuse `weekBoundsYmd`, `countsAsPractice`; add pure `localDay(selectedDate)` and `showedUpDays(entries, moodDates, now)`.
- `src/domains/exercises/ui/presentation/components/WeekPresenceStrip.tsx` -- rework to take `days` (7 local YMD + flags); Monday start.
- `src/screens/ExercisesScreen/ExercisesScreen.tsx:22,44,146` -- swap hook and props.
- `src/hooks/insights/useMoodWeek.ts` + `src/screens/InsightsScreen/domain/moodWeek.ts` -- `practicedOffsets` becomes `showedUp: Set<string>` keyed `yyyy-MM-dd`; `InsightsScreen.tsx:61-62` week starts Monday.
- `src/hooks/useExerciseMutation.ts:80`, `hooks/data/useEmotionLogger.tsx:166-188` -- add invalidations.

## Tasks & Acceptance

**Execution:**
- [ ] `practice.ts` -- `localDay`, `showedUpDays`
- [ ] `useWeekShowedUp.ts` -- query both tables for the week window, key `["week_showed_up", userId]`
- [ ] `WeekPresenceStrip.tsx`, `ExercisesScreen.tsx` -- Monday strip from the set
- [ ] `moodWeek.ts`, `useMoodWeek.ts`, `InsightsScreen.tsx` -- chart from the set, Monday start
- [ ] `useExerciseMutation.ts`, `useEmotionLogger.tsx` -- invalidations
- [ ] delete `useWeekPracticeDays.ts`

**Acceptance Criteria:**
- Given a mood logged on a day with no exercise, when the strip renders, then that day is filled.
- Given an in-progress exercise row, when the strip renders, then no day is filled by it.
- Given any date, when the strip renders, then it starts on Monday.
- Given the Practice mood chart, when a day has a completed exercise, then it is still marked.
- Given the app builds, when `npx tsc --noEmit` runs, then no new error appears in touched files.

## Verification

**Commands:**
- `npx tsc --noEmit -p . 2>&1 | grep -E 'WeekPresence|useWeekShowedUp|moodWeek|useMoodWeek|practice.ts|ExercisesScreen|InsightsScreen|useEmotionLogger|useExerciseMutation'`

**Manual checks (no device available):** log a mood, strip fills; leave an exercise unfinished, nothing fills.

## Review Triage Log

Pass 1 (quick lens): 0 high, 0 medium, 2 questions. No loopback.

| Finding | Verdict | Route | Evidence |
|---|---|---|---|
| `moods.selected_date` type unconfirmed, may mis-bucket late-night logs | question | resolved | Timeline RPC migration applies `AT TIME ZONE` to `jr.selected_date`, so it is `timestamptz` and returns an offset; `localDay` is correct. A plain-day writer would be read as UTC midnight, accepted. |
| `daily_moods` view may group by UTC day, so a late-night chart value and leaf could differ | question | open | The view is not in this repo; confirm its timezone with the backend. Not changed here. |

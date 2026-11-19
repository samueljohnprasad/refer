---
title: 'Practice and garden on the shared count'
type: 'feature'
ticket: '9'
created: '2026-11-16'
status: 'built'
baseline_revision: '4edcd5ebce422cef296a278aef82c6441de63cef'
route: 'full'
route_source: 'auto'
risk: 'medium'
review: 'quick'
review_source: 'pinned'
lenses_ran: ['quick']
review_loop_iteration: 0
context: ['_bmad-output/initiative-happy-product-direction/architecture-engagement-logging/architecture-engagement-logging.md']
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Practice counts `status = 'completed'` rows from its own query, so it disagrees with Home's count, and its belief, timeline and recommendation readers treat a catch with no fairer thought as a flat before-and-after line.

**Approach:** `usePracticeCounts` also returns per-topic counts. Practice stats, the baseline pots and the by-topic plots read it. A new growth step animates once on the next visit. The belief, recommendation and timeline readers skip catch-only entries and treat a missing `postIntensity` as no after-rating.

## Boundaries & Constraints

**Always:** AD-16: one filter, `countsAsPractice`; `usePracticeCounts` (key `["practice_counts", userId]`) returns `lifetime`, `thisWeek` and `byTopic: Record<ExerciseCategory, number>` from the same rows, by `EXERCISE_CATEGORY_MAP`; it still never selects `response`. The Practice unlock gate (fewer than 3 practices shows the pots), the "exercises done" stat and each topic plot count come from it. A topic with no practice keeps the dashed ring and "Not tried yet"; a paused entry keeps its 40% leaf. Growth: the number of leaves seen per topic and the pot count are kept in AsyncStorage (`@happy/garden_seen_v1`); on a Practice visit any leaf or plant above the seen number animates once (scale in, staggered 160 ms per plant), then the seen numbers are written. First ever visit, and Reduce Motion, show settled frames with no animation. A plot never wilts, shrinks, greys or resets. AD-13: a catch-only entry is a `thought_catcher` row whose `entryRung` is 2; belief decay and the timeline rating extractor skip it, and a `thought_catcher` row without `postIntensity` has no after-rating (no flat line, no pre-as-post fallback). The Practice error line stays when counts fail; never the baseline garden. Decided: `useExerciseRecommendation` is left unchanged (catch-only entries still count as catches there); "exercises done" and "done before noon" are both lifetime, so the time-range picker no longer changes them.

**Never:** No change to how rows are written, to `useExerciseStats`'s query, `usePersonalEffectiveness`, My Log's week strip or Home. No streak or missed-day copy. No new locale keys beyond defaultValue strings already used, no tests, dependency or commit.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Counts agree | A catch-only save and a breathing session | Home and Practice show the same lifetime count | None |
| Growth | Topic count rises since last visit | Newest leaf animates once, then settled on later visits | Seen write fails: settled, may repeat |
| First visit | No seen record | Settled, no animation | None |
| Reduce Motion | Setting on | Settled frames only | None |
| Catch-only | Rung-2 thought catcher | Absent from belief chart and timeline before/after | None |
| Unrated after | Rung 3 without `postIntensity` | Belief chart and timeline show no after-rating | None |
| Counts fail | Query error | Existing error line | Never the baseline garden |

</frozen-after-approval>

## Code Map

- `src/domains/exercises/domain/practice.ts` -- add `byTopic` to `practiceCounts` using `EXERCISE_CATEGORY_MAP` (`src/data/exerciseCategoryMap.ts`); add `isCatchOnly(type, response)` from `entryRung`.
- `src/domains/exercises/ui/containers/usePracticeCounts.ts` -- no query change, result gains `byTopic`.
- `src/hooks/insights/useInsightsOverview.ts` -- `lifetimeExercises`, `totalExercises` and category `count` from `usePracticeCounts`; loading and error include it.
- `src/screens/InsightsScreen/InsightsScreen.tsx:96,131-134` and `PracticeEmptyState.tsx` -- gate, pots and plots on the shared counts; plots and pots animate only above the seen number.
- `src/domains/exercises/data/gardenSeen.ts` (new) and a small hook beside the counts -- read the snapshot once per visit, write after; AsyncStorage try/catch like `introSeen.ts`.
- `src/hooks/insights/useBeliefDecay.ts:55-95` -- skip catch-only and `thought_catcher` rows with no `postIntensity`; no `?? preIntensity` fallback for them.
- `src/screens/ExercisesScreen/hooks/useExerciseTimeline.ts:47-75` -- `extractRatings` returns `{}` for a catch-only row.
- Reuse: `useReducedMotion`, `PracticeEmptyState`'s `Plant`. Do not touch `useExerciseStats.ts`, `usePersonalEffectiveness.ts` (`thought_catcher` has no `PRE_POST_FIELDS` entry, so it already ignores catches).

## Tasks & Acceptance

**Execution:**
- [ ] `practice.ts`, `usePracticeCounts.ts` -- per-topic counts, `isCatchOnly`
- [ ] `useInsightsOverview.ts`, `InsightsScreen.tsx`, `PracticeEmptyState.tsx` -- read the shared counts
- [ ] `gardenSeen.ts` and hook, tiles and pots -- animate new growth once
- [ ] `useBeliefDecay.ts`, `useExerciseTimeline.ts` -- skip catch-only, no after-rating when missing

**Acceptance Criteria:**
- Given a catch-only save and a breathing session, when Home and Practice are compared, then their lifetime counts match and the right topic plots gain a leaf.
- Given a topic gained a leaf since the last visit, when Practice opens twice, then that leaf animates the first time only, and not under Reduce Motion.
- Given a catch-only entry, when the belief chart and My Log render, then no flat line or before-and-after shows for it.
- Given the app builds, when `npx tsc --noEmit` runs, then no new error appears in touched files.

## Implementation Notes

## Plan Change Log

## Review Triage Log

Pass 1 (quick lens): 0 high, 3 medium patched, 2 low (1 patched, 1 rejected), 1 low rejected. No loopback.

| Finding | Verdict | Route | Evidence |
|---|---|---|---|
| Reduce Motion not honoured on first frames, new leaves and plants shrink before the setting resolves | medium | patch | Both start settled and animate only after `isReduceMotionEnabled()` resolves false. |
| Seen snapshot written from stale cached counts, so a leaf animates twice | medium | patch | The screen passes counts to `useGardenSeen` only when not fetching. |
| `isCatchOnly` hard-coded `completed`, so paused catcher rows lost their before-rating in My Log | medium | patch | It takes the row status; the timeline passes it. |
| Fresh plant ends tilted -3 degrees while settled plants sit at 0 | low | patch | A closing timing returns sway to the settled value. |
| "Done before noon" uses completed-only rows, the total includes legacy `summary` rows | low | rejected | Only legacy rows differ; the fix needs a second query for a cosmetic gap. |
| `byTopic` drops unmapped types | low | rejected | `ExerciseType` is a closed record in `EXERCISE_CATEGORY_MAP`, every type is mapped. |

## Verification

**Commands:**
- `npx tsc --noEmit -p . 2>&1 | grep -E 'practice.ts|usePracticeCounts|useInsightsOverview|InsightsScreen|PracticeEmptyState|gardenSeen|useBeliefDecay|useExerciseTimeline|useExerciseRecommendation'` -- expected: no output for touched files

**Manual checks (no device available):** catch-only save plus a breathing session, then compare Home and Practice.

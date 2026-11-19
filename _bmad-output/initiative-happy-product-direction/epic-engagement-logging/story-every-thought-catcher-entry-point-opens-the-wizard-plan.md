---
title: 'Every Thought Catcher entry point opens the wizard'
type: 'feature'
ticket: '7'
created: '2026-11-15'
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

**Problem:** Only Home opens the new Thought Catcher wizard. Lessons, the resume row, the assistant and the starter path still open the generic flow, whose `thought_catcher` config writes nothing, so those sittings save no entry.

**Approach:** `buildExerciseRoute` becomes the single redirect: `thought_catcher` goes to the wizard unless `readOnly` is set, which keeps the generic flow for history. The assistant and starter-path hardcoded routes use it. The wizard reads starter-path params and calls the practice-completion adapter once, on its first successful write, only when launched with them.

## Boundaries & Constraints

**Always:** AD-12: one runtime for new sittings; the generic-flow `thought_catcher` config stays untouched for read-only history. Starter-path params are `practiceSessionId`, `pathId`, `pathVersion`, `practiceSource`, `practiceId`; the adapter call needs all of them plus a signed-in user id, and is skipped otherwise. The call happens after a successful `save`, once per sitting (ref guard); it is never made from the failure path. Home-launched sittings write no completion record. `buildExerciseRoute` forwards the starter-path params to the wizard when present.

**Never:** No change to wizard step logic, `buildEntryPayload`, the generic flow (`src/screens/ExerciseFlowScreen/*`, `useExerciseFlowActions.ts`), `practiceCompletion.repo.ts`, or `thought_reframing` routing. No new `practiceSessionId` generation in `StarterPathNextActionCard` (it writes no completion today and keeps that behaviour). No tests, no new dependency, no commit.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Any entry point | Lessons, resume row, discovery, practice-next, assistant, starter path, type `thought_catcher` | Opens `/tabs/screens/thought-catcher` | None |
| Past entry | `readOnly` true with an `entryId` | Opens the generic flow read-only | None |
| Other exercise types | Any other type | Route unchanged | None |
| Path-launched sitting | All starter-path params and a user | First successful trap write also upserts one practice completion; re-answering adds none | Failed save: no call |
| Home-launched sitting | No path params | Entry written, no completion call | None |
| Guest | No user id | Entry write attempted as today; no completion call | None |

</frozen-after-approval>

## Code Map

- `src/screens/ExercisesScreen/exerciseScreenUtils.ts:56-66` -- `buildExerciseRoute` always returns the generic flow; add the `thought_catcher` branch (not when `readOnly`), forwarding practice params. Callers already use it: `LessonsChatPicker.tsx:127`, `ExercisesScreen.tsx:87`, `JumpBackInRow.tsx:33`, `ExerciseDiscoveryCards.tsx:39`, `PracticeNextCard.tsx:13`.
- `src/components/happy-assistant/constants.ts:24-25` -- hardcoded generic route for `thoughtCatcherExercise`; used at `useHappyAssistantCommandExecutor.tsx:136`. Replace with the builder.
- `src/screens/StarterPathScreen/StarterPathScreen.tsx:121,128-137` and `StarterPathNextActionCard.tsx:15-24` -- push `/tabs/screens/exercise-flow` directly with `type: practice.id`; route `thought_catcher` through the builder, keep other types as they are. Only the screen generates `practiceSessionId`.
- `src/utils/exerciseJourneyBridge.ts:23` -- builds a generic route per `config.type`; check callers, route `thought_catcher` through the builder if it can reach it.
- `src/domains/home/ui/containers/HomeContainer.tsx:97-99` -- already pushes the wizard path; leave.
- `app/tabs/screens/(exercises)/thought-catcher.tsx` -- renders the container with no props; keep, params arrive via `useLocalSearchParams` inside the container.
- `src/domains/thoughtCatcher/ui/containers/ThoughtCatcherContainer.tsx:104-111` -- `onTrap` is the first durable write; add the guarded adapter call after a successful save.
- `src/screens/ExerciseFlowScreen/useExerciseFlowActions.ts:109-127` -- reference for the adapter guard (all params + `user.id`); read only.
- `src/domains/practice/data/practiceCompletion.repo.ts:41-70` -- `acknowledgePracticeCompletion({userId, practiceSessionId, pathId, pathVersion, practiceRef:{source,id}})`, upsert on `(user_id, practice_session_id)`; call only.

## Tasks & Acceptance

**Execution:**
- [ ] `exerciseScreenUtils.ts` -- `thought_catcher` branch to the wizard route unless `readOnly`; carry practice params
- [ ] `happy-assistant/constants.ts` -- use the builder for the thought catcher command
- [ ] `StarterPathScreen.tsx`, `StarterPathNextActionCard.tsx` (and `exerciseJourneyBridge.ts` if reachable) -- route `thought_catcher` through the builder, other types unchanged
- [ ] `ThoughtCatcherContainer.tsx` -- read params; after the first successful `save` in `onTrap`, call `acknowledgePracticeCompletion` once when all params and a user exist

**Acceptance Criteria:**
- Given Home, Lessons, the resume row, the assistant or the starter path, when Thought Catcher is started, then the wizard opens.
- Given a past entry opened from My Log, when it renders, then it is read-only in the generic flow.
- Given a path-launched sitting, when the trap step is first saved, then one practice-completion record is written, and none on re-answer; a Home-launched sitting writes none.
- Given the app builds, when `npx tsc --noEmit` runs, then no new error appears in touched files.

## Implementation Notes

## Plan Change Log

## Review Triage Log

Pass 1 (quick lens): 0 high, 3 medium patched, 3 low rejected. No loopback.

| Finding | Verdict | Route | Evidence |
|---|---|---|---|
| Insights cards (`PersonalEffectivenessCard`, `RecommendedForYouCard`, `TriggerClusterCard`) push the generic flow for `thought_catcher` | medium | patch | Real entry points the Code Map missed; now call `buildExerciseRoute`. |
| Assistant `ResumeExercise` uses duplicate `buildExerciseFlowRoute` | medium | patch | Switched to `buildExerciseRoute` in `useHappyAssistantCommandExecutor.tsx`. |
| `shouldHideAssistant` misses `/tabs/screens/thought-catcher` | medium | patch | Added `thought-catcher` to the hide list. |
| In-progress past entry opens a fresh wizard (`entryId` dropped) | low | rejected | The wizard saves only a completed row, so only legacy generic-flow rows are `in_progress`; the generic flow for those writes nothing, so a fresh sitting is no worse. |
| Starter-path next-action card forwards no `practiceSessionId` | low | rejected | The plan accepts it: that card wrote no completion before. |
| Completion-ack ref set after the await is not race-safe | low | rejected | Upsert on `(user_id, practice_session_id)` makes a double call harmless; fixing adds a reset branch. |

## Verification

**Commands:**
- `npx tsc --noEmit -p . 2>&1 | grep -E 'exerciseScreenUtils|happy-assistant|StarterPath|exerciseJourneyBridge|ThoughtCatcherContainer'` -- expected: no output for touched files

**Manual checks (no device available):**
- Start from each entry point and see the wizard; open a past entry and see it read-only; finish a starter-path sitting and see one `practice_completions` row.

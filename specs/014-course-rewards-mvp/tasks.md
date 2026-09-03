# Tasks: Course Rewards MVP

**Feature:** `specs/014-course-rewards-mvp`
**Branch:** `014-course-rewards-mvp`
**Plan:** `specs/014-course-rewards-mvp/plan.md`
**Spec:** `specs/014-course-rewards-mvp/spec.md`

---

## Implementation Strategy

Build foundational infrastructure first (config + Redux + orchestrator), then implement each celebration surface as a complete vertical slice. Each slice is independently verifiable against the quickstart scenarios before moving to the next.

**MVP scope (ship first):** Phase 2 (Foundation) + Phase 3 (US1 — lesson) = proof that the orchestrator works end-to-end.

---

## Phase 2: Foundation (blocking prerequisites — complete before user stories)

> All four user stories depend on this phase. Complete Phase 2 entirely before starting Phase 3–6.

- [x] T001 Create authored rewards config at `src/data/journey/rewardsConfig.ts` — define `RewardsConfig`, `LessonTakeaway`, `UnitRewardContent`, `InsightCardContent`, `CourseRewardContent` interfaces; export `REWARDS_CONFIG` constant with placeholder data for the Sleep Reset course; export `FALLBACK_TAKEAWAY` and `FALLBACK_ACKNOWLEDGEMENT` string constants; add `console.warn` gap-detection for every missing field

- [x] T002 Add `pendingCelebration: Record<string, 'lesson' | 'unit' | 'course' | null>` field to `JourneyState` interface and initialise to `{}` in `journeySlice.ts` at `src/domains/journey/state/journeySlice.ts`

- [x] T003 Add `courseFinaleSeenByCourse: Record<string, boolean>` field to `JourneyState` interface and initialise to `{}` in `journeySlice.ts` at `src/domains/journey/state/journeySlice.ts`

- [x] T004 Add `setPendingCelebration(state, { courseId, level })` reducer action to `journeySlice.ts` at `src/domains/journey/state/journeySlice.ts`

- [x] T005 Add `markCourseFinaleSeen(state, { courseId })` reducer action that sets `courseFinaleSeenByCourse[courseId] = true` and persists the key `@rewards/finaleSeen/${courseId}` to AsyncStorage in `src/domains/journey/state/journeySlice.ts`

- [x] T006 [P] Add `selectPendingCelebration(state, courseId)` memoised selector returning `pendingCelebration[courseId] ?? null` to `src/domains/journey/state/journeySelectors.ts`

- [x] T007 [P] Add `selectCourseFinaleSeen(state, courseId)` memoised selector returning `courseFinaleSeenByCourse[courseId] ?? false` to `src/domains/journey/state/journeySelectors.ts`

- [x] T008 Create `useCelebrationOrchestrator` hook at `src/domains/journey/rewards/useCelebrationOrchestrator.ts` — accepts `courseId: string`; exposes `handleCompletionResult(result: CompleteNodeResponse): void` that dispatches `setPendingCelebration` with level `'course'` when `courseCompleted`, `'unit'` when `unitCompleted`, else `'lesson'`; never throws (errors caught and logged)

---

## Phase 3: US1 — Lesson Completion Celebration

> **Story:** When a learner completes a required lesson for the first time, a short celebration surface appears with the lesson takeaway. Replaying a lesson shows no new celebration. (FR-1, SC-1)
>
> **Independent test:** Complete any lesson → `LessonCompleteSheet` appears with authored takeaway text and "Back to path" CTA. Replay same lesson → no sheet. Complete a lesson that also finishes a unit → `LessonCompleteSheet` is NOT shown (unit surface takes precedence).

- [x] T009 [P] [US1] Upgrade `LessonCompleteSheet.tsx` at `src/domains/journey/ui/components/LessonCompleteSheet.tsx` — add `takeaway: string` prop; replace old XP/points summary with takeaway text component (keep animated checkmark, haptics, and 'CONTINUE' button); update `LessonCompleteSheetProps` and `useLessonCompleteSheetViewModel.ts` to pass through `takeaway` instead of `xpEarned`

- [x] T010 [P] [US1] Update `useLessonCompleteSheetViewModel.ts` at `src/domains/journey/ui/hooks/useLessonCompleteSheetViewModel.ts` — remove `xpEarned`, keep `takeaway`, maintain `handleContinue` dismiss logic and haptics

- [x] T011 [US1] Wire lesson celebration into `useJourneyMapController.tsx` at `src/domains/journey/ui/hooks/useJourneyMapController.tsx` — when `pendingCelebration === 'lesson'`: look up `REWARDS_CONFIG.lessonTakeaways[nodeId]` (log warning if absent, use default); expose `pendingTakeaway`; expose `dismissLessonCelebration` (dispatches `setPendingCelebration(null)`)

- [x] T012 [US1] Render `LessonCompleteSheet` in `JourneyMapView.tsx` at `src/domains/journey/ui/JourneyMapView.tsx` — conditionally mounted when `pendingCelebration === 'lesson'`; pass `takeaway` from controller; `onContinue` calls `dismissLessonCelebration`

---

## Phase 4: US2 — Insight Chest

> **Story:** Tapping an available chest (a backend-provided chest-type node) triggers a reveal animation and shows an authored Insight Card. Claim is durable and idempotent. Tapping the claimed chest reopens the card without re-granting. (FR-2, SC-2, SC-3, SC-4)
>
> **Independent test:** Tap available chest → Opening animation plays → Insight card sheet shows authored title + body → dismiss → chest renders as Claimed (flat gold, no glow). Force-quit and reopen → chest still Claimed. Tap claimed chest → same card reopens, no new claim fires.


- [ ] T015 [US2] Upgrade `ChestRewardModal.tsx` at `src/domains/journey/ui/components/ChestRewardModal.tsx` — add `insightCard: InsightCardContent | null` prop; when non-null, display `insightCard.title` and `insightCard.body` in place of hardcoded "Treasure Chest!" / "You've found a chest!" text; when null, show fallback text and log `[rewards] missing insightCard for unit`; when `node.status === 'completed'`, hide Claim button and show "Back to path" only (read-only revisit mode)

- [ ] T016 [US2] Wire insight card into `useJourneyMapController.tsx` at `src/domains/journey/ui/hooks/useJourneyMapController.tsx` — when `rewardNode` is set, look up `REWARDS_CONFIG.unitRewards[unitId]?.insightCard ?? null` (using `rewardNode.unitId`) and expose as `activeInsightCard`; pass to `ChestRewardModal`

---

## Phase 5: US3 — Unit Trophy

> **Story:** Completing the final required node of a unit automatically awards a unit trophy, shows the unit-complete surface with the capability statement, and permanently displays the trophy on the journey map. Tapping the trophy reopens the capability statement. (FR-3, SC-3)
>
> **Independent test:** Complete last node of a unit → `UnitCompleteSheet` appears (not lesson sheet), showing "Unit complete", unit title, and capability statement. Force-quit and reopen → unit divider shows trophy icon. Tap trophy divider → capability message shown, no new trophy granted. Lesson node completed at same time → only unit surface shown.

- [X] T017 [P] [US3] Upgrade `UnitCompleteModal.tsx` at `src/domains/journey/ui/components/UnitCompleteModal.tsx` — add `capabilityStatement: string` prop; replace XP count, lesson count, and checkpoint count display with capability statement text ("You can now…"); keep confetti and trophy scale animation; update `UnitCompleteModalProps` to include `capabilityStatement` and remove `xpEarned`

- [X] T018 [P] [US3] Update `useUnitCompleteModalViewModel.ts` at `src/domains/journey/ui/hooks/useUnitCompleteModalViewModel.ts` — remove `xpEarned` and `lessonCount`/`checkpointCount`/`chestCount` from the return; remove `xpEarned` from `UnitCompleteModalProps`; return `capabilityStatement` passed from the parent prop; keep confetti, trophy animation, and haptic logic

- [X] T019 [US3] Wire unit trophy celebration into `useJourneyMapController.tsx` at `src/domains/journey/ui/hooks/useJourneyMapController.tsx` — when `pendingCelebration === 'unit'`: look up `REWARDS_CONFIG.unitRewards[unitId]?.capabilityStatement` (log warning if absent, use unit title as fallback); expose `pendingUnitId` and `pendingCapabilityStatement`; expose `dismissUnitCelebration` (dispatches `setPendingCelebration(null)`)

- [X] T020 [US3] Render `UnitCompleteModal` in `JourneyMapView.tsx` at `src/domains/journey/ui/JourneyMapView.tsx` — mounted when `pendingCelebration === 'unit'`; pass `capabilityStatement` from controller; `onContinue` calls `dismissUnitCelebration`

- [X] T020b [US3] Create `TrophyNode.tsx` component at `src/domains/journey/ui/components/TrophyNode.tsx` — render the permanent trophy visual for nodes with type `TROPHY`; map this node type in the journey map renderer so it remains visible on the path; on press, dispatch the unit celebration to reopen the capability statement

---

## Phase 6: US4 — Course Completion Finale

> **Story:** Completing the final node of a course shows a full-screen, once-only course finale with the capability summary. If the app closes before the learner sees it, it is restored the next time they navigate to that course's journey map. After dismissal, revisiting the course shows a stable completed state. (FR-4, SC-5, SC-6, SC-7, SC-8)
>
> **Independent test:** Complete final course node → only `CourseFinaleScreen` appears (not lesson or unit sheets). Screen is full-screen (not a bottom sheet). Contains course title, acknowledgement, 3–5 capability bullets, and action CTA. Dismiss → revisit course map → finale does NOT replay. Force-quit before dismissing → revisit course map → finale IS shown once more. Zero surfaces mention symptoms, treatment, perfection, or speed.

- [X] T021 [US4] Create `CourseFinaleScreen` presentational component at `src/domains/journey/ui/screens/CourseFinaleScreen.tsx` — renders full-screen layout with course title, acknowledgement text, capability summary list (3–5 bullet items), "Review Course" action, and "Done" primary CTA; no business logic or Redux access; accepts `{ courseTitle: string; acknowledgement: string; capabilitySummary: string[]; onDismiss: () => void }` props

- [X] T022 [US4] Create Expo Router screen at `app/tabs/screens/(journey)/journey/finale.tsx` — reads `courseId` from params; reads `course` from Redux via `selectCourse`; reads `courseFinaleSeenByCourse[courseId]` via `selectCourseFinaleSeen`; if already seen, calls `router.back()` immediately on mount; dispatches `markCourseFinaleSeen` and calls `router.back()` when user taps Done; reads authored content from `REWARDS_CONFIG.courseRewards[courseId]` (fallback to `FALLBACK_ACKNOWLEDGEMENT` and empty list with warning logged)

- [X] T023 [US4] Add course-finale restore logic to `useJourneyMapController.tsx` at `src/domains/journey/ui/hooks/useJourneyMapController.tsx` — inside `useFocusEffect`: if `courseProgress.status === 'completed'` AND `selectCourseFinaleSeen(courseId) === false`, dispatch `setPendingCelebration({ courseId, level: 'course' })`

- [X] T024 [US4] Wire course finale navigation into `useJourneyMapController.tsx` at `src/domains/journey/ui/hooks/useJourneyMapController.tsx` — in a `useEffect` watching `pendingCelebration`: when value is `'course'`, call `router.push('../journey/finale')` passing `courseId` as param; dispatch `setPendingCelebration(null)` immediately after push to prevent re-trigger

---

## Phase 7: Polish & Cross-Cutting Concerns

- [X] T025 [P] Verify Reduce Motion in all four surfaces — in `LessonCompleteSheet.tsx`, `UnitCompleteModal.tsx`, `ChestRewardModal.tsx`, and `CourseFinaleScreen.tsx`: use `useReduceMotion()` from `react-native-reanimated`; replace spring/particle animations with `withTiming` opacity transitions; confirm no essential information is motion-only

- [X] T026 [P] Add accessibility roles, names, and focus order to all four celebration surfaces — each must have `accessibilityViewIsModal={true}`, `accessibilityRole="dialog"`, a readable `accessibilityLabel` for the primary heading, and a reachable dismiss CTA for VoiceOver users; verify in `LessonCompleteSheet.tsx`, `UnitCompleteModal.tsx`, `ChestRewardModal.tsx`, `CourseFinaleScreen.tsx`

- [X] T027 Populate `REWARDS_CONFIG` with authored content for the Sleep Reset course — fill `lessonTakeaways`, `unitRewards` (insightCard + capabilityStatement per unit), and `courseRewards` in `src/data/journey/rewardsConfig.ts`; verify all `console.warn` gap-detection messages are silent after population

- [X] T028 Audit all strings in `rewardsConfig.ts`, `LessonCompleteSheet.tsx`, `UnitCompleteModal.tsx`, and `CourseFinaleScreen.tsx` for MH safety language — confirm zero occurrences of "conquered", "healed", "cured", "perfect", "fast", symptom scores, or treatment completion claims; verify against FR-4.4 and SC-8

---

## Dependency Graph

```
Phase 2 (T001–T008)
    ├─▶ Phase 3 US1 (T009–T012)   — can start as soon as Phase 2 done
    ├─▶ Phase 4 US2 (T013–T016)   — can start as soon as Phase 2 done [parallel with US1]
    ├─▶ Phase 5 US3 (T017–T020)   — can start as soon as Phase 2 done [parallel with US1, US2]
    └─▶ Phase 6 US4 (T021–T024)   — can start after Phase 5 US3 done (relies on unit trophy state)
        └─▶ Phase 7 Polish (T025–T028)  — after all US phases done
```

## Parallel Opportunities

| Parallelizable Group | Tasks |
|---------------------|-------|
| Foundation selectors | T006, T007 (both read-only, different selectors) |
| Phase 2 Redux reducers | T002, T003 (different state fields); T004, T005 (different actions) |
| US2 chest visuals | T013, T014 (different files: viewmodel vs component) |
| US3 modal upgrade | T017, T018 (different files: component vs viewmodel) |
| Polish | T025, T026 (Reduce Motion vs Accessibility — different concerns) |
| US1+US2+US3 stories | All three phases after Foundation completes |

---

## Task Count Summary

| Phase | Tasks | Story |
|-------|-------|-------|
| Phase 2: Foundation | 8 (T001–T008) | — |
| Phase 3: Lesson Celebration | 4 (T009–T012) | US1 |
| Phase 4: Insight Chest | 4 (T013–T016) | US2 |
| Phase 5: Unit Trophy | 5 (T017–T020b) | US3 |
| Phase 6: Course Finale | 4 (T021–T024) | US4 |
| Phase 7: Polish | 4 (T025–T028) | — |
| **Total** | **29** | |

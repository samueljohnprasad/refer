# Implementation Plan: Course Rewards MVP

**Feature:** `specs/014-course-rewards-mvp`
**Branch:** `014-course-rewards-mvp`
**Status:** Ready for tasks generation

---

## Summary

Happy will add a coherent 4-level reward hierarchy on top of existing journey-map plumbing. The existing `completeNode` edge function already returns `unitCompleted` and `courseCompleted` flags — they are just unused client-side. Chest infrastructure (`ChestNode`, `ChestRewardModal`, claim flow) already exists. Unit complete and lesson completion modal shells already exist. The MVP wires all of it together with authored config content and a celebration orchestrator.

**Technical approach:** Config-driven authored content in a bundled `rewardsConfig.ts` (OTA-updatable) + a minimal celebration orchestrator hook that reads `completeNode` response flags and dispatches the correct celebration level to Redux. No new state library, no new DB tables, no currency, no generalized reward platform.

---

## Technical Context

- **Language/Version:** TypeScript, React Native, Expo Router
- **Primary Dependencies:** Redux Toolkit, RTK Query (`journeyApi`), `react-native-reanimated`, `expo-haptics`, `@expo/ui/swift-ui`, `@gorhom/bottom-sheet`, `@react-native-async-storage/async-storage`
- **Storage:** Supabase (progress) + AsyncStorage (course finale seen flag)
- **Target Platform:** iOS 26+
- **Performance Goals:** Celebration surface must appear within one screen transition of exercise completion; no perceptible delay from reward state loading
- **Constraints:** No new DB tables; no new state management library; authored config must be OTA-updatable; isolated domain module (reads progress, never mutates it)
- **Scale/Scope:** MVP — 4 celebration surfaces, 1 config file, ~6 components/hooks modified or created

---

## Constitution Check

| Rule | Status |
|------|--------|
| No new state library | ✅ PASS — uses existing Redux Toolkit |
| No generalized reward platform | ✅ PASS — minimal orchestrator only |
| No new DB tables | ✅ PASS — all state maps onto existing tables |
| Config-driven (no hardcoded authored copy) | ✅ PASS — `rewardsConfig.ts` |
| Domain isolation (read-only on progress) | ✅ PASS — orchestrator never mutates progress state |
| Fail open on missing config | ✅ PASS — fallback constants defined |
| YAGNI — MVP exclusions enforced | ✅ PASS — no currency, inventory, social, loot |
| SRP — pure UI components | ✅ PASS — contracts enforce no business logic in components |
| Reduce Motion support | ✅ PASS — quickstart scenario 5 |
| MH safety language | ✅ PASS — contracts enforce no symptom/treatment language |

---

## Project Structure (files affected)

```text
src/data/journey/
└── rewardsConfig.ts                    ← NEW — authored config + fallbacks

src/domains/journey/
├── rewards/
│   └── useCelebrationOrchestrator.ts  ← NEW — priority logic hook
├── state/
│   └── journeySlice.ts                ← MODIFY — add pendingCelebration, courseFinaleSeenByCourse
├── ui/
│   ├── components/
│   │   ├── ChestRewardModal.tsx        ← MODIFY — authored insight card content
│   │   ├── LessonCompleteSheet.tsx     ← NEW — lesson takeaway surface
│   │   └── UnitCompleteSheet.tsx       ← MODIFY — capability statement, no XP
│   ├── screens/
│   │   └── CourseFinaleScreen.tsx      ← NEW — full-screen course completion
│   └── hooks/
│       └── useJourneyMapController.tsx ← MODIFY — wire orchestrator, render surfaces

app/tabs/(tabs)/journey/[courseId]/
└── finale.tsx                          ← NEW — Expo Router screen for course finale

specs/014-course-rewards-mvp/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
└── contracts/
    └── reward-contracts.md
```

---

## Implementation Slices (recommended order)

### Slice A — Authored Config

Create `src/data/journey/rewardsConfig.ts` with:
- `RewardsConfig` interface (from `data-model.md`)
- `REWARDS_CONFIG` constant populated for Sleep Reset course (initial authored pass)
- `FALLBACK_TAKEAWAY`, `FALLBACK_ACKNOWLEDGEMENT` exports
- `console.warn` gap-detection for all missing fields

**Verify:** Import in any component, confirm TS compiles, confirm fallbacks log when fields missing.

---

### Slice B — Redux State Additions

Modify `journeySlice.ts`:
- Add `pendingCelebration` and `courseFinaleSeenByCourse` to `JourneyState`
- Add `setPendingCelebration` and `markCourseFinaleSeen` actions
- Add selectors `selectPendingCelebration` and `selectCourseFinaleSeen` to `journeySelectors.ts`
- `markCourseFinaleSeen` action also writes to AsyncStorage

**Verify:** TS compiles; dispatch from React DevTools, confirm state updates.

---

### Slice C — Celebration Orchestrator

Create `src/domains/journey/rewards/useCelebrationOrchestrator.ts`:
- Accepts `courseId`
- Exposes `handleCompletionResult(result: CompleteNodeResponse)`
- Dispatches `setPendingCelebration` with priority: `course > unit > lesson`

**Verify:** Unit-test the priority logic inline (manual console test OK for MVP).

---

### Slice D — Lesson Complete Surface

Create `src/domains/journey/ui/components/LessonCompleteSheet.tsx`:
- `@gorhom/bottom-sheet` BottomSheetModal at ~50% height
- Reads `takeaway` prop (already resolved by parent from config)
- "Back to path" CTA
- Reduce Motion support

Wire into `useJourneyMapController`:
- After `completeNode` resolves, call `handleCompletionResult`
- If `pendingCelebration === 'lesson'`, show `LessonCompleteSheet` with takeaway
- On dismiss, dispatch `setPendingCelebration(null)`

**Verify:** Quickstart Scenario 1.

---

### Slice E — Chest Insight Card

Modify `ChestRewardModal.tsx`:
- Accept `insightCard: InsightCardContent | null` prop
- Show authored title and body; fall back to generic with warning

Add `opening` transient state to `useChestNodeViewModel.ts`:
- On press → set local `isOpening = true` → run shake animation → fire claim
- Add distinct visual for `claimed` (status = completed): flat gold, no glow

Wire into `useJourneyMapController`:
- Pass `insightCard` from config to `ChestRewardModal`

**Verify:** Quickstart Scenario 2.

---

### Slice F — Unit Trophy Surface

Modify `UnitCompleteSheet.tsx` (rename/extend existing `UnitCompleteModal`):
- Accept `capabilityStatement: string` prop
- Display "Unit complete", unit title, capability statement
- Remove XP count, lesson count, checkpoint count display
- Keep confetti + trophy scale animation

Wire into `useJourneyMapController`:
- If `pendingCelebration === 'unit'`, show `UnitCompleteSheet` with capability statement from config

**Verify:** Quickstart Scenario 3.

---

### Slice G — Course Finale Screen

Create `app/tabs/(tabs)/journey/[courseId]/finale.tsx` (Expo Router screen).
Create `src/domains/journey/ui/screens/CourseFinaleScreen.tsx`:
- Full-screen (not a sheet)
- Reads `courseId` from params
- Looks up `courseRewards[courseId]` from config
- If `courseFinaleSeenByCourse[courseId]` is true on mount → `router.back()`
- On dismiss → dispatch `markCourseFinaleSeen` → `router.back()`

Wire into `useJourneyMapController`:
- If `pendingCelebration === 'course'` → `router.push(`.../journey/${courseId}/finale`)`

**Verify:** Quickstart Scenario 4.

---

## Re-evaluation: Constitution Check Post-Design

All checks remain passing. No violations introduced.

## Generated Artifacts

- `specs/014-course-rewards-mvp/research.md`
- `specs/014-course-rewards-mvp/data-model.md`
- `specs/014-course-rewards-mvp/quickstart.md`
- `specs/014-course-rewards-mvp/contracts/reward-contracts.md`
- `specs/014-course-rewards-mvp/plan.md` (this file)

# Interface Contracts: Course Rewards MVP

**Feature:** `specs/014-course-rewards-mvp`
**Branch:** `014-course-rewards-mvp`

---

## Contract 1: Authored Rewards Config

**File:** `src/data/journey/rewardsConfig.ts`
**Runtime access:** synchronous import (bundled, OTA-updateable)

### Access interface

```typescript
import { REWARDS_CONFIG } from '@/src/data/journey/rewardsConfig';

// Lesson takeaway
const takeaway = REWARDS_CONFIG.lessonTakeaways[nodeId]?.takeaway ?? FALLBACK_TAKEAWAY;

// Unit reward
const unit = REWARDS_CONFIG.unitRewards[unitId];
const capabilityStatement = unit?.capabilityStatement;
const insightCard = unit?.insightCard;

// Course reward
const course = REWARDS_CONFIG.courseRewards[courseId];
const capabilitySummary = course?.capabilitySummary ?? [];
const acknowledgement = course?.acknowledgement ?? FALLBACK_ACKNOWLEDGEMENT;
```

### Fallback constants (exported from `rewardsConfig.ts`)

```typescript
export const FALLBACK_TAKEAWAY = "You completed this lesson.";
export const FALLBACK_ACKNOWLEDGEMENT = "Well done completing this course.";
```

---

## Contract 2: Celebration Orchestrator Hook

**File:** `src/domains/journey/rewards/useCelebrationOrchestrator.ts`

```typescript
interface UseCelebrationOrchestratorArgs {
  courseId: string;
}

interface UseCelebrationOrchestratorResult {
  /** Call this after completeNode resolves. */
  handleCompletionResult: (result: CompleteNodeResponse) => void;
}

// Usage (in useJourneyMapController):
const { handleCompletionResult } = useCelebrationOrchestrator({ courseId });
```

### Guarantees
- Dispatches exactly one `setPendingCelebration` per call.
- Priority: `course > unit > lesson`.
- Never throws — all errors are caught and logged.

---

## Contract 3: LessonCompleteSheet Component

**File:** `src/domains/journey/ui/components/LessonCompleteSheet.tsx`

```typescript
interface LessonCompleteSheetProps {
  /** Node that was just completed. null = not shown. */
  node: PathNodeData | null;
  /** Authored takeaway text. Falls back to FALLBACK_TAKEAWAY if empty. */
  takeaway: string;
  /** Dismiss callback — clears pendingCelebration */
  onDismiss: () => void;
}
```

### Guarantees
- Pure presentational — no Redux access, no API calls.
- Respects Reduce Motion (no spring animation if `useReduceMotion()` is true).
- Accessible: `accessibilityRole="dialog"`, correct focus order.

---

## Contract 4: UnitCompleteSheet Component (upgraded)

**File:** `src/domains/journey/ui/components/UnitCompleteSheet.tsx`
*(rename or extend existing UnitCompleteModal)*

```typescript
interface UnitCompleteSheetProps {
  /** Unit that was completed. null = not shown. */
  unit: Unit | null;
  /** Authored "You can now…" capability statement. */
  capabilityStatement: string;
  /** Dismiss callback. */
  onDismiss: () => void;
}
```

### Guarantees
- Does not display XP count, speed, or accuracy.
- Capability statement is displayed verbatim — no runtime text generation.
- If `capabilityStatement` is empty string, logs a warning and shows `unit.title` as a safe fallback.

---

## Contract 5: CourseFinaleScreen

**File:** `src/domains/journey/ui/screens/CourseFinaleScreen.tsx`

```typescript
interface CourseFinaleScreenProps {
  courseId: string;
}
// Receives courseId via Expo Router params: app/tabs/(tabs)/journey/[courseId]/finale.tsx
```

### Guarantees
- Full-screen (not a bottom sheet) to be visually distinctive from lesson/unit surfaces (FR-4.1, SC-6).
- Displays: course title, acknowledgement, capability summary list (3–5 items), action buttons.
- Never claims recovery, symptom elimination, or treatment completion (FR-4.4, SC-8).
- Shown exactly once. On mount, reads `courseFinaleSeenByCourse[courseId]`. If already seen, navigates back immediately.
- On dismiss, dispatches `markCourseFinaleSeen` (persists to AsyncStorage).

---

## Contract 6: ChestRewardModal (upgraded)

**File:** `src/domains/journey/ui/components/ChestRewardModal.tsx`

```typescript
interface ChestRewardModalProps {
  node: PathNodeData | null;
  /** Authored insight card content from rewardsConfig. Null if missing (claim still recorded). */
  insightCard: InsightCardContent | null;
  isClaiming: boolean;
  onClaim: () => Promise<void>;
  onDismiss: () => void;
}
```

### Guarantees
- Shows authored `insightCard.title` and `insightCard.body` when available.
- Falls back to `"Insight"` / `"Keep going!"` if insightCard is null; logs warning.
- Claim is idempotent: button is disabled while `isClaiming` or `node.status === 'completed'`.
- After claim: transitions to read-only view of the same insight card (no re-claiming).

---

## Contract 7: Redux Actions Interface

```typescript
// Dispatch signatures (from journeySlice)

dispatch(setPendingCelebration({ courseId: string, level: 'lesson' | 'unit' | 'course' | null }))

dispatch(markCourseFinaleSeen({ courseId: string }))

// Selectors
selectPendingCelebration(state, courseId): 'lesson' | 'unit' | 'course' | null
selectCourseFinaleSeen(state, courseId): boolean
```

---

## Contract 8: AsyncStorage Keys

```typescript
// Namespace: @rewards/
const FINALE_SEEN_KEY = (courseId: string) => `@rewards/finaleSeen/${courseId}`;
```

Only `markCourseFinaleSeen` reads/writes this key. No other code touches it.

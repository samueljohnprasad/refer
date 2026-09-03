# Data Model: Course Rewards MVP

**Feature:** `specs/014-course-rewards-mvp`
**Branch:** `014-course-rewards-mvp`

---

## Overview

The MVP extends the existing journey architecture with:
1. **Authored reward config** — a bundled, OTA-updatable config file (`src/data/journey/rewardsConfig.ts`)
2. **UI state additions** — minimal Redux slice additions for pending celebrations and course-finale "seen" state
3. **No new DB tables** — all durable state maps onto existing `user_node_progress` and `user_course_progress` records

---

## 1. Authored Config Schema (`src/data/journey/rewardsConfig.ts`)

### 1.1 Per-Lesson Takeaway

```typescript
export interface LessonTakeaway {
  /** Node UUID from the DB */
  nodeId: string;
  /** One-sentence learning takeaway. Required for lesson completion surface (FR-1.2). */
  takeaway: string;
}
```

### 1.2 Per-Unit Reward Content

```typescript
export interface UnitRewardContent {
  /** Unit UUID from the DB */
  unitId: string;
  /**
   * "You can now…" capability statement for the unit trophy (FR-3.3).
   * Must not claim symptom improvement, treatment completion, or perfection.
   */
  capabilityStatement: string;
  /**
   * Authored insight card revealed when the learner claims the chest (FR-2.10).
   * Required when chestEnabled is true (default).
   */
  insightCard: InsightCardContent;
  /**
   * Set to false to omit the chest for this unit (FR-2.3).
   * Default: true if unit has ≥ 4 required nodes.
   */
  chestEnabled?: boolean;
  /**
   * 0-based index override for chest position within required nodes (FR-2.3).
   * If omitted, defaults to the midpoint algorithm.
   * Invalid positions are ignored and the chest is omitted (logged as a warning).
   */
  chestPositionOverride?: number;
}

export interface InsightCardContent {
  /** Short title, e.g. "Why sleep debt adds up" (FR-2.10) */
  title: string;
  /** Concise useful idea connected to the unit's learning outcome (FR-2.10) */
  body: string;
}
```

### 1.3 Per-Course Reward Content

```typescript
export interface CourseRewardContent {
  /** Course UUID from the DB */
  courseId: string;
  /**
   * Warm acknowledgement of effort shown in the course finale (FR-4.3).
   * Must not claim recovery, symptom elimination, or treatment completion.
   */
  acknowledgement: string;
  /**
   * 3–5 concrete capability strings developed across the course (FR-4.3).
   * E.g. "Identify the common signs of chronic sleep debt."
   */
  capabilitySummary: string[];
}
```

### 1.4 Root Config Shape

```typescript
export interface RewardsConfig {
  /** Keyed by nodeId for O(1) lesson takeaway lookup */
  lessonTakeaways: Record<string, LessonTakeaway>;
  /** Keyed by unitId for O(1) unit reward lookup */
  unitRewards: Record<string, UnitRewardContent>;
  /** Keyed by courseId for O(1) course reward lookup */
  courseRewards: Record<string, CourseRewardContent>;
}
```

### 1.5 Fallback & Gap-Detection Rules

- `lessonTakeaways[nodeId]` missing → show neutral fallback text; log `[rewards] missing takeaway for node <nodeId>` via `console.warn`.
- `unitRewards[unitId]` missing → disable chest and capability statement for that unit; log warning; fail open (FR-5.6).
- `unitRewards[unitId].insightCard` missing → disable chest; log warning.
- `courseRewards[courseId]` missing → show generic course completion surface without capability list; log warning.
- `chestPositionOverride` out of bounds → omit chest; log warning.

---

## 2. Chest Position Algorithm

```
Given: requiredNodes = nodes of this unit where node.type !== 'chest'
If requiredNodes.length < 4 → no chest

midIndex = Math.floor((requiredNodes.length - 1) / 2)
chestIndex = midIndex (0-based position within requiredNodes, inserted after this node)

Constraints:
  - At least 1 required node before the chest
  - At least 1 required node after the chest
  - Not immediately before the unit trophy (i.e., not after the last required node)

Override: use chestPositionOverride if valid, else omit and warn.
```

The computed position determines where a `chest`-type node is inserted in the journey layout. **The chest node already exists in the DB** — position is set when the course is authored. The algorithm is used to validate the authored position client-side and for future tooling.

---

## 3. Redux State Additions (`journeySlice.ts`)

These are **additive** changes to `JourneyState`. Existing fields are unchanged.

```typescript
// Added to JourneyState interface:

/**
 * Pending celebration level keyed by courseId.
 * Set after completeNode response; cleared after the surface is shown.
 * 'lesson' | 'unit' | 'course' — priority: course > unit > lesson
 */
pendingCelebration: Record<string, 'lesson' | 'unit' | 'course' | null>;

/**
 * Tracks whether the full course finale has been shown for a given courseId.
 * Seeded from AsyncStorage on load; persisted to AsyncStorage on set.
 */
courseFinaleSeenByCourse: Record<string, boolean>;
```

### New Actions

```typescript
/** Set after a completeNode call returns with completion flags. */
setPendingCelebration(state, action: PayloadAction<{ courseId: string; level: 'lesson' | 'unit' | 'course' | null }>)

/** Mark the course finale as seen. Also persists to AsyncStorage. */
markCourseFinaleSeen(state, action: PayloadAction<{ courseId: string }>)
```

---

## 4. Celebration Orchestrator (`src/domains/journey/rewards/useCelebrationOrchestrator.ts`)

Pure hook, reads from Redux, fires no mutations.

### Input
```typescript
interface CompleteNodeResult {
  unitCompleted: boolean;
  courseCompleted: boolean;
  // existing fields
}
```

### Priority Logic
```
if courseCompleted → 'course'
else if unitCompleted → 'unit'
else → 'lesson'
```

### Output
Dispatches `setPendingCelebration` with the computed level. The journey map controller reads `pendingCelebration` and renders the correct surface.

---

## 5. Existing Progress State (no changes)

All durable completion state already exists in the DB and Redux store:

| State | Source |
|-------|--------|
| Node completed | `user_node_progress.status = 'completed'` |
| Chest claimed | `user_node_progress.status = 'completed'` for chest-type node |
| Unit complete (derived) | All unit's required nodes completed — `resolveDerivedStatusFromNodeIds` |
| Course complete | `user_course_progress.status = 'completed'` |
| Course finale seen | `AsyncStorage` key `@rewards/finaleSeen/<courseId>` + `courseFinaleSeenByCourse` Redux |

---

## 6. Chest Visual State Machine

```
DB status         →  Local UI state   →  Visual render
────────────────────────────────────────────────────────
'locked'          →  locked           →  🔒  grey, non-interactive
'in_progress'     →  available        →  🎁  gold shine pulse
(tapped)          →  opening          →  🎁  shake + expand (transient, ~800ms)
'completed'       →  claimed          →  ✅  gold flat, no shine, tappable (reopens card)
```

The `opening` state is local to `useChestNodeViewModel` — it is not persisted. After the animation, the claim request fires and status transitions to `claimed`.

---

## 7. Presentation Hierarchy — Which Surface Wins

When `completeNode` resolves:

```
courseCompleted = true  →  CourseFinaleScreen (full-screen, one-time)
                            ↳ absorbs both lesson & unit celebration
                            ↳ silently records unit trophy as durable state
unitCompleted = true    →  UnitCompleteSheet (bottom sheet, ≈65% height)
                            ↳ absorbs lesson celebration
else                    →  LessonCompleteSheet (bottom sheet, ≈50% height)
```

Only one surface is ever shown per completion event (FR-4.5, SC-5).

---

## 8. State Transitions Diagram

```
[Learner presses Continue on exercise]
    │
    ▼
completeNode mutation fires
    │
    ▼
Edge Function marks node complete
Returns: { unitCompleted, courseCompleted, nextNodeId, rewards }
    │
    ├─ courseCompleted=true ──▶ dispatch setPendingCelebration('course')
    ├─ unitCompleted=true   ──▶ dispatch setPendingCelebration('unit')
    └─ else                 ──▶ dispatch setPendingCelebration('lesson')
    │
    ▼
useJourneyMapController reads pendingCelebration
    │
    ├─ 'course'  ──▶ push CourseFinaleScreen (Expo Router)
    ├─ 'unit'    ──▶ show UnitCompleteSheet
    └─ 'lesson'  ──▶ show LessonCompleteSheet
    │
    ▼
Learner dismisses surface
    │
    ▼
dispatch setPendingCelebration(null)
    [If course] dispatch markCourseFinaleSeen
```

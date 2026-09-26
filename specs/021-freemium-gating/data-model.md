# Data Model & Entitlement Schema: Freemium Gating (Model A)

## 1. Domain Entities

### LearnerEntitlement
Represents the runtime authorization and subscription state of the authenticated or anonymous user.

| Field | Type | Description |
| :--- | :--- | :--- |
| `hasPro` | `boolean` | `true` if user has an active "pro" entitlement verified by native store / RevenueCat |
| `isLoadingRevenueCat` | `boolean` | `true` while initial native receipt verification or cache synchronization is in progress |
| `customerInfo` | `CustomerInfo \| null` | Raw customer payload containing active subscriptions and expiration dates |
| `shouldPromptAccountClaim` | `boolean` | `true` if anonymous user has active Pro and needs to link Apple / Google credential |

---

### GatedFeature & FeatureQuota
Categorization of gated capabilities across the app and their free-tier usage boundaries.

```typescript
export type FreemiumFeature =
  | "journey_unit"      // Course progression beyond Unit 1
  | "exercise"          // Advanced / somatic CBT exercises
  | "habits"            // Active daily habit capacity
  | "coping_cards"      // Pocket deck saved card capacity
  | "voice_recording"   // Rolling weekly audio journal quota
  | "ai_assistant";     // Daily AI CBT companion query quota
```

#### Quota Thresholds (Constants)

| Feature Key | Free Tier Limit | Pro Tier Limit | Scope / Rolling Window |
| :--- | :--- | :--- | :--- |
| `journey_unit` | Unit 1 only (`unitIndex === 0`) | All Units (1, 2, 3...) | Per enrolled course |
| `exercise` | 5 foundational exercises | All 13+ exercises | Permanent access |
| `habits` | 3 active habits | Unlimited habits | Concurrently active |
| `coping_cards` | 5 active cards | Unlimited cards | Concurrently non-archived |
| `voice_recording`| 3 audio recordings | Unlimited recordings | Rolling 7-day window |
| `ai_assistant` | 5 queries | Unlimited queries | Per calendar day |

---

## 2. Configuration Extensions

### ExerciseConfig Extension
Metadata added to exercise definitions in `src/types/exerciseFlow.ts` and registered in `src/data/exerciseRegistry.ts`:

```typescript
export interface ExerciseConfig<T = Record<string, any>> {
  type: ExerciseType;
  category: ExerciseCategory;
  title: string;
  subtitle: string;
  icon: string;
  duration: string;
  xp: number;
  backgroundColor: string;
  schemaVersion: number;
  steps: ExerciseStepDef<T>[];
  initialResponse: T;
  /** Whether this exercise is gated for Pro subscribers */
  isProOnly?: boolean;
  migrate?: (oldResponse: any, fromVersion: number) => T;
}
```

#### Exercise Gating Registry

- **Free Tier (Foundational CBT Pack)**:
  - `thought_catcher` (Thought Catcher)
  - `thought_reframing` (Thought Reframing)
  - `gratitude_reframe` (Gratitude Reframe)
  - `box_breathing` (Box Breathing)
  - `mindful_breathing_1min` (1-Minute Breathing)

- **Pro Tier (`isProOnly: true`)**:
  - `abc_analysis` (ABC Cognitive Analysis)
  - `breathing_478` (4-7-8 Sleep Breathing)
  - `grounding_54321` (5-4-3-2-1 Sensory Grounding)
  - `body_scan_pmr` (Progressive Muscle Relaxation)
  - `decatastrophizing` (Decatastrophizing)
  - `worry_decision_tree` (Worry Decision Tree)
  - `detached_mindfulness` (Detached Mindfulness)
  - `attention_training` (Attention Training Technique)

---

### Journey Layout Item Extensions
Properties added to FlashList layout items in `src/types/journey/node.ts`:

```typescript
export interface JourneyNode {
  id: string;
  itemType: "node";
  globalIndex: number;
  unitId: string;
  /** 0-based unit index within course (0 = Unit 1, 1 = Unit 2, etc.) */
  unitIndex?: number;
  // ... visual coordinates and variant keys
}

export interface JourneyDividerItem {
  id: string;
  itemType: "divider";
  title: string;
  /** 0-based unit index within course */
  unitIndex?: number;
  /** Whether this unit requires Pro */
  isProOnly?: boolean;
  // ... SVG connector properties
}
```

---

## 3. State Transition Matrix

| Current Tier | Trigger Action | Condition / Quota Status | Resulting State |
| :--- | :--- | :--- | :--- |
| **Free** | Taps Unit 1 Node | `unitIndex === 0` | Starts lesson flow directly |
| **Free** | Taps Unit 2+ Node | `unitIndex > 0` | Blocks launch; renders warning haptic + opens Paywall |
| **Free** | Taps Free Exercise | `!exercise.isProOnly` | Launches exercise with Circular Reveal |
| **Free** | Taps Pro Exercise | `exercise.isProOnly === true` | Suppresses reveal; opens Paywall |
| **Free** | Taps "+ Add Habit" | `activeHabits.length < 3` | Opens `AddHabitModal` |
| **Free** | Taps "+ Add Habit" | `activeHabits.length >= 3` | Blocks modal; opens Paywall |
| **Free** | Saves Coping Card | `activeCards.length < 5` | Saves card to pocket deck |
| **Free** | Saves Coping Card | `activeCards.length >= 5` | Rejects mutation; opens Paywall; preserves form inputs |
| **Free** | Archives Coping Card | Decrements active count | Frees 1 slot in active deck capacity |
| **Free** | Upgrades to Pro | Store transaction confirmed | `hasPro = true`; all gates open instantly |

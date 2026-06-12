# Phase 1 Tasks — CBT Exercises V2: Foundation

> **Goal:** Make exercises warm, show proof of progress, fix existing bugs.
> **Timeline:** ~3 weeks
> **Reference:** `docs/prd-cbt-exercises-v2.md` § Phase 1

---

## Track A: Bug Fixes

### ✅ TASK-001 — Fix Worry Time double fieldKey bug

**File:** `src/exercises/worryTime/config.ts`

**Problem:** Steps `action_or_accept` (line 98) and `reflection` (line 111) both use `fieldKey: "reflection"`. When a user fills in the action plan and then the reflection, the action plan text is overwritten.

**Fix:**

1. Add `actionOrAcceptStatement: ""` to `WorryTimeResponse` type in `src/types/exerciseFlow.ts`
2. Change `action_or_accept` step's `fieldKey` to `"actionOrAcceptStatement"`
3. Update `createSummaryStep` fields in `worryTimeConfig` to show both fields
4. Add migration: `schemaVersion: 3`, migrate v2 → v3 by moving `reflection` → `actionOrAcceptStatement` if reflection exists

**Acceptance criteria:**

- [ ] Action plan and reflection are stored in separate fields
- [ ] Existing entries don't lose data (migration handles it)
- [ ] Summary shows both values correctly

---

### ✅ TASK-002 — Fix Thought Reframing intensity overwrite

**File:** `src/exercises/thoughtReframing/config.ts` + `src/types/exerciseFlow.ts`

**Problem:** The `re_evaluate` step (step 8) uses `fieldKey: "intensity"`, which overwrites the initial intensity captured during `emotions` step. Pre/post comparison is impossible.

**Fix:**

1. Add `postIntensity: undefined as number | undefined` to `ThoughtReframingResponse` in `src/types/exerciseFlow.ts`
2. Change `re_evaluate` step's `fieldKey` to `"postIntensity"`
3. Update `schemaVersion` to 2 with migration: v1 → v2 sets `postIntensity = undefined`
4. Update summary step to show both `intensity` (before) and `postIntensity` (after)

**Acceptance criteria:**

- [ ] Initial intensity value is preserved after re-evaluate step
- [ ] Both values appear in summary
- [ ] No data loss for existing entries

---

## Track B: Emotional Validation Layer

### ✅ TASK-003 — Create ValidationMessage component

**File (new):** `src/components/exercise/ValidationMessage.tsx`

**What it does:** A non-blocking, inline validation card that appears between steps to acknowledge the user's emotional state before technique guidance.

**Props:**

```typescript
interface ValidationMessageProps {
  message: string;
  visible: boolean;
  className?: string;
}
```

**Design spec:**

- Sage-50 background (`bg-sage-50`), border `border-sage-200/50`, `rounded-2xl`, `p-4`
- Optional small leaf/heart icon on the left (HugeiconsIcon)
- 14-15px body text, `text-sage-800`, `font-medium`
- Fade-in animation using existing `FadeInItem` component
- Max 2 lines of text — no wrapping onto 3 lines

**Example render:**

```
┌────────────────────────────────────────┐
│ 🌿  That sounds like it was hard.       │
│     Let's work through this together.   │
└────────────────────────────────────────┘
```

**Acceptance criteria:**

- [ ] Component renders with correct styling
- [ ] Fades in smoothly (no jarring appearance)
- [ ] Invisible when `visible=false`
- [ ] Accessible (accessibilityRole="text", not interactive)

---

### ✅ TASK-004 — Add validation messages to CBT Core exercises

**Files:**

- `src/exercises/thoughtCatcher/config.ts`
- `src/exercises/thoughtReframing/config.ts`
- `src/exercises/gratitudeReframe/config.ts`
- `src/exercises/abcAnalysis/customSteps.tsx`

**Approach:** Add a `validationMessage` prop to `createStep()` for TextInputStep and SliderStep. After the user completes the first vulnerable input step (their "situation" or first text entry), show the validation message inline before the next step's title.

**Alternatively** (simpler): Add an `AcknowledgeStep`-style step after the first text input in each exercise that shows only a validation message and an auto-advance (or light "Continue" tap). This requires no changes to existing step components.

**Validation messages per exercise:**

| Exercise          | Trigger Step                                  | Message                                                                            |
| ----------------- | --------------------------------------------- | ---------------------------------------------------------------------------------- |
| Thought Catcher   | After `situation`                             | "That sounds like it was a lot. Let's look at this thought together."              |
| Thought Catcher   | After `automatic_thought` (if intensity > 70) | "That's a strong thought. Let's see if we can loosen its grip a little."           |
| Thought Reframing | After `situation`                             | "It takes courage to look closely at what's going on. Let's do this step by step." |
| Gratitude Reframe | After mood selection = anxious/sad/stressed   | See mood-specific messages in PRD §5.1                                             |
| ABC Analysis      | After `activating_event`                      | "That's the raw event. Now let's look at the story your mind told about it."       |
| ABC Analysis      | After `belief`                                | "That belief makes sense given how things felt in that moment."                    |

**Acceptance criteria:**

- [ ] Validation message appears for all 4 exercises
- [ ] Messages are contextually appropriate (not generic)
- [ ] Messages never repeat if user goes back/forward
- [ ] No extra required taps — message is inline, not blocking

---

### ✅ TASK-005 — Add validation messages to Anxiety exercises

**Files:**

- `src/exercises/worryTime/config.ts`
- `src/exercises/fearLadder/config.ts`
- `src/exercises/decatastrophizing/config.ts`
- `src/exercises/worryDecisionTree/config.ts`

**Validation messages:**

| Exercise            | Trigger Step                                | Message                                                                                |
| ------------------- | ------------------------------------------- | -------------------------------------------------------------------------------------- |
| Worry Time          | After `capture_worries` (first worry added) | "It makes sense these feel heavy. Naming them is already the first step."              |
| Fear Ladder         | After `list_fears`                          | "Every fear on that list took courage to write. We'll start with the smallest one."    |
| Decatastrophizing   | After `feared_catastrophe`                  | "Catastrophic thoughts feel absolutely real when they hit. Let's slow down together."  |
| Worry Decision Tree | After `write_worry`                         | "It's okay that this is on your mind. Let's figure out what, if anything, you can do." |

**Acceptance criteria:** Same as TASK-004.

---

### ✅ TASK-006 — Add validation messages to Overthinking exercises

**Files:**

- `src/exercises/recognizingRumination/config.ts`
- `src/exercises/detachedMindfulness/config.ts`
- `src/exercises/attentionTraining/config.ts`

**Validation messages:**

| Exercise               | Trigger Step                        | Message                                                                                           |
| ---------------------- | ----------------------------------- | ------------------------------------------------------------------------------------------------- |
| Recognizing Rumination | After `current_thought_loop`        | "Getting stuck in loops is exhausting. You noticed it — that's already progress."                 |
| Recognizing Rumination | After `time_check` (value = "days") | "Days is a long time to carry that. Let's interrupt it right now."                                |
| Detached Mindfulness   | After `observe_thought`             | "You don't have to fight this thought or believe it. Just watch it for a moment."                 |
| Attention Training     | (On intro, before timers begin)     | "This one's harder than it sounds. Be patient with yourself — attention training takes practice." |

**Acceptance criteria:** Same as TASK-004.

---

## Track C: Dynamic Summary

### ✅ TASK-007 — Create DynamicSummary component

**File (new):** `src/components/exercise/DynamicSummary.tsx`

**What it replaces:** `createSummaryStep()` — the generic key-value list renderer.

**Props:**

```typescript
interface DynamicSummaryProps {
  title: string;
  preScore?: number; // e.g. 8 (before intensity)
  postScore?: number; // e.g. 3 (after intensity)
  scoreLabel?: string; // e.g. "Thought intensity", "Anxiety level"
  scoreMax?: number; // default 10
  keyTakeaway?: string; // the balanced thought / alternative belief text
  keyTakeawayLabel?: string; // "Your balanced thought", "Your new belief"
  celebrationEmoji?: string;
  nextExerciseType?: ExerciseType; // for exercise linking
  nextExerciseLabel?: string; // "Go deeper → Thought Reframing"
  onSaveCopingCard?: () => void; // if exercise produces a reframe
  onComplete: () => void;
  onEdit?: () => void;
  isSaving?: boolean;
  readOnly?: boolean;
}
```

**Layout (top to bottom):**

1. Celebration emoji in circular badge (sage-50 background)
2. Dynamic title (from props)
3. Before/after score bar — only if both `preScore` and `postScore` exist:
   - Two horizontal bars side by side with labels
   - Color: preScore = terracotta-tint, postScore = sage-200
   - Delta message: `${Math.round(Math.abs(pre - post) / pre * 100)}% reduction` or absolute drop
   - Personalized insight message (computed from delta — see logic below)
4. Key takeaway card — only if `keyTakeaway` exists:
   - Shows the user's reframed thought/belief
   - "Save as coping card" button if `onSaveCopingCard` provided
5. Next exercise suggestion — only if `nextExerciseType` provided:
   - Subtle, optional tap target at bottom
   - "Want to go deeper? → [nextExerciseLabel]"
6. Complete button (full width primary)
7. Edit button (ghost, below complete)

**Insight message logic:**

```typescript
function getInsightMessage(pre: number, post: number, max: number): string {
  const pct = (pre - post) / pre;
  if (pct >= 0.5)
    return `Your ${scoreLabel} dropped by ${Math.round(pct * 100)}%. That's your rational mind working.`;
  if (pct >= 0.2) return `A real shift. Every small drop builds a new pattern.`;
  if (pct >= 0)
    return `Change is often gradual. Showing up is what matters most.`;
  return `Sometimes looking at difficult things closely makes them feel bigger first. It gets easier.`;
}
```

**Acceptance criteria:**

- [ ] Before/after bars render correctly for all score ranges
- [ ] Delta message matches actual data
- [ ] Key takeaway section hidden when not applicable
- [ ] Coping card button works (calls handler)
- [ ] Exercise link is tappable and navigates
- [ ] Component looks polished — matches ABC Analysis summary quality

---

### ✅ TASK-008 — Integrate DynamicSummary into Thought Catcher

**File:** `src/exercises/thoughtCatcher/config.ts`

Replace `CheckerSummary` with `DynamicSummary`:

- `preScore`: `response.intensity`
- `postScore`: `response.postIntensity`
- `scoreLabel`: "Thought intensity"
- `keyTakeaway`: `response.balancedThought`
- `keyTakeawayLabel`: "Your balanced thought"
- `celebrationEmoji`: "🧠"
- `nextExerciseType`: "thought_reframing"
- `nextExerciseLabel`: "Go deeper → Thought Reframing"
- `onSaveCopingCard`: save handler

**Acceptance criteria:**

- [ ] Before/after shows correctly (no overwrite bug)
- [ ] Key takeaway shows if balancedThought is filled
- [ ] "Save as coping card" button visible and functional
- [ ] Exercise link navigates to Thought Reframing

---

### ✅ TASK-009 — Integrate DynamicSummary into Thought Reframing

**File:** `src/exercises/thoughtReframing/config.ts`

- `preScore`: `response.intensity`
- `postScore`: `response.postIntensity` (from TASK-002 fix)
- `scoreLabel`: "Belief intensity"
- `keyTakeaway`: `response.balancedThought`
- `keyTakeawayLabel`: "Your balanced thought"
- `celebrationEmoji`: "✨"
- `nextExerciseType`: "detached_mindfulness"
- `nextExerciseLabel`: "Try detachment → Detached Mindfulness"
- `onSaveCopingCard`: save handler

**Acceptance criteria:**

- [ ] Before/after shows correctly (requires TASK-002 first)
- [ ] All fields correct

---

### ✅ TASK-010 — Integrate DynamicSummary into ABC Analysis

**File:** `src/exercises/abcAnalysis/customSteps.tsx` (ABCSummaryStep)

The ABCSummaryStep is a custom component. Update it to use DynamicSummary:

- `preScore`: `response.preEmotionalIntensity`
- `postScore`: `response.postEmotionalIntensity`
- `scoreLabel`: "Emotional intensity"
- `scoreMax`: 10
- `keyTakeaway`: `response.alternativeBelief`
- `keyTakeawayLabel`: "Your alternative belief"
- `celebrationEmoji`: "🧩"
- `onSaveCopingCard`: save handler

**Note:** Keep the existing list of all 6 fields (Activating Event, Belief, etc.) below the DynamicSummary header — it's valuable and unique to this exercise.

---

### ✅ TASK-011 — Integrate DynamicSummary into remaining exercises

**Files:** All remaining exercise summary steps

Apply DynamicSummary to:

| Exercise                | preScore field     | postScore field      | keyTakeaway field                    | emoji |
| ----------------------- | ------------------ | -------------------- | ------------------------------------ | ----- |
| Gratitude Reframe       | `moodIntensity`    | `finalMoodIntensity` | first `gratitudeEntries[0]`          | 🌿    |
| Decatastrophizing       | `anxietyBefore`    | `anxietyAfter`       | `copingPlan`                         | 🔭    |
| Worry Time              | `preAnxietyRating` | `postAnxietyRating`  | `reflection`                         | 📋    |
| Fear Ladder             | `anxietyBefore`    | `anxietyAfter`       | `habituationInsight`                 | 🪜    |
| Worry Decision Tree     | `preAnxietyRating` | `postAnxietyRating`  | `actionPlan` or `acceptanceExercise` | 🌳    |
| Recognizing Rumination  | `preRating`        | `postRating`         | `interruptTechnique`                 | 🔓    |
| Detached Mindfulness    | `preRating`        | `checkInRating`      | `observedThought`                    | ☁️    |
| Attention Training      | `preRating`        | `postRating`         | none                                 | 🎯    |
| Box Breathing           | `preCalm`          | `postCalm`           | none                                 | 🌬️    |
| 4-7-8 Breathing         | `preCalm`          | `postCalm`           | none                                 | 🌊    |
| 5-4-3-2-1 Grounding     | `prePresence`      | `postPresence`       | none                                 | 🌱    |
| Body Scan PMR           | `preTension`       | `postTension`        | none                                 | 💆    |
| 1-Min Mindful Breathing | `prePresence`      | `postPresence`       | none                                 | 🍃    |

---

## Track D: Exercise Linking

### ✅ TASK-012 — Define exercise linking map

**File (new):** `src/data/exerciseLinkingMap.ts`

**What:** A static config mapping each exercise to a contextual "next step" suggestion shown in the summary.

```typescript
export type ExerciseLink = {
  exerciseType: ExerciseType;
  label: string;
  reason: string; // short phrase shown to user
};

export const EXERCISE_LINKING_MAP: Partial<Record<ExerciseType, ExerciseLink>> =
  {
    thought_catcher: {
      exerciseType: "thought_reframing",
      label: "Thought Reframing",
      reason: "Go deeper into this thought",
    },
    thought_reframing: {
      exerciseType: "detached_mindfulness",
      label: "Detached Mindfulness",
      reason: "Practice observing without engaging",
    },
    gratitude_reframe: {
      exerciseType: "thought_catcher",
      label: "Thought Catcher",
      reason: "Notice a thought that came up",
    },
    abc_analysis: {
      exerciseType: "thought_reframing",
      label: "Thought Reframing",
      reason: "Challenge the belief further",
    },
    decatastrophizing: {
      exerciseType: "fear_ladder",
      label: "Fear Ladder",
      reason: "Start facing this fear gradually",
    },
    worry_time: {
      exerciseType: "worry_decision_tree",
      label: "Worry Decision Tree",
      reason: "Sort each worry: act or accept",
    },
    worry_decision_tree: {
      exerciseType: "detached_mindfulness",
      label: "Detached Mindfulness",
      reason: "Let the uncontrollable worries go",
    },
    fear_ladder: {
      exerciseType: "decatastrophizing",
      label: "Decatastrophizing",
      reason: "Challenge what you think will happen",
    },
    recognizing_rumination: {
      exerciseType: "attention_training",
      label: "Attention Training",
      reason: "Strengthen your attention control",
    },
    detached_mindfulness: {
      exerciseType: "attention_training",
      label: "Attention Training",
      reason: "Train flexible attention",
    },
    attention_training: {
      exerciseType: "detached_mindfulness",
      label: "Detached Mindfulness",
      reason: "Apply your attention training",
    },
  };
```

**Acceptance criteria:**

- [ ] All 16 exercise types covered (or explicitly `undefined` for no suggestion)
- [ ] `DynamicSummary` reads from this map via the `nextExerciseType` prop (passed from config)

---

### ✅ TASK-013 — Wire exercise links into DynamicSummary

**Files:** `src/components/exercise/DynamicSummary.tsx` + exercise configs

**What:** DynamicSummary receives `nextExerciseType` from the exercise config. The component reads the linking map, shows the label, and on tap — navigates to that exercise.

**Navigation:** Use `useRouter()` from `expo-router`. Navigate to the exercise's route (how exercises are currently launched from ExercisesScreen — check the route pattern).

**Acceptance criteria:**

- [ ] Exercise link tap navigates to the suggested exercise
- [ ] Tapping exercise link exits current exercise (marks as complete first)
- [ ] Link is optional — no suggestion shown if `nextExerciseType` is undefined
- [ ] Link is visually subtle (not competing with the Complete button)

---

## Track E: Gamification Audit

### ✅ TASK-014 — Audit and fix punitive streak mechanics

**Files:** Wherever streak UI, streak-loss messaging, and streak-freeze mechanics are rendered.

**Step 1 — Audit (read-only):**

- Find all streak-related UI components and copy
- Search for: "streak", "lost", "broke", "freeze", "missed"
- Document every place a user could feel punished for inactivity

**Step 2 — Changes:**

| Find                                      | Replace with                                                                |
| ----------------------------------------- | --------------------------------------------------------------------------- |
| "You lost your streak!" / "Streak broken" | Remove entirely OR replace with "Welcome back. Pick up where you left off." |
| Streak freeze mechanic UI                 | Replace with "Days practiced: [cumulative count]" — never decrements        |
| Any red/orange styling on streak loss     | Remove or replace with neutral styling                                      |
| Streak count displayed prominently with 0 | Show "Start your practice" instead of "0 day streak"                        |

**What to keep:**

- XP gain animations and counts (additive, never subtractive)
- Level progression
- Achievement unlocks
- Streak counts when they're counting UP (e.g., "7-day streak!")

**What to change:**

- Any messaging, color, or haptic that signals failure/loss
- The concept of "you had something and now it's gone"

**Acceptance criteria:**

- [ ] No negative messaging visible after a period of inactivity
- [ ] Returning user sees a warm welcome, not a loss indicator
- [ ] Cumulative "days practiced" shown as an alternative to streak
- [ ] Existing streak data not deleted (just displayed differently)

---

## Implementation Order & Dependencies

```
TASK-001  ─┐
TASK-002  ─┤─► TASK-008, TASK-009 (need clean pre/post fields)
           │
TASK-003  ─┤─► TASK-004, TASK-005, TASK-006 (need component first)
           │
TASK-007  ─┤─► TASK-008 through TASK-011 (need component first)
TASK-012  ─┤─► TASK-013 (need map before wiring)
           │
TASK-014  ─┘ (independent)
```

**Suggested sequence:**

1. TASK-001, TASK-002 (bugs — unblock everything else)
2. TASK-003, TASK-007, TASK-012 (build components/data)
3. TASK-004, TASK-005, TASK-006 (validation messages)
4. TASK-008, TASK-009, TASK-010 (dynamic summaries, high-value exercises first)
5. TASK-011 (remaining summaries)
6. TASK-013 (wire links)
7. TASK-014 (gamification audit)

---

## Out of Scope (Phase 1)

The following are Phase 2 or later — do not implement in this phase:

- Crisis detection / safety modal
- Voice input for text fields
- Psychoeducation micro-cards
- Coping Card Deck screen
- Thought Reframing custom steps redesign
- Decatastrophizing time perspective split
- Fear Ladder drag-to-rank
- Adaptive recommendation engine
- Thinking patterns dashboard

---

_Tasks reference: `docs/prd-cbt-exercises-v2.md` § 5.1–5.4, § 6, § 7 (Phase 1)_

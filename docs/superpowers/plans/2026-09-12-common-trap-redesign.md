# Common Trap Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the current Common Trap exercise from a stack of explanatory cards into a progressive causal-learning flow.

**Architecture:** We will replace the static state of `CommonTrapCategoryEngine` with a progressive state machine tracking phases (`trap`, `payoff`, `cost`, `counter`, `complete`). Reanimated will be used for subtle, contextual reveals. The JSON schema will be migrated to use `shortTermPayoff` and `hiddenCost` instead of `relief` and `rebound`.

**Tech Stack:** React Native, Expo, Reanimated, TypeScript, Tailwind (NativeWind)

## Global Constraints

- Do not offer alternate designs unless technically impossible.
- Keep the initial screen minimal. Do NOT render payoff, cost, counter move, or Continue before interaction.
- Hide Skip after the first interaction.
- Show Continue only at final phase.
- Use exact CTAs: "AND THEN WHAT HAPPENS?", "SEE WHAT IT TURNS INTO", "WHAT CAN I DO INSTEAD?", "CONTINUE".
- Track exact reveal phase in saved response ("trap", "payoff", "cost", "counter", "complete").
- Do not store `isCorrect: true`.
- Use Reanimated for opacity 0 -> 1 and small translateY (200-300ms) honoring reduce motion.
- Use existing forest/sage/cream colors. No black borders, no checkmarks.

---

### Task 1: Migrate Content Schema and Mock Data

**Files:**
- Modify: `src/docs/exercises/journey_course_exercises_1_25.yaml`
- Modify: `src/screens/CourseExercisesTestScreen/fixtures/drafts.ts`
- Modify: `supabase/seed/anxiety_section_1_unit_1.sql`

**Interfaces:**
- Consumes: JSON schema definitions
- Produces: Updated JSON schema in docs and DB seeds (`shortTermPayoff`, `hiddenCost`)

- [ ] **Step 1: Update YAML Schema**
Modify `src/docs/exercises/journey_course_exercises_1_25.yaml`. Find `id: common_trap`. Replace `relief` and `rebound` fields with `shortTermPayoff` and `hiddenCost: string[]` (and update descriptions/example if needed).

- [ ] **Step 2: Update Mock Fixture**
Modify `src/screens/CourseExercisesTestScreen/fixtures/drafts.ts`. Find `fixture-common-trap`. Update the JSON object to match the user's recommended content model exactly (with `hiddenCost` and `counterMove.body` as string arrays).

- [ ] **Step 3: Update SQL Seed**
Search `supabase/seed/anxiety_section_1_unit_1.sql` for `common_trap`. Replace `"relief"` key with `"shortTermPayoff"`. Replace `"rebound"` key with `"hiddenCost"`. Convert the string value of `"hiddenCost"` to a single-element array containing that string (since the new schema expects an array for cost and counterMove body). Do the same for `counterMove.body`.

- [ ] **Step 4: Commit**
```bash
git add src/docs/exercises/journey_course_exercises_1_25.yaml src/screens/CourseExercisesTestScreen/fixtures/drafts.ts supabase/seed/anxiety_section_1_unit_1.sql
git commit -m "refactor(schema): migrate common_trap content model"
```

### Task 2: Refactor CommonTrapCategoryEngine config and logic

**Files:**
- Modify: `src/exercises/CommonTrap/config.ts`

**Interfaces:**
- Produces: Correct configuration for the wrapper to hide "Skip for now" and "Continue".

- [ ] **Step 1: Update config.ts**
Modify `src/exercises/CommonTrap/config.ts`.
Set `presentation.hideSkip` to return `true` if `response?.phase` exists and is not `"trap"`.
Set `interaction.getPrimaryLabel` to `() => "Continue"`.
Remove `interaction.getPrimaryTransition` (or let the engine handle completing by passing `true` as the second argument to `onInteraction` when the user clicks the final counter move button). The engine will render its own CTA buttons (except "Continue" which is rendered by the wrapper).

- [ ] **Step 2: Commit**
```bash
git add src/exercises/CommonTrap/config.ts
git commit -m "feat(config): update common_trap presentation config"
```

### Task 3: Refactor CommonTrapCategoryEngine UI

**Files:**
- Modify: `src/components/exercise/CommonTrapCategoryEngine.tsx`

**Interfaces:**
- Consumes: Updated JSON schema payload (`shortTermPayoff`, `hiddenCost`)
- Produces: Progressive disclosure UI tracking phase state

- [ ] **Step 1: Replace implementation in `CommonTrapCategoryEngine.tsx`**
Rewrite the component to use a local state derived from `saved?.phase || "trap"`. The sequence is `trap` -> `payoff` -> `cost` -> `counter` -> `complete`.
Use `react-native-reanimated` (`FadeInDown.duration(250).reduceMotion(ReduceMotion.System)`).

- [ ] **Step 2: Implement the precise CTAs**
When phase === "trap": render CTA Button "AND THEN WHAT HAPPENS?". Tap -> update `phase` to "payoff" via `onInteraction`.
When phase === "payoff": render CTA Button "SEE WHAT IT TURNS INTO". Tap -> update `phase` to "cost".
When phase === "cost": render CTA Button "WHAT CAN I DO INSTEAD?". Tap -> update `phase` to "counter".
When phase === "counter": call `onInteraction({ format: "common_trap", phase: "counter" }, true)` so the wrapper's Continue button is enabled. The engine doesn't render the Continue button itself.

- [ ] **Step 3: Update the UI to match typography hierarchy and colors**
Remove `TrapOutcome` and checkmarks.
Use specific headers: "THE TRAP", "WHY IT FEELS SAFE", "WHAT IT TURNS INTO", "TRY THIS INSTEAD".
For `hiddenCost` and `counterMove.body`, map over the string arrays.
The counter move container should use `bg-sage-50` and forest text styling.

- [ ] **Step 4: Test and Commit**
Run `npx tsc --noEmit`.
```bash
git add src/components/exercise/CommonTrapCategoryEngine.tsx
git commit -m "feat(ui): redesign common_trap progressive flow"
```


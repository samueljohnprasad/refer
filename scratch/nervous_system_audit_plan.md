## Goal
Redesign the "Your nervous system at night" exercise from a passive 3-card reading flow into a highly interactive, animated "State Meter" that teaches the ON/OFF nervous system mental model visually.

## User Review Required
- **Category Name**: I'll create a new engine `StateSwitchCategoryEngine` so this pattern (a continuum slider moving between states with reveals) can be reused across the app. 
- **Meter Design**: A horizontal continuum `ALERT ⟷ SETTLED`. A visible thumb/indicator will animate across it to physically demonstrate the shift.

## Proposed Changes

### 1. Database Payload (`scratch/update_nervous_system.sql`)
#### [NEW] `scratch/update_nervous_system.sql`
Creates a SQL script to overwrite the current `story_serial` exercise with a new `state_switch` category. 
- Implements the exact copy requested (ON/ALERT, OFF/SETTLED, and the conflict step).
- Introduces the `TIRED ≠ SETTLED` final insight.
- Updates the recall prompt to a situational scenario rather than a vocab check.

---

### 2. Engine Registry & Config (`src/exercises/StateSwitch/config.ts`)
#### [NEW] `src/exercises/StateSwitch/config.ts`
Registers the new `state_switch` category.
- `hideSkip: () => true`
- `hideFooter: (exercise, response) => response?.phase !== "complete"`
- `submissionMode: "immediate"` (submits as soon as they select a recall answer).

#### [MODIFY] `src/components/exercise/courseExerciseFinalBatchRegistry.ts`
- Imports and registers `StateSwitchConfig`.

#### [MODIFY] `src/types/courseExercises.ts`
- Adds `StateSwitch = "state_switch"` to `CourseExerciseCategoryEnum`.

---

### 3. State Switch Engine (`src/components/exercise/StateSwitchCategoryEngine.tsx`)
#### [NEW] `src/components/exercise/StateSwitchCategoryEngine.tsx`
A new React component that acts as the evolving interactive model.
- **State 1 (ON)**: Meter at left. Shows alerting symptoms. Button `[ SEE THE SETTLED STATE ]`.
- **State 2 (OFF)**: Meter animates to right. Shows settling symptoms. Button `[ WHAT KEEPS IT ON? ]`.
- **State 3 (CONFLICT)**: Meter animates back left. Stressors (Work, Caffeine, Light) fade in. Button `[ TRY A QUICK RECALL ]`.
- **State 4 (RECALL)**: Shows the scenario and the two options (ON / OFF).
- **State 5 (FEEDBACK & INSIGHT)**: After tapping, displays whether they were correct/incorrect with the contextual feedback, followed by the `TIRED ≠ SETTLED` final insight. The global "Continue" footer appears.
- **UI Details**: Uses `react-native-reanimated` for smooth, physical meter movement. Soft, flattened cards to match the new premium UI direction without excessive shadows.

## Verification Plan

### Manual Verification
1. Run `npx supabase db query --linked -f scratch/update_nervous_system.sql`.
2. Navigate to the exercise in the app (or trigger it via the test catalog).
3. Verify the state meter animates properly left and right.
4. Verify the options dynamically change the text underneath.
5. Answer the recall question and verify feedback and final insight appear inline before completion.

## Goal
Refine the State Switch interactive engine and content payload according to the 40-point updated audit.

## User Review Required
- **Correctness Bug Fix**: Fixed the UI marking incorrect answers as green by passing `result="incorrect"` explicitly to the option button.
- **Staggered Animation**: The "conflict" state now visually nudges the slider left (100% -> 75% -> 50% -> 25%) as each stressor fades in sequentially, cementing the cause-and-effect relationship.

## Proposed Changes

### 1. Database Payload (`scratch/update_nervous_system_2.sql`)
#### [NEW] `scratch/update_nervous_system_2.sql`
- **Vocabulary**: Sweeps out "ON/OFF" in favor of "ALERT ↔ SETTLED".
- **Copy Changes**: Contextual CTAs updated (`WHAT KEEPS YOU ALERT?`, `TRY IT`).
- **Recall Scenario**: Updates options to ALERT/SETTLED. Shortens explanatory feedback.
- **Final Insight**: Tightens the subtext to "You can feel tired while your body is still alert."

### 2. State Switch Engine (`src/components/exercise/StateSwitchCategoryEngine.tsx`)
#### [MODIFY] `src/components/exercise/StateSwitchCategoryEngine.tsx`
- **Correctness Bug**: Updates `<CourseExerciseOptionButton />` to explicitly set `result={isSelected && locked ? (opt.isCorrect ? "correct" : "incorrect") : undefined}`.
- **Continuum UI**: Removes text from the sliding thumb to make it purely abstract/visual. Increases track thickness and thumb size for stronger hierarchy.
- **Card Removal**: Strips the large bounding box and background color from the state content container so the text sits natively on the screen under the continuum.
- **Semantic Colors**: Changes stressor text from bright red to a neutral heavy gray (`#374151`) or forest accent. Changes the feedback block from warning yellow to neutral gray-50.
- **Staggered Interaction**: Adds a `useEffect` interval (600ms) that sequences the appearance of stressors during the conflict state, driving the Reanimated `meterValue` leftwards dynamically.

## Verification Plan

### Manual Verification
1. Run `npx supabase db query --linked -f scratch/update_nervous_system_2.sql`.
2. Reload app and launch the exercise.
3. Tap through and verify the slider moves smoothly.
4. On the third screen ("WHAT KEEPS YOU ALERT?"), verify the three stressors fade in sequentially, and the slider nudges left 3 times.
5. Intentionally choose the WRONG answer in the recall. Verify the button highlights RED (✕) and the feedback displays neutrally underneath without a yellow warning box.

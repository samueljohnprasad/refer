# Quickstart Validation Guide: Clear Space Guided Discovery

## Prerequisites
- Local development environment with iOS Simulator.
- React Native / Expo running (`npm run ios`).

## Validation Scenarios

### 1. State 1: Context Selection
1. Navigate to the exercise that uses `ToolkitShelfCategoryEngine` (e.g., "Four valid ways to clear space").
2. **Verify**: The screen displays the main title and the subtitle.
3. **Verify**: The 4 moment choices are displayed using standard `CourseExerciseOptionButton` styling.
4. **Verify**: The strategy taxonomy (horizontal top cards) is completely ABSENT from the screen.

### 2. State 2: Strategy Reveal
1. Tap one of the moment cards.
2. **Verify**: The UI transitions in place. The unselected moments disappear.
3. **Verify**: The selected moment remains visible, styled in the brand's selected state (soft sage surface and border).
4. **Verify**: Directly below the selected moment, an information block appears displaying the strategy key (e.g., "NO WRITING") and the concise explanation.
5. **Verify**: The revealed strategy block does NOT look like a selectable button (no prominent border, quiet background).
6. **Verify**: The primary CTA changes to "Continue" and is enabled.

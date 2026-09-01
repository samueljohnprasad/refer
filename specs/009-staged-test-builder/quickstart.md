# Quickstart & Validation Guide: Staged Test Builder

## Prerequisites
- iOS Simulator running the dev build (`npm run ios`).
- Navigate to the "Set up the next small test" exercise in the app.

## Validation Scenarios

### Scenario 1: State 1 (Selecting Trigger)
1. **Action**: Open the exercise.
2. **Verify**:
   - The title is "Set up the next small test" and subtitle is "Choose something you've noticed."
   - Only the IF options are displayed using standard reusable option buttons.
   - The "Save to My Plans" button is NOT visible.

### Scenario 2: State 2 (Selecting Action)
1. **Action**: Tap on an IF option.
2. **Verify**:
   - The UI transitions in place.
   - The selected IF remains visible with a selected (sage) style, not success green.
   - The subtitle changes to "Choose how you'll test it."
   - A filtered list of THEN options (2-3 items) appears.
   - The "Save to My Plans" button is still NOT visible.

### Scenario 3: State 3 (Review and Save)
1. **Action**: Tap on a THEN option.
2. **Verify**:
   - The UI transitions to the review state ("Your small test").
   - The assembled IF/THEN plan is shown in a reusable card.
   - The text "Private to you. No reminders unless you ask." is shown.
   - The "Save to My Plans" button is now visible.

### Scenario 4: Saving
1. **Action**: Tap "Save to My Plans".
2. **Verify**:
   - The UI displays "✓ Added to My Plans".
   - The exercise unlocks and a "Continue" button appears in the footer to advance the course.

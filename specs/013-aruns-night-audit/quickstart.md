# Quickstart & Validation: Arun's Night Audit

## Prerequisites
- iOS Simulator running the dev client (`npm run ios`).

## Verification Steps

### 1. Test Initial State and Timeline Display
1. Navigate to the specific exercise in the development testing screen.
2. Verify that the setup text is displayed cleanly without bias.
3. Verify the two choice buttons appear.
4. **Pass Criteria**: The screen requires no scrolling.

### 2. Test Path A (First Hour)
1. Select "It seems like the drink helped".
2. Verify the timeline events appear.
3. Verify the visual distinction: Timeline events (times, descriptions) are neutral; the interpretation text has a distinct cream/sage background.
4. **Pass Criteria**: Only the first-hour events are shown.

### 3. Test Rewind Animation
1. Tap "REWIND THE NIGHT".
2. Verify a smooth 300-450ms animation plays: the timeline collapses/resets.
3. Verify the completed path collapses into a compact, read-only summary block.
4. **Pass Criteria**: The screen does not jump abruptly; the user's vertical scroll position is preserved without excessive empty space.

### 4. Test Path B (Whole Night)
1. The timeline now auto-expands to show the whole night.
2. Verify the final question ("What did the first hour hide?") appears.
3. Select an answer.
4. **Pass Criteria**: Selection immediately commits (no "Check" button required) and transitions to the final feedback.

### 5. Test Final Feedback State
1. Verify the final insight ("FIRST HOUR ≠ WHOLE NIGHT") is displayed prominently using typography, not a dashed box.
2. Verify there is no "Skip for now" or "private pattern check" button.
3. Verify the "CONTINUE" button correctly completes the exercise.

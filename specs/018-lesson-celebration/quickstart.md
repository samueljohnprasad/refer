# Quickstart & Validation: Lesson Completion Celebration

## Overview
This guide explains how to validate the new Lesson Completion Celebration without needing to complete an entire real module. We will use a developer test screen to trigger the celebration states directly.

## Prerequisites
- iOS Simulator running (iOS 26+ support target).
- Metro bundler running (`npm run start`).
- Lottie dependency installed (if not already present).

## Validation Scenario 1: Standard Skill Celebration (Level 1)
1. **Action**: Navigate to the Developer Testing Screen (e.g., `app/dev/celebration-test.tsx`).
2. **Action**: Tap the button labeled "Trigger Standard Celebration".
3. **Verify**:
   - `100ms`: You feel a soft success haptic.
   - `350ms`: The mock exercise card dissolves.
   - `850ms`: The "Happy Ripple" animation plays behind the Panda.
   - `1000ms`: The text "You caught the thought." appears.
   - `1300ms`: The text "Reframing · practiced" appears.
   - `1450ms`: The "Continue" button fades in.
   - No generic stat cards or confetti appear.

## Validation Scenario 2: First Daily Habit Celebration (Level 2)
1. **Action**: Tap the button labeled "Trigger Daily Habit Celebration".
2. **Verify**:
   - The sequence plays as above.
   - The haptic feedback is slightly stronger.
   - A subtle streak indicator (e.g., "7 day streak ↑") integrates into the typography layout (not inside a card).

## Validation Scenario 3: Journey Map Transition
1. **Action**: During a celebration test, tap "Continue".
2. **Verify**:
   - The view transitions to the Journey Map.
   - The camera centers on the recently completed node.
   - The completed node flashes/glows.
   - After ~200ms, the path line visually traces to the next node.
   - After ~600ms, the next node unlocks.

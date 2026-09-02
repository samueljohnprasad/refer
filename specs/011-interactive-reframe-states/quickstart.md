# Quickstart & Validation Guide: Interactive Reframe States

This guide outlines how to manually validate the correct and wrong paths in the Interactive Reframe exercise on a local development environment.

## Prerequisites

- Local Expo development environment running (`npm run ios`).
- The database is seeded with the `u1_l9_reframe_broken` node from `sleep_reset_section_1.sql`.

## Validation Scenarios

### 1. The Wrong Path (Explorable Mistake)

1. Navigate to the Interactive Reframe exercise ("My body is broken").
2. Ensure you see the two choices: "What might have shifted?" and "Should I try harder tonight?".
3. Tap "Should I try harder tonight?".
4. **Verify**:
   - The tapped option turns red, but there is no global red "Not quite" card.
   - The hero box smoothly expands to reveal: `"TRY HARDER" -> "more checking" -> "more pressure"`.
   - The "TRY ANOTHER READING" button appears only *after* the cascade completes.
   - The global Continue footer is NOT visible.
5. Tap "TRY ANOTHER READING".
6. **Verify**: The exercise resets to the initial state with the two choices.

### 2. The Correct Path

1. From the initial state, tap "What might have shifted?".
2. **Verify**:
   - The hero box smoothly expands to reveal: `"WHAT CHANGED?" -> "timing / pressure / arousal" -> "something to investigate"`.
   - The "REFRAME IT" button appears.
3. Tap "REFRAME IT".
4. **Verify**:
   - The cascade text fades out and the hero box shrinks.
   - The main text crossfades from red "My body is broken" to green "Something may have shifted".
   - The Broken/Shifted comparison appears.
5. Tap "FOLLOW THE NEW READING".
6. **Verify**:
   - The "✓ Same night. Different reading." badge appears.
   - The "Remember This" takeaway card appears.
   - The global Continue footer appears and is enabled.

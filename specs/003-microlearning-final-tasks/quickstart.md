# Quickstart Validation Guide

## Validating Recall Warmup

1. Open `src/screens/CourseExercisesTestScreen/CourseExercisesTestScreen.tsx` and load the `recallWarmupMicrolearningFixtures`.
2. Start the iOS simulator: `npm run ios`.
3. Observe exactly one flashcard showing a question.
4. Verify using Accessibility Inspector that the answer string is completely absent from the UI tree.
5. Tap the reveal button. The answer should appear alongside two buttons: "Remembered" and "Practice again".
6. Tap a grading button and observe the card transition smoothly to the next question.

## Validating the Audit

1. Run the audit script: `npx ts-node scripts/auditMicrolearningContent.ts`
2. It should output the total number of seed files parsed and report exactly `0` validation errors, confirming that no legacy data shapes exist across the 11 engines.

## Validating Telemetry

1. Run the iOS simulator with the Metro bundler logging enabled.
2. Complete an exercise (e.g., Checkpoint or Recall).
3. Check the Metro console logs for `[microlearning:analytics]` prefixes.
4. Verify the JSON payload logged contains `category`, `exerciseId`, `eventName`, but NO therapeutic text strings.

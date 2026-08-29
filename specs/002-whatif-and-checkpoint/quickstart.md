# Quickstart & Validation: whatif-and-checkpoint

To validate these engines on the iOS simulator:

1. **Boot the simulator:**
   ```bash
   npm run ios
   ```
2. **Navigate to the Test Screen:**
   Open the hidden `CourseExercisesTestScreen` in the app.
3. **Select What-If Machine Fixture:**
   - Verify 2-3 predictions render.
   - Tap one, press "Run it".
   - Verify no auto-advancing occurs; press "Next consequence" manually.
   - Verify the final comparison renders neutrally.
4. **Select Course Checkpoint Fixture:**
   - Verify Intro renders.
   - Proceed to Item 1. Intentionally fail once to test the retry mechanic.
   - Fail twice to verify worked support appears.
   - Complete all items (Single Choice, Ordering, Matching, Recall).
   - Verify Summary mode aggregates Concept IDs into "Solid" or "Review soon".

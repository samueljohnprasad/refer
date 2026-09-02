# Quickstart & Verification Guide: Sleep Science Checkpoint Audit

## Prerequisites
- Local environment running Expo on iOS Simulator / Dev Client (`npm run ios`).

## Verification Scenarios

### Scenario 1: Checkpoint Intro Screen
1. Open the course section containing `Sleep science checkpoint` (`u1_l9_checkpoint_review`).
2. **Verify**:
   - Title: "Sleep science checkpoint"
   - Headline: "Let’s see what stuck."
   - Subtitle: "4 quick questions about the sleep system. A miss just gives you something to revisit."
   - Tag: "4 QUESTIONS · ~1 MIN"
   - No duplicate reassurance lines.
   - Primary button: "START REVIEW"

### Scenario 2: Question 1 & Instant Commit
1. Tap "START REVIEW".
2. **Verify**:
   - Header shows "QUESTION 1 OF 4" with 25% progress bar.
   - Scenario appears in a soft cream card with eyebrow "SCENARIO".
   - Question appears in strong forest green font.
   - No disabled "Choose an answer" button is visible at the bottom.
3. Tap the correct option ("The nap reduced some of the sleep pressure built up during the day").
4. **Verify**:
   - Subtle green indicator appears.
   - Causal explanation appears in a soft neutral/sage panel.
   - Footer button displays "NEXT QUESTION".

### Scenario 3: Incorrect Answer & Causal Repair (No Pink Card)
1. Advance to Question 2.
2. Tap an incorrect distractor.
3. **Verify**:
   - Red color is strictly limited to the chosen option border and `× YOUR ANSWER` tag.
   - Explanation card uses a cream background with header "WHAT HAPPENED?".
   - Causal chain breakdown is clearly readable.
   - No "NOT QUITE" title.
   - No disabled "Try again" button.
   - Primary button is "NEXT QUESTION".

### Scenario 4: Completion & Summary
1. Complete all 4 questions.
2. **Verify**:
   - Fourth question feedback CTA says "SEE RESULTS" / "FINISH REVIEW".
   - Summary groups concepts into "FEELS SOLID" and "WORTH A TWO-MINUTE REVISIT".
   - Primary button is "CONTINUE" to complete the node.

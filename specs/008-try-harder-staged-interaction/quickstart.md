# Quickstart Validation Guide

## Goal
Verify that the "Try harder to sleep" exercise progressively discloses information, has only one CTA at a time, and effectively communicates the learning consequence.

## Steps

1. Launch the Expo app: `npm run ios`
2. Navigate to the Sleep Reset course -> "Try harder to sleep" exercise.
3. **Verify Ready State**:
   - The screen shows the Expectation ("More effort -> sleep faster").
   - The Alertness gauge is visible and near "calm".
   - The main footer CTA says "Try harder".
   - No other cards or explanations are visible.
4. **Verify Result State**:
   - Tap "Try harder".
   - The gauge marker animates toward "wired".
   - The text updates to "What happened: More effort -> more alertness".
   - The main footer CTA says "See why".
5. **Verify Explanation State**:
   - Tap "See why".
   - The explanation and takeaway are revealed.
   - The main footer CTA says "Continue".
6. **Verify Reduced Motion**:
   - Enable Reduced Motion in OS settings.
   - Tap "Try harder" -> The gauge should snap instantly to "wired" without animating.

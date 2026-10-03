# Phase 1 Quickstart Validation Guide: App Store Rating & Review Booster

**Feature**: App Store Rating & Review Booster  
**Branch**: `025-rating-review-booster`  
**Date**: 2026-10-03  

## Validation Scenarios

### Scenario 1: First Exercise Completion (Day 1 Peak)
1. **Prerequisites**: Clear storage or fresh install (`AsyncStorage.clear()`).
2. **Action**: Launch any CBT exercise from Home or Journey (e.g., "Thought Reframing" or "4-7-8 Breathing").
3. **Complete Flow**: Step through the prompts and tap "Finish".
4. **Verification**:
   - Confetti burst and XP celebration modal render smoothly.
   - At `t = 2.0s`, Apple's native 1-tap rating sheet appears over the celebration screen.
   - User can tap star rating or dismiss.
   - Modal remains responsive with zero lag or animation stutter.

### Scenario 2: First Journal Entry Saved (Day 1 Alternative)
1. **Prerequisites**: Fresh install without prior exercise completions.
2. **Action**: Tap (+) Record, type or dictate a short journal entry, select a mood, and tap "Save".
3. **Verification**:
   - Save success toast displays and screen concludes.
   - At `t = 2.0s`, Apple's native 1-tap rating sheet appears.
   - Completing an exercise afterward does NOT show a second prompt (enforcing the 90-day cooldown).

### Scenario 3: Cooldown & Deduplication Verification
1. **Action**: Immediately complete a second exercise after Scenario 1.
2. **Verification**:
   - Victory celebration and XP counter render normally.
   - No review prompt is triggered (blocked by `@happy/review_last_prompted_at` cooldown and `@happy/review_milestones_completed`).

### Scenario 4: Voluntary Settings Deep Link
1. **Action**: Navigate to `Settings` screen.
2. **Action**: Tap the "Rate Happy on the App Store" row.
3. **Verification**:
   - System calls `Linking.openURL("https://apps.apple.com/app/id6755650433?action=write-review")`.
   - App Store opens directly into the review composer for App ID `6755650433`.

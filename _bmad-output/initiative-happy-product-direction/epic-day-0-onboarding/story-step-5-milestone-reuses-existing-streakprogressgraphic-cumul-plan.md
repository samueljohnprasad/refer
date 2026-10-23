---
title: 'Step 5 Milestone reuses existing StreakProgressGraphic & cumulative streak ignition'
type: 'feature'
ticket: '1'
created: '2026-10-20'
status: built
route: 'oneshot'
route_source: 'auto'
baseline_revision: '641e7b27e402be5bb66022cafbd7254d76e387e4'
review: ''
review_source: ''
lenses_ran: []
review_loop_iteration: 0
context: []
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Step 5 Milestone celebration previously used an ad-hoc custom/diagonal UI, introducing layout fragmentation and missing the production-proven streak flame and haptic animations.

**Approach:** Refactor `MilestoneCelebrationStep.tsx` to reuse the existing `<StreakProgressGraphic streak={1} startAnim={true} overrideDays={overrideDays} />` from `src/components/Streak/StreakCelebrationParts.tsx`, wire Day 1 streak ignition (`updateUserStreak(1)`), and add the daily micro-pledge card with a 3D tactile button.

</frozen-after-approval>

## Implementation Notes

- Decided to use `oneshot` route because the change is isolated to `src/screens/OnboardingScreen/steps/MilestoneCelebrationStep.tsx` (<80 lines modified).
- Reusing existing `StreakProgressGraphic` and `useStreak` hook.

## Plan Change Log

## Review Triage Log

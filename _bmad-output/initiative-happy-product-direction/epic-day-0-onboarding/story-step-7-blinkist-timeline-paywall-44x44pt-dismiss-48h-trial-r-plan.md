---
title: 'Step 7 Blinkist Timeline Paywall, 44x44pt dismiss, & 48h trial reminder'
type: 'feature'
ticket: '5'
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

**Problem:** Step 7 needed the 3-node transparent Blinkist timeline ($0 today -> Day 5 reminder -> Day 7 renewal), prominent 44x44pt dismiss support, and automated local push notification scheduling for Day 5 (48h trial reminder) per AD-10.

**Approach:** Upgrade `SoftPaywallStep.tsx` with the 3-node timeline card and `scheduleTrialReminderNotification()`, mount it in `OnboardingStepRenderer.tsx`, and ensure dismiss leads directly to `/tabs/(tabs)/home` as an anonymous guest.

</frozen-after-approval>

## Implementation Notes

- Using `oneshot` route.
- Integrating Blinkist timeline into `SoftPaywallStep.tsx` and connecting to `OnboardingStepRenderer.tsx`.
- Adding local iOS notification trigger for Day 5 reminder.

## Plan Change Log

## Review Triage Log

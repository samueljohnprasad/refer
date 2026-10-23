---
title: 'Step 6 Finch Push Primer & quiet schedule reminder handling'
type: 'feature'
ticket: '4'
created: '2026-10-20'
status: built
route: 'oneshot'
route_source: 'auto'
baseline_revision: '641e7b27e402be5bb66022cafbd7254d76e387e4'
review: 'quick'
review_source: 'pinned'
lenses_ran: []
review_loop_iteration: 0
context: []
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Push notification prompt needed Finch companion framing to avoid cold permission requests that trigger instant OS-level rejections.

**Approach:** Verified Finch companion preview banner in `NotificationPermissionStep.tsx` ("Happi • Just now: Ready for a 2-minute thought check?"), reminder schedule selector, and wired `handleNotificationPermissionOnContinue` with silent fallback on skip.

</frozen-after-approval>

## Implementation Notes

- Using `oneshot` route.
- Verified `NotificationPermissionStep.tsx` and `onboardingNotifications.ts`.
- 0 TypeScript errors.

## Plan Change Log

## Review Triage Log

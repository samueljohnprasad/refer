---
title: 'Step 4 Thought Catch micro-win delivers motivation-matched reframe & +10 XP'
type: 'feature'
ticket: '2'
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

**Problem:** Step 4 Thought Catch was missing motivation mappings for `self_understanding` and `sleep`, and needed real `+10 XP` award integration with local thought record persistence per AD-8.

**Approach:** Update `ThoughtCatchMicroStep.tsx` to handle all 5 `MotivationAnswer` paths (`anxiety`, `mood`, `stress`, `self_understanding`, `sleep`), award `+10 XP` via `useXP`, and save the reframed thought record into local storage.

</frozen-after-approval>

## Implementation Notes

- Using `oneshot` route because the change is isolated to `src/screens/OnboardingScreen/steps/ThoughtCatchMicroStep.tsx` (<80 lines).
- Implemented all 5 motivation branches and wired `useXP`.

## Plan Change Log

## Review Triage Log

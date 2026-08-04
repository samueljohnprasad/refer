# Report: Product/UI patterns — bite-size-learning-flow

## Recommendation

Use one calm deterministic micro-step shell: answer, check, single teaching feedback surface, supported retry. No duplicate red footer.

## Confidence

90%

## Evidence

### Strong sources

- Duolingo adaptive lessons. https://blog.duolingo.com/keeping-you-at-the-frontier-of-learning-with-adaptive-lessons/. Use scaffolding and adaptive support; avoid pressure loops for mental-health context.
- Duolingo Explain My Answer. https://blog.duolingo.com/explain-my-answer-now-free/. Feedback teaches why, not just correct/incorrect.
- Apple progress indicators. https://developer.apple.com/design/human-interface-guidelines/progress-indicators. Determinate progress belongs in consistent place when steps are known.
- Apple feedback. https://developer.apple.com/design/human-interface-guidelines/feedback. Feedback should be timely, clear, and proportional.
- W3C form notifications. https://www.w3.org/WAI/tutorials/forms/notifications/. Error correction should be near task, specific, and perceivable.

### Medium sources

- React Native accessibility. https://reactnative.dev/docs/accessibility. Use selected/disabled/progress semantics for choice and progress states.

## Key findings

- Show one task at a time. Situation choice and why choice should feel like sequential micro-steps.
- Keep one feedback surface. Top teaching card plus red footer duplicates error state.
- Soften miss state. Use “Not quite” and rule clue; avoid big red punishment block.
- Make support material. `Make easier` must reduce choices or show worked contrast, not only change copy.
- Retry after feedback. Hide choices while feedback is visible; return to editable step after `Try another way`.
- Keep skip calm. Skip is support path, not failure.

## Contradictions found within this domain

Duolingo uses streaks, hearts, XP, and pressure. Happy is mental-health product. Keep microlearning shell; reject pressure mechanics.

## Open questions

Need iOS visual smoke to confirm bottom safe-area spacing and perceived density.

## Rejected alternatives

- Full Duolingo gamification: too much pressure for CBT/psychoeducation.
- Modal feedback: interrupts learning loop and hides context.
- Showing feedback plus disabled full exercise: too crowded on phone screen.

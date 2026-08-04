# Decision — v1 shared bite-size exercise loop

## Decision

Ship one shared v1 loop for all course exercise categories:

`Answer -> Check -> one teaching feedback card -> retry with support or continue`

This keeps the Duolingo-like microlearning standard: one small task, fast check,
clear correction, visible progress, and another tiny step. For mental health, we
do not copy pressure mechanics like lives, timers, red failure sheets, or streak
shame.

## Why

- Active recall works better than passive reading because the learner must bring
  the idea to mind, not just recognize it.
- Feedback must teach the rule. A wrong answer becomes useful only when the app
  explains the mistake and gives a supported retry.
- Cognitive load must stay low. One prompt, one action, one feedback surface.
- Mental-health UX must be low-friction. Use calm copy, soft color, skip support,
  and no diagnostic or punitive language.

## UX rule

Before check:

- Show only the current micro-step.
- Let the user tap one answer or one short sequence.
- Show support controls only while the user is still deciding.

After check:

- Hide the exercise choices.
- Show one centered feedback card: `Nice.` or `Not quite.`
- Include one short rule/clue when support is needed.
- CTA either retries the same bite-size task with support or continues after a
  supported completion.

## Implemented v1 changes

- `NodeEngineRouter` now uses one feedback surface and keeps the footer neutral.
- Support row hides after the learner selects an answer and while feedback shows.
- Scenario exercises show one step at a time: first situation, then short `Why?`.
- Selected scenario is compact so the reason step does not become a long stacked
  quiz.
- `LessonScreen` footer was split out to keep UI files under the 300-line rule.

## Evidence used

- Retrieval practice improves durable learning: https://www.retrievalpractice.org/why-it-works
- Corrective feedback reduces learned lures and supports recall: https://link.springer.com/article/10.3758/MC.36.3.604
- Learning from errors needs low-stakes correction: https://www.columbia.edu/cu/psychology/metcalfe/PDFs/Learning%20from%20errorsAnnual%20ReviewMetcalfe2016.pdf
- Duolingo uses quick, bite-sized lessons and adaptive scaffolding: https://blog.duolingo.com/keeping-you-at-the-frontier-of-learning-with-adaptive-lessons/
- Apple feedback should be timely, clear, and proportional: https://developer.apple.com/design/human-interface-guidelines/feedback

## V1 acceptance bar

- No screen shows duplicate wrong-answer feedback.
- No wrong-answer state uses a large punitive red footer.
- No exercise step shows multiple unrelated tasks at once.
- Support is available without making the learner feel stuck.
- Telemetry can distinguish independent complete, supported complete, and skip.

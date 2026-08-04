# Recommendation

Ship one calm, deterministic lesson shell. Fixed top progress. One response area. Fixed bottom action area. State changes: choose -> Check -> teach feedback -> Continue or Try another way. Reversibility: two-way. V1 only.

# Evidence

- Duolingo adapts last exercises from learner performance, uses prior knowledge to scaffold new material, and states challenge plainly. Do same with transparent, bounded support. Do not copy hearts or streak pressure.
- Duolingo feedback explains specific error, correct form, and contrasting examples. Feedback must teach why, not only grade.
- Duolingo mistake practice targets earlier mistakes. V1 can capture bounded misconception/attempt data now; review queue later.
- Apple says use accurate determinate progress in one consistent location; small sessions know item count.
- React Native supports `progressbar`, `accessibilityValue`, roles, selected/disabled state, and live announcements. W3C requires specific correction guidance near failed control.

# V1 mechanics to implement

1. **Stable lesson frame**
   - Top: close, determinate bar, text `1 of 3`.
   - Below: one short outcome cue: `Practice: notice a thought pattern`.
   - Middle: one category engine. Bottom: action stays in same place.
   - Bar advances only after correct completion or explicit skip. Never animate fake advancement.

2. **Two-stage answer cadence**
   - Selection only changes selected state and enables `Check`.
   - `Check` evaluates once. Lock answer while feedback is visible.
   - Correct: quiet green/ink feedback panel, one-sentence why, `Continue`.
   - Not yet: warm neutral feedback panel, misconception-specific why, `Try another way`; no red failure label, no loss, no forced exit.
   - Selection haptic only on selection. Single success haptic only after correct check. Respect device settings; no haptic on wrong answer.

3. **Progressive support, not punishment**
   - Before answer: `Show a clue`, `Make easier`, `Skip for now` remain visible.
   - First miss: reveal clue automatically but leave learner control.
   - Second miss or `Make easier`: reduce choices to two and show one worked contrast/example.
   - Third miss: show concise correct reasoning, mark item `supported`, then let learner continue. Never loop indefinitely.
   - On retry, use configured changed variant when supplied; otherwise reset selection and retain teaching feedback. Do not repeat identical recognition item forever.

4. **Bounded adaptation contract**
   - Add config fields shared by every category: `goalLabel`, `clue`, `easierOptionIds`, `workedExample`, `retryVariantId`, `maxAttempts: 3`.
   - First-try correct: normal next item. Supported/skip: normal next item, tagged for future review. No surprise harder item in V1; new variants need authored validation.
   - Persist only `{ itemId, selectedIds, attemptCount, supportLevel, resolution, misconceptionCode }`. Never learner prose, diagnosis, symptom severity, or inferred condition.

5. **Accessible state feedback**
   - Progress: `accessibilityRole="progressbar"`, `accessibilityValue={{ min: 1, now, max }}`, label includes item count.
   - Choices: `role="radio"` / `radiogroup` for single choice, `checkbox` for multi-select; expose `selected`, `disabled`, and clear label.
   - Feedback: programmatically announce once after `Check`; attach correction to selected control where possible. Move focus to feedback or first actionable retry control. Do not use color/haptics as sole signal.
   - Keep tap targets large, label actions literally, preserve reduced-motion/default OS settings.

6. **Completion without dopamine loop**
   - Final screen: `Lesson complete` + one capability statement, e.g. `You practised spotting a thought pattern.`
   - One quiet check transition. No XP burst, confetti, countdown, lives, streak warning, leaderboard, or social comparison.
   - Offer `Done`; later product can surface spaced review from bounded evidence.

# Risks / don't do

- Do not call a response "wrong," "failed," or proof of a mental-health condition.
- Do not auto-advance after a miss. Do not demand free-text disclosure to proceed.
- Do not let `Make easier` only change text; reduce cognitive load materially.
- Do not turn skip into failure. Store skip separately from mastery.
- Do not add adaptive difficulty based on one answer or unvalidated clinical inference.
- Do not touch legacy `NodeEngine`, Supabase, migrations, or server telemetry in this decision.

# Sources

- Duolingo, [Adaptive lessons and scaffolding](https://blog.duolingo.com/keeping-you-at-the-frontier-of-learning-with-adaptive-lessons/)
- Duolingo, [Difficulty indicator transparency](https://blog.duolingo.com/duolingo-difficult-exercises/)
- Duolingo, [Explain My Answer](https://blog.duolingo.com/explain-my-answer-now-free/)
- Duolingo, [Practice tab and mistake review](https://blog.duolingo.com/guide-to-duolingo-practice-hub/)
- Apple, [Progress indicators](https://developer.apple.com/design/human-interface-guidelines/progress-indicators)
- Apple, [Feedback](https://developer.apple.com/design/human-interface-guidelines/feedback)
- React Native, [Accessibility](https://reactnative.dev/docs/accessibility)
- W3C WAI, [User notifications and correction guidance](https://www.w3.org/WAI/tutorials/forms/notifications/)

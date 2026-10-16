---
title: "Post-practice guided reflection prompt and text capture"
type: "feature"
ticket: "2"
created: "2026-10-15"
status: done
route: "full"
route_source: "auto"
review: "quick"
review_source: "pinned"
lenses_ran: ["quick"]
review_loop_iteration: 0
context:
  - "/Users/samuelprasad/Desktop/happy/journals/PRODUCT.md"
  - "/Users/samuelprasad/Desktop/happy/journals/DESIGN.md"
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** After completing a StarterPath practice, the flow exits directly without offering a relevant guided reflection prompt. Users cannot complete the CBT reflection step or record the mandatory `ReflectionContextV1` lineage to their private journal.

**Approach:** Present a dedicated, post-practice guided reflection UI upon completing a StarterPath exercise. Map the prompt to the authored StarterPath (`notice_the_anxiety_alarm` for Anxious Thoughts, `stress_small_next_step` for Overwhelmed), capture user text, save atomically via `saveGuidedReflection`, and visibly gate voice and photo inputs with clear boundary copy.

## Boundaries & Constraints

**Always:** Use authored prompts mapped to the active `StarterPathV1`; persist text reflections atomically using `saveGuidedReflection` with valid `ReflectionContextV1` lineage; provide honest privacy and non-diagnostic boundary copy; keep files under 300 lines.

**Never:** Do not enable unverified voice or photo transcription; do not call third-party LLMs or client AI directly; do not make clinical efficacy or diagnostic claims.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|---------------|----------------------------|----------------|
| HAPPY_PATH_ANXIOUS | User completes thought_catcher practice | Shows "Catch the Anxiety Alarm" prompt; text input enables save; saves atomic lineage | Alerts on network failure, allows retry |
| HAPPY_PATH_STRESS | User completes grounding_54321 practice | Shows "Grounding Next Step" prompt; text input enables save; saves atomic lineage | Alerts on network failure, allows retry |
| VOICE_OR_PHOTO_TAP | User taps voice or photo input button | Shows clear notice that voice/photo are deferred until privacy gates pass | Non-blocking alert/toast, keeps text input active |
| USER_SKIPS | User taps "Skip for now" | Dismisses reflection modal and returns to normal completion route | Clean dismiss without creating invalid lineage |

</frozen-after-approval>

## Code Map

- `src/domains/journal/ui/GuidedReflectionModal.tsx` -- modal component presenting the mapped reflection prompt, text input, gated media buttons, and privacy boundary copy.
- `src/screens/ExerciseFlowScreen/components/ExerciseCompletionContainer.tsx` -- handles exercise celebration and transitions to `GuidedReflectionModal` when StarterPath context is present.
- `src/screens/ExerciseFlowScreen/ExerciseFlowRunner.tsx` -- delegates completion & reflection rendering to keep runner under 300 lines.
- `src/locales/en/journal.json` -- localized copy for guided reflection prompts, buttons, and boundary statements.

## Tasks & Acceptance

**Execution:**
- [x] Add guided reflection strings to `src/locales/en/journal.json`.
- [x] Implement `src/domains/journal/ui/GuidedReflectionModal.tsx` with prompt resolution, text capture, and gated voice/photo.
- [x] Extract `src/screens/ExerciseFlowScreen/components/ExerciseCompletionContainer.tsx` from `ExerciseFlowRunner.tsx` to handle post-practice celebration and reflection handoff.
- [x] Integrate `ExerciseCompletionContainer` in `ExerciseFlowRunner.tsx`, reducing file size well below 300 lines.

**Acceptance Criteria:**
- Given a completed StarterPath practice session, when the user continues, the mapped guided reflection prompt is presented.
- Given the anxiety StarterPath, the "notice_the_anxiety_alarm" prompt is shown.
- Given the overwhelmed StarterPath, the "stress_small_next_step" prompt is shown.
- Given voice or photo options, they are visibly marked as deferred with privacy copy.
- Given user text input, tapping save writes the journal record and lineage atomically.

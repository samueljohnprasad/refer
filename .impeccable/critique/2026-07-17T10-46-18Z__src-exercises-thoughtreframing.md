---
target: thought reframing CBT exercise
total_score: 23
p0_count: 0
p1_count: 3
timestamp: 2026-07-17T10-46-18Z
slug: src-exercises-thoughtreframing
---
Method: dual-agent (A: 019f6fa9-bdf5-70e1-a72a-a7f874d3211f · B: 019f6fa9-d30e-72c1-aac5-8d0e15eb580d)

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Progress, loading, saving, and draft exit exist, but AI/transcription/save-card failures are not clearly surfaced in the target components. |
| 2 | Match System / Real World | 2 | The CBT sequence is credible, but the summary mixes a 1-10 pre-score with 0-100 post-score and presents both as percentages. |
| 3 | User Control and Freedom | 3 | Back, close, draft save, read-only mode, and edit answers are present; accepted suggestions lack a clear undo/recovery pattern beyond manual editing. |
| 4 | Consistency and Standards | 2 | The flow blends newer Sage/product primitives with legacy blue, orange, slate, emoji, and shadowed components. |
| 5 | Error Prevention | 1 | The belief-scale mismatch can produce misleading before/after deltas; evidence steps are skippable without enough consequence framing. |
| 6 | Recognition Rather Than Recall | 3 | The guided sequence carries context forward, but distortion selection still requires scanning many abstract concepts. |
| 7 | Flexibility and Efficiency | 2 | Voice input and suggestions help, but the long linear flow does not yet adapt for returning or activated users. |
| 8 | Aesthetic and Minimalist Design | 2 | Helper boxes, emojis, bright state colors, suggestion labels, chips, metrics, and summary sections create more noise than a premium CBT flow should carry. |
| 9 | Error Recovery | 2 | Save failures are handled at the flow level, but AI, transcription, and coping-card save recovery are thin or invisible. |
| 10 | Help and Documentation | 3 | The exercise explains CBT concepts, but guidance is uneven across steps and sometimes too assertive. |
| **Total** | | **23/40** | **Needs focused polish before it feels trustworthy and premium.** |

## Anti-Patterns Verdict

Does this look AI-generated? Not obviously in the broad landing-page sense. It does, however, show product slop at sensitive moments: explicit "AI Suggestions" labels, sparkle suggestion affordances, emoji helper cards, colored education boxes, and a celebratory summary tone that can feel generated rather than clinically steady.

LLM assessment: The therapeutic IA is strong, but the surface feels stitched from multiple eras of the product. `customSteps.tsx` reuses legacy ThoughtReframing components while newer exercise primitives sit around them. The result is not broken, but it lacks the quiet consistency users expect from a mental-health tool.

Deterministic scan: Assessment B ran `node .agents/skills/impeccable/scripts/detect.mjs --json src/exercises/thoughtReframing`. Exit code `0`, result `[]`, total findings `0`. No detector rule names, file locations, or false positives.

Visual overlays: No reliable user-visible overlay is available. The target is an Expo/React Native source directory, not a direct DOM URL. Browser visualization would require launching the Expo app and navigating to `/tabs/screens/exercise-flow` with the thought-reframing route params, which was outside this critique run. Fallback signal used: static detector plus source review.

## Overall Impression

The exercise has the right CBT backbone: situation, automatic thought, belief intensity, emotions, thinking traps, evidence, balanced thought, and re-evaluation. The biggest opportunity is trust. Right now the user can feel the machinery: AI labels, legacy visual treatments, overloaded choice steps, and a summary metric that can be numerically wrong.

## What's Working

- The core therapeutic flow is sound. The steps in `src/exercises/thoughtReframing/config.ts` follow a recognizable CBT reframing arc.
- Blank-page anxiety is handled well through voice input and starting suggestions.
- The outer `ExerciseFlowScreen` provides important control: close, back, draft save, completion save, read-only mode, and edit answers.

## Priority Issues

**[P1] Belief scoring is internally inconsistent**

Why it matters: The initial score starts at `50`, then the first slider is configured as `1-10` with no unit in `src/exercises/thoughtReframing/config.ts`. The re-evaluation slider is `0-100%`, and the summary prints both `preScore` and `postScore` as percentages in `ThoughtReframingSummary.tsx`. A user can end up seeing a false distress increase or decrease, which undermines trust at the exact completion moment.

Fix: Make both belief scores use the same scale. Prefer `0-100` for both if the summary keeps percentages, or `1-10` for both if the UI wants a CBT rating scale. Add migration/display normalization for existing entries before calculating deltas.

Suggested command: `$impeccable polish src/exercises/thoughtReframing`

**[P1] The flow exposes AI at moments that should feel therapeutically held**

Why it matters: Labels such as "AI Suggestions", "AI highlighted", sparkle examples, and "Reframing with Sage..." make the user feel handed to a model instead of held by the product. For CBT and mental health, that weakens perceived safety.

Fix: Replace user-facing AI labels with product language: "Starting points", "Possible matches", "Suggested patterns", or "Try one". Keep AI provenance in a subtle info affordance or settings-level disclosure, not as the primary label in the exercise.

Suggested command: `$impeccable clarify src/exercises/thoughtReframing`

**[P1] Emotion and distortion steps ask too much of an activated user**

Why it matters: The emotion step shows the full emotion set while asking for max 3. The distortion step shows many concept cards, examples, AI explanations, disabled states, and selection rules at once. This turns a stressful self-reflection into a diagnostic scan task.

Fix: Show the 2-3 suggested items first, then a quiet "More options" expansion. For distortions, group options into plain-language clusters and reveal definitions/examples after selection or on demand.

Suggested command: `$impeccable distill src/exercises/thoughtReframing`

**[P2] Visual vocabulary drifts away from calm premium CBT**

Why it matters: Blue helper cards, orange warning cards, emoji icons, bright green chips, slate components, rounded legacy cards, and Sage summary pieces compete with one another. The UI reads more like a gamified lesson than a calm reflection tool.

Fix: Standardize all hints, psychoeducation, suggestions, selected states, and empty/skip notes on one restrained Sage/neutral vocabulary. Remove emoji from instructional chrome unless it is part of a deliberate brand asset system.

Suggested command: `$impeccable quieter src/exercises/thoughtReframing`

**[P2] Accessibility and recovery states need a harder pass**

Why it matters: Suggested status is sometimes represented by a tiny colored dot, disabled states rely heavily on opacity, summary animations do not show an obvious reduced-motion branch in the target file, and coping-card save has no visible loading/error state.

Fix: Add text/state labels for suggestions, non-color indicators for selected/suggested/disabled states, reduced-motion alternatives for summary reveals, and explicit loading/error feedback for transcription, AI suggestions, and coping-card save.

Suggested command: `$impeccable audit src/exercises/thoughtReframing`

## Persona Red Flags

**Jordan, first-time CBT user:** Jordan gets a strong step-by-step path, but the distortion step still asks them to choose from many abstract patterns. The copy says "thinking trap", which helps, but the card grid still feels like self-diagnosis.

**Sam, accessibility-dependent user:** Sam may miss AI-suggested emotions because the indicator is a small colored dot. Disabled options fade out, which can reduce readability. Summary animation and custom pressable states need screen-reader and reduced-motion verification.

**Casey, interrupted mobile user:** Casey benefits from draft save and voice input, but the flow is long and dense. The "Keep the momentum going" CTA appears immediately after a demanding reflection and may compete with completion relief.

**Project-specific persona, anxious user in a high-distress moment:** This user needs the interface to be calm, literal, and nonjudgmental. "Distress dropped", "rational mind got louder", and incorrect score deltas can make them feel graded instead of accompanied.

## Minor Observations

- "Stick to facts a camera could capture" is one of the strongest pieces of copy in the flow.
- "Let's Go" is too energetic for this context. "Begin" or "Start" would fit better.
- `StepTitle` duplicates shared heading hierarchy and contributes to component drift.
- Evidence-for being skippable can be clinically reasonable, but the skip state should explain that continuing is okay.
- The balanced thought card is the right summary anchor; keep it as the emotional peak, but make score movement secondary.

## Questions to Consider

- What if the exercise never said "AI" during the flow and presented suggestions as quiet starting points?
- What if the distortion step taught one likely pattern first instead of asking the user to scan the whole list?
- What if the summary celebrated completion, clarity, and willingness rather than distress reduction?
- What should the screen feel like for someone using it while actively upset, not calmly completing a lesson?

---
target: thought reframing CBT exercise
total_score: 27
p0_count: 0
p1_count: 2
timestamp: 2026-07-17T11-36-55Z
slug: src-exercises-thoughtreframing
---
Method: dual-agent (A: 019f6fd8-9d09-7cf1-9b89-3b7a3216f1a1 · B: 019f6fd8-c2f4-7f70-a49e-af56412ff881)

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Loading and generated-helper states are calmer now, but disabled Continue states still do not explain what is missing. |
| 2 | Match System / Real World | 3 | The CBT flow is understandable, but some copy still feels forceful or metaphor-heavy for a vulnerable reflection moment. |
| 3 | User Control and Freedom | 3 | Progressive disclosure helps, but suggestion actions still risk feeling like shortcuts instead of editable drafts. |
| 4 | Consistency and Standards | 3 | Components now share more consistent Sage/neutral language; input affordance still feels more like chat than journaling. |
| 5 | Error Prevention | 2 | The flow prevents progression, but does not always explain the requirement in context before the user stalls. |
| 6 | Recognition Rather Than Recall | 3 | Emotion/distortion options are easier to scan after caps and show-more behavior. |
| 7 | Flexibility and Efficiency | 2 | Suggested content helps speed, but the action language needs more agency and clearer draft framing. |
| 8 | Aesthetic and Minimalist Design | 3 | Major overload was reduced; summary and helper regions still accumulate a little too much decoration and motion. |
| 9 | Error Recovery | 2 | AI unavailable/error paths are not yet explicit enough around generated suggestions. |
| 10 | Help and Documentation | 3 | The exercise explains itself better, but per-step requirement guidance is still too implicit. |
| **Total** | | **27/40** | **Improved, still needs hardening** |

## Anti-Patterns Verdict

**LLM assessment**: This no longer reads like a generic AI-generated CBT form at first glance. The worst previous tells were addressed: belief scoring is now coherent, the user-facing AI labeling is softer, and emotion/distortion selection is less overwhelming. The remaining product-slop risk is subtler: the flow sometimes relies on disabled controls without local explanation, suggestion cards still imply authority, and the writing input still carries chat-app energy instead of reflective journaling energy.

**Deterministic scan**: The bundled detector returned zero findings for the thought-reframing exercise files and related components. No deterministic AI-slop rules were triggered.

**Visual overlays**: No reliable user-visible overlay is available. Browser visualization was attempted, but the bundled Playwright Chromium executable was missing and system Chrome aborted in the sandbox. A local Expo listener was detected on port 8081, but sandboxed curl could not connect, so no overlay injection was performed.

## Overall Impression

The exercise is meaningfully better after the fix pass. The structure now supports a safer CBT arc: identify, soften, test, rewrite, and compare belief without overpromising. The single biggest remaining opportunity is guidance at the moment of hesitation: when a user cannot continue, when a suggestion appears, or when generated help fails, the interface needs to state exactly what is happening and preserve the user's agency.

## What's Working

- The 0-100% belief model is now coherent across config, migration, step copy, and summary. This removes a real therapeutic and product trust break.
- Emotion and distortion choices are less overwhelming because generated/suggested items are capped and progressively disclosed.
- The summary handles outcomes more responsibly by avoiding a simplistic "lower is always better" framing and supporting non-linear reflection.

## Priority Issues

**[P1] Disabled Continue lacks in-context explanation**

**Why it matters**: A CBT exercise is already cognitively demanding. If the primary action disables without saying what is missing, users have to infer the rule while reflecting on a difficult thought.

**Fix**: Add inline requirement text near the primary action or the active field. Examples: "Write a few words to continue", "Choose at least one emotion", "Pick one pattern or skip if none fit", and "Add one fairer thought." The message should update live and avoid alert-only recovery.

**Suggested command**: `$impeccable harden src/exercises/thoughtReframing`

**[P1] Suggestions still invite over-trust**

**Why it matters**: In mental-health UX, generated or prewritten suggestions must not feel like conclusions. "Use" and "Starting points" can still nudge a vulnerable user toward accepting external wording as truth.

**Fix**: Rename suggestion actions to "Use as draft" or "Try as draft". Add a short line above generated suggestions: "These are prompts, not conclusions." Add explicit unavailable/error states that invite manual writing instead of hiding the failure.

**Suggested command**: `$impeccable clarify src/exercises/thoughtReframing`

**[P2] Therapeutic tone is occasionally too forceful**

**Why it matters**: Copy such as "forces it", "replace the original", "thinking trap", and playful metaphors can make the interface feel corrective rather than collaborative.

**Fix**: Shift to agency language: "helps widen the frame", "write a fairer thought alongside the original", "pattern", and "protective shortcut." Keep the user's original thought valid as context rather than something to defeat.

**Suggested command**: `$impeccable quieter src/exercises/thoughtReframing`

**[P2] Input component feels like chat UI, not reflective CBT writing**

**Why it matters**: The current glowing/chat-style input framing can make the exercise feel like messaging the app instead of writing a reflection for oneself.

**Fix**: Use a quiet multiline field with stable height, subdued focus state, clear voice affordance, and reduced-motion behavior. Reserve glow or pulse only for active recording.

**Suggested command**: `$impeccable layout src/exercises/thoughtReframing`

**[P3] Summary still has minor visual accumulation**

**Why it matters**: The final screen should feel settled. Too many badges, pills, helper details, mascot treatment, and staggered motion can make the ending feel busier than the reflection it summarizes.

**Fix**: Reduce the summary to a clearer hierarchy: original belief, updated belief, balanced thought, and one optional next step. Minimize badges and make reduced motion the simpler default.

**Suggested command**: `$impeccable polish src/exercises/thoughtReframing`

## Persona Red Flags

**Jordan (First-Timer)**: On a stalled step, Jordan sees a disabled Continue but may not know whether the missing requirement is word count, selection count, AI loading, or an optional field. This creates avoidable friction during the primary flow.

**Riley (Vulnerable Reflector)**: Riley may read generated suggestions as endorsed conclusions if the action says "Use" or the section title implies expert help. The interface needs stronger draft framing and clearer agency language.

**Alex (Power User)**: Alex benefits from generated options, but the flow does not yet make manual bypass and AI-unavailable states explicit enough. Fast completion should not depend on generated content feeling available or authoritative.

## Minor Observations

- `StepShell` accepts props that are not all used in the current step composition.
- `VoiceTextInput` and `BulletListInput` still have signs of prior component vocabulary that could be simplified in a focused pass.
- The summary's left-border treatment should be checked against the side-stripe guidance if it is a colored emphasis stripe rather than a normal border.
- Alert-based recovery plus inline error copy may be duplicative; prefer inline where possible for this reflective flow.

## Questions to Consider

- What exact requirement should a user see when Continue is disabled on each step?
- Should generated text ever have a one-tap "Use" action, or should every action explicitly say "draft"?
- Is the exercise trying to feel like a guided worksheet, a compassionate coach, or a quiet journal?

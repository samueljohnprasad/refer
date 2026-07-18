---
target: Evidence for this thought screen
total_score: 26
p0_count: 0
p1_count: 2
timestamp: 2026-07-17T20-24-00Z
slug: ughtreframing-customsteps-tsx-evidence-for-thought
---
⚠️ DEGRADED: single-context (spawn_agent unavailable in this session)

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Progress and button state visible; added-evidence state is not obvious in screenshot. |
| 2 | Match System / Real World | 2 | Suggested sentence is a prediction, not observable evidence. |
| 3 | User Control and Freedom | 3 | Close, Back, voice, manual input, and skip path exist. |
| 4 | Consistency and Standards | 3 | Visual system coherent; two sage callouts duplicate one role. |
| 5 | Error Prevention | 2 | AI suggestion can reinforce the thought while UI calls it factual evidence. |
| 6 | Recognition Rather Than Recall | 3 | Main actions visible; plus icon meaning depends on input state. |
| 7 | Flexibility and Efficiency | 3 | Suggestion, typing, voice, and skip support several paths. |
| 8 | Aesthetic and Minimalist Design | 2 | Four instruction layers compete before writing begins. |
| 9 | Error Recovery | 2 | Voice recovery exists in code; suggestion quality has no visible reject/report affordance. |
| 10 | Help and Documentation | 3 | Contextual help present, but repeated and internally inconsistent. |
| **Total** | | **26/40** | **Acceptable; significant fixes needed** |

## Anti-Patterns Verdict

**LLM assessment**: Mild AI-made feel. Cause is not palette or typography. Cause is over-explanation: subtitle, helper card, section helper, and bottom reassurance all restate one instruction. Two pale sage callouts frame ordinary copy as separate insights. Screen feels generated from component blocks instead of edited around one user decision.

**Deterministic scan**: Clean. `detect.mjs` returned zero findings for `customSteps.tsx` and `SuggestionCards.tsx`. Detector confirms no banned code-pattern slop; it cannot judge semantic contradiction in AI content or footer clipping.

**Visual overlays**: Not available. Target is native Expo screen, not browser DOM. Supplied screenshot used as visual evidence.

## Overall Impression

Calm foundation, good type, clear primary action. Biggest opportunity: make screen one focused act: inspect factual suggestion, then add own fact. Current UI teaches "facts only" while presenting a non-fact as evidence.

## What's Working

- Serif title plus Geist body gives reflective but operational hierarchy.
- Input is large, thumb-friendly, and supports typing plus voice.
- Persistent Continue and Back controls make flow location predictable.

## Priority Issues

### [P1] AI suggestion violates evidence rule

**Why it matters**: "They're not going to understand me, they're not going to believe me" is mind-reading and prediction. Presenting it under "Possible evidence" can strengthen distortion during CBT exercise.

**Fix**: Validate generated suggestions before display. Only show observable events or direct statements. Label source as "Suggested fact" only after validation. When suggestion is uncertain, show "Not enough factual detail" and prompt user for what happened, who said what, or what was observed.

**Suggested command**: `$impeccable harden`

### [P1] Bottom note is clipped by fixed footer

**Why it matters**: Skip reassurance is key permission for users who cannot find supporting evidence. Screenshot cuts it off, making content look broken and hiding full meaning.

**Fix**: Give scroll content bottom inset equal to footer height plus safe area. Keep note fully above footer at smallest supported viewport and with Dynamic Type.

**Suggested command**: `$impeccable adapt`

### [P2] Instruction stack repeats one idea four times

**Why it matters**: User must parse title subtitle, helper card, section label helper, and skip note before acting. This raises cognitive load during already emotional task.

**Fix**: Keep title and one sentence: "Add only what actually happened." Remove top helper card and section helper. Keep skip permission near primary action or encode it in button label when empty.

**Suggested command**: `$impeccable distill`

### [P2] Suggested evidence and manual evidence feel disconnected

**Why it matters**: "Add" sits far from text and selected state is unclear. User cannot quickly tell whether suggestion entered list, especially when Continue is already enabled.

**Fix**: Make suggestion a compact selectable row with explicit unselected/added state. On tap, move it into editable evidence list or change action to "Added" with checkmark and Undo.

**Suggested command**: `$impeccable clarify`

## Cognitive Load

Moderate: 3 checklist failures. Single task and visible controls pass. Minimalism, grouping, and hierarchy fail because same guidance appears in multiple containers. No decision point exceeds four visible options.

## Emotional Journey

Entry feels calm. Emotional valley appears when app supplies user's feared prediction as "evidence," which may feel like confirmation. Exit reassurance exists but is visually clipped. Best ending should grant permission: having little evidence is useful information, not failure.

## Persona Red Flags

**Jordan, first-timer**: Reads every instruction, then sees conflict between "factual" and speculative AI sentence. Unsure whether Add records truth or merely copies suggestion.

**Sam, accessibility-dependent**: Icon controls have labels in code and 44pt targets, good. Low-contrast placeholder needs measured AA check. Bottom note risks loss under footer and Dynamic Type.

**Casey, distracted mobile user**: Primary action is reachable. Repeated copy delays scanning; clipped optional-state guidance is easy to miss. Voice path helps reduce typing.

## Minor Observations

- "Facts can be strong, weak, or incomplete" weakens factual standard; facts may be incomplete, but "weak fact" is fuzzy.
- Top helper card and bottom note use same sage treatment for different jobs.
- Input placeholder is long and visually faint.
- Plus icon is standard enough, but action becomes clearer when draft text exists.

## Questions to Consider

- Should AI generate candidate facts at all, or ask concrete follow-up questions before suggesting one?
- When no evidence exists, should primary button say "No evidence found" instead of "Skip"?
- Can one sentence teach both factuality and permission to leave blank?

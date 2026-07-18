---
target: screenshots / src/exercises/thoughtReframing/customSteps.tsx automatic thought
total_score: 28
p0_count: 0
p1_count: 2
timestamp: 2026-07-17T15-29-21Z
slug: src-exercises-thoughtreframing-customsteps-tsx
---
Method: dual-agent assessment

Design Health Score
| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Progress and disabled Continue are visible; step context is minimal. |
| 2 | Match System / Real World | 3 | CBT intent fits; “Automatic thought” is still clinical for first-timers. |
| 3 | User Control and Freedom | 3 | Back and close exist; accidental suggestion replacement lacks explicit undo. |
| 4 | Consistency and Standards | 3 | Components are consistent; voice control feels like a separate interaction model. |
| 5 | Error Prevention | 3 | Disabled CTA prevents empty advance; validation copy is vague. |
| 6 | Recognition Rather Than Recall | 3 | Suggestions reduce blank-page pressure but can over-anchor. |
| 7 | Flexibility and Efficiency | 3 | Use and voice are efficient, but optional tools are too prominent. |
| 8 | Aesthetic and Minimalist Design | 2 | Too much guidance and too many suggestions appear before the input. |
| 9 | Error Recovery | 2 | Voice failure and accidental suggestion use are recoverable but unclear. |
| 10 | Help and Documentation | 3 | Helper copy is useful; missing plain-language framing of “automatic thought.” |
| **Total** | | **28/40** | **Solid; hierarchy and emotional safety need work.** |

Anti-Patterns Verdict
- LLM assessment: not obvious AI slop. The screen is calm and product-grade. The tell is a predictable mental-health template: sage rounded helper card, suggestion list, input below, disabled CTA.
- Deterministic scan: clean. Detector returned [] for the inspected source.
- Source/runtime evidence: screenshots match TRAutomaticThoughtStep in src/exercises/thoughtReframing/customSteps.tsx. Suggestions render before input while invalid at lines 393, 416, and 431. Voice is visible by default through VoiceTextInput and GlowyInput.
- Visual overlays: skipped because the target was static screenshots, not a live URL or mutable DOM.

Overall Impression
The emotional tone is mostly right, but the hierarchy is backwards for a vulnerable step. The screen should ask the user for their own thought first, then offer starting points if they freeze. Right now, three harsh thoughts appear before the user has written anything, which can prime distress and make the app feel like it is suggesting what to feel.

What's Working
- The helper card gives useful permission to write harsh or dramatic thoughts without shame.
- The suggestions reduce blank-page anxiety for users who are stuck.
- The visual system is calm: restrained color, readable type, and enough spacing.

Priority Issues
1. [P1] Input comes too late.
   - Why it matters: the user’s own thought should be the hero. Placing examples first makes the exercise feel like choosing from AI-generated fears.
   - Fix: move VoiceTextInput above suggestions; put suggestions behind “Need a starting point?” below the input.
   - Suggested command: $impeccable layout

2. [P1] Suggestions may prime distress.
   - Why it matters: seeing “I’ll never be able to do this” before typing can intensify anxiety or bias the user’s answer.
   - Fix: hide harsh examples by default; reveal only on request, or show one softer scaffold such as “Try starting with: ‘I’m worried that…’”.
   - Suggested command: $impeccable distill

3. [P2] Voice affordance lacks trust context.
   - Why it matters: voice input inside a mental-health field raises privacy concerns if it appears without explanation.
   - Fix: hide voice until focus, add a visible “Speak” label, or add a privacy cue before recording.
   - Suggested command: $impeccable harden

4. [P2] Validation is too generic.
   - Why it matters: “Write a few words” says length, not what counts as an automatic thought.
   - Fix: use specific, warmer guidance: “A short phrase is enough — for example, ‘I’m going to mess this up.’”
   - Suggested command: $impeccable clarify

5. [P3] Section hierarchy is flat.
   - Why it matters: “Starting points,” helper text, rows, input, voice, validation, Continue, and Back all compete.
   - Fix: reduce suggestion heading weight and collapse examples until needed.
   - Suggested command: $impeccable layout

Persona Red Flags
- Jordan: may not understand “automatic thought” without a plain-language gloss; examples may look like expected answers.
- Sam: the voice button has an accessibility label, but no visible label; focus and replacement behavior need clearer recovery.
- Casey: the input falls partly below the fold; suggestions consume attention before the actual task.

Minor Observations
- “Write the thought in its own words” sounds detached; “Use the exact words your mind used” is stronger.
- Repeated “Use” actions are small and visually mechanical.
- Disabled Continue is clear but close to looking merely low-priority.

Questions to Consider
- Should the screen ask the user to write first, then rescue them if they freeze?
- What if examples were emotional support, not the first interaction?
- What would make this feel like a therapist’s pause instead of a form step?

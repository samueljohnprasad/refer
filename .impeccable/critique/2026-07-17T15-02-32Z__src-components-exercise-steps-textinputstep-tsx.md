---
target: screenshot / src/components/exercise/steps/TextInputStep.tsx
total_score: 23
p0_count: 0
p1_count: 3
timestamp: 2026-07-17T15-02-32Z
slug: src-components-exercise-steps-textinputstep-tsx
---
Method: dual-agent assessment

Design Health Score
| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 2 | Progress exists, but current step context and AI state are unclear. |
| 2 | Match System / Real World | 3 | The prompt is understandable; suggestions drift away from camera-observable facts. |
| 3 | User Control and Freedom | 2 | Close exists, but the write-your-own path is visually buried. |
| 4 | Consistency and Standards | 2 | Screenshot does not match current source order, copy, or suggestion behavior. |
| 5 | Error Prevention | 2 | Suggestions may teach users to write interpretations instead of situations. |
| 6 | Recognition Rather Than Recall | 3 | Examples help, but dominate before the user asks for them. |
| 7 | Flexibility and Efficiency | 2 | Use actions are efficient, but self-authored input is lower priority. |
| 8 | Aesthetic and Minimalist Design | 2 | Blue callout plus three AI suggestions overload the first step. |
| 9 | Error Recovery | 2 | No visible validation or recovery state in the artifact. |
| 10 | Help and Documentation | 3 | Contextual guidance is useful, but over-presented. |
| **Total** | | **23/40** | **Acceptable; source/runtime mismatch and hierarchy need correction.** |

Anti-Patterns Verdict
- LLM assessment: borderline AI slop. The screen is calm, but the blue lightbulb card, “AI Suggestions” label, sparkle icons, and three polished suggestions before input make it feel generated rather than therapeutic.
- Deterministic scan: clean. Detector returned [] for current source.
- Source/runtime mismatch: current source puts input first, collapses examples behind “Need an example?”, uses a quiet camera row, and has updated situation copy. The screenshot still shows the old blue callout and visible suggestions.
- Visual overlays: skipped because the target was a static screenshot, not a live URL or mutable DOM.

Overall Impression
The screenshot is not a small polish problem; it is the old hierarchy leaking back into the runtime. The main issue is authorship: users should write their real situation first, then ask for help if they need examples.

What's Working
- “What happened?” is plain and emotionally accessible.
- The camera-facts concept is clinically useful.
- The palette and typography are calm enough for a CBT flow.

Priority Issues
1. [P1] AI suggestions steal authorship.
   - Why it matters: stressed users may choose a synthetic answer instead of naming their actual moment.
   - Fix: input first; examples only behind “Need an example?” or after hesitation.
   - Suggested command: $impeccable distill

2. [P1] Source/runtime mismatch.
   - Why it matters: source has the intended fix, but the rendered app still shows old UI; design critique cannot be trusted until runtime matches code.
   - Fix: restart Metro/dev client, clear cache if needed, and verify the rendered screen uses current source.
   - Suggested command: $impeccable audit

3. [P1] Suggestions violate the instruction.
   - Why it matters: examples like “I’m feeling overwhelmed” are internal states, not camera facts.
   - Fix: constrain suggestions to observable events only: who, what, where, when, exact words/actions.
   - Suggested command: $impeccable clarify

4. [P2] Blue lightbulb callout feels generic.
   - Why it matters: it reads as SaaS help chrome instead of calm therapeutic guidance.
   - Fix: use the current source’s quieter camera guidance row, or remove the icon entirely.
   - Suggested command: $impeccable quieter

5. [P2] Primary input is too low.
   - Why it matters: on mobile, the user cannot immediately act; they must process AI content before writing.
   - Fix: place the input directly below the prompt; move all examples below or behind disclosure.
   - Suggested command: $impeccable layout

Persona Red Flags
- Jordan: may think the task is to choose an AI suggestion, not describe their own real situation.
- Sam: screen-reader flow hits repeated “Use” actions before the input, delaying the main task.
- Casey: likely taps a suggestion just to move on because the input starts below the visible fold.

Minor Observations
- “AI Suggestions” is product-language; “Examples” or “If you’re stuck” is more therapeutic.
- Sparkle emoji trivializes serious distress.
- The top progress bar is visible but the step label is absent in the screenshot.

Questions to Consider
- Should AI examples appear only after the user taps for help?
- Should this step optimize for self-authorship over speed?
- Would a therapist offer three example answers before asking the client what happened?

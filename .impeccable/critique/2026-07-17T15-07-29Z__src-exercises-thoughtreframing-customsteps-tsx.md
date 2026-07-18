

---
target: screenshot / src/exercises/thoughtReframing/customSteps.tsx
total_score: 27
p0_count: 0
p1_count: 2
timestamp: 2026-07-17T15-07-29Z
slug: src-exercises-thoughtreframing-customsteps-tsx
---
Method: dual-agent assessment

Design Health Score
| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Progress, counter, and validation exist; progress lacks explicit step context. |
| 2 | Match System / Real World | 3 | The situation prompt is plain; validation copy feels evaluative. |
| 3 | User Control and Freedom | 3 | Close/back are visible; undo after selecting an example is not explicit. |
| 4 | Consistency and Standards | 2 | Input, mic, examples, validation, and CTA use mixed affordances. |
| 5 | Error Prevention | 3 | Character limit and validation help; criteria are still partly opaque. |
| 6 | Recognition Rather Than Recall | 3 | Examples support users; icon-only voice action is ambiguous. |
| 7 | Flexibility and Efficiency | 2 | Valid users still process examples and secondary actions. |
| 8 | Aesthetic and Minimalist Design | 3 | Calm and readable, but lower half is busier than the task requires. |
| 9 | Error Recovery | 2 | Replacing typed content with an example lacks clear recovery. |
| 10 | Help and Documentation | 3 | Inline guidance works, but there is too much coaching after validity. |
| **Total** | | **27/40** | **Good foundation; hierarchy polish needed.** |

Anti-Patterns Verdict
- LLM assessment: mostly passes the AI slop test. It feels like a real calm CBT app, not obvious generated UI. The remaining tell is over-coaching: tip, input, counter, validation, examples, mic, Continue, and Back all compete on a simple sentence step.
- Deterministic scan: clean. Detector returned [] for the inspected source.
- Source evidence: screenshot maps to src/exercises/thoughtReframing/customSteps.tsx, not thoughtCatcher TextInputStep. Matching source includes the subtitle at line 294, tip at line 297, input max length at line 304, validation at line 314, and examples at lines 227-230.
- Visual overlays: skipped because the target was a static screenshot, not a live URL or mutable DOM.

Overall Impression
This is a strong improvement over the earlier AI-suggestion-heavy version. The screen now has the right therapeutic shape: ask for one concrete moment, validate gently, and let the user continue. The main problem is that once the user has a valid answer, the screen still keeps teaching, offering examples, and showing secondary controls. It should trust the user sooner.

What's Working
- The title and subtitle are low-friction: “What happened?” plus “A simple sentence is enough.” removes performance pressure.
- The camera-facts hint is direct and clinically aligned without sounding technical.
- The visual system is restrained: sage, white space, readable text, and no red/error framing.

Priority Issues
1. [P1] Examples compete after the user has already answered.
   - Why it matters: the user has entered a valid personal situation, but the UI still asks them to compare examples, including a duplicate selected row.
   - Fix: collapse or fade examples once the input is valid; keep them behind “Need an example?” only when empty or invalid.
   - Suggested command: $impeccable distill

2. [P1] Validation copy can feel like grading.
   - Why it matters: mental-health users may read “Factual enough” as judgment of correctness.
   - Fix: use warmer confirmation copy: “Good — this names what happened.” or “That’s enough to work with.”
   - Suggested command: $impeccable clarify

3. [P2] Voice/mic affordance is ambiguous.
   - Why it matters: the waveform icon can read as playback, recording, or listening. In a private CBT field, ambiguity creates trust friction.
   - Fix: label it, use a clearer microphone icon, or hide voice input unless explicitly enabled.
   - Suggested command: $impeccable harden

4. [P2] CTA feels heavy for a reflective moment.
   - Why it matters: the large, shadowed Continue button makes the final state feel more transactional than therapeutic.
   - Fix: reduce shadow/depth and make the input/status remain the emotional center.
   - Suggested command: $impeccable quieter

5. [P2] Counter is visually detached.
   - Why it matters: 36/400 floats as a mechanical constraint rather than a quiet input affordance.
   - Fix: tuck the counter into the input footer or hide it until 80% of max length.
   - Suggested command: $impeccable layout

Persona Red Flags
- Jordan: may interpret “Factual enough” as a correctness test rather than reassurance.
- Sam: icon-only voice control lacks enough meaning without a label; example replacement needs clear announcement/recovery.
- Casey: after writing a valid sentence, the visible examples add friction before Continue.

Minor Observations
- Back appears visually disabled because it is gray, even if it is tappable.
- The selected example duplicates the typed answer and adds little value.
- The close icon may be small for a stressed one-handed user.
- If examples remain visible, “Examples” should probably become “Need a starting point?” before selection.

Questions to Consider
- Should examples disappear the moment the user has a valid answer?
- Is the app validating the sentence, or validating the person?
- Does voice input need to be present on the first CBT field, or should it be opt-in?

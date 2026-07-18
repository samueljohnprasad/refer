---
target: screenshot / src/components/exercise/steps/TextInputStep.tsx
total_score: 28
p0_count: 0
p1_count: 2
timestamp: 2026-07-17T06-56-18Z
slug: src-components-exercise-steps-textinputstep-tsx
---
Method: dual-agent assessment

Score: 28/40
P0: 0
P1: 2

Verdict
- Improved from the earlier AI-suggestion slop: the screen is calmer, clearer, and more clinically coherent.
- Remaining slop risk is visual, not conceptual: the blue bordered tip is over-promoted and reads like a generic wellness-app callout.
- The actual task is “write the situation”; the instruction card currently competes with that task before the input appears.

Detector
- Command: node .agents/skills/impeccable/scripts/detect.mjs --json src/components/exercise/steps/TextInputStep.tsx src/components/exercise/SuggestionCards.tsx src/screens/ThoughtReframingScreen/components/StepHeader.tsx src/components/GlowyInput.tsx
- Result: []
- Findings: 0

Priority Issues
1. P1 — Tip callout is too loud.
   - The blue tint, border, icon, and large rounded box make helper text feel like the primary component.
   - Fix: convert it to quiet inline guidance, likely sage/neutral, smaller padding, no blue outline.
   - Command: $impeccable quieter

2. P1 — Progress/control context is weak in the cropped screen.
   - The question is clear, but users lack immediate orientation: where am I in the exercise, and can I exit/edit safely?
   - Fix: keep a compact progress indicator and close affordance visually present above the title.
   - Command: $impeccable layout

3. P2 — Subtitle and tip partially duplicate each other.
   - Subtitle says “describe the situation”; tip says “stick to facts.” Good distinction, but still same semantic zone.
   - Fix: make subtitle outcome-focused and tip method-focused.
   - Suggested subtitle: “Name the moment that set this off.”
   - Suggested tip: “Use camera facts: what happened, where you were, and what was said.”
   - Command: $impeccable clarify

4. P2 — The tip needs one concrete example.
   - “Camera could capture” is strong, but some users will still write interpretations.
   - Fix: add a tiny contrast example if space allows: “He didn’t reply for 3 hours,” not “He ignored me.”
   - Command: $impeccable clarify

5. P3 — Lightbulb icon is generic.
   - The lightbulb says “idea,” not “observe facts.”
   - Fix: use a camera/eye/document symbol, or remove the icon entirely.
   - Command: $impeccable polish

Persona Red Flags
- Jordan: needs one example to understand the difference between fact and meaning.
- Sam: needs the guidance semantically tied to the input, not presented as a separate promo card.
- Casey: loses above-the-fold writing space to instructional chrome.

Questions Skipped
- Findings are narrow and actionable; no clarification needed before a small visual/copy pass.

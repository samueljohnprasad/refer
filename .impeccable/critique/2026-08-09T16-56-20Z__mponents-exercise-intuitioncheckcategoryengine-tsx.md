---
target: "Image #1 / IntuitionCheckCategoryEngine.tsx"
total_score: 24
p0_count: 0
p1_count: 2
timestamp: 2026-08-09T16-56-20Z
slug: mponents-exercise-intuitioncheckcategoryengine-tsx
---
Method: dual-agent (A: /root/critique_design · B: /root/critique_detector)

## Anti-Patterns Verdict

**Does it look AI-generated?** Moderately. It avoids the worst tells such as sparkles, gradients on text, nested cards, and noisy decoration. The broader composition still reads as a generic premium-wellness template: parchment background, orange tactile CTA, heavy serif title, pill options, and a large empty middle. More importantly, the interaction uses a familiar AI-course trick: it calls the choice subjective while making the preferred answer obvious.

**Deterministic scan:** The Impeccable detector returned exit code 0 with zero findings for `IntuitionCheckCategoryEngine.tsx`. That is useful but incomplete. The single-file scan cannot judge biased answer framing, imported option/button styles, the fixed lesson footer, runtime reveal announcements, or visual identity drift. The manual review therefore found material UX issues that sit outside the detector's syntax rules.

**Visual overlays:** None. This is a native React Native iOS screen, not a DOM page, so browser injection would not create a trustworthy overlay. The supplied 396×774 screenshot was used as the visual fallback.

## Design Health Score

| # | Heuristic | Score | Key issue |
|---|---|---:|---|
| 1 | Visibility of system status | 3 | Progress and selection states are visible, but the inline reveal is not announced to assistive technology. |
| 2 | Match system / real world | 2 | Plain overall, but “sleep lever shifted” appears before the learner knows the lever model. |
| 3 | User control and freedom | 2 | Close and Skip exist, but one tap immediately locks the answer with no revision path. |
| 4 | Consistency and standards | 2 | Shared components help; parchment, orange, Georgia, and gradient progress drift from Happy's sage/Geist system. |
| 5 | Error prevention | 2 | Options are large, but an accidental tap becomes irreversible. |
| 6 | Recognition rather than recall | 3 | Choices stay visible, yet one choice requires unlearned course vocabulary. |
| 7 | Flexibility and efficiency | 2 | Fast and skippable, but rigid after selection. |
| 8 | Aesthetic and minimalist design | 3 | Focused and uncluttered; the dominant disabled footer and large void weaken hierarchy. |
| 9 | Error recovery | 2 | Exit exists, but there is no change-answer action or accessible reveal announcement. |
| 10 | Help and documentation | 3 | Guidance is contextual, but the reassurance contradicts the answer framing and is too muted. |
| **Total** |  | **24/40** | **Acceptable; significant improvements needed** |

## Overall Impression

Calm, readable, and easy to scan. The biggest problem is not visual polish; it is trust. “No wrong answer” conflicts with a transparently app-approved answer, turning a reflective check into a disguised knowledge test. Fix that before refining decoration.

## Cognitive Load

**Moderate: 2 of 8 checklist failures.** Chunking, grouping, one-at-a-time focus, choice count, working-memory support, and progressive disclosure pass. Single focus and hierarchy fail because the actual action is choosing an option while the strongest visual object is an unusable footer button placed far below it. No decision point exceeds four visible choices.

## Emotional Journey

- Entry is calm and human: “What does your gut say?” lowers pressure.
- The decision creates a trust dip: “Trying harder” is paired with obviously educated language about a shifted sleep lever.
- The reassurance tries to repair that pressure, but it arrives after the biased framing and is visually faint.
- Same-screen feedback is the right peak. It avoids a modal and can validate the learner before teaching.
- Skip preserves autonomy, but accidental selection cannot be undone.

## What’s Working

1. **Low-choice structure.** Two large options make the task manageable for stressed and distracted users.
2. **Low-pressure flow mechanics.** Skip stays available and feedback appears inline instead of interrupting with a modal.
3. **Sound feedback intent.** The alternate response validates effort before reframing it, and selected/disabled state is exposed through `accessibilityState`.

## Priority Issues

### [P1] The “no wrong answer” framing is not credible

**Why it matters:** “Understanding which sleep lever shifted” is clearly the lesson-approved response and uses terminology the next exercise teaches. The screen measures whether the learner can spot app-approved language, not their intuition. That weakens trust.

**Fix:** Use two behaviorally plausible, non-moralized answers in ordinary language. Do not mention the sleep-lever model before teaching it. Keep a compassionate, different reveal for each selection.

**Suggested command:** `$impeccable clarify`

### [P1] Accessibility falls below the product bar

**Why it matters:** `inkSoft` on the course background is about 3.61:1 while the instruction and reassurance are 12.5–13.5pt. The disabled footer label is under 2:1. The close target is below 44×44pt, and immediate feedback has no live-region announcement or focus handoff.

**Fix:** Raise secondary-copy contrast to at least 4.5:1, keep disabled text legible, enlarge the close hit area, and announce the revealed teaching copy and locked state.

**Suggested command:** `$impeccable audit`

### [P2] The disabled footer dominates the actual decision

**Why it matters:** “Choose above” is the largest colored control even though it cannot be used. It competes with the answer options and leaves a large visual gulf between decision and continuation.

**Fix:** Hide the primary footer before selection or use a quiet neutral waiting state. Introduce the real sage Continue button only after feedback appears.

**Suggested command:** `$impeccable layout`

### [P2] The course theme looks like a separate product

**Why it matters:** `#F5EAD8`, orange controls, Georgia headings, and decorative progress color drift from Happy's sage/white/dark-green and Geist operational system. The result feels like a generic gamified sleep course rather than the same calm therapy notebook.

**Fix:** Use canonical tokens. Keep Cormorant for the reflective title only; use Geist for options, progress labels, Skip, CTA, and feedback. Use sage for primary actions and progress.

**Suggested command:** `$impeccable typeset`

### [P2] Selection locks too quickly

**Why it matters:** A single thumb slip immediately reveals feedback and disables both options. That is especially harsh on a screen claiming there is no wrong answer.

**Fix:** Preserve the first response internally if needed, but allow visible reselection or a Change answer action until Continue.

**Suggested command:** `$impeccable harden`

## Persona Red Flags

**Jordan, first-timer:** “Sleep lever” arrives before its definition. The obviously preferred option contradicts “No wrong answer.” The disabled footer looks like the next action but does nothing.

**Sam, accessibility-dependent:** Secondary text misses 4.5:1, the disabled CTA is severely washed out, the close target is undersized, and the revealed teaching copy is not announced.

**Casey, distracted mobile user:** Option and Skip targets are thumb-friendly, but the most prominent bottom control is disabled and one accidental option tap cannot be recovered.

## Minor Observations

- The empty middle is calm but excessive; it disconnects the decision from continuation.
- Repeated 24px rounded options with a thick bottom rim lean toward game UI rather than editorial therapy UI.
- The title, prompt, and option labels are all heavy, so hierarchy relies mostly on size.
- The target component is readable and focused: clean-code score **8/10**. Reaching 10/10 means removing duplicate theme tokens and moving the hard-coded reassurance into authored content or a named shared constant.

## Questions to Consider

- If there is no wrong answer, what genuine user truth does each answer reveal?
- Why introduce the sleep-lever model before teaching it?
- Why is an unusable button the strongest object on the screen?
- Is the beige/orange course sub-brand intentional, or accidental drift from Happy?

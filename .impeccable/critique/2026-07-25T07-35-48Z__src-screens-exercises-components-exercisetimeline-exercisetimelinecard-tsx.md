---
target: History Cards (ExerciseTimelineCard.tsx)
total_score: 33
p0_count: 0
p1_count: 2
timestamp: 2026-07-25T07-35-48Z
slug: src-screens-exercises-components-exercisetimeline-exercisetimelinecard-tsx
---
Method: ⚠️ DEGRADED: single-context (sub-agents cannot view user-uploaded images from parent context)

#### Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Accordion state is somewhat visible, though chevron is faint. |
| 2 | Match System / Real World | 4 | Clean language, standard terminology. |
| 3 | User Control and Freedom | 3 | Easy to expand/collapse. |
| 4 | Consistency and Standards | 1 | Uses undocumented fonts (Nunito) and custom hex colors instead of Geist and brand tokens. |
| 5 | Error Prevention | 4 | n/a (Read-only view). |
| 6 | Recognition Rather Than Recall | 4 | Clear history timeline format. |
| 7 | Flexibility and Efficiency | 3 | Simple and direct. |
| 8 | Aesthetic and Minimalist Design | 3 | Metadata elements are a bit noisy and lack hierarchy. |
| 9 | Error Recovery | 4 | n/a. |
| 10 | Help and Documentation | 4 | n/a. |
| **Total** | | **33/40** | **Good** |

#### Anti-Patterns Verdict

**LLM assessment**: The cards avoid the worst AI tropes (no generic gradients or ghost shadows). The core typography for the main thought looks okay, but the metadata (distress, distortions, date, CTA) is extremely flat, and the "Open entry" link lacks any interactive affordance.

**Deterministic scan**: The CLI detector found 16 violations in `ExerciseTimelineCard.tsx`. Every single one is a design system violation: hardcoded `Nunito-Medium`, `Nunito-Semibold`, `Nunito-Bold` fonts, and undocumented raw hex colors (`#8E8E93`, `#2C2C2E`, `#48484A`). This means the component is completely detached from the `DESIGN.md` visual system.

#### Overall Impression
The timeline has a clean structure but feels like it was pasted from another app. It completely ignores the project's typographic and color identity, resulting in a generic "React Native default" look.

#### What's Working
- **Structure**: The accordion card pattern is appropriate for history entries.
- **Restraint**: It avoids oversized radii and gratuitous shadows.

#### Priority Issues

- **[P1] Design System Drift**: The component is hard-coding `Nunito` fonts and raw hex colors (`#8E8E93`, `#2C2C2E`), completely breaking the editorial aesthetic (Geist/Cormorant, INK/SAGE).
  - **Why it matters**: It ruins the product's cohesive, premium feel and introduces tech debt.
  - **Fix**: Replace all Nunito fonts with `Geist` (or `Cormorant` if appropriate), and all raw hex colors with `INK`, `INK_SOFT`, and `SAGE` tokens.
  - **Suggested command**: `$impeccable typeset`

- **[P1] Invisible "Open entry" Affordance**: The "Open entry" CTA is styled identically to muted metadata text.
  - **Why it matters**: Users won't realize they can tap it to view the full journal entry.
  - **Fix**: Style the CTA to look interactive (e.g., `GeistMedium` in `SAGE[700]` with an arrow `→`).
  - **Suggested command**: `$impeccable clarify`

- **[P2] Metadata Visual Hierarchy**: "CBT Core", Distortions, Distress, and Date all have similar small, gray typographic weight.
  - **Why it matters**: The card feels noisy and unstructured at the bottom.
  - **Fix**: Improve hierarchy. Mute the date further, group Distress and Distortions using pills, or refine the layout grid.
  - **Suggested command**: `$impeccable layout`

- **[P3] Accordion Chevron Contrast**: The chevron is very faint against the white background.
  - **Why it matters**: It might fail contrast tests and be hard to notice for some users.
  - **Fix**: Increase the contrast by using `INK_SOFT` or `INK_MUTED` from tokens.
  - **Suggested command**: `$impeccable polish`

#### Persona Red Flags

**Jordan (First-Timer)**: Might not realize the expanded card can be tapped to "Open entry" because the link looks like plain text.

**Sam (Accessibility-Dependent User)**: The faint gray chevron and raw hex colors (`#8E8E93` on white) likely fail WCAG AA contrast requirements.

#### Minor Observations
- The lightning bolt icon in the XP pill (Image 0) appears slightly misaligned vertically with the "182" text.

#### Questions to Consider
- Does the user need to see all distortions at a glance in the timeline, or is that detail better left for the full entry view?
- Should the "Distress" metric be a visual indicator (like a small sparkline or color dot) rather than plain text?

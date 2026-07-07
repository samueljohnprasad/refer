---
target: src/components/journey/SectionOverviewSheet.tsx
total_score: 33
p0_count: 0
p1_count: 2
timestamp: 2026-07-07T09-39-24Z
slug: src-components-journey-sectionoverviewsheet-tsx
---
#### Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 4 | Excellent use of progress bars, node fractions, and status chips |
| 2 | Match System / Real World | 3 | Familiar terminology maps well to learning mental models |
| 3 | User Control and Freedom | 4 | Prominent close button with haptic feedback |
| 4 | Consistency and Standards | 3 | Codebase mixes Tailwind classes with raw hex codes |
| 5 | Error Prevention | 3 | `<Card disabled={false}>` is hardcoded even for locked sections |
| 6 | Recognition Rather Than Recall | 4 | Context clearly identified (Journey title, section count) |
| 7 | Flexibility and Efficiency | 3 | Standard vertical scroll; lacks quick-navigation for large journeys |
| 8 | Aesthetic and Minimalist Design | 2 | Cluttered metadata, specifically the map of unit chips |
| 9 | Error Recovery | 4 | Fallback message for 0 sections is clear and actionable |
| 10 | Help and Documentation | 3 | Interface is self-explanatory |
| **Total** | | **33/40** | **[Good]** |

#### Anti-Patterns Verdict

**LLM assessment:** The component feels solid and bespoke. It actively avoids generic "AI slop" by leveraging specific typography variants (`eyebrow`, `display`, `h2`, `overline`) and a cohesive color palette. The visual hierarchy effectively gives prominence to section titles and progress. However, some inline styles (`style={{ backgroundColor: "#EAF0E7" }}`) and a locally hardcoded `PALETTE` slightly degrade the systemic purity of the code.

**Deterministic scan:** The CLI detector ran and found 0 structural or CSS anti-patterns in the source.

#### Overall Impression
A highly polished and tactile overview modal that succeeds in orienting the user, but stumbles slightly on cognitive load by trying to show *too much* information (all unit chips) on every card simultaneously.

#### What's Working
1. **Excellent Typography & Hierarchy:** The use of dedicated typography variants creates a premium, structured feel that guides the eye naturally and feels distinctly editorial.
2. **Strong Micro-interactions & Polish:** The `StageProgressBar` glow effect on the current section and the `PressableScale` close button with haptics show a commitment to feeling native and delightful.
3. **Constructive Empty States:** Graceful handling of the zero-sections edge case prevents a broken-looking UI.

#### Priority Issues
- **[P1] Unit Chips Clutter:** Rendering a chip for every unit inside a section creates a wall of visual noise, especially if a section has 5+ units. This is redundant since the `overline` already states the total unit count.
  - **Why it matters:** It overwhelms the user with extraneous information that they can't even act on from this modal.
  - **Fix:** Remove the array of unit chips entirely and rely on the `overline` count, OR cap the displayed units to a maximum of 3.
  - **Suggested command:** `$impeccable distill`

- **[P1] Conflicting Locked State UX:** The card shows a lock icon and drops to 80% opacity, but hardcodes `disabled={false}` and displays a "Preview →" CTA.
  - **Why it matters:** It sends mixed signals. Users might click "Preview" expecting content but hit a wall, feeling tricked.
  - **Fix:** If the section is truly locked, change the CTA to "Locked", remove the arrow, and pass `disabled={!section.isUnlocked}` to the Card.
  - **Suggested command:** `$impeccable clarify`

- **[P2] Inconsistent Styling Patterns:** Mixing Tailwind classes with inline styles (e.g., `borderBottomColor: "#E5EDE1"`) and a hardcoded local `PALETTE` object.
  - **Why it matters:** Makes theming and dark mode scaling extremely difficult, leading to future technical debt.
  - **Fix:** Move all colors to the Tailwind config and replace inline styles with proper class names.
  - **Suggested command:** `$impeccable harden`

- **[P3] Text Truncation Risk:** Long `journeyTitle` or `section.title` strings might break the layout on small screens.
  - **Why it matters:** Visually breaks the premium feel of the app.
  - **Fix:** Add `numberOfLines` or `adjustsFontSizeToFit` to the Text components.
  - **Suggested command:** `$impeccable adapt`

#### Persona Red Flags
- **Jordan (First-Timer) / Overwhelmed Learner:** Will look at a section card crammed with 8 unit chips and feel immediate cognitive fatigue before even starting. The visual noise is too high.
- **Riley (Skeptical User):** Clicks "Preview →" on a clearly locked section, hits a paywall or an empty screen, and feels tricked by the UI's mixed signals.

#### Minor Observations
- The `handlePreviewAndClose` callback is named "AndClose" but doesn't actually call `onClose()`. It just delegates to `onPreviewSection(sectionId)`.
- The `LockIcon` uses `size={14}` and `PALETTE.sage500` which is a nice touch, but may lack contrast on a pale green background for low-vision users.

#### Questions to Consider
- Do we actually need to show every single unit inside this high-level overview card, or does that belong on the detail screen?
- Are we intentionally teasing users by letting them "Preview" locked content, or is it a UX oversight that the card remains clickable?

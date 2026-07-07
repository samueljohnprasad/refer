---
target: CourseCatalogSheet
total_score: 20
p0_count: 1
p1_count: 2
timestamp: 2026-07-07T17-14-43Z
slug: coursecatalogsheet
---
Method: ⚠️ DEGRADED: single-context (sub-agents declined by user)

#### Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Good progress visualization, though slightly cluttered. |
| 2 | Match System / Real World | 3 | Course/Journey metaphors are understandable. |
| 3 | User Control and Freedom | 2 | No visible close button for the sheet; relies entirely on hidden gestures. |
| 4 | Consistency and Standards | 2 | Mixing of heavy metric blocks and delicate typography. |
| 5 | Error Prevention | N/A | |
| 6 | Recognition Rather Than Recall | 3 | |
| 7 | Flexibility and Efficiency | 2 | Fixed sequential flow. |
| 8 | Aesthetic and Minimalist Design | 1 | Nested cards inside a sheet, hero-metric widgets, and competing focus points. |
| 9 | Error Recovery | N/A | |
| 10 | Help and Documentation | N/A | |
| **Total** | | **20/40** | **Acceptable** |

#### Anti-Patterns Verdict

**LLM assessment**: Yes, this suffers from several "AI slop" tells. The biggest giveaway is the nested card inside a bottom sheet (cards are a lazy default for grouping). Next is the "hero-metric template" on the right side ("0 OF 10" in a massive rounded block) which fights the delicate display typography of "Sleep Reset" for attention. Finally, the "CURRENT PROGRAM" eyebrow trope is present.

**Deterministic scan**: `detect.mjs` returned clean (0 findings) for strict code-level regex patterns in the sheet component, meaning the anti-patterns here are structural (layout and hierarchy) rather than raw token usage.

#### Overall Impression
The UI feels like three different design systems stitched together. The delicate "Sleep Reset" serif typography belongs to an editorial brand, the chunky "0 OF 10" widget belongs to a SaaS dashboard, and the double-boxed card inside a sheet wastes prime mobile screen real estate. The biggest opportunity is flattening the hierarchy and committing to one cohesive tone.

#### What's Working
- **Status Pills**: The "ACTIVE" pill has good contrast and clear placement without being overly noisy.
- **Top Carousel**: The horizontal scroll layout for courses is a sound interaction pattern, even if the visual treatment needs tuning.

#### Priority Issues

- **[P0] Nested Cards (Double Boxing)**
  - **Why it matters**: A card inside a modal/bottom sheet creates double-boxing, eating up valuable horizontal space with redundant padding and making the UI look like a wireframe template.
  - **Fix**: Remove the white background and border from the "CURRENT PROGRAM" wrapper. Let the bottom sheet itself be the surface.
  - **Suggested command**: `$impeccable layout`

- **[P1] The Hero-Metric Widget ("0 OF 10")**
  - **Why it matters**: It's disproportionately massive and draws the eye away from the actual content. It's a classic SaaS dashboard trope jammed into a consumer app.
  - **Fix**: Flatten this data into a standard inline progress label (e.g., "0 of 10 completed") next to or above the progress bar.
  - **Suggested command**: `$impeccable distill`

- **[P1] Contrast Failure on "Add course"**
  - **Why it matters**: The light gray text on a white background fails WCAG accessibility guidelines and is extremely hard to read in bright environments.
  - **Fix**: Darken the text to hit at least 4.5:1 contrast against the background.
  - **Suggested command**: `$impeccable audit`

- **[P2] Eyebrow Trope ("CURRENT PROGRAM")**
  - **Why it matters**: Small, tracked-out uppercase headers above every section are an overused default. 
  - **Fix**: Convert it to sentence case or a standard label style, or remove it entirely if the context is obvious.
  - **Suggested command**: `$impeccable typeset`

#### Persona Red Flags

**Jordan (First-Timer)**:
- **No obvious exit**: There is no "X" or close button on the sheet. Jordan might not realize they can swipe down to dismiss, leading to feeling trapped in the modal.

**Sam (Accessibility-Dependent User)**:
- **Contrast failures**: The "Add course" text and the empty track of the progress bar lack sufficient contrast, making them invisible to low-vision users.

#### Minor Observations
- The dashed border on the "Add course" button makes it look like an empty/disabled dropzone rather than a primary action.
- The divider line below the progress bar feels redundant and arbitrarily spaced.

#### Questions to Consider
- Does the user really need a massive "0 OF 10" widget, or is the visual progress bar enough?
- If the sheet is already white, why put another white box inside it?

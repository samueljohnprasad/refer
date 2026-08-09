---
target: Updated Explore Journeys course catalog modal
total_score: 22
p0_count: 0
p1_count: 3
timestamp: 2026-08-09T14-39-18Z
slug: omponents-coursecatalogsheet-coursecatalogview-tsx
---
# Course catalog critique

Target: `src/domains/journey/ui/components/CourseCatalogSheet/CourseCatalogView.tsx` and its `CourseCatalogSheet` components.

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 2/4 | The catalog context is visibly clipped at the top, and the unavailable preview state is not resolved into a clear product state. |
| 2 | Match System / Real World | 2/4 | “Enroll in course” conflicts with “This course preview is not available yet.” |
| 3 | User Control and Freedom | 3/4 | Close, expand/collapse, and continue actions are present, but multiple open cards and duplicate continuation actions add friction. |
| 4 | Consistency and Standards | 3/4 | The flatter card treatment and CTA language are coherent; empty metadata and blank artwork break the pattern. |
| 5 | Error Prevention | 1/4 | Users can enter an enrollment flow for a course that has no preview data. |
| 6 | Recognition Rather Than Recall | 2/4 | Unit and lesson information helps, but em-dash metadata and a clipped title make the state harder to understand. |
| 7 | Flexibility and Efficiency | 3/4 | “Continue journey” is a strong shortcut for returning users; the duplicate “Continue” entry point is unnecessary. |
| 8 | Aesthetic and Minimalist Design | 3/4 | The visual language is calmer and less ghost-card-like, but the long expanded stack creates excess vertical density. |
| 9 | Error Recovery | 1/4 | The unavailable course state gives no useful next action or recovery path. |
| 10 | Help and Documentation | 2/4 | The catalog subtitle sets intent, but the unavailable state explains a system limitation rather than helping the user decide. |
| **Total** | | **22/40** | **Needs a focused product-state and hierarchy pass.** |

## Anti-Patterns Verdict

**LLM assessment:** This is less AI-slop than the earlier version. The surfaces are restrained, the green action is purposeful, and the enrolled state has a real product-specific affordance. The remaining tell is repeated rounded containers paired with generic pill-like CTAs and placeholder content. More importantly, the screen currently feels unfinished because its visual polish is ahead of its data-state design.

**Deterministic scan:** `detect.mjs --json` returned `[]` for the three catalog component files. No detector findings were recorded. That is a clean static signal, not evidence that the interaction model or product copy is complete.

**Visual/browser evidence:** The supplied native screenshot was used for visual review. Browser overlay inspection was skipped because this is a React Native modal and no browser automation tool was exposed in this session; no user-visible overlay is available.

## Overall Impression

The enrolled Sleep Reset card now communicates momentum: the user can see what the journey contains and how to continue. The single biggest opportunity is to make every catalog card tell the truth about its availability. A course cannot simultaneously be “not previewable” and ready to “Enroll.”

## What's Working

- **Continue journey is clear:** it gives returning users a direct next step and makes the enrolled state feel active.
- **The hierarchy is calmer:** the flatter borders, restrained shadowing, and smaller artwork tile align better with the app’s quiet editorial direction.
- **Sleep Reset has useful proof:** description, counts, section title, and progress segments let a user understand the journey before continuing.

## Priority Issues

### [P1] The catalog context is clipped at the top

**Why it matters:** The screenshot opens with the first card partially cut off and the “Explore Journeys” heading absent. Users lose the sheet’s purpose and may assume the modal opened mid-scroll or rendered incorrectly.

**Fix:** Ensure every presentation starts at list offset 0, keep the heading below the close control and safe-area inset, and avoid retaining a previous scroll position when reopening the sheet.

**Suggested command:** `$impeccable layout`

### [P1] “Unavailable preview” still has an active enrollment CTA

**Why it matters:** “This course preview is not available yet,” em-dash metadata, and “Enroll in course” create a trust contradiction. A user cannot tell whether the course is ready, broken, or merely incomplete.

**Fix:** This needs a product decision before implementation: provide real preview data, hide the course until content exists, or disable enrollment and present a deliberate “Coming soon” state. Do not silently choose among these source-of-truth behaviors.

**Suggested command:** `$impeccable clarify`

### [P1] Multiple expanded cards create a long, competing decision surface

**Why it matters:** The screenshot shows the enrolled journey and another course’s expanded content in the same scroll flow. Multiple descriptions, metadata blocks, and primary buttons compete for attention and make comparison harder.

**Fix:** Prefer one open course at a time, with the enrolled course prioritized on open. If multiple expansion is intentional, make the comparison model explicit and keep only one primary action visually dominant.

**Suggested command:** `$impeccable distill`

### [P2] The enrolled course has duplicate continuation actions

**Why it matters:** The row-level “Continue” and expanded “Continue journey” perform the same action. Repetition makes the card feel designed around implementation convenience rather than a clear decision hierarchy.

**Fix:** Keep one continuation entry point. The row action is efficient when collapsed; the bottom CTA is stronger when the user is reading details. Choose one as the canonical action for both states.

**Suggested command:** `$impeccable distill`

### [P2] Mindful Morning looks like an unfinished record

**Why it matters:** The blank pale icon tile, em-dash counts, and system-sounding sentence make a published course feel like a broken or seeded database row.

**Fix:** Give the course a real visual identity and intentional availability state. Never expose placeholder counts in a final catalog card.

**Suggested command:** `$impeccable polish`

## Cognitive Load

- **Intrinsic load:** Previewing a journey and deciding whether to start it is reasonable.
- **Extraneous load:** Multiple open cards, duplicate continuation actions, and the clipped heading add avoidable interpretation work.
- **Germane load:** Sleep Reset’s description, counts, and section preview support a useful decision; preserve that structure.
- **Decision points:** The screen presents more than one expanded course and multiple similarly weighted primary actions. Collapse the comparison to one focused decision unless side-by-side course comparison is a deliberate product goal.

## Emotional Journey

The enrolled Sleep Reset state produces reassurance and forward motion through “Continue journey.” The emotional valley arrives immediately after: Mindful Morning looks selectable but says its preview does not exist. That dead-end undermines confidence in the whole catalog. The end state should be either confident enrollment or an honest, polished “coming soon” invitation—not an ambiguous hybrid.

## Persona Red Flags

**Jordan, first-timer:** Sees “Enroll in course” beside “preview is not available yet.” They cannot know what they are enrolling in and may lose trust before starting.

**Riley, returning learner:** Benefits from “Continue journey,” but the duplicate row and bottom actions create unnecessary choice. A clipped catalog title also removes context when returning to the sheet.

**Sam, accessibility-focused user:** Muted metadata and small progress segments may be difficult to parse, while multiple similarly labeled controls require careful focus order and distinct spoken labels.

## Minor Observations

- Reset the modal’s scroll position each time it opens; this is especially important for a modal with a prominent list header.
- Replace `— Units · — Lessons · —` with a meaningful availability label or omit the row until values exist.
- “This course preview is not available yet” reads like internal status copy; use user-facing language only after the product state is decided.
- Add accessible labels for the progress segments that include section name and counts, not only the unit count.
- Keep muted metadata dark enough against the near-white surfaces to preserve comfortable reading.

## Questions to Consider

1. For Mindful Morning, which source-of-truth behavior do you want: **hide until content exists**, **show disabled “Coming soon”**, or **provide real preview data**?
2. Should the accordion allow **only one open course at a time** (recommended) or intentionally support multiple open courses?
3. For enrolled courses, should the canonical action be **row-level Continue** or **bottom Continue journey**?

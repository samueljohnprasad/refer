---
target: Explore Journeys course catalog
total_score: 24
p0_count: 0
p1_count: 3
timestamp: 2026-08-09T14-16-43Z
slug: omponents-coursecatalogsheet-coursecatalogview-tsx
---
# Explore Journeys — Course Catalog Critique

Method: degraded single-context review because no sub-agent tool is exposed in this session.

## Design Health Score

| # | Heuristic | Score | Key issue |
|---|-----------|---:|---|
| 1 | Visibility of System Status | 3/4 | Enrolled state is visible, but there is no clear resume state or progress on the enrolled row. |
| 2 | Match System / Real World | 3/4 | Course, unit, lesson, duration, and enrollment language are familiar and understandable. |
| 3 | User Control and Freedom | 3/4 | Close and expand/collapse controls are clear; the enrolled course still requires guessing what tapping the row does. |
| 4 | Consistency and Standards | 3/4 | The interaction vocabulary is coherent, but course imagery and accent treatments vary in quality. |
| 5 | Error Prevention | 2/4 | Enrollment is clear, but content mismatches and repeated enrollment actions can create wrong expectations. |
| 6 | Recognition Rather Than Recall | 3/4 | Course title, status, description, and preview metadata reduce recall load. |
| 7 | Flexibility and Efficiency | 2/4 | There is no direct Continue action, search, filtering, or fast path for returning learners. |
| 8 | Aesthetic and Minimalist Design | 2/4 | Calm palette works, but nested cards, large gaps, and repeated rounded surfaces add visual weight. |
| 9 | Error Recovery | 1/4 | Error copy exists in the component, but the screenshot provides no recovery affordance or resilient state. |
| 10 | Help and Documentation | 2/4 | The intro explains the catalog, but it does not explain what happens after enrollment or how progress works. |
| **Total** |  | **24/40** | **Needs focused refinement** |

## Anti-Patterns Verdict

### Does it look AI-generated?

Mildly. It avoids the loudest AI-slop signals: no gradients, no decorative illustration collage, no excessive typography, and no generic dashboard chrome. The remaining AI-like signals are the familiar mobile-template combination of oversized rounded cards, a pill CTA, generous empty space, and a generic “Explore Journeys” heading. The bigger concern is not visual originality; it is that the surface can look polished while communicating the wrong course content.

### Deterministic scan

The bundled detector reported zero findings for `CourseCatalogView.tsx`. No automated overlay was produced because this is a React Native screen and no browser target was available.

## Overall Impression

The catalog feels calm, credible, and close to shippable. The title and course-preview hierarchy are good, and the green enrollment action is easy to find. The single biggest opportunity is to make the catalog operationally trustworthy: the selected course must always preview its own content, and an enrolled course must offer an obvious “Continue” path.

## What’s Working

1. The title, supporting sentence, course name, status, description, metadata, section name, and CTA form a sensible top-to-bottom reading order.
2. Progressive disclosure is appropriate: collapsed courses stay compact while the selected course reveals its preview.
3. The sage CTA and dark ink text fit Happy’s calm product register and keep the primary action discoverable without visual noise.

## Priority Issues

### [P1] Preview content can belong to the wrong course

**Why it matters:** The screenshot expands “Mindful Morning” but shows “How Sleep Actually Works,” with sleep-specific metadata. This breaks trust immediately and makes enrollment feel unsafe: users cannot know what they are signing up for.

**Fix:** Make the preview query/data source course-specific. Add a defensive mismatch state in development and ensure the section title, description, unit count, lesson count, and duration all derive from the selected course tree.

**Suggested command:** `$impeccable harden`

### [P1] Enrolled course has status but no confident next action

**Why it matters:** “ENROLLED” tells the user what happened, not what to do next. The row is tappable, but the user must infer that it opens the journey. Returning learners should not need to rediscover the interaction.

**Fix:** Add a compact “Continue” or “Resume” action to the enrolled course row, show the current progress or next lesson, and make the primary button read “Continue journey” when expanded.

**Suggested command:** `$impeccable clarify`

### [P1] Nested rounded surfaces and oversized whitespace dilute the catalog

**Why it matters:** The modal, course rows, expanded course panel, section row, icon tiles, and pill CTA create too many rounded containers. The large gap after the intro makes the screen feel assembled from templates instead of shaped around the task.

**Fix:** Keep one surface per course, use dividers and tonal changes for internal structure, reduce course radii toward 12–16px, and tighten the intro-to-list spacing. Reserve the strongest rounded treatment for the CTA and status chip.

**Suggested command:** `$impeccable layout`

### [P2] Course artwork is too small and the fallback is visually weak

**Why it matters:** The enrolled Sleep Reset panda reads as a tiny badge, while the inactive Mindful Morning tile is an empty pale square. This makes the catalog feel unfinished and gives courses unequal visual credibility.

**Fix:** Give each course a deliberate 40–48px visual slot. Use a real illustration, a strong monogram, or a consistent icon—not an empty tinted square. Keep the image treatment consistent between enrolled and catalog surfaces.

**Suggested command:** `$impeccable polish`

### [P2] Enrollment state needs a complete interaction model

**Why it matters:** The CTA label changes for enrollment and loading, but the screen needs an explicit post-enrollment state, success feedback, and an inline recovery path when enrollment fails.

**Fix:** Define the state sequence `Enroll → Enrolling… → Enrolled / Continue`, keep the button disabled while the mutation runs, and place any failure message next to the CTA with a retry label.

**Suggested command:** `$impeccable harden`

## Persona Red Flags

### Jordan — First-Timer

- May tap “Mindful Morning” and assume the sleep lesson preview is intentional because the UI gives no course-content validation cue.
- May see “ENROLLED” but not know whether to tap the row, expand it, or find the journey elsewhere.
- The generic intro explains browsing but not the consequence of enrolling.

### Riley — Returning Learner

- Has no visible next lesson, progress percentage, or Continue action on the enrolled course.
- Must repeat the catalog interaction to get back to the active journey.
- A tiny panda icon provides recognition, but not enough progress context to support a fast return.

### Sam — Accessibility-Conscious User

- Chevron and close controls depend on icon recognition; labels and adequate accessibility names must be verified.
- Muted metadata and the “ENROLLED” chip should be checked against contrast requirements.
- The large card hierarchy may be navigable, but the interactive parent row versus child CTA needs a clear accessibility order.

## Minor Observations

- “2 Units • 11 Lessons • 51 min” is useful; keep it, but ensure it reflects the selected course.
- The section progress bars are visually quiet, but their meaning is not explained. A short accessible label would help.
- The close button is discoverable and appropriately separated from the title.
- The green CTA is strong; avoid adding more accent colors unless they communicate course identity or state.
- The intro copy is slightly wordy for a modal header. “Preview a course, then enroll when ready.” is more direct.

## Questions to Consider

- Should the catalog optimize for discovering new courses, or returning to the active course? The current screen tries to do both but favors neither.
- What if the enrolled course always appeared first with a visible Continue action, while the rest stayed collapsed below?
- Can the preview data be treated as a trust boundary, with a hard mismatch guard before rendering any course details?

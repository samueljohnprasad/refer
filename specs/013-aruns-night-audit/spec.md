# Specification: Arun's Night Audit

**Status**: Draft
**Created**: 2026-09-02

## Feature Overview

This feature refactors the "Arun's two versions of the night" microlearning exercise to drastically improve its learning flow, reduce cognitive load, and elevate its visual polish. The core learning mechanic—comparing a "first-hour" judgment of sleep against a "whole-night" reading—is preserved but streamlined. The new flow presents events on a timeline (distinguishing neutral evidence from interpretation), uses in-place progressive reveals instead of stacking repetitive cards, and incorporates a subtle rewind animation to emphasize that the events remain the same while the interpretation changes. The primary pedagogical goal is to teach that "first-hour evidence ≠ whole-night evidence" without introducing competing concepts.

## Target Audience

Learners engaging with cognitive behavioral therapy (CBT) microlearning modules about sleep hygiene and evidence evaluation.

## User Scenarios & Testing

**Scenario 1: Choosing the First-Hour Reading initially**
*Given* the user is on the initial exercise screen
*When* they read the neutral setup ("Arun has a drink in the evening and falls asleep quickly") and select "It seems like the drink helped"
*Then* the UI reveals a timeline of the first hour and its positive interpretation.
*And* when they tap to see what happened next, the timeline expands to reveal the rest of the night (waking up, feeling unrefreshed).
*And* they receive the sub-conclusion: "The first hour was real. It just wasn't the whole story."

**Scenario 2: Rewinding the Night**
*Given* the user has completed the first reading path
*When* they tap "REWIND THE NIGHT"
*Then* a brief (300-450ms) animation plays, visually rolling back the timeline.
*And* the completed path collapses into a compact, non-interactive summary to prevent excessive scrolling.
*And* the alternate "Whole Night" path becomes active.

**Scenario 3: Answering the Final Question**
*Given* the user is in the "Whole Night" path evaluating the full timeline
*When* they are asked "What did the first hour hide?" and they tap the correct choice ("Later sleep quality can differ from sleep onset")
*Then* the answer commits immediately without requiring a separate "Check" button.
*And* the final insight ("FIRST HOUR ≠ WHOLE NIGHT") is revealed using strong typography without heavy dashed containers.
*And* the footer provides a "CONTINUE" CTA.

**Scenario 4: Preventing Interaction with Collapsed Paths (Edge Case)**
*Given* the user has rewound the night
*When* they view the collapsed summary of the previous path
*Then* the summary elements are strictly read-only and do not accept taps or interactions.

## Functional Requirements

1. **Initial Setup**: Display a short, neutral setup that does not bias the user's choice: "Arun has a drink in the evening and falls asleep quickly. How would you read the night?"
2. **Choice Parity**: Provide two psychologically plausible initial choices: "[ It seems like the drink helped ]" and "[ I’d want to see the whole night ]".
3. **Timeline UI**: Present the night's events using a temporal timeline format rather than explanatory paragraphs.
4. **Visual Distinction**: Visually differentiate "Evidence" (the timeline, neutral styling) from "Interpretation" (cream/sage background).
5. **Progressive Reveal**: Use a single evolving surface for the active path that expands/updates in place, rather than appending multiple repetitive cards.
6. **Rewind Mechanic**: Implement a "REWIND THE NIGHT" action with a 300-450ms animation that resets the timeline state and collapses the completed path into a single summary block.
7. **Immediate Commit**: Tapping an answer for the second-path question ("What did the first hour hide?") must commit the response immediately, bypassing any intermediate "Check" state.
8. **Final Feedback**: Display the final takeaway ("FIRST HOUR ≠ WHOLE NIGHT") using typographic hierarchy (e.g., text color/weight) instead of a large dashed bounding box. Provide a "CONTINUE" button to advance.
9. **UI Clutter Reduction**:
   - Remove "Skip for now" once a path has been selected.
   - Remove the fake "private pattern check" button/pill entirely.
   - Limit card shadows and border radii to maintain a calm, flat, premium design.

## Success Criteria

- **Reduced Scrolling**: The fully expanded exercise requires less than 1.5 screen heights of vertical scrolling on a standard mobile viewport.
- **Frictionless Completion**: The final question requires exactly 1 tap to commit and reveal feedback.
- **Clear Learning Focus**: The exercise completes with exactly 1 primary learning takeaway displayed ("FIRST HOUR ≠ WHOLE NIGHT").
- **Consistent Event State**: 100% of the timeline events remain visually identical across both paths, enforcing that only the interpretation changes.

## Assumptions

- Design system tokens for colors and typography are available and will be used as prescribed to achieve the premium aesthetic.
- The shared option button components support immediate selection commits without forcing a multi-step check flow.

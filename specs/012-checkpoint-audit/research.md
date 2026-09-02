# Phase 0 Research: Sleep Science Checkpoint Architecture Decisions

## Decision 1: Single Action Per Screen & Option Selection Model
- **Decision**: Tapping an answer option immediately triggers selection and transition to feedback. Prior to selection, the global footer is hidden (`hideFooter = true`), eliminating the disabled `"Choose an answer"` button.
- **Rationale**: Apple HIG and learning psychology both favor immediate responsiveness in retrieval practice. Showing a disabled CTA provides no informational value.
- **Alternatives Considered**: Keeping a disabled CTA and requiring a 2-tap sequence (tap radio -> tap "Check answer"). Rejected because checkpoints are quick retrieval loops, not complex multi-input forms.

## Decision 2: Elimination of "Try Again" Loops
- **Decision**: When an incorrect answer is selected, display the causal mechanism breakdown and provide a direct `"Next question"` (or `"See results"`) CTA.
- **Rationale**: Checkpoints serve to verify recall and immediately repair misconceptions through causal explanation. Once the correct interpretation is explained, forcing the user to click the now-obvious answer is patronizing and adds artificial friction.
- **Alternatives Considered**: Allowing 1 retry before revealing answer. Rejected because checkpoint questions are short retrieval probes; if missed, the concept is flagged for later revisit in the Summary.

## Decision 3: Color Semantics & Neutral Explanation Surfaces
- **Decision**:
  - Restrict red color to the selected incorrect option border/tint and the small `× YOUR ANSWER` badge.
  - Render all explanations (whether user answered correctly or incorrectly) in neutral cream (`#FDF9F5` / border `#EBDDC5`) or soft sage surfaces.
  - Header on repair explanation is `"WHAT HAPPENED?"` rather than `"NOT QUITE"`.
- **Rationale**: Explanations teach valid physiology; putting true explanations inside a giant pink/red error card psychologically signals that the explanation itself is "wrong" or punishing.

## Decision 4: Question-Level Progress Indicator
- **Decision**: Support custom progress reporting from the checkpoint engine so the header displays `"Question N of Total"` (e.g. `Question 1 of 4` at 25%) instead of outer node index (`2 of 2`).
- **Rationale**: Dual conflicting numbers on screen (`2 of 2` vs `4 questions`) induce cognitive dissonance.

# Research: Arun's Night Audit

## Component Architecture
- **Decision**: Refactor `StorySerialCategoryEngine.tsx` to support the timeline visualization, or create a new dedicated `TimelineRewindCategoryEngine.tsx`. Given the specific UI requirements (temporal timeline, distinguishing evidence from interpretation, in-place expansion, animated rewind), creating a dedicated `TimelineRewindCategoryEngine.tsx` is safer and cleaner than overloading the generic story serial engine.
- **Rationale**: The new interaction model is structurally different from a generic "choose your own adventure" serial. It requires distinct "Evidence" vs "Interpretation" visual modes and strict in-place expansion. A new engine ensures compliance with the Constitution's "One Learning Job Per Exercise" rule.
- **Alternatives considered**: Modifying `StorySerialCategoryEngine.tsx` directly (rejected because it risks breaking other generic serial stories like "Sam's week").

## UI Refactoring (Timeline & Rewind)
- **Decision**: Use `react-native-reanimated` for the timeline reveal and rewind animation. The timeline will be a single vertical flex container. The "Evidence" events will be rendered neutrally. The "Interpretation" will be a distinctly styled block (cream/sage).
- **Rationale**: `react-native-reanimated` provides the necessary performance for the 300-450ms rewind animation without dropping frames.
- **Alternatives considered**: Standard React Native `Animated` API (rejected due to less declarative API for layout transitions).

## Final Insight & Feedback State
- **Decision**: Remove the multi-layered feedback UI (dashed boxes, "private pattern check" pseudo-button, skip button). Use clean typography for the "FIRST HOUR ≠ WHOLE NIGHT" takeaway. The final question will use `CourseExerciseOptionButton` and commit immediately via `onInteraction(..., true)`.
- **Rationale**: Reduces cognitive overload and aligns with the Apple HIG emphasis on direct interaction and simple feedback.

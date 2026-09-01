# Research Findings: Staged Test Builder

## Unknowns Addressed
No NEEDS CLARIFICATION items were identified in the technical context.

## Design Decisions

- **State Management**: The state will transition through three phases: `selecting_trigger` (State 1), `selecting_action` (State 2), and `review` (State 3).
- **Component Reusability**: We will strictly use existing primitive components like `CourseExerciseOptionButton` for choices and `CourseExerciseCard` for the final preview. We will not create any exercise-specific UI components.
- **Content Structure**: The `config.ts` content for `IfThenPlan` needs to change from two flat arrays (`cues` and `actions`) to a structured mapping. A cue will have an `id`, `text`, and a list of `actions` (each with `id` and `text`) to enable the guided choices filtering.

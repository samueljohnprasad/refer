# Data Model

## `CourseExerciseCategoryConfig` (Type)

The central TypeScript interface representing the configuration for an exercise category.

**Fields**:
- `category` (RenderableExerciseCategory): The identity enum for the category.
- `formats` (string[]): Supported formats.
- `engine` (ComponentType): The React component that renders this exercise type.
- `goalLabel` (string): Description of the exercise's goal.
- `unavailableCopy` (string): Fallback text when unavailable.

### Added Semantic Configuration Groups:

- `presentation` (object, optional):
  - `showSubtitle` (boolean, optional)
  - `showInstruction` (boolean, optional)
  - *Note: To be expanded as needed if components require more flags.*

- `layout` (object, optional):
  - Reserved for future use (e.g. `variant`, `scrollMode`).

- `progress` (object, optional):
  - Reserved for future use (e.g. `mode`).

- `interaction` (object, optional):
  - `getPrimaryLabel?: (exercise: Exercise, response: Record<string, unknown>) => string | null`
  - `getPrimaryTransition?: (exercise: Exercise, response: Record<string, unknown>) => CoursePrimaryTransition | null`

- `feedback` (object, optional):
  - Reserved for future use.

- `actions` (object, optional):
  - Reserved for future use.

- `capabilities` (object, optional):
  - Reserved for future use.

- `validation` (function, optional):
  - `(content: unknown) => MicrolearningContentIssue[]`: A callback that validates the backend payload for this specific exercise category.

## `DEFAULT_COURSE_EXERCISE_CONFIG`

A global constant holding the default configuration values. Individual configs in the registry will be deep-merged or spread over these defaults.

## Batch Transition Migration

The remaining configurations inside the batch transition files must be migrated to their respective `config.ts` files:
- `courseExerciseFifthBatchTransition.ts` (e.g., ParadoxCard, OneLineReveal)
- `courseExerciseSixthBatchTransition.ts` (e.g., GuidedDiscoveryTrail, TeachBackChain, RecallWarmup, FillBlank)
- `courseExerciseSeventhBatchTransition.ts` (e.g., CuriosityBet, PanicWaveCommit, WaveOrdering)
- `courseExerciseNinthBatchTransition.ts` (e.g., LeverCheck, PrivateCheck, SameButDifferent)
- `courseExerciseTenthBatchTransition.ts` (e.g., SocraticDialogue, AssociationMeter, LensReplay, ToolkitShelf, LeverMatch)
- `courseExerciseEleventhBatchTransition.ts` (e.g., LeverScenario, WorkedRewrite, FadedThoughtRecord, ReframeBuilder, SituationLanguage)
- `courseExerciseFinalBatchTransition.ts` (e.g., IfThenPlan, CourseCheckpoint, SectionMilestone)

For each exercise, its logic will be converted to a `getPrimaryLabel` and `getPrimaryTransition` callback inside the `interaction` block of its `CourseExerciseCategoryConfig`.

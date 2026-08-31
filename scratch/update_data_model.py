import re

path = "specs/005-js-driven-exercise-config/data-model.md"
with open(path, "r") as f:
    content = f.read()

addition = """
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
"""

if "Batch Transition Migration" not in content:
    with open(path, "a") as f:
        f.write(addition)

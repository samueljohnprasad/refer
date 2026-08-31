import re

path = "src/components/exercise/courseExerciseFinalBatchRegistry.ts"
with open(path, "r") as f:
    content = f.read()

import_stmt = "import { getCheckpointLabel, getNextCheckpointState } from '@/src/domains/journey/learning/courseExercisePrimaryTransition';\n"
content = import_stmt + content

content = content.replace(
"""  [CourseExerciseCategoryEnum.CourseCheckpoint]: createConfig(
    CourseExerciseCategoryEnum.CourseCheckpoint,
    CourseCheckpointCategoryEngine,
    "Review the alarm system and coping loops without score pressure.",
    "This checkpoint is not available yet.",
  ),""",
"""  [CourseExerciseCategoryEnum.CourseCheckpoint]: {
    ...createConfig(
      CourseExerciseCategoryEnum.CourseCheckpoint,
      CourseCheckpointCategoryEngine,
      "Review the alarm system and coping loops without score pressure.",
      "This checkpoint is not available yet."
    ),
    interaction: {
      submissionMode: "explicit",
      getPrimaryLabel: (exercise, response) => getCheckpointLabel(exercise, response),
      getPrimaryTransition: (exercise, response) => getNextCheckpointState(exercise, response),
    }
  },""")

with open(path, "w") as f:
    f.write(content)

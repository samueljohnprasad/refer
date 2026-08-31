import re

path = "src/domains/journey/learning/courseExercisePrimaryTransition.ts"
with open(path, "r") as f:
    content = f.read()

# Replace resolveCourseExerciseConfig(exercise) with getCourseExerciseCategoryConfig(resolveCourseExerciseCategory(exercise))
content = content.replace(
"""import { resolveCourseExerciseConfig } from '@/src/components/exercise/courseExerciseCategoryConfig';""",
"""import { getCourseExerciseCategoryConfig } from '@/src/components/exercise/courseExerciseCategoryEngineRegistry';
import { resolveCourseExerciseCategory } from '@/src/domains/journey/learning/courseExerciseCategoryResolver';"""
)

# And fix the usages:
content = content.replace(
"""  const config = resolveCourseExerciseConfig(exercise);""",
"""  const category = resolveCourseExerciseCategory(exercise);
  const config = getCourseExerciseCategoryConfig(category);"""
)

with open(path, "w") as f:
    f.write(content)

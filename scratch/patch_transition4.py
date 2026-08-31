import re

path = "src/domains/journey/learning/courseExercisePrimaryTransition.ts"
with open(path, "r") as f:
    content = f.read()

# Fix imports
content = content.replace(
"""import { getCourseExerciseCategoryConfig } from '@/src/components/exercise/courseExerciseCategoryEngineRegistry';
import { resolveCourseExerciseCategory } from '@/src/domains/journey/learning/courseExerciseCategoryResolver';""",
"""import { courseExerciseCategoryEngineRegistry } from '@/src/components/exercise/courseExerciseCategoryEngineRegistry';
import { FINAL_BATCH_CATEGORY_CONFIGS } from '@/src/components/exercise/courseExerciseFinalBatchRegistry';"""
)

# Fix usage
content = content.replace(
"""  const config = getCourseExerciseCategoryConfig(category);""",
"""  const config = courseExerciseCategoryEngineRegistry[category] || FINAL_BATCH_CATEGORY_CONFIGS[category as keyof typeof FINAL_BATCH_CATEGORY_CONFIGS];"""
)

with open(path, "w") as f:
    f.write(content)

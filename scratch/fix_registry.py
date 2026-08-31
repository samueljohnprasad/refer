import re

path = "src/components/exercise/courseExerciseFinalBatchRegistry.ts"
with open(path, "r") as f:
    content = f.read()

# Fix the syntax error
content = content.replace("}  : Partial<\n  Record<CourseExerciseCategoryEnum, CourseExerciseCategoryConfig>\n>;", "};")
content = content.replace(
    "export const FINAL_BATCH_CATEGORY_CONFIGS = {",
    "export const FINAL_BATCH_CATEGORY_CONFIGS: Partial<Record<CourseExerciseCategoryEnum, CourseExerciseCategoryConfig>> = {"
)

with open(path, "w") as f:
    f.write(content)

import re

with open("src/components/exercise/courseExerciseTheme.ts", "r") as f:
    content = f.read()

# Remove the export const COURSE_EXERCISE_COLORS block
content = re.sub(
    r"export const COURSE_EXERCISE_COLORS = \{.*?\n\} as const;\n\n",
    "",
    content,
    flags=re.DOTALL
)

with open("src/components/exercise/courseExerciseTheme.ts", "w") as f:
    f.write(content)

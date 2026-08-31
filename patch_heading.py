with open("src/components/exercise/CourseExerciseHeading.tsx", "r") as f:
    content = f.read()

content = content.replace(
    "COURSE_EXERCISE_COLORS,\n  COURSE_EXERCISE_FONTS,",
    "COURSE_EXERCISE_COLORS,\n  COURSE_EXERCISE_FONTS,\n  SEMANTIC_COLORS,"
)

content = content.replace("COURSE_EXERCISE_COLORS.ink,", "SEMANTIC_COLORS.text.primary,")
content = content.replace("COURSE_EXERCISE_COLORS.inkSoft,", "SEMANTIC_COLORS.text.secondary,")

with open("src/components/exercise/CourseExerciseHeading.tsx", "w") as f:
    f.write(content)

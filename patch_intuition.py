with open("src/components/exercise/IntuitionCheckCategoryEngine.tsx", "r") as f:
    content = f.read()

content = content.replace(
    "COURSE_EXERCISE_COLORS,\n  COURSE_EXERCISE_FONTS,",
    "COURSE_EXERCISE_COLORS,\n  COURSE_EXERCISE_FONTS,\n  SEMANTIC_COLORS,"
)

content = content.replace(
    "backgroundColor: COURSE_EXERCISE_COLORS.accentTint",
    "backgroundColor: SEMANTIC_COLORS.success.soft"
)
content = content.replace(
    "backgroundColor: COURSE_EXERCISE_COLORS.accent",
    "backgroundColor: SEMANTIC_COLORS.success.primary"
)
content = content.replace(
    "color: COURSE_EXERCISE_COLORS.surface,",
    "color: SEMANTIC_COLORS.text.inverse,"
)
content = content.replace(
    "color: COURSE_EXERCISE_COLORS.accentDark,",
    "color: SEMANTIC_COLORS.text.primary,"
)
content = content.replace(
    "color: COURSE_EXERCISE_COLORS.ink,",
    "color: SEMANTIC_COLORS.text.primary,"
)
content = content.replace(
    "color: COURSE_EXERCISE_COLORS.inkSoft,",
    "color: SEMANTIC_COLORS.text.secondary,"
)

with open("src/components/exercise/IntuitionCheckCategoryEngine.tsx", "w") as f:
    f.write(content)

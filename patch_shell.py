import re

with open("src/components/exercise/CourseExerciseShell.tsx", "r") as f:
    content = f.read()

# Import SEMANTIC_COLORS
content = content.replace(
    "COURSE_EXERCISE_COLORS,\n  COURSE_EXERCISE_FONTS,",
    "COURSE_EXERCISE_COLORS,\n  COURSE_EXERCISE_FONTS,\n  SEMANTIC_COLORS,"
)

# Background
content = content.replace("COURSE_EXERCISE_COLORS.background", "SEMANTIC_COLORS.surface.primary")

# Close button icon
content = content.replace("COURSE_EXERCISE_COLORS.inkSoft", "SEMANTIC_COLORS.text.secondary")

# Progress track & fill
content = content.replace("COURSE_EXERCISE_COLORS.surfaceMuted", "SEMANTIC_COLORS.brand.soft")
content = content.replace("COURSE_EXERCISE_COLORS.accent", "SEMANTIC_COLORS.brand.primary")

# Progress label & Skip label
# already handled by COURSE_EXERCISE_COLORS.inkSoft -> SEMANTIC_COLORS.text.secondary

# Primary Button colors
content = re.sub(
    r"function getPrimaryButtonColors\(disabled: boolean\) \{.*?\n\}",
    """function getPrimaryButtonColors(disabled: boolean) {
  return disabled
    ? { face: SEMANTIC_COLORS.text.muted, rim: SEMANTIC_COLORS.text.secondary }
    : { face: SEMANTIC_COLORS.brand.primary, rim: SEMANTIC_COLORS.brand.pressed };
}""",
    content,
    flags=re.DOTALL
)

# Disabled label
content = content.replace("color: SAGE[700]", "color: SEMANTIC_COLORS.text.inverse")

with open("src/components/exercise/CourseExerciseShell.tsx", "w") as f:
    f.write(content)

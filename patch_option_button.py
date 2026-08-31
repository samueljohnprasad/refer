with open("src/components/exercise/CourseExerciseOptionButton.tsx", "r") as f:
    content = f.read()

content = content.replace(
    "COURSE_EXERCISE_COLORS,\n  COURSE_EXERCISE_FONTS,",
    "COURSE_EXERCISE_COLORS,\n  COURSE_EXERCISE_FONTS,\n  SEMANTIC_COLORS,"
)

# Button default
content = content.replace("borderColor: COURSE_EXERCISE_COLORS.border,", "borderColor: SEMANTIC_COLORS.border.default,")
content = content.replace("backgroundColor: COURSE_EXERCISE_COLORS.surface,", "backgroundColor: SEMANTIC_COLORS.surface.primary,")

# Selected
content = content.replace(
    "selected: {\n    borderColor: COURSE_EXERCISE_COLORS.accent,\n    backgroundColor: COURSE_EXERCISE_COLORS.accentTint,\n  },",
    "selected: {\n    borderColor: SEMANTIC_COLORS.border.selected,\n    backgroundColor: SEMANTIC_COLORS.brand.soft,\n  },"
)

# Confirmed (which is used for isCorrect)
content = content.replace(
    "confirmed: {\n    borderColor: COURSE_EXERCISE_COLORS.accent,\n    backgroundColor: COURSE_EXERCISE_COLORS.accentTint,\n  },",
    "confirmed: {\n    borderColor: SEMANTIC_COLORS.success.primary,\n    backgroundColor: SEMANTIC_COLORS.success.soft,\n  },"
)

# Incorrect
content = content.replace(
    "incorrect: {\n    borderColor: COURSE_EXERCISE_COLORS.error,\n    backgroundColor: COURSE_EXERCISE_COLORS.errorTint,\n  },",
    "incorrect: {\n    borderColor: SEMANTIC_COLORS.error.primary,\n    backgroundColor: SEMANTIC_COLORS.error.soft,\n  },"
)

# Label
content = content.replace("color: COURSE_EXERCISE_COLORS.ink,", "color: SEMANTIC_COLORS.text.primary,")

# Check circle
content = content.replace("backgroundColor: COURSE_EXERCISE_COLORS.accent,", "backgroundColor: SEMANTIC_COLORS.success.primary,")
content = content.replace("backgroundColor: COURSE_EXERCISE_COLORS.error", "backgroundColor: SEMANTIC_COLORS.error.primary")

# Check label
content = content.replace("color: COURSE_EXERCISE_COLORS.surface,", "color: SEMANTIC_COLORS.text.inverse,")

with open("src/components/exercise/CourseExerciseOptionButton.tsx", "w") as f:
    f.write(content)

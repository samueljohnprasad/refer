with open("src/components/exercise/CourseExerciseFeedbackPanel.tsx", "r") as f:
    content = f.read()

content = content.replace(
    "COURSE_EXERCISE_COLORS,\n  COURSE_EXERCISE_FONTS,",
    "COURSE_EXERCISE_COLORS,\n  COURSE_EXERCISE_FONTS,\n  SEMANTIC_COLORS,"
)

content = content.replace(
    "success: {\n    borderColor: COURSE_EXERCISE_COLORS.accent,\n    backgroundColor: COURSE_EXERCISE_COLORS.accentTint,\n  },",
    "success: {\n    borderColor: SEMANTIC_COLORS.success.primary,\n    backgroundColor: SEMANTIC_COLORS.success.soft,\n  },"
)

content = content.replace(
    "retry: {\n    borderColor: COURSE_EXERCISE_COLORS.error,\n    backgroundColor: COURSE_EXERCISE_COLORS.errorTint,\n  },",
    "retry: {\n    borderColor: SEMANTIC_COLORS.error.primary,\n    backgroundColor: SEMANTIC_COLORS.error.soft,\n  },"
)

content = content.replace(
    "review: {\n    borderColor: COURSE_EXERCISE_COLORS.border,\n    backgroundColor: COURSE_EXERCISE_COLORS.surface,\n  },",
    "review: {\n    borderColor: SEMANTIC_COLORS.border.default,\n    backgroundColor: SEMANTIC_COLORS.surface.secondary,\n  },"
)

content = content.replace("color: COURSE_EXERCISE_COLORS.ink,", "color: SEMANTIC_COLORS.text.primary,")
content = content.replace("backgroundColor: COURSE_EXERCISE_COLORS.accent,", "backgroundColor: SEMANTIC_COLORS.success.primary,")
content = content.replace("color: COURSE_EXERCISE_COLORS.surface,", "color: SEMANTIC_COLORS.text.inverse,")
content = content.replace("color: COURSE_EXERCISE_COLORS.accent,", "color: SEMANTIC_COLORS.brand.primary,")
content = content.replace("color: COURSE_EXERCISE_COLORS.accentDark,", "color: SEMANTIC_COLORS.text.secondary,")

with open("src/components/exercise/CourseExerciseFeedbackPanel.tsx", "w") as f:
    f.write(content)

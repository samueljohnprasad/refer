import re

path = "src/components/exercise/CourseExerciseShell.tsx"
with open(path, "r") as f:
    content = f.read()

# Reduce pressDepth of Primary CTA
content = re.sub(
    r'pressDepth=\{5\}',
    'pressDepth={3}',
    content
)

# Update progress label
content = re.sub(
    r'progressLabel: \{\s*minWidth: 43,\s*color: COURSE_EXERCISE_COLORS\.inkSoft,\s*fontFamily: COURSE_EXERCISE_FONTS\.bodyBold,',
    'progressLabel: {\n    minWidth: 43,\n    color: COURSE_EXERCISE_COLORS.inkSoft,\n    fontFamily: COURSE_EXERCISE_FONTS.bodyMedium,',
    content
)

# Update primary label (16 -> 18)
content = re.sub(
    r'primaryLabel: \{\s*color: "#FFFFFF",\s*fontFamily: COURSE_EXERCISE_FONTS\.bodyBold,\s*fontSize: 16,\s*\},',
    'primaryLabel: {\n    color: "#FFFFFF",\n    fontFamily: COURSE_EXERCISE_FONTS.bodyBold,\n    fontSize: 18,\n  },',
    content
)

# Update skip label
content = re.sub(
    r'skipLabel: \{\s*color: COURSE_EXERCISE_COLORS\.accentDark,\s*fontFamily: COURSE_EXERCISE_FONTS\.bodyBold,\s*fontSize: 14,\s*\},',
    'skipLabel: {\n    color: COURSE_EXERCISE_COLORS.inkSoft,\n    fontFamily: COURSE_EXERCISE_FONTS.bodyMedium,\n    fontSize: 13,\n  },',
    content
)

with open(path, "w") as f:
    f.write(content)

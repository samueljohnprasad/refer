import re

path = "src/components/exercise/CourseExerciseOptionButton.tsx"
with open(path, "r") as f:
    content = f.read()

# Remove borderBottomWidth: 4, make it regular border
content = re.sub(
    r'borderWidth: 1,\n\s*borderColor: COURSE_EXERCISE_COLORS\.border,\n\s*borderBottomWidth: 4,',
    'borderWidth: 1.5,\n    borderColor: COURSE_EXERCISE_COLORS.border,',
    content
)

# Fix pressed state since borderBottomWidth is gone
content = re.sub(
    r'pressed: \{ transform: \[\{ translateY: 2 \}\], borderBottomWidth: 2 \}',
    'pressed: { opacity: 0.8 }',
    content
)

# Fix disabled state to not be opaque (remove opacity: 0.55)
content = re.sub(
    r'disabled: \{ borderBottomWidth: 1, opacity: 0\.55 \},',
    'disabled: { opacity: 0.9 },',
    content
)

# Update label font size to 18 and weight to 600
content = re.sub(
    r'label: \{\s*flex: 1,\s*color: COURSE_EXERCISE_COLORS\.ink,\s*fontFamily: COURSE_EXERCISE_FONTS\.bodyBold,\s*fontSize: 15,\s*lineHeight: 21,',
    'label: {\n    flex: 1,\n    color: COURSE_EXERCISE_COLORS.ink,\n    fontFamily: COURSE_EXERCISE_FONTS.bodyMedium,\n    fontSize: 18,\n    lineHeight: 24,',
    content
)

with open(path, "w") as f:
    f.write(content)

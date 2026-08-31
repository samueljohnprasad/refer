import re

path = "src/components/exercise/CourseExerciseHeading.tsx"
with open(path, "r") as f:
    content = f.read()

# Update title: 30px
content = re.sub(
    r'fontSize: 28,\s*lineHeight: 32,',
    'fontSize: 30,\n    lineHeight: 36,',
    content
)

# Update prompt (Question): 22px / 700 (bodyBold or heading)
content = re.sub(
    r'prompt: \{\s*marginTop: 15,\s*color: COURSE_EXERCISE_COLORS\.ink,\s*fontFamily: COURSE_EXERCISE_FONTS\.bodyBold,\s*fontSize: 17,\s*lineHeight: 24,',
    'prompt: {\n    marginTop: 12,\n    color: COURSE_EXERCISE_COLORS.ink,\n    fontFamily: COURSE_EXERCISE_FONTS.bodyBold,\n    fontSize: 22,\n    lineHeight: 28,',
    content
)

with open(path, "w") as f:
    f.write(content)

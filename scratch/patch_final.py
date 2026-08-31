import re

# 1. CourseExerciseHeading.tsx
path_heading = "src/components/exercise/CourseExerciseHeading.tsx"
with open(path_heading, "r") as f:
    heading = f.read()
# Title: 30 -> 27
heading = re.sub(
    r'fontSize: 30,\n\s*lineHeight: 36,',
    'fontSize: 27,\n    lineHeight: 33,',
    heading
)
# Prompt: 22 -> 21
heading = re.sub(
    r'fontSize: 22,\n\s*lineHeight: 28,',
    'fontSize: 21,\n    lineHeight: 27,',
    heading
)
with open(path_heading, "w") as f:
    f.write(heading)

# 2. CourseExerciseOptionButton.tsx
path_button = "src/components/exercise/CourseExerciseOptionButton.tsx"
with open(path_button, "r") as f:
    button = f.read()
# Border: 1.5 -> 1
button = re.sub(
    r'borderWidth: 1\.5,',
    'borderWidth: 1,',
    button
)
with open(path_button, "w") as f:
    f.write(button)

# 3. CourseExerciseFeedbackPanel.tsx
path_feedback = "src/components/exercise/CourseExerciseFeedbackPanel.tsx"
with open(path_feedback, "r") as f:
    feedback = f.read()
# Gap/Margin: wrapper gap: 10 -> wrapper gap: 10
# Icon: 22 -> 19
feedback = re.sub(
    r'width: 22,\n\s*height: 22,\n\s*alignItems: "center",\n\s*justifyContent: "center",\n\s*borderRadius: 11,',
    'width: 19,\n    height: 19,\n    alignItems: "center",\n    justifyContent: "center",\n    borderRadius: 9.5,',
    feedback
)
# Icon Label: 11 -> 9.5
feedback = re.sub(
    r'successIconLabel: \{\n\s*color: COURSE_EXERCISE_COLORS\.surface,\n\s*fontFamily: COURSE_EXERCISE_FONTS\.bodyBold,\n\s*fontSize: 11,\n\s*\},',
    'successIconLabel: {\n    color: COURSE_EXERCISE_COLORS.surface,\n    fontFamily: COURSE_EXERCISE_FONTS.bodyBold,\n    fontSize: 9.5,\n  },',
    feedback
)
with open(path_feedback, "w") as f:
    f.write(feedback)

# 4. IntuitionCheckCategoryEngine.tsx (Reveal)
path_intuition = "src/components/exercise/IntuitionCheckCategoryEngine.tsx"
with open(path_intuition, "r") as f:
    intuition = f.read()
# MarginTop: 16 -> 6
intuition = re.sub(
    r'reveal: \{\n\s*marginTop: 16,',
    'reveal: {\n    marginTop: 6,',
    intuition
)
# Icon: 22 -> 19
intuition = re.sub(
    r'width: 22,\n\s*height: 22,\n\s*alignItems: "center",\n\s*justifyContent: "center",\n\s*borderRadius: 11,',
    'width: 19,\n    height: 19,\n    alignItems: "center",\n    justifyContent: "center",\n    borderRadius: 9.5,',
    intuition
)
# Icon Label: 11 -> 9.5
intuition = re.sub(
    r'revealIconLabel: \{\n\s*color: COURSE_EXERCISE_COLORS\.surface,\n\s*fontFamily: COURSE_EXERCISE_FONTS\.bodyBold,\n\s*fontSize: 11,\n\s*\},',
    'revealIconLabel: {\n    color: COURSE_EXERCISE_COLORS.surface,\n    fontFamily: COURSE_EXERCISE_FONTS.bodyBold,\n    fontSize: 9.5,\n  },',
    intuition
)
with open(path_intuition, "w") as f:
    f.write(intuition)

# 5. CourseExerciseShell.tsx
path_shell = "src/components/exercise/CourseExerciseShell.tsx"
with open(path_shell, "r") as f:
    shell = f.read()
# CTA Depth: 3 -> 2
shell = re.sub(
    r'pressDepth=\{3\}',
    'pressDepth={2}',
    shell
)
# Skip Label: 13 -> 15
shell = re.sub(
    r'skipLabel: \{\n\s*color: COURSE_EXERCISE_COLORS\.inkSoft,\n\s*fontFamily: COURSE_EXERCISE_FONTS\.bodyMedium,\n\s*fontSize: 13,\n\s*\},',
    'skipLabel: {\n    color: COURSE_EXERCISE_COLORS.inkSoft,\n    fontFamily: COURSE_EXERCISE_FONTS.bodyMedium,\n    fontSize: 15,\n  },',
    shell
)
# Progress Label: bodyMedium -> body
shell = re.sub(
    r'progressLabel: \{\n\s*minWidth: 43,\n\s*color: COURSE_EXERCISE_COLORS\.inkSoft,\n\s*fontFamily: COURSE_EXERCISE_FONTS\.bodyMedium,',
    'progressLabel: {\n    minWidth: 43,\n    color: COURSE_EXERCISE_COLORS.inkSoft,\n    fontFamily: COURSE_EXERCISE_FONTS.body,',
    shell
)
with open(path_shell, "w") as f:
    f.write(shell)


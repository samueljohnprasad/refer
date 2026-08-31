import re

path = "src/components/exercise/CourseExerciseFeedbackPanel.tsx"
with open(path, "r") as f:
    content = f.read()

# Make panel have borderWidth 0
content = re.sub(
    r'panel: \{\s*borderWidth: 1\.5,\s*borderRadius: 24,',
    'panel: {\n    borderWidth: 0,\n    borderRadius: 24,',
    content
)

# Update title
content = re.sub(
    r'title: \{\s*color: COURSE_EXERCISE_COLORS\.ink,\s*fontFamily: COURSE_EXERCISE_FONTS\.heading,\s*fontSize: 16,\s*lineHeight: 20,\s*\},',
    'title: {\n    color: COURSE_EXERCISE_COLORS.ink,\n    fontFamily: COURSE_EXERCISE_FONTS.heading,\n    fontSize: 17,\n    lineHeight: 22,\n  },',
    content
)

# Update icon size (28 -> 22) and radius (14 -> 11)
content = re.sub(
    r'successIcon: \{\s*width: 28,\s*height: 28,\s*alignItems: "center",\s*justifyContent: "center",\s*borderRadius: 14,',
    'successIcon: {\n    width: 22,\n    height: 22,\n    alignItems: "center",\n    justifyContent: "center",\n    borderRadius: 11,',
    content
)

# Icon label font size (14 -> 11)
content = re.sub(
    r'successIconLabel: \{\s*color: COURSE_EXERCISE_COLORS\.surface,\s*fontFamily: COURSE_EXERCISE_FONTS\.bodyBold,\s*fontSize: 14,\s*\},',
    'successIconLabel: {\n    color: COURSE_EXERCISE_COLORS.surface,\n    fontFamily: COURSE_EXERCISE_FONTS.bodyBold,\n    fontSize: 11,\n  },',
    content
)

# Update body (13.5 -> 17)
content = re.sub(
    r'body: \{\s*marginTop: 7,\s*color: COURSE_EXERCISE_COLORS\.ink,\s*fontFamily: COURSE_EXERCISE_FONTS\.body,\s*fontSize: 13\.5,\s*lineHeight: 20,\s*\},',
    'body: {\n    marginTop: 5,\n    color: COURSE_EXERCISE_COLORS.ink,\n    fontFamily: COURSE_EXERCISE_FONTS.body,\n    fontSize: 17,\n    lineHeight: 24,\n  },',
    content
)

# Update takeaway (13 -> 15)
content = re.sub(
    r'takeaway: \{\s*marginTop: 9,\s*color: COURSE_EXERCISE_COLORS\.accentDark,\s*fontFamily: COURSE_EXERCISE_FONTS\.bodyMedium,\s*fontSize: 13,\s*lineHeight: 18,\s*\},',
    'takeaway: {\n    marginTop: 9,\n    color: COURSE_EXERCISE_COLORS.accentDark,\n    fontFamily: COURSE_EXERCISE_FONTS.bodyMedium,\n    fontSize: 15,\n    lineHeight: 20,\n  },',
    content
)

with open(path, "w") as f:
    f.write(content)

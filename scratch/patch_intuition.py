import re

path = "src/components/exercise/IntuitionCheckCategoryEngine.tsx"
with open(path, "r") as f:
    content = f.read()

# Make panel have borderWidth 0
content = re.sub(
    r'borderWidth: 1\.5,\n\s*borderColor: COURSE_EXERCISE_COLORS\.accent,',
    'borderWidth: 0,',
    content
)

# Update title
content = re.sub(
    r'revealTitle: \{\s*color: COURSE_EXERCISE_COLORS\.accentDark,\s*fontFamily: COURSE_EXERCISE_FONTS\.heading,\s*fontSize: 16,\s*lineHeight: 20,\s*\},',
    'revealTitle: {\n    color: COURSE_EXERCISE_COLORS.accentDark,\n    fontFamily: COURSE_EXERCISE_FONTS.heading,\n    fontSize: 17,\n    lineHeight: 22,\n  },',
    content
)

# Update icon size (24 -> 22) and radius (12 -> 11)
content = re.sub(
    r'revealIcon: \{\s*width: 24,\s*height: 24,\s*alignItems: "center",\s*justifyContent: "center",\s*borderRadius: 12,',
    'revealIcon: {\n    width: 22,\n    height: 22,\n    alignItems: "center",\n    justifyContent: "center",\n    borderRadius: 11,',
    content
)

# Icon label font size (14 -> 11)
content = re.sub(
    r'revealIconLabel: \{\s*color: COURSE_EXERCISE_COLORS\.surface,\s*fontFamily: COURSE_EXERCISE_FONTS\.bodyBold,\s*fontSize: 14,\s*\},',
    'revealIconLabel: {\n    color: COURSE_EXERCISE_COLORS.surface,\n    fontFamily: COURSE_EXERCISE_FONTS.bodyBold,\n    fontSize: 11,\n  },',
    content
)

# Update body (13.5 -> 17)
content = re.sub(
    r'revealBody: \{\s*marginTop: 7,\s*color: COURSE_EXERCISE_COLORS\.ink,\s*fontFamily: COURSE_EXERCISE_FONTS\.body,\s*fontSize: 13\.5,\s*lineHeight: 20,\s*\},',
    'revealBody: {\n    marginTop: 5,\n    color: COURSE_EXERCISE_COLORS.ink,\n    fontFamily: COURSE_EXERCISE_FONTS.body,\n    fontSize: 17,\n    lineHeight: 24,\n  },',
    content
)

with open(path, "w") as f:
    f.write(content)

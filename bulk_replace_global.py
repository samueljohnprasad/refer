import os
import re

replacements = {
    "COURSE_EXERCISE_COLORS.accentTint": "SEMANTIC_COLORS.brand.soft",
    "COURSE_EXERCISE_COLORS.accentDark": "SEMANTIC_COLORS.brand.pressed",
    "COURSE_EXERCISE_COLORS.accent": "SEMANTIC_COLORS.brand.primary",
    "COURSE_EXERCISE_COLORS.background": "SEMANTIC_COLORS.surface.primary",
    "COURSE_EXERCISE_COLORS.surfaceMuted": "SEMANTIC_COLORS.surface.secondary",
    "COURSE_EXERCISE_COLORS.surface": "SEMANTIC_COLORS.surface.primary",
    "COURSE_EXERCISE_COLORS.inkSoft": "SEMANTIC_COLORS.text.secondary",
    "COURSE_EXERCISE_COLORS.ink": "SEMANTIC_COLORS.text.primary",
    "COURSE_EXERCISE_COLORS.border": "SEMANTIC_COLORS.border.default",
    "COURSE_EXERCISE_COLORS.errorTint": "SEMANTIC_COLORS.error.soft",
    "COURSE_EXERCISE_COLORS.error": "SEMANTIC_COLORS.error.primary",
    "COURSE_EXERCISE_COLORS.shadow": "SEMANTIC_COLORS.shadow",
}

for root, _, files in os.walk("src"):
    for file in files:
        if file.endswith((".tsx", ".ts")) and file != "courseExerciseTheme.ts":
            path = os.path.join(root, file)
            with open(path, "r") as f:
                content = f.read()
            
            if "COURSE_EXERCISE_COLORS" in content:
                original_content = content
                for old, new in replacements.items():
                    content = content.replace(old, new)
                
                # Update imports
                if content != original_content:
                    if "SEMANTIC_COLORS" not in content:
                        content = content.replace("COURSE_EXERCISE_COLORS", "COURSE_EXERCISE_COLORS, SEMANTIC_COLORS")
                    
                    content = re.sub(r"COURSE_EXERCISE_COLORS,\s*", "", content)
                    content = re.sub(r",\s*COURSE_EXERCISE_COLORS", "", content)
                    content = re.sub(r"{\s*COURSE_EXERCISE_COLORS\s*}", "{ SEMANTIC_COLORS }", content)

                    with open(path, "w") as f:
                        f.write(content)

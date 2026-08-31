import os

for path in ["src/screens/CourseExercisesTestScreen/CourseExercisesTestCatalog.tsx", "src/screens/CourseExercisesTestScreen/CourseExercisesTestScreen.tsx"]:
    with open(path, "r") as f:
        content = f.read()
    
    content = content.replace("import { SEMANTIC_COLORS }", "import { SEMANTIC_COLORS, COURSE_EXERCISE_FONTS }")
    with open(path, "w") as f:
        f.write(content)

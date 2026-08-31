import os

for root, _, files in os.walk("src/components/exercise"):
    for file in files:
        if file.endswith((".tsx", ".ts")) and file != "courseExerciseTheme.ts":
            path = os.path.join(root, file)
            with open(path, "r") as f:
                content = f.read()
            
            if "COURSE_EXERCISE_COLORS.shadow" in content:
                content = content.replace("COURSE_EXERCISE_COLORS.shadow", "SEMANTIC_COLORS.shadow")
                if "SEMANTIC_COLORS" not in content:
                    content = content.replace("COURSE_EXERCISE_COLORS", "COURSE_EXERCISE_COLORS, SEMANTIC_COLORS")
                with open(path, "w") as f:
                    f.write(content)

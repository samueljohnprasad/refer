import os
import re

for root, _, files in os.walk("src/components/exercise"):
    for file in files:
        if file.endswith((".tsx", ".ts")) and file != "courseExerciseTheme.ts":
            path = os.path.join(root, file)
            with open(path, "r") as f:
                content = f.read()
            
            original_content = content
            content = re.sub(r"COURSE_EXERCISE_COLORS,\s*", "", content)
            content = re.sub(r"COURSE_EXERCISE_COLORS\s*}", "}", content)
            
            # if we ended up with empty imports like { } or {  } 
            content = re.sub(r"import\s*{\s*}\s*from\s*[\"'](?:@/)?src/components/exercise/courseExerciseTheme[\"'];?\n", "", content)
            content = re.sub(r"import\s*{\s*}\s*from\s*[\"']\./courseExerciseTheme[\"'];?\n", "", content)

            if content != original_content:
                with open(path, "w") as f:
                    f.write(content)

import os
import re

for path in ["src/screens/CourseExercisesTestScreen/CourseExercisesTestCatalog.tsx", "src/screens/CourseExercisesTestScreen/CourseExercisesTestScreen.tsx"]:
    with open(path, "r") as f:
        content = f.read()
    
    if "import { SEMANTIC_COLORS }" not in content:
        content = re.sub(r'import\s*{[^}]*}\s*from\s*["\']@/src/components/exercise/courseExerciseTheme["\'];?\n', 'import { SEMANTIC_COLORS } from "@/src/components/exercise/courseExerciseTheme";\n', content)
        
        # If it was empty and got removed earlier:
        if "SEMANTIC_COLORS.surface.primary" in content and 'import { SEMANTIC_COLORS }' not in content:
            content = 'import { SEMANTIC_COLORS } from "@/src/components/exercise/courseExerciseTheme";\n' + content
            
    with open(path, "w") as f:
        f.write(content)


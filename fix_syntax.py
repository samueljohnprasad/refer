import os

for root, _, files in os.walk("src"):
    for file in files:
        if file.endswith((".tsx", ".ts")):
            path = os.path.join(root, file)
            with open(path, "r") as f:
                content = f.read()
            
            original_content = content
            content = content.replace(r'\"@/src/components/exercise/courseExerciseTheme\"', '"@/src/components/exercise/courseExerciseTheme"')
            
            # Also fix things like `, , SEMANTIC_COLORS` or `\n, SEMANTIC_COLORS`
            content = content.replace(", , SEMANTIC_COLORS", ", SEMANTIC_COLORS")
            content = content.replace(",\n, SEMANTIC_COLORS", ",\n  SEMANTIC_COLORS")
            content = content.replace("\n, SEMANTIC_COLORS", ",\n  SEMANTIC_COLORS")
            
            if content != original_content:
                with open(path, "w") as f:
                    f.write(content)

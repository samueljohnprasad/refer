import os
import re

for root, _, files in os.walk("src"):
    for file in files:
        if file.endswith((".tsx", ".ts")) and file != "courseExerciseTheme.ts":
            path = os.path.join(root, file)
            with open(path, "r") as f:
                content = f.read()
            
            if "SEMANTIC_COLORS." in content:
                # Check if it's actually imported
                if "import " not in content or "SEMANTIC_COLORS" not in [line for line in content.split("\n") if line.strip().startswith("import ")]:
                    # Better check: does the file have an import containing SEMANTIC_COLORS?
                    import_lines = [line for line in content.split("\n") if "import " in line and "SEMANTIC_COLORS" in line]
                    # Sometimes it spans multiple lines. Just regex check
                    if not re.search(r"import\s*{[^}]*SEMANTIC_COLORS[^}]*}\s*from\s*['\"]@/src/components/exercise/courseExerciseTheme['\"]", content):
                        print(f"Missing import in {path}")
                        
                        # Add it to the courseExerciseTheme import if it exists
                        if re.search(r"import\s*{([^}]*)}\s*from\s*['\"]@/src/components/exercise/courseExerciseTheme['\"]", content):
                            content = re.sub(
                                r"(import\s*{[^}]*)\s*\}\s*from\s*['\"]@/src/components/exercise/courseExerciseTheme['\"]",
                                r"\1, SEMANTIC_COLORS } from \"@/src/components/exercise/courseExerciseTheme\"",
                                content
                            )
                        else:
                            content = "import { SEMANTIC_COLORS } from \"@/src/components/exercise/courseExerciseTheme\";\n" + content
                            
                        with open(path, "w") as f:
                            f.write(content)

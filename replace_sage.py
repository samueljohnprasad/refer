import os
import re

replacements = {
    "SAGE[500]": "SEMANTIC_COLORS.brand.primary",
    "SAGE[700]": "SEMANTIC_COLORS.brand.pressed",
    "SAGE[600]": "SEMANTIC_COLORS.text.secondary",
    "SAGE[400]": "SEMANTIC_COLORS.border.selected",
    "SAGE[300]": "SEMANTIC_COLORS.text.muted",
    "SAGE[200]": "SEMANTIC_COLORS.border.default",
    "SAGE[100]": "SEMANTIC_COLORS.surface.secondary",
    "SAGE[50]": "SEMANTIC_COLORS.surface.elevated",
    "SAGE[800]": "SEMANTIC_COLORS.shadow",
    "SAGE.selected": "SEMANTIC_COLORS.brand.soft",
    "SAGE.pill": "SEMANTIC_COLORS.success.soft",
    "INK": "SEMANTIC_COLORS.text.primary",
    "BRAND_BORDER": "SEMANTIC_COLORS.border.default",
    "BRAND_SURFACE": "SEMANTIC_COLORS.surface.primary",
}

for root, _, files in os.walk("src/components/exercise"):
    for file in files:
        if file.endswith((".tsx", ".ts")) and file != "courseExerciseTheme.ts":
            path = os.path.join(root, file)
            with open(path, "r") as f:
                content = f.read()
            
            original_content = content
            for old, new in replacements.items():
                content = content.replace(old, new)
                # also handle case where brackets might be different
                content = content.replace(old.replace("[", "\\[").replace("]", "\\]"), new)
            
            # Use regex to find and replace any remaining SAGE[...]
            content = re.sub(r'SAGE\[\d+\]', 'SEMANTIC_COLORS.brand.primary', content)
            
            # Clean up imports
            content = re.sub(r'import\s*{[^}]*SAGE[^}]*}\s*from\s*["\']@/lib/tokens["\'];?\n', '', content)
            content = re.sub(r',\s*SAGE', '', content)
            content = re.sub(r'SAGE,\s*', '', content)

            if content != original_content:
                if "SEMANTIC_COLORS" not in content:
                    content = "import { SEMANTIC_COLORS } from \"@/src/components/exercise/courseExerciseTheme\";\n" + content
                with open(path, "w") as f:
                    f.write(content)

import os
import re

for root, _, files in os.walk("src"):
    for file in files:
        if file.endswith((".tsx", ".ts")):
            path = os.path.join(root, file)
            with open(path, "r") as f:
                content = f.read()
            
            if "LSEMANTIC_COLORS.text.primaryING_MAP" in content:
                content = content.replace("EXERCISE_LSEMANTIC_COLORS.text.primaryING_MAP", "EXERCISE_LINKING_MAP")
                with open(path, "w") as f:
                    f.write(content)
            
            # Were there other replacements like LSEMANTIC_COLORS.text.primary? (LINK) -> THSEMANTIC_COLORS.text.primary? (THINK)
            if "THSEMANTIC_COLORS.text.primary" in content:
                content = content.replace("THSEMANTIC_COLORS.text.primary", "THINK")
                with open(path, "w") as f:
                    f.write(content)
                    
            if "SEMANTIC_COLORS.text.primary" in content and "INK" in content:
                pass
                
            content = content.replace("SHSEMANTIC_COLORS.text.primary", "SHINK")
            content = content.replace("DRSEMANTIC_COLORS.text.primary", "DRINK")
            content = content.replace("LSEMANTIC_COLORS.text.primary", "LINK")
            
            # Write back
            with open(path, "w") as f:
                f.write(content)

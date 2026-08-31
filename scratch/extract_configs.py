import os
import re

REGISTRY_PATH = "src/components/exercise/courseExerciseCategoryEngineRegistry.ts"
EXERCISES_DIR = "src/exercises"

with open(REGISTRY_PATH, "r") as f:
    content = f.read()

# We need to extract the inline objects.
# They look like:
#   [CourseExerciseCategoryEnum.Name]: {
#     category: CourseExerciseCategoryEnum.Name,
#     ...
#   },

# Let's find the start of the registry
start_idx = content.find("export const courseExerciseCategoryEngineRegistry")
if start_idx == -1:
    print("Could not find registry start")
    exit(1)

# Find all occurrences of [CourseExerciseCategoryEnum.X]: { ... }
pattern = r"\[CourseExerciseCategoryEnum\.([A-Za-z0-9_]+)\]:\s*\{([^{}]*(?:\{[^{}]*\}[^{}]*)*)\},"

matches = re.finditer(pattern, content)
imports = []
replacements = []

VALIDATION_MAP = {
    "TeachBackChain": "import { validateTeachBackChainContent } from \"@/src/components/exercise/teachBackChainValidation\";",
    "ExplorableModel": "import { validateExplorableModelContent } from \"@/src/components/exercise/explorableModelContent\";",
    "FadedThoughtRecord": "import { validateFadedThoughtRecordContent } from \"@/src/components/exercise/fadedThoughtRecordContent\";",
    "WorkedRewrite": "import { validateWorkedRewriteContent } from \"@/src/components/exercise/workedRewriteContent\";",
    "LayerZoom": "import { validateLayerZoomContent } from \"@/src/components/exercise/layerZoomContent\";",
    "Dialogue": "import { validateDialogueContent } from \"@/src/components/exercise/dialogueContent\";",
    "WhatIfMachine": "import { validateWhatIfContent } from \"@/src/components/exercise/whatif/whatIfContentValidation\";",
    "CourseCheckpoint": "import { validateCheckpointContent } from \"@/src/components/exercise/checkpoint/checkpointContentValidation\";",
    "RecallWarmup": "import { validateRecallWarmupContent } from \"@/src/components/exercise/microlearning/RecallWarmupCategoryEngine\";", # Wait, RecallWarmup is in microlearning/recallWarmupContentValidation.ts!
    "GuidedDiscoveryTrail": "import { validateGuidedDiscoveryTrailContent } from \"@/src/components/exercise/guidedDiscoveryTrailContent\";",
    "ReframeBuilder": "import { validateReframeBuilderContent } from \"@/src/components/exercise/reframeBuilderContent\";"
}

# Fix RecallWarmup import path
VALIDATION_MAP["RecallWarmup"] = "import { validateRecallWarmupContent } from \"@/src/components/exercise/microlearning/recallWarmupContentValidation\";"

for match in matches:
    name = match.group(1)
    body = match.group(2)
    
    # We will create a config file
    os.makedirs(f"{EXERCISES_DIR}/{name}", exist_ok=True)
    config_path = f"{EXERCISES_DIR}/{name}/config.ts"
    
    # Need to extract the engine name to add the import
    engine_match = re.search(r"engine:\s*([A-Za-z0-9_]+(?:\s+as\s+any)?)", body)
    engine_str = engine_match.group(1)
    engine_name = engine_str.split(" ")[0]
    
    # Find the import for the engine in the original file
    import_match = re.search(r"import\s+\{([^}]*" + engine_name + r"[^}]*)\}\s+from\s+[\"']([^\"']+)[\"'];?", content)
    engine_import = ""
    if import_match:
        engine_import = f"import {{ {import_match.group(1).strip()} }} from \"{import_match.group(2)}\";"
    else:
        print(f"Could not find import for {engine_name}")

    config_content = f"""import {{ CourseExerciseCategoryConfig, IMMEDIATE_OPTION_SELECTION }} from "@/src/components/exercise/courseExerciseCategoryConfig";
import {{ CourseExerciseCategoryEnum }} from "@/src/types/courseExercises";
{engine_import}
"""
    
    val_import = VALIDATION_MAP.get(name)
    val_fn = ""
    if val_import:
        config_content += val_import + "\n"
        fn_name = re.search(r"import \{ (.*?) \} from", val_import).group(1)
        if name in ["GuidedDiscoveryTrail", "ReframeBuilder"]:
            val_fn = f"""  validation: (content) => {{
    const issues = [];
    const {{ validateStringBudget }} = require("@/src/components/exercise/courseExerciseCategoryConfig");
    validateStringBudget(content, "title", 7, issues);
    validateStringBudget(content, "instruction", 12, issues);
    {fn_name}(content, issues);
    return issues as any;
  }},"""
        else:
            val_fn = f"""  validation: {fn_name},"""

    config_content += f"""
export const {name}Config: CourseExerciseCategoryConfig = {{
{body.strip()}{',' if not body.strip().endswith(',') else ''}
{val_fn}
}};
"""
    
    with open(config_path, "w") as f:
        f.write(config_content)
        
    imports.append(f"import {{ {name}Config }} from \"@/src/exercises/{name}/config\";")
    replacements.append((match.group(0), f"[CourseExerciseCategoryEnum.{name}]: {name}Config,"))

new_content = content
for old, new in replacements:
    new_content = new_content.replace(old, new)

# Add imports at the top
import_str = "\n".join(imports)
# Add after the first import
new_content = re.sub(r"(import .*?\n)", r"\1" + import_str + "\n", new_content, count=1)

with open(REGISTRY_PATH, "w") as f:
    f.write(new_content)

print(f"Extracted {len(replacements)} configs")

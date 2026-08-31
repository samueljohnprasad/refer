import re

path = "specs/005-js-driven-exercise-config/plan.md"
with open(path, "r") as f:
    content = f.read()

# Add batch transition files to source code block
source_addition = """└── domains/
    └── journey/
        └── learning/
            ├── courseExercisePrimaryTransition.ts
            ├── courseExerciseBatchTransitions.ts
            └── *BatchTransition.ts (to be deleted)"""
content = re.sub(r'└── domains/\n    └── journey/\n        └── learning/\n            └── courseExercisePrimaryTransition\.ts', source_addition, content)

# Add note about the batch extraction to Summary
content = content.replace(
"particularly in `microlearningContentValidation.ts`.",
"particularly in `microlearningContentValidation.ts` and the 7 legacy `*BatchTransition.ts` files."
)

with open(path, "w") as f:
    f.write(content)

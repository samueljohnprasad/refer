import re

files_to_patch = [
    "src/components/node/NodeEngineRouter.helpers.ts",
    "src/domains/journey/learning/courseExercisePrimaryTransition.ts"
]

for path in files_to_patch:
    with open(path, "r") as f:
        content = f.read()

    # We need to guard against category being null
    content = content.replace(
"""  const config = courseExerciseCategoryEngineRegistry[category] || FINAL_BATCH_CATEGORY_CONFIGS[category as keyof typeof FINAL_BATCH_CATEGORY_CONFIGS];""",
"""  const config = category ? (courseExerciseCategoryEngineRegistry[category] || FINAL_BATCH_CATEGORY_CONFIGS[category as keyof typeof FINAL_BATCH_CATEGORY_CONFIGS]) : null;"""
    )
    with open(path, "w") as f:
        f.write(content)

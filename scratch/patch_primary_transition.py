import re

path = "src/domains/journey/learning/courseExercisePrimaryTransition.ts"
with open(path, "r") as f:
    content = f.read()

# Remove the import
content = re.sub(
    r'import\s*\{\s*getBatchPrimaryLabel,\s*getBatchPrimaryTransition,\s*\}\s*from\s*"@/src/domains/journey/learning/courseExerciseBatchTransitions";\n',
    '',
    content
)

# Remove the batchLabel fallback
content = re.sub(
    r'\s*const batchLabel = getBatchPrimaryLabel\(exercise, response\);\n\s*if \(batchLabel !== undefined\) \{\n\s*return batchLabel;\n\s*\}',
    '',
    content
)

# Remove the batchTransition fallback
content = re.sub(
    r'\s*const batchTransition = getBatchPrimaryTransition\(exercise, response\);\n\s*if \(batchTransition !== undefined\) \{\n\s*return batchTransition;\n\s*\}',
    '',
    content
)

with open(path, "w") as f:
    f.write(content)

import re

path = "src/components/exercise/CourseExerciseShell.tsx"
with open(path, "r") as f:
    content = f.read()

content = re.sub(
    r'content: \{ flexGrow: 1 \},',
    'content: { flexGrow: 1, paddingTop: 16, paddingBottom: 32 },',
    content
)

with open(path, "w") as f:
    f.write(content)

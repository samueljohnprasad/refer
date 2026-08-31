import re

path = "src/domains/journey/learning/courseExercisePrimaryTransition.ts"
with open(path, "r") as f:
    content = f.read()

# Replace all unexported functions starting with get
content = re.sub(r'\nfunction (get[A-Za-z0-9_]+)', r'\nexport function \1', content)

with open(path, "w") as f:
    f.write(content)

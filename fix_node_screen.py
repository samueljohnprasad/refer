path = "src/components/node/NodeExerciseScreen.tsx"
with open(path, "r") as f:
    content = f.read()

content = content.replace("COURSE_EXERCISE_COLORS", "SEMANTIC_COLORS")
with open(path, "w") as f:
    f.write(content)

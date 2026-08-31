path = "specs/005-js-driven-exercise-config/tasks.md"
with open(path, "r") as f:
    content = f.read()

content = content.replace("- [ ] T013", "- [x] T013").replace("- [ ] T014", "- [x] T014")

with open(path, "w") as f:
    f.write(content)

import re

tasks_file = "specs/016-unified-node-system/tasks.md"
with open(tasks_file, "r") as f:
    content = f.read()

completed = [
    "T025", "T027", "T028", "T029", "T030", "T031"
]

for task_id in completed:
    content = re.sub(
        rf"- \[ \] {task_id}",
        f"- [x] {task_id}",
        content
    )

with open(tasks_file, "w") as f:
    f.write(content)

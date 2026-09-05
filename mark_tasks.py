import re

tasks_file = "specs/016-unified-node-system/tasks.md"
with open(tasks_file, "r") as f:
    content = f.read()

# Mark completed tasks based on the summary of work already done
completed = [
    "T008", "T009", "T010", "T011", "T012", "T013", 
    "T014", "T015", "T016", "T017", "T018", "T019", "T020",
    "T021", "T022", "T023", "T024", "T026"
]

for task_id in completed:
    content = re.sub(
        rf"- \[ \] {task_id}",
        f"- [x] {task_id}",
        content
    )

with open(tasks_file, "w") as f:
    f.write(content)

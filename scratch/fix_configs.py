import os

configs = [
    "WhatIfMachine",
    "NameIt",
    "LayerZoom",
    "Dialogue",
    "StoryWalkthrough",
    "CommonTrap",
    "StorySerial",
    "ExplorableModel",
    "WhiteBearExperiment"
]

for exercise in configs:
    filepath = f"src/exercises/{exercise}/config.ts"
    if not os.path.exists(filepath):
        continue
    
    with open(filepath, "r") as f:
        content = f.read()

    # replace `interaction: {` with `interaction: { submissionMode: "explicit",`
    # checking that we only replace the one we injected
    content = content.replace(
        "  interaction: {\n    getPrimary",
        "  interaction: {\n    submissionMode: \"explicit\",\n    getPrimary"
    )
    # StorySerial and CommonTrap might have slightly different shapes
    content = content.replace(
        "  interaction: {\n  },",
        "  interaction: {\n    submissionMode: \"explicit\",\n  },"
    )
    
    with open(filepath, "w") as f:
        f.write(content)

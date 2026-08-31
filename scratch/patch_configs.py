import os
import re

patches = {
    "WhatIfMachine": {
        "label": "getWhatIfLabel(exercise, response)",
        "transition": "getNextWhatIfState(exercise, response)",
        "imports": ["getWhatIfLabel", "getNextWhatIfState"]
    },
    "CourseCheckpoint": {
        "label": "getCheckpointLabel(exercise, response)",
        "transition": "getNextCheckpointState(exercise, response)",
        "imports": ["getCheckpointLabel", "getNextCheckpointState"]
    },
    "LearnCards": {
        "label": "getLearnCardsLabel(response)",
        "transition": "getNextLearnCardsState(exercise, response)",
        "imports": ["getLearnCardsLabel", "getNextLearnCardsState"]
    },
    "NameIt": {
        "label": "getNameItLabel(response)",
        "transition": "getNextNameItState(response)",
        "imports": ["getNameItLabel", "getNextNameItState"]
    },
    "LayerZoom": {
        "label": "getLayerZoomPrimaryLabel(exercise, response)",
        "transition": "getNextLayerZoomState(exercise, response) ?? null",
        "imports": ["getLayerZoomPrimaryLabel", "getNextLayerZoomState"]
    },
    "Dialogue": {
        "label": "getDialogueLabel(exercise, response)",
        "transition": "getNextDialogueState(exercise, response)",
        "imports": ["getDialogueLabel", "getNextDialogueState"]
    },
    "StoryWalkthrough": {
        "label": "getStoryWalkthroughLabel(exercise, response)",
        "transition": "getNextStoryWalkthroughState(exercise, response)",
        "imports": ["getStoryWalkthroughLabel", "getNextStoryWalkthroughState"]
    },
    "CommonTrap": {
        "label": "response.revealed === true ? 'Continue' : 'And then what happens?'",
        "transition": "response.revealed === true ? null : { kind: 'response' as const, ready: true, response: { ...response, revealed: true } }",
        "imports": []
    },
    "StorySerial": {
        "label": "getStorySerialLabel(response)",
        "transition": "null", # not in transition switch
        "imports": ["getStorySerialLabel"]
    },
    "ExplorableModel": {
        "label": "getExplorableModelPrimaryLabel(exercise, response)",
        "transition": "getNextExplorableModelState(exercise, response) ?? null",
        "imports": ["getExplorableModelPrimaryLabel", "getNextExplorableModelState"]
    },
    "WhiteBearExperiment": {
        "label": "getWhiteBearLabel(response)",
        "transition": "getNextWhiteBearState(response)",
        "imports": ["getWhiteBearLabel", "getNextWhiteBearState"]
    },
    "InventFirst": {
        "label": "response.selectedOptionId ? 'Look again. What differs?' : null",
        "transition": "null",
        "imports": []
    }
}

for exercise, data in patches.items():
    filepath = f"src/exercises/{exercise}/config.ts"
    if not os.path.exists(filepath):
        print(f"Skipping {exercise}, file not found")
        continue
    
    with open(filepath, "r") as f:
        content = f.read()

    # check if interaction is already in there
    if "interaction:" in content:
        print(f"Skipping {exercise}, already has interaction")
        continue
        
    # Inject imports
    if data["imports"]:
        import_stmt = f"import {{ {', '.join(data['imports'])} }} from '@/src/domains/journey/learning/courseExercisePrimaryTransition';\n"
        content = import_stmt + content

    # Inject interaction block
    # the config ends with:
    #   validation: ...
    # };
    # We will inject interaction block right before validation or at the end
    
    interaction_block = "  interaction: {\n"
    if data["label"]:
        interaction_block += f"    getPrimaryLabel: (exercise, response) => {data['label']},\n"
    if data["transition"] != "null":
        interaction_block += f"    getPrimaryTransition: (exercise, response) => {data['transition']},\n"
    interaction_block += "  },"
    
    content = content.replace("  validation:", interaction_block + "\n  validation:")
    
    with open(filepath, "w") as f:
        f.write(content)
    
    print(f"Patched {exercise}")


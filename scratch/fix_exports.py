import re

path = "src/domains/journey/learning/courseExercisePrimaryTransition.ts"
with open(path, "r") as f:
    content = f.read()

# Add exports for all the imported helpers
exports_to_add = """
export {
  getExplorableModelPrimaryLabel,
  getNextExplorableModelState,
} from "@/src/domains/journey/learning/explorableModelTransition";

export {
  getLayerZoomPrimaryLabel,
  getNextLayerZoomState,
} from "@/src/domains/journey/learning/layerZoomTransition";

export {
  getLearnCardsLabel,
  getNameItLabel,
  getNextLearnCardsState,
  getNextNameItState,
  getNextWhiteBearState,
  getStorySerialLabel,
  getWhiteBearLabel,
} from "@/src/domains/journey/learning/courseExerciseSimpleTransitions";
"""
content = content + exports_to_add

with open(path, "w") as f:
    f.write(content)

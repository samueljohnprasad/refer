import re
import os

# Patch CourseChoice
choice_path = "src/exercises/CourseChoice/config.ts"
if os.path.exists(choice_path):
    with open(choice_path, "r") as f:
        content = f.read()
    
    # We need to add feedback block. The original getSelectedOptionFeedback logic:
    logic = """
function readString(value: unknown): string | null {
  return typeof value === "string" && value.length > 0 ? value : null;
}

const getSelectedOptionFeedback = (exercise: import("@/src/types/journeyV5").Exercise, response?: Record<string, unknown> | null) => {
  const selectedOptionId = readString(response?.selectedOptionId);
  const options = exercise?.content?.options;
  if (!selectedOptionId || !Array.isArray(options)) return null;
  const selectedOption = options.find(option => option && typeof option === "object" && !Array.isArray(option) && readString((option as Record<string, unknown>).id) === selectedOptionId);
  return selectedOption && typeof selectedOption === "object" ? readString((selectedOption as Record<string, unknown>).feedback) : null;
};
"""
    if "getSelectedOptionFeedback" not in content:
        content = content.replace("export const CourseChoiceConfig", logic + "\nexport const CourseChoiceConfig")
        content = content.replace("  validation:", "  feedback: {\n    getSelectedOptionFeedback\n  },\n  validation:")
        with open(choice_path, "w") as f:
            f.write(content)

# Patch GuidedRecallChips
chips_path = "src/exercises/GuidedRecallChips/config.ts"
if os.path.exists(chips_path):
    with open(chips_path, "r") as f:
        content = f.read()

    logic = """
const buildRetryResponse = (exercise: import("@/src/types/journeyV5").Exercise, response: Record<string, unknown>) => {
  const retryPhase = exercise.content?.retryPhase;
  if (typeof retryPhase !== "string") return null;
  return {
    ...response,
    phase: retryPhase,
    selectedOptionId: null,
    isCorrect: false,
    feedbackText: null,
    selectedChips: []
  };
};
"""
    if "buildRetryResponse" not in content:
        content = content.replace("export const GuidedRecallChipsConfig", logic + "\nexport const GuidedRecallChipsConfig")
        content = content.replace("  validation:", "  interaction: {\n    submissionMode: \"explicit\",\n    buildRetryResponse\n  },\n  validation:")
        with open(chips_path, "w") as f:
            f.write(content)


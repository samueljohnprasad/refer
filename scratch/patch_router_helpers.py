import re

path = "src/components/node/NodeEngineRouter.helpers.ts"
with open(path, "r") as f:
    content = f.read()

# Make sure to import the registry
import_stmt = """import { courseExerciseCategoryEngineRegistry } from '@/src/components/exercise/courseExerciseCategoryEngineRegistry';
import { FINAL_BATCH_CATEGORY_CONFIGS } from '@/src/components/exercise/courseExerciseFinalBatchRegistry';
"""
if "courseExerciseCategoryEngineRegistry" not in content:
    content = import_stmt + content

content = content.replace(
"""function getSelectedOptionFeedback(
  exercise: Exercise | undefined,
  response?: Record<string, unknown> | null,
): string | null {
  if (exercise?.type !== CourseExerciseCategoryEnum.CourseChoice) {
    return null;
  }

  const selectedOptionId = readString(response?.selectedOptionId);
  const options = exercise?.content?.options;
  if (!selectedOptionId || !Array.isArray(options)) {
    return null;
  }

  const selectedOption = options.find((option) => {
    return (
      option &&
      typeof option === "object" &&
      !Array.isArray(option) &&
      readString((option as Record<string, unknown>).id) === selectedOptionId
    );
  });
  return selectedOption && typeof selectedOption === "object"
    ? readString((selectedOption as Record<string, unknown>).feedback)
    : null;
}""",
"""function getSelectedOptionFeedback(
  exercise: Exercise | undefined,
  response?: Record<string, unknown> | null,
): string | null {
  if (!exercise) return null;
  const category = resolveCourseExerciseCategory(exercise);
  const config = courseExerciseCategoryEngineRegistry[category] || FINAL_BATCH_CATEGORY_CONFIGS[category as keyof typeof FINAL_BATCH_CATEGORY_CONFIGS];
  if (config?.feedback?.getSelectedOptionFeedback) {
    return config.feedback.getSelectedOptionFeedback(exercise, response);
  }
  return null;
}"""
)

content = content.replace(
"""export function buildRetryResponse(
  exercise: Exercise,
  response: Record<string, unknown>,
): Record<string, unknown> | null {
  const retryPhase = exercise.content?.retryPhase;
  if (typeof retryPhase !== "string") {
    return null;
  }

  const baseResponse = {
    ...response,
    phase: retryPhase,
    selectedOptionId: null,
    isCorrect: false,
    feedbackText: null,
  };

  return exercise.type === CourseExerciseCategoryEnum.GuidedRecallChips
    ? { ...baseResponse, selectedChips: [] }
    : baseResponse;
}""",
"""export function buildRetryResponse(
  exercise: Exercise,
  response: Record<string, unknown>,
): Record<string, unknown> | null {
  const category = resolveCourseExerciseCategory(exercise);
  const config = courseExerciseCategoryEngineRegistry[category] || FINAL_BATCH_CATEGORY_CONFIGS[category as keyof typeof FINAL_BATCH_CATEGORY_CONFIGS];
  if (config?.interaction?.buildRetryResponse) {
    return config.interaction.buildRetryResponse(exercise, response);
  }

  const retryPhase = exercise.content?.retryPhase;
  if (typeof retryPhase !== "string") {
    return null;
  }

  const baseResponse = {
    ...response,
    phase: retryPhase,
    selectedOptionId: null,
    isCorrect: false,
    feedbackText: null,
  };
  return baseResponse;
}"""
)

with open(path, "w") as f:
    f.write(content)

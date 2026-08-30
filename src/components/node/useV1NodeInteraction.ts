import { useCallback } from "react";
import type { AppDispatch } from "@/src/store/store";
import { courseExerciseCategoryEngineRegistry } from "@/src/components/exercise/courseExerciseCategoryEngineRegistry";
import {
  shouldSubmitExerciseResponseImmediately,
  type CourseExerciseCategoryConfig,
} from "@/src/components/exercise/courseExerciseCategoryConfig";
import {
  checkV1LearningAnswer,
  recordV1LearningInteraction,
} from "@/src/domains/journey/learning/v1LearningSessionSlice";

export function useV1NodeInteraction(dispatch: AppDispatch, nodeId: string) {
  return useCallback(
    (
      response: Record<string, unknown>,
      isFooterActionEnabled = true,
    ) => {
      dispatch(
        recordV1LearningInteraction({
          nodeId,
          response,
          ready: isFooterActionEnabled,
        }),
      );
      const categoryConfig = findCategoryConfig(response.format);
      if (
        shouldSubmitExerciseResponseImmediately(
          categoryConfig?.interaction,
          response,
        )
      ) {
        dispatch(checkV1LearningAnswer({ nodeId }));
      }
    },
    [dispatch, nodeId],
  );
}

function findCategoryConfig(
  format: unknown,
): CourseExerciseCategoryConfig | undefined {
  if (typeof format !== "string") {
    return undefined;
  }

  return Object.values(courseExerciseCategoryEngineRegistry).find((config) =>
    config?.formats.includes(format),
  );
}

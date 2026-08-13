import { useCallback } from "react";
import type { AppDispatch } from "@/src/store/store";
import type { V1InteractionOptions } from "@/src/domains/journey/learning/v1LearningEngineTypes";
import {
  checkV1LearningAnswer,
  recordV1LearningInteraction,
} from "@/src/domains/journey/learning/v1LearningSessionSlice";

export function useV1NodeInteraction(dispatch: AppDispatch, nodeId: string) {
  return useCallback(
    (
      response: Record<string, unknown>,
      isFooterActionEnabled = true,
      options?: V1InteractionOptions,
    ) => {
      dispatch(
        recordV1LearningInteraction({
          nodeId,
          response,
          ready: isFooterActionEnabled,
        }),
      );
      if (options?.revealImmediately) {
        dispatch(checkV1LearningAnswer({ nodeId }));
      }
    },
    [dispatch, nodeId],
  );
}

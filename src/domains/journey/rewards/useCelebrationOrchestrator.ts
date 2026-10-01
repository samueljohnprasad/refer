// src/domains/journey/rewards/useCelebrationOrchestrator.ts
// ponytail: priority logic hook. Reads completeNode response, dispatches
// the correct celebration level. Domain-isolated — never mutates progress state.

import { useCallback } from "react";
import { useAppDispatch } from "@/src/store/hooks";
import type {
  CompleteNodeResponse,
  LessonCelebrationStats,
} from "@/src/types/journeyV5";
import { CelebrationLevel } from "@/src/types/journeyV5";
import { setPendingCelebration } from "../state/journeySlice";
import { requestReviewForMilestone } from "@/src/hooks/useReviewPrompt";
import { createLogger } from "@/src/lib/logger";

const logger = createLogger("celebration-orchestrator");

interface UseCelebrationOrchestratorResult {
  /**
   * Call this immediately after a successful completeNode response.
   * Dispatches setPendingCelebration with the highest-priority level:
   *   course > unit > lesson
   * Optional `stats` (time spent, perfect lesson) are attached to lesson celebrations.
   */
  handleCompletionResult: (
    result: CompleteNodeResponse,
    stats?: LessonCelebrationStats,
  ) => void;
}

/**
 * Determines which single celebration surface to show after a node completion.
 * Priority: course > unit > lesson (FR-4.5, SC-5).
 */
export function useCelebrationOrchestrator(
  courseId: string,
): UseCelebrationOrchestratorResult {
  const dispatch = useAppDispatch();

  const handleCompletionResult = useCallback(
    (result: CompleteNodeResponse, stats?: LessonCelebrationStats): void => {
      try {
        const celebration =
          result.celebration?.level === CelebrationLevel.LESSON && stats
            ? { ...result.celebration, stats }
            : result.celebration;

        // ponytail: diagnostic logger for celebration orchestration
        logger.info("Dispatching pendingCelebration", { courseId, celebration });
        dispatch(setPendingCelebration({ courseId, celebration }));
        // ponytail: trigger App Store review prompt when user completes a unit/course celebration
        if (result.celebration?.level === "unit" || result.celebration?.level === "course") {
          setTimeout(() => {
            requestReviewForMilestone("course_unit_completed");
          }, 2400);
        }
      } catch (err) {
        // ponytail: never throw — rewards must not block navigation (FR-5.4)
        logger.warn("Orchestrator error", err);
      }
    },
    [courseId, dispatch],
  );

  return { handleCompletionResult };
}

// src/domains/journey/rewards/useCelebrationOrchestrator.ts
// ponytail: priority logic hook. Reads completeNode response, dispatches
// the correct celebration level. Domain-isolated — never mutates progress state.

import { useCallback } from "react";
import { useAppDispatch } from "@/src/store/hooks";
import type { CompleteNodeResponse } from "@/src/types/journeyV5";
import { setPendingCelebration } from "../state/journeySlice";

interface UseCelebrationOrchestratorResult {
  /**
   * Call this immediately after a successful completeNode response.
   * Dispatches setPendingCelebration with the highest-priority level:
   *   course > unit > lesson
   */
  handleCompletionResult: (result: CompleteNodeResponse) => void;
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
    (result: CompleteNodeResponse): void => {
      try {
        const level = resolveLevel(result);
        dispatch(setPendingCelebration({ courseId, level }));
      } catch (err) {
        // ponytail: never throw — rewards must not block navigation (FR-5.4)
        console.warn("[rewards] orchestrator error", err);
      }
    },
    [courseId, dispatch],
  );

  return { handleCompletionResult };
}

// ── Priority logic ────────────────────────────────────────────────────────────

function resolveLevel(
  result: CompleteNodeResponse,
): 'lesson' | 'unit' | 'course' {
  if (result.courseCompleted) return 'course';
  if (result.unitCompleted) return 'unit';
  return 'lesson';
}

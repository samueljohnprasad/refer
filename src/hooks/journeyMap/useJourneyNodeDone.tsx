/**
 * useJourneyNodeDone
 *
 * Encapsulates the entire "Done" pipeline for the simple JourneyMapFlashList
 * flow (as opposed to the richer useNodeCompletion used by the MH journey):
 *
 *  1. Resolve the enrollment ID (from active course or by fetching progress)
 *  2. Call `completeNodeApi` on the active node
 *  3. Dispatch section / enrollment refreshes
 *  4. Show success / error toasts
 *  5. Signal the parent with `onSuccess` so it can clear the selected node
 *     and set a pending focus target
 *
 * Returns: `{ isCompletingNode, handleDonePress }`
 *
 * Lives in `hooks/journeyMap/` to sit alongside the other journey-map hooks.
 */

import React, { useCallback, useState } from "react";
import { useToast, Toast, ToastTitle } from "@/components/ui/toast";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import { selectCurrentSectionNumber } from "@/src/store/selectors/enrolledCoursesSelectors";
import { setCurrentSectionNumber } from "@/src/store/slices/enrolledCoursesSlice";
import { fetchSectionUnits } from "@/src/store/api/sectionMapApi";
import { fetchEnrolledCourses } from "@/src/store/api/enrolledCoursesApi";
import { completeNodeApi, fetchUserProgress } from "@/src/lib/api/journeyApi";
import type { PathNodeData } from "@/src/types/journey";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface UseJourneyNodeDoneParams {
  /** Slug of the currently active course — drives section fetches */
  slugOverride: string | undefined;
  /** Active course metadata (id + enrollmentId) */
  activeCourse: { id: string; enrollmentId: string | null } | null | undefined;
  /** The node the user has tapped "Done" on */
  selectedNode: PathNodeData | null;
  /** Called on success with the next node ID (may be null when journey is done) */
  onSuccess: (nextNodeId: string | null) => void;
}

export interface UseJourneyNodeDoneReturn {
  /** True while the completion API call is in-flight */
  isCompletingNode: boolean;
  /** Stable handler — attach to the "Done" button */
  handleDonePress: () => Promise<void>;
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useJourneyNodeDone({
  slugOverride,
  activeCourse,
  selectedNode,
  onSuccess,
}: UseJourneyNodeDoneParams): UseJourneyNodeDoneReturn {
  const dispatch = useAppDispatch();
  const toast = useToast();
  const currentSectionNumber = useAppSelector(selectCurrentSectionNumber);
  const [isCompletingNode, setIsCompletingNode] = useState<boolean>(false);

  const handleDonePress = useCallback(async (): Promise<void> => {
    if (!selectedNode || !slugOverride) return;

    if (!activeCourse?.id) {
      toast.show({
        id: "missing-course",
        placement: "bottom",
        render: () => (
          <Toast action="error">
            <ToastTitle>Journey not found.</ToastTitle>
          </Toast>
        ),
      });
      return;
    }

    try {
      setIsCompletingNode(true);

      // Resolve enrollment ID — prefer the cached value on activeCourse.
      let enrollmentId: string | null = activeCourse.enrollmentId;
      if (!enrollmentId) {
        const progressRes = await fetchUserProgress(activeCourse.id);
        enrollmentId = progressRes.data?.enrollment.id ?? null;
      }

      if (!enrollmentId) {
        toast.show({
          id: "missing-enrollment",
          placement: "bottom",
          render: () => (
            <Toast action="error">
              <ToastTitle>Enrollment not found for this journey.</ToastTitle>
            </Toast>
          ),
        });
        return;
      }

      const result = await completeNodeApi({ enrollmentId, nodeId: selectedNode.id });
      console.log("resulttttt", result);
      if (!result.success || !result.data.success) {
        toast.show({
          id: `complete-error-${selectedNode.id}`,
          placement: "bottom",
          render: () => (
            <Toast action="error">
              <ToastTitle>
                {result.error ?? result.data?.error ?? "Failed to complete node."}
              </ToastTitle>
            </Toast>
          ),
        });
        return;
      }

      const nextSectionNumber = result.data.currentSectionNumber ?? currentSectionNumber;
      const nextNodeId: string | null = result.data.currentNodeId ?? null;

      // Keep the section pointer up-to-date and re-fetch section data.
      if (nextSectionNumber) {
        dispatch(setCurrentSectionNumber(nextSectionNumber));
        // await dispatch(fetchSectionUnits({ slug: slugOverride, sectionNumber: nextSectionNumber }));
      }

      // Refresh the enrolled courses list so stale counts/status are cleared.
      // await dispatch(fetchEnrolledCourses());

      onSuccess(nextNodeId);

      if (result.data.journeyCompleted) {
        toast.show({
          id: "journey-completed",
          placement: "top",
          duration: 4000,
          render: () => (
            <Toast action="success">
              <ToastTitle>Journey completed. 🎉</ToastTitle>
            </Toast>
          ),
        });
      }
    } catch {
      toast.show({
        id: `complete-error-${selectedNode.id}`,
        placement: "bottom",
        render: () => (
          <Toast action="error">
            <ToastTitle>Something went wrong while completing the node.</ToastTitle>
          </Toast>
        ),
      });
    } finally {
      setIsCompletingNode(false);
    }
  }, [
    activeCourse?.id,
    activeCourse?.enrollmentId,
    currentSectionNumber,
    dispatch,
    onSuccess,
    selectedNode,
    slugOverride,
    toast,
  ]);

  return { isCompletingNode, handleDonePress };
}

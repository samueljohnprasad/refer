import React from "react";
import { useJourneyMapListViewModel } from "../../hooks/useJourneyMapListViewModel";
import JourneyMapListView from "./JourneyMapListView";
import type { useJourneyMapController } from "../../hooks/useJourneyMapController";

export interface JourneyMapFlashListProps {
  courseId: string;
  controller: ReturnType<typeof useJourneyMapController>;
  isOnboarding?: boolean;
  completedNodeId?: string;
}

/**
 * Container component for JourneyMapFlashList.
 * Computes all list rendering callbacks, header/footer spacing, and state flags.
 * Passes pure data model and action handlers to JourneyMapListView.
 */
export const JourneyMapFlashList = React.memo(function JourneyMapFlashList({
  courseId,
  controller,
  isOnboarding,
  completedNodeId,
}: JourneyMapFlashListProps): React.JSX.Element {
  const { model, actions } = useJourneyMapListViewModel({
    courseId,
    controller,
    isOnboarding,
    completedNodeId,
  });
  return <JourneyMapListView model={model} actions={actions} />;
});

export * from "../../hooks/useJourneyMapListViewModel";
export * from "./JourneyMapListView";
export default JourneyMapFlashList;

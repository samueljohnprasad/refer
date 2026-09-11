import React from "react";
import { useJourneyMapViewModel } from "./hooks/useJourneyMapViewModel";
import JourneyMapView from "./JourneyMapView";

/**
 * Container component for the Journey Map.
 * Handles state management, data fetching, hooks, and transforms via useJourneyMapViewModel.
 * Passes pure model data and action handlers to JourneyMapView without extra markup.
 */
export interface JourneyMapContainerProps {
  courseId?: string;
  slug?: string;
  completedNodeId?: string;
  isOnboarding?: boolean;
  onComplete?: () => void;
}

export default function JourneyMapContainer({
  courseId,
  slug,
  completedNodeId,
  isOnboarding,
  onComplete,
}: JourneyMapContainerProps): React.JSX.Element {
  const { model, actions } = useJourneyMapViewModel({ courseId, slug, completedNodeId });

  const hasInitializedRef = React.useRef(false);
  const baselineIndexRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    if (!isOnboarding || !onComplete || !model.controller.isLoaded) {
      return;
    }

    const current = model.controller.activeGlobalIndex;

    // Capture initial active index once the course tree and progress have finished loading
    if (!hasInitializedRef.current) {
      hasInitializedRef.current = true;
      baselineIndexRef.current = current;
      return;
    }

    const baseline = baselineIndexRef.current;
    // Auto-advance only if the user actually completed a lesson while on this screen
    // (i.e. the active node index increased beyond the initial baseline).
    if (baseline !== null && current > baseline) {
      onComplete();
    }
  }, [
    isOnboarding,
    onComplete,
    model.controller.isLoaded,
    model.controller.activeGlobalIndex,
  ]);

  return (
    <JourneyMapView
      model={model}
      actions={actions}
      isOnboarding={isOnboarding}
    />
  );
}

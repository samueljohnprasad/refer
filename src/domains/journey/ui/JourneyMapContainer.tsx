import React from "react";
import { useJourneyMapViewModel } from "./hooks/useJourneyMapViewModel";
import JourneyMapView from "./JourneyMapView";

/**
 * Container component for the Journey Map.
 * Handles state management, data fetching, hooks, and transforms via useJourneyMapViewModel.
 * Passes pure model data and action handlers to JourneyMapView without extra markup.
 */
export interface JourneyMapContainerProps {
  isOnboarding?: boolean;
  onComplete?: () => void;
}

export default function JourneyMapContainer({
  isOnboarding,
  onComplete,
}: JourneyMapContainerProps): React.JSX.Element {
  const { model, actions } = useJourneyMapViewModel();

  const prevIndexRef = React.useRef(model.controller.activeGlobalIndex);

  React.useEffect(() => {
    const prev = prevIndexRef.current;
    const current = model.controller.activeGlobalIndex;
    
    // Auto-advance only if the user actually completed a lesson while on this screen
    // (i.e. the active node index increased).
    if (isOnboarding && onComplete && current > 0 && current > prev) {
      onComplete();
    }
    
    prevIndexRef.current = current;
  }, [isOnboarding, onComplete, model.controller.activeGlobalIndex]);

  return (
    <JourneyMapView
      model={model}
      actions={actions}
      isOnboarding={isOnboarding}
    />
  );
}

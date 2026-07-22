import React from "react";
import { useJourneyMapViewModel } from "./hooks/useJourneyMapViewModel";
import JourneyMapView from "./JourneyMapView";

/**
 * Container component for the Journey Map.
 * Handles state management, data fetching, hooks, and transforms via useJourneyMapViewModel.
 * Passes pure model data and action handlers to JourneyMapView without extra markup.
 */
export default function JourneyMapContainer(): React.JSX.Element {
  const { model, actions } = useJourneyMapViewModel();
  return <JourneyMapView model={model} actions={actions} />;
}

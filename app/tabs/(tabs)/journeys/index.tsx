// app/tabs/(tabs)/journeys/index.tsx
// Journeys tab entry point. Delegates entirely to JourneyMapContainer.

import React from "react";
import JourneyMapContainer from "@/src/screens/JourneyMapScreen/JourneyMapContainer";

export default function JourneysTab(): React.JSX.Element {
  return <JourneyMapContainer />;
}

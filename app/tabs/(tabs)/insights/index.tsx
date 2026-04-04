import React from "react";
import JourneyMapContainer from "@/src/screens/JourneyMapScreen/JourneyMapContainer";
import { JourneyConfigProvider } from "@/src/context/JourneyConfigContext";

export default function InsightsTab() {
  return (
    <JourneyConfigProvider>
      <JourneyMapContainer />
    </JourneyConfigProvider>
  );
}



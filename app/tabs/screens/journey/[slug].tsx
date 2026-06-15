/**
 * Dynamic journey map route: /tabs/screens/journey/[slug]
 * Renders the journey map for a specific mental health journey.
 */

import React from "react";
import JourneyMapContainer from "@/src/screens/JourneyMapScreen/JourneyMapContainer";

export default function JourneyMapRoute(): React.JSX.Element {
  return <JourneyMapContainer />;
}

/**
 * Dynamic journey map route: /tabs/screens/journey/[slug]
 * Renders the journey map for a specific mental health journey.
 */

import SuspensLoader from "@/src/components/SuspensLoader";
import React, { lazy } from "react";

const JourneyMapContainer = lazy(
  () => import("@/src/screens/JourneyMapScreen/JourneyMapContainer"),
);

export default function JourneyMapRoute(): React.JSX.Element {
  return (
    <SuspensLoader>
      <JourneyMapContainer />
    </SuspensLoader>
  );
}

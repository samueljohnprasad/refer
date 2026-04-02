import SuspensLoader from "@/src/components/SuspensLoader";
import React, { lazy } from "react";

const JourneyMapScreen = lazy(
  () => import("@/src/screens/JourneyMapScreen/JourneyMapContainer"),
);

export default function JourneyMapRoute(): React.JSX.Element {
  return (
    <SuspensLoader>
      <JourneyMapScreen />
    </SuspensLoader>
  );
}

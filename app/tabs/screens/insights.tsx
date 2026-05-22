import React, { lazy } from "react";

import SuspensLoader from "@/src/components/SuspensLoader";

const InsightsScreen = lazy(
  () => import("@/src/screens/InsightsScreen/InsightsScreen"),
);

export default function InsightsRoute() {
  return (
    <SuspensLoader>
      <InsightsScreen />
    </SuspensLoader>
  );
}

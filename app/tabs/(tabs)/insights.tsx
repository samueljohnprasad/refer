import SuspensLoader from "@/src/components/SuspensLoader";
import React, { lazy } from "react";
const AIInsightsScreen = lazy(
  () => import("@/src/screens/AIInsightsScreen/AIInsightsScreen")
);

export default function InsightsTab() {
  return (
    <SuspensLoader>
      <AIInsightsScreen />
    </SuspensLoader>
  );
}

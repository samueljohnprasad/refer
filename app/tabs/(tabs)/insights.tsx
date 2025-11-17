import React, { lazy } from "react";
const AIInsightsScreen = lazy(() => import("@/src/screens/AIInsightsScreen/AIInsightsScreen"));

export default function InsightsTab() {
  return <AIInsightsScreen />;
}

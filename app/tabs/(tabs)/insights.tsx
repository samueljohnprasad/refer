import SuspensLoader from "@/src/components/SuspensLoader";
import SwiftUI from "@/src/components/ui/swiftui";
import React, { lazy } from "react";
const AIInsightsScreen = lazy(
  () => import("@/src/screens/AIInsightsScreen/AIInsightsScreen")
);

export default function InsightsTab() {
  return <SwiftUI />;
}

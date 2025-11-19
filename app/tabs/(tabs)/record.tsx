import SuspensLoader from "@/src/components/SuspensLoader";
import React, { lazy } from "react";
const DiscoveryScreen = lazy(
  () => import("@/src/screens/DiscoveryScreen/DiscoveryScreen")
);
export default function RecordTab() {
  return (
    <SuspensLoader>
      <DiscoveryScreen />
    </SuspensLoader>
  );
}

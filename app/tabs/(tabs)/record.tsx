import SuspensLoader from "@/src/components/SuspensLoader";
import React, { lazy } from "react";
import DiscoveryScreen from "@/src/screens/DiscoveryScreen/DiscoveryScreen";
export default function RecordTab() {
  return (
    <SuspensLoader>
      <DiscoveryScreen />
    </SuspensLoader>
  );
}

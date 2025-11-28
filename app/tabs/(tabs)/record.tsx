import SuspensLoader from "@/src/components/SuspensLoader";
import { AudioRecordingProvider } from "@/src/context/AudioRecordingContext";
import React, { lazy } from "react";
const DiscoveryScreen = lazy(
  () => import("@/src/screens/DiscoveryScreen/DiscoveryScreen")
);
export default function RecordTab() {
  return (
    <SuspensLoader>
      <AudioRecordingProvider>
        <DiscoveryScreen />
      </AudioRecordingProvider>
    </SuspensLoader>
  );
}

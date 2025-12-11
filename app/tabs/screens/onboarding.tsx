import React, { lazy } from "react";
const Steps = lazy(() => import("@/src/components/steps"));
import { View } from "react-native";
import SuspensLoader from "@/src/components/SuspensLoader";

export default function OnboardingScreen() {
  return (
    <View style={{ flex: 1 }}>
      <SuspensLoader>
        <Steps />
      </SuspensLoader>
    </View>
  );
}

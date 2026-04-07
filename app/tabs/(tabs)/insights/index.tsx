/**
 * InsightsTab — Backward Compatibility Redirect
 * The "Learn" tab has been consolidated into the "Journeys" tab.
 * This file redirects any deep links or stale navigation to the unified entry point.
 */

import React, { useEffect } from "react";
import { router } from "expo-router";
import { View, ActivityIndicator } from "react-native";

export default function InsightsTab(): React.JSX.Element {
  useEffect(() => {
    router.replace("/tabs/(tabs)/journeys" as never);
  }, []);

  return (
    <View className="flex-1 items-center justify-center bg-white">
      <ActivityIndicator
        size="large"
        color="#7B61FF"
      />
    </View>
  );
}

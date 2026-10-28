// ponytail: direct paywall screen with impression and dismissal telemetry
import { useEffect, useCallback } from "react";
import { View } from "react-native";
import { Stack, router } from "expo-router";
import RevenueCatUI from "react-native-purchases-ui";
import { usePostHog } from "posthog-react-native";

export default function PaywallScreen() {
  const posthog = usePostHog();

  useEffect(() => {
    posthog?.capture("paywall_viewed", { source: "direct_screen" });
  }, [posthog]);

  const handleDismiss = useCallback(() => {
    posthog?.capture("paywall_dismissed", {
      source: "direct_screen",
      method: "close",
    });
    router.back();
  }, [posthog]);

  const handlePurchaseCompleted = useCallback(() => {
    posthog?.capture("paywall_purchased", { source: "direct_screen" });
    router.replace("/");
  }, [posthog]);

  const handleRestoreCompleted = useCallback(() => {
    posthog?.capture("paywall_restored", { source: "direct_screen" });
    router.replace("/");
  }, [posthog]);

  return (
    <View style={{ flex: 1 }}>
      <Stack.Screen 
        options={{
          headerShown: false,
          presentation: "card",
          gestureEnabled: false,
        }} 
      />
      <RevenueCatUI.Paywall
        onDismiss={handleDismiss}
        onPurchaseCompleted={handlePurchaseCompleted}
        onRestoreCompleted={handleRestoreCompleted}
      />
    </View>
  );
}

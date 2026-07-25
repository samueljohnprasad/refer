import { View } from "react-native";
import { Stack, router } from "expo-router";
import RevenueCatUI from "react-native-purchases-ui";

export default function PaywallScreen() {
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
        onDismiss={() => router.back()}
        onPurchaseCompleted={() => router.replace("/")}
        onRestoreCompleted={() => router.replace("/")}
      />
    </View>
  );
}

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(tabs)",
};

import { Stack } from "expo-router";

export default function AppLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="screens/settings"
        options={{
          headerShown: false,
          title: "Settings",
          animation: "fade",
          animationDuration: 500,
        }}
      />

      <Stack.Screen
        name="screens/paywall"
        options={{
          headerShown: false,
          presentation: "containedModal",
          title: "Paywall",
          animation: "fade_from_bottom",
          animationDuration: 500,
        }}
      />
    </Stack>
  );
}

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(tabs)",
};
import { enableScreens } from "react-native-screens";
enableScreens(true);

import { Stack } from "expo-router";

export default function AppLayout() {
  return (
    <Stack
      screenOptions={{
        animation: "none",
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="screens/settings"
        options={{
          headerShown: false,
          title: "Settings",
          animation: "slide_from_right",
          freezeOnBlur: true,
        }}
      />

      <Stack.Screen
        name="screens/paywall"
        options={{
          headerShown: false,
          presentation: "containedModal",
          title: "Paywall",
          animation: "fade_from_bottom",
          freezeOnBlur: true,
          // animation: "none",
        }}
      />

      <Stack.Screen
        name="screens/compdisplay"
        options={{
          headerShown: false,
          title: "Compdisplay",
          freezeOnBlur: true,
          animation: "fade",
        }}
      />

      <Stack.Screen
        name="screens/onboarding"
        options={{
          headerShown: false,
          title: "Onboarding",
          freezeOnBlur: true,
          animation: "fade",
        }}
      />
      <Stack.Screen
        name="screens/onboard-container"
        options={{
          headerShown: false,
          title: "Onboard Container",
          freezeOnBlur: true,
          animation: "fade",
        }}
      />
      <Stack.Screen
        name="screens/calorie-tracker"
        options={{
          headerShown: false,
          title: "Calorie Tracker",
          freezeOnBlur: true,
          animation: "slide_from_right",
        }}
      />
      <Stack.Screen
        name="screens/all-prompts"
        options={{
          headerShown: true,
          title: "Journal Prompts",
          freezeOnBlur: true,
          headerBackButtonDisplayMode: "minimal",
          animation: "slide_from_right",
        }}
      />
      <Stack.Screen
        name="screens/achievements"
        options={{
          headerShown: false,
          title: "Achievements",
          freezeOnBlur: true,
          animation: "slide_from_right",
        }}
      />
      <Stack.Screen
        name="screens/xp-history"
        options={{
          headerShown: true,
          title: "XP History",
          freezeOnBlur: true,
          headerBackButtonDisplayMode: "minimal",
          animation: "slide_from_right",
        }}
      />
      <Stack.Screen
        name="screens/challenges"
        options={{
          headerShown: true,
          title: "Challenges",
          freezeOnBlur: true,
          headerBackButtonDisplayMode: "minimal",
          animation: "slide_from_bottom",
        }}
      />
    </Stack>
  );
}

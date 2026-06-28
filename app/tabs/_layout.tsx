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
import { GlassView } from "expo-glass-effect";

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
          headerShown: true,
          title: "Settings",
          freezeOnBlur: true,
          headerBackButtonDisplayMode: "minimal",
          animation: "slide_from_right",
          headerTransparent: true,
        }}
      />

      <Stack.Screen
        name="screens/apple-intelligence"
        options={{
          headerShown: true,
          title: "Apple Intelligence",
          freezeOnBlur: true,
          headerBackButtonDisplayMode: "minimal",
          animation: "slide_from_right",
          headerTransparent: true,
          headerBackground: () => (
            <GlassView glassEffectStyle="clear" style={{ flex: 1 }} />
          ),
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
        name="screens/premium-onboarding"
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
          headerTransparent: true,
          headerBackground: () => (
            <GlassView glassEffectStyle="clear" style={{ flex: 1 }} />
          ),
        }}
      />
      <Stack.Screen
        name="screens/achievements"
        options={{
          headerShown: true,
          title: "Achievements",
          headerTransparent: true,

          freezeOnBlur: true,
          headerBackTitle: "Home",
          animation: "slide_from_right",
          // headerBackground: () => (
          //   <GlassView
          //     glassEffectStyle="clear"
          //     tintColor="#f8faf7"
          //     style={{ flex: 1 }}
          //   />
          // ),
        }}
      />
      <Stack.Screen
        name="screens/rewards-shop"
        options={{
          headerShown: false,
          title: "Rewards Shop",
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
          headerBackTitle: "Achievements",
          animation: "slide_from_right",
          headerTransparent: true,
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
      <Stack.Screen
        name="screens/insights"
        options={{
          headerShown: false,
          title: "Insights",
          freezeOnBlur: true,
          animation: "slide_from_right",
        }}
      />
      <Stack.Screen
        name="screens/thought-reframing"
        options={{
          headerShown: true,
          title: "Thought Reframing",
          freezeOnBlur: true,
          headerBackButtonDisplayMode: "minimal",
          animation: "slide_from_right",
        }}
      />
      <Stack.Screen
        name="screens/gratitude-reframe"
        options={{
          headerShown: true,
          title: "Gratitude Reframe",
          freezeOnBlur: true,
          headerBackButtonDisplayMode: "minimal",
          animation: "slide_from_right",
        }}
      />
      <Stack.Screen
        name="screens/coping-cards"
        options={{
          headerShown: false,
          title: "My Coping Cards",
          freezeOnBlur: true,
          animation: "slide_from_right",
        }}
      />
      <Stack.Screen
        name="screens/journey/[slug]"
        options={{
          headerShown: false,
          title: "Journey",
          freezeOnBlur: true,
          animation: "slide_from_right",
        }}
      />
      <Stack.Screen
        name="screens/exercise-flow"
        options={{
          headerShown: false,
          title: "Exercise",
          freezeOnBlur: true,
          animation: "fade",
        }}
      />
    </Stack>
  );
}

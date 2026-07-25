export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(tabs)",
};


import { Stack, useRouter } from "expo-router";
import { isLiquidGlassAvailable, GlassView } from "expo-glass-effect";
import { useCSSVariable } from "uniwind";
import { useSystemBackgroundColor } from "@/src/utils/useSystemBackgroundColor";

const GLASS = isLiquidGlassAvailable();
const IS_ANDROID = process.env.EXPO_OS === "android";

export default function AppLayout() {
  const router = useRouter();
  const appForeground = useCSSVariable("--app-foreground") as string;
  const appBackground = useCSSVariable("--app-background") as string;
  useSystemBackgroundColor();

  return (
    <Stack
      screenOptions={{
        contentStyle: {
          backgroundColor: appBackground,
        },
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="screens/habits-modal"
        options={{
          presentation: "modal",
          headerShown: false,
          animation: "default",
        }}
      />
      <Stack.Screen name="screens/(settings)" options={{ headerShown: false }} />
      <Stack.Screen name="screens/(recording)" options={{ headerShown: false }} />
      <Stack.Screen name="screens/(journey)" options={{ headerShown: false }} />
      <Stack.Screen name="screens/(exercises)" options={{ headerShown: false, animation: "fade" }} />
      <Stack.Screen name="screens/(gamification)" options={{ headerShown: false }} />
      <Stack.Screen name="screens/(tracking)" options={{ headerShown: false }} />
      <Stack.Screen name="screens/(onboarding)" options={{ headerShown: false }} />
    </Stack>
  );
}

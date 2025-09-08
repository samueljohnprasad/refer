import { useAuth } from "@/context/AuthContext";
import { Redirect, Stack, ErrorBoundary } from "expo-router";

export default function AppLayout() {
  const { session } = useAuth();

  // If no session, redirect to root (login)
  if (!session) {
    return <Redirect href="/" />;
  }

  // If session exists, render the tabs layout
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="settings"
        options={{
          headerShown: false,
          title: "Settings",
          animation: "fade",
          animationDuration: 500,
        }}
      />
      <Stack.Screen
        name="paywall/index"
        options={{
          headerShown: false,
          presentation: "containedModal",
          title: "Settings",
          animation: "fade_from_bottom",
          animationDuration: 500,
        }}
      />
      <Stack.Screen name="journal-keyboard-entry" />
      <Stack.Screen
        options={{
          headerShown: true,
          title: "Settings",
          animation: "fade",
        }}
        name="pages/BlurModal"
      />
      <Stack.Screen
        name="transition"
        options={{
          headerShown: true,
        }}
      />
    </Stack>
  );
}

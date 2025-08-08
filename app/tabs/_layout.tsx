export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(tabs)",
};

import { useAuth } from "@/context/AuthContext";
import { Redirect, Stack } from "expo-router";

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
    </Stack>
  );
}

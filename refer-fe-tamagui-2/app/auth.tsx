import React from "react";
import { Stack } from "tamagui";
import { AuthScreen } from "../features/auth";

export default function AuthPage() {
  const handleAuthSuccess = (role: string) => {
    console.log(`Authentication successful, selected role: ${role}`);
  };

  return (
    <Stack flex={1} backgroundColor="$background">
      <AuthScreen
        initialScreen="login"
        onAuthSuccess={handleAuthSuccess}
      />
    </Stack>
  );
}

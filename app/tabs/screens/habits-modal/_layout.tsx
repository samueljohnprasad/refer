import React from "react";
import { Stack } from "expo-router";

export default function HabitsModalRootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(add)" />
      <Stack.Screen name="(details)" />
    </Stack>
  );
}

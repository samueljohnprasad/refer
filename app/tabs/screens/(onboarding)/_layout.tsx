import React from "react";
import { Stack } from "expo-router";
import { useCSSVariable } from "uniwind";

export default function OnboardingGroupLayout() {
  const appBackground = useCSSVariable("--app-background") as string;

  return (
    <Stack
      screenOptions={{
        contentStyle: {
          backgroundColor: appBackground,
        },
      }}
    >
      <Stack.Screen
        name="premium-onboarding"
        options={{
          headerShown: false,
          title: "Onboarding",
          freezeOnBlur: true,
          animation: "fade",
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name="onboard-container"
        options={{
          headerShown: false,
          title: "Onboard Container",
          freezeOnBlur: true,
          animation: "fade",
          gestureEnabled: false,
        }}
      />
    </Stack>
  );
}

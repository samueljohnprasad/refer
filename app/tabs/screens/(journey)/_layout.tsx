import React from "react";
import { Stack } from "expo-router";
import { useCSSVariable } from "uniwind";

export default function JourneyGroupLayout() {
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
        name="journey/[slug]"
        options={{
          headerShown: false,
          title: "Journey",
          freezeOnBlur: true,
          animation: "slide_from_right",
        }}
      />
      <Stack.Screen
        name="journey-flow"
        options={{
          headerShown: false,
          presentation: "fullScreenModal",
          title: "Journey Flow",
          freezeOnBlur: true,
          animation: "fade",
        }}
      />
      <Stack.Screen
        name="journey-map"
        options={{
          headerShown: false,
          title: "Journey Map",
        }}
      />
      <Stack.Screen
        name="journey-step-preview"
        options={{
          headerShown: false,
          title: "Step Preview",
        }}
      />
      <Stack.Screen
        name="reveal-destination"
        options={{
          headerShown: false,
          title: "Reveal Destination",
          presentation: "fullScreenModal",
          animation: "fade",
        }}
      />
    </Stack>
  );
}

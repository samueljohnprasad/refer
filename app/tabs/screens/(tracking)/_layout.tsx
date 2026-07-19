import React from "react";
import { Stack } from "expo-router";
import { useCSSVariable } from "uniwind";

export default function TrackingGroupLayout() {
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
        name="calorie-tracker"
        options={{
          headerShown: false,
          title: "Calorie Tracker",
          freezeOnBlur: true,
          animation: "slide_from_right",
        }}
      />
      <Stack.Screen
        name="timelines"
        options={{
          headerShown: true,
          animation: "slide_from_right",
          freezeOnBlur: true,
        }}
      />
      <Stack.Screen
        name="insights"
        options={{
          headerShown: false,
          title: "Insights",
          freezeOnBlur: true,
          animation: "slide_from_right",
        }}
      />
      <Stack.Screen
        name="micronutrient-tracking"
        options={{
          headerShown: false,
          title: "Micronutrients",
          animation: "slide_from_right",
        }}
      />
      <Stack.Screen
        name="test-charts"
        options={{
          headerShown: false,
          title: "Charts",
          animation: "slide_from_right",
        }}
      />
    </Stack>
  );
}

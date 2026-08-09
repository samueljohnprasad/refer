import React from "react";
import { Stack } from "expo-router";
import { useCSSVariable } from "uniwind";

export default function ExercisesGroupLayout() {
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
        name="exercise-flow"
        options={{
          headerShown: false,
          headerBackButtonMenuEnabled: false,
          title: "Exercise",
          freezeOnBlur: true,
          animation: "fade",
        }}
      />
      <Stack.Screen
        name="coping-cards"
        options={{
          headerShown: false,
          title: "My Coping Cards",
          freezeOnBlur: true,
          animation: "slide_from_right",
        }}
      />
      <Stack.Screen
        name="cbt-step-preview"
        options={{
          headerShown: false,
          title: "CBT Step Preview",
          animation: "fade",
        }}
      />
    </Stack>
  );
}

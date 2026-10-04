import React from "react";
import { Stack } from "expo-router";
import { useCSSVariable } from "uniwind";
import { useTranslation } from "react-i18next";

export default function ExercisesGroupLayout() {
  const { t } = useTranslation("common");
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
          title: t("navigation.exercise"),
          freezeOnBlur: true,
          animation: "fade",
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name="coping-cards"
        options={{
          headerShown: false,
          title: t("navigation.copingCards"),
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

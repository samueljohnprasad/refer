import React from "react";
import { Stack } from "expo-router";
import { useCSSVariable } from "uniwind";
import { useTranslation } from "react-i18next";

export default function TrackingGroupLayout() {
  const appBackground = useCSSVariable("--app-background") as string;
  const { t } = useTranslation("common");

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
          title: t("tracking.calorieTracker"),
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
          title: t("tracking.insights"),
          freezeOnBlur: true,
          animation: "slide_from_right",
        }}
      />
      <Stack.Screen
        name="micronutrient-tracking"
        options={{
          headerShown: false,
          title: t("tracking.micronutrients"),
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

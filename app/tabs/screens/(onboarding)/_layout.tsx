import React from "react";
import { Stack } from "expo-router";
import { useCSSVariable } from "uniwind";
import { useTranslation } from "react-i18next";

export default function OnboardingGroupLayout() {
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
        name="premium-onboarding"
        options={{
          headerShown: false,
          title: t("navigation.onboarding"),
          freezeOnBlur: true,
          animation: "fade",
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name="onboard-container"
        options={{
          headerShown: false,
          title: t("navigation.onboarding"),
          freezeOnBlur: true,
          animation: "fade",
          gestureEnabled: false,
        }}
      />
    </Stack>
  );
}

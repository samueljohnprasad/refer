import React from "react";
import { useTranslation } from "react-i18next";
import { Stack } from "expo-router";
import { useCSSVariable } from "uniwind";

export default function JourneyGroupLayout() {
  const { t } = useTranslation("journeys");
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
          title: t("yourJourney"),
          freezeOnBlur: true,
          animation: "slide_from_right",
        }}
      />
      <Stack.Screen
        name="journey-flow"
        options={{
          headerShown: false,
          presentation: "fullScreenModal",
          title: t("journeyFlow"),
          freezeOnBlur: true,
          animation: "fade",
        }}
      />
      <Stack.Screen
        name="journey-map"
        options={{
          headerShown: false,
          title: t("journeyMap"),
        }}
      />
      <Stack.Screen
        name="journey/finale"
        options={{
          headerShown: false,
          presentation: "fullScreenModal",
          animation: "fade",
          title: t("courseFinale"),
        }}
      />
      <Stack.Screen
        name="reveal-destination"
        options={{
          headerShown: false,
          title: t("revealDestination"),
          presentation: "fullScreenModal",
          animation: "fade",
        }}
      />
    </Stack>
  );
}

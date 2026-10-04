import { APP_FONT_FAMILIES } from "@/src/theme/typography";
import React from "react";
import { Stack } from "expo-router";
import { useTranslation } from "react-i18next";
import { useCSSVariable } from "uniwind";

export default function GamificationGroupLayout() {
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
        name="achievements"
        options={{
          headerShown: true,
          title: t("achievements.title"),
          headerStyle: { backgroundColor: "#FDFDF9" },
          headerShadowVisible: false,
          freezeOnBlur: true,
          headerBackButtonDisplayMode: "minimal",
          headerTitleStyle: {
            fontFamily: APP_FONT_FAMILIES.bold,
            fontSize: 18,
          },
          animation: "slide_from_right",
        }}
      />
      <Stack.Screen
        name="rewards-shop"
        options={{
          headerShown: false,
          title: t("rewards.title"),
          freezeOnBlur: true,
          animation: "slide_from_right",
        }}
      />
      <Stack.Screen
        name="xp-history"
        options={{
          headerShown: true,
          title: t("xp.progression"),
          freezeOnBlur: true,
          headerBackButtonDisplayMode: "minimal",
          animation: "slide_from_right",
          headerStyle: { backgroundColor: "#FFFFFF" },
          headerShadowVisible: false,
          headerTitleStyle: {
            fontFamily: APP_FONT_FAMILIES.bold,
            fontSize: 18,
          },
        }}
      />
      <Stack.Screen
        name="challenges"
        options={{
          headerShown: true,
          title: t("challenges.title"),
          freezeOnBlur: true,
          headerBackButtonDisplayMode: "minimal",
          animation: "slide_from_bottom",
        }}
      />
    </Stack>
  );
}

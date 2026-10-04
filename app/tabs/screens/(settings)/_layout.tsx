import React from "react";
import { Stack } from "expo-router";
import { isLiquidGlassAvailable, GlassView } from "expo-glass-effect";
import { useCSSVariable } from "uniwind";
import { useTranslation } from "react-i18next";

const GLASS = isLiquidGlassAvailable();
const IS_ANDROID = process.env.EXPO_OS === "android";

export default function SettingsGroupLayout() {
  const { t } = useTranslation("settings");
  const appForeground = useCSSVariable("--app-foreground") as string;
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
        name="settings"
        options={{
          headerShown: true,
          title: t("title"),
          freezeOnBlur: true,
          headerBackButtonDisplayMode: "minimal",
          animation: "slide_from_right",
        }}
      />
      <Stack.Screen
        name="language"
        options={{
          headerShown: true,
          title: t("language.title"),
          freezeOnBlur: true,
          headerBackButtonDisplayMode: "minimal",
          animation: "slide_from_right",
        }}
      />
      <Stack.Screen
        name="name-edit"
        options={{
          presentation: "modal",
          headerShown: true,
          title: t("name.title"),
          headerTransparent: GLASS,
          headerLargeTitleShadowVisible: false,
          headerBackButtonDisplayMode: GLASS ? "minimal" : "default",
          headerTintColor: appForeground,
          headerShadowVisible: IS_ANDROID ? false : undefined,
          headerStyle: IS_ANDROID
            ? {
                backgroundColor: appBackground,
              }
            : undefined,
          contentStyle: {
            backgroundColor: appBackground,
          },
        }}
      />
      <Stack.Screen
        name="apple-intelligence"
        options={{
          headerShown: true,
          title: t("developer.appleIntelligence"),
          freezeOnBlur: true,
          headerBackButtonDisplayMode: "minimal",
          animation: "slide_from_right",
          headerTransparent: true,
          headerBackground: () => (
            <GlassView glassEffectStyle="clear" style={{ flex: 1 }} />
          ),
        }}
      />
      <Stack.Screen
        name="active-model"
        options={{
          headerShown: true,
          title: t("developer.aiModel"),
          freezeOnBlur: true,
          headerBackButtonDisplayMode: "minimal",
          animation: "slide_from_right",
        }}
      />
      <Stack.Screen
        name="notification-preferences"
        options={{
          headerShown: true,
          title: t("notifications.title"),
          freezeOnBlur: true,
          headerBackButtonDisplayMode: "minimal",
          animation: "slide_from_right",
        }}
      />
      <Stack.Screen
        name="reminders"
        options={{
          headerShown: true,
          title: t("reminders.title"),
          freezeOnBlur: true,
          headerBackButtonDisplayMode: "minimal",
          animation: "slide_from_right",
        }}
      />
      <Stack.Screen
        name="support-chat"
        options={{
          headerShown: true,
          title: t("support.title"),
          freezeOnBlur: true,
          headerBackButtonDisplayMode: "minimal",
          animation: "slide_from_right",
        }}
      />
      <Stack.Screen
        name="animated-symbols"
        options={{
          headerShown: true,
          title: t("developer.animatedSymbols"),
          freezeOnBlur: true,
          headerBackButtonDisplayMode: "minimal",
          animation: "slide_from_right",
        }}
      />
      <Stack.Screen
        name="course-exercises"
        options={{
          headerShown: true,
          title: t("developer.courseExercises"),
          freezeOnBlur: true,
          headerBackButtonDisplayMode: "minimal",
          animation: "slide_from_right",
        }}
      />
    </Stack>
  );
}

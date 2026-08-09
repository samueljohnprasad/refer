import React from "react";
import { Stack } from "expo-router";
import { isLiquidGlassAvailable, GlassView } from "expo-glass-effect";
import { useCSSVariable } from "uniwind";

const GLASS = isLiquidGlassAvailable();
const IS_ANDROID = process.env.EXPO_OS === "android";

export default function SettingsGroupLayout() {
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
          title: "Settings",
          freezeOnBlur: true,
          headerBackButtonDisplayMode: "minimal",
          animation: "slide_from_right",
          headerTransparent: true,
        }}
      />
      <Stack.Screen
        name="name-edit"
        options={{
          presentation: "modal",
          headerShown: true,
          title: "Profile",
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
          title: "Apple Intelligence",
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
          title: "AI Model",
          freezeOnBlur: true,
          headerBackButtonDisplayMode: "minimal",
          animation: "slide_from_right",
        }}
      />
      <Stack.Screen
        name="notification-preferences"
        options={{
          headerShown: true,
          title: "Notifications",
          freezeOnBlur: true,
          headerBackButtonDisplayMode: "minimal",
          animation: "slide_from_right",
        }}
      />
      <Stack.Screen
        name="reminders"
        options={{
          headerShown: true,
          title: "Reminders",
          freezeOnBlur: true,
          headerBackButtonDisplayMode: "minimal",
          animation: "slide_from_right",
        }}
      />
      <Stack.Screen
        name="support-chat"
        options={{
          headerShown: true,
          title: "Support",
          freezeOnBlur: true,
          headerBackButtonDisplayMode: "minimal",
          animation: "slide_from_right",
        }}
      />
      <Stack.Screen
        name="animated-symbols"
        options={{
          headerShown: true,
          title: "Animated Symbols",
          freezeOnBlur: true,
          headerBackButtonDisplayMode: "minimal",
          animation: "slide_from_right",
        }}
      />
      <Stack.Screen
        name="course-exercises"
        options={{
          headerShown: true,
          title: "Course Exercises",
          freezeOnBlur: true,
          headerBackButtonDisplayMode: "minimal",
          animation: "slide_from_right",
        }}
      />
    </Stack>
  );
}

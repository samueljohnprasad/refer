import React from "react";
import { Stack, useRouter } from "expo-router";
import { isLiquidGlassAvailable } from "expo-glass-effect";
import { useCSSVariable } from "uniwind";

const GLASS = isLiquidGlassAvailable();
const IS_ANDROID = process.env.EXPO_OS === "android";

export default function HabitsModalLayout() {
  const router = useRouter();
  const appForeground = useCSSVariable("--app-foreground") as string;
  const appBackground = useCSSVariable("--app-background") as string;

  return (
    <Stack
      screenOptions={{
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
    >
      <Stack.Screen
        name="add"
        options={{
          title: "Add a Habit",
          headerLeft: () => null,
        }}
      >
        <Stack.Toolbar placement="left">
          <Stack.Toolbar.Button icon="xmark" onPress={() => router.back()} />
        </Stack.Toolbar>
      </Stack.Screen>

      <Stack.Screen
        name="details"
        options={{
          title: "Habit Details",
          headerLeft: () => null,
        }}
      >
        <Stack.Toolbar placement="left">
          <Stack.Toolbar.Button icon="xmark" onPress={() => router.back()} />
        </Stack.Toolbar>
      </Stack.Screen>
    </Stack>
  );
}

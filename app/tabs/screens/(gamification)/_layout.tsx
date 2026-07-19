import React from "react";
import { Stack } from "expo-router";
import { useCSSVariable } from "uniwind";

export default function GamificationGroupLayout() {
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
          title: "Achievements",
          headerTransparent: true,
          freezeOnBlur: true,
          headerBackTitle: "Home",
          animation: "slide_from_right",
        }}
      />
      <Stack.Screen
        name="rewards-shop"
        options={{
          headerShown: false,
          title: "Rewards Shop",
          freezeOnBlur: true,
          animation: "slide_from_right",
        }}
      />
      <Stack.Screen
        name="xp-history"
        options={{
          headerShown: true,
          title: "XP History",
          freezeOnBlur: true,
          headerBackButtonDisplayMode: "minimal",
          animation: "slide_from_right",
          headerStyle: { backgroundColor: "#FFFFFF" },
          headerShadowVisible: false,
          headerTitleStyle: {
            fontFamily: "happy-font-heading-bold",
            fontSize: 20,
          },
        }}
      />
      <Stack.Screen
        name="challenges"
        options={{
          headerShown: true,
          title: "Challenges",
          freezeOnBlur: true,
          headerBackButtonDisplayMode: "minimal",
          animation: "slide_from_bottom",
        }}
      />
    </Stack>
  );
}

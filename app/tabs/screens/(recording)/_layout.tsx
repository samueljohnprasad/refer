import React from "react";
import { Stack } from "expo-router";
import { GlassView } from "expo-glass-effect";
import { useCSSVariable } from "uniwind";

export default function RecordingGroupLayout() {
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
        name="all-prompts"
        options={{
          headerShown: true,
          title: "Journal Prompts",
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
        name="journal-entry"
        options={{
          headerShown: true,
          title: "Journal Entry",
          freezeOnBlur: true,
          headerBackButtonDisplayMode: "minimal",
          animation: "fade",
        }}
      />
      <Stack.Screen
        name="voice-recorder"
        options={{
          headerShown: false,
          presentation: "fullScreenModal",
          title: "Voice Recorder",
          animation: "fade",
        }}
      />
      <Stack.Screen
        name="keyboard-recorder"
        options={{
          headerShown: false,
          presentation: "fullScreenModal",
          title: "Keyboard Recorder",
          animation: "fade",
        }}
      />
    </Stack>
  );
}

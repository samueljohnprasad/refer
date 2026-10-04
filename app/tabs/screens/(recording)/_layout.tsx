import React from "react";
import { Stack } from "expo-router";
import { GlassView } from "expo-glass-effect";
import { useCSSVariable } from "uniwind";
import { useTranslation } from "react-i18next";

export default function RecordingGroupLayout() {
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
        name="all-prompts"
        options={{
          headerShown: true,
          title: t("promptBrowser.title"),
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
          title: t("recording.journalEntry"),
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
          title: t("recording.voiceRecorder"),
          animation: "fade",
        }}
      />
      <Stack.Screen
        name="keyboard-recorder"
        options={{
          headerShown: false,
          presentation: "fullScreenModal",
          title: t("recording.keyboardRecorder"),
          animation: "fade",
        }}
      />
    </Stack>
  );
}

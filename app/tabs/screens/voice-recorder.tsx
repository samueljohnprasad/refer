import React, { useState } from "react";
import { View } from "react-native";
import { Stack, useRouter } from "expo-router";
import { JournalEntry } from "@/hooks/data/types";
import SuspensLoader from "@/src/components/SuspensLoader";

import VoiceRecorder from "@/src/screens/DiscoveryScreen/VoiceRecorder";
import JournalEntryScreen from "@/src/screens/JournalEntryScreen/JournalEntryScreen";
import EmotionAnalysisLoadingScreen from "@/src/screens/DiscoveryScreen/EmotionAnalysisLoadingScreen";

export default function VoiceRecorderScreen() {
  const router = useRouter();
  const [stepper, setStepper] = useState(0);
  const [recordingUri, setRecordingUri] = useState<string | null>(null);
  const [insights, setInsights] = useState<JournalEntry>();

  const onClose = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.push("/tabs/(tabs)/home");
    }
  };

  return (
    <View className="flex-1 bg-brand-surface">
      <Stack.Screen 
        options={{ 
          headerShown: false,
          presentation: "fullScreenModal",
          animation: "slide_from_bottom"
        }} 
      />
      <SuspensLoader>
        {stepper === 0 && (
          <VoiceRecorder
            onClose={onClose}
            onStop={(path) => {
              setRecordingUri(path);
              setStepper(1);
            }}
          />
        )}
        {stepper === 1 && recordingUri && (
          <EmotionAnalysisLoadingScreen
            recordingUri={recordingUri}
            onAnalysisCompleted={({ insights }) => {
              setInsights(insights);
              setStepper(2);
            }}
            onCancel={onClose}
          />
        )}
        {stepper === 2 && (
          <JournalEntryScreen insights={insights} onClose={onClose} />
        )}
      </SuspensLoader>
    </View>
  );
}

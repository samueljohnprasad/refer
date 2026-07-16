import React, { useState } from "react";
import { View } from "react-native";
import { Stack, useRouter } from "expo-router";
import { JournalEntry } from "@/hooks/data/types";
import SuspensLoader from "@/src/components/SuspensLoader";

import KeyboardJournalScreen from "@/src/screens/DiscoveryScreen/KeyboardJournalScreen";
import JournalEntryScreen from "@/src/screens/JournalEntryScreen/JournalEntryScreen";
import EmotionAnalysisLoadingScreen from "@/src/screens/DiscoveryScreen/EmotionAnalysisLoadingScreen";
import Animated, { FadeIn, FadeOut, Easing } from "react-native-reanimated";

export default function KeyboardRecorderScreen() {
  const router = useRouter();
  const [stepper, setStepper] = useState(0);
  const [journalText, setJournalText] = useState<string | null>(null);
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
          <Animated.View 
            entering={FadeIn.duration(250).easing(Easing.out(Easing.ease))}
            exiting={FadeOut.duration(200).easing(Easing.out(Easing.ease))}
            style={{ flex: 1 }}
          >
            <KeyboardJournalScreen
              onClose={onClose}
              onStop={(text) => {
                setJournalText(text);
                setStepper(1);
              }}
            />
          </Animated.View>
        )}
        {stepper === 1 && journalText && (
          <Animated.View 
            entering={FadeIn.duration(250).easing(Easing.out(Easing.ease))}
            exiting={FadeOut.duration(200).easing(Easing.out(Easing.ease))}
            style={{ flex: 1 }}
          >
            <EmotionAnalysisLoadingScreen
              journalText={journalText}
              onAnalysisCompleted={({ insights }) => {
                setInsights(insights);
                setStepper(2);
              }}
              onCancel={onClose}
            />
          </Animated.View>
        )}
        {stepper === 2 && (
          <Animated.View 
            entering={FadeIn.duration(250).easing(Easing.out(Easing.ease))}
            exiting={FadeOut.duration(200).easing(Easing.out(Easing.ease))}
            style={{ flex: 1 }}
          >
            <JournalEntryScreen insights={insights} onClose={onClose} />
          </Animated.View>
        )}
      </SuspensLoader>
    </View>
  );
}

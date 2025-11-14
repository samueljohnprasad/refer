import { useCompleteOnboarding } from "@/hooks/data/useCompleteOnboarding";
import { Steps } from "@/src/components/steps";
import { OnBoardingFormData } from "@/src/components/steps/src";
import React, { useState } from "react";
import { View } from "react-native";
import { useRouter } from "expo-router";
import { useAtom } from "jotai";
import useNotifications from "@/hooks/data/useNotifications";
import { cfgAtom } from "@/src/components/notifications";

export default function OnboardingScreen() {
  const router = useRouter();
  const [cfg] = useAtom(cfgAtom);
  const { addNotifications } = useNotifications();

  const { markCompleted } = useCompleteOnboarding();

  const handleComplete = async (
    onBoardingData: OnBoardingFormData
  ): Promise<void> => {
    try {
      await markCompleted({ ...onBoardingData, cfg });
      await addNotifications();
      router.replace("/tabs/(tabs)/home");
    } catch (error) {
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Steps onComplete={handleComplete} />
    </View>
  );
}

import { useCompleteOnboarding } from "@/hooks/data/useCompleteOnboarding";
import { Steps } from "@/src/components/steps";
import { OnBoardingFormData } from "@/src/components/steps/src";
import React, { useState } from "react";
import { View } from "react-native";
import { useRouter } from "expo-router";

export default function OnboardingScreen() {
  const router = useRouter();
  const { markCompleted } = useCompleteOnboarding();

  const handleComplete = async (
    onBoardingData: OnBoardingFormData
  ): Promise<void> => {
    await markCompleted(onBoardingData);
    router.replace("/tabs/(tabs)/tab1");
  };

  return (
    <View style={{ flex: 1 }}>
      <Steps onComplete={handleComplete} />
    </View>
  );
}

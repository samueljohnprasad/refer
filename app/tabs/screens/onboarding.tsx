import { useCompleteOnboarding } from "@/hooks/data/useCompleteOnboarding";
import React, { lazy } from "react";
const Steps = lazy(() => import("@/src/components/steps"));
import { OnBoardingFormData } from "@/src/components/steps/src";
import { View } from "react-native";
import { useRouter } from "expo-router";
import { useAtom } from "jotai";
import useNotifications from "@/hooks/data/useNotifications";
import { cfgAtom } from "@/src/components/notifications";
import SuspensLoader from "@/src/components/SuspensLoader";

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
    } catch (error) {}
  };

  return (
    <View style={{ flex: 1 }}>
      <SuspensLoader>
        <Steps onComplete={handleComplete} />
      </SuspensLoader>
    </View>
  );
}

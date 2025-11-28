import React from "react";
import { useOnboardingStatus } from "@/hooks/data/useOnboardingStatus";
import { Box } from "@/components/ui/box";
import { useAuth } from "@/src/context/AuthContext";
import { Redirect } from "expo-router";
import LottieView from "lottie-react-native";
import { loadingLottie } from "@/assets/lottie";

const OnboardContainer = () => {
  const onboarding = useOnboardingStatus();
  const { session, loading } = useAuth();

  if (onboarding.loading || loading) {
    return (
      <Box className="flex-1 w-full h-full items-center justify-center">
        <Box className="flex-1 w-full h-full items-center justify-center flex fixed inset-0 z-50 before:starting:backdrop-blur-0 before:absolute before:inset-0 before:bg-gray-200/50 before:backdrop-blur-[1px] before:transition before:duration-250 dark:before:bg-black/50 before:starting:opacity-0">
          <LottieView
            autoPlay
            loop
            style={{
              width: 60,
              height: 60,
            }}
            source={loadingLottie}
          />
        </Box>
      </Box>
    );
  }

  if (session && !onboarding.completed) {
    return <Redirect href="/tabs/screens/onboarding" />;
  }

  if (session && onboarding.completed) {
    return <Redirect href="/tabs/(tabs)/home" />;
  }

  return <Redirect href="/" />;
};

export default OnboardContainer;

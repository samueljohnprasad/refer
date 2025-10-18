import React from "react";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
// import MovingGradientBackground from "@/screens/components/MovingGradientBackground";
import { VStack } from "@/components/ui/vstack";
import { Button, ButtonText } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
// import SignInBottomSheet from "@/screens/components/SignInBottomSheet";
import { Redirect } from "expo-router";
import { Spinner } from "@/components/ui/spinner";
import { useAuth } from "@/src/context/AuthContext";
import { BottomSheet, BottomSheetTrigger } from "@/components/ui/bottomsheet";
import SignInBottomSheet from "@/src/components/SignInBottomSheet";
import MovingGradientBackground from "@/src/components/MovingGradientBackground";
import { useOnboardingStatus } from "@/hooks/data/useOnboardingStatus";

export default function Home() {
  const { session, loading } = useAuth();
  const onboarding = useOnboardingStatus();

  if (loading || onboarding.loading) {
    return (
      <Box className="flex-1 w-full h-full items-center justify-center">
        <Box className="flex-1 w-full h-full items-center justify-center flex fixed inset-0 z-50 before:starting:backdrop-blur-0 before:absolute before:inset-0 before:bg-gray-200/50 before:backdrop-blur-[1px] before:transition before:duration-250 dark:before:bg-black/50 before:starting:opacity-0">
          <Spinner />
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

  return (
    <VStack className="flex-1 h-[100vh] justify-center">
      <MovingGradientBackground />
      {/* <FirefliesParticles eveningOnly={false} fireflyCount={22} /> */}

      {/* <ScrollView
          style={{ height: "100%" }}
          contentContainerStyle={{ flexGrow: 1 }}
        ></ScrollView> */}

      <BottomSheet>
        <VStack
          className=" flex-1 p-2 md:max-w-[440px] lg:max-w-[640px] xl:max-w-[840px] w-full h-full items-center justify-center"
          space="xl"
        >
          <VStack>
            <Heading size="3xl" className="text-center">
              Welcome to - App title
            </Heading>
            <Text className="font-bold text-center text-outline-500">
              sub title
            </Text>
          </VStack>

          <Button
            variant="solid"
            action="primary"
            size="xl"
            className="flex items-center font-semibold border w-full rounded-full py-2 drop-shadow-sm shadow-primary-500 hover:shadow-primary-500 hover:scale-95 transition-all duration-300"
          >
            <ButtonText>Get Started</ButtonText>
          </Button>

          <BottomSheetTrigger>
            <Text className="text-center">I already have an account</Text>
          </BottomSheetTrigger>

          <SignInBottomSheet />
        </VStack>
      </BottomSheet>
    </VStack>
  );
}

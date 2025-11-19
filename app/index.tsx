import React, { useRef } from "react";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { Button, ButtonText } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Redirect } from "expo-router";
import { useAuth } from "@/src/context/AuthContext";
import SignInBottomSheet from "@/src/components/SignInBottomSheet";
import MovingGradientBackground from "@/src/components/MovingGradientBackground";
import { BottomSheetModal } from "@gorhom/bottom-sheet";

export default function Home() {
  const { session, loading } = useAuth();
  const sheetRef = useRef<BottomSheetModal>(null);

  if (loading) {
    return (
      <Box className="flex-1 w-full h-full items-center justify-center">
        <Box className="flex-1 w-full h-full items-center justify-center flex fixed inset-0 z-50 before:starting:backdrop-blur-0 before:absolute before:inset-0 before:bg-gray-200/50 before:backdrop-blur-[1px] before:transition before:duration-250 dark:before:bg-black/50 before:starting:opacity-0">
          {/* <LottieView
            autoPlay
            loop
            style={{
              width: 60,
              height: 60,
            }}
            source={loadingLottie}
          /> */}
        </Box>
      </Box>
    );
  }

  if (session) {
    return <Redirect href="/tabs/screens/onboard-container" />;
  }

  return (
    <VStack className="flex-1 h-[100vh] justify-center">
      <MovingGradientBackground />

      <VStack
        className=" flex-1 p-2 md:max-w-[440px] lg:max-w-[640px] xl:max-w-[840px] w-full h-full items-center justify-center"
        space="xl"
      >
        <VStack>
          <Heading size="3xl" className="text-center">
            Welcome to Happy
          </Heading>
          <Text className="font-bold text-center text-outline-500">
            sub title
          </Text>
        </VStack>

        <Button
          onPress={() => sheetRef.current?.present()}
          variant="solid"
          action="primary"
          size="xl"
          className="flex items-center font-semibold border w-full rounded-full py-2 drop-shadow-sm shadow-primary-500 hover:shadow-primary-500 hover:scale-95 transition-all duration-300"
        >
          <ButtonText>Get Started</ButtonText>
        </Button>

        <SignInBottomSheet ref={sheetRef} />
      </VStack>
    </VStack>
  );
}

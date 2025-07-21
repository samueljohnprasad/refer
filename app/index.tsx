import React from "react";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import MovingGradientBackground from "@/screens/components/MovingGradientBackground";
import { VStack } from "@/components/ui/vstack";
import { Button, ButtonText } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { BottomSheet, BottomSheetTrigger } from "@/components/ui/botton-sheet";
import SignInBottomSheet from "@/screens/components/SignInBottomSheet";
import { useAuth } from "@/context/AuthContext";
import HomeScreen from "../screens/home";
import { Spinner } from "@/components/ui/spinner";

const FeatureCard = ({ iconSvg: IconSvg, name, desc }: any) => {
  return (
    <Box
      className="flex-column border border-w-1 border-outline-700 md:flex-1 m-2 p-4 rounded"
      key={name}
    >
      <Box className="items-center flex flex-row">
        <Text>
          <IconSvg />
        </Text>
        <Text className="text-typography-white font-medium ml-2 text-xl">
          {name}
        </Text>
      </Box>
      <Text className="text-typography-400 mt-2">{desc}</Text>
    </Box>
  );
};

export default function Home() {
  const { user, session, loading } = useAuth();

  if (loading)
    return (
      <Box className="flex-1 items-center justify-center flex">
        <Text className="text-typography-white font-medium ml-2 text-xl">
          hello
        </Text>
        <Box className="flex-1 bg-black/50 items-center justify-center flex fixed inset-0 z-50 before:starting:backdrop-blur-0 before:absolute before:inset-0 before:bg-gray-200/50 before:backdrop-blur-[1px] before:transition before:duration-250 dark:before:bg-black/50 before:starting:opacity-0">
          <Spinner />
        </Box>
      </Box>
    );

  if (session) return <HomeScreen />;

  return (
    <VStack className="flex-1 bg-black h-[100vh] justify-center">
      <MovingGradientBackground />
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
              Welcome to Mentor Health
            </Heading>
            <Text size="sm" className="font-bold text-center text-outline-500">
              Your AI wellbeing Coach
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

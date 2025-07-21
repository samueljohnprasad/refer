import { View, Text } from "react-native";
import React from "react";
import { Box } from "@/components/ui/box";
import { Heading } from "@/components/ui/heading";
import { Button, ButtonText } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { VStack } from "@/components/ui/vstack";
import { router } from "expo-router";

const HomeScreen = () => {
  const { signOut } = useAuth();
  return (
    <VStack space="3xl" className="flex-1 flex justify-center items-center">
      <Heading size="3xl">Welcome to Home</Heading>
      <Button
        variant="solid"
        action="primary"
        size="xl"
        className="flex items-center font-semibold border w-full rounded-full py-2 drop-shadow-sm shadow-primary-500 hover:shadow-primary-500 hover:scale-95 transition-all duration-300"
      >
        <ButtonText onPress={signOut}>Sign out</ButtonText>
      </Button>

      <Button
        variant="solid"
        action="primary"
        size="xl"
        className="flex items-center font-semibold border w-full rounded-full py-2 drop-shadow-sm shadow-primary-500 hover:shadow-primary-500 hover:scale-95 transition-all duration-300"
      >
        <ButtonText
          onPress={() => {
            router.navigate("/voice-recorder");
          }}
        >
          voice
        </ButtonText>
      </Button>
    </VStack>
  );
};

export default HomeScreen;

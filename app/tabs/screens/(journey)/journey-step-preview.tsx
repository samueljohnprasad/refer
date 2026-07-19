import React from "react";
import { Stack, useRouter } from "expo-router";
import JourneyStepScreen from "@/src/components/journey/JourneyStepScreen";

export default function JourneyStepPreviewScreen(): React.JSX.Element {
  const router = useRouter();

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <JourneyStepScreen
        name="feel-better"
      />
    </>
  );
}

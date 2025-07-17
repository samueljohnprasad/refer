/* Expo example — swap the import for `react-native-linear-gradient`
   if you’re on bare React Native */
import React from "react";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import Image from "@unitools/image";
import { GradientBackground } from "@/screens/components/gradient-background";

export default function MoodQuestionScreen() {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;

  console.log("API_URL ", process.env.EXPO_PUBLIC_API_URL);

  return (
    <GradientBackground
      colors={["#FFDF9C", "#FFF5DC", "#FFDF9C", "#FFF5DC"]}
      card={{ label: "Good" }}
      style={{
        paddingTop: 100,
        paddingHorizontal: 20,
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "flex-start",
      }}
    >
      <Box className="flex-1 items-center justify-center px-6">
        <Text className="text-4xl font-bold text-typography-900 text-center">
          How are you really feeling today?
          {process.env.EXPO_PUBLIC_API_URL}
        </Text>
        <Image
          source={require("@/assets/images/star-happy.png")}
          height={350}
          width={350}
          alt="Avatar Image"
          contentFit="cover"
          style={{ borderRadius: 999 }}
        />
      </Box>
    </GradientBackground>
  );
}

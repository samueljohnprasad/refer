import React from "react";
import { View } from "react-native";
import { Mascot, type MascotState } from "@/src/components/ui/Mascot";
import { Text } from "@/src/components/ui/Text";

interface ExerciseIntroHeroProps {
  mascotState: MascotState;
  title: string;
  subtitle: string;
}

export const ExerciseIntroHero: React.FC<ExerciseIntroHeroProps> = React.memo(
  ({ mascotState, title, subtitle }) => {
    return (
      <View className="mb-6 items-center px-4">
        <View className="mb-3">
          <Mascot state={mascotState} size={104} />
        </View>

        <Text variant="h1" className="mb-3 text-center">
          {title}
        </Text>
        <Text
          variant="body"
          color="soft"
          className="max-w-[320px] text-center text-[16px] leading-[22px]"
        >
          {subtitle}
        </Text>
      </View>
    );
  },
);

ExerciseIntroHero.displayName = "ExerciseIntroHero";

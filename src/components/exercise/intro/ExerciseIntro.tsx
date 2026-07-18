import React from "react";
import { View } from "react-native";
import type { MascotState } from "@/src/components/ui/Mascot";
import { FadeInItem } from "@/src/components/ui/FadeInItem";
import { ExerciseIntroDurationPill } from "./ExerciseIntroDurationPill";
import { ExerciseIntroHero } from "./ExerciseIntroHero";
import { ExerciseIntroSequence } from "./ExerciseIntroSequence";

interface ExerciseIntroProps {
  title: string;
  subtitle: string;
  duration: string;
  bulletPoints?: string[];
  mascotState?: MascotState;
}

export const ExerciseIntro: React.FC<ExerciseIntroProps> = React.memo(
  ({
    title,
    subtitle,
    duration,
    bulletPoints,
    mascotState = "panda-happy",
  }) => {
    return (
      <View className="flex-1 w-full px-6 pt-1 pb-4">
        <FadeInItem index={0}>
          <ExerciseIntroDurationPill duration={duration} />
        </FadeInItem>

        <FadeInItem index={1}>
          <ExerciseIntroHero
            mascotState={mascotState}
            title={title}
            subtitle={subtitle}
          />
        </FadeInItem>

        <FadeInItem index={2} delayPerItem={80}>
          <ExerciseIntroSequence steps={bulletPoints} />
        </FadeInItem>
      </View>
    );
  },
);

ExerciseIntro.displayName = "ExerciseIntro";

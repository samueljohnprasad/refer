import { SEMANTIC_COLORS } from "@/src/components/exercise/courseExerciseTheme";
import React from "react";
import { View } from "react-native";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { SparklesIcon } from "@hugeicons/core-free-icons";
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
      <View className="mb-8 items-center px-4">
        <View className="relative mb-5">
          <View
            className="h-24 w-24 items-center justify-center rounded-[28px]"
            style={{ backgroundColor: SEMANTIC_COLORS.surface.elevated }}
          >
            <Mascot state={mascotState} size={84} />
          </View>
          <View
            className="absolute -bottom-1 -right-1 h-8 w-8 items-center justify-center rounded-full border-4"
            style={{
              backgroundColor: SEMANTIC_COLORS.brand.primary,
              borderColor: SEMANTIC_COLORS.surface.primary,
            }}
          >
            <HugeiconsIcon
              icon={SparklesIcon}
              size={14}
              color={SEMANTIC_COLORS.surface.primary}
              strokeWidth={2}
            />
          </View>
        </View>

        <Text variant="h1" className="mb-3 text-center">
          {title}
        </Text>
        <Text
          variant="body"
          color="soft"
          className="max-w-[300px] text-center text-[16px] leading-[24px]"
        >
          {subtitle}
        </Text>
      </View>
    );
  },
);

ExerciseIntroHero.displayName = "ExerciseIntroHero";

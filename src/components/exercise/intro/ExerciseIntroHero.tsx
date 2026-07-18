import React from "react";
import { View } from "react-native";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { SparklesIcon } from "@hugeicons/core-free-icons";
import { Mascot, type MascotState } from "@/src/components/ui/Mascot";
import { Text } from "@/src/components/ui/Text";
import { BRAND_SURFACE, SAGE } from "@/lib/tokens";

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
            style={{ backgroundColor: SAGE[50] }}
          >
            <Mascot state={mascotState} size={84} />
          </View>
          <View
            className="absolute -bottom-1 -right-1 h-8 w-8 items-center justify-center rounded-full border-4"
            style={{
              backgroundColor: SAGE[500],
              borderColor: BRAND_SURFACE,
            }}
          >
            <HugeiconsIcon
              icon={SparklesIcon}
              size={14}
              color={BRAND_SURFACE}
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

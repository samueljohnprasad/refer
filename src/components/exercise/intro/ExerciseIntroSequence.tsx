import { SEMANTIC_COLORS } from "@/src/components/exercise/courseExerciseTheme";
import React from "react";
import { View } from "react-native";
import { Text } from "@/src/components/ui/Text";

interface ExerciseIntroSequenceProps {
  steps?: string[];
}

export const ExerciseIntroSequence: React.FC<ExerciseIntroSequenceProps> =
  React.memo(({ steps }) => {
    if (!steps?.length) {
      return null;
    }

    return (
      <View className="px-2">
        {steps.map((step, index) => {
          const isFirst = index === 0;
          const isLast = index === steps.length - 1;

          return (
            <View key={`${index}-${step}`} className="flex-row items-start pb-4">
              <View className="mr-5 items-center">
                <View
                  className="z-10 h-8 w-8 items-center justify-center rounded-full border-[4px]"
                  style={{
                    backgroundColor: isFirst ? SEMANTIC_COLORS.brand.primary : SEMANTIC_COLORS.border.default,
                    borderColor: SEMANTIC_COLORS.surface.primary,
                  }}
                >
                  <Text
                    variant="chip"
                    className="text-[11px] font-bold"
                    style={{
                      lineHeight: 12,
                      color: isFirst ? SEMANTIC_COLORS.surface.primary : SEMANTIC_COLORS.text.secondary,
                    }}
                  >
                    {index + 1}
                  </Text>
                </View>
                {!isLast ? (
                  <View
                    className="mt-1 h-6 w-px"
                    style={{ backgroundColor: SEMANTIC_COLORS.surface.secondary }}
                  />
                ) : null}
              </View>

              <View className="flex-1 pt-1">
                <Text
                  variant="body-bold"
                  className="text-[16px] leading-[23px]"
                  style={{ color: SEMANTIC_COLORS.text.primary }}
                >
                  {step}
                </Text>
              </View>
            </View>
          );
        })}
      </View>
    );
  });

ExerciseIntroSequence.displayName = "ExerciseIntroSequence";

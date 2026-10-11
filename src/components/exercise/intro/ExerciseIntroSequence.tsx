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
      <View>
        {steps.map((step, index) => {
          const isFirst = index === 0;
          const isLast = index === steps.length - 1;

          return (
            <View key={`${index}-${step}`} className="flex-row items-start">
              <View className="mr-4 items-center">
                <View
                  className="z-10 h-8 w-8 items-center justify-center rounded-full border-[3px]"
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
                    className="h-8 w-px"
                    style={{ backgroundColor: SEMANTIC_COLORS.border.default }}
                  />
                ) : null}
              </View>

              <View className="flex-1 pt-1">
                <Text
                  variant={isFirst ? "body-bold" : "body"}
                  className="text-[16px] leading-[23px]"
                  style={{
                    color: isFirst
                      ? SEMANTIC_COLORS.text.primary
                      : SEMANTIC_COLORS.text.secondary,
                  }}
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

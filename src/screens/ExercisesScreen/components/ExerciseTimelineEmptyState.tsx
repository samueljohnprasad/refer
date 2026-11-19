// ponytail: reusable Duolingo-grade empty state for exercise & thought timelines
import React from "react";
import { View } from "react-native";
import { Text } from "@/src/components/ui/Text";
import { useRouter } from "expo-router";
import { Button } from "@/src/components/ui/Button";
import { Mascot } from "@/src/components/ui/Mascot";
import { ExerciseArt } from "@/src/domains/exercises/ui/presentation/components/ExerciseArt";
import type { ExerciseType } from "@/src/types/exerciseFlow";
import { getCategoryBadgeTheme } from "../exerciseScreenUtils";

interface ExerciseTimelineEmptyStateProps {
  readonly title?: string;
  readonly description?: string;
  readonly buttonLabel?: string;
  /** draw this exercise's art in place of the mascot (My Log) */
  readonly artType?: ExerciseType;
  /** replaces the default "go to Exercises" press */
  readonly onAction?: () => void;
}

export const ExerciseTimelineEmptyState: React.FC<ExerciseTimelineEmptyStateProps> =
  React.memo(
    ({
      title = "A space for your thoughts",
      description = "Your completed reflections and exercises will live here.",
      buttonLabel = "Explore Exercises",
      artType,
      onAction,
    }) => {
      const router = useRouter();

      return (
        <View className="items-center justify-center px-4 py-8">
          {artType ? (
            <View className="mb-4 h-[120px] w-[160px] overflow-hidden rounded-[20px] items-center justify-center bg-[#e6f0e2]">
              <ExerciseArt type={artType} />
            </View>
          ) : (
            <View className="mb-4 h-28 w-28 items-center justify-center rounded-[20px] bg-[#e6f0e2]">
              <Mascot state="panda-bubble" size={96} />
            </View>
          )}
          <Text className="happy-font-body-bold text-[20px] leading-[26px] text-happy-label text-center">
            {title}
          </Text>
          <Text className="happy-font-body-medium text-[15px] leading-[21px] mt-2 mb-6 text-center text-happy-label-2">
            {description}
          </Text>
          <Button
            label={buttonLabel}
            fullWidth={false}
            onPress={onAction ?? (() => router.push("/tabs/(tabs)/exercises" as never))}
            className="self-center px-6"
          />
        </View>
      );
    },
  );

ExerciseTimelineEmptyState.displayName = "ExerciseTimelineEmptyState";

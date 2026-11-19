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
        <View className="items-center justify-center px-8 py-20">
          {artType ? (
            <View className="mb-5 h-24 w-24 overflow-hidden rounded-[28px]" style={{ backgroundColor: getCategoryBadgeTheme("cbt_core").bg }}>
              <ExerciseArt type={artType} />
            </View>
          ) : (
            <View className="happy-mascot-stage mb-5 h-28 w-28 items-center justify-center rounded-[36px]">
              <Mascot state="panda-bubble" size={96} />
            </View>
          )}
          <Text className="happy-font-heading-bold text-2xl text-ink text-center">
            {title}
          </Text>
          <Text className="happy-font-body-medium mt-3 mb-8 text-center text-base leading-relaxed text-ink-muted">
            {description}
          </Text>
          <Button
            label={buttonLabel}
            onPress={onAction ?? (() => router.push("/tabs/(tabs)/exercises" as never))}
          />
        </View>
      );
    },
  );

ExerciseTimelineEmptyState.displayName = "ExerciseTimelineEmptyState";

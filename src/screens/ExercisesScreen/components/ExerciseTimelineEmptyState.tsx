// ponytail: reusable Duolingo-grade empty state for exercise & thought timelines
import React from "react";
import { View, Text } from "react-native";
import { useRouter } from "expo-router";
import { Button } from "@/src/components/ui/Button";
import { Mascot } from "@/src/components/ui/Mascot";

interface ExerciseTimelineEmptyStateProps {
  readonly title?: string;
  readonly description?: string;
  readonly buttonLabel?: string;
}

export const ExerciseTimelineEmptyState: React.FC<ExerciseTimelineEmptyStateProps> =
  React.memo(
    ({
      title = "A space for your thoughts",
      description = "Your completed reflections and exercises will live here.",
      buttonLabel = "Explore Exercises",
    }) => {
      const router = useRouter();

      return (
        <View className="items-center justify-center px-8 py-20">
          <View className="happy-mascot-stage mb-5 h-28 w-28 items-center justify-center rounded-[36px]">
            <Mascot state="panda-bubble" size={96} />
          </View>
          <Text className="happy-font-heading-bold text-2xl text-ink text-center">
            {title}
          </Text>
          <Text className="happy-font-body-medium mt-3 mb-8 text-center text-base leading-relaxed text-ink-muted">
            {description}
          </Text>
          <Button
            label={buttonLabel}
            onPress={() => router.push("/tabs/(tabs)/exercises" as never)}
          />
        </View>
      );
    },
  );

ExerciseTimelineEmptyState.displayName = "ExerciseTimelineEmptyState";

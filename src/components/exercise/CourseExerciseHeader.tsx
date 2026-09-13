import { SEMANTIC_COLORS } from "@/src/components/exercise/courseExerciseTheme";
import React, { useMemo } from "react";
import { View } from "react-native";
import { Stack } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColorScheme } from "react-native";
import { SAGE } from "@/src/theme/palette";
import { LessonHeader } from "@/src/components/ui/LessonHeader";

interface CourseExerciseHeaderProps {
  progress: number;
  trailingLabel: string;
  onClose?: () => void;
}

export function CourseExerciseHeader({
  progress,
  trailingLabel,
  onClose,
}: CourseExerciseHeaderProps) {
  const insets = useSafeAreaInsets();
  const isDark = useColorScheme() === "dark";

  // ponytail: memoize options so Stack.Screen doesn't thrash navigator updates
  const header = useMemo(
    () => () => (
      <View
        className="bg-brand-surface"
        style={{ paddingTop: insets.top + 8 }}
      >
        <LessonHeader
          progress={progress}
          trailingLabel={trailingLabel}
          onClose={onClose}
          progressFillColor={isDark ? SAGE[400] : SAGE[500]}
          progressTrackColor={isDark ? "#2a3a2a" : "#eef2ea"}
          iconColor={String(SEMANTIC_COLORS.text.secondary)}
          trailingLabelColor={String(SEMANTIC_COLORS.text.secondary)}
        />
      </View>
    ),
    [insets.top, isDark, progress, trailingLabel, onClose],
  );

  const options = useMemo(
    () => ({
      headerShown: true,
      headerTransparent: false,
      headerShadowVisible: false,
      header,
    }),
    [header],
  );

  return <Stack.Screen options={options} />;
}

import React from "react";
import { StyleSheet, View } from "react-native";
import { Stack } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LessonHeader } from "@/src/components/ui/LessonHeader";
import { COURSE_EXERCISE_COLORS } from "@/src/components/exercise/courseExerciseTheme";

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

  return (
    <Stack.Screen
      options={{
        headerShown: true,
        headerTransparent: false,
        headerShadowVisible: false,
        header: () => (
          <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
            <LessonHeader
              progress={progress}
              trailingLabel={trailingLabel}
              onClose={onClose}
              progressFillColor={COURSE_EXERCISE_COLORS.olive}
              progressTrackColor={COURSE_EXERCISE_COLORS.surfaceMuted}
              iconColor={COURSE_EXERCISE_COLORS.inkSoft}
              trailingLabelColor={COURSE_EXERCISE_COLORS.inkSoft}
            />
          </View>
        ),
      }}
    />
  );
}

const styles = StyleSheet.create({
  header: { backgroundColor: COURSE_EXERCISE_COLORS.background },
});

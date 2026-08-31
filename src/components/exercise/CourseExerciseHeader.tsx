import { SEMANTIC_COLORS } from "@/src/components/exercise/courseExerciseTheme";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Stack } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
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
              progressFillColor={SEMANTIC_COLORS.brand.primary}
              progressTrackColor={SEMANTIC_COLORS.surface.secondary}
              iconColor={SEMANTIC_COLORS.text.secondary}
              trailingLabelColor={SEMANTIC_COLORS.text.secondary}
            />
          </View>
        ),
      }}
    />
  );
}

const styles = StyleSheet.create({
  header: { backgroundColor: SEMANTIC_COLORS.surface.primary },
});

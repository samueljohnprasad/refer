import { SEMANTIC_COLORS } from "@/src/components/exercise/courseExerciseTheme";
import React from "react";
import { Pressable, View } from "react-native";
import { Text } from "@/src/components/ui/Text";
import { triggerSelectionHaptic } from "@/src/components/exercise/selectionHaptics";

export function ExerciseSkipAction({ onSkip }: { onSkip: () => void }) {
  const handlePress = () => {
    triggerSelectionHaptic();
    onSkip();
  };

  return (
    <View className="items-center px-6 pb-3 pt-2">
      <Pressable
        accessibilityRole="button"
        className="min-h-11 items-center justify-center rounded-full px-5"
        onPress={handlePress}
        style={{ backgroundColor: SEMANTIC_COLORS.brand.soft }}
      >
        <Text
          variant="label-bold"
          style={{ color: SEMANTIC_COLORS.brand.pressed, fontSize: 15, lineHeight: 20 }}
        >
          Skip for now
        </Text>
      </Pressable>
    </View>
  );
}

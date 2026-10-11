import { SEMANTIC_COLORS } from "@/src/components/exercise/courseExerciseTheme";
import React from "react";
import { View } from "react-native";
import { SymbolView } from "expo-symbols";
import { Text } from "@/src/components/ui/Text";

interface ExerciseIntroDurationPillProps {
  duration: string;
}

export const ExerciseIntroDurationPill: React.FC<
  ExerciseIntroDurationPillProps
> = React.memo(({ duration }) => {
  return (
    <View className="mb-5 flex-row items-center justify-center">
      <View className="flex-row items-center rounded-full bg-sage-50 px-3 py-1.5">
        <SymbolView
          name="timer"
          size={14}
          tintColor={SEMANTIC_COLORS.text.secondary}
          weight="medium"
        />
        <Text
          variant="chip"
          color="sage"
          className="ml-1.5 uppercase tracking-widest"
        >
          {duration}
        </Text>
      </View>
    </View>
  );
});

ExerciseIntroDurationPill.displayName = "ExerciseIntroDurationPill";

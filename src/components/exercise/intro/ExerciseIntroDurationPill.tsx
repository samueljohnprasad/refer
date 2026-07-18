import React from "react";
import { View } from "react-native";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { Timer01Icon } from "@hugeicons/core-free-icons";
import { Text } from "@/src/components/ui/Text";
import { SAGE } from "@/lib/tokens";

interface ExerciseIntroDurationPillProps {
  duration: string;
}

export const ExerciseIntroDurationPill: React.FC<
  ExerciseIntroDurationPillProps
> = React.memo(({ duration }) => {
  return (
    <View className="mb-7 flex-row items-center justify-center">
      <View className="flex-row items-center rounded-full bg-sage-50 px-3 py-1.5">
        <HugeiconsIcon
          icon={Timer01Icon}
          size={14}
          color={SAGE[600]}
          strokeWidth={2}
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

import React from "react";
import { Pressable, View } from "react-native";
import { INK_SOFT, SAGE } from "@/lib/tokens";
import { Text } from "@/src/components/ui/Text";
import { triggerSelectionHaptic } from "@/src/components/exercise/selectionHaptics";

interface ExerciseSupportRowProps {
  onShowClue: () => void;
  onMakeEasier: () => void;
  onSkip: () => void;
  clueDisabled?: boolean;
  easierDisabled?: boolean;
}

export function ExerciseSupportRow({
  onShowClue,
  onMakeEasier,
  onSkip,
  clueDisabled = false,
  easierDisabled = false,
}: ExerciseSupportRowProps) {
  return (
    <View className="px-6 pb-3 pt-2">
      <View className="mb-3 flex-row justify-center gap-3">
        <SupportAction
          label="Show clue"
          disabled={clueDisabled}
          onPress={onShowClue}
        />
        <SupportAction
          label="Make easier"
          disabled={easierDisabled}
          onPress={onMakeEasier}
        />
      </View>
      <SupportAction
        label="Skip for now"
        className="mt-1 self-center"
        onPress={onSkip}
      />
    </View>
  );
}

function SupportAction({
  className = "",
  disabled = false,
  label,
  onPress,
}: {
  className?: string;
  disabled?: boolean;
  label: string;
  onPress: () => void;
}) {
  const handlePress = () => {
    if (disabled) {
      return;
    }

    triggerSelectionHaptic();
    onPress();
  };

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={handlePress}
      className={`min-h-11 items-center justify-center rounded-full px-5 ${className}`}
      style={{
        backgroundColor: disabled ? "transparent" : SAGE.selected,
        opacity: disabled ? 0.42 : 1,
      }}
    >
      <Text
        variant="label-bold"
        style={{
          color: disabled ? INK_SOFT : SAGE[700],
          fontSize: 15,
          lineHeight: 20,
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}

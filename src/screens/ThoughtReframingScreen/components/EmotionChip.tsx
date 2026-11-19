import React from "react";
import { Pressable, View } from "react-native";
import { Text } from "@/components/ui/Text";
import { Feather } from "@expo/vector-icons";
import type { EmotionOption } from "../data/emotions";
import { triggerSelectionHaptic } from "@/src/components/exercise/selectionHaptics";
import { useExerciseCopy } from "@/src/hooks/useExerciseCopy";
import { EmotionFace } from "@/src/domains/exercises/ui/presentation/components/ReframingArt";

interface EmotionChipProps {
  emotion: EmotionOption;
  isSelected: boolean;
  onToggle: () => void;
  /** Optional intensity slider value (0–10) */
  intensity?: number;
  /** Called when intensity changes */
  onIntensityChange?: (value: number) => void;
  disabled?: boolean;
  locked?: boolean;
}

// ponytail: .emo tile from .agents/thought-reframing.html — a drawn face, warm when picked, tick badge.
export const EmotionChip: React.FC<EmotionChipProps> = React.memo(
  ({ emotion, isSelected, onToggle, disabled = false, locked = false }) => {
    const translateCopy = useExerciseCopy();
    const emotionLabel = translateCopy(emotion.label);
    const isDisabled = locked || (disabled && !isSelected);

    return (
      <Pressable
        onPress={() => {
          if (isDisabled) return;
          triggerSelectionHaptic();
          onToggle();
        }}
        disabled={isDisabled}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: isSelected, disabled: isDisabled }}
        accessibilityLabel={`${emotionLabel} ${translateCopy("emotion")}`}
        className="w-full min-h-[112px] items-center justify-center gap-2 p-3 rounded-2xl active:scale-[0.97]"
        style={{
          backgroundColor: isSelected ? "#eef3ea" : "#f7f7f7",
          borderWidth: 2,
          borderColor: isSelected ? "#5f7f58" : "transparent",
        }}
      >
        <View style={{ opacity: isDisabled ? 0.45 : 1 }}>
          <EmotionFace name={emotion.name} on={isSelected} />
        </View>
        <Text
          className="text-t-body font-bold"
          style={{ color: isDisabled ? "#4b4b4b" : "#142414" }}
          numberOfLines={1}
        >
          {emotionLabel}
        </Text>
        {isSelected ? (
          <View className="absolute top-3 right-3 w-6 h-6 rounded-full items-center justify-center bg-[#29452a]">
            <Feather name="check" size={14} color="#fff" />
          </View>
        ) : null}
      </Pressable>
    );
  },
);

EmotionChip.displayName = "EmotionChip";

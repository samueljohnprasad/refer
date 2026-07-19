import React from "react";
import { Pressable } from "react-native";
import { Text } from "@/components/ui/Text";
import { SAGE, BRAND_BORDER, BRAND_SURFACE, INK } from "@/lib/tokens";
import { Feather } from "@expo/vector-icons";
import type { EmotionOption } from "../data/emotions";
import { triggerSelectionHaptic } from "@/src/components/exercise/selectionHaptics";

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

export const EmotionChip: React.FC<EmotionChipProps> = React.memo(
  ({
    emotion,
    isSelected,
    onToggle,
    disabled = false,
    locked = false,
  }) => {
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
        accessibilityLabel={`${emotion.label} emotion`}
        className={`w-full rounded-lg border px-3 flex-row items-center ${
          isDisabled ? "opacity-45" : ""
        }`}
        style={({ pressed }) => ({
          borderColor: isSelected ? SAGE[500] : BRAND_BORDER,
          backgroundColor: isSelected ? SAGE.selected : BRAND_SURFACE,
          minHeight: 48,
          opacity: pressed ? 0.72 : 1,
        })}
      >
        <Text className="mr-2 text-[17px] leading-[20px]">{emotion.emoji}</Text>
        <Text
          className="flex-1 text-[15px] font-medium"
          style={{ color: isSelected ? SAGE[800] : INK }}
          numberOfLines={1}
        >
          {emotion.label}
        </Text>
        {isSelected ? (
          <Feather name="check" size={16} color={SAGE[700]} />
        ) : null}
      </Pressable>
    );
  },
);

EmotionChip.displayName = "EmotionChip";

import React from "react";
import { Pressable } from "react-native";
import { Text } from "@/components/ui/Text";
import { SEMANTIC_COLORS } from "@/src/theme/colors";
import { RADIUS } from "@/src/theme/radius";
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
          borderColor: isSelected ? SEMANTIC_COLORS.brand.primary : SEMANTIC_COLORS.border.default,
          backgroundColor: isSelected ? SEMANTIC_COLORS.selection.surface : SEMANTIC_COLORS.surface.primary,
          minHeight: 48,
          opacity: pressed ? 0.72 : 1,
        })}
      >
        <Text className="mr-2 text-[17px] leading-[20px]">{emotion.emoji}</Text>
        <Text
          className="flex-1 text-[15px] font-medium"
          style={{ color: isSelected ? SEMANTIC_COLORS.brand.onSoft : SEMANTIC_COLORS.text.primary }}
          numberOfLines={1}
        >
          {emotion.label}
        </Text>
        {isSelected ? (
          <Feather name="check" size={16} color={SEMANTIC_COLORS.brand.onSoft} />
        ) : null}
      </Pressable>
    );
  },
);

EmotionChip.displayName = "EmotionChip";

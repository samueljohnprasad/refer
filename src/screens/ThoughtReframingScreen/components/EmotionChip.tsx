import React from "react";
import { Pressable, View } from "react-native";
import { Text } from "@/components/ui/Text";
import type { EmotionOption } from "../data/emotions";

interface EmotionChipProps {
  emotion: EmotionOption;
  isSelected: boolean;
  onToggle: () => void;
  /** Optional intensity slider value (0–10) */
  intensity?: number;
  /** Called when intensity changes */
  onIntensityChange?: (value: number) => void;
  disabled?: boolean;
}

const SELECTED_BORDER = "#58CC02";
const SELECTED_BG = "#F0FFF0";

export const EmotionChip: React.FC<EmotionChipProps> = React.memo(
  ({ emotion, isSelected, onToggle, disabled = false }) => {
    return (
      <Pressable
        onPress={onToggle}
        disabled={disabled && !isSelected}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: isSelected }}
        accessibilityLabel={`${emotion.label} emotion`}
        className={`rounded-2xl px-4 py-3.5 flex-row items-center mr-2 mb-2.5 border-2 ${disabled && !isSelected ? "opacity-40" : ""
          } active:opacity-80`}
        style={{
          borderColor: isSelected ? SELECTED_BORDER : "#E2E8F0",
          backgroundColor: isSelected ? SELECTED_BG : "#FFFFFF",
          shadowColor: isSelected ? SELECTED_BORDER : "transparent",
          shadowOffset: { width: 0, height: isSelected ? 2 : 0 },
          shadowOpacity: isSelected ? 0.2 : 0,
          shadowRadius: 0,
          elevation: isSelected ? 2 : 0,
          minHeight: 48,
        }}
      >
        <Text className="text-xl mr-2">{emotion.emoji}</Text>
        <Text
          className={`text-[15px] font-bold ${isSelected ? "text-green-800" : "text-slate-700"
            }`}
        >
          {emotion.label}
        </Text>
        {isSelected && (
          <View
            className="ml-auto h-5 w-5 rounded-full items-center justify-center"
            style={{ backgroundColor: SELECTED_BORDER }}
          >
            <Text className="text-white text-xs font-extrabold">✓</Text>
          </View>
        )}
      </Pressable>
    );
  },
);

EmotionChip.displayName = "EmotionChip";

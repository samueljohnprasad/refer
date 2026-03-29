import React from "react";
import { Pressable, View } from "react-native";
import { Text } from "@/components/ui/text";
import type { CognitiveDistortion } from "../types";

interface DistortionCardProps {
  distortion: CognitiveDistortion;
  isSelected: boolean;
  onToggle: () => void;
  disabled?: boolean;
}

const SELECTED_BORDER = "#58CC02";
const SELECTED_BG = "#F0FFF0";

export const DistortionCard: React.FC<DistortionCardProps> = React.memo(
  ({ distortion, isSelected, onToggle, disabled = false }) => {
    return (
      <Pressable
        onPress={onToggle}
        disabled={disabled && !isSelected}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: isSelected }}
        accessibilityLabel={`${distortion.label} thinking trap`}
        accessibilityHint={distortion.description}
        className={`rounded-2xl p-4 mb-3 border-2 active:opacity-80 ${disabled && !isSelected ? "opacity-40" : ""
          }`}
        style={{
          borderColor: isSelected ? SELECTED_BORDER : "#E2E8F0",
          backgroundColor: isSelected ? SELECTED_BG : "#FFFFFF",
          shadowColor: isSelected ? SELECTED_BORDER : "transparent",
          shadowOffset: { width: 0, height: isSelected ? 2 : 0 },
          shadowOpacity: isSelected ? 0.15 : 0,
          shadowRadius: 0,
          elevation: isSelected ? 2 : 0,
          minHeight: 48,
        }}
      >
        <View className="flex-row items-center mb-1.5">
          <View className="h-10 w-10 rounded-xl bg-slate-100 items-center justify-center mr-3">
            <Text className="text-xl">{distortion.icon}</Text>
          </View>
          <Text
            className={`text-[15px] font-extrabold flex-1 ${isSelected ? "text-green-800" : "text-slate-800"
              }`}
          >
            {distortion.label}
          </Text>
          {isSelected && (
            <View
              className="h-6 w-6 rounded-full items-center justify-center"
              style={{ backgroundColor: SELECTED_BORDER }}
            >
              <Text className="text-white text-xs font-extrabold">✓</Text>
            </View>
          )}
        </View>
        <Text className="text-sm text-slate-500 ml-[52px] leading-relaxed">
          {distortion.description}
        </Text>
        <Text className="text-xs text-slate-400 italic ml-[52px] mt-1">
          e.g. "{distortion.example}"
        </Text>
      </Pressable>
    );
  },
);

DistortionCard.displayName = "DistortionCard";

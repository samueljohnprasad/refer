import React from "react";
import { Pressable, View } from "react-native";
import { Text } from "@/src/components/ui/Text";
import { Feather } from "@expo/vector-icons";
import { SEMANTIC_COLORS } from "@/src/theme/colors";
import { RADIUS } from "@/src/theme/radius";
import type { CognitiveDistortion } from "../types";
import { triggerSelectionHaptic } from "@/src/components/exercise/selectionHaptics";

interface DistortionCardProps {
  distortion: CognitiveDistortion;
  isSelected: boolean;
  onToggle: () => void;
  disabled?: boolean;
  locked?: boolean;
}

export const DistortionCard: React.FC<DistortionCardProps> = React.memo(
  ({
    distortion,
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
        accessibilityLabel={`${distortion.label} thinking pattern`}
        accessibilityState={{ checked: isSelected, disabled: isDisabled }}
        className={`border-b border-sage-100/70 px-1 py-3.5 ${
          isDisabled ? "opacity-50" : ""
        }`}
        style={({ pressed }) => ({
          backgroundColor: isSelected ? SEMANTIC_COLORS.selection.surface : SEMANTIC_COLORS.surface.primary,
          minHeight: 72,
          opacity: pressed ? 0.72 : 1,
        })}
      >
        <View className="flex-row items-start">
          <Text className="mr-3 mt-0.5 text-[18px] leading-[22px]">
            {distortion.icon}
          </Text>
          <View className="flex-1">
            <Text
              variant="body-bold"
              className={`text-[15px] leading-[20px] ${
                isSelected ? "text-sage-800" : "text-ink"
              }`}
              numberOfLines={1}
            >
              {distortion.label}
            </Text>
            <Text
              variant="caption"
              color="soft"
              className="mt-1 text-[13px] leading-[18px]"
              numberOfLines={2}
            >
              {distortion.description}
            </Text>
          </View>
          <View
            className="ml-3 h-6 w-6 items-center justify-center rounded-full border"
            style={{
              backgroundColor: isSelected ? SEMANTIC_COLORS.brand.pressed : SEMANTIC_COLORS.surface.primary,
              borderColor: isSelected ? SEMANTIC_COLORS.brand.pressed : SEMANTIC_COLORS.border.default,
            }}
          >
            {isSelected ? (
              <Feather name="check" size={14} color={SEMANTIC_COLORS.surface.primary} />
            ) : null}
          </View>
        </View>
      </Pressable>
    );
  },
);

DistortionCard.displayName = "DistortionCard";

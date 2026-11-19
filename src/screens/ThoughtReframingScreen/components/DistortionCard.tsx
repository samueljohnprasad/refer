import React from "react";
import { Pressable, View } from "react-native";
import { Text } from "@/src/components/ui/Text";
import { Feather } from "@expo/vector-icons";
import type { CognitiveDistortion } from "../types";
import { triggerSelectionHaptic } from "@/src/components/exercise/selectionHaptics";
import { useExerciseCopy } from "@/src/hooks/useExerciseCopy";
import { TRPatternArt } from "@/src/exercises/thoughtReframing/TRPatternArt";

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
    const translateCopy = useExerciseCopy();
    const distortionLabel = translateCopy(distortion.label);
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
        accessibilityLabel={`${distortionLabel} ${translateCopy("thinking pattern")}`}
        accessibilityState={{ checked: isSelected, disabled: isDisabled }}
        className="mb-3 rounded-2xl p-3"
        style={({ pressed }) => ({
          backgroundColor: isSelected ? "#eef3ea" : "#f7f7f7",
          borderWidth: 2,
          borderColor: isSelected ? "#5f7f58" : "transparent",
          transform: [{ scale: pressed ? 0.99 : 1 }],
        })}
      >
        <View className="flex-row items-start gap-3">
          <View
            className="h-16 w-16 overflow-hidden rounded-[14px]"
            style={{ backgroundColor: isSelected ? "#ffffff" : "#f6ecd8", opacity: isDisabled && !isSelected ? 0.45 : 1 }}
          >
            <TRPatternArt name={distortion.key} size={64} />
          </View>
          <View className="flex-1 pr-7">
            <Text className="text-[17px] font-extrabold leading-[20px] text-happy-label">
              {distortionLabel}
            </Text>
            <Text className="mt-0.5 text-[13px] font-semibold leading-[18px] text-happy-label-2">
              {translateCopy(distortion.description)}
            </Text>
            <Text className="mt-2 text-[15px] font-bold leading-[20px] text-happy-label">
              {translateCopy(distortion.example)}
            </Text>
          </View>
        </View>
        {isSelected ? (
          <View className="absolute right-3 top-3 h-6 w-6 items-center justify-center rounded-full" style={{ backgroundColor: "#29452a" }}>
            <Feather name="check" size={14} color="#ffffff" />
          </View>
        ) : null}
      </Pressable>
    );
  },
);

DistortionCard.displayName = "DistortionCard";

import React from "react";
import { View } from "react-native";
import { Text } from "@/src/components/ui/Text";
import { Card } from "@/src/components/ui/Card";
import type { CognitiveDistortion } from "../types";

interface DistortionCardProps {
  distortion: CognitiveDistortion;
  isSelected: boolean;
  onToggle: () => void;
  disabled?: boolean;
}

export const DistortionCard: React.FC<DistortionCardProps> = React.memo(
  ({ distortion, isSelected, onToggle, disabled = false }) => {
    return (
      <Card
        variant={isSelected ? "answer-selected" : "answer"}
        onPress={onToggle}
        disabled={disabled && !isSelected}
        haptic="light"
        className={`mb-3 ${disabled && !isSelected ? "opacity-40" : ""}`}
        contentClassName="p-4"
      >
        <View className="flex-row items-center mb-1.5">
          <View className="h-10 w-10 rounded-xl bg-slate-100 items-center justify-center mr-3">
            <Text className="text-xl">{distortion.icon}</Text>
          </View>
          <Text
            variant="body-bold"
            className={`text-[15.5px] flex-1 ${
              isSelected ? "text-sage-800" : "text-ink"
            }`}
          >
            {distortion.label}
          </Text>
          {isSelected && (
            <View className="h-6 w-6 rounded-full items-center justify-center bg-sage-500">
              <Text className="text-white text-xs font-extrabold">✓</Text>
            </View>
          )}
        </View>
        <Text variant="body" color="soft" className="text-sm ml-[52px] leading-relaxed">
          {distortion.description}
        </Text>
        <Text variant="caption-muted" className="italic ml-[52px] mt-1">
          e.g. "{distortion.example}"
        </Text>
      </Card>
    );
  },
);

DistortionCard.displayName = "DistortionCard";

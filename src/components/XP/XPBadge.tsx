import React from "react";
import { View, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { GRADIENTS } from "@/constants/palette";

interface XPBadgeProps {
  amount: number;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "highlight";
}

const SIZE_CLASSES: Record<string, string> = {
  sm: "px-2 py-0.5",
  md: "px-3 py-1",
  lg: "px-4 py-1.5",
};

const TEXT_SIZE_CLASSES: Record<string, string> = {
  sm: "text-xs",
  md: "text-sm",
  lg: "text-base",
};

export const XPBadge: React.FC<XPBadgeProps> = ({
  amount,
  size = "sm",
  variant = "default",
}) => {
  if (variant === "highlight") {
    return (
      <LinearGradient
        colors={GRADIENTS.xpHighlight}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        className="rounded-full px-2 py-0.5"
      >
        <Text className={`text-white font-bold ${TEXT_SIZE_CLASSES[size]}`}>
          +{amount} XP
        </Text>
      </LinearGradient>
    );
  }

  // Default: soft amber tint for elegant XP rewards
  return (
    <View
      className={`rounded-full bg-amber-50 ${SIZE_CLASSES[size]}`}
    >
      <Text
        className={`font-bold text-amber-600 ${TEXT_SIZE_CLASSES[size]}`}
      >
        +{amount} XP
      </Text>
    </View>
  );
};

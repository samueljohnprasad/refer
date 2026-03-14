import React from "react";
import { View, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

interface XPBadgeProps {
  amount: number;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "highlight";
}

export const XPBadge: React.FC<XPBadgeProps> = ({
  amount,
  size = "sm",
  variant = "default",
}) => {
  const sizeClasses: Record<string, string> = {
    sm: "px-2 py-0.5",
    md: "px-3 py-1",
    lg: "px-4 py-1.5",
  };

  const textSizeClasses: Record<string, string> = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  if (variant === "highlight") {
    return (
      <LinearGradient
        colors={["#F59E0B", "#D97706"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{ borderRadius: 99, paddingHorizontal: 8, paddingVertical: 3 }}
      >
        <Text className={`text-white font-bold ${textSizeClasses[size]}`}>
          +{amount} XP
        </Text>
      </LinearGradient>
    );
  }

  // Default: subtle amber tint instead of plain gray
  return (
    <View
      className={`rounded-full ${sizeClasses[size]}`}
      style={{
        backgroundColor: "#FEF3C7",
        borderWidth: 1,
        borderColor: "#FDE68A",
      }}
    >
      <Text
        className={`font-bold ${textSizeClasses[size]}`}
        style={{ color: "#B45309" }}
      >
        +{amount} XP
      </Text>
    </View>
  );
};

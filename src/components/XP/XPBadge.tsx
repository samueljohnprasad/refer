import React from "react";
import { View, Text } from "react-native";

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

  const bgClass =
    variant === "highlight"
      ? "bg-yellow-400"
      : "bg-gray-100 border border-gray-200";

  const textColor =
    variant === "highlight" ? "text-yellow-900" : "text-gray-600";

  return (
    <View className={`${bgClass} rounded-full ${sizeClasses[size]}`}>
      <Text className={`${textColor} font-bold ${textSizeClasses[size]}`}>
        +{amount} XP
      </Text>
    </View>
  );
};

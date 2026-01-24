import React from "react";
import { View, Text } from "react-native";
import { LevelTier } from "@/src/types/levels";

interface LevelBadgeProps {
  level: LevelTier;
  size?: "sm" | "md" | "lg";
  showName?: boolean;
}

/**
 * Compact badge showing level icon and optionally name
 * For use in headers and profile displays
 */
export const LevelBadge: React.FC<LevelBadgeProps> = ({
  level,
  size = "md",
  showName = true,
}) => {
  const sizeStyles = {
    sm: { icon: 16, text: "text-xs", padding: "px-2 py-0.5" },
    md: { icon: 20, text: "text-sm", padding: "px-3 py-1" },
    lg: { icon: 24, text: "text-base", padding: "px-4 py-1.5" },
  };

  const styles = sizeStyles[size];

  return (
    <View
      className={`flex-row items-center ${styles.padding} rounded-full`}
      style={{ backgroundColor: level.color + "30" }}
    >
      <Text style={{ fontSize: styles.icon }}>{level.icon}</Text>
      {showName && (
        <Text
          className={`${styles.text} font-semibold ml-1`}
          style={{ color: level.color }}
        >
          {level.name}
        </Text>
      )}
    </View>
  );
};

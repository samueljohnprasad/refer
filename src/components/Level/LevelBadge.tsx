import React from "react";
import { View, Text } from "react-native";
import { LevelTier } from "@/src/types/levels";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { 
  Plant01Icon, 
  BrainIcon, 
  Target01Icon, 
  StarsIcon, 
  Medal01Icon 
} from "@hugeicons/core-free-icons";

interface LevelBadgeProps {
  level: LevelTier;
  size?: "sm" | "md" | "lg";
  showName?: boolean;
}

export const getLevelIcon = (levelNum: number) => {
  switch (levelNum) {
    case 1: return Plant01Icon;
    case 2: return BrainIcon;
    case 3: return Target01Icon;
    case 4: return StarsIcon;
    case 5: return Medal01Icon;
    default: return StarsIcon;
  }
};

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
      style={{ backgroundColor: level.color + "1A" }}
    >
      <HugeiconsIcon icon={getLevelIcon(level.level)} size={styles.icon} color={level.color} />
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

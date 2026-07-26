import React from "react";
import { View, Text, Platform } from "react-native";
import { LevelTier } from "@/src/types/levels";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { 
  Plant01Icon, 
  BrainIcon, 
  Target01Icon, 
  StarsIcon, 
  Medal01Icon 
} from "@hugeicons/core-free-icons";
import { SymbolView } from "expo-symbols";
import type { SFSymbol } from "sf-symbols-typescript";

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
    case 6: return BrainIcon;
    case 7: return Target01Icon;
    case 8: return Plant01Icon;
    case 9: return StarsIcon;
    case 10: return Medal01Icon;
    default: return StarsIcon;
  }
};

export const getLevelSFSymbol = (levelNum: number): SFSymbol => {
  switch (levelNum) {
    case 1: return "leaf.fill";
    case 2: return "brain.head.profile";
    case 3: return "target";
    case 4: return "sparkles";
    case 5: return "medal.fill";
    case 6: return "book.fill";
    case 7: return "eye.circle.fill";
    case 8: return "wind";
    case 9: return "sun.max.fill";
    case 10: return "infinity.circle.fill";
    default: return "star.fill";
  }
};

/**
 * Compact badge showing native SF Symbol icon via expo-symbols on iOS and optionally name
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

  const renderIcon = () => {
    if (Platform.OS === "ios") {
      return (
        <SymbolView
          name={getLevelSFSymbol(level.level)}
          size={styles.icon}
          tintColor={level.color}
          weight="semibold"
          style={{ width: styles.icon, height: styles.icon }}
        />
      );
    }

    return (
      <HugeiconsIcon
        icon={getLevelIcon(level.level)}
        size={styles.icon}
        color={level.color}
      />
    );
  };

  return (
    <View
      className={`flex-row items-center ${styles.padding} rounded-full`}
      style={{ backgroundColor: level.color + "1A" }}
    >
      {renderIcon()}
      {showName && (
        <Text
          className={`${styles.text} font-semibold ml-1.5`}
          style={{ color: level.color }}
        >
          {level.name}
        </Text>
      )}
    </View>
  );
};

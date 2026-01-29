import React from "react";
import { View, Text, Pressable, Image } from "react-native";
import { Achievement } from "@/src/types/achievements";
import Svg, { Polygon } from "react-native-svg";
import { Grayscale } from "react-native-color-matrix-image-filters";

interface AchievementBadgeProps {
  achievement: Achievement;
  isUnlocked: boolean;
  currentProgress?: number;
  size?: "sm" | "md" | "lg";
  onPress?: () => void;
  showProgress?: boolean;
}

/**
 * Hexagonal badge component with expressive design
 * Shows progress count and unlock status
 */
export const AchievementBadge: React.FC<AchievementBadgeProps> = ({
  achievement,
  isUnlocked,
  currentProgress = 0,
  size = "lg",
  onPress,
  showProgress = true,
}) => {
  const sizeStyles = {
    sm: { hex: 60, icon: 18, text: "text-xs", nameSize: "text-xs" },
    md: { hex: 80, icon: 24, text: "text-sm", nameSize: "text-xs" },
    lg: { hex: 100, icon: 32, text: "text-base", nameSize: "text-sm" },
  };

  const styles = sizeStyles[size];
  const target = achievement.condition.target;
  const progress = Math.min(currentProgress, target);
  const progressPercent = (progress / target) * 100;

  // Check if icon is a number or emoji
  const isNumberIcon = !isNaN(Number(achievement.icon));

  return (
    <Pressable
      onPress={onPress}
      className="items-center mb-4"
      style={{ width: styles.hex + 20 }}
    >
      {/* Hexagon Badge */}
      <View
        className="relative items-center justify-center"
        style={{ width: styles.hex, height: styles.hex }}
      >
        {/* Background Hexagon */}
        {/* <Svg
          width={styles.hex}
          height={styles.hex}
          viewBox="0 0 100 100"
          style={{ position: "absolute" }}
        >
          <Polygon
            points="50,5 95,27.5 95,72.5 50,95 5,72.5 5,27.5"
            fill={isUnlocked ? achievement.color : "#E5E7EB"}
            stroke={isUnlocked ? achievement.color : "#D1D5DB"}
            strokeWidth="2"
          />
        </Svg> */}

        {/* Icon/Number/Image */}
        <View className="absolute items-center justify-center">
          {achievement.imageAsset ? (
            <Grayscale amount={isUnlocked ? 0 : 1}>
              <Image
                source={achievement.imageAsset.unlocked}
                style={{
                  width: styles.hex,
                  height: styles.hex,
                  opacity: isUnlocked ? 1 : 0.5,
                }}
                resizeMode="contain"
              />
            </Grayscale>
          ) : isNumberIcon ? (
            <Text
              className="font-bold"
              style={{
                fontSize: styles.icon,
                color: isUnlocked ? "#FFFFFF" : "#9CA3AF",
              }}
            >
              {achievement.icon}
            </Text>
          ) : (
            <Text
              style={{
                fontSize: styles.icon,
                opacity: isUnlocked ? 1 : 0.4,
              }}
            >
              {achievement.icon}
            </Text>
          )}

          {/* XP indicator for unlocked */}
          {isUnlocked && (
            <View
              className="absolute -bottom-1 px-1.5 py-0.5 rounded-full"
              style={{ backgroundColor: "#FFD700" }}
            >
              <Text className="text-[8px] font-bold text-gray-900">
                +{achievement.xpBonus}
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Badge Name */}
      <Text
        className={`${styles.nameSize} font-semibold text-center mt-2`}
        style={{ color: isUnlocked ? "#111827" : "#6B7280" }}
        numberOfLines={2}
      >
        {achievement.name}
      </Text>

      {/* Description */}
      <Text
        className="text-[10px] text-gray-400 text-center mt-0.5"
        numberOfLines={2}
      >
        {achievement.description}
      </Text>

      {/* Unlocked Button or Progress Bar */}
      {isUnlocked ? (
        <View
          className="mt-2 px-3 py-1 rounded-full"
          style={{ backgroundColor: "#22C55E" }}
        >
          <Text className="text-[10px] font-bold text-white">✓ Unlocked!</Text>
        </View>
      ) : (
        showProgress && (
          <View className="w-full mt-2">
            {/* Progress Bar */}
            <View className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <View
                className="h-full rounded-full"
                style={{
                  width: `${progressPercent}%`,
                  backgroundColor: achievement.color,
                }}
              />
            </View>
            {/* Progress Count */}
            <Text className="text-[10px] text-gray-500 text-right mt-0.5">
              {progress}/{target}
            </Text>
          </View>
        )
      )}
    </Pressable>
  );
};

import React from "react";
import { View, Text, Pressable, Image } from "react-native";
import { Achievement } from "@/src/types/achievements";
// FIX #28: Removed unused Svg and Polygon imports (dead code)
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
 * Badge component showing achievement image, progress, and unlock status.
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
    sm: { hex: 60, icon: 18, nameSize: "text-xs" },
    md: { hex: 80, icon: 24, nameSize: "text-xs" },
    lg: { hex: 100, icon: 32, nameSize: "text-sm" },
  };

  const styles = sizeStyles[size];
  const target = achievement.condition.target;
  // FIX #29: Clamp progress to minimum of 0 to prevent negative values
  const progress = Math.max(0, Math.min(currentProgress, target));
  const progressPercent = target > 0 ? (progress / target) * 100 : 0;

  const isNumberIcon = !isNaN(Number(achievement.icon));

  return (
    <Pressable
      onPress={onPress}
      // FIX #30: Added accessibilityRole, accessibilityLabel, and accessibilityState
      accessibilityRole="button"
      accessibilityLabel={
        isUnlocked
          ? `${achievement.name} — Unlocked. +${achievement.xpBonus} XP.`
          : `${achievement.name} — Locked. Progress: ${progress} of ${target}.`
      }
      accessibilityState={{ selected: isUnlocked }}
      className="items-center mb-3"
      style={({ pressed }) => [
        { width: styles.hex + 20, opacity: pressed && !!onPress ? 0.7 : 1 },
      ]}
    >
      {/* Badge Image */}
      <View
        className="relative items-center justify-center"
        style={{ width: styles.hex, height: styles.hex }}
      >
        <View className="absolute items-center justify-center">
          {achievement.imageAsset ? (
            <Grayscale amount={isUnlocked ? 0 : 1}>
              <Image
                source={achievement.imageAsset.unlocked}
                style={{
                  width: styles.hex,
                  height: styles.hex,
                  opacity: isUnlocked ? 1 : 0.45,
                }}
                resizeMode="contain"
              />
            </Grayscale>
          ) : isNumberIcon ? (
            <Text
              className="font-bold"
              style={{
                fontSize: styles.icon,
                // FIX #31: Locked number icon: use gray-500 not gray-400 for better contrast
                color: isUnlocked ? "#7B61FF" : "#6B7280",
              }}
            >
              {achievement.icon}
            </Text>
          ) : (
            <Text
              style={{
                fontSize: styles.icon,
                opacity: isUnlocked ? 1 : 0.45,
              }}
            >
              {achievement.icon}
            </Text>
          )}

          {/* XP badge — amber tint, only when unlocked */}
          {isUnlocked && (
            <View
              className="absolute -bottom-1 px-1.5 py-0.5 rounded-full border border-amber-100"
              style={{
                backgroundColor: "#FEF3C7",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.05,
                shadowRadius: 2,
                elevation: 1,
              }}
            >
              <Text className="text-[10px] font-bold text-amber-700">
                +{achievement.xpBonus} XP
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Badge Name */}
      <Text
        className={`${styles.nameSize} font-bold text-center mt-1.5 ${
          isUnlocked ? "text-gray-900" : "text-gray-500"
        }`}
        numberOfLines={2}
      >
        {achievement.name}
      </Text>

      {/* Description */}
      <Text
        className="text-[10px] text-gray-500 text-center mt-0.5"
        numberOfLines={2}
      >
        {achievement.description}
      </Text>

      {/* Progress (locked only) */}
      {!isUnlocked && showProgress && (
        <View className="w-full mt-2">
          <View className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <View
              className="h-full rounded-full"
              style={{
                width: `${progressPercent}%`,
                backgroundColor: achievement.color,
              }}
            />
          </View>
          <Text className="text-[10px] text-gray-400 text-center mt-0.5 font-medium">
            {progress}/{target}
          </Text>
        </View>
      )}
    </Pressable>
  );
};

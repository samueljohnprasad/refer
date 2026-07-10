import React from "react";
import { View, Text, Pressable, Image } from "react-native";
import type { Achievement } from "@/src/types/achievements";
// FIX #28: Removed unused Svg and Polygon imports (dead code)
import { SAGE, INK_MUTED } from "@/lib/tokens";
interface AchievementBadgeProps {
  achievement: Achievement;
  isUnlocked: boolean;
  currentProgress?: number;
  size?: "sm" | "md" | "lg";
  onPress?: () => void;
  showProgress?: boolean;
  showDescription?: boolean;
  showProgressBar?: boolean;
  showProgressText?: boolean;
  showUnlockedProgress?: boolean;
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
  showDescription = true,
  showProgressBar = true,
  showProgressText = true,
  showUnlockedProgress = false,
}) => {
  const sizeStyles = {
    sm: { hex: 60, icon: 18, nameSize: "text-xs", tileWidth: 88 },
    md: { hex: 80, icon: 24, nameSize: "text-xs", tileWidth: 104 },
    lg: { hex: 100, icon: 32, nameSize: "text-sm", tileWidth: 128 },
  };

  const styles = sizeStyles[size];
  const target = achievement.condition.target;
  // FIX #29: Clamp progress to minimum of 0 to prevent negative values
  const progress = Math.max(0, Math.min(currentProgress, target));
  const progressPercent = target > 0 ? (progress / target) * 100 : 0;
  const displayedProgress = isUnlocked ? target : progress;
  const shouldShowProgress =
    showProgress &&
    (showProgressBar || showProgressText) &&
    (!isUnlocked || showUnlockedProgress);

  const isNumberIcon = !isNaN(Number(achievement.icon));

  return (
    <Pressable
      onPress={onPress}
      // Phase 1 fix: accessibilityRole is "button" only when interactive
      accessibilityRole={onPress ? "button" : "image"}
      accessibilityLabel={
        isUnlocked
          ? `${achievement.name} — Unlocked. +${achievement.xpBonus} XP.`
          : `${achievement.name} — Locked. Progress: ${progress} of ${target}.`
      }
      accessibilityState={{ selected: isUnlocked }}
      className="items-center mb-3"
      style={({ pressed }) => [
        { width: styles.tileWidth, opacity: pressed && !!onPress ? 0.7 : 1 },
      ]}
    >
      {/* Badge Image */}
          <View 
            className="items-center justify-center rounded-full border bg-white"
            style={{ 
              width: styles.hex * 0.75, 
              height: styles.hex * 0.75,
              borderColor: isUnlocked ? SAGE[200] : "#E5E7EB",
              backgroundColor: isUnlocked ? "#F4F7F4" : "#F9FAFB",
              shadowColor: isUnlocked ? SAGE[600] : "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: isUnlocked ? 0.04 : 0.02,
              shadowRadius: 4,
              elevation: 1,
            }}
          >
            {isNumberIcon ? (
              <Text
                className="font-bold"
                style={{
                  fontSize: styles.icon,
                  color: isUnlocked ? SAGE[600] : "#4B5563",
                }}
              >
                {achievement.icon}
              </Text>
            ) : (
              <Text
                style={{
                  fontSize: styles.icon,
                  opacity: isUnlocked ? 1 : 0.5,
                }}
              >
                {achievement.icon}
              </Text>
            )}
          </View>

      {/* Badge Name */}
      <Text
        className={`${styles.nameSize} happy-font-body-bold text-center mt-1.5 ${
          isUnlocked ? "text-ink" : "text-gray-600"
        }`}
        numberOfLines={2}
      >
        {achievement.name}
      </Text>

      {/* Description */}
      {showDescription ? (
        <Text
          className="happy-font-body-medium text-[10px] text-ink-muted text-center mt-0.5"
          numberOfLines={2}
        >
          {achievement.description}
        </Text>
      ) : null}

      {/* Progress */}
      {shouldShowProgress && (
        <View className="w-full mt-2">
          {showProgressBar ? (
            <View className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <View
                className="h-full rounded-full"
                style={{
                  width: `${progressPercent}%`,
                  backgroundColor: achievement.color,
                }}
              />
            </View>
          ) : null}
          {showProgressText ? (
            <Text
              className={`happy-font-body-semibold text-[11px] text-center ${
                showProgressBar ? "mt-0.5" : ""
              } ${isUnlocked ? "text-sage-600" : "text-gray-600"}`}
            >
              {displayedProgress}/{target}
            </Text>
          ) : null}
        </View>
      )}
    </Pressable>
  );
};

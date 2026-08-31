import React from "react";
import { View, Text, Pressable, Image } from "react-native";
import type { Achievement } from "@/src/types/achievements";
// FIX #28: Removed unused Svg and Polygon imports (dead code)
import { SEMANTIC_COLORS } from "@/src/theme/colors";
import { RADIUS } from "@/src/theme/radius";
import { HugeiconsIcon } from "@hugeicons/react-native";

// Helper to tint achievement colors for badge backgrounds
const hexToRgba = (hex: string, alpha: number): string => {
  const sanitized = hex.replace("#", "");
  const r = parseInt(sanitized.substring(0, 2), 16);
  const g = parseInt(sanitized.substring(2, 4), 16);
  const b = parseInt(sanitized.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};
import { 
  Medal01Icon,
  NoteIcon,
  Fire02Icon,
  TaskDone01Icon,
  StarsIcon,
  BarChartIcon
} from "@hugeicons/core-free-icons";
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

const getOpacity = (isUnlocked: boolean) => (isUnlocked ? 1 : 0.5);
const getBorderColor = (isUnlocked: boolean, color: string) => (isUnlocked ? hexToRgba(color, 0.4) : "#E5E7EB");
const getBgColor = (isUnlocked: boolean, color: string) => (isUnlocked ? hexToRgba(color, 0.1) : "#F9FAFB");
const getShadowColor = (isUnlocked: boolean, color: string) => (isUnlocked ? color : "#000");
const getShadowOpacity = (isUnlocked: boolean) => (isUnlocked ? 0.04 : 0.02);
const getIconColor = (isUnlocked: boolean, color: string) => (isUnlocked ? color : "#9CA3AF");
const getTextColor = (isUnlocked: boolean) => (isUnlocked ? "text-ink" : "text-gray-600");
const getProgressColor = (isUnlocked: boolean, color: string) => (isUnlocked ? color : "#9CA3AF");
const getRole = (onPress: any) => (onPress ? "button" : "image");

const isInteractivePressed = (pressed: boolean, onPress: any) => {
  if (!pressed) return false;
  return !!onPress;
};

const getWidth = (width: number, pressed: boolean, onPress: any) => {
  if (isInteractivePressed(pressed, onPress)) return { width, opacity: 0.7 };
  return { width, opacity: 1 };
};

const getAriaLabel = (isUnlocked: boolean, name: string, xp: number, p: number, t: number) => {
  if (isUnlocked) return `${name} · Unlocked. +${xp} XP.`;
  return `${name} · Locked. Progress: ${p} of ${t}.`;
};

const getProgressPercent = (target: number, progress: number) => (target > 0 ? (progress / target) * 100 : 0);
const getDisplayedProgress = (isUnlocked: boolean, target: number, progress: number) => (isUnlocked ? target : progress);

const getCategoryIcon = (category: string) => {
  const categoryIcons: Record<string, any> = {
    journaling: NoteIcon,
    streaks: Fire02Icon,
    habits: TaskDone01Icon,
    wellness: StarsIcon,
    tracking: BarChartIcon,
  };
  return categoryIcons[category] || Medal01Icon;
};

const isBarNeeded = (p2: boolean, p3: boolean) => {
  if (p2) return true;
  return p3;
};

const checkBars = (p1: boolean, p2: boolean, p3: boolean) => {
  if (!p1) return false;
  return isBarNeeded(p2, p3);
};

const checkProgressConditions = (p4: boolean, p5: boolean) => {
  if (!p4) return true;
  return p5;
};

const getShouldShowProgress = (p1: boolean, p2: boolean, p3: boolean, p4: boolean, p5: boolean) => {
  if (!checkBars(p1, p2, p3)) return false;
  return checkProgressConditions(p4, p5);
};

const BadgeImageAsset = ({ asset, sizeStyles, isUnlocked }: any) => (
  <View style={{ opacity: getOpacity(isUnlocked) }}>
    <Image source={asset.unlocked} style={{ width: sizeStyles.hex, height: sizeStyles.hex }} resizeMode="contain" />
  </View>
);

const BadgeIcon = ({ achievement, sizeStyles, isUnlocked }: any) => {
  const isNumberIcon = !isNaN(Number(achievement.icon));
  if (isNumberIcon) {
    return <HugeiconsIcon icon={getCategoryIcon(achievement.category)} size={sizeStyles.icon} color={getIconColor(isUnlocked, achievement.color)} />;
  }
  return <Text style={{ fontSize: sizeStyles.icon, opacity: getOpacity(isUnlocked) }}>{achievement.icon}</Text>;
};

const BadgePlaceholder = ({ achievement, sizeStyles, isUnlocked }: any) => (
  <View 
    className="items-center justify-center rounded-full border bg-white"
    style={{ 
      width: sizeStyles.hex * 0.75, 
      height: sizeStyles.hex * 0.75,
      borderColor: getBorderColor(isUnlocked, achievement.color),
      backgroundColor: getBgColor(isUnlocked, achievement.color),
      shadowColor: getShadowColor(isUnlocked, achievement.color),
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: getShadowOpacity(isUnlocked),
      shadowRadius: 4,
      elevation: 1,
    }}
  >
    <BadgeIcon achievement={achievement} sizeStyles={sizeStyles} isUnlocked={isUnlocked} />
  </View>
);

const BadgeImage = ({ achievement, sizeStyles, isUnlocked }: any) => {
  if (achievement.imageAsset) return <BadgeImageAsset asset={achievement.imageAsset} sizeStyles={sizeStyles} isUnlocked={isUnlocked} />;
  return <BadgePlaceholder achievement={achievement} sizeStyles={sizeStyles} isUnlocked={isUnlocked} />;
};

const BadgeDescription = ({ achievement, showDescription }: any) => {
  if (!showDescription) return null;
  return (
    <Text className="happy-font-body-medium text-[10px] text-ink-muted text-center mt-0.5" numberOfLines={2}>
      {achievement.description}
    </Text>
  );
};

const BadgeProgressBar = ({ showProgressBar, progressPercent, color }: any) => {
  if (!showProgressBar) return null;
  return (
    <View className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
      <View className="h-full rounded-full" style={{ width: `${progressPercent}%`, backgroundColor: color }} />
    </View>
  );
};

const getMarginClass = (showProgressBar: boolean) => {
  if (showProgressBar) return "mt-0.5";
  return "";
};

const BadgeProgressText = ({ showProgressText, showProgressBar, displayedProgress, target, color }: any) => {
  if (!showProgressText) return null;
  return (
    <Text className={`happy-font-body-semibold text-[11px] text-center ${getMarginClass(showProgressBar)}`} style={{ color }}>
      {displayedProgress}/{target}
    </Text>
  );
};

const BadgeProgress = ({ config, progressPercent, displayedProgress, target }: any) => {
  const shouldShow = getShouldShowProgress(
    config.showProgress,
    config.showProgressBar,
    config.showProgressText,
    config.isUnlocked,
    config.showUnlockedProgress
  );
  if (!shouldShow) return null;
  return (
    <View className="w-full mt-2">
      <BadgeProgressBar showProgressBar={config.showProgressBar} progressPercent={progressPercent} color={config.achievement.color} />
      <BadgeProgressText showProgressText={config.showProgressText} showProgressBar={config.showProgressBar} displayedProgress={displayedProgress} target={target} color={getProgressColor(config.isUnlocked, config.achievement.color)} />
    </View>
  );
};

const defaultBadgeConfig = {
  currentProgress: 0,
  size: "lg",
  showProgress: true,
  showDescription: true,
  showProgressBar: true,
  showProgressText: true,
  showUnlockedProgress: false,
};

export const AchievementBadge: React.FC<AchievementBadgeProps> = (props) => {
  const config = { ...defaultBadgeConfig, ...props } as any;

  const sizeStyles: Record<string, any> = {
    sm: { hex: 60, icon: 18, nameSize: "text-xs", tileWidth: 88 },
    md: { hex: 80, icon: 24, nameSize: "text-xs", tileWidth: 104 },
    lg: { hex: 100, icon: 32, nameSize: "text-sm", tileWidth: 128 },
  };

  const styles = sizeStyles[config.size];
  const target = config.achievement.condition.target;
  const progress = Math.max(0, Math.min(config.currentProgress, target));
  const progressPercent = getProgressPercent(target, progress);
  const displayedProgress = getDisplayedProgress(config.isUnlocked, target, progress);

  return (
    <Pressable
      onPress={config.onPress}
      accessibilityRole={getRole(config.onPress)}
      accessibilityLabel={getAriaLabel(config.isUnlocked, config.achievement.name, config.achievement.xpBonus, progress, target)}
      accessibilityState={{ selected: config.isUnlocked }}
      className="items-center mb-3"
      style={({ pressed }) => [getWidth(styles.tileWidth, pressed, config.onPress)]}
    >
      <BadgeImage achievement={config.achievement} sizeStyles={styles} isUnlocked={config.isUnlocked} />
      <Text className={`${styles.nameSize} happy-font-body-bold text-center mt-1.5 ${getTextColor(config.isUnlocked)}`} numberOfLines={2}>
        {config.achievement.name}
      </Text>
      <BadgeDescription achievement={config.achievement} showDescription={config.showDescription} />
      <BadgeProgress config={config} progressPercent={progressPercent} displayedProgress={displayedProgress} target={target} />
    </Pressable>
  );
};

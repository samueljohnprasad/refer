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
  BarChartIcon,
  LockIcon,
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

// ponytail: 3-tier state model (locked 0.35, in-progress 0.65, unlocked 1.0) & compact keyhole per audit
const getOpacity = (isUnlocked: boolean, progress = 0) => {
  if (isUnlocked) return 1;
  if (progress > 0) return 0.65;
  return 0.35;
};
const getBorderColor = (isUnlocked: boolean, color: string) => (isUnlocked ? hexToRgba(color, 0.4) : "#E5E7EB");
const getBgColor = (isUnlocked: boolean, color: string) => (isUnlocked ? hexToRgba(color, 0.1) : "#F3F5F0");
const getShadowColor = (isUnlocked: boolean, color: string) => (isUnlocked ? color : "#000");
const getShadowOpacity = (isUnlocked: boolean) => (isUnlocked ? 0.04 : 0.02);
const getIconColor = (isUnlocked: boolean, color: string) => (isUnlocked ? color : "#8E8E93");
const getTextColor = (isUnlocked: boolean) => (isUnlocked ? "text-ink" : "text-[#3A3A3C]");
const getProgressColor = (isUnlocked: boolean, progress = 0) => {
  if (isUnlocked) return SEMANTIC_COLORS.brand.primary;
  if (progress > 0) return SEMANTIC_COLORS.brand.pressed;
  return "#636366";
};
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
  if (p > 0) return `${name} · In progress. ${p} of ${t}.`;
  return `${name} · Locked. ${p} of ${t}.`;
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

const BadgeImageAsset = ({ asset, sizeStyles, isUnlocked, progress }: any) => (
  <View
    className="items-center justify-center relative"
    style={{ width: sizeStyles.hex, height: sizeStyles.hex }}
  >
    <Image
      source={asset.unlocked}
      style={{
        width: sizeStyles.hex,
        height: sizeStyles.hex,
        opacity: getOpacity(isUnlocked, progress),
      }}
      resizeMode="contain"
    />
    {!isUnlocked && (
      <View
        className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white items-center justify-center shadow-sm"
        style={{ elevation: 2 }}
      >
        <HugeiconsIcon icon={LockIcon} size={11} color="#3A3A3C" strokeWidth={2} />
      </View>
    )}
  </View>
);

const BadgeIcon = ({ achievement, sizeStyles, isUnlocked, progress }: any) => {
  const isNumberIcon = !isNaN(Number(achievement.icon));
  if (isNumberIcon) {
    return <HugeiconsIcon icon={getCategoryIcon(achievement.category)} size={sizeStyles.icon} color={getIconColor(isUnlocked, achievement.color)} />;
  }
  return <Text style={{ fontSize: sizeStyles.icon, opacity: getOpacity(isUnlocked, progress) }}>{achievement.icon}</Text>;
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

const BadgeImage = ({ achievement, sizeStyles, isUnlocked, progress }: any) => {
  if (achievement.imageAsset) {
    return (
      <BadgeImageAsset
        asset={achievement.imageAsset}
        sizeStyles={sizeStyles}
        isUnlocked={isUnlocked}
        progress={progress}
      />
    );
  }
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
    <Text className={`happy-font-body-medium text-[12px] text-center ${getMarginClass(showProgressBar)}`} style={{ color }}>
      {displayedProgress}/{target}
    </Text>
  );
};

const BadgeProgress = ({ config, progressPercent, displayedProgress, target, progress }: any) => {
  const shouldShow = getShouldShowProgress(
    config.showProgress,
    config.showProgressBar,
    config.showProgressText,
    config.isUnlocked,
    config.showUnlockedProgress
  );
  if (!shouldShow) return null;
  return (
    <View className="w-full mt-1.5">
      <BadgeProgressBar showProgressBar={config.showProgressBar} progressPercent={progressPercent} color={config.achievement.color} />
      <BadgeProgressText
        showProgressText={config.showProgressText}
        showProgressBar={config.showProgressBar}
        displayedProgress={displayedProgress}
        target={target}
        color={getProgressColor(config.isUnlocked, progress)}
      />
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
    sm: { hex: 60, icon: 18, nameSize: "text-[11px]", tileWidth: 88 },
    md: { hex: 78, icon: 24, nameSize: "text-[12px]", tileWidth: 104 },
    lg: { hex: 96, icon: 32, nameSize: "text-[13px]", tileWidth: 128 },
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
      className="items-center mb-1.5 w-full"
      style={({ pressed }) => [getWidth(styles.tileWidth, pressed, config.onPress)]}
    >
      <BadgeImage achievement={config.achievement} sizeStyles={styles} isUnlocked={config.isUnlocked} progress={progress} />
      <Text className={`${styles.nameSize} happy-font-body-semibold text-center mt-1 leading-[15px] min-h-[30px] px-0.5 ${getTextColor(config.isUnlocked)}`} numberOfLines={2}>
        {config.achievement.name}
      </Text>
      <BadgeDescription achievement={config.achievement} showDescription={config.showDescription} />
      <BadgeProgress config={config} progressPercent={progressPercent} displayedProgress={displayedProgress} target={target} progress={progress} />
    </Pressable>
  );
};

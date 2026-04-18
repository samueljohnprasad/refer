import React, { useCallback, useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { HugeiconsIcon } from "@hugeicons/react-native";
import {
  ArrowLeft02Icon,
  Medal01Icon,
  StarsIcon,
  Fire02Icon,
  NoteIcon,
  TaskDone01Icon,
  BarChartIcon,
  CheckmarkCircle02Icon,
} from "@hugeicons/core-free-icons";
import { SafeAreaView } from "@/components/ui/safe-area-view";
import { router } from "expo-router";
import { useAchievements } from "@/hooks/data/useAchievements";
import { AchievementBadge } from "@/src/components/Achievements";
import {
  AchievementCategory,
  ACHIEVEMENTS,
  BADGE_COLORS,
} from "@/src/types/achievements";
import { useXP } from "@/src/context/XPContext";
import { XPDisplay } from "@/src/components/XP";
import { useRewardsContext } from "@/src/context/RewardsContext";
import { CoinsBadge } from "@/src/components/Rewards";
import { Mascot } from "@/src/components/ui/Mascot";

// ─── Utility ────────────────────────────────────────────────────────────────
/** Convert a 6-digit hex color to rgba() for safe cross-platform tinting. */
const hexToRgba = (hex: string, alpha: number): string => {
  const sanitized = hex.replace("#", "");
  const r = parseInt(sanitized.substring(0, 2), 16);
  const g = parseInt(sanitized.substring(2, 4), 16);
  const b = parseInt(sanitized.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

// ─── Category config ─────────────────────────────────────────────────────────
const CATEGORY_CONFIG: Record<
  AchievementCategory,
  { label: string; icon: any; color: string; bg: string }
> = {
  journaling: {
    label: "Journaling",
    icon: NoteIcon,
    color: BADGE_COLORS.journaling,
    bg: hexToRgba(BADGE_COLORS.journaling, 0.12),
  },
  streaks: {
    label: "Streaks",
    icon: Fire02Icon,
    color: BADGE_COLORS.streaks,
    bg: hexToRgba(BADGE_COLORS.streaks, 0.12),
  },
  habits: {
    label: "Habits",
    icon: TaskDone01Icon,
    color: BADGE_COLORS.habits,
    bg: hexToRgba(BADGE_COLORS.habits, 0.12),
  },
  wellness: {
    label: "Wellness",
    icon: StarsIcon,
    color: BADGE_COLORS.wellness,
    bg: hexToRgba(BADGE_COLORS.wellness, 0.12),
  },
  tracking: {
    label: "Tracking",
    icon: BarChartIcon,
    color: BADGE_COLORS.tracking,
    bg: hexToRgba(BADGE_COLORS.tracking, 0.12),
  },
};

// ─── Sub-components ───────────────────────────────────────────────────────────

/** Reusable icon bubble used in stat cards and category headers. */
const IconBubble: React.FC<{
  icon: any;
  color: string;
  bg: string;
  size?: number;
  iconSize?: number;
}> = ({ icon, color, bg, size = 36, iconSize = 18 }) => (
  <View
    className="rounded-xl items-center justify-center"
    style={{ width: size, height: size, backgroundColor: bg }}
  >
    <HugeiconsIcon icon={icon} size={iconSize} color={color} strokeWidth={1.8} />
  </View>
);

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  subtext: string;
  color: string;
  borderColor: string;
  progress?: number;
  accessibilityLabel?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  icon,
  label,
  value,
  subtext,
  color,
  borderColor,
  progress,
  accessibilityLabel,
}) => (
  <View
    className="bg-white rounded-2xl p-4 mb-3"
    accessible={true}
    accessibilityLabel={accessibilityLabel ?? `${label}: ${value}. ${subtext}`}
    style={{
      borderWidth: 1,
      borderColor,
      shadowColor: color,
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.07,
      shadowRadius: 10,
      elevation: 2,
    }}
  >
    <View className="flex-row items-center justify-between mb-1.5">
      <View className="flex-row items-center gap-2.5">
        {icon}
        <Text className="text-gray-900 font-bold text-sm">{label}</Text>
      </View>
      <Text className="text-2xl font-black tracking-tight" style={{ color }}>
        {value}
      </Text>
    </View>
    {/* Subtext indented to align under label text */}
    <Text className="text-gray-400 text-[11px] font-medium mb-2 ml-11">
      {subtext}
    </Text>
    {progress !== undefined && (
      <View>
        <View className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <View
            className="h-full rounded-full"
            style={{
              width: `${Math.min(progress, 100)}%`,
              backgroundColor: color,
            }}
          />
        </View>
        <Text
          className="text-[10px] font-semibold mt-1 text-right"
          style={{ color }}
        >
          {Math.round(Math.min(progress, 100))}%
        </Text>
      </View>
    )}
  </View>
);

/** Shown when the achievements list is empty after loading. */
const EmptyState: React.FC = () => (
  <View className="items-center justify-center px-8 py-12">
    <View
      className="w-16 h-16 rounded-2xl bg-amber-50 items-center justify-center mb-4"
      style={{ borderWidth: 1, borderColor: "#FEF3C7" }}
    >
      <Mascot state="panda-yet-sleep-pillow" size={44} />
    </View>
    <Text className="text-base font-bold text-gray-900 text-center mb-1">
      No badges yet
    </Text>
    <Text className="text-sm text-gray-400 text-center leading-5">
      Start journaling to earn your first badge
    </Text>
  </View>
);

// ─── Screen ───────────────────────────────────────────────────────────────────

export const AchievementsScreen: React.FC = () => {
  const { achievements, isLoading, unlockedAchievements } = useAchievements();
  const { wallet } = useRewardsContext();
  const { totalXP, recentGains, clearRecentGain } = useXP();

  const unlockedCount = unlockedAchievements.length;
  const totalCount = ACHIEVEMENTS.length;

  const totalXPEarned = useMemo(
    () => unlockedAchievements.reduce((sum, a) => sum + a.xpAwarded, 0),
    [unlockedAchievements],
  );

  const getAchievementsByCategory = useCallback(
    (category: AchievementCategory) =>
      achievements.filter((a) => a.achievement.category === category),
    [achievements],
  );

  const overallProgress = useMemo(
    () => (totalCount > 0 ? (unlockedCount / totalCount) * 100 : 0),
    [unlockedCount, totalCount],
  );

  const masteredCategoryCount = useMemo(
    () =>
      Object.keys(CATEGORY_CONFIG).filter((cat) =>
        getAchievementsByCategory(cat as AchievementCategory).every(
          (a) => a.isUnlocked,
        ),
      ).length,
    [getAchievementsByCategory],
  );

  const hasAchievements = achievements.length > 0;

  // ── Loading ──
  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-offwhite items-center justify-center">
        <View
          className="w-16 h-16 rounded-2xl bg-amber-50 items-center justify-center mb-4"
          style={{ borderWidth: 1, borderColor: "#FEF3C7" }}
        >
          <HugeiconsIcon icon={Medal01Icon} size={32} color="#F59E0B" />
        </View>
        <ActivityIndicator size="large" color="#F59E0B" />
        <Text className="text-gray-500 mt-3 text-sm font-medium">
          Loading achievements...
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-offwhite">
      {/* ── Header ── */}
      <View className="flex-row items-center px-4 pt-2 pb-3">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-9 h-9 rounded-xl items-center justify-center mr-3"
          style={{ backgroundColor: "rgba(0,0,0,0.04)" }}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <HugeiconsIcon
            icon={ArrowLeft02Icon}
            size={20}
            color="#374151"
            strokeWidth={2}
          />
        </TouchableOpacity>
        <View className="flex-1 flex-row items-center gap-2.5">
          <Mascot state="panda-super-excite" size={32} />
          <View>
            <Text className="text-xl font-bold text-gray-900 leading-tight">
              Achievements
            </Text>
            <Text className="text-xs text-gray-400 font-medium">
              Your earned badges
            </Text>
          </View>
        </View>

        <View className="flex-row items-center gap-2">
          <XPDisplay 
            totalXP={totalXP} 
            recentGains={recentGains}
            onClearGain={clearRecentGain}
            compact={true} 
            onPress={() => router.push("/tabs/screens/xp-history")}
          />
          <TouchableOpacity
            onPress={() => router.push("/tabs/screens/rewards-shop")}
            activeOpacity={0.7}
            className="items-center justify-center p-1"
          >
            <CoinsBadge coins={wallet?.coins ?? 0} size="sm" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 48 }}
        accessibilityLabel="Achievements scroll view"
      >
        {/* ── Your Progress ── */}
        <View className="px-4 pt-3 pb-2">
          <Text className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.12em] mb-3">
            Your Progress
          </Text>

          <StatCard
            icon={
              <IconBubble icon={Medal01Icon} color="#7B61FF" bg="rgba(123,97,255,0.09)" />
            }
            label="Badges Unlocked"
            value={String(unlockedCount)}
            subtext={`${unlockedCount} of ${totalCount} badges collected`}
            color="#7B61FF"
            borderColor="#EDE9FF"
            progress={overallProgress}
            accessibilityLabel={`Badges unlocked: ${unlockedCount} of ${totalCount}. ${Math.round(overallProgress)}% complete.`}
          />

          <StatCard
            icon={
              <IconBubble icon={StarsIcon} color="#F59E0B" bg="rgba(245,158,11,0.09)" />
            }
            label="XP from Badges"
            value={`${totalXPEarned}`}
            subtext="XP earned from all unlocked badges"
            color="#F59E0B"
            borderColor="#FEF3C7"
            accessibilityLabel={`XP earned from badges: ${totalXPEarned} points`}
          />

          <StatCard
            icon={
              <IconBubble
                icon={CheckmarkCircle02Icon}
                color="#6366F1"
                bg="rgba(99,102,241,0.09)"
              />
            }
            label="Categories Mastered"
            value={`${masteredCategoryCount}/5`}
            subtext="Complete all badges in a category"
            color="#6366F1"
            borderColor="#E0E7FF"
            accessibilityLabel={`Categories mastered: ${masteredCategoryCount} of 5`}
          />
        </View>

        {/* ── All Badges ── */}
        <View className="px-4 mt-4 mb-3">
          <Text className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.12em]">
            All Badges
          </Text>
        </View>

        {/* Empty state */}
        {!hasAchievements && <EmptyState />}

        {/* Achievement Categories */}
        {(Object.keys(CATEGORY_CONFIG) as AchievementCategory[]).map(
          (category) => {
            const categoryAchievements = getAchievementsByCategory(category);
            if (categoryAchievements.length === 0) return null;

            const { label, icon: categoryIcon, color, bg } =
              CATEGORY_CONFIG[category];
            const categoryUnlocked = categoryAchievements.filter(
              (a) => a.isUnlocked,
            ).length;
            const allComplete = categoryUnlocked === categoryAchievements.length;
            const categoryProgress =
              (categoryUnlocked / categoryAchievements.length) * 100;

            return (
              <View key={category} className="mb-6 px-4">
                {/* Category Header — icon, name, count badge */}
                <View className="flex-row items-center justify-between mb-2.5">
                  <View className="flex-row items-center gap-2.5 flex-1">
                    {/* Reuse unified IconBubble */}
                    <IconBubble
                      icon={categoryIcon}
                      color={color}
                      bg={bg}
                    />
                    <Text className="text-[15px] font-semibold text-gray-900">
                      {label}
                    </Text>
                  </View>

                  {/* Count badge uses category tint */}
                  <View
                    className="px-2.5 py-1 rounded-full"
                    style={{ backgroundColor: bg }}
                  >
                    <Text className="text-[11px] font-bold" style={{ color }}>
                      {categoryUnlocked}/{categoryAchievements.length}
                    </Text>
                  </View>
                </View>

                {/* Thin category progress bar */}
                <View className="h-1 bg-gray-100 rounded-full overflow-hidden mb-3">
                  <View
                    className="h-full rounded-full"
                    style={{
                      width: `${categoryProgress}%`,
                      backgroundColor: color,
                    }}
                  />
                </View>

                {/* Badge Grid card */}
                <View
                  className="bg-white rounded-2xl border border-gray-100/80"
                  style={{
                    shadowColor: color,
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.04,
                    shadowRadius: 8,
                    elevation: 1,
                  }}
                >
                  <View className="flex-row flex-wrap p-2">
                    {categoryAchievements.map((item) => (
                      <View
                        key={item.achievement.id}
                        style={{ width: "33.33%", padding: 2 }}
                      >
                        <AchievementBadge
                          achievement={item.achievement}
                          isUnlocked={item.isUnlocked}
                          currentProgress={item.currentProgress}
                          size="md"
                          showProgress={!item.isUnlocked}
                        />
                      </View>
                    ))}
                  </View>

                  {/* Category completion footer strip — only when fully mastered */}
                  {allComplete && (
                    <View
                      className="rounded-b-2xl px-4 py-2.5 flex-row items-center justify-center gap-2"
                      style={{ backgroundColor: bg }}
                    >
                      <HugeiconsIcon
                        icon={CheckmarkCircle02Icon}
                        size={14}
                        color={color}
                        strokeWidth={2}
                      />
                      <Text
                        className="text-xs font-bold text-center"
                        style={{ color }}
                      >
                        Category complete!
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            );
          },
        )}

        {/* Motivational footer */}
        {hasAchievements && unlockedCount < totalCount && (
          <View className="px-4 items-center">
            <Text className="text-gray-400 text-xs font-medium text-center">
              {totalCount - unlockedCount} badge
              {totalCount - unlockedCount !== 1 ? "s" : ""} away from a full
              collection ✨
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default AchievementsScreen;

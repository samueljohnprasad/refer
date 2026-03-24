import React, { useCallback, useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
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

// FIX #1: Added explicit TypeScript type annotation for CATEGORY_CONFIG value
// FIX #2: Added Yoga01Icon import was unused — removed it. Added CheckmarkCircle02Icon for completion indicator
const CATEGORY_CONFIG: Record<
  AchievementCategory,
  { label: string; icon: any; color: string; bg: string }
> = {
  journaling: {
    label: "Journaling",
    icon: NoteIcon,
    color: BADGE_COLORS.journaling,
    bg: BADGE_COLORS.journaling + "18",
  },
  streaks: {
    label: "Streaks",
    icon: Fire02Icon,
    color: BADGE_COLORS.streaks,
    bg: BADGE_COLORS.streaks + "18",
  },
  habits: {
    label: "Habits",
    icon: TaskDone01Icon,
    color: BADGE_COLORS.habits,
    bg: BADGE_COLORS.habits + "18",
  },
  wellness: {
    label: "Wellness",
    icon: StarsIcon,
    color: BADGE_COLORS.wellness,
    bg: BADGE_COLORS.wellness + "18",
  },
  tracking: {
    label: "Tracking",
    icon: BarChartIcon,
    color: BADGE_COLORS.tracking,
    bg: BADGE_COLORS.tracking + "18",
  },
};

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  subtext: string;
  color: string;
  borderColor: string;
  progress?: number;
  // FIX #3: Added accessibilityLabel for screen reader support
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
    className="bg-white rounded-2xl p-4 mb-2"
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
        {/* FIX #4: text-gray-900 instead of text-gray-800 — stronger label contrast */}
        <Text className="text-gray-900 font-bold text-sm">{label}</Text>
      </View>
      {/* FIX #5: font-black instead of font-extrabold — stronger numeric emphasis */}
      <Text className="text-2xl font-black tracking-tight" style={{ color }}>
        {value}
      </Text>
    </View>
    {/* FIX #6: Subtext is indented to align under the label text, not the icon */}
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
        {/* FIX #7: Show percentage below progress bar for clear status */}
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

// FIX #8: Extracted StatCard icon bubble as a reusable sub-component (DRY principle)
const StatIconBubble: React.FC<{
  icon: any;
  color: string;
  bg: string;
}> = ({ icon, color, bg }) => (
  <View
    className="w-9 h-9 rounded-xl items-center justify-center"
    style={{ backgroundColor: bg }}
  >
    <HugeiconsIcon icon={icon} size={18} color={color} strokeWidth={1.8} />
  </View>
);

export const AchievementsScreen: React.FC = () => {
  const { achievements, isLoading, unlockedAchievements } = useAchievements();

  const unlockedCount = unlockedAchievements.length;
  const totalCount = ACHIEVEMENTS.length;

  // FIX #9: Memoize expensive reduce calculation
  const totalXPEarned = useMemo(
    () => unlockedAchievements.reduce((sum, a) => sum + a.xpAwarded, 0),
    [unlockedAchievements],
  );

  // FIX #10: Memoize helper to prevent recreation on every render
  const getAchievementsByCategory = useCallback(
    (category: AchievementCategory) =>
      achievements.filter((a) => a.achievement.category === category),
    [achievements],
  );

  // FIX #11: Memoize overall progress percentage
  const overallProgress = useMemo(
    () => (totalCount > 0 ? (unlockedCount / totalCount) * 100 : 0),
    [unlockedCount, totalCount],
  );

  // FIX #12: Memoize mastered categories count
  const masteredCategoryCount = useMemo(
    () =>
      Object.keys(CATEGORY_CONFIG).filter((cat) =>
        getAchievementsByCategory(cat as AchievementCategory).every(
          (a) => a.isUnlocked,
        ),
      ).length,
    [getAchievementsByCategory],
  );

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-offwhite items-center justify-center">
        {/* FIX #13: Loading state now has a descriptive title above the spinner */}
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
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        // FIX #14: removed paddingHorizontal from contentContainerStyle — handled per-section
        contentContainerStyle={{ paddingBottom: 48 }}
      >
        {/* ── Your Progress ── */}
        <View className="px-4 pt-5 pb-2">
          {/* FIX #15: Section label uses consistent OVERLINE style with Letter Spacing */}
          <Text className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.12em] mb-3">
            Your Progress
          </Text>

          <StatCard
            icon={
              <StatIconBubble
                icon={Medal01Icon}
                color="#7B61FF"
                bg="#7B61FF18"
              />
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
              <StatIconBubble icon={StarsIcon} color="#F59E0B" bg="#F59E0B18" />
            }
            label="XP from Badges"
            value={`${totalXPEarned}`}
            subtext="XP earned from all unlocked badges"
            color="#F59E0B"
            borderColor="#FEF3C7"
            accessibilityLabel={`XP earned from badges: ${totalXPEarned} points`}
          />

          {/* FIX #16: No longer wrapped in an extra View — mb handled by StatCard itself */}
          <StatCard
            icon={
              <StatIconBubble
                icon={Fire02Icon}
                color="#6366F1"
                bg="#6366F118"
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
          {/* FIX #17: "All Badges" section label uses identical overline style */}
          <Text className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.12em]">
            All Badges
          </Text>
        </View>

        {/* FIX #18: Achievement Categories rendered without px-4 on parent — badge grid full-bleed within card */}
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

            // FIX #19: Calculate category-level progress percentage
            const categoryProgress =
              (categoryUnlocked / categoryAchievements.length) * 100;

            return (
              <View key={category} className="mb-5 px-4">
                {/* Category Header */}
                <View className="flex-row items-center justify-between mb-2.5">
                  <View className="flex-row items-center gap-2.5 flex-1">
                    {/* FIX #20: Icon bubble uses rounded-xl — consistent with StatCard icons */}
                    <View
                      className="w-9 h-9 rounded-xl items-center justify-center"
                      style={{ backgroundColor: bg }}
                    >
                      <HugeiconsIcon
                        icon={categoryIcon}
                        size={18}
                        color={color}
                        strokeWidth={1.8}
                      />
                    </View>
                    <Text className="text-base font-bold text-gray-900">
                      {label}
                    </Text>
                    {/* FIX #21: ✓ Complete badge now uses a HugeIcon, not a raw character */}
                    {allComplete && (
                      <View
                        className="flex-row items-center gap-1 px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: bg }}
                      >
                        <HugeiconsIcon
                          icon={CheckmarkCircle02Icon}
                          size={10}
                          color={color}
                          strokeWidth={2}
                        />
                        <Text
                          className="text-[10px] font-bold"
                          style={{ color }}
                        >
                          Done
                        </Text>
                      </View>
                    )}
                  </View>

                  {/* FIX #22: Count badge uses the category color tint, not generic gray */}
                  <View
                    className="px-2.5 py-1 rounded-full"
                    style={{ backgroundColor: bg }}
                  >
                    <Text className="text-[11px] font-bold" style={{ color }}>
                      {categoryUnlocked}/{categoryAchievements.length}
                    </Text>
                  </View>
                </View>

                {/* FIX #23: Added a thin category-level progress bar before the badge grid */}
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
                  {/* FIX #24: badge grid card shadow now uses the category color for subtle depth */}
                  {/* FIX #25: p-2 instead of p-3 — reduces wasted space around each badge */}
                  <View className="flex-row flex-wrap p-2">
                    {categoryAchievements.map((item) => (
                      <View key={item.achievement.id} style={{ width: "33%" }}>
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
                  {/* FIX #26: Category completion footer strip inside the card */}
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

        {/* FIX #27: Motivational footer text when there are locked badges */}
        {unlockedCount < totalCount && (
          <View className="px-4 items-center">
            <Text className="text-gray-400 text-xs font-medium text-center">
              {totalCount - unlockedCount} more badge
              {totalCount - unlockedCount !== 1 ? "s" : ""} to unlock. Keep
              going! 🎯
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default AchievementsScreen;

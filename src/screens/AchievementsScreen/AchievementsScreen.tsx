import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Pressable,
  StyleSheet,
} from "react-native";
import { HugeiconsIcon } from "@hugeicons/react-native";
import {
  ArrowLeft02Icon,
  ArrowRight02Icon,
  Medal01Icon,
  StarsIcon,
  Fire02Icon,
  NoteIcon,
  TaskDone01Icon,
  BarChartIcon,
  CheckmarkCircle02Icon,
  Coins01Icon,
} from "@hugeicons/core-free-icons";
import { SafeAreaView } from "@/components/ui/safe-area-view";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useAchievements } from "@/hooks/data/useAchievements";
import { AchievementCategory, ACHIEVEMENTS } from "@/src/types/achievements";
import { useXP } from "@/src/context/XPContext";
import { useRewardsContext } from "@/src/context/RewardsContext";
import { AchievementBadge } from "@/src/components/Achievements";
import { Mascot } from "@/src/components/ui/Mascot";
import { RewardsOwnedProgress } from "@/src/components/Rewards";
import { AchievementBadgeDetailSheet } from "./components/AchievementBadgeDetailSheet";
import { AchievementProgressItem } from "./components/AchievementBadgeDetailSheet";
import { AchievementsSkeleton } from "./components/AchievementsSkeleton";
import { GOLD, SAGE, TERRACOTTA } from "@/lib/tokens";
import * as Haptics from "expo-haptics";
import { Card } from "@/src/components/ui/Card";
import { Stack } from "expo-router";
import { GlassView } from "expo-glass-effect";
import { Platform } from "react-native";
import { Host, Button } from "@expo/ui/swift-ui";
import {
  buttonStyle,
  tint,
  controlSize,
  labelStyle,
} from "@expo/ui/swift-ui/modifiers";



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
    color: SAGE[500],
    bg: hexToRgba(SAGE[500], 0.12),
  },
  streaks: {
    label: "Streaks",
    icon: Fire02Icon,
    color: TERRACOTTA,
    bg: hexToRgba(TERRACOTTA, 0.12),
  },
  habits: {
    label: "Habits",
    icon: TaskDone01Icon,
    color: SAGE[400],
    bg: hexToRgba(SAGE[400], 0.14),
  },
  wellness: {
    label: "Wellness",
    icon: StarsIcon,
    color: SAGE[600],
    bg: hexToRgba(SAGE[600], 0.1),
  },
  tracking: {
    label: "Tracking",
    icon: BarChartIcon,
    color: GOLD,
    bg: hexToRgba(GOLD, 0.14),
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
    className="happy-brand-soft-chip items-center justify-center"
    style={{ width: size, height: size, backgroundColor: bg }}
  >
    <HugeiconsIcon
      icon={icon}
      size={iconSize}
      color={color}
      strokeWidth={1.8}
    />
  </View>
);

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  subtext: string;
  color: string;
  progressCounts?: {
    current: number;
    total: number;
  };
  accessibilityLabel?: string;
  accessibilityHint?: string;
  onPress?: () => void;
}

const StatCard: React.FC<StatCardProps> = ({
  icon,
  label,
  value,
  subtext,
  color,
  progressCounts,
  accessibilityLabel,
  accessibilityHint,
  onPress,
}) => (
  <Pressable
    onPress={onPress}
    disabled={!onPress}
    className="mb-4"
    accessibilityRole="button"
    accessibilityLabel={accessibilityLabel ?? `${label}: ${value}. ${subtext}`}
    accessibilityHint={accessibilityHint}
  >
    <View className="px-4 py-3 rounded-[16px] bg-brand-surface-soft border border-brand-border">
    <View className="flex-row items-center justify-between mb-1.5">
      <View className="flex-row items-center gap-2.5">
        {icon}
        <Text className="happy-font-body-bold text-sm text-ink">{label}</Text>
      </View>
      <View className="flex-row items-center gap-1">
        <Text
          className="happy-font-heading-bold text-[28px] tracking-tight"
          style={{ color }}
        >
          {value}
        </Text>
        {onPress ? (
          <HugeiconsIcon
            icon={ArrowRight02Icon}
            size={18}
            color={color}
            strokeWidth={2}
          />
        ) : null}
      </View>
    </View>
    <Text className="happy-font-body-medium text-[11px] text-ink-muted mb-2 ml-11">
      {subtext}
    </Text>
    {progressCounts !== undefined && (
      <View>
        <RewardsOwnedProgress
          ownedCount={progressCounts.current}
          totalCount={progressCounts.total}
        />
        <Text
          className="happy-font-body-semibold text-[10px] mt-1 text-right"
          style={{ color }}
        >
          {Math.round(
            progressCounts.total > 0
              ? (progressCounts.current / progressCounts.total) * 100
              : 0,
          )}
          %
        </Text>
      </View>
    )}
  </View>
</Pressable>
);

/** Shown when the achievements list is empty after loading. */
const EmptyState: React.FC = () => (
  <View className="items-center justify-center px-8 py-12">
    <View className="happy-mascot-stage w-20 h-20 rounded-[28px] items-center justify-center mb-4">
      <Mascot state="panda-yet-sleep-pillow" size={52} />
    </View>
    <Text className="happy-font-heading-bold text-lg text-ink text-center mb-1">
      No badges yet
    </Text>
    <Text className="happy-font-body-medium text-sm text-ink-muted text-center leading-5">
      Start journaling to earn your first badge
    </Text>
  </View>
);

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  loadingScreen: {
    alignItems: "center",
    justifyContent: "center",
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 48,
  },
});

// ─── Screen ───────────────────────────────────────────────────────────────────

export const AchievementsScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const { achievements, isLoading, unlockedAchievements } = useAchievements();
  const { wallet } = useRewardsContext();
  const { totalXP } = useXP();
  const scrollViewRef = useRef<ScrollView>(null);
  const allBadgesOffsetY = useRef(0);
  const [selectedAchievement, setSelectedAchievement] =
    useState<AchievementProgressItem | null>(null);

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

  const handleScrollToBadges = useCallback(() => {
    Haptics.selectionAsync();
    scrollViewRef.current?.scrollTo({
      y: Math.max(allBadgesOffsetY.current - 12, 0),
      animated: true,
    });
  }, []);

  const handleXPHistoryPress = useCallback(() => {
    Haptics.selectionAsync();
    router.push("/tabs/screens/xp-history");
  }, []);

  const handleBadgePress = useCallback((item: AchievementProgressItem) => {
    Haptics.selectionAsync();
    setSelectedAchievement(item);
  }, []);

  const handleBadgeSheetPresentationChange = useCallback(
    (isPresented: boolean) => {
      if (!isPresented) {
        setSelectedAchievement(null);
      }
    },
    [],
  );

  const headerElements = (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title: "Achievements",
          headerLargeTitle: true,
          headerShadowVisible: false,
          headerStyle: { backgroundColor: "transparent" },
          headerLargeTitleStyle: { fontFamily: "Outfit-Bold" },
          headerTitleStyle: { fontFamily: "Outfit-Bold" },
        }}
      />
      <Stack.Toolbar placement="left">
        <Stack.Toolbar.Button icon="chevron.backward" onPress={() => router.back()} tintColor={SAGE[600]} />
      </Stack.Toolbar>
      <Stack.Toolbar placement="right">
        <Stack.Toolbar.Button icon="sparkles" onPress={() => router.push("/tabs/screens/xp-history")} tintColor={GOLD} />
      </Stack.Toolbar>
    </>
  );

  // ── Loading ──
  if (isLoading) {
    return (
      <>
        {headerElements}
        <AchievementsSkeleton />
      </>
    );
  }

  return (
    <>
      {headerElements}
      
      <SafeAreaView
        className="happy-brand-screen flex-1"
        style={styles.screen}
        edges={["left", "right"]}
      >
        <ScrollView
          ref={scrollViewRef}
          className="flex-1"
          style={styles.scroll}
          showsVerticalScrollIndicator={false}
          contentInsetAdjustmentBehavior="automatic"
          contentContainerStyle={[styles.scrollContent]}
          accessibilityLabel="Achievements scroll view"
        >
          {/* ── Your Progress ── */}
          <View className="px-4 pt-3 pb-2">
            <Text className="happy-font-heading-bold text-[20px] text-ink mb-4">Your Progress</Text>

            <StatCard
              icon={
                <IconBubble
                  icon={Medal01Icon}
                  color={SAGE[500]}
                  bg={SAGE.pill}
                />
              }
              label="Badges Unlocked"
              value={String(unlockedCount)}
              subtext={`${unlockedCount} of ${totalCount} badges collected`}
              color={SAGE[500]}
              progressCounts={{ current: unlockedCount, total: totalCount }}
              accessibilityLabel={`Badges unlocked: ${unlockedCount} of ${totalCount}. ${Math.round(overallProgress)}% complete.`}
              accessibilityHint="Scrolls to all badge categories."
              onPress={handleScrollToBadges}
            />

            <StatCard
              icon={
                <IconBubble
                  icon={StarsIcon}
                  color="#8B6213"
                  bg="#FDF6E3"
                />
              }
              label="Badge XP"
              value={`${totalXPEarned}`}
              subtext="XP earned from all unlocked badges"
              color="#8B6213"
              accessibilityLabel={`XP earned from badges: ${totalXPEarned} points`}
              accessibilityHint="Opens XP history."
              onPress={handleXPHistoryPress}
            />

            <StatCard
              icon={
                <IconBubble
                  icon={CheckmarkCircle02Icon}
                  color={SAGE[600]}
                  bg={SAGE.selected}
                />
              }
              label="Category Mastery"
              value={`${masteredCategoryCount}/5`}
              subtext="Complete all badges in a category"
              color={SAGE[600]}
              accessibilityLabel={`Categories mastered: ${masteredCategoryCount} of 5`}
              accessibilityHint="Scrolls to all badge categories."
              onPress={handleScrollToBadges}
            />
          </View>

          {/* ── All Badges ── */}
          <View
            className="px-4 mt-4 mb-3"
            onLayout={(event) => {
              allBadgesOffsetY.current = event.nativeEvent.layout.y;
            }}
          >
            <Text className="happy-font-heading-bold text-[20px] text-ink">All Badges</Text>
          </View>

          {/* Empty state */}
          {!hasAchievements && <EmptyState />}

          {/* Achievement Categories */}
          {(Object.keys(CATEGORY_CONFIG) as AchievementCategory[]).map(
            (category) => {
              const categoryAchievements = getAchievementsByCategory(category);
              if (categoryAchievements.length === 0) return null;

              const {
                label,
                icon: categoryIcon,
                color,
                bg,
              } = CATEGORY_CONFIG[category];
              const categoryUnlocked = categoryAchievements.filter(
                (a) => a.isUnlocked,
              ).length;

              return (
                <View key={category} className="mb-6 px-4">
                  <View className="mb-2.5 flex-row items-center justify-between">
                    <View className="min-w-0 flex-1 flex-row items-center gap-3">
                      <IconBubble
                        icon={categoryIcon}
                        color={color}
                        bg={bg}
                        size={46}
                        iconSize={21}
                      />
                      <Text
                        className="happy-font-body-bold text-[17px] text-ink"
                        numberOfLines={1}
                      >
                        {label}
                      </Text>
                    </View>

                    <View
                      className="happy-brand-status-chip rounded-full px-3 py-1.5"
                      style={{ backgroundColor: bg }}
                    >
                      <Text
                        className="happy-font-body-bold text-sm"
                        style={{ color }}
                      >
                        {categoryUnlocked}/{categoryAchievements.length}
                      </Text>
                    </View>
                  </View>

                  <View className="px-2.5 py-3">
                    <View className="flex-row flex-wrap">
                      {categoryAchievements.map((item) => (
                        <View
                          key={item.achievement.id}
                          className="items-center"
                          style={{ width: "33.333%", paddingVertical: 6 }}
                        >
                          <AchievementBadge
                            achievement={item.achievement}
                            currentProgress={item.currentProgress}
                            isUnlocked={item.isUnlocked}
                            onPress={() => handleBadgePress(item)}
                            showDescription={false}
                            showProgressBar={false}
                            showProgressText={true}
                            showUnlockedProgress={true}
                            size="md"
                          />
                        </View>
                      ))}
                    </View>
                  </View>
                </View>
              );
            },
          )}



          {/* Motivational footer */}
          {hasAchievements && unlockedCount < totalCount && (
            <View className="px-4 items-center mt-2">
              <Text className="happy-font-body-medium text-ink-muted text-xs text-center">
                {totalCount - unlockedCount} badge
                {totalCount - unlockedCount !== 1 ? "s" : ""} away from a full
                collection
              </Text>
            </View>
          )}
        </ScrollView>

        <AchievementBadgeDetailSheet
          isPresented={selectedAchievement !== null}
          item={selectedAchievement}
          onIsPresentedChange={handleBadgeSheetPresentationChange}
        />
      </SafeAreaView>
    </>
  );
};

export default AchievementsScreen;

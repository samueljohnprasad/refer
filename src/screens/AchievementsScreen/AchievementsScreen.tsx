import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Pressable,
  StyleSheet,
  Alert,
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
  InformationCircleIcon,
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
import { BADGE_COLORS } from "@/src/types/achievements";

const CATEGORY_CONFIG: Record<
  AchievementCategory,
  { label: string; icon: any; color: string; bg: string }
> = {
  journaling: {
    label: "Journaling",
    icon: NoteIcon,
    color: BADGE_COLORS.journaling,
    bg: hexToRgba(BADGE_COLORS.journaling, 0.15),
  },
  streaks: {
    label: "Streaks",
    icon: Fire02Icon,
    color: BADGE_COLORS.streaks,
    bg: hexToRgba(BADGE_COLORS.streaks, 0.15),
  },
  habits: {
    label: "Habits",
    icon: TaskDone01Icon,
    color: BADGE_COLORS.habits,
    bg: hexToRgba(BADGE_COLORS.habits, 0.15),
  },
  wellness: {
    label: "Wellness",
    icon: StarsIcon,
    color: BADGE_COLORS.wellness,
    bg: hexToRgba(BADGE_COLORS.wellness, 0.15),
  },
  tracking: {
    label: "Tracking",
    icon: BarChartIcon,
    color: BADGE_COLORS.tracking,
    bg: hexToRgba(BADGE_COLORS.tracking, 0.15),
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
    className="mb-1"
    accessibilityRole="button"
    accessibilityLabel={accessibilityLabel ?? `${label}: ${value}. ${subtext}`}
    accessibilityHint={accessibilityHint}
  >
    <View className="px-2 py-3">
      <View className="flex-row items-center justify-between mb-0.5">
        <View className="flex-row items-center gap-3">
          {icon}
          <View>
            <Text className="happy-font-body-bold text-[15px] text-ink">
              {label}
            </Text>
            <Text className="happy-font-body-medium text-xs text-ink-muted mt-0.5">
              {subtext}
            </Text>
          </View>
        </View>
        <View className="flex-row items-center gap-1.5">
          <Text
            className="happy-font-body-bold text-[24px] tracking-tight"
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
      {progressCounts !== undefined && (
        <View className="mt-2 ml-12 pr-1">
          <RewardsOwnedProgress
            ownedCount={progressCounts.current}
            totalCount={progressCounts.total}
          />
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
          headerShadowVisible: false,
          headerStyle: { backgroundColor: "transparent" },
          headerLargeTitleStyle: { fontFamily: "Outfit-Bold" },
          headerTitleStyle: { fontFamily: "Outfit-Bold" },
          headerTintColor: SAGE[600],
          headerBackButtonDisplayMode: "minimal",
          headerLeft: () => null,
        }}
      />
      <Stack.Toolbar placement="left">
        <Stack.Toolbar.Button icon="chevron.left" onPress={() => router.back()} />
      </Stack.Toolbar>
      <Stack.Toolbar placement="right">
        <Stack.Toolbar.Button
          icon="sparkles"
          onPress={() => router.push("/tabs/screens/xp-history")}
          tintColor={GOLD}
        />
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
          <View className="px-5 pt-4 pb-8 items-center">
            {/* Primary Stat */}
            <View className="items-center mb-6">
              <Text className="happy-font-body-bold text-[48px] text-ink tracking-tight">
                {unlockedCount}
              </Text>
              <Text className="happy-font-body-medium text-[15px] text-ink-muted">
                Badges Unlocked
              </Text>
            </View>

            {/* Secondary Stats */}
            <View className="flex-row items-center justify-center gap-6 w-full px-4">
              <TouchableOpacity
                onPress={() => {
                  Haptics.selectionAsync();
                  Alert.alert(
                    "XP Earned",
                    "You earn XP (Experience Points) by completing journaling exercises and unlocking badges. Keep writing to grow!",
                  );
                }}
                className="flex-row items-center gap-2 bg-gray-50 px-4 py-2.5 rounded-2xl flex-1 justify-center"
              >
                <View>
                  <Text
                    className="happy-font-body-bold text-[18px] text-center"
                    style={{ color: "#8B6213" }}
                  >
                    {totalXPEarned}
                  </Text>
                  <View className="flex-row items-center gap-1 mt-0.5">
                    <Text className="happy-font-body-medium text-[12px] text-ink-muted">
                      XP Earned
                    </Text>
                    <HugeiconsIcon
                      icon={InformationCircleIcon}
                      size={12}
                      color="#9CA3AF"
                    />
                  </View>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  Haptics.selectionAsync();
                  Alert.alert(
                    "Mastery",
                    "Mastery shows how many categories you have fully completed. Unlock all badges in a category to master it!",
                  );
                }}
                className="flex-row items-center gap-2 bg-gray-50 px-4 py-2.5 rounded-2xl flex-1 justify-center"
              >
                <View>
                  <Text
                    className="happy-font-body-bold text-[18px] text-center"
                    style={{ color: SAGE[600] }}
                  >
                    {masteredCategoryCount}
                    <Text className="text-[14px] text-ink-muted/50">/5</Text>
                  </Text>
                  <View className="flex-row items-center gap-1 mt-0.5">
                    <Text className="happy-font-body-medium text-[12px] text-ink-muted">
                      Mastery
                    </Text>
                    <HugeiconsIcon
                      icon={InformationCircleIcon}
                      size={12}
                      color="#9CA3AF"
                    />
                  </View>
                </View>
              </TouchableOpacity>
            </View>
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
                        size={40}
                        iconSize={20}
                      />
                      <Text
                        className="happy-font-body-bold text-[17px] text-ink"
                        numberOfLines={1}
                      >
                        {label}
                      </Text>
                    </View>
                  </View>

                  <View className="py-2 mb-4">
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
                            showUnlockedProgress={false}
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

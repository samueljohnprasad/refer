import React, { useEffect, useMemo, useCallback, useState } from "react";
import { ViewStyle } from "react-native";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  interpolate,
  FadeInDown,
  FadeIn,
  useAnimatedProps,
  type AnimatedStyle,
} from "react-native-reanimated";
import { endOfWeek, startOfWeek } from "date-fns";
import { useUserProfile } from "@/hooks/data/useUserProfile";
import WeeklyMoodChart from "@/src/components/WeeklyMoodChart";
import { getNextMilestone } from "@/hooks/data/useStreakCalculation";
import { SafeAreaView } from "@/components/ui/safe-area-view";
import { router } from "expo-router";
import { EmotionLogger } from "@/src/components/EmotionLogger";
import { ChallengesSection } from "@/src/components/Challenges";
import { FeaturedPromptCard } from "@/src/components/FeaturedPromptCard";
import {
  Fire02Icon,
  Settings02Icon,
  Target02Icon,
  Medal01Icon,
  Plant03Icon,
  ArrowRight01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { useRevenueCat } from "@/src/context/RevenueCatProvider";
import { LinearGradient } from "expo-linear-gradient";
import { usePostHog } from "posthog-react-native";
import { UpdateModal } from "@/src/components/modals";
import { useAppUpdate } from "@/src/hooks/useAppUpdate";
import { StreakDisplay } from "@/src/components/Streak";
import { useStreakTracker } from "@/hooks/data/useStreakTracker";
import { useJournalLimit } from "@/hooks/useJournalLimit";
import { XPBadge, XPDisplay } from "@/src/components/XP";
import { useXP } from "@/src/context/XPContext";
import { CoinsBadge } from "@/src/components/Rewards";
import { useRewardsContext } from "@/src/context/RewardsContext";


import {
  QuickJournalSection,
  QuickJournalPrompt,
} from "../DiscoveryScreen/QuickJournalSection";
import { recorderOpenAtom } from "../DiscoveryScreen/helpers";
import { startRecordingAtom } from "../DailyNotesScreen/atoms";
import { useAtom, useSetAtom } from "jotai";
import { useJournalEntry } from "@/hooks/useJournalEntry";
import { XP_REWARDS, XPActionType } from "@/src/types/xp";

// Apple Human Interface Guidelines - Subtle Shadow System
export const SHADOW_SUBTLE = {
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.04,
  shadowRadius: 12,
  elevation: 3,
} as const;

// Global color palette - Refined for Semantic Harmony
export const PALETTE = {
  purple: "#7B61FF",
  lightPurple: "#DCD6FF",
  yellow: "#FFD24A",
  lightYellow: "#FFF2CC",
  blue: "#60A6FF",
  lightBlue: "#DFF0FF",
  pink: "#FFDFE8",
  white: "#FFFFFF",
  softBackground: "#F6F4FF",
  grey: "#C4C4C4",
  amber: "#F59E0B",
  green: "#65A30D",
  lavender: "#C4B5FD",
  // Apple Refinements
  fireWarm: "#FF8A00",   // Warm semantic orange
  goalAccent: "#8B5CF6", // Brand semantic violet
  systemGray: "#8E8E93", // Standard Apple gray
} as const;

/**
 * Standard Scale Animation Hook for Interactive Elements
 */
const useScaleFeedback = () => {
  const scale = useSharedValue(1);
  const onPressIn = () => (scale.value = withTiming(0.97, { duration: 100 }));
  const onPressOut = () => (scale.value = withTiming(1, { duration: 150 }));
  const style = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  return { style, onPressIn, onPressOut };
};

/**
 * Returns a time-aware greeting based on the current hour.
 */
const getGreeting = (hour: number): string => {
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  if (hour < 21) return "Good evening";
  return "Wind down";
};

/** Stagger delay (ms) between each section entrance animation */
const STAGGER_DELAY_MS = 80 as const;
const ENTRANCE_DURATION_MS = 400 as const;

// Memoized TopBar component
const TopBar = React.memo<{
  onAchievementsPress: () => void;
  onShopPress: () => void;
}>(({ onAchievementsPress, onShopPress }) => {
  const { wallet } = useRewardsContext();

  const handleSettingsPress = useCallback(() => {
    router.push("/tabs/screens/settings");
  }, []);

  return (
    <View className="py-2.5 px-5 bg-offwhite border-b border-gray-100/50 flex-row justify-between items-center">
      <TouchableOpacity
        onPress={onAchievementsPress}
        className="w-10 h-10 rounded-full items-center justify-center bg-white border border-gray-100"
        style={SHADOW_SUBTLE}
        activeOpacity={0.7}
      >
        <HugeiconsIcon icon={Medal01Icon} size={18} color={PALETTE.amber} />
      </TouchableOpacity>

      {/* Date & Coins Container */}
      <TouchableOpacity
        onPress={onShopPress}
        activeOpacity={0.7}
        className="items-center"
      >
        <CoinsBadge coins={wallet?.coins ?? 0} size="sm" />
      </TouchableOpacity>

      <TouchableOpacity
        className="w-10 h-10 rounded-full items-center justify-center bg-white border border-gray-100"
        style={SHADOW_SUBTLE}
        activeOpacity={0.7}
        onPress={handleSettingsPress}
      >
        <HugeiconsIcon
          icon={Settings02Icon}
          color={PALETTE.purple}
          size={18}
        />
      </TouchableOpacity>
    </View>
  );
});

type RecentGain = {
  id: string;
  amount: number;
  label: string;
  timestamp: number;
};

// Memoized Greeting component with XP display
const Greeting = React.memo<{
  displayName?: string;
  isLoading: boolean;
  hasPro: boolean;
  totalXP: number;
  recentGains: RecentGain[];
  onClearGain: (id: string) => void;
  onXPPress: () => void;
}>(
  ({
    displayName,
    isLoading,
    hasPro,
    totalXP,
    recentGains,
    onClearGain,
    onXPPress,
  }) => {
    const greeting = useMemo(() => getGreeting(new Date().getHours()), []);

    return (
      <View className="flex-row items-center justify-between mt-1">
        <View className="flex-row items-center gap-2.5 flex-1">
          <Text className="text-2xl font-extrabold tracking-tight text-gray-900">
            {greeting},{" "}
            {isLoading ? "..." : displayName || "Friend"}
          </Text>
          {hasPro && (
            <View className="bg-gray-100 px-2 py-0.5 rounded-md border border-gray-200">
              <Text className="text-gray-600 text-[10px] font-black tracking-widest uppercase">PRO</Text>
            </View>
          )}
        </View>
        <TouchableOpacity onPress={onXPPress} activeOpacity={0.7} className="flex-row items-center gap-1">
          <XPDisplay
            totalXP={totalXP}
            recentGains={recentGains}
            onClearGain={onClearGain}
            onPress={onXPPress}
            compact
          />
          <HugeiconsIcon icon={ArrowRight01Icon} size={14} color={PALETTE.systemGray} />
        </TouchableOpacity>
      </View>
    );
  },
);

// Memoized StreakCard component
const StreakCard = React.memo<{
  currentStreak: number;
  longestStreak: number;
  nextMilestone: number;
  isLoading: boolean;
  progressBarStyle: AnimatedStyle<ViewStyle>;
  onPress: () => void;
}>(
  ({
    currentStreak,
    longestStreak,
    nextMilestone,
    isLoading,
    progressBarStyle,
    onPress,
  }) => {
    const placeholderOpacity = useSharedValue(1);
    const { style: scaleStyle, onPressIn, onPressOut } = useScaleFeedback();

    useEffect(() => {
      if (currentStreak === 0) {
        placeholderOpacity.value = withRepeat(
          withSequence(
            withTiming(0.4, { duration: 1200 }),
            withTiming(1, { duration: 1200 }),
          ),
          -1,
          false,
        );
      }
    }, [currentStreak]);

    const placeholderAnimStyle = useAnimatedStyle(() => ({
      opacity: placeholderOpacity.value,
    }));

    return (
      <Animated.View style={[scaleStyle]}>
        <TouchableOpacity
          activeOpacity={1}
          onPressIn={onPressIn}
          onPressOut={onPressOut}
          onPress={onPress}
          className="bg-white rounded-3xl p-5"
          style={SHADOW_SUBTLE}
        >
          {currentStreak === 0 && (
            <View className="mb-4 flex-row items-center justify-between">
              <Text className="text-gray-900 text-sm font-bold tracking-tight">
                ✧ Start your journey today
              </Text>
              <HugeiconsIcon icon={ArrowRight01Icon} size={14} color={PALETTE.goalAccent} />
            </View>
          )}

          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-gray-400 text-[10px] font-black tracking-widest uppercase mb-1">
                {currentStreak === 0 ? "Initial Goal" : "Active Streak"}
              </Text>
              <View className="flex-row items-center">
                {currentStreak === 0 ? (
                  <>
                    <HugeiconsIcon size={22} icon={Target02Icon} fill={PALETTE.goalAccent} color={PALETTE.goalAccent} />
                    <Text className="text-3xl font-black ml-2 text-gray-900">
                      {isLoading ? "-" : nextMilestone}{" "}
                      <Text className="text-sm font-bold text-gray-400">days</Text>
                    </Text>
                  </>
                ) : (
                  <>
                    <HugeiconsIcon size={22} icon={Fire02Icon} fill={PALETTE.fireWarm} color={PALETTE.fireWarm} />
                    <Text className="text-3xl font-black ml-2 text-gray-900">
                      {currentStreak}{" "}
                      <Text className="text-sm font-bold text-gray-400">days</Text>
                    </Text>
                  </>
                )}
              </View>
            </View>

            {currentStreak > 0 && (
              <View className="items-end">
                <Text className="text-gray-400 text-[10px] font-black tracking-widest uppercase mb-1">Target</Text>
                <View className="flex-row items-center">
                  <HugeiconsIcon size={22} icon={Target02Icon} fill={PALETTE.goalAccent} color={PALETTE.goalAccent} />
                  <Text className="text-3xl font-black ml-2 text-gray-900">
                    {isLoading ? "-" : nextMilestone}
                  </Text>
                </View>
              </View>
            )}
          </View>

          <View className="h-2.5 bg-gray-50 rounded-full mt-4 overflow-hidden">
            <Animated.View
              className="h-full rounded-full"
              style={[{ backgroundColor: PALETTE.fireWarm }, progressBarStyle]}
            />
            {currentStreak === 0 && (
              <Animated.View
                className="absolute inset-0 items-center justify-center"
                style={placeholderAnimStyle}
              >
                <Text className="text-[10px] text-gray-300 font-bold italic tracking-wide">
                  waiting for your first note
                </Text>
              </Animated.View>
            )}
          </View>

          {longestStreak > 0 && currentStreak > 0 && (
            <View className="mt-3 flex-row items-center gap-1.5 opacity-40">
              <HugeiconsIcon icon={Medal01Icon} size={12} color={PALETTE.systemGray} />
              <Text className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                Personal Best: {longestStreak} days
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </Animated.View>
    );
  },
);

/**
 * Shimmering Skeleton Loader
 */
const ShimmerSkeleton = React.memo<{ height: number }>(({ height }) => {
  const shimmer = useSharedValue(0.4);
  useEffect(() => {
    shimmer.value = withRepeat(withSequence(withTiming(0.6, { duration: 800 }), withTiming(0.4, { duration: 800 })), -1, true);
  }, []);
  const style = useAnimatedStyle(() => ({ opacity: shimmer.value }));
  return <Animated.View className="bg-white rounded-3xl" style={[style, { height }, SHADOW_SUBTLE]} />;
});

export default function JournalCalendarScreen() {
  const progressAnim = useSharedValue(0);
  const { data: userProfile, isLoading: isLoadingProfile } = useUserProfile();
  const { hasPro, presentPaywall } = useRevenueCat();
  const posthog = usePostHog();

  const { refetch: refetchStreak } = useStreakTracker();
  const { totalXP, recentGains, clearRecentGain } = useXP();

  const { showUpdateModal, currentVersion, latestVersion, hideModal } =
    useAppUpdate({ autoCheck: true });

  const { shouldShowPaywall } = useJournalLimit(new Date());

  const [, setRecorderOpen] = useAtom(recorderOpenAtom);
  const setStartRecording = useSetAtom(startRecordingAtom);
  const { setPrompt } = useJournalEntry();

  // State declarations moved above callbacks that reference them
  const [shouldLoadChart, setShouldLoadChart] = useState(false);
  const [showStreakModal, setShowStreakModal] = useState(false);

  const handleAchievementsPress = useCallback(() => {
    router.push("/tabs/screens/achievements");
  }, []);

  const handleShopPress = useCallback(() => {
    router.push("/tabs/screens/rewards-shop");
  }, []);

  const handleQuickJournalPress = useCallback(
    (prompt: QuickJournalPrompt) => {
      // if (shouldShowPaywall) {
      //   presentPaywall();
      //   return;
      // }
      setPrompt(prompt.description);
      setStartRecording(true);
      setRecorderOpen(true);
      router.push("/tabs/(tabs)/record");
    },
    [
      shouldShowPaywall,
      presentPaywall,
      setPrompt,
      setStartRecording,
      setRecorderOpen,
    ],
  );

  const handleSeeAllPrompts = useCallback(() => {
    router.push("/tabs/screens/all-prompts");
  }, []);

  const currentStreak = userProfile?.currentStreak ?? 0;
  const nextMilestone = getNextMilestone(currentStreak);

  // Memoize date calculations to prevent recalculation on every render
  const { startOfWeekDate, endOfWeekDate, selectedEmotionDate } =
    useMemo(() => {
      const today = new Date();
      return {
        selectedEmotionDate: today,
        startOfWeekDate: startOfWeek(today, { weekStartsOn: 0 }),
        endOfWeekDate: endOfWeek(today, { weekStartsOn: 0 }),
      };
    }, []);

  // Memoize emotion logged callback
  const handleEmotionLogged = useCallback(
    (emotionScore: number, updated: boolean) => {
      refetchStreak();
      setShowStreakModal(updated);
    },
    [refetchStreak, setShowStreakModal],
  );

  useEffect(() => {
    // Delay chart loading to improve initial render performance
    const timer = setTimeout(() => {
      setShouldLoadChart(true);
    }, 100); // Load after 100ms

    return () => clearTimeout(timer);
  }, []);

  const progressBarStyle = useAnimatedStyle(() => {
    const widthPercentage = interpolate(progressAnim.value, [0, 1], [0, 100]);
    return {
      width: `${widthPercentage}%`,
    };
  });

  useEffect(() => {
    progressAnim.value = withTiming(currentStreak / nextMilestone, {
      duration: 1200,
    });
    posthog.capture("Journal Calendar Screen Visited");
  }, [currentStreak, nextMilestone, posthog]);

  return (
    <SafeAreaView className="flex-1 bg-offwhite">
      <ScrollView
        removeClippedSubviews={true}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}
        scrollEventThrottle={16}
        contentInsetAdjustmentBehavior="automatic"
        keyboardShouldPersistTaps="handled"
      >
        {/* Top Bar */}
        <TopBar
          onAchievementsPress={handleAchievementsPress}
          onShopPress={handleShopPress}
        />
        <View className="bg-offwhite px-4 pb-24 pt-3">
          {/* Greeting — entrance animation index 0 */}
          <Animated.View
            entering={FadeInDown.duration(ENTRANCE_DURATION_MS)}
          >
            <Greeting
              displayName={userProfile?.displayName}
              isLoading={isLoadingProfile}
              hasPro={hasPro}
              totalXP={totalXP}
              recentGains={recentGains}
              onClearGain={clearRecentGain}
              onXPPress={() => router.push("/tabs/screens/xp-history")}
            />
          </Animated.View>

          {/* Streak Card — entrance animation index 1 */}
          <Animated.View
            className="mt-4"
            entering={FadeInDown.duration(ENTRANCE_DURATION_MS).delay(
              STAGGER_DELAY_MS * 1,
            )}
          >
            <StreakCard
              currentStreak={currentStreak}
              longestStreak={userProfile?.longestStreak ?? 0}
              nextMilestone={nextMilestone}
              isLoading={isLoadingProfile}
              progressBarStyle={progressBarStyle}
              onPress={() => handleQuickJournalPress({
                id: "initial_streak",
                title: "Daily Log",
                description: "Recording today's journey",
                category: "Personal",
                emoji: "✍️",
                bgColor: PALETTE.softBackground,
                categoryColor: PALETTE.purple,
              })}
            />
          </Animated.View>

          {/* Emotion Logger — entrance animation index 2 */}
          <Animated.View
            className="mt-6"
            entering={FadeInDown.duration(ENTRANCE_DURATION_MS).delay(
              STAGGER_DELAY_MS * 2,
            )}
          >
            <EmotionLogger
              selectedDate={selectedEmotionDate}
              onEmotionLogged={handleEmotionLogged}
            />
          </Animated.View>

          {/* ── Journaling ── */}
          <Animated.View
            className="mt-8"
            entering={FadeInDown.duration(400).delay(240)}
          >
            <View className="flex-row items-center gap-2 mb-3 px-1">
              <Text className="text-xs text-gray-400 font-semibold uppercase tracking-widest">Journaling</Text>
              <XPBadge amount={XP_REWARDS[XPActionType.JOURNAL_ENTRY]} />
            </View>
            <FeaturedPromptCard
              prompt="What's making you smile today?"
              xpReward={XP_REWARDS[XPActionType.JOURNAL_ENTRY]}
              emoji="✨"
              onPress={() =>
                handleQuickJournalPress({
                  id: "featured_apple",
                  title: "Reflections",
                  description: "What's making you smile today?",
                  category: "Gratitude",
                  emoji: "✨",
                  bgColor: PALETTE.softBackground,
                  categoryColor: PALETTE.purple,
                })
              }
            />
          </Animated.View>

          {/* Quick Journal Section — entrance animation index 3 */}
          <Animated.View
            className="mt-6"
            entering={FadeInDown.duration(400).delay(320)}
          >
            <QuickJournalSection
              onCardPress={handleQuickJournalPress}
              onSeeAllPress={handleSeeAllPrompts}
            />
          </Animated.View>

          {/* ── Progress ── */}
          <Animated.View
            className="mt-8"
            entering={FadeInDown.duration(400).delay(400)}
          >
            <Text className="text-xs text-gray-400 font-semibold uppercase tracking-widest mb-3">Progress</Text>
            <ChallengesSection maxItems={3} />
          </Animated.View>

          {/* Weekly Mood Chart — entrance animation index 4 */}
          <Animated.View
            className="mt-8"
            entering={FadeInDown.duration(400).delay(480)}
          >
            {shouldLoadChart ? (
              <WeeklyMoodChart
                startDate={startOfWeekDate}
                endDate={endOfWeekDate}
                title="Mood Trends"
              />
            ) : (
              <ShimmerSkeleton height={320} />
            )}
          </Animated.View>
        </View>
      </ScrollView>

      {/* Update Modal */}
      <UpdateModal
        isVisible={showUpdateModal}
        onDismiss={hideModal}
        currentVersion={currentVersion}
        latestVersion={latestVersion}
      />

      {/* Streak Modal */}
      <Modal
        visible={showStreakModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowStreakModal(false)}
      >
        <StreakDisplay onContinue={() => setShowStreakModal(false)} />
      </Modal>
    </SafeAreaView>
  );
}

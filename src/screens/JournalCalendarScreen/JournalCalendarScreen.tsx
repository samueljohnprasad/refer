import React, { useEffect, useMemo, useCallback, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Modal } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  FadeInDown,
} from "react-native-reanimated";
import { endOfWeek, startOfWeek } from "date-fns";
import { useUserProfile } from "@/hooks/data/useUserProfile";
import WeeklyMoodChart from "@/src/components/WeeklyMoodChart";

import { SafeAreaView } from "@/components/ui/safe-area-view";
import { router } from "expo-router";
import { EmotionLogger } from "@/src/components/EmotionLogger";
import { ChallengesSection } from "@/src/components/Challenges";
import { FeaturedPromptCard } from "@/src/components/FeaturedPromptCard";
import { Settings02Icon, Medal01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { usePostHog } from "posthog-react-native";
import { UpdateModal } from "@/src/components/modals";
import { useAppUpdate } from "@/src/hooks/useAppUpdate";
import { StreakDisplay, WeeklyStreakWidget } from "@/src/components/Streak";
import { useStreakTracker } from "@/hooks/data/useStreakTracker";
import { PressableScale } from "@/src/components/ui/PressableScale";
import { Card } from "@/src/components/ui/Card";

import {
  QuickJournalPrompt,
  QuickJournalSection,
} from "../DiscoveryScreen/QuickJournalSection";
import { recorderOpenAtom } from "../DiscoveryScreen/helpers";
import { startRecordingAtom } from "../DailyNotesScreen/atoms";
import { useAtom, useSetAtom } from "jotai";
import { useJournalEntry } from "@/hooks/useJournalEntry";
import { XP_REWARDS, XPActionType } from "@/src/types/xp";
import { InsightNudgeCard } from "@/src/components/insights/InsightNudgeCard";
import { GOLD, SAGE } from "@/lib/tokens";

// Re-export for backward compat from other files that import from here.
export { PALETTE } from "@/constants/palette";

/**
 * Returns a time-aware greeting based on the current hour.
 */
const getGreeting = (hour: number): string => {
  if (hour >= 4 && hour < 12) return "Good morning";
  if (hour >= 12 && hour < 17) return "Good afternoon";
  if (hour >= 17 && hour < 22) return "Good evening";
  return "Time to wind down";
};

/** Stagger delay (ms) between each section entrance animation */
const STAGGER_DELAY_MS = 60 as const;
const ENTRANCE_DURATION_MS = 300 as const;

// Memoized TopBar component
const TopBar = React.memo<{
  onAchievementsPress: () => void;
}>(({ onAchievementsPress }) => {
  const handleSettingsPress = useCallback(() => {
    router.push("/tabs/screens/settings");
  }, []);

  return (
    <View className="flex-row items-center justify-between px-5 pb-2 pt-4">
      <TouchableOpacity
        onPress={onAchievementsPress}
        className="happy-brand-soft-chip h-12 flex-row items-center justify-center gap-2 px-4"
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel="View achievements"
      >
        <HugeiconsIcon icon={Medal01Icon} size={18} color={GOLD} />
        <Text className="happy-font-body-bold text-[14px] text-ink-soft">
          Awards
        </Text>
      </TouchableOpacity>

      <PressableScale
        className="w-11 h-11 items-center justify-center -mr-2"
        onPress={handleSettingsPress}
        scale={0.9}
        hapticStyle="light"
        accessibilityRole="button"
        accessibilityLabel="Open settings"
      >
        <HugeiconsIcon icon={Settings02Icon} color={SAGE[600]} size={23} />
      </PressableScale>
    </View>
  );
});

// Memoized Greeting component with XP display
const Greeting = React.memo<{
  displayName?: string;
  isLoading: boolean;
}>(({ displayName, isLoading }) => {
  const greeting = useMemo(() => getGreeting(new Date().getHours()), []);

  return (
    <View className="mt-1">
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-2.5 flex-1 pr-2">
          <Text
            className="happy-font-body-bold text-[30px] tracking-tight text-ink"
            numberOfLines={1}
            adjustsFontSizeToFit
          >
            {greeting}, {isLoading ? "..." : displayName || "Friend"}
          </Text>
        </View>
      </View>
    </View>
  );
});

/**
 * Shimmering Skeleton Loader
 */
const ShimmerSkeleton = React.memo<{ height?: number }>(({ height = 240 }) => {
  const shimmer = useSharedValue(0.4);
  useEffect(() => {
    shimmer.value = withRepeat(
      withSequence(
        withTiming(0.6, { duration: 800 }),
        withTiming(0.4, { duration: 800 }),
      ),
      -1,
      true,
    );
  }, []);
  const style = useAnimatedStyle(() => ({ opacity: shimmer.value }));
  return (
    <Animated.View style={[style, { height, width: "100%" }]}>
      <Card
        variant="tile"
        radius="xl"
        haptic="none"
        className="h-full"
        contentClassName="h-full p-0"
      >
        <View className="h-full" />
      </Card>
    </Animated.View>
  );
});

export default function JournalCalendarScreen() {
  const { data: userProfile, isLoading: isLoadingProfile } = useUserProfile();
  const posthog = usePostHog();

  const { refetch: refetchStreak } = useStreakTracker();

  const { showUpdateModal, currentVersion, latestVersion, hideModal } =
    useAppUpdate({ autoCheck: true });

  const [, setRecorderOpen] = useAtom(recorderOpenAtom);
  const setStartRecording = useSetAtom(startRecordingAtom);
  const { setPrompt } = useJournalEntry();

  // State declarations moved above callbacks that reference them
  const [shouldLoadChart, setShouldLoadChart] = useState(false);
  const [showStreakModal, setShowStreakModal] = useState(false);

  const handleAchievementsPress = useCallback(() => {
    router.push("/tabs/screens/achievements");
  }, []);

  const handleQuickJournalPress = useCallback(
    (prompt: QuickJournalPrompt) => {
      setPrompt(prompt.description);
      setStartRecording(true);
      setRecorderOpen(true);
      router.push("/tabs/(tabs)/record");
    },
    [setPrompt, setStartRecording, setRecorderOpen],
  );

  const handleSeeAllPrompts = useCallback(() => {
    router.push("/tabs/screens/all-prompts");
  }, []);

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

  useEffect(() => {
    posthog.capture("Journal Calendar Screen Visited");
  }, [posthog]);

  return (
    <View className="flex-1 happy-brand-screen">
      <SafeAreaView edges={[]} style={{ flex: 1 }}>
        <ScrollView
          removeClippedSubviews={true}
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled={true}
          scrollEventThrottle={16}
          contentInsetAdjustmentBehavior="automatic"
          keyboardShouldPersistTaps="handled"
          style={{ flex: 1 }}
          contentContainerClassName="pb-28"
        >
          {/* Top Bar */}
          <TopBar onAchievementsPress={handleAchievementsPress} />
          <View className="px-5 pb-12 pt-4">
            {/* Greeting — entrance animation index 0 */}
            <Animated.View entering={FadeInDown.duration(ENTRANCE_DURATION_MS)}>
              <Greeting
                displayName={userProfile?.displayName}
                isLoading={isLoadingProfile}
              />
            </Animated.View>

            {/* Streak Widget — entrance animation index 1 */}
            <Animated.View
              className="mt-6"
              entering={FadeInDown.duration(ENTRANCE_DURATION_MS).delay(
                STAGGER_DELAY_MS * 1,
              )}
            >
              <WeeklyStreakWidget
                showDepth={false}
                onPress={() =>
                  handleQuickJournalPress({
                    id: "initial_streak",
                    title: "Daily Log",
                    description: "Recording today's journey",
                    category: "Personal",
                    emoji: "✍️",
                    bgColor: SAGE[50],
                    categoryColor: SAGE[600],
                  })
                }
              />
            </Animated.View>

            {/* GROUP 2: Journal */}
            <Animated.View
              className="mt-10"
              entering={FadeInDown.duration(ENTRANCE_DURATION_MS).delay(
                STAGGER_DELAY_MS * 2,
              )}
            >
              <View className="mb-3 px-1">
                <Text className="happy-brand-eyebrow">Daily Reflection</Text>
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
                    bgColor: SAGE[50],
                    categoryColor: SAGE[600],
                  })
                }
              />
            </Animated.View>

            {/* ── GROUP 3: Track — entrance animation index 3 ── */}
            <Animated.View
              className="mt-10"
              entering={FadeInDown.duration(ENTRANCE_DURATION_MS).delay(
                STAGGER_DELAY_MS * 3,
              )}
            >
              <EmotionLogger
                selectedDate={selectedEmotionDate}
                onEmotionLogged={handleEmotionLogged}
                showDepth={false}
              />
            </Animated.View>

            {/* Mood Chart — same group as emotion logger, tighter spacing */}
            <Animated.View
              className="mt-6"
              entering={FadeInDown.duration(ENTRANCE_DURATION_MS).delay(
                STAGGER_DELAY_MS * 4,
              )}
            >
              {shouldLoadChart ? (
                <WeeklyMoodChart
                  startDate={startOfWeekDate}
                  endDate={endOfWeekDate}
                  title="Mood Trends"
                />
              ) : (
                <View className="mb-4">
                  <Text className="happy-brand-eyebrow mb-3 px-1">
                    Mood Trends
                  </Text>
                  <ShimmerSkeleton height={240} />
                </View>
              )}
            </Animated.View>

            {/* Pattern Insight Nudge — entrance animation index 5 */}
            <Animated.View
              className="mt-8"
              entering={FadeInDown.duration(ENTRANCE_DURATION_MS).delay(
                STAGGER_DELAY_MS * 5,
              )}
            >
              <InsightNudgeCard />
            </Animated.View>

            {/* ── GROUP 4: Progress — entrance animation index 6 ── */}
            <Animated.View
              className="mt-10"
              entering={FadeInDown.duration(ENTRANCE_DURATION_MS).delay(
                STAGGER_DELAY_MS * 6,
              )}
            >
              <ChallengesSection showDepth={false} maxItems={3} />
            </Animated.View>

            {/* Quick Journal — same group as journaling, tighter spacing */}
            <Animated.View
              className="mt-8 mb-6"
              entering={FadeInDown.duration(ENTRANCE_DURATION_MS).delay(
                STAGGER_DELAY_MS * 7,
              )}
            >
              <QuickJournalSection
                onCardPress={handleQuickJournalPress}
                onSeeAllPress={handleSeeAllPrompts}
              />
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
    </View>
  );
}

import React, { useEffect, useMemo, useCallback, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withRepeat,
  withSequence,
  FadeInDown,
} from "react-native-reanimated";
import { endOfWeek, startOfWeek } from "date-fns";
import { useUserProfile } from "@/hooks/data/useUserProfile";
import WeeklyMoodChart from "@/src/components/WeeklyMoodChart";

import { SafeAreaView } from "@/components/ui/safe-area-view";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Stack, router } from "expo-router";
import { GlassView } from "expo-glass-effect";
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
import { GOLD, SAGE, INK, INK_SOFT, INK_MUTED } from "@/lib/tokens";

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

import { Platform } from "react-native";
import { Host, Button } from "@expo/ui/swift-ui";
import { buttonStyle, tint, controlSize, labelStyle } from "@expo/ui/swift-ui/modifiers";

// Memoized TopBar component
const TopBar = React.memo<{
  onAchievementsPress: () => void;
}>(({ onAchievementsPress }) => {
  const handleSettingsPress = useCallback(() => {
    router.push("/tabs/screens/settings");
  }, []);

  const gearRotation = useSharedValue(0);
  const medalRotation = useSharedValue(0);

  const gearStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${gearRotation.value}deg` }],
  }));

  const medalStyle = useAnimatedStyle(() => ({
    transform: [{ rotateZ: `${medalRotation.value}deg` }],
  }));

  if (Platform.OS === "ios") {
    return (
      <View className="flex-row items-center justify-between px-5 pb-2 pt-1">
        <Host style={{ width: 120, height: 44 }}>
          <Button
            label="Awards"
            
            systemImage="rosette"
            onPress={onAchievementsPress}
            modifiers={[
              buttonStyle("bordered"),
              controlSize("regular"),
              tint(GOLD),
            ]}
          />
        </Host>

        <Host style={{ width: 44, height: 44 }}>
          <Button
            label="Settings"
            systemImage="gearshape.fill"
            onPress={handleSettingsPress}
            modifiers={[
              labelStyle("iconOnly"),
              buttonStyle("borderless"),
              controlSize("large"),
              tint(SAGE[600]),
            ]}
          />
        </Host>
      </View>
    );
  }

  // Fallback for Android/Web
  return (
    <View className="flex-row items-center justify-between px-5 pb-2">
      <PressableScale
        onPress={onAchievementsPress}
        onPressIn={() => {
          medalRotation.value = withSpring(15, { damping: 20, stiffness: 100, overshootClamping: true });
        }}
        onPressOut={() => {
          medalRotation.value = withSpring(0, { damping: 20, stiffness: 100, overshootClamping: true });
        }}
        className="happy-brand-soft-chip h-12 flex-row items-center justify-center gap-2 px-4"
        scale={0.96}
        hapticStyle="light"
        accessibilityRole="button"
        accessibilityLabel="View achievements"
      >
        <Animated.View style={medalStyle}>
          <HugeiconsIcon icon={Medal01Icon} size={18} color={GOLD} />
        </Animated.View>
        <Text className="happy-font-body-bold text-[14px] text-ink-soft">
          Awards
        </Text>
      </PressableScale>

      <PressableScale
        className="w-11 h-11 items-center justify-center -mr-2"
        onPress={handleSettingsPress}
        onPressIn={() => {
          gearRotation.value = withSpring(45, { damping: 20, stiffness: 100, overshootClamping: true });
        }}
        onPressOut={() => {
          gearRotation.value = withSpring(0, { damping: 20, stiffness: 100, overshootClamping: true });
        }}
        scale={0.9}
        hapticStyle="light"
        accessibilityRole="button"
        accessibilityLabel="Open settings"
      >
        <Animated.View style={gearStyle}>
          <HugeiconsIcon icon={Settings02Icon} color={SAGE[600]} size={23} />
        </Animated.View>
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
  const insets = useSafeAreaInsets();
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
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTransparent: true,
          headerShadowVisible: false,
          header: () => (
            <GlassView
              glassEffectStyle="regular"
              // isInteractive={true}
              style={{
                borderBottomWidth: 1,
                borderBottomColor: "rgba(255, 255, 255, 0.1)",
                elevation: 0,
                shadowOpacity: 0,
                shadowRadius: 0,
                overflow: "hidden",
              }}
            >
              <SafeAreaView edges={["top"]}>
                <TopBar onAchievementsPress={handleAchievementsPress} />
              </SafeAreaView>
            </GlassView>
          ),
        }}
      />
      <ScrollView
        className="flex-1 happy-brand-screen"
        removeClippedSubviews={true}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}
        scrollEventThrottle={16}
        contentInsetAdjustmentBehavior="automatic"
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingTop: insets.top, paddingBottom: 112 }}
      >
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

          {/* Apple Intelligence — entrance animation index 5.5 */}
          <Animated.View
            className="mt-6"
            entering={FadeInDown.duration(ENTRANCE_DURATION_MS).delay(
              STAGGER_DELAY_MS * 5.5,
            )}
          >
            <PressableScale
              onPress={() => router.push("/tabs/screens/apple-intelligence")}
              scale={0.97}
              hapticStyle="light"
              accessibilityRole="button"
              accessibilityLabel="Open Apple Intelligence"
            >
              <Card variant="tile" radius="xl" haptic="none">
                <View className="flex-row items-center gap-4 p-4">
                  <View
                    className="w-12 h-12 rounded-2xl items-center justify-center"
                    style={{ backgroundColor: SAGE[50] }}
                  >
                    <Text className="text-[24px]">🧠</Text>
                  </View>
                  <View className="flex-1">
                    <Text
                      className="happy-font-body-bold text-[15px]"
                      style={{ color: INK }}
                    >
                      Apple Intelligence
                    </Text>
                    <Text
                      className="happy-font-body text-[13px] mt-0.5"
                      style={{ color: INK_SOFT }}
                    >
                      On-device AI · Private & secure
                    </Text>
                  </View>
                  <Text style={{ color: INK_MUTED, fontSize: 18 }}>›</Text>
                </View>
              </Card>
            </PressableScale>
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

      {/* Streak Bottom Sheet — SwiftUI BottomSheet managed inside StreakDisplay */}
      <StreakDisplay
        visible={showStreakModal}
        onClose={() => setShowStreakModal(false)}
      />
    </>
  );
}

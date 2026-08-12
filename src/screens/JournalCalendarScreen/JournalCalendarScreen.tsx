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


import { SafeAreaView } from "@/components/ui/safe-area-view";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Stack, router } from "expo-router";
import { EmotionLogger } from "@/src/components/EmotionLogger";
import { FeaturedPromptCard } from "@/src/components/FeaturedPromptCard";
import { Settings02Icon, Medal01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { usePostHog } from "posthog-react-native";
import { UpdateModal } from "@/src/components/modals";
import { useAppUpdate } from "@/src/hooks/useAppUpdate";
import { StreakDisplay, WeeklyStreakWidget } from "@/src/components/Streak";
import { useStreak } from "@/src/hooks/useStreak";
import { PressableScale } from "@/src/components/ui/PressableScale";
import { Card } from "@/src/components/ui/Card";

import { QuickJournalPrompt } from "../DiscoveryScreen/QuickJournalSection";
import { ALL_PROMPTS } from "../AllPromptsScreen/AllPromptsScreen";
import { recorderOpenAtom } from "../DiscoveryScreen/helpers";
import { startRecordingAtom } from "../DailyNotesScreen/atoms";
import { useAtom, useSetAtom } from "jotai";
import { useJournalEntry } from "@/hooks/useJournalEntry";
import { XP_REWARDS, XPActionType } from "@/src/types/xp";
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

// Custom TopBar replaced by Stack.Toolbar natively

// Memoized Greeting component with XP display
const Greeting = React.memo<{
  displayName?: string;
  isLoading: boolean;
}>(({ displayName, isLoading }) => {
  const greeting = useMemo(() => getGreeting(new Date().getHours()), []);

  return (
    <View>
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-2.5 flex-1 pr-2">
          <Text
            className="text-[28px] font-semibold tracking-tight text-ink"
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

  const { refetch: refetchStreak } = useStreak();

  const { showUpdateModal, currentVersion, latestVersion, hideModal } =
    useAppUpdate({ autoCheck: true });

  const [, setRecorderOpen] = useAtom(recorderOpenAtom);
  const setStartRecording = useSetAtom(startRecordingAtom);
  const { setPrompt } = useJournalEntry();

  // State declarations moved above callbacks that reference them
  const [showStreakModal, setShowStreakModal] = useState(false);

  const handleAchievementsPress = useCallback(() => {
    router.push("/tabs/screens/achievements");
  }, []);

  const handleSettingsPress = useCallback(() => {
    router.push("/tabs/screens/settings");
  }, []);

  const handleTimelinePress = useCallback(() => {
    router.push("/tabs/screens/timelines");
  }, []);

  const handleQuickJournalPress = useCallback(
    (prompt: QuickJournalPrompt) => {
      setPrompt(prompt.description);
      setStartRecording(true);
      router.push("/tabs/screens/voice-recorder");
    },
    [setPrompt, setStartRecording, setRecorderOpen],
  );



  // Memoize date calculations to prevent recalculation on every render
  const { selectedEmotionDate } =
    useMemo(() => {
      const today = new Date();
      return {
        selectedEmotionDate: today,
      };
    }, []);

  // Memoize emotion logged callback
  const handleEmotionLogged = useCallback(
    (emotionScore: number, updated: boolean) => {
      refetchStreak();
      setShowStreakModal(true);
    },
    [refetchStreak, setShowStreakModal],
  );

  useEffect(() => {
    return () => {};
  }, []);

  useEffect(() => {
    posthog.capture("Journal Calendar Screen Visited");
  }, [posthog]);

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: "",
        }}
      />
      <Stack.Header
        transparent
        style={{
          backgroundColor: 'transparent',
          color: INK,
          shadowColor: 'transparent',
        }}
      />
      <Stack.Toolbar placement="right" tintColor={INK}>
        <Stack.Toolbar.Button
          icon="chart.bar.doc.horizontal"
          title="Timeline"
          tintColor={INK}
          onPress={handleTimelinePress}
        />
        <Stack.Toolbar.Button
          icon="rosette"
          title="Awards"
          tintColor={INK}
          onPress={handleAchievementsPress}
        />
        <Stack.Toolbar.Button
          icon="gearshape.fill"
          tintColor={SAGE[600]}
          onPress={handleSettingsPress}
        />
      </Stack.Toolbar>
      <ScrollView
        className="flex-1 bg-white"
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}
        scrollEventThrottle={16}
        contentInsetAdjustmentBehavior="automatic"
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 112 }}
      >
        <View className="px-5 pb-12 pt-4">
          <View>
            <Greeting
              displayName={userProfile?.displayName}
              isLoading={isLoadingProfile}
            />
          </View>

          {/* Streak Widget */}
          <Animated.View
            className="mt-6"
            entering={FadeInDown.duration(400).springify()}
          >
            <WeeklyStreakWidget
              showDepth={false}
              onPress={() => router.push("/tabs/screens/xp-history")}
            />
          </Animated.View>

          {/* GROUP 2: Journal */}
          <View className="mt-10">
            <View className="mb-3 px-1">
              <Text className="text-[14px] font-medium tracking-wide text-ink-muted uppercase">Daily reflection</Text>
            </View>
            <FeaturedPromptCard
              prompts={ALL_PROMPTS}
              onPress={(prompt) =>
                handleQuickJournalPress(prompt)
              }
            />
          </View>



          {/* ── GROUP 3: Track ── */}
          <View className="mt-10">
            <EmotionLogger
              selectedDate={selectedEmotionDate}
              onEmotionLogged={handleEmotionLogged}
              showDepth={false}
            />
          </View>


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

import React, { useEffect, useMemo, useCallback, useState } from "react";
import { View, Text, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import dayjs from "dayjs";
import { useUserProfile } from "@/hooks/data/useUserProfile";
import { Stack, router } from "expo-router";
import { EmotionLogger } from "@/src/components/EmotionLogger";
import { FeaturedPromptCard } from "@/src/components/FeaturedPromptCard";
import { usePostHog } from "posthog-react-native";
import { UpdateModal } from "@/src/components/modals";
import { useAppUpdate } from "@/src/hooks/useAppUpdate";
import { StreakDisplay, WeeklyStreakWidget } from "@/src/components/Streak";
import { useStreak } from "@/src/hooks/useStreak";
import { QuickJournalPrompt } from "../DiscoveryScreen/QuickJournalSection";
import { ALL_PROMPTS } from "../AllPromptsScreen/AllPromptsScreen";
import { startRecordingAtom } from "../DailyNotesScreen/atoms";
import { useSetAtom } from "jotai";
import { useJournalEntry } from "@/hooks/useJournalEntry";
import { SEMANTIC_COLORS } from "@/src/theme/colors";
import { ContinueJourneyCard } from "@/src/components/ContinueJourneyCard/ContinueJourneyCard";


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

const Greeting = React.memo<{
  displayName?: string;
  isLoading: boolean;
}>(({ displayName, isLoading }) => {
  
  const greeting = useMemo(() => getGreeting(new Date().getHours()), []);

  // ponytail: calibrated greeting scale to emphasize prompt hero
  return (
    <View>
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-2.5 flex-1 pr-2">
          <Text
            className="text-[22px] font-bold tracking-tight text-ink"
            style={{ color: SEMANTIC_COLORS.text.primary }}
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

export default function JournalCalendarScreen() {
  
  const { data: userProfile, isLoading: isLoadingProfile } = useUserProfile();
  const posthog = usePostHog();

  const {
    refetch: refetchStreak,
    currentStreak,
    isLoading: isStreakLoading,
  } = useStreak();

  const { showUpdateModal, currentVersion, latestVersion, hideModal } =
    useAppUpdate({ autoCheck: true });

  const setStartRecording = useSetAtom(startRecordingAtom);
  const { setPrompt } = useJournalEntry();

  // State declarations moved above callbacks that reference them
  const [showStreakModal, setShowStreakModal] = useState(false);

  // ponytail: show Day 7 & Day 15 streak celebration on app load once per calendar day
  useEffect(() => {
    if (isStreakLoading || (currentStreak !== 7 && currentStreak !== 15)) return;

    let timer: ReturnType<typeof setTimeout> | undefined;
    const checkAndShowMilestoneStreak = async () => {
      try {
        const today = dayjs().format("YYYY-MM-DD");
        const key = `@happy/streak_modal_shown_day_${currentStreak}_${today}`;
        const alreadyShown = await AsyncStorage.getItem(key);
        if (!alreadyShown) {
          await AsyncStorage.setItem(key, "true");
          timer = setTimeout(() => {
            setShowStreakModal(true);
          }, 600);
        }
      } catch (e) {
        console.error("Error checking milestone streak modal:", e);
      }
    };

    void checkAndShowMilestoneStreak();
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [currentStreak, isStreakLoading]);

  const handleSettingsPress = useCallback(() => {
    router.push("/tabs/screens/settings");
  }, []);

  const handleQuickJournalPress = useCallback(
    (prompt: QuickJournalPrompt) => {
      setPrompt(prompt.description);
      setStartRecording(true);
      router.push("/tabs/screens/voice-recorder");
    },
    [setPrompt, setStartRecording],
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
          color: SEMANTIC_COLORS.text.primary,
          shadowColor: 'transparent',
        }}
      />
      {/* ponytail: subtle tertiary settings action in header toolbar */}
      <Stack.Toolbar placement="right" tintColor={SEMANTIC_COLORS.text.tertiary}>
        <Stack.Toolbar.Button
          icon="gearshape"
          accessibilityLabel="Settings"
          tintColor={SEMANTIC_COLORS.text.tertiary}
          onPress={handleSettingsPress}
        />
      </Stack.Toolbar>
      <ScrollView
        className="flex-1 bg-brand-canvas"
        style={{
          backgroundColor:
            SEMANTIC_COLORS.surface.primary === "#0a0a0a"
              ? SEMANTIC_COLORS.surface.canvas
              : SEMANTIC_COLORS.surface.primary,
        }}
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

          {/* ponytail: action-first home screen hierarchy */}
          {/* Hero: Today's Reflection */}
          <View className="mt-8">
            <View className="mb-1.5 px-1">
              <Text className="text-[11px] font-semibold tracking-wider text-ink-muted/80 uppercase">
                Today's reflection
              </Text>
            </View>
            <FeaturedPromptCard
              prompts={ALL_PROMPTS}
              onPress={(prompt) =>
                handleQuickJournalPress(prompt)
              }
            />
          </View>

          {/* Secondary: Mood Check-in */}
          <View className="mt-6">
            <EmotionLogger
              selectedDate={selectedEmotionDate}
              onEmotionLogged={handleEmotionLogged}
              showDepth={false}
            />
          </View>

          {/* Reinforcement: Compact Streak */}
          <View className="mt-6">
            <WeeklyStreakWidget
              showDepth={false}
              onPress={() => router.push("/tabs/screens/xp-history")}
            />
          </View>

          {/* ponytail: secondary learning resume entry point */}
          <View className="mt-8">
            <ContinueJourneyCard />
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

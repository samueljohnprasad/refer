import React, { useEffect, useMemo, useCallback, useState } from "react";
import { View, Text, ScrollView } from "react-native";
import { useTranslation } from "react-i18next";
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
import { useVoiceFeature } from "@/src/hooks/useVoiceFeature";
import { HomeHeader } from "./components/HomeHeader";


// Re-export for backward compat from other files that import from here.
export { PALETTE } from "@/constants/palette";

export default function JournalCalendarScreen() {
  const { t: tHome } = useTranslation("home");
  const { t: tCommon } = useTranslation("common");
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

  const { journalRoute, isVoiceEnabled } = useVoiceFeature();

  const handleQuickJournalPress = useCallback(
    (prompt: QuickJournalPrompt) => {
      setPrompt(String(tHome(`prompts.${prompt.id}` as any)));
      if (isVoiceEnabled) {
        setStartRecording(true);
      }
      router.push(journalRoute);
    },
    [setPrompt, setStartRecording, isVoiceEnabled, journalRoute, tHome],
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
    posthog?.capture("Journal Calendar Screen Visited");
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
          accessibilityLabel={tCommon("navigation.settings")}
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
            <HomeHeader
              displayName={userProfile?.displayName}
              isLoading={isLoadingProfile}
              streak={currentStreak}
              onStreakPress={() => setShowStreakModal(true)}
            />
          </View>

          {/* ponytail: action-first home screen hierarchy */}
          {/* Section 1 (Hero): Today's Reflection */}
          <View className="mt-6">
            <View className="mb-1.5 px-1">
              <Text className="text-[11px] font-semibold tracking-wider text-ink-muted/80 uppercase">
                {tHome("sections.todayReflection")}
              </Text>
            </View>
            <FeaturedPromptCard
              prompts={ALL_PROMPTS}
              onPress={(prompt) =>
                handleQuickJournalPress(prompt)
              }
            />
          </View>

          {/* Section 2 (Check-in): Contained Mood Logger */}
          <View className="mt-6">
            <EmotionLogger
              selectedDate={selectedEmotionDate}
              onEmotionLogged={handleEmotionLogged}
              showDepth={false}
            />
          </View>

          {/* Section 3 (Learning): Tactile Continue Journey Card */}
          <View className="mt-6">
            <ContinueJourneyCard />
          </View>

          {/* ponytail: Section 4 (Reinforcement) — Weekly streak progress board anchors feed */}
          <View className="mt-6">
            <WeeklyStreakWidget
              showDepth={false}
              onPress={() => router.push("/tabs/screens/xp-history")}
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

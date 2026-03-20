import React, { useEffect, useMemo, useCallback, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  useWindowDimensions,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  interpolate,
  FadeInDown,
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
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { useRevenueCat } from "@/src/context/RevenueCatProvider";
import { LinearGradient } from "expo-linear-gradient";
import { Host, Button } from "@expo/ui/swift-ui";
import { isLiquidGlassAvailable } from "expo-glass-effect";
import { usePostHog } from "posthog-react-native";
import { UpdateModal } from "@/src/components/modals";
import { useAppUpdate } from "@/src/hooks/useAppUpdate";
import { StreakDisplay } from "@/src/components/Streak";
import { useStreakTracker } from "@/hooks/data/useStreakTracker";
import { useJournalLimit } from "@/hooks/useJournalLimit";
import { XPDisplay } from "@/src/components/XP";
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

// Global color palette
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
} as const;

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
  const { presentPaywall, hasPro } = useRevenueCat();
  const { wallet } = useRewardsContext();

  const handleSettingsPress = useCallback(() => {
    router.push("/tabs/screens/settings");
  }, []);



  const isLiquidGlass = isLiquidGlassAvailable();
  return (
    <View className="py-4 px-5 bg-offwhite border-b border-gray-100/60">
      <View className="flex-row justify-between items-center">
        {!isLiquidGlass && (
          <TouchableOpacity
            onPress={onAchievementsPress}
            className="w-10 h-10 rounded-full items-center justify-center"
            style={{ backgroundColor: PALETTE.amber }}
            activeOpacity={0.8}
            accessibilityLabel="Achievements"
            accessibilityRole="button"
          >
            <HugeiconsIcon icon={Medal01Icon} size={20} color={PALETTE.white} />
          </TouchableOpacity>
        )}

        {isLiquidGlass && (
          <Host matchContents>
            <Button
              onPress={onAchievementsPress}
              color="#F59E0B"
              systemImage="medal.fill"
              variant="glassProminent"
              controlSize="regular"
            >
              <HugeiconsIcon
                icon={Medal01Icon}
                size={20}
                color={PALETTE.white}
              />
            </Button>
          </Host>
        )}

        {/* Coins Badge */}
        <TouchableOpacity
          onPress={onShopPress}
          activeOpacity={0.9}
          accessibilityLabel="Rewards shop"
          accessibilityRole="button"
        >
          <CoinsBadge coins={wallet?.coins ?? 0} size="md" />
        </TouchableOpacity>

        {!isLiquidGlass && (
          <TouchableOpacity
            className="w-10 h-10 rounded-full items-center justify-center"
            style={{ backgroundColor: PALETTE.purple }}
            activeOpacity={0.8}
            onPress={handleSettingsPress}
            accessibilityLabel="Settings"
            accessibilityRole="button"
          >
            <HugeiconsIcon
              icon={Settings02Icon}
              color={PALETTE.white}
              size={20}
            />
          </TouchableOpacity>
        )}
        {isLiquidGlass && (
          <Host matchContents>
            <Button
              onPress={handleSettingsPress}
              color="#7B61FF"
              systemImage="gearshape.fill"
              variant="glassProminent"
              controlSize="regular"
            >
              <HugeiconsIcon
                icon={Settings02Icon}
                size={20}
                color={PALETTE.white}
              />
            </Button>
          </Host>
        )}
      </View>
    </View>
  );
});

// Memoized Greeting component with XP display
const Greeting = React.memo<{
  displayName?: string;
  isLoading: boolean;
  hasPro: boolean;
  totalXP: number;
  recentGains: Array<{
    id: string;
    amount: number;
    label: string;
    timestamp: number;
  }>;
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
    const greeting = useMemo(
      () => getGreeting(new Date().getHours()),
      [],
    );

    return (
      <View className="flex-row items-center justify-between mt-2">
        <View className="flex-row items-center gap-2 flex-1">
          <Text className="text-[28px] font-cormorantBold text-gray-900">
            {greeting},{" "}
            {isLoading ? "..." : displayName || "there"}{" "}
            <Text className="text-2xl">👋</Text>
          </Text>
          {hasPro && (
            <LinearGradient
              colors={["#FFD24A", "#FF7A2F"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className="px-3 py-1 rounded-full"
            >
              <Text className="text-white text-xs font-extrabold tracking-wide">
                PRO
              </Text>
            </LinearGradient>
          )}
        </View>
        <XPDisplay
          totalXP={totalXP}
          recentGains={recentGains}
          onClearGain={onClearGain}
          onPress={onXPPress}
          compact
        />
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
  progressBarStyle: any;
}>(
  ({
    currentStreak,
    longestStreak,
    nextMilestone,
    isLoading,
    progressBarStyle,
  }) => {
    // Subtle pulsing opacity for the "Journal to begin" placeholder
    const placeholderOpacity = useSharedValue(1);

    useEffect(() => {
      if (currentStreak === 0) {
        placeholderOpacity.value = withRepeat(
          withSequence(
            withTiming(0.4, { duration: 1200 }),
            withTiming(1, { duration: 1200 }),
          ),
          -1, // infinite
          false,
        );
      }
    }, [currentStreak]);

    const placeholderAnimStyle = useAnimatedStyle(() => ({
      opacity: placeholderOpacity.value,
    }));

    return (
      <View
        className="bg-[#FFD24A] rounded-2xl p-4 overflow-hidden"
        style={{
          shadowColor: "#D4A017",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.15,
          shadowRadius: 12,
          elevation: 4,
        }}
      >
        {/* When streak is 0 — show motivational copy */}
        {currentStreak === 0 && (
          <View className="flex-row items-center gap-1.5 mb-2">
            <HugeiconsIcon
              icon={Plant03Icon}
              size={14}
              color={PALETTE.green}
            />
            <Text className="text-gray-700 text-xs font-semibold tracking-wide uppercase">
              Start your streak today!
            </Text>
          </View>
        )}

        <View className="flex-row items-center justify-between">
          {/* Goal as the left hero when streak is 0 */}
          <View>
            <Text className="text-gray-700 text-xs font-semibold mb-1">
              {currentStreak === 0 ? "First goal" : "Current Streak"}
            </Text>
            <View className="flex-row items-center">
              {currentStreak === 0 ? (
                <>
                  <HugeiconsIcon size={24} icon={Target02Icon} fill={"#93C5FD"} />
                  <Text className="text-[28px] font-extrabold ml-1.5">
                    {isLoading ? "-" : nextMilestone}{" "}
                    <Text className="text-xs font-semibold text-gray-600">
                      days
                    </Text>
                  </Text>
                </>
              ) : (
                <>
                  <HugeiconsIcon
                    size={24}
                    icon={Fire02Icon}
                    fill={"#FCA5A5"}
                    color="#FCA5A5"
                  />
                  <Text className="text-[28px] font-extrabold ml-1.5">
                    {currentStreak}
                  </Text>
                </>
              )}
            </View>
          </View>

          {/* Right side: next goal (only when streak > 0) */}
          {currentStreak > 0 && (
            <View className="items-end">
              <Text className="text-gray-700 text-xs font-semibold mb-1">
                Goal
              </Text>
              <View className="flex-row items-center">
                <HugeiconsIcon
                  size={24}
                  icon={Target02Icon}
                  fill={PALETTE.blue}
                />
                <Text className="text-[28px] font-extrabold ml-1.5">
                  {isLoading ? "-" : nextMilestone}
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Progress bar — always visible, styled even at 0 */}
        <View className="h-3 bg-[#F0D97A] rounded-full mt-3 overflow-hidden">
          <Animated.View
            className="h-full rounded-full"
            style={[{ backgroundColor: PALETTE.lavender }, progressBarStyle]}
          />
          {/* Show a pulsing start marker when empty */}
          {currentStreak === 0 && (
            <Animated.View
              className="absolute inset-0 items-center justify-center"
              style={placeholderAnimStyle}
            >
              <Text className="text-[10px] text-gray-500 font-semibold">
                Journal to begin
              </Text>
            </Animated.View>
          )}
        </View>
      </View>
    );
  },
);

export default function JournalCalendarScreen() {
  const progressAnim = useSharedValue(0);
  const { width } = useWindowDimensions();
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



  const handleAchievementsPress = useCallback(() => {
    router.push("/tabs/screens/achievements");
  }, []);

  const handleShopPress = useCallback(() => {
    router.push("/tabs/screens/rewards-shop");
  }, []);



  const handleQuickJournalPress = useCallback(
    (prompt: QuickJournalPrompt) => {
      if (shouldShowPaywall) {
        presentPaywall();
        return;
      }
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
    [refetchStreak],
  );

  // Lazy load heavy chart component after initial render
  const [shouldLoadChart, setShouldLoadChart] = useState(false);
  const [showStreakModal, setShowStreakModal] = useState(false);

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
    posthog.capture("MyComponent loaded", { foo: "bar" });
  }, [currentStreak, nextMilestone]);

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
        <View
          className="bg-offwhite px-4 pb-24 pt-3"
          style={{ width: width }}
        >
          {/* Greeting — entrance animation index 0 */}
          <Animated.View
            entering={FadeInDown.duration(ENTRANCE_DURATION_MS).delay(
              STAGGER_DELAY_MS * 0,
            )}
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
            entering={FadeInDown.duration(ENTRANCE_DURATION_MS).delay(
              STAGGER_DELAY_MS * 3,
            )}
          >
            <Text className="text-[10px] text-gray-400 font-semibold uppercase tracking-widest mb-3 px-1">
              Journaling
            </Text>
            <FeaturedPromptCard
              prompt="What is special about today?"
              xpReward={30}
              emoji="🤓"
              onPress={() =>
                handleQuickJournalPress({
                  id: "featured_today",
                  title: "Today's Prompt",
                  description: "What is special about today?",
                  category: "Personal",
                  emoji: "✨",
                  bgColor: "#E0F7FA",
                  categoryColor: "#4A9FE8",
                })
              }
            />
          </Animated.View>

          {/* Quick Journal Section — entrance animation index 4 */}
          <Animated.View
            entering={FadeInDown.duration(ENTRANCE_DURATION_MS).delay(
              STAGGER_DELAY_MS * 4,
            )}
          >
            <QuickJournalSection
              onCardPress={handleQuickJournalPress}
              onSeeAllPress={handleSeeAllPrompts}
            />
          </Animated.View>

          {/* ── Progress ── */}
          <Animated.View
            className="mt-8"
            entering={FadeInDown.duration(ENTRANCE_DURATION_MS).delay(
              STAGGER_DELAY_MS * 5,
            )}
          >
            <Text className="text-[10px] text-gray-400 font-semibold uppercase tracking-widest mb-3 px-1">
              Progress
            </Text>
            <ChallengesSection maxItems={3} />
          </Animated.View>

          {/* Weekly Mood Chart — entrance animation index 6 */}
          <Animated.View
            className="mt-6"
            entering={FadeInDown.duration(ENTRANCE_DURATION_MS).delay(
              STAGGER_DELAY_MS * 6,
            )}
          >
            {shouldLoadChart ? (
              <WeeklyMoodChart
                startDate={startOfWeekDate}
                endDate={endOfWeekDate}
                title="This Week's Mood"
              />
            ) : (
              <View className="bg-white rounded-2xl p-4 border border-gray-100">
                <View className="flex-row items-center justify-between px-1 mb-3">
                  <View>
                    <View className="h-6 w-32 bg-gray-100 rounded-xl mb-2" />
                    <View className="h-3 w-24 bg-gray-100 rounded-lg" />
                  </View>
                  <View className="h-4 w-20 bg-gray-100 rounded-lg" />
                </View>
                <View
                  style={{ height: 270 }}
                  className="items-center justify-center"
                >
                  <View className="h-48 w-full bg-gray-50 rounded-2xl" />
                </View>
              </View>
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

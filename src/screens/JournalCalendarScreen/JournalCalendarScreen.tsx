import React, { useEffect, useMemo, useCallback, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
} from "react-native-reanimated";
import { endOfWeek, startOfWeek } from "date-fns";
import { useUserProfile } from "@/hooks/data/useUserProfile";
import WeeklyMoodChart from "@/src/components/WeeklyMoodChart";
import { getNextMilestone } from "@/hooks/data/useStreakCalculation";
import { SafeAreaView } from "@/components/ui/safe-area-view";
import { router } from "expo-router";
import { EmotionLogger } from "@/src/components/EmotionLogger";
import {
  Fire02Icon,
  Settings02Icon,
  StarsIcon,
  Target02Icon,
  Award01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
const { width, height } = Dimensions.get("window");

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
};

// Memoized TopBar component
const TopBar = React.memo(() => {
  const handlePaywallPress = useCallback(() => {
    router.push("/tabs/screens/paywall");
  }, []);

  const handleSettingsPress = useCallback(() => {
    router.push("/tabs/screens/settings");
  }, []);

  return (
    <View className="rounded-2xl overflow-hidden mb-2.5 pl-0">
      <View className="flex-row justify-between ">
        <TouchableOpacity
          onPress={handlePaywallPress}
          className="w-10 h-10 rounded-full bg-[#7B61FF] items-center justify-center"
          activeOpacity={0.8}
        >
          <HugeiconsIcon icon={StarsIcon} size={20} color={PALETTE.white} />
        </TouchableOpacity>

        <TouchableOpacity
          className="w-10 h-10 rounded-full bg-[#7B61FF] items-center justify-center"
          activeOpacity={0.8}
          onPress={handleSettingsPress}
        >
          <HugeiconsIcon
            icon={Settings02Icon}
            color={PALETTE.white}
            size={20}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
});

// Memoized Greeting component
const Greeting = React.memo<{ displayName?: string; isLoading: boolean }>(
  ({ displayName, isLoading }) => (
    <Text className="text-[34px] font-bold mt-2 text-gray-900">
      Hi, {isLoading ? "..." : displayName || "there"}{" "}
      <Text className="text-3xl">👋</Text>
    </Text>
  )
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
  }) => (
    <View className="bg-[#FFD24A] rounded-2xl p-4 flex-row items-center overflow-hidden mt-3">
      <View className="flex-1">
        {/* Streak info */}
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-gray-900 text-sm font-semibold mb-1">
              Current
            </Text>
            <View className="flex-row items-center">
              <HugeiconsIcon
                size={24}
                icon={Fire02Icon}
                fill={"#FF6A3D"}
                color="#FF6A3D"
              />

              <Text className="text-2xl font-extrabold ml-1.5">
                {currentStreak}
              </Text>
            </View>
          </View>
          <View className="items-end">
            <Text className="text-gray-900 text-sm font-semibold mb-1">
              Goal
            </Text>
            <View className="flex-row items-center">
              <HugeiconsIcon
                size={24}
                icon={Target02Icon}
                fill={PALETTE.blue}
              />
              <Text className="text-2xl font-extrabold ml-1.5">
                {isLoading ? "-" : nextMilestone}
              </Text>
            </View>
          </View>
          <View className="items-center">
            <Text className="text-gray-900 text-sm font-semibold mb-1">
              Best
            </Text>
            <View className="flex-row items-center">
              <HugeiconsIcon
                size={24}
                icon={Award01Icon}
                color={PALETTE.purple}
                fill={PALETTE.purple}
              />
              <Text className="text-2xl font-extrabold ml-1.5">
                {isLoading ? "-" : longestStreak}
              </Text>
            </View>
          </View>
        </View>

        {/* Animated progress bar */}
        <View className="h-3 bg-[#F0D97A] rounded-xl mt-3 overflow-hidden">
          <Animated.View
            className="h-full bg-[#60A6FF] rounded-lg"
            style={progressBarStyle}
          />
        </View>
      </View>
    </View>
  )
);

export default function JournalCalendarScreen() {
  const progressAnim = useSharedValue(0);
  const { data: userProfile, isLoading: isLoadingProfile } = useUserProfile();

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
  const handleEmotionLogged = useCallback((emotionScore: number) => {
    // Cache invalidation is handled automatically in useEmotionLogger hook
  }, []);

  // Lazy load heavy chart component after initial render
  const [shouldLoadChart, setShouldLoadChart] = useState(false);

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
  }, [currentStreak, nextMilestone]);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        removeClippedSubviews={true}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}
        scrollEventThrottle={16}
        contentInsetAdjustmentBehavior="automatic"
        keyboardShouldPersistTaps="handled"
      >
        {/* Outer panel container */}
        <View
          // intensity={50}
          // tint="light"
          className="bg-white p-4 pb-24 pt-3"
          style={{ width: width }}
        >
          {/* Top bar with blur background */}
          <TopBar />

          <Greeting
            displayName={userProfile?.displayName}
            isLoading={isLoadingProfile}
          />

          <StreakCard
            currentStreak={currentStreak}
            longestStreak={userProfile?.longestStreak ?? 0}
            nextMilestone={nextMilestone}
            isLoading={isLoadingProfile}
            progressBarStyle={progressBarStyle}
          />

          {/* Emotion Logger Component */}
          <View className="mt-5">
            <EmotionLogger
              selectedDate={selectedEmotionDate}
              onEmotionLogged={handleEmotionLogged}
            />
          </View>

          <View className="mt-5">
            {shouldLoadChart ? (
              <WeeklyMoodChart
                startDate={startOfWeekDate}
                endDate={endOfWeekDate}
                title="This Week's Mood"
              />
            ) : (
              <View className="bg-white rounded-3xl p-4 shadow-md border border-gray-100">
                <View className="flex-row items-center justify-between px-1 mb-3">
                  <View>
                    <View className="h-6 w-32 bg-gray-200 rounded-lg mb-2" />
                    <View className="h-3 w-24 bg-gray-100 rounded" />
                  </View>
                  <View className="h-4 w-20 bg-gray-100 rounded" />
                </View>
                <View
                  style={{ height: 270 }}
                  className="items-center justify-center"
                >
                  <View className="h-48 w-full bg-gray-50 rounded-xl" />
                </View>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

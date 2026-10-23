// ponytail: unified celebration & streak ignition step reusing existing StreakProgressGraphic
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { View, Text, ScrollView } from "react-native";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { useHeaderHeight } from "expo-router/react-navigation";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StreakProgressGraphic } from "@/src/components/Streak/StreakCelebration";
import TactileButton from "../components/TactileButton";
import { APP_FONT_FAMILIES } from "@/src/theme/typography";
import { SAGE } from "@/src/theme/palette";
import { useStreak } from "@/src/hooks/useStreak";
import { updateUserStreak } from "@/src/lib/api/mentalHealthJourneyApi";
import { useOnboardingAnalytics } from "../hooks/useOnboardingAnalytics";

interface MilestoneCelebrationStepProps {
  onCommit: () => void;
  dailyGoalMinutes?: number;
}

export const MilestoneCelebrationStep: React.FC<
  MilestoneCelebrationStepProps
> = ({ onCommit }) => {
  const [startAnim, setStartAnim] = useState(false);
  const { currentStreak } = useStreak();
  const headerHeight = useHeaderHeight();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const timer = setTimeout(() => {
      setStartAnim(true);
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  const overrideDays = useMemo(() => {
    const days = Array(7).fill(false);
    // getDay() gives 0 for Sunday, matching the weekDays indices in WeekStreakRow
    const todayIndex = new Date().getDay();
    days[todayIndex] = true;
    return days;
  }, []);

  const displayStreak = Math.max(1, currentStreak);
  const analytics = useOnboardingAnalytics();

  const handleLockIn = useCallback((): void => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    analytics.trackStreakLockIn(displayStreak);
    void updateUserStreak();
    onCommit();
  }, [displayStreak, analytics, onCommit]);

  const topPadding = (headerHeight > 0 ? headerHeight : insets.top + 44) + 12;
  const bottomPadding = Math.max(insets.bottom, 16) + 12;

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      bounces={false}
      contentInsetAdjustmentBehavior="never"
      contentContainerStyle={{
        flexGrow: 1,
        justifyContent: "space-between",
        paddingTop: topPadding,
        paddingBottom: bottomPadding,
      }}
      className="flex-1 px-6"
    >
      <View className="items-center">
        <Animated.View entering={FadeIn.duration(200)} className="items-center">
          <Text
            style={{ fontFamily: APP_FONT_FAMILIES.extraBold, color: SAGE[700] }}
            className="text-center text-xs uppercase tracking-widest"
          >
            ✦ Milestone Reached
          </Text>
          <Text
            style={{ fontFamily: APP_FONT_FAMILIES.extraBold }}
            className="mt-1 text-center text-2xl text-ink"
          >
            Day 1 Streak Ignited! 🔥
          </Text>
          <Text
            style={{ fontFamily: APP_FONT_FAMILIES.regular }}
            className="mt-2 text-center text-sm text-ink-soft max-w-[280px]"
          >
            You took your first step toward calmer thoughts today.
          </Text>
        </Animated.View>

        {/* Clean production streak flame and 7-day row */}
        <View className="items-center mt-6">
          <StreakProgressGraphic
            streak={displayStreak}
            startAnim={startAnim}
            hideMessage={true}
            overrideDays={overrideDays}
          />
        </View>
      </View>

      {/* Pinned bottom CTA */}
      <Animated.View
        entering={FadeInDown.duration(250).delay(250)}
        className="w-full mt-4"
      >
        <TactileButton label="LOCK IN DAY 1 STREAK" onPress={handleLockIn} />
      </Animated.View>
    </ScrollView>
  );
};

export default React.memo(MilestoneCelebrationStep);

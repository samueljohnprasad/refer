import React, { useEffect } from "react";
import { View, Text } from "react-native";
import Animated, {
  Easing,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
} from "react-native-reanimated";
import { useTranslation } from "react-i18next";
import {
  AnimatedFireIcon,
  GrayFireIcon,
} from "@/src/components/ui/AnimatedStatIcon";
import { useStreak } from "@/src/hooks/useStreak";
import { StreakSupportingMessage } from "./StreakCelebrationCopy";
import { StreakCelebrationFlame } from "./StreakCelebrationFlame";
import { MOTION, SPRINGS, styles } from "./streakCelebrationStyles";

function DayStreakLabel({
  startAnim,
  reducedMotion,
}: {
  startAnim: boolean;
  reducedMotion: boolean | null;
}) {
  const { t } = useTranslation("home");
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(reducedMotion ? 0 : 7);

  useEffect(() => {
    if (!startAnim) return;
    const duration = reducedMotion ? 250 : 220;
    opacity.value = withDelay(
      MOTION.labelStart,
      withTiming(1, { duration, easing: Easing.out(Easing.cubic) }),
    );
    if (!reducedMotion) {
      translateY.value = withDelay(
        MOTION.labelStart,
        withTiming(0, { duration: 220, easing: Easing.out(Easing.cubic) }),
      );
    }
  }, [startAnim, reducedMotion]);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));
  return (
    <Animated.Text style={[styles.dayStreakLabel, style]}>
      {t("streak.dayLabel")}
    </Animated.Text>
  );
}

function WeekStreakRow({
  startAnim,
  reducedMotion,
  overrideDays,
}: {
  startAnim: boolean;
  reducedMotion: boolean | null;
  overrideDays?: boolean[];
}) {
  const { weeklyProgress } = useStreak();
  const { t } = useTranslation("home");
  const labels = t("streak.weekDays", { returnObjects: true }) as string[];
  const days = overrideDays ?? weeklyProgress.days;
  const latestDoneDay = [...days].findLastIndex(Boolean);

  return (
    <View style={styles.weekRow}>
      {days.map((isCompleted, index) => (
        <DayIndicator
          key={index}
          day={labels[index]}
          isToday={index === latestDoneDay}
          isCompleted={isCompleted}
          startAnim={startAnim}
          reducedMotion={reducedMotion}
        />
      ))}
    </View>
  );
}

function DayIndicator({
  day,
  isToday,
  isCompleted,
  startAnim,
  reducedMotion,
}: {
  day: string;
  isToday: boolean;
  isCompleted: boolean;
  startAnim: boolean;
  reducedMotion: boolean | null;
}) {
  const scale = useSharedValue(1);

  useEffect(() => {
    if (!startAnim || !isToday) return;
    scale.value = reducedMotion
      ? withDelay(
          MOTION.dayActivationStart,
          withTiming(1.05, { duration: 180 }),
        )
      : withSequence(
          withDelay(
            MOTION.dayActivationStart,
            withTiming(0.84, { duration: 70 }),
          ),
          withSpring(1, SPRINGS.dayIndicator),
        );
  }, [startAnim, isToday, reducedMotion]);

  const style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  return (
    <View style={styles.dayCol}>
      <Text style={styles.dayLabel}>{day}</Text>
      <Animated.View style={[styles.dayMarker, style]}>
        {isCompleted || isToday ? (
          <AnimatedFireIcon width={28} height={28} />
        ) : (
          <GrayFireIcon width={28} height={28} />
        )}
      </Animated.View>
    </View>
  );
}

export function StreakProgressGraphic({
  streak,
  startAnim,
  hideMessage,
  overrideDays,
}: {
  streak: number;
  startAnim: boolean;
  hideMessage?: boolean;
  overrideDays?: boolean[];
}) {
  const reducedMotion = useReducedMotion();
  return (
    <View style={styles.content}>
      <StreakCelebrationFlame
        streak={streak}
        startAnim={startAnim}
        reducedMotion={reducedMotion}
      />
      <View style={styles.spacerLabel}>
        <DayStreakLabel startAnim={startAnim} reducedMotion={reducedMotion} />
      </View>
      <View style={styles.spacerWeek}>
        <WeekStreakRow
          startAnim={startAnim}
          reducedMotion={reducedMotion}
          overrideDays={overrideDays}
        />
      </View>
      {!hideMessage && (
        <View style={styles.spacerMessage}>
          <StreakSupportingMessage
            startAnim={startAnim}
            reducedMotion={reducedMotion}
          />
        </View>
      )}
    </View>
  );
}

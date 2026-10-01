import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { getDay } from "date-fns";
import { APP_FONT_FAMILIES } from "@/src/theme/typography";

const DAY_LETTERS = ["S", "M", "T", "W", "T", "F", "S"];

export interface WeekDot {
  letter: string;
  active: boolean;
  isToday: boolean;
}

/**
 * Which days of the current week (Sun→Sat) belong to the active streak.
 * Mirrors `useStreak().weeklyProgress`, but derived from the streak count the
 * celebration actually displays so the dots never disagree with the number.
 */
export function getWeekDots(streakDays: number, now: Date = new Date()): WeekDot[] {
  const todayIndex = getDay(now);
  return DAY_LETTERS.map((letter, i) => {
    const daysBack = todayIndex - i;
    return {
      letter,
      isToday: i === todayIndex,
      active: daysBack >= 0 && daysBack < streakDays,
    };
  });
}

interface WeeklyStreakDotsProps {
  streakDays: number;
  activeColor: string;
  inactiveColor: string;
  letterColor: string;
  /** Delay (ms) before the dots pop in, one after another. */
  delay?: number;
  reducedMotion?: boolean;
}

export function WeeklyStreakDots({
  streakDays,
  activeColor,
  inactiveColor,
  letterColor,
  delay = 0,
  reducedMotion = false,
}: WeeklyStreakDotsProps) {
  const dots = getWeekDots(streakDays);
  return (
    <View style={styles.row} accessibilityLabel={`${dots.filter((d) => d.active).length} active days this week`}>
      {dots.map((dot, i) => (
        <Dot
          key={dot.letter + i}
          dot={dot}
          activeColor={activeColor}
          inactiveColor={inactiveColor}
          letterColor={letterColor}
          delay={delay + i * (reducedMotion ? 0 : 45)}
          reducedMotion={reducedMotion}
        />
      ))}
    </View>
  );
}

function Dot({
  dot,
  activeColor,
  inactiveColor,
  letterColor,
  delay,
  reducedMotion,
}: {
  dot: WeekDot;
  activeColor: string;
  inactiveColor: string;
  letterColor: string;
  delay: number;
  reducedMotion: boolean;
}) {
  const scale = useSharedValue(0);

  useEffect(() => {
    scale.value = withDelay(
      delay,
      reducedMotion ? withTiming(1, { duration: 120 }) : withSpring(1, { damping: 10, stiffness: 220 }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const style = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <View style={styles.dotColumn}>
      <Animated.View
        style={[
          styles.dot,
          style,
          { backgroundColor: dot.active ? activeColor : inactiveColor },
          dot.isToday && { borderWidth: 1.5, borderColor: activeColor },
        ]}
      />
      <Text style={[styles.letter, { color: letterColor, opacity: dot.isToday ? 1 : 0.7 }]}>{dot.letter}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 8,
  },
  dotColumn: {
    alignItems: "center",
    gap: 2,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  letter: {
    fontFamily: APP_FONT_FAMILIES.extraBold,
    fontSize: 8,
    letterSpacing: 0.2,
  },
});

export default WeeklyStreakDots;

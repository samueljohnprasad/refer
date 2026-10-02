import React from "react";
import { View, Text, StyleSheet } from "react-native";
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

// ponytail: render dots directly without 7 redundant child spring hooks
export function WeeklyStreakDots({
  streakDays,
  activeColor,
  inactiveColor,
  letterColor,
}: WeeklyStreakDotsProps) {
  const dots = getWeekDots(streakDays);
  return (
    <View style={styles.row} accessibilityLabel={`${dots.filter((d) => d.active).length} active days this week`}>
      {dots.map((dot, i) => (
        <View key={dot.letter + i} style={styles.dotColumn}>
          <View
            style={[
              styles.dot,
              { backgroundColor: dot.active ? activeColor : inactiveColor },
              dot.isToday && { borderWidth: 1.5, borderColor: activeColor },
            ]}
          />
          <Text style={[styles.letter, { color: letterColor, opacity: dot.isToday ? 1 : 0.7 }]}>{dot.letter}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 6,
    paddingHorizontal: 4,
  },
  dotColumn: {
    alignItems: "center",
    gap: 4,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  letter: {
    fontFamily: APP_FONT_FAMILIES.extraBold,
    fontSize: 9,
    letterSpacing: 0.2,
  },
});

export default WeeklyStreakDots;

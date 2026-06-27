/**
 * TimelineSectionHeader
 *
 * Day badge shown at the start of each day group.
 * Renders the day number (large, bold) + weekday abbreviation (small, muted).
 * Uses dayjs for relative formatting: "Today", "Yesterday", or "27 SAT".
 */

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import dayjs from "dayjs";
import { SAGE } from "@/lib/tokens";

interface TimelineSectionHeaderProps {
  readonly date: number;
}

const TimelineSectionHeader: React.FC<TimelineSectionHeaderProps> = React.memo(
  ({ date }) => {
    const isToday: boolean = dayjs(date).isSame(dayjs(), "day");
    const isYesterday: boolean = dayjs(date).isSame(
      dayjs().subtract(1, "day"),
      "day",
    );

    if (isToday) {
      return (
        <View style={styles.container}>
          <Text style={styles.relativeText}>Today</Text>
        </View>
      );
    }

    if (isYesterday) {
      return (
        <View style={styles.container}>
          <Text style={styles.relativeText}>Yest.</Text>
        </View>
      );
    }

    const dayNum: string = dayjs(date).format("D");
    const dayStr: string = dayjs(date).format("ddd").toUpperCase();

    return (
      <View style={styles.container}>
        <Text style={styles.dayNum}>{dayNum}</Text>
        <Text style={styles.dayStr}>{dayStr}</Text>
      </View>
    );
  },
);

TimelineSectionHeader.displayName = "TimelineSectionHeader";
export { TimelineSectionHeader };

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  relativeText: {
    fontFamily: "Nunito-Bold",
    color: SAGE[800],
    fontSize: 16,
  },
  dayNum: {
    fontFamily: "Nunito-Bold",
    color: "#2C2C2E", // darker slate for number
    fontSize: 18,
    lineHeight: 22,
    marginBottom: -2,
  },
  dayStr: {
    fontFamily: "Nunito-SemiBold",
    color: SAGE[400],
    fontSize: 10,
    lineHeight: 14,
  },
});

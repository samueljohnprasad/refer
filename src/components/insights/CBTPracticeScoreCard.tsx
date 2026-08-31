import { SEMANTIC_COLORS } from "@/src/theme/colors";
import React from "react";
import { View, StyleSheet } from "react-native";
import { Text } from "react-native";
import { useWeeklyCBTSummary } from "@/src/hooks/insights/useWeeklyCBTSummary";
import { CircularGauge } from "./CircularGauge";
import { WeeklyBarChart } from "./WeeklyBarChart";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { Time02Icon } from "@hugeicons/core-free-icons";

const DashedDivider = () => (
  <View style={styles.dividerContainer}>
    <View style={styles.dashedLine} />
  </View>
);

export function CBTPracticeScoreCard() {
  const { data, isLoading } = useWeeklyCBTSummary();

  if (isLoading || !data) {
    return (
      <View style={[styles.card, { minHeight: 200, justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: '#94A3B8' }}>Loading practice score...</Text>
      </View>
    );
  }

  const { today, sevenDay } = data;

  return (
    <View style={styles.card}>
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.badge}>
          <HugeiconsIcon icon={Time02Icon} size={14} color="#16A34A" />
          <Text style={styles.badgeText}>Practice score</Text>
        </View>
        <Text style={styles.description}>
          Practice score analyses the consistency and impact of your CBT sessions
        </Text>
      </View>

      <DashedDivider />

      {/* Today's Score Section */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionEyebrow}>TODAY'S SCORE</Text>
      </View>
      <View style={styles.row}>
        <View style={styles.textColumn}>
          <Text style={styles.todayHeading}>{today.qualitativeLabel}</Text>
          <Text style={styles.subtext}>{today.insightText}</Text>
        </View>
        <View style={styles.chartColumn}>
          <CircularGauge
            score={today.score}
            maxScore={today.maxScore}
            size={110}
            strokeWidth={14}
            emoji={today.score >= 8 ? "🔥" : today.score >= 5 ? "👍" : "🌱"}
          />
        </View>
      </View>

      <DashedDivider />

      {/* 7 Days Average Section */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionEyebrow}>Average 7 days practice score</Text>
      </View>
      <View style={styles.row}>
        <View style={styles.textColumn}>
          <Text style={styles.averageHeading}>{sevenDay.averageScore.toFixed(1)}</Text>
        </View>
        <View style={styles.chartColumn}>
          <WeeklyBarChart
            data={sevenDay.dailyData}
            averageScore={sevenDay.averageScore}
            height={90}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 24,
    borderWidth: 2,
    borderColor: "#E5E5E5", // Matches happy-brand-card
    marginVertical: 12,
  },
  header: {
    marginBottom: 20,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "#DCFCE7", // SAGE-100
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 100,
    marginBottom: 12,
    gap: 6,
  },
  badgeText: {
    color: "#16A34A", // SAGE-600
    fontWeight: "700",
    fontSize: 13,
  },
  description: {
    color: "#1E293B", // SEMANTIC_COLORS.text.primary-800
    fontSize: 18,
    fontWeight: "600",
    lineHeight: 24,
  },
  dividerContainer: {
    height: 1,
    overflow: "hidden",
    marginVertical: 20,
  },
  dashedLine: {
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0", // SAGE-200
    borderStyle: "dashed",
  },
  sectionHeader: {
    marginBottom: 8,
  },
  sectionEyebrow: {
    color: "#94A3B8", // SEMANTIC_COLORS.text.primary-muted
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  textColumn: {
    flex: 1,
    paddingRight: 16,
  },
  chartColumn: {
    justifyContent: "center",
    alignItems: "center",
    width: 130, // Fixed width to align charts if needed
  },
  todayHeading: {
    fontSize: 42,
    fontWeight: "800",
    color: "#0F172A", // SEMANTIC_COLORS.text.primary-900
    letterSpacing: -1,
    marginBottom: 8,
    lineHeight: 48,
  },
  averageHeading: {
    fontSize: 48,
    fontWeight: "800",
    color: "#0F172A", // SEMANTIC_COLORS.text.primary-900
    letterSpacing: -1,
    lineHeight: 56,
  },
  subtext: {
    fontSize: 15,
    color: "#64748B", // SEMANTIC_COLORS.text.primary-500
    lineHeight: 22,
  },
});

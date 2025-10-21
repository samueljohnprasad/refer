import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useStreakInsights, useWeeklySummary } from "@/hooks/data/useStreakInsights";

const { width } = Dimensions.get("window");

export default function InsightsScreen() {
  const router = useRouter();
  const { data: insights, isLoading } = useStreakInsights();
  const { data: weeklySummary } = useWeeklySummary();

  if (isLoading || !insights) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading insights...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const maxMood = Math.max(...insights.mood_trends.map((t) => t.average_mood || 0), 1);

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTransparent: true,
          headerTitle: "Insights",
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backButton}
            >
              <Feather name="arrow-left" size={24} color="#fff" />
            </TouchableOpacity>
          ),
        }}
      />

      <LinearGradient
        colors={["#7B61FF", "#9C7CFF"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Your Journaling Journey</Text>
        <Text style={styles.headerSubtitle}>
          Discover patterns and celebrate progress
        </Text>
      </LinearGradient>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Stats Overview */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{insights.total_entries}</Text>
            <Text style={styles.statLabel}>Total Entries</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{insights.entries_this_week}</Text>
            <Text style={styles.statLabel}>This Week</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>
              {insights.journaling_pattern.consistency_score}%
            </Text>
            <Text style={styles.statLabel}>Consistency</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>
              {insights.average_mood_this_week.toFixed(1)}
            </Text>
            <Text style={styles.statLabel}>Avg Mood</Text>
          </View>
        </View>

        {/* Mood Trend Chart */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mood Trend (7 Days)</Text>
          <View style={styles.chartContainer}>
            <View style={styles.simpleMoodChart}>
              {insights.mood_trends.map((trend, index) => {
                const date = new Date(trend.date);
                const dayLabel = date.toLocaleDateString("en-US", { weekday: "short" });
                const height = ((trend.average_mood || 0) / 5) * 100;
                
                return (
                  <View key={trend.date} style={styles.chartBar}>
                    <View style={styles.barContainer}>
                      <View
                        style={[
                          styles.bar,
                          {
                            height: `${height}%`,
                            backgroundColor: trend.entry_count > 0 ? "#7B61FF" : "#E5E7EB",
                          },
                        ]}
                      />
                    </View>
                    <Text style={styles.barLabel}>{dayLabel}</Text>
                    {trend.entry_count > 0 && (
                      <Text style={styles.barValue}>{trend.average_mood.toFixed(1)}</Text>
                    )}
                  </View>
                );
              })}
            </View>
          </View>
        </View>

        {/* Journaling Patterns */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Patterns</Text>
          
          <View style={styles.patternCard}>
            <View style={styles.patternIcon}>
              <Text style={styles.patternEmoji}>⏰</Text>
            </View>
            <View style={styles.patternContent}>
              <Text style={styles.patternTitle}>Best Time to Journal</Text>
              <Text style={styles.patternValue}>
                {insights.journaling_pattern.best_time.charAt(0).toUpperCase() +
                  insights.journaling_pattern.best_time.slice(1)}
              </Text>
              <Text style={styles.patternSubtext}>
                Around {insights.journaling_pattern.most_productive_hour}:00
              </Text>
            </View>
          </View>

          <View style={styles.patternCard}>
            <View style={styles.patternIcon}>
              <Text style={styles.patternEmoji}>📅</Text>
            </View>
            <View style={styles.patternContent}>
              <Text style={styles.patternTitle}>Most Active Day</Text>
              <Text style={styles.patternValue}>
                {insights.journaling_pattern.best_day}
              </Text>
              <Text style={styles.patternSubtext}>
                You journal most on this day
              </Text>
            </View>
          </View>

          <View style={styles.patternCard}>
            <View style={styles.patternIcon}>
              <Text style={styles.patternEmoji}>📊</Text>
            </View>
            <View style={styles.patternContent}>
              <Text style={styles.patternTitle}>Weekly Average</Text>
              <Text style={styles.patternValue}>
                {insights.journaling_pattern.average_entries_per_week.toFixed(1)}{" "}
                entries
              </Text>
              <Text style={styles.patternSubtext}>
                Consistency score: {insights.journaling_pattern.consistency_score}%
              </Text>
            </View>
          </View>
        </View>

        {/* Weekly Summary */}
        {weeklySummary && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>This Week's Summary</Text>
            <View style={styles.summaryCard}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Entries</Text>
                <Text style={styles.summaryValue}>
                  {weeklySummary.entries_count}
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Average Mood</Text>
                <Text style={styles.summaryValue}>
                  {weeklySummary.average_mood.toFixed(1)}/5
                </Text>
              </View>
              {weeklySummary.top_emotions.length > 0 && (
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Top Emotions</Text>
                  <Text style={styles.summaryValue}>
                    {weeklySummary.top_emotions.join(", ")}
                  </Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Insights & Tips */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personalized Insights</Text>
          {insights.insights.map((insight, index) => (
            <View
              key={index}
              style={[
                styles.insightCard,
                insight.type === "success" && styles.insightSuccess,
                insight.type === "warning" && styles.insightWarning,
                insight.type === "info" && styles.insightInfo,
                insight.type === "tip" && styles.insightTip,
              ]}
            >
              <Text style={styles.insightIcon}>{insight.icon}</Text>
              <View style={styles.insightContent}>
                <Text style={styles.insightTitle}>{insight.title}</Text>
                <Text style={styles.insightMessage}>{insight.message}</Text>
                {insight.action && (
                  <TouchableOpacity
                    onPress={() => router.push(insight.action!.route as any)}
                    style={styles.insightAction}
                  >
                    <Text style={styles.insightActionText}>
                      {insight.action.label}
                    </Text>
                    <Feather name="arrow-right" size={16} color="#7B61FF" />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    color: "#6B7280",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    paddingTop: 100,
    paddingBottom: 32,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#fff",
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    minWidth: "45%",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statValue: {
    fontSize: 32,
    fontWeight: "800",
    color: "#7B61FF",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: "#6B7280",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 16,
  },
  chartContainer: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  simpleMoodChart: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    height: 200,
    paddingTop: 20,
  },
  chartBar: {
    flex: 1,
    alignItems: "center",
    marginHorizontal: 2,
  },
  barContainer: {
    flex: 1,
    width: "100%",
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: 8,
  },
  bar: {
    width: "80%",
    borderRadius: 4,
    minHeight: 4,
  },
  barLabel: {
    fontSize: 11,
    color: "#6B7280",
    marginTop: 4,
  },
  barValue: {
    fontSize: 10,
    fontWeight: "600",
    color: "#7B61FF",
    marginTop: 2,
  },
  patternCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  patternIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  patternEmoji: {
    fontSize: 28,
  },
  patternContent: {
    flex: 1,
    justifyContent: "center",
  },
  patternTitle: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 4,
  },
  patternValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 2,
  },
  patternSubtext: {
    fontSize: 13,
    color: "#9CA3AF",
  },
  summaryCard: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  summaryLabel: {
    fontSize: 16,
    color: "#6B7280",
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
  },
  insightCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  insightSuccess: {
    borderLeftColor: "#10B981",
  },
  insightWarning: {
    borderLeftColor: "#F59E0B",
  },
  insightInfo: {
    borderLeftColor: "#3B82F6",
  },
  insightTip: {
    borderLeftColor: "#8B5CF6",
  },
  insightIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  insightContent: {
    flex: 1,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 4,
  },
  insightMessage: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
  },
  insightAction: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  insightActionText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#7B61FF",
    marginRight: 4,
  },
});

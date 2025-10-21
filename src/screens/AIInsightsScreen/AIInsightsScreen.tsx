import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useUserProfile } from "@/hooks/data/useUserProfile";
import {
  usePreviousWeekSummary,
  useGenerateWeeklySummary,
} from "@/hooks/data/useWeeklyAISummaries";
import { subWeeks, format } from "date-fns";

const priorityColors: Record<string, string> = {
  high: "#EF4444",
  medium: "#F59E0B",
  low: "#10B981",
};

export default function AIInsightsScreen() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);

  const { data: profile } = useUserProfile();
  
  // Get cached summary for previous week
  const { data: cachedSummary, isLoading: loadingCached, refetch } = usePreviousWeekSummary();
  const generateSummary = useGenerateWeeklySummary();
  
  const previousWeek = subWeeks(new Date(), 1);
  const hasSummary = !!cachedSummary;
  const recommendations = cachedSummary?.recommendations || [];
  const weeklySummary = cachedSummary?.weekly_summary;
  const growthInsights = cachedSummary?.growth_insights || [];

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleGenerateSummary = async () => {
    try {
      await generateSummary.mutateAsync(previousWeek);
    } catch (error: any) {
      alert(error.message || "Failed to generate AI summary");
    }
  };

  const isLoading = loadingCached;
  const isGenerating = generateSummary.isPending;

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTransparent: true,
          headerTitle: "AI Insights",
          headerLeft: () => (
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Feather name="arrow-left" size={20} color="#FFF" />
            </TouchableOpacity>
          ),
        }}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {/* Header Stats */}
        <View style={styles.headerCard}>
          <LinearGradient
            colors={["#7B61FF", "#9C7CFF"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradientCard}
          >
            <Text style={styles.headerTitle}>Your Journey</Text>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>
                  {profile?.currentStreak || 0}
                </Text>
                <Text style={styles.statLabel}>Day Streak</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>
                  {weeklySummary?.entriesCount || 0}
                </Text>
                <Text style={styles.statLabel}>This Week</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>
                  {weeklySummary?.overallMood?.toFixed(1) || "0.0"}
                </Text>
                <Text style={styles.statLabel}>Avg Mood</Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* AI Recommendations */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              🎯 AI Insights for Previous Week
            </Text>
          </View>

          {!hasSummary ? (
            <View style={styles.generateContainer}>
              <Text style={styles.generateIcon}>🤖</Text>
              <Text style={styles.generateTitle}>No AI Summary Yet</Text>
              <Text style={styles.generateSubtitle}>
                Generate personalized AI insights for the week of{"\n"}
                {format(previousWeek, "MMM dd, yyyy")}
              </Text>
              
              <TouchableOpacity
                style={styles.generateButton}
                onPress={handleGenerateSummary}
                disabled={isGenerating}
              >
                <LinearGradient
                  colors={isGenerating ? ["#999", "#777"] : ["#7B61FF", "#9C7CFF"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.generateButtonGradient}
                >
                  {isGenerating ? (
                    <ActivityIndicator size="small" color="#FFF" />
                  ) : (
                    <Feather name="zap" size={20} color="#FFF" />
                  )}
                  <Text style={styles.generateButtonText}>
                    {isGenerating ? "Generating..." : "Get AI Insights for Past Week"}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>

              {isGenerating && (
                <Text style={styles.generatingHint}>
                  Analyzing your journals with AI... This may take a minute.
                </Text>
              )}
            </View>
          ) : loadingCached ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#7B61FF" />
            </View>
          ) : recommendations && recommendations.length > 0 ? (
            <>
              <View style={styles.weekBadge}>
                <Feather name="calendar" size={14} color="#7B61FF" />
                <Text style={styles.weekBadgeText}>
                  Week of {format(previousWeek, "MMM dd, yyyy")}
                </Text>
              </View>
              {recommendations.map((rec, index) => (
                <View key={index} style={styles.recommendationCard}>
                  <View style={styles.recContent}>
                  <View style={styles.recHeader}>
                    <Text style={styles.recTitle}>{rec.title}</Text>
                    <View
                      style={[
                        styles.priorityBadge,
                        { backgroundColor: priorityColors[rec.priority] },
                      ]}
                    >
                      <Text style={styles.priorityText}>
                        {rec.priority.toUpperCase()}
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.recDescription}>{rec.description}</Text>

                  <Text style={styles.actionStepsTitle}>Action Steps:</Text>
                  {rec.actionSteps.map((step, idx) => (
                    <View key={idx} style={styles.actionStep}>
                      <Text style={styles.actionStepBullet}>•</Text>
                      <Text style={styles.actionStepText}>{step}</Text>
                    </View>
                  ))}
                </View>
              </View>
            ))}
            </>
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>📝</Text>
              <Text style={styles.emptyText}>
                No recommendations generated for this week
              </Text>
            </View>
          )}
        </View>

        {/* Weekly Summary Section (only show if we have summary) */}
        {hasSummary && weeklySummary && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>📊 Weekly Summary</Text>
          </View>

          <View style={styles.summaryCard}>
            <Text style={styles.summaryPeriod}>
              {weeklySummary.weekStart} - {weeklySummary.weekEnd}
            </Text>

            <View style={styles.moodTrendContainer}>
              <Text style={styles.moodTrendLabel}>Mood Trend:</Text>
              <View
                style={[
                  styles.moodTrendBadge,
                  {
                    backgroundColor:
                      weeklySummary.moodTrend === "improving"
                        ? "#10B981"
                        : weeklySummary.moodTrend === "declining"
                        ? "#EF4444"
                        : "#F59E0B",
                  },
                ]}
              >
                <Text style={styles.moodTrendText}>
                  {weeklySummary.moodTrend === "improving"
                    ? "📈"
                    : weeklySummary.moodTrend === "declining"
                    ? "📉"
                    : "➡️"}{" "}
                  {weeklySummary.moodTrend}
                </Text>
              </View>
            </View>

            {weeklySummary.topEmotions &&
              weeklySummary.topEmotions.length > 0 && (
                <View style={styles.summarySection}>
                  <Text style={styles.summarySubtitle}>Top Emotions</Text>
                  <View style={styles.emotionTags}>
                    {weeklySummary.topEmotions.map((emotion, idx) => (
                      <View key={idx} style={styles.emotionTag}>
                        <Text style={styles.emotionText}>{emotion}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}

            {weeklySummary.keyHighlights &&
              weeklySummary.keyHighlights.length > 0 && (
                <View style={styles.summarySection}>
                  <Text style={styles.summarySubtitle}>
                    ✨ Key Highlights
                  </Text>
                  {weeklySummary.keyHighlights.map((highlight, idx) => (
                    <Text key={idx} style={styles.bulletPoint}>
                      • {highlight}
                    </Text>
                  ))}
                </View>
              )}

            {weeklySummary.motivationalMessage && (
              <View style={styles.motivationalCard}>
                <Text style={styles.motivationalIcon}>💪</Text>
                <Text style={styles.motivationalText}>
                  {weeklySummary.motivationalMessage}
                </Text>
              </View>
            )}

            {weeklySummary.nextWeekFocus &&
              weeklySummary.nextWeekFocus.length > 0 && (
                <View style={styles.summarySection}>
                  <Text style={styles.summarySubtitle}>
                    🎯 Next Week Focus
                  </Text>
                  {weeklySummary.nextWeekFocus.map((focus, idx) => (
                    <Text key={idx} style={styles.bulletPoint}>
                      • {focus}
                    </Text>
                  ))}
                </View>
              )}
          </View>
        </View>
        )}

        {/* Growth Insights Section (only show if we have insights) */}
        {hasSummary && growthInsights && growthInsights.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>🌱 Deep Growth Insights</Text>
          </View>

          {growthInsights.map((insight, index) => (
            <View key={index} style={styles.insightCard}>
              <View style={styles.insightHeader}>
                <Text style={styles.insightCategory}>{insight.category}</Text>
                <View
                  style={[
                    styles.impactBadge,
                    {
                      backgroundColor:
                        insight.impactLevel === "high"
                          ? "#EF4444"
                          : insight.impactLevel === "medium"
                          ? "#F59E0B"
                          : "#10B981",
                    },
                  ]}
                >
                  <Text style={styles.impactText}>
                    {insight.impactLevel} impact
                  </Text>
                </View>
              </View>

              <Text style={styles.insightText}>{insight.insight}</Text>

              <View style={styles.evidenceContainer}>
                <Text style={styles.evidenceTitle}>Supporting Evidence:</Text>
                {insight.supportingEvidence.map((evidence, idx) => (
                  <Text key={idx} style={styles.evidenceText}>
                    • {evidence}
                  </Text>
                ))}
              </View>

              <View style={styles.suggestionContainer}>
                <Feather
                  name="info"
                  size={18}
                  color="#F59E0B"
                  style={{ marginTop: 2 }}
                />
                <Text style={styles.suggestionText}>
                  {insight.suggestion}
                </Text>
              </View>
            </View>
          ))}
        </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8FF",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#7B61FF",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 16,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingTop: 120,
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  headerCard: {
    marginBottom: 24,
    borderRadius: 20,
    overflow: "hidden",
  },
  gradientCard: {
    padding: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FFF",
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 28,
    fontWeight: "800",
    color: "#FFF",
  },
  statLabel: {
    fontSize: 12,
    color: "#E9D5FF",
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: "rgba(255,255,255,0.3)",
  },
  section: {
    marginBottom: 40,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#0F172A",
    letterSpacing: 0.3,
  },
  loadingContainer: {
    padding: 40,
    alignItems: "center",
  },
  // Generate Button Styles
  generateContainer: {
    backgroundColor: "#FFF",
    borderRadius: 18,
    padding: 40,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  generateIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  generateTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 8,
  },
  generateSubtitle: {
    fontSize: 15,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 22,
  },
  generateButton: {
    borderRadius: 16,
    overflow: "hidden",
    width: "100%",
  },
  generateButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    gap: 10,
  },
  generateButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFF",
  },
  generatingHint: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 16,
    textAlign: "center",
    fontStyle: "italic",
  },
  // Week Badge
  weekBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    alignSelf: "flex-start",
    marginBottom: 16,
    gap: 6,
  },
  weekBadgeText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#4B5563",
  },
  recommendationCard: {
    backgroundColor: "#FFF",
    borderRadius: 18,
    padding: 20,
    marginBottom: 16,
    flexDirection: "row",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  recContent: {
    flex: 1,
  },
  recHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  recTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0F172A",
    flex: 1,
    lineHeight: 24,
  },
  priorityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    marginLeft: 10,
  },
  priorityText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#FFF",
    letterSpacing: 0.5,
  },
  recDescription: {
    fontSize: 15,
    color: "#6B7280",
    marginBottom: 20,
    lineHeight: 22,
  },
  actionStepsTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 12,
    marginTop: 2,
  },
  actionStep: {
    flexDirection: "row",
    marginBottom: 10,
    alignItems: "flex-start",
  },
  actionStepBullet: {
    fontSize: 16,
    color: "#7B61FF",
    marginRight: 10,
    lineHeight: 22,
  },
  actionStepText: {
    fontSize: 14,
    color: "#4B5563",
    flex: 1,
    lineHeight: 22,
  },
  emptyState: {
    backgroundColor: "#FFF",
    borderRadius: 18,
    padding: 48,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  emptyIcon: {
    fontSize: 56,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 15,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 22,
  },
  // Summary Styles
  summaryCard: {
    backgroundColor: "#FFF",
    borderRadius: 18,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  summaryPeriod: {
    fontSize: 17,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 20,
  },
  moodTrendContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  moodTrendLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "#4B5563",
    marginRight: 12,
  },
  moodTrendBadge: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 18,
  },
  moodTrendText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#FFF",
    textTransform: "capitalize",
  },
  summarySection: {
    marginBottom: 20,
  },
  summarySubtitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 14,
    marginTop: 2,
  },
  bulletPoint: {
    fontSize: 14,
    color: "#4B5563",
    marginBottom: 8,
    lineHeight: 22,
    paddingLeft: 4,
  },
  emotionTags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  emotionTag: {
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 18,
  },
  emotionText: {
    fontSize: 13,
    color: "#4B5563",
    fontWeight: "500",
  },
  motivationalCard: {
    backgroundColor: "#FFF9E5",
    borderRadius: 14,
    padding: 18,
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  motivationalIcon: {
    fontSize: 28,
    marginRight: 14,
    marginTop: 2,
  },
  motivationalText: {
    flex: 1,
    fontSize: 15,
    color: "#0F172A",
    lineHeight: 22,
    fontWeight: "500",
  },
  // Growth Insights
  insightCard: {
    backgroundColor: "#FFF",
    borderRadius: 18,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  insightHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  insightCategory: {
    fontSize: 12,
    fontWeight: "700",
    color: "#7B61FF",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  impactBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
  },
  impactText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#FFF",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  insightText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 16,
    lineHeight: 24,
  },
  evidenceContainer: {
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  evidenceTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#4B5563",
    marginBottom: 12,
  },
  evidenceText: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 6,
    lineHeight: 20,
    paddingLeft: 4,
  },
  suggestionContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#FFFBEB",
    borderRadius: 12,
    padding: 16,
    gap: 10,
  },
  suggestionText: {
    flex: 1,
    fontSize: 14,
    color: "#0F172A",
    lineHeight: 21,
  },
});

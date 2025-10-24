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
import { subWeeks, format, startOfWeek, endOfWeek } from "date-fns";
import { AIInsightsContent } from "@/src/components/ai/AIInsightsContent";

// Import new chart components
import { EmotionRadarChart } from "@/src/components/charts/EmotionRadarChart";
import { JournalingHeatmap } from "@/src/components/charts/JournalingHeatmap";
import { MoodCorrelationMatrix } from "@/src/components/charts/MoodCorrelationMatrix";
import { EmotionalGrowthTrajectory } from "@/src/components/charts/EmotionalGrowthTrajectory";
import { MoodTriggersAnalysis } from "@/src/components/charts/MoodTriggersAnalysis";

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
  const {
    data: cachedSummary,
    isLoading: loadingCached,
    refetch,
  } = usePreviousWeekSummary();
  const generateSummary = useGenerateWeeklySummary();

  const previousWeek = subWeeks(new Date(), 1);
  const weeklySummary = cachedSummary?.weekly_summary;
  const recommendations = cachedSummary?.recommendations;
  const growthInsights = cachedSummary?.growth_insights;

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

  const isGenerating = generateSummary.isPending;

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTransparent: true,
          headerTitle: "AI Insights",
          headerBlurEffect: "light", // <--- this enables native blur
          headerTintColor: "#000",
          headerTitleStyle: { fontWeight: "600" },

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

          {!loadingCached && !cachedSummary && (
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
                  colors={
                    isGenerating ? ["#999", "#777"] : ["#7B61FF", "#9C7CFF"]
                  }
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.generateButtonGradient}
                >
                  {isGenerating && (
                    <ActivityIndicator size="small" color="#FFF" />
                  )}
                  {!isGenerating && (
                    <Feather name="zap" size={20} color="#FFF" />
                  )}
                  <Text style={styles.generateButtonText}>
                    {isGenerating
                      ? "Generating..."
                      : "Get AI Insights for Past Week"}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>

              {isGenerating && (
                <Text style={styles.generatingHint}>
                  Analyzing your journals with AI... This may take a minute.
                </Text>
              )}
            </View>
          )}
          {loadingCached && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#7B61FF" />
            </View>
          )}
          {!loadingCached && (
            <AIInsightsContent
              loading={isGenerating || loadingCached}
              weeklySummary={weeklySummary || null}
              recommendations={recommendations || []}
              growthInsights={growthInsights || []}
            />
          )}
        </View>

        {/* Premium Chart Visualizations */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>📊 Advanced Analytics</Text>
            <TouchableOpacity
              style={styles.premiumBadge}
              onPress={() => console.log("Show premium modal")}
            >
              <LinearGradient
                colors={["#7B61FF", "#9C7CFF"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.premiumBadgeGradient}
              >
                <Feather name="star" size={12} color="#FFF" />
                <Text style={styles.premiumBadgeText}>PREMIUM</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Emotional Balance Radar Chart */}
          <View style={styles.chartContainer}>
            <EmotionRadarChart
              startDate={subWeeks(new Date(), 4)}
              endDate={new Date()}
              data={weeklySummary?.emotionRadarData || []}
              emotionInsight={weeklySummary?.emotionInsight}
              loading={
                loadingCached ||
                isGenerating ||
                !weeklySummary?.emotionRadarData?.length
              }
              premium={true}
            />
          </View>

          {/* Journaling Consistency Heatmap */}
          <View style={styles.chartContainer}>
            <JournalingHeatmap
              weeksToShow={12}
              premium={true}
              onDayPress={(date) => {
                // Navigate to specific day's journal
                console.log("Navigate to:", date);
              }}
            />
          </View>

          {/* Mood Pattern Correlation */}
          <View style={styles.chartContainer}>
            <MoodCorrelationMatrix
              premium={true}
              onInsightPress={(insight) => {
                console.log("Insight pressed:", insight);
              }}
            />
          </View>

          {/* Emotional Growth Trajectory */}
          <View style={styles.chartContainer}>
            <EmotionalGrowthTrajectory
              monthsToShow={6}
              predictMonths={3}
              premium={true}
            />
          </View>

          {/* Mood Triggers Analysis */}
          <View style={styles.chartContainer}>
            <MoodTriggersAnalysis
              premium={true}
              onTriggerPress={(trigger) => {
                console.log("Trigger pressed:", trigger);
              }}
            />
          </View>

          {/* Premium CTA */}
          <TouchableOpacity
            style={styles.premiumCTA}
            onPress={() => {
              // Show premium upgrade modal or navigate to subscription screen
              console.log("Navigate to premium subscription");
            }}
          >
            <LinearGradient
              colors={["#7B61FF", "#9C7CFF"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.premiumCTAGradient}
            >
              <View style={styles.premiumCTAContent}>
                <Text style={styles.premiumCTAIcon}>✨</Text>
                <View style={styles.premiumCTATextContainer}>
                  <Text style={styles.premiumCTATitle}>
                    Unlock Full Analytics Suite
                  </Text>
                  <Text style={styles.premiumCTASubtitle}>
                    Get personalized insights, predictive analytics, and
                    unlimited AI analysis
                  </Text>
                </View>
                <Feather name="chevron-right" size={24} color="#FFF" />
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </View>
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
  // New chart styles
  chartContainer: {
    marginBottom: 24,
  },
  premiumBadge: {
    borderRadius: 12,
    overflow: "hidden",
  },
  premiumBadgeGradient: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 4,
  },
  premiumBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#FFF",
    letterSpacing: 0.5,
  },
  premiumCTA: {
    marginTop: 32,
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#7B61FF",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  premiumCTAGradient: {
    padding: 24,
  },
  premiumCTAContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  premiumCTAIcon: {
    fontSize: 40,
    marginRight: 16,
  },
  premiumCTATextContainer: {
    flex: 1,
    marginRight: 12,
  },
  premiumCTATitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#FFF",
    marginBottom: 4,
  },
  premiumCTASubtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.9)",
    lineHeight: 20,
  },
});

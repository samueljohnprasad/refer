import React from "react";
import {
  View,
  Text,
  Modal,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { BlurView } from "expo-blur";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import type {
  AIRecommendation,
  WeeklySummary,
  GrowthInsight,
} from "@/src/network/genAi";

interface AIInsightsModalProps {
  visible: boolean;
  onClose: () => void;
  weekStart: string;
  weekEnd: string;
  recommendations: AIRecommendation[];
  weeklySummary: WeeklySummary | null;
  growthInsights: GrowthInsight[];
  loading?: boolean;
}

const priorityColors: Record<string, string> = {
  high: "#EF4444",
  medium: "#F59E0B",
  low: "#10B981",
};

/**
 * Presentational modal component for displaying AI weekly insights
 * Shows recommendations, weekly summary, and growth insights
 */
export const AIInsightsModal: React.FC<AIInsightsModalProps> = ({
  visible,
  onClose,
  weekStart,
  weekEnd,
  recommendations,
  weeklySummary,
  growthInsights,
  loading = false,
}) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <BlurView intensity={80} tint="dark" style={styles.modalOverlay}>
        <View style={styles.bottomSheet}>
          {/* Handle bar for swipe indication */}
          <View style={styles.handleBar} />

          {/* Header */}
          <View style={styles.modalHeader}>
            <View style={styles.headerContent}>
              <Text style={styles.modalTitle}>✨ AI Weekly Insights</Text>
              <Text style={styles.modalSubtitle}>
                {weekStart} - {weekEnd}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Feather name="x" size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          {/* Content */}
          <ScrollView
            style={styles.modalContent}
            showsVerticalScrollIndicator={false}
            bounces={true}
          >
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#7B61FF" />
                <Text style={styles.loadingText}>Loading insights...</Text>
              </View>
            ) : (
              <>
                {/* Weekly Summary */}
                {weeklySummary && (
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>📊 Weekly Summary</Text>
                    <View style={styles.summaryCard}>
                      {/* Mood Trend */}
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

                      {/* Top Emotions */}
                      {weeklySummary.topEmotions &&
                        weeklySummary.topEmotions.length > 0 && (
                          <View style={styles.emotionsSection}>
                            <Text style={styles.subsectionTitle}>
                              Top Emotions
                            </Text>
                            <View style={styles.emotionTags}>
                              {weeklySummary.topEmotions.map((emotion, idx) => (
                                <View key={idx} style={styles.emotionTag}>
                                  <Text style={styles.emotionText}>
                                    {emotion}
                                  </Text>
                                </View>
                              ))}
                            </View>
                          </View>
                        )}

                      {/* Key Highlights */}
                      {weeklySummary.keyHighlights &&
                        weeklySummary.keyHighlights.length > 0 && (
                          <View style={styles.subsection}>
                            <Text style={styles.subsectionTitle}>
                              ✨ Key Highlights
                            </Text>
                            {weeklySummary.keyHighlights.map(
                              (highlight, idx) => (
                                <Text key={idx} style={styles.bulletPoint}>
                                  • {highlight}
                                </Text>
                              )
                            )}
                          </View>
                        )}

                      {/* Motivational Message */}
                      {weeklySummary.motivationalMessage && (
                        <View style={styles.motivationalCard}>
                          <Text style={styles.motivationalIcon}>💪</Text>
                          <Text style={styles.motivationalText}>
                            {weeklySummary.motivationalMessage}
                          </Text>
                        </View>
                      )}

                      {/* Next Week Focus */}
                      {weeklySummary.nextWeekFocus &&
                        weeklySummary.nextWeekFocus.length > 0 && (
                          <View style={styles.subsection}>
                            <Text style={styles.subsectionTitle}>
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

                {/* Recommendations */}
                {recommendations && recommendations.length > 0 && (
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>
                      🎯 Personalized Recommendations
                    </Text>
                    {recommendations.map((rec, index) => (
                      <View key={index} style={styles.recommendationCard}>
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

                        <Text style={styles.recDescription}>
                          {rec.description}
                        </Text>

                        <Text style={styles.actionStepsTitle}>
                          Action Steps:
                        </Text>
                        {rec.actionSteps.map((step, idx) => (
                          <View key={idx} style={styles.actionStep}>
                            <Text style={styles.actionStepBullet}>•</Text>
                            <Text style={styles.actionStepText}>{step}</Text>
                          </View>
                        ))}
                      </View>
                    ))}
                  </View>
                )}

                {/* Growth Insights */}
                {growthInsights && growthInsights.length > 0 && (
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>
                      🌱 Deep Growth Insights
                    </Text>
                    {growthInsights.map((insight, index) => (
                      <View key={index} style={styles.insightCard}>
                        <View style={styles.insightHeader}>
                          <Text style={styles.insightCategory}>
                            {insight.category}
                          </Text>
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
                          <Text style={styles.evidenceTitle}>
                            Supporting Evidence:
                          </Text>
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

                {/* Empty state */}
                {!weeklySummary &&
                  recommendations.length === 0 &&
                  growthInsights.length === 0 && (
                    <View style={styles.emptyState}>
                      <Text style={styles.emptyIcon}>📝</Text>
                      <Text style={styles.emptyText}>
                        No insights available for this week
                      </Text>
                    </View>
                  )}

                {/* Bottom padding */}
                <View style={{ height: 40 }} />
              </>
            )}
          </ScrollView>
        </View>
      </BlurView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  bottomSheet: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "90%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 10,
  },
  handleBar: {
    width: 40,
    height: 5,
    backgroundColor: "#D1D5DB",
    borderRadius: 3,
    alignSelf: "center",
    marginTop: 12,
    marginBottom: 16,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  headerContent: {
    flex: 1,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 4,
  },
  modalSubtitle: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
  },
  closeButton: {
    padding: 4,
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  loadingContainer: {
    paddingVertical: 60,
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 15,
    color: "#6B7280",
  },
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 16,
  },
  summaryCard: {
    backgroundColor: "#F9FAFB",
    borderRadius: 16,
    padding: 20,
  },
  moodTrendContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  moodTrendLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "#4B5563",
    marginRight: 12,
  },
  moodTrendBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  moodTrendText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#FFF",
    textTransform: "capitalize",
  },
  emotionsSection: {
    marginBottom: 16,
  },
  subsection: {
    marginBottom: 16,
  },
  subsectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 10,
  },
  emotionTags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  emotionTag: {
    backgroundColor: "#E5E7EB",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
  },
  emotionText: {
    fontSize: 13,
    color: "#4B5563",
    fontWeight: "500",
  },
  bulletPoint: {
    fontSize: 14,
    color: "#4B5563",
    marginBottom: 6,
    lineHeight: 20,
    paddingLeft: 4,
  },
  motivationalCard: {
    backgroundColor: "#FFF9E5",
    borderRadius: 14,
    padding: 16,
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 8,
  },
  motivationalIcon: {
    fontSize: 24,
    marginRight: 12,
    marginTop: 2,
  },
  motivationalText: {
    flex: 1,
    fontSize: 14,
    color: "#0F172A",
    lineHeight: 20,
    fontWeight: "500",
  },
  recommendationCard: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 18,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  recHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  recTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#0F172A",
    flex: 1,
    paddingRight: 8,
  },
  priorityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#FFF",
    letterSpacing: 0.5,
  },
  recDescription: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 16,
    lineHeight: 20,
  },
  actionStepsTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 10,
  },
  actionStep: {
    flexDirection: "row",
    marginBottom: 8,
    alignItems: "flex-start",
  },
  actionStepBullet: {
    fontSize: 16,
    color: "#7B61FF",
    marginRight: 8,
    lineHeight: 20,
  },
  actionStepText: {
    fontSize: 14,
    color: "#4B5563",
    flex: 1,
    lineHeight: 20,
  },
  insightCard: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 18,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  insightHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
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
    paddingVertical: 4,
    borderRadius: 12,
  },
  impactText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#FFF",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  insightText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#0F172A",
    marginBottom: 14,
    lineHeight: 22,
  },
  evidenceContainer: {
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
  },
  evidenceTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#4B5563",
    marginBottom: 8,
  },
  evidenceText: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 4,
    lineHeight: 18,
    paddingLeft: 4,
  },
  suggestionContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#FFFBEB",
    borderRadius: 12,
    padding: 14,
    gap: 10,
  },
  suggestionText: {
    flex: 1,
    fontSize: 13,
    color: "#0F172A",
    lineHeight: 19,
  },
  emptyState: {
    paddingVertical: 60,
    alignItems: "center",
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 15,
    color: "#6B7280",
    textAlign: "center",
  },
});

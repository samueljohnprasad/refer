import React from "react";
import { View, ActivityIndicator } from "react-native";
import { Text } from "@/src/components/ui/Text";
import { Card } from "@/src/components/ui/Card";
import { HugeiconsIcon } from "@hugeicons/react-native";
import {
  Target03Icon,
  Leaf01Icon,
  InformationCircleIcon,
} from "@hugeicons/core-free-icons";
import type {
  AIRecommendation,
  WeeklySummary,
  GrowthInsight,
} from "@/src/network/genAi";

interface AIInsightsContentProps {
  loading?: boolean;
  recommendations: AIRecommendation[];
  growthInsights: GrowthInsight[];
}

const priorityColors: Record<string, string> = {
  high: "#EF4444",
  medium: "#F59E0B",
  low: "#10B981",
};

/**
 * Presentational component for AI insights content
 * Displays weekly summary, recommendations, and growth insights
 */
export const AIInsightsContent: React.FC<AIInsightsContentProps> = ({
  loading = false,
  recommendations,
  growthInsights,
}) => {
  if (loading) {
    return (
      <View className="py-12 items-center">
        <ActivityIndicator size="large" color="#7B61FF" />
        <Text variant="body" color="muted" className="mt-4">
          Loading insights...
        </Text>
      </View>
    );
  }

  return (
    <>
      {/* Weekly Summary (Migrated to WeeklySummaryCard component) */}

      {/* Recommendations */}
      {!!recommendations.length && (
        <View className="mb-6">
          <View className="flex-row items-center gap-2 mb-4">
            <View className="w-8 h-8 rounded-full bg-purple-50 items-center justify-center">
              <HugeiconsIcon icon={Target03Icon} size={18} color="#7B61FF" />
            </View>
            <Text variant="h2">
              Personalized Recommendations
            </Text>
          </View>
          {recommendations.map((rec, index) => (
            <Card
              key={index}
              variant="tile"
              className="mb-3"
            >
              <View className="flex-row justify-between items-start mb-3 gap-2">
                <Text variant="h3" className="flex-1">
                  {rec.title}
                </Text>
                <View
                  className={`px-2.5 py-1 rounded-lg ${
                    priorityColors[rec.priority] === "#EF4444"
                      ? "bg-red-500"
                      : priorityColors[rec.priority] === "#F59E0B"
                      ? "bg-amber-500"
                      : "bg-emerald-500"
                  }`}
                >
                  <Text variant="chip" color="surface">
                    {rec.priority.toUpperCase()}
                  </Text>
                </View>
              </View>

              <Text variant="body" className="mb-4">
                {rec.description}
              </Text>

              <Text variant="label-bold" className="mb-2">
                Action Steps:
              </Text>
              {rec.actionSteps.map((step, idx) => (
                <View key={idx} className="flex-row mb-2 items-start">
                  <Text variant="body" color="premium" className="mr-2">
                    •
                  </Text>
                  <Text variant="body" className="flex-1">
                    {step}
                  </Text>
                </View>
              ))}
            </Card>
          ))}
        </View>
      )}

      {/* Growth Insights */}
      {growthInsights && growthInsights.length > 0 && (
        <View className="mb-6">
          <View className="flex-row items-center gap-2 mb-4">
            <View className="w-8 h-8 rounded-full bg-green-50 items-center justify-center">
              <HugeiconsIcon icon={Leaf01Icon} size={18} color="#10B981" />
            </View>
            <Text variant="h2">
              Deep Growth Insights
            </Text>
          </View>
          {growthInsights.map((insight, index) => (
            <Card
              key={index}
              variant="tile"
              className="mb-3"
            >
              <View className="flex-row justify-between items-start mb-3 gap-2">
                <Text variant="eyebrow" color="premium">
                  {insight.category}
                </Text>
                <View
                  className={`px-2.5 py-1 rounded-lg ${
                    insight.impactLevel === "high"
                      ? "bg-red-500"
                      : insight.impactLevel === "medium"
                      ? "bg-amber-500"
                      : "bg-emerald-500"
                  }`}
                >
                  <Text variant="chip" color="surface" className="uppercase">
                    {insight.impactLevel} impact
                  </Text>
                </View>
              </View>

              <Text variant="h3" className="mb-3">
                {insight.insight}
              </Text>

              <View className="bg-gray-50 rounded-lg p-3 mb-3">
                <Text variant="label-bold" className="mb-2">
                  Supporting Evidence:
                </Text>
                {insight.supportingEvidence.map((evidence, idx) => (
                  <Text
                    key={idx}
                    variant="caption"
                    className="mb-1 pl-1"
                  >
                    • {evidence}
                  </Text>
                ))}
              </View>

              <View className="flex-row items-start bg-purple-50 rounded-lg p-3 gap-2 border border-purple-100">
                <View className="w-5 h-5 rounded-full bg-purple-100 items-center justify-center mt-0.5">
                  <HugeiconsIcon
                    icon={InformationCircleIcon}
                    size={14}
                    color="#7B61FF"
                  />
                </View>
                <Text variant="caption" className="flex-1">
                  {insight.suggestion}
                </Text>
              </View>
            </Card>
          ))}
        </View>
      )}

      {/* Empty state */}
      {recommendations.length === 0 &&
        growthInsights.length === 0 && (
          <View className="py-12 items-center">
            <HugeiconsIcon icon={InformationCircleIcon} size={48} color="#9CA3AF" />
            <Text variant="body" color="muted" className="text-center mt-3">
              No insights available for this week
            </Text>
          </View>
        )}

      {/* Bottom padding */}
      <View className="h-10" />
    </>
  );
};

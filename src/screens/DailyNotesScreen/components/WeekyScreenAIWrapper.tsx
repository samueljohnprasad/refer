import { useWeeklyAISummary } from "@/hooks/data/useWeeklyAISummaries";
import React from "react";
import { View } from "react-native";
import { currentWeekViewAtom } from "../atoms";
import { useAtomValue } from "jotai";
import { AIInsightsContent } from "@/src/components/ai/AIInsightsContent";
import { WeeklySummaryCard } from "@/src/components/ai/WeeklySummaryCard";
import { AdvancedAnalyticsCharts } from "@/src/components/ai/AdvancedAnalyticsCharts";

const WeekyScreenAIWrapper = () => {
  const currentWeekView = useAtomValue(currentWeekViewAtom);
  const { data: weeklyAISummary, isLoading: isAILoading } = useWeeklyAISummary(
    currentWeekView,
    { enabled: true }
  );

  return (
    <View>
      {/* Weekly Summary */}
      {!isAILoading && (
        <WeeklySummaryCard
          weeklySummary={weeklyAISummary?.weekly_summary || null}
          showTitle={true}
        />
      )}

      {/* Advanced Analytics Charts */}
      <AdvancedAnalyticsCharts
        weeklySummary={weeklyAISummary?.weekly_summary || null}
        loading={isAILoading}
        showPremiumBadge={false}
        showTitle={true}
      />

      {/* Recommendations and Growth Insights */}
      <AIInsightsContent
        loading={isAILoading}
        weeklySummary={null}
        recommendations={weeklyAISummary?.recommendations || []}
        growthInsights={weeklyAISummary?.growth_insights || []}
      />
    </View>
  );
};

export default WeekyScreenAIWrapper;

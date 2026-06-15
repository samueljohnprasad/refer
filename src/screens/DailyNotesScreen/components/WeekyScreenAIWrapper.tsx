import { useWeeklyAISummary } from "@/hooks/data/useWeeklyAISummaries";
import React from "react";
import { View } from "react-native";
import { currentWeekViewAtom } from "../atoms";
import { useAtomValue } from "jotai";
import SuspensLoader from "@/src/components/SuspensLoader";

// Static imports to avoid Metro bundler React.lazy chunk resolution crashes
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
      <SuspensLoader>
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
          recommendations={weeklyAISummary?.recommendations || []}
          growthInsights={weeklyAISummary?.growth_insights || []}
        />
      </SuspensLoader>
    </View>
  );
};

export default WeekyScreenAIWrapper;

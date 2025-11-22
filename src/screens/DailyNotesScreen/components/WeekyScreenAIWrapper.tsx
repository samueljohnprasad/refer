import { useWeeklyAISummary } from "@/hooks/data/useWeeklyAISummaries";
import React from "react";
import { View } from "react-native";
import { currentWeekViewAtom } from "../atoms";
import { useAtomValue } from "jotai";
import SuspensLoader from "@/src/components/SuspensLoader";

// Lazy load AI components
const AIInsightsContent = React.lazy(() =>
  import("@/src/components/ai/AIInsightsContent").then((module) => ({
    default: module.AIInsightsContent,
  }))
);
const WeeklySummaryCard = React.lazy(() =>
  import("@/src/components/ai/WeeklySummaryCard").then((module) => ({
    default: module.WeeklySummaryCard,
  }))
);
const AdvancedAnalyticsCharts = React.lazy(() =>
  import("@/src/components/ai/AdvancedAnalyticsCharts").then((module) => ({
    default: module.AdvancedAnalyticsCharts,
  }))
);

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
          weeklySummary={null}
          recommendations={weeklyAISummary?.recommendations || []}
          growthInsights={weeklyAISummary?.growth_insights || []}
        />
      </SuspensLoader>
    </View>
  );
};

export default WeekyScreenAIWrapper;

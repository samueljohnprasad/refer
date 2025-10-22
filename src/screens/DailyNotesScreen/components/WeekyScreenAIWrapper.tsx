import { useWeeklyAISummary } from "@/hooks/data/useWeeklyAISummaries";
import React from "react";
import { currentWeekViewAtom } from "../atoms";
import { useAtomValue, useSetAtom } from "jotai";
import { AIInsightsContent } from "@/src/components/ai/AIInsightsContent";

const WeekyScreenAIWrapper = () => {
  const currentWeekView = useAtomValue(currentWeekViewAtom);
  const { data: weeklyAISummary, isLoading: isAILoading } = useWeeklyAISummary(
    currentWeekView,
    { enabled: true }
  );

  return (
    <AIInsightsContent
      loading={isAILoading}
      weeklySummary={weeklyAISummary?.weekly_summary || null}
      recommendations={weeklyAISummary?.recommendations || []}
      growthInsights={weeklyAISummary?.growth_insights || []}
    />
  );
};

export default WeekyScreenAIWrapper;

import React from "react";
import { View } from "react-native";
import { useTranslation } from "react-i18next";
import { Text } from "@/components/ui/Text";
import { useDeterministicInsight } from "@/src/hooks/insights/useDeterministicInsight";

export function DeterministicInsightCard() {
  const { t } = useTranslation("common");
  const { data, isLoading, isError } = useDeterministicInsight();

  if (isLoading) {
    return <InsightShell title={t("insights.ui.yourPattern")} body={t("timelineAnalytics.loading")} />;
  }

  if (isError) {
    return <InsightShell title={t("insights.ui.yourPattern")} body={t("timelineAnalytics.emptyDescription")} />;
  }

  if (!data || data.state === "invalid-timezone") {
    return <InsightShell title={t("insights.ui.yourPattern")} body={t("timelineAnalytics.emptyDescription")} />;
  }

  if (data.state === "insufficient-data") {
    return (
      <InsightShell
        title={t("insights.ui.yourPattern")}
        body={t("insights.ui.unlockDescription")}
        detail={t("insights.ui.deterministicProgress", {
          defaultValue: "{{observationCount}}/5 observations · {{activeDayCount}}/3 days · 30 days",
          observationCount: data.observationCount,
          activeDayCount: data.activeDayCount,
        })}
      />
    );
  }

  const pathLabel = data.patternPathId
    ? t(`insights.labels.exercises.${data.patternPathId}`, {
        defaultValue: data.patternPathId,
      })
    : t("insights.ui.yourPattern");

  return (
    <InsightShell
      title={t("insights.ui.yourPattern")}
      body={t("insights.ui.deterministicPattern", {
        defaultValue: "You returned to {{path}} {{observationCount}} times across {{activeDayCount}} days.",
        path: pathLabel,
        observationCount: data.observationCount,
        activeDayCount: data.activeDayCount,
      })}
      detail={t("insights.ui.deterministicDetail", {
        defaultValue: "{{observationCount}} observations · {{activeDayCount}} active days · 30 days",
        observationCount: data.observationCount,
        activeDayCount: data.activeDayCount,
      })}
    />
  );
}

function InsightShell({
  title,
  body,
  detail,
}: {
  title: string;
  body: string;
  detail?: string;
}) {
  return (
    <View className="rounded-2xl border border-sage-200 bg-sage-50 p-4">
      <Text className="happy-font-heading-bold text-lg text-sage-800">{title}</Text>
      <Text className="happy-font-body text-sm text-ink mt-2">{body}</Text>
      {detail ? <Text className="happy-font-body-medium text-xs text-sage-700 mt-3">{detail}</Text> : null}
    </View>
  );
}

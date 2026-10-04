import React from "react";
import { useTranslation } from "react-i18next";
import { Text } from "@/src/components/ui/Text";
import { router } from "expo-router";
import { useInsightNudge } from "@/src/hooks/insights/useInsightNudge";
import { Card } from "@/src/components/ui/Card";

export const InsightNudgeCard: React.FC = React.memo(() => {
  const { t } = useTranslation("common");
  const nudge = useInsightNudge();

  if (!nudge) {
    return (
      <Card
        onPress={() => router.push("/tabs/screens/insights" as never)}
        variant="tile"
        radius="xl"
        contentClassName="p-4"
      >
        <Text className="happy-font-body-bold text-[13px] text-ink-muted mb-1.5">{t("insights.ui.yourPractice")}</Text>
        <Text className="happy-font-body-bold text-[15px] text-ink leading-snug">
          {t("insights.ui.trackJourney")}
        </Text>
        <Text className="happy-font-body text-[13px] text-ink-muted mt-1 leading-relaxed">
          {t("insights.ui.unlockDescription")}
        </Text>
        <Text className="happy-font-body-bold text-[13px] text-sage-600 mt-3">
          {t("insights.ui.viewInsights")} →
        </Text>
      </Card>
    );
  }

  const handlePress = () => {
    router.push("/tabs/screens/insights" as never);
  };

  return (
    <Card
      onPress={handlePress}
      variant="tile"
      radius="xl"
      contentClassName="p-4"
      accessibilityLabel={`${nudge.message} ${nudge.detail}`}
    >
      <Text className="happy-font-body-bold text-[13px] text-ink-muted mb-1.5">{t("insights.ui.yourPattern")}</Text>
      <Text className="happy-font-body-bold text-[15px] text-ink leading-snug">
        {nudge.message}
      </Text>
      <Text className="happy-font-body text-[13px] text-ink-muted mt-1 leading-relaxed">
        {nudge.detail}
      </Text>
      <Text className="happy-font-body-bold text-[13px] text-sage-600 mt-3">
        {nudge.ctaLabel} →
      </Text>
    </Card>
  );
});

InsightNudgeCard.displayName = "InsightNudgeCard";

import React from "react";
import { Text } from "@/src/components/ui/Text";
import { router } from "expo-router";
import { useInsightNudge } from "@/src/hooks/insights/useInsightNudge";
import { Card } from "@/src/components/ui/Card";

export const InsightNudgeCard: React.FC = React.memo(() => {
  const nudge = useInsightNudge();

  if (!nudge) {
    return (
      <Card
        onPress={() => router.push("/tabs/screens/insights" as never)}
        variant="tile"
        radius="xl"
        contentClassName="p-4"
      >
        <Text className="happy-font-body-bold text-[13px] text-ink-muted mb-1.5">Your Practice</Text>
        <Text className="happy-font-body-bold text-[15px] text-ink leading-snug">
          Track your mental health journey
        </Text>
        <Text className="happy-font-body text-[13px] text-ink-muted mt-1 leading-relaxed">
          Complete exercises to unlock AI insights and view your personal progress.
        </Text>
        <Text className="happy-font-body-bold text-[13px] text-sage-600 mt-3">
          View Insights →
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
      <Text className="happy-font-body-bold text-[13px] text-ink-muted mb-1.5">Your pattern</Text>
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

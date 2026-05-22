import React from "react";
import { View, Pressable } from "react-native";
import { Text } from "@/components/ui/text";
import { router } from "expo-router";
import { useInsightNudge } from "@/src/hooks/insights/useInsightNudge";

export const InsightNudgeCard: React.FC = React.memo(() => {
  const nudge = useInsightNudge();

  if (!nudge) return null;

  const handlePress = () => {
    router.push("/tabs/screens/insights" as never);
  };

  return (
    <Pressable
      onPress={handlePress}
      className="happy-brand-card rounded-2xl p-4 active:opacity-90"
      accessibilityRole="button"
      accessibilityLabel={`${nudge.message} ${nudge.detail}`}
    >
      <Text className="happy-brand-eyebrow mb-1.5">Your Pattern</Text>
      <Text className="happy-font-body-bold text-[15px] text-ink leading-snug">
        {nudge.message}
      </Text>
      <Text className="happy-font-body text-[13px] text-ink-muted mt-1 leading-relaxed">
        {nudge.detail}
      </Text>
      <Text className="happy-font-body-bold text-[13px] text-sage-600 mt-3">
        {nudge.ctaLabel} →
      </Text>
    </Pressable>
  );
});

InsightNudgeCard.displayName = "InsightNudgeCard";

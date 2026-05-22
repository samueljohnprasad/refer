import React from "react";
import { View, Pressable } from "react-native";
import { Text } from "@/components/ui/text";
import { useRevenueCat } from "@/src/context/RevenueCatProvider";
import { useThoughtPatterns } from "@/src/hooks/insights/useThoughtPatterns";

export function ThoughtPatternsCard() {
  const { hasPro, presentPaywall } = useRevenueCat();
  const { data, isLoading } = useThoughtPatterns();

  if (!hasPro) {
    return <LockedCard onUnlock={presentPaywall} />;
  }

  if (isLoading) {
    return (
      <View className="happy-brand-card rounded-2xl p-4">
        <Text className="happy-brand-eyebrow">Analyzing patterns...</Text>
      </View>
    );
  }

  if (!data) return null;

  return (
    <View className="happy-brand-card rounded-2xl p-4">
      <Text className="happy-font-body-bold text-[13px] text-ink mb-3">
        Your Thought Patterns
      </Text>
      <View className="flex-row flex-wrap gap-2 mb-3">
        {data.themes.map((t) => (
          <View
            key={t.theme}
            className="happy-brand-status-chip px-3 py-1.5 flex-row items-center gap-1"
          >
            <Text className="happy-font-body-bold text-[11px] text-sage-700">
              {t.theme}
            </Text>
            <Text className="happy-font-body-bold text-[10px] text-sage-500">
              {t.count}x
            </Text>
          </View>
        ))}
      </View>
      <Text className="happy-font-body text-[12px] text-ink-soft leading-relaxed">
        {data.insight}
      </Text>
      <Text className="happy-font-body text-[11px] text-ink-muted mt-2">
        {data.triggerContext}
      </Text>
    </View>
  );
}

function LockedCard({ onUnlock }: { onUnlock: () => void }) {
  return (
    <Pressable
      onPress={onUnlock}
      className="happy-brand-card rounded-2xl p-4 active:opacity-80"
    >
      <View className="flex-row items-center gap-2 mb-1">
        <Text className="text-[14px]">🔒</Text>
        <Text className="happy-font-body-bold text-[13px] text-ink">
          Thought Patterns
        </Text>
      </View>
      <Text className="happy-font-body text-[12px] text-ink-muted">
        Unlock AI-detected themes in your thinking
      </Text>
    </Pressable>
  );
}

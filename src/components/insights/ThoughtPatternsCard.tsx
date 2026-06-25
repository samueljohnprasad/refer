import React from "react";
import { View, Pressable } from "react-native";
import { Text } from "@/components/ui/text";
import { useRevenueCat } from "@/src/context/RevenueCatProvider";
import { useThoughtPatterns } from "@/src/hooks/insights/useThoughtPatterns";
import { nutrieStyles } from "@/src/screens/InsightsScreen/InsightsScreen";

export function ThoughtPatternsCard() {
  const { hasPro, presentPaywall } = useRevenueCat();
  const { data, isLoading } = useThoughtPatterns();

  if (!hasPro) {
    return <LockedCard onUnlock={presentPaywall} />;
  }

  if (isLoading) {
    return (
      <View style={nutrieStyles.card}>
        <Text className="happy-brand-eyebrow">Analyzing patterns...</Text>
      </View>
    );
  }

  if (!data) return null;

  return (
    <View style={nutrieStyles.card}>
      <Text style={nutrieStyles.sectionTitle}>
        Your Thought Patterns
      </Text>
      <View className="flex-row flex-wrap gap-2 mb-3 mt-1">
        {data.themes.map((t) => (
          <View
            key={t.theme}
            style={[nutrieStyles.inlinePill, { backgroundColor: "#E8FBF0", borderColor: "#A7F3D0" }]}
          >
            <Text style={[nutrieStyles.inlinePillText, { color: "#166534" }]}>
              {t.theme}
            </Text>
            <Text style={[nutrieStyles.inlinePillText, { color: "#166534", opacity: 0.7 }]}>
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
      style={({ pressed }) => [
        nutrieStyles.card,
        pressed && { opacity: 0.92, transform: [{ scale: 0.985 }] }
      ]}
    >
      <View className="flex-row items-center gap-2 mb-1">
        <Text className="text-[14px]">🔒</Text>
        <Text style={nutrieStyles.sectionTitle} className="mb-0">
          Thought Patterns
        </Text>
      </View>
      <Text className="happy-font-body text-[12px] text-ink-muted">
        Unlock AI-detected themes in your thinking
      </Text>
    </Pressable>
  );
}

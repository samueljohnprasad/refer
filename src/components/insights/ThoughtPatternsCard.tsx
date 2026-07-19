import React from "react";
import { View, Pressable } from "react-native";
import { Text } from "@/src/components/ui/Text";
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
      <View className="happy-brand-card rounded-[24px] p-5" style={{ backgroundColor: "#FFFFFF" }}>
        <Text className="happy-brand-eyebrow">Analyzing patterns...</Text>
      </View>
    );
  }

  if (!data) return null;

  return (
    <View className="happy-brand-card rounded-[24px] p-5" style={{ backgroundColor: "#FFFFFF" }}>
      <Text className="happy-font-heading-bold text-[18px] tracking-tight text-ink mb-3">
        Your Thought Patterns
      </Text>
      <View className="flex-row flex-wrap gap-2 mb-3 mt-1">
        {data.themes.map((t) => (
          <View
            key={t.theme}
            className="flex-row items-center gap-1 px-2 py-1 rounded-[10px] border" style={[{ backgroundColor: "#E8FBF0", borderColor: "#A7F3D0" }]}
          >
            <Text className="text-[11px] font-semibold" style={[{ color: "#166534" }]}>
              {t.theme}
            </Text>
            <Text className="text-[11px] font-semibold" style={[{ color: "#166534", opacity: 0.7 }]}>
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
      className="happy-brand-card rounded-[24px] p-5"
      style={({ pressed }) => [
        { backgroundColor: "#FFFFFF" },
        pressed && { opacity: 0.92, transform: [{ scale: 0.985 }] }
      ]}
    >
      <View className="flex-row items-center gap-2 mb-1">
        <Text className="text-[14px]">🔒</Text>
        <Text className="happy-font-heading-bold text-[18px] tracking-tight text-ink mb-0">
          Thought Patterns
        </Text>
      </View>
      <Text className="happy-font-body text-[12px] text-ink-muted">
        Unlock AI-detected themes in your thinking
      </Text>
    </Pressable>
  );
}

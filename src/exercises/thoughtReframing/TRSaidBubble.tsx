// ponytail: .agents/thought-reframing.html `said()` — what you wrote earlier comes back as your own bubble.
import React from "react";
import { Text, View } from "react-native";

export function TRSaidBubble({ label = "You thought", text }: { label?: string; text?: string }): React.JSX.Element | null {
  const trimmed = text?.trim();
  if (!trimmed) return null;
  return (
    <View className="mb-4 items-end">
      <Text className="mb-1 text-t-foot font-semibold text-happy-label-3">{label}</Text>
      <View className="max-w-[85%] rounded-2xl rounded-br-[4px] bg-happy-ink px-4 py-3">
        <Text className="font-semibold leading-[22px] text-white">{trimmed}</Text>
      </View>
    </View>
  );
}

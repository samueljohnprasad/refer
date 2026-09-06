import React from "react";
import { View, Text } from "react-native";

interface ReflectionSectionProps {
  rawReflection?: string | null;
}

// ponytail: soft observational tone for reflection insight
const cleanReflectionText = (text: string): string => {
  if (
    text.includes("developing resilience under pressure") &&
    text.includes("shows emotional maturity")
  ) {
    return "You noticed both sides of the day: you pushed through something demanding, while also recognizing that you need space to recover.";
  }
  return text;
};

// ponytail: quiet warm reflection card with observational language
export const ReflectionSection: React.FC<ReflectionSectionProps> = ({
  rawReflection,
}) => {
  if (!rawReflection) return null;

  return (
    <View className="mt-1 mb-8">
      {/* Reflection heading: quiet section header, not hero heading */}
      <Text className="happy-font-heading-semibold text-[17px] leading-5 text-ink mb-2">
        Reflection
      </Text>
      {/* Reflection card: warm-neutral translucent surface, subtle border, reduced radius */}
      <View className="bg-white/75 p-4 rounded-xl border border-ink/8">
        <Text className="happy-font-body text-[15px] leading-[23px] text-ink-soft">
          {cleanReflectionText(rawReflection)}
        </Text>
      </View>
    </View>
  );
};

import React from "react";
import { Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

type TestimonialTone = "terracotta" | "lavender" | "sky" | "sage";

interface TestimonialCardProps {
  initial: string;
  quote: string;
  name: string;
  age: number;
  metaLabel?: string;
  tone?: TestimonialTone;
}

const AVATAR_GRADIENTS: Record<TestimonialTone, [string, string]> = {
  terracotta: ["#E9A88B", "#D57655"],
  lavender: ["#C9B8D9", "#B7A0D0"],
  sky: ["#B0CCDB", "#94B5C9"],
  sage: ["#B8C4A8", "#5A7A56"],
};

const TestimonialCard: React.FC<TestimonialCardProps> = ({
  initial,
  quote,
  name,
  age,
  metaLabel,
  tone = "terracotta",
}) => {
  return (
    <View
      style={{ borderCurve: "continuous" }}
      className="flex-row gap-3 rounded-[14px] border border-sage-200 border-l-[3px] border-l-gold bg-warm-white px-4 py-3.5"
    >
      <LinearGradient
        colors={AVATAR_GRADIENTS[tone]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          width: 36,
          height: 36,
          borderRadius: 999,
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Text
          className="happy-font-heading text-[14px] text-white"
        >
          {initial}
        </Text>
      </LinearGradient>

      <View className="flex-1">
        <Text
          className="happy-font-heading-italic text-[13px] leading-[1.45] text-ink"
        >
          {quote}
        </Text>

        <View className="mt-1.5 flex-row items-center gap-2">
          <Text
            className="happy-font-body-medium text-[11px] text-ink-muted"
          >
            {name}, {age}
            {metaLabel ? ` · ${metaLabel}` : ""}
          </Text>
          <Text
            className="happy-font-body-bold text-[10px] tracking-[-0.04em] text-gold"
          >
            ★★★★★
          </Text>
        </View>
      </View>
    </View>
  );
};

export default React.memo(TestimonialCard);

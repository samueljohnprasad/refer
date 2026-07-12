import React from "react";
import { Text, View } from "react-native";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { StarIcon } from "@hugeicons/core-free-icons";

type TestimonialTone = "terracotta" | "lavender" | "sky" | "sage";

interface TestimonialCardProps {
  initial: string;
  quote: string;
  name: string;
  age: number;
  metaLabel?: string;
  tone?: TestimonialTone;
}

const TONE_COLORS: Record<
  TestimonialTone,
  { bg: string; text: string; border: string }
> = {
  terracotta: { bg: "#FDF8F5", text: "#8C4A32", border: "#F5E6DF" },
  lavender: { bg: "#FAF8FD", text: "#685084", border: "#EFEAF7" },
  sky: { bg: "#F4F8FA", text: "#3B5A6C", border: "#E2EEF4" },
  sage: { bg: "#F7F8F6", text: "#425C37", border: "#EAECE7" },
};

const TestimonialCard: React.FC<TestimonialCardProps> = ({
  initial,
  quote,
  name,
  age,
  metaLabel,
  tone = "terracotta",
}) => {
  const colors = TONE_COLORS[tone];

  return (
    <View
      style={{ borderCurve: "continuous", borderColor: "#E5EDE1", borderWidth: 1 }}
      className="rounded-[20px] bg-[#FCFAF7] p-5 shadow-[0_2px_8px_rgba(43,58,34,0.03)]"
    >
      {/* Editorial Header Row */}
      <View className="flex-row items-center justify-between mb-3.5">
        <View className="flex-row items-center gap-3">
          {/* Monogram Avatar Circle */}
          <View
            style={{
              backgroundColor: colors.bg,
              borderColor: colors.border,
              borderWidth: 1,
            }}
            className="h-9 w-9 items-center justify-center rounded-full"
          >
            <Text
              style={{ fontFamily: "CormorantBold", color: colors.text }}
              className="text-[14px]"
            >
              {initial}
            </Text>
          </View>
          <View>
            <Text
              style={{ fontFamily: "GeistBold" }}
              className="text-[13px] text-ink"
            >
              {name}, {age}
            </Text>
            {metaLabel && (
              <Text
                style={{ fontFamily: "GeistRegular" }}
                className="text-[10px] text-ink-muted uppercase tracking-[0.05em]"
              >
                {metaLabel}
              </Text>
            )}
          </View>
        </View>

        {/* Rating Stars using native Hugeicons */}
        <View
          accessible={true}
          accessibilityLabel="5 out of 5 stars"
          className="flex-row gap-0.5"
        >
          {[...Array(5)].map((_, i) => (
            <HugeiconsIcon
              key={i}
              icon={StarIcon}
              size={12}
              color="#D97706"
              fill="#D97706"
            />
          ))}
        </View>
      </View>

      {/* Editorial Italic Quote Text */}
      <View className="relative pl-1">
        <Text
          style={{ fontFamily: "CormorantRegularItalic" }}
          className="text-[16px] leading-[1.55] text-ink-soft"
        >
          {quote}
        </Text>
      </View>
    </View>
  );
};

export default React.memo(TestimonialCard);

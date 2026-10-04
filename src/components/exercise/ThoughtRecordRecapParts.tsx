import React from "react";
import { View } from "react-native";
import { Text } from "@/src/components/ui/Text";
import { ReflectionBulletList } from "@/src/components/exercise/ReflectionTimeline";
import { SEMANTIC_COLORS } from "@/src/components/exercise/courseExerciseTheme";
import { APP_FONT_FAMILIES } from "@/src/theme/typography";

export type RecapSection = {
  label: string;
  value: string | string[];
  tone?: "default" | "serif" | "muted";
};

export function ScoreSnapshot({ score }: { score: number }) {
  return (
    <View className="flex-row items-end">
      <Text
        style={{ fontFamily: APP_FONT_FAMILIES.semiBold, color: SEMANTIC_COLORS.text.primary }}
        className="text-[34px] leading-[34px]"
      >
        {score}
      </Text>
      <Text
        style={{ fontFamily: APP_FONT_FAMILIES.semiBold, color: SEMANTIC_COLORS.text.secondary }}
        className="ml-2 text-[12px] leading-[18px]"
      >
        /10
      </Text>
    </View>
  );
}

export function RealityPill({ label }: { label: string }) {
  return (
    <View
      className="self-start rounded-full px-3.5 py-2"
      style={{ backgroundColor: SEMANTIC_COLORS.surface.elevated }}
    >
      <Text
        style={{ fontFamily: APP_FONT_FAMILIES.semiBold, color: SEMANTIC_COLORS.brand.pressed }}
        className="text-[13px] leading-[18px]"
      >
        {label}
      </Text>
    </View>
  );
}

export function RecapSectionContent({ section }: { section: RecapSection }) {
  const items = Array.isArray(section.value)
    ? section.value.filter((item) => item.trim())
    : [];

  if (items.length > 0) {
    return (
      <ReflectionBulletList
        items={items}
        textColor={
          section.tone === "muted"
            ? SEMANTIC_COLORS.text.secondary
            : SEMANTIC_COLORS.text.primary
        }
      />
    );
  }

  if (typeof section.value !== "string" || !section.value.trim()) return null;

  const style =
    section.tone === "serif"
      ? { fontFamily: APP_FONT_FAMILIES.semiBold, color: SEMANTIC_COLORS.text.primary }
      : {
          fontFamily: APP_FONT_FAMILIES.regular,
          color:
            section.tone === "muted"
              ? SEMANTIC_COLORS.text.secondary
              : SEMANTIC_COLORS.text.primary,
        };
  const className =
    section.tone === "serif"
      ? "text-[22px] leading-[30px]"
      : "text-[16px] leading-[24px]";

  return (
    <Text style={style} className={className}>
      {section.value.trim()}
    </Text>
  );
}

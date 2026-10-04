import React from "react";
import { Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import type { ComparisonData } from "@/src/components/exercise/storySerialContent";

export function StorySerialComparisonCard({
  comparison,
}: {
  comparison: ComparisonData;
}) {
  const { t } = useTranslation("exercises");
  return (
    <View
      accessible
      accessibilityRole="summary"
      accessibilityLabel={t("flow.ui.categoryEngine.storySerial.comparisonAccessibility")}
      className="mb-5 overflow-hidden rounded-[18px] border border-[#E8DCCB] bg-[#FAF7F2]"
    >
      <View
        accessible
        accessibilityLabel={t("flow.ui.categoryEngine.storySerial.sameStartAccessibility", { start: comparison.start.join(" and ") })}
        className="bg-[#F2ECE4] px-4 py-2.5"
      >
        <Text className="happy-font-heading-bold mb-0.5 text-[10.5px] uppercase tracking-wider text-[#82796A]">
          {t("flow.ui.categoryEngine.storySerial.sameStart")}
        </Text>
        <Text className="happy-font-body-bold text-[13.5px] text-[#201E1D]">
          {comparison.start.join(" + ")}
        </Text>
      </View>
      <View
        accessible
        accessibilityLabel={t("flow.ui.categoryEngine.storySerial.proofPathAccessibility", { path: comparison.path1.join(", ") })}
        className="border-t border-[#E8DCCB] bg-[#FDF8F3] px-4 py-3"
      >
        <Text className="happy-font-heading-bold mb-0.5 text-[10.5px] uppercase tracking-wider text-[#4A6B53]">
          {t("flow.ui.categoryEngine.storySerial.proofPathHeading")}
        </Text>
        <Text className="happy-font-body text-[13.5px] leading-[20px] text-[#201E1D]">
          {comparison.path1.join(" → ")}
        </Text>
      </View>
      <View
        accessible
        accessibilityLabel={t("flow.ui.categoryEngine.storySerial.signalPathAccessibility", { path: comparison.path2.join(", ") })}
        className="border-t border-[#E8DCCB] bg-[#F2F8EF] px-4 py-3"
      >
        <Text className="happy-font-heading-bold mb-0.5 text-[10.5px] uppercase tracking-wider text-[#4A6B53]">
          {t("flow.ui.categoryEngine.storySerial.signalPathHeading")}
        </Text>
        <Text className="happy-font-body text-[13.5px] leading-[20px] text-[#201E1D]">
          {comparison.path2.join(" → ")}
        </Text>
      </View>
    </View>
  );
}

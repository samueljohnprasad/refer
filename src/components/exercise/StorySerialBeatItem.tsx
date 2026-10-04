import React from "react";
import { Text, View } from "react-native";
import { useTranslation } from "react-i18next";

export function StorySerialBeatItem({
  beat,
  showArrow,
}: {
  beat: string;
  showArrow: boolean;
}) {
  const { t } = useTranslation("exercises");
  const match = beat.match(/^(QUICK RELIEF|CHECK REALITY)\n+(.*)$/s);
  const label = match?.[1] === "QUICK RELIEF"
    ? t("flow.ui.categoryEngine.storySerial.quickRelief")
    : t("flow.ui.categoryEngine.storySerial.checkReality");
  return (
    <View>
      {showArrow && (
        <View className="py-1.5 items-center justify-center">
          <Text className="text-[13px] leading-[14px] text-[#9A9E96]">↓</Text>
        </View>
      )}
      {match ? (
        <View className="mt-0.5">
          <Text className="happy-font-heading-bold mb-0.5 text-[10.5px] uppercase tracking-wider text-[#4A6B53]">
            {label}
          </Text>
          <Text className="happy-font-body text-[14px] leading-[20px] text-[#201E1D]">
            {match[2]}
          </Text>
        </View>
      ) : (
        <Text className="happy-font-body text-[14px] leading-[20px] text-[#201E1D]">
          {beat}
        </Text>
      )}
    </View>
  );
}

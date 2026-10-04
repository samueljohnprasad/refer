import React from "react";
import { Pressable, Text } from "react-native";
import { useTranslation } from "react-i18next";

export function LeverMatchCard({
  label,
  selected,
  matched,
  wrong,
  showCheck,
  onPress,
}: {
  label: string;
  selected: boolean;
  matched: boolean;
  wrong: boolean;
  showCheck?: boolean;
  onPress: () => void;
}) {
  const { t } = useTranslation("exercises");
  const className = matched
    ? "min-h-[56px] justify-center rounded-[16px] border border-[#ABC0A2] bg-[#F2F8EF] px-3 py-1.5"
    : wrong
      ? "min-h-[64px] justify-center rounded-[16px] border-[1.5px] border-[#D1A796] bg-[#FFF5F0] px-3 py-2"
      : selected
        ? "min-h-[64px] justify-center rounded-[16px] border-[1.5px] border-[#7E9874] bg-[#F2F8EF] px-3 py-2"
        : "min-h-[64px] justify-center rounded-[16px] border border-[#E8DCCB] bg-[#FDF8F3] px-3 py-2 active:bg-[#F2ECE4]";
  const textClassName = matched
    ? "happy-font-body-bold text-center text-[13px] leading-[18px] text-[#3F4A31]"
    : "happy-font-body-bold text-center text-[13px] leading-[18px] text-[#201E1D]";
  const stateLabel = t(
    matched
      ? "flow.ui.categoryEngine.leverMatch.stateMatched"
      : selected
        ? "flow.ui.categoryEngine.leverMatch.stateSelected"
        : "flow.ui.categoryEngine.leverMatch.stateUnmatched",
  );

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected, disabled: matched }}
      accessibilityLabel={`${label}, ${stateLabel}`}
      disabled={matched}
      onPress={onPress}
      className={className}
    >
      <Text className={textClassName}>
        {matched && showCheck ? `✓ ${label}` : label}
      </Text>
    </Pressable>
  );
}

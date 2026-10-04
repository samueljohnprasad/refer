import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Host, Picker, Text as SwiftUIText } from "@expo/ui/swift-ui";
import { pickerStyle, tag, tint } from "@expo/ui/swift-ui/modifiers";
import { SEMANTIC_COLORS } from "@/src/theme/colors";
import { TIME_RANGES, type TimeRange } from "@/src/constants/insights";

interface TimeRangeSelectorProps {
  value: TimeRange;
  onChange: (range: TimeRange) => void;
}

export function TimeRangeSelector({ value, onChange }: TimeRangeSelectorProps) {
  const { t } = useTranslation("common");
  const selectedLabel = useMemo(() => {
    const found = TIME_RANGES.find((r) => r.key === value);
    return found ? t(`timelineAnalytics.timeRange.${found.key}`) : t("timelineAnalytics.timeRange.7d");
  }, [t, value]);

  const handleSelectionChange = (selection: unknown) => {
    if (typeof selection === "string") {
        const found = TIME_RANGES.find((r) => t(`timelineAnalytics.timeRange.${r.key}`) === selection);
      if (found) {
        onChange(found.key as TimeRange);
      }
    }
  };

  return (
    <Host style={{ width: 140, height: 32 }}>
      <Picker
        modifiers={[pickerStyle("segmented"), tint(SEMANTIC_COLORS.brand.pressed)]}
        label={t("timelineAnalytics.timeRange.label")}
        selection={selectedLabel}
        onSelectionChange={handleSelectionChange}
      >
        {TIME_RANGES.map(({ key }) => {
          const label = t(`timelineAnalytics.timeRange.${key}`);
          return (
          <SwiftUIText key={key} modifiers={[tag(label)]}>
            {label}
          </SwiftUIText>
          );
        })}
      </Picker>
    </Host>
  );
}

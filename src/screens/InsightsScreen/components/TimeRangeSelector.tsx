import React, { useMemo } from "react";
import { Host, Picker, Text as SwiftUIText } from "@expo/ui/swift-ui";
import { pickerStyle, tag, tint } from "@expo/ui/swift-ui/modifiers";
import { SAGE } from "@/lib/tokens";
import { TIME_RANGES, type TimeRange } from "@/src/constants/insights";

interface TimeRangeSelectorProps {
  value: TimeRange;
  onChange: (range: TimeRange) => void;
}

export function TimeRangeSelector({ value, onChange }: TimeRangeSelectorProps) {
  const selectedLabel = useMemo(() => {
    const found = TIME_RANGES.find((r) => r.key === value);
    return found ? found.label : "7d";
  }, [value]);

  const handleSelectionChange = (selection: unknown) => {
    if (typeof selection === "string") {
      const found = TIME_RANGES.find((r) => r.label === selection);
      if (found) {
        onChange(found.key as TimeRange);
      }
    }
  };

  return (
    <Host style={{ width: 140, height: 32 }}>
      <Picker
        modifiers={[pickerStyle("segmented"), tint(SAGE[600])]}
        label="Time Range"
        selection={selectedLabel}
        onSelectionChange={handleSelectionChange}
      >
        {TIME_RANGES.map(({ key, label }) => (
          <SwiftUIText key={key} modifiers={[tag(label)]}>
            {label}
          </SwiftUIText>
        ))}
      </Picker>
    </Host>
  );
}

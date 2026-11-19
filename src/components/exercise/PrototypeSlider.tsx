// ponytail: the prototype's 0-10 range input — a 44pt-tall strip you can drag anywhere on, with the tall
// 16 × 44 dark-rimmed thumb. `children` are the ten cells drawn behind it; this owns touch, thumb and a11y.
import React from "react";
import { View, type GestureResponderEvent, type LayoutChangeEvent } from "react-native";

const THUMB_W = 16;

export interface PrototypeSliderProps {
  value: number;
  onChange: (v: number) => void;
  label: string;
  /** spoken after "N out of 10", e.g. the word for the value */
  valueText?: string;
  disabled?: boolean;
  children?: React.ReactNode;
}

export function PrototypeSlider({ value, onChange, label, valueText, disabled, children }: PrototypeSliderProps): React.JSX.Element {
  const [width, setWidth] = React.useState(0);
  const clamp = (v: number) => Math.max(0, Math.min(10, v));
  // touch x → 0..10 step 1
  const touch = (e: GestureResponderEvent) => {
    if (!width || disabled) return;
    const v = clamp(Math.round((e.nativeEvent.locationX / width) * 10));
    if (v !== value) onChange(v);
  };
  return (
    <View className="h-11">
      <View className="absolute inset-x-0 top-1 bottom-1 flex-row gap-1" pointerEvents="none">{children}</View>
      <View
        className="absolute inset-0"
        onLayout={(e: LayoutChangeEvent) => setWidth(e.nativeEvent.layout.width)}
        onStartShouldSetResponder={() => !disabled}
        onMoveShouldSetResponder={() => !disabled}
        onResponderGrant={touch}
        onResponderMove={touch}
        accessible
        accessibilityRole="adjustable"
        accessibilityLabel={label}
        accessibilityState={{ disabled: !!disabled }}
        accessibilityValue={{ min: 0, max: 10, now: value, text: `${value} out of 10${valueText ? `, ${valueText}` : ""}` }}
        accessibilityActions={[{ name: "increment" }, { name: "decrement" }]}
        onAccessibilityAction={(e) => !disabled && onChange(clamp(value + (e.nativeEvent.actionName === "increment" ? 1 : -1)))}
      >
        <View
          pointerEvents="none"
          className="absolute top-0 h-11 w-4 rounded-lg bg-happy-surface"
          style={{ left: width ? (value / 10) * (width - THUMB_W) : 0, borderWidth: 2, borderColor: "#29452a" }}
        />
      </View>
    </View>
  );
}

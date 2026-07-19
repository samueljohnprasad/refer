/**
 * SettingsRow Primitives
 *
 * Reusable iOS-style settings row components for habit modals.
 * Modeled after the grok-voice-demo settings pattern:
 * flat list of rows with consistent padding, dividers, and native pickers.
 */

import React from "react";
import { View, Switch, Text as RNText } from "react-native";
import {
  Host,
  DatePicker as SwiftUIDateTimePicker,
  Picker,
  Text as SwiftUIText,
} from "@expo/ui/swift-ui";
import {
  pickerStyle,
  datePickerStyle,
  labelsHidden,
  tag,
  tint,
} from "@expo/ui/swift-ui/modifiers";
/** Inline type — mirrors @expo/ui DatePicker's range prop */
type DateRange = {
  start?: Date;
  end?: Date;
};

// ─── Types ──────────────────────────────────────────────────────────

interface SettingsRowProps {
  /** Label displayed on the left */
  label: string;
  /** Optional detail text on the right (static) */
  detail?: string;
  /** Children rendered on the right side */
  children?: React.ReactNode;
}

interface SettingsToggleRowProps {
  label: string;
  value: boolean;
  onValueChange: (v: boolean) => void;
}

interface PickerOption {
  value: string;
  label: string;
}

interface SettingsPickerRowProps {
  label: string;
  selection: string;
  options: PickerOption[];
  onSelectionChange: (value: string) => void;
}

type DatePickerDisplayComponent = "date" | "hourAndMinute";

interface SettingsDateRowProps {
  label: string;
  selection: Date;
  onDateChange: (date: Date) => void;
  displayedComponents?: DatePickerDisplayComponent[];
  range?: DateRange;
  /** "compact" | "wheel" | "graphical" */
  style?: "compact" | "wheel" | "graphical";
}

// ─── Components ─────────────────────────────────────────────────────

/** A plain row with label + optional right-side content */
export function SettingsRow({ label, detail, children }: SettingsRowProps): React.JSX.Element {
  return (
    <View className="flex-row items-center justify-between px-5 py-3.5 min-h-[48px]">
      <RNText className="text-[17px] text-black">{label}</RNText>
      {detail && (
        <RNText className="text-[15px] text-gray-500">{detail}</RNText>
      )}
      {children}
    </View>
  );
}

/** A row with a Switch toggle on the right */
export function SettingsToggleRow({
  label,
  value,
  onValueChange,
}: SettingsToggleRowProps): React.JSX.Element {
  return (
    <View className="flex-row items-center justify-between px-5 py-3 min-h-[48px]">
      <RNText className="text-[17px] text-black">{label}</RNText>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: "#E5E7EB", true: "#34C759" }}
        thumbColor="#FFFFFF"
      />
    </View>
  );
}

/** A row with a native SwiftUI menu picker on the right */
export function SettingsPickerRow({
  label,
  selection,
  options,
  onSelectionChange,
}: SettingsPickerRowProps): React.JSX.Element {
  return (
    <View className="flex-row items-center justify-between px-5 py-3.5 min-h-[48px]">
      <RNText className="text-[17px] text-black">{label}</RNText>
      <Host matchContents>
        <Picker
          selection={selection}
          onSelectionChange={(sel: string) => onSelectionChange(sel)}
          modifiers={[pickerStyle("menu"), tint("#6B7280")]}
        >
          {options.map((opt) => (
            <SwiftUIText key={opt.value} modifiers={[tag(opt.value)]}>
              {opt.label}
            </SwiftUIText>
          ))}
        </Picker>
      </Host>
    </View>
  );
}

/** A row with a native SwiftUI date picker on the right */
export function SettingsDateRow({
  label,
  selection,
  onDateChange,
  displayedComponents = ["date"],
  range,
  style: pickerStyleProp = "compact",
}: SettingsDateRowProps): React.JSX.Element {
  if (pickerStyleProp === "wheel") {
    // Wheel takes full width — stack vertically
    return (
      <View className="px-5 py-2">
        <Host matchContents>
          <SwiftUIDateTimePicker
            onDateChange={onDateChange}
            displayedComponents={displayedComponents}
            selection={selection}
            range={range}
            modifiers={[datePickerStyle("wheel")]}
          />
        </Host>
      </View>
    );
  }

  return (
    <View className="flex-row items-center justify-between px-5 py-2 min-h-[48px]">
      <RNText className="text-[17px] text-black">{label}</RNText>
      <Host matchContents>
        <SwiftUIDateTimePicker
          onDateChange={onDateChange}
          displayedComponents={displayedComponents}
          selection={selection}
          range={range}
          modifiers={[datePickerStyle(pickerStyleProp), labelsHidden()]}
        />
      </Host>
    </View>
  );
}

/** Thin horizontal separator line */
export function SectionDivider(): React.JSX.Element {
  return <View className="h-px bg-gray-100 mx-5" />;
}

/** Bold section header text */
export function SectionHeader({ title }: { title: string }): React.JSX.Element {
  return (
    <RNText className="text-[13px] font-semibold text-gray-500 uppercase tracking-wider px-5 pt-6 pb-2">
      {title}
    </RNText>
  );
}

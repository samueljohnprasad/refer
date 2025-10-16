import React from "react";
import { View, ScrollView } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { Text } from "@/components/ui/text";
import {
  Checkbox,
  CheckboxIndicator,
  CheckboxLabel,
  CheckboxIcon,
} from "@/components/ui/checkbox";

type BaseProps = {
  reasons: string[];
  /** Max height for the internal scroll container. Default: 280 */
  maxHeight?: number;
  /** Optional title above the list */
  title?: string;
  /** Optional helper text under title */
  helperText?: string;
  /** Show selected count pill when multiple */
  showCount?: boolean;
  /** Prefix each reason with an emoji icon */
  showIcons?: boolean;
};

type SingleSelectProps = BaseProps & {
  multiple?: false;
  selectedReason: string;
  onSelect: (reason: string) => void;
};

type MultiSelectProps = BaseProps & {
  multiple: true;
  selectedReasons: string[];
  onChangeSelected: (reasons: string[]) => void;
};

export type JournalOptionsProps = SingleSelectProps | MultiSelectProps;

export const JournalOptions: React.FC<JournalOptionsProps> = (
  props: JournalOptionsProps
) => {
  const {
    reasons,
    maxHeight = 280,
    title,
    helperText,
    showCount,
    showIcons,
  } = props;

  const multiple = "multiple" in props && props.multiple === true;

  const selectedSet = new Set(
    multiple
      ? (props as MultiSelectProps).selectedReasons
      : [(props as SingleSelectProps).selectedReason].filter(Boolean)
  );

  const handleToggle = (reason: string): void => {
    if (multiple) {
      const { selectedReasons, onChangeSelected } = props as MultiSelectProps;
      const next = new Set(selectedReasons);
      if (next.has(reason)) next.delete(reason);
      else next.add(reason);
      onChangeSelected(Array.from(next));
    } else {
      const { selectedReason, onSelect } = props as SingleSelectProps;
      const next = selectedReason === reason ? "" : reason;
      onSelect(next);
    }
  };

  const getEmojiForReason = (reason: string): string => {
    const map: Record<string, string> = {
      "Track my daily emotions": "📊",
      "Build better habits": "✅",
      "Reduce stress & anxiety": "🧘",
      "Personal growth": "🌱",
      "Improve relationships": "🤝",
      Other: "✨",
    };
    return map[reason] ?? "✨";
  };

  return (
    <View className="w-full px-6 py-2 mb-8">
      <View className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 shadow-sm overflow-hidden">
        {(title || helperText || (showCount && multiple)) && (
          <View className="px-4 pt-4 pb-2">
            {title && (
              <Text className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                {title}
              </Text>
            )}
            <View className="flex-row items-center justify-between mt-1">
              {helperText && (
                <Text className="text-sm text-slate-500 dark:text-slate-400">
                  {helperText}
                </Text>
              )}
              {showCount && multiple && (
                <View className="px-2 py-1 rounded-full bg-slate-100 dark:bg-zinc-800">
                  <Text className="text-xs font-medium text-slate-700 dark:text-slate-200">
                    {selectedSet.size} selected
                  </Text>
                </View>
              )}
            </View>
          </View>
        )}
        <ScrollView style={{ maxHeight }}>
          <View className="pt-1 divide-y divide-slate-100 dark:divide-zinc-800">
            {reasons.map((reason: string, index: number) => {
              const selected: boolean = selectedSet.has(reason);
              return (
                <Animated.View key={reason}>
                  <Checkbox
                    value={reason}
                    isChecked={selected}
                    onChange={() => handleToggle(reason)}
                    size="md"
                    className="px-4 py-3 web:hover:bg-slate-50/60 dark:web:hover:bg-zinc-800/40 data-[checked=true]:bg-indigo-50/80 dark:data-[checked=true]:bg-indigo-900/20 data-[checked=true]:ring-2 data-[checked=true]:ring-indigo-500"
                    accessibilityLabel={reason}
                  >
                    <CheckboxIndicator className="border-slate-300 data-[checked=true]:bg-indigo-600 data-[checked=true]:border-indigo-600">
                      <CheckboxIcon className="text-white" />
                    </CheckboxIndicator>
                    <CheckboxLabel className="ml-3 text-base font-medium text-slate-800 dark:text-slate-100">
                      {showIcons
                        ? `${getEmojiForReason(reason)}  ${reason}`
                        : reason}
                    </CheckboxLabel>
                  </Checkbox>
                </Animated.View>
              );
            })}
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

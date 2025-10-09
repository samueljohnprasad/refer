import React from "react";
import { View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import {
  Canvas,
  Circle,
  RadialGradient,
  vec,
} from "@shopify/react-native-skia";
import { Text } from "@/components/ui/text";
import {
  Radio,
  RadioGroup,
  RadioIndicator,
  RadioLabel,
  RadioIcon,
} from "@/components/ui/radio";

export type Gender = "male" | "female" | "other";

export interface DemographicsProps {
  ageRanges: readonly string[];
  selectedAgeRange: string;
  onSelectAgeRange: (value: string) => void;

  genders: readonly Gender[];
  selectedGender: Gender | "";
  onSelectGender: (value: Gender) => void;

  title?: string;
  helperText?: string;
}

export const Demographics: React.FC<DemographicsProps> = ({
  ageRanges,
  selectedAgeRange,
  onSelectAgeRange,
  genders,
  selectedGender,
  onSelectGender,
  title = "Tell us about you",
  helperText = "This helps personalize your experience",
}: DemographicsProps) => {
  const handleAgeChange = (value: string): void => {
    onSelectAgeRange(value);
  };
  const handleGenderChange = (value: string): void => {
    onSelectGender(value as Gender);
  };

  return (
    <View className="w-full px-6 py-2 mb-8 relative">
      {(title || helperText) && (
        <Animated.View entering={FadeIn.duration(250)} className="mb-4">
          {title && (
            <Text className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              {title}
            </Text>
          )}
          {helperText && (
            <Text className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              {helperText}
            </Text>
          )}
        </Animated.View>
      )}

      {/* Age Range */}
      <Animated.View
        entering={FadeIn.delay(100)}
        className="bg-white/95 dark:bg-zinc-900/95 rounded-2xl border border-slate-200/80 dark:border-zinc-700 shadow-sm overflow-hidden mb-4"
      >
        <View className="px-4 pt-4 pb-2">
          <View className="self-start mb-1 rounded-full border border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-950/40 px-2.5 py-1">
            <Text className="text-[11px] font-medium text-indigo-700 dark:text-indigo-300 tracking-wider uppercase">
              Age
            </Text>
          </View>
        </View>
        <View className="px-2 pb-3">
          <RadioGroup value={selectedAgeRange} onChange={handleAgeChange}>
            {ageRanges.map((range: string, index: number) => {
              const selected: boolean = selectedAgeRange === range;
              return (
                <Animated.View
                  key={range}
                  entering={FadeIn.duration(220).delay(120 + index * 40)}
                  className="mx-1"
                >
                  <Radio
                    value={range}
                    className={[
                      "px-2 py-2 rounded-xl border",
                      selected
                        ? "bg-indigo-50 dark:bg-indigo-950/30 border-indigo-300 dark:border-indigo-700"
                        : "bg-transparent border-transparent",
                    ].join(" ")}
                  >
                    <RadioIndicator
                      className={
                        selected ? "border-indigo-600" : "border-slate-300"
                      }
                      accessibilityState={{ checked: selected }}
                    >
                      <RadioIcon className="text-indigo-600" />
                    </RadioIndicator>
                    <RadioLabel className="ml-3 text-base text-slate-800 dark:text-slate-100">
                      {range}
                    </RadioLabel>
                  </Radio>
                </Animated.View>
              );
            })}
          </RadioGroup>
        </View>
      </Animated.View>

      {/* Gender */}
      <Animated.View
        entering={FadeIn.delay(150)}
        className="bg-white/95 dark:bg-zinc-900/95 rounded-2xl border border-slate-200/80 dark:border-zinc-700 shadow-sm overflow-hidden"
      >
        <View className="px-4 pt-4 pb-2">
          <View className="self-start mb-1 rounded-full border border-sky-200 dark:border-sky-800 bg-sky-50 dark:bg-sky-950/30 px-2.5 py-1">
            <Text className="text-[11px] font-medium text-sky-700 dark:text-sky-300 tracking-wider uppercase">
              Gender
            </Text>
          </View>
        </View>
        <View className="px-2 pb-3">
          <RadioGroup value={selectedGender} onChange={handleGenderChange}>
            {genders.map((g: Gender, index: number) => {
              const selected: boolean = selectedGender === g;
              return (
                <Animated.View
                  key={g}
                  entering={FadeIn.duration(220).delay(170 + index * 40)}
                  className="mx-1"
                >
                  <Radio
                    value={g}
                    className={[
                      "px-2 py-2 rounded-xl border",
                      selected
                        ? "bg-sky-50 dark:bg-sky-950/30 border-sky-300 dark:border-sky-700"
                        : "bg-transparent border-transparent",
                    ].join(" ")}
                  >
                    <RadioIndicator
                      className={
                        selected ? "border-sky-600" : "border-slate-300"
                      }
                      accessibilityState={{ checked: selected }}
                    >
                      <RadioIcon className="text-sky-600" />
                    </RadioIndicator>
                    <RadioLabel className="ml-3 text-base capitalize text-slate-800 dark:text-slate-100">
                      {g}
                    </RadioLabel>
                  </Radio>
                </Animated.View>
              );
            })}
          </RadioGroup>
        </View>
      </Animated.View>
    </View>
  );
};

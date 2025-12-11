import React from "react";
import { View, Pressable, ScrollView } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  interpolateColor,
} from "react-native-reanimated";
import { Text } from "@/components/ui/text";
import {
  Radio,
  RadioGroup,
  RadioIndicator,
  RadioLabel,
  RadioIcon,
} from "@/components/ui/radio";
import { Gender, AgeRange } from "@/types/types";

export type AgeRangeOption = {
  label: string;
  value: AgeRange;
};

export interface DemographicsProps {
  ageRanges: readonly AgeRangeOption[];
  selectedAgeRange?: AgeRange;
  onSelectAgeRange: (value: AgeRange | undefined) => void;

  genders: readonly Gender[];
  selectedGender?: Gender;
  onSelectGender: (value: Gender | undefined) => void;

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
  const handleAgeChange = (value: AgeRange): void => {
    if (selectedAgeRange === value) {
      onSelectAgeRange(undefined);
    } else {
      onSelectAgeRange(value);
    }
  };
  const handleGenderChange = (value: Gender): void => {
    if (selectedGender === value) {
      onSelectGender(undefined);
    } else {
      onSelectGender(value);
    }
  };

  return (
    <ScrollView
      className="w-full px-6"
      contentContainerStyle={{ paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View className="mb-8 mt-4">
        {title && (
          <Text className="text-4xl text-gray-900 dark:text-white mb-3 font-cormorantSemiBold leading-tight">
            {title}
          </Text>
        )}
        {helperText && (
          <Text className="text-lg text-gray-500 dark:text-gray-400 leading-relaxed">
            {helperText}
          </Text>
        )}
      </View>

      {/* Age Range Section */}
      <View className="mb-10">
        <Text className="text-xl font-semibold text-gray-900 dark:text-white mb-4 pl-1">
          Age Range
        </Text>
        <View className="gap-3">
          {ageRanges.map((range: AgeRangeOption) => {
            const selected = selectedAgeRange === range.value;
            return (
              <OptionButton
                key={range.value}
                label={range.label}
                selected={selected}
                onPress={() => handleAgeChange(range.value)}
              />
            );
          })}
        </View>
      </View>

      {/* Gender Section */}
      <View className="mb-6">
        <Text className="text-xl font-semibold text-gray-900 dark:text-white mb-4 pl-1">
          Gender
        </Text>
        <View className="gap-3">
          {genders.map((g: Gender) => {
            const selected = selectedGender === g;
            return (
              <OptionButton
                key={g}
                label={g}
                selected={selected}
                onPress={() => handleGenderChange(g)}
              />
            );
          })}
        </View>
      </View>
    </ScrollView>
  );
};

// Clean Pill Button Component
const OptionButton: React.FC<{
  label: string;
  selected: boolean;
  onPress: () => void;
}> = ({ label, selected, onPress }) => {
  return (
    <Pressable
      onPress={onPress}
      className={`
        w-full py-4 px-6 rounded-full border
        flex-row items-center justify-center
        ${
          selected
            ? "bg-gray-900 border-gray-900 dark:bg-white dark:border-white"
            : "bg-transparent border-gray-300 dark:border-gray-700"
        }
      `}
    >
      <Text
        className={`
          text-base font-semibold capitalize
          ${
            selected
              ? "text-white dark:text-gray-900"
              : "text-gray-900 dark:text-white"
          }
        `}
      >
        {label}
      </Text>
    </Pressable>
  );
};

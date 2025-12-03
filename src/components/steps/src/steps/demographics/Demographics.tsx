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

  // Get emoji for age range
  const getAgeEmoji = (ageRange: string): string => {
    const emojiMap: Record<string, string> = {
      "18_24": "🎓",
      "25_34": "💼",
      "35_44": "🏆",
      "45_54": "🌟",
      "55_64": "🍷",
      "65+": "👑",
    };
    return emojiMap[ageRange] || "✨";
  };

  // Get emoji for gender
  const getGenderEmoji = (gender: string): string => {
    const emojiMap: Record<string, string> = {
      male: "👨",
      female: "👩",
      other: "🌈",
      "prefer not to say": "💫",
    };
    return emojiMap[gender] || "✨";
  };

  return (
    <ScrollView className="w-full px-4 py-2 pb-6 relative">
      {/* Premium Header */}
      {(title || helperText) && (
        <View className="mb-6 items-center">
          <View
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.95)",
              borderRadius: 16,
              padding: 14,
              borderWidth: 1,
              borderColor: "rgba(0, 0, 0, 0.06)",
            }}
          >
            {title && (
              <Text className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1 text-center">
                {title}
              </Text>
            )}
            {helperText && (
              <Text className="text-sm text-gray-600 dark:text-gray-400 text-center font-medium">
                {helperText}
              </Text>
            )}
          </View>
        </View>
      )}

      {/* Premium Age Range Section */}
      <View className="mb-6">
        <View className="mb-5">
          <View
            style={{
              backgroundColor: "rgba(124, 58, 237, 0.05)",
              borderRadius: 16,
              paddingVertical: 10,
              paddingHorizontal: 20,
              alignSelf: "center",
              borderWidth: 1,
              borderColor: "rgba(124, 58, 237, 0.1)",
            }}
          >
            <View className="flex-row items-center">
              <Text className="text-lg font-bold text-gray-800 dark:text-gray-200">
                Select your age{" "}
                <Text className="text-sm font-normal text-gray-500">
                  (Optional)
                </Text>
              </Text>
              <Text className="ml-3 text-xl">🎆</Text>
            </View>
          </View>
        </View>
        <View className="flex-row flex-wrap justify-center gap-2">
          {ageRanges.map((range: AgeRangeOption, index: number) => {
            const selected: boolean = selectedAgeRange === range.value;
            return (
              <AgeRangeCard
                key={range.value}
                range={range}
                selected={selected}
                emoji={getAgeEmoji(range.value)}
                index={index}
                onSelect={() => handleAgeChange(range.value)}
              />
            );
          })}
        </View>
      </View>

      {/* Premium Gender Section */}
      <View className="mb-4">
        <View className="mb-5">
          <View
            style={{
              backgroundColor: "rgba(59, 130, 246, 0.05)",
              borderRadius: 16,
              paddingVertical: 10,
              paddingHorizontal: 20,
              alignSelf: "center",
              borderWidth: 1,
              borderColor: "rgba(59, 130, 246, 0.1)",
            }}
          >
            <View className="flex-row items-center">
              <Text className="text-lg font-bold text-gray-800 dark:text-gray-200">
                How do you identify?{" "}
                <Text className="text-sm font-normal text-gray-500">
                  (Optional)
                </Text>
              </Text>
              <Text className="ml-3 text-xl">🌈</Text>
            </View>
          </View>
        </View>
        <View className="flex-row flex-wrap justify-center gap-2">
          {genders.map((g: Gender, index: number) => {
            const selected: boolean = selectedGender === g;
            return (
              <GenderCard
                key={g}
                gender={g}
                selected={selected}
                emoji={getGenderEmoji(g)}
                index={index}
                onSelect={() => handleGenderChange(g)}
              />
            );
          })}
        </View>
      </View>
    </ScrollView>
  );
};

// Premium Age Range Card Component
const AgeRangeCard: React.FC<{
  range: AgeRangeOption;
  selected: boolean;
  emoji: string;
  index: number;
  onSelect: () => void;
}> = ({ range, selected, emoji, index, onSelect }) => {
  return (
    <Pressable
      onPress={onSelect}
      style={{
        paddingHorizontal: 16,
        paddingVertical: 14,
        minWidth: 110,
        borderColor: selected ? "#7C3AED" : "rgba(203, 213, 225, 0.5)",
        borderWidth: 2,
      }}
      className="bg-white rounded-2xl"
    >
      <View className="items-center rounded-2xl">
        <View
          style={{
            backgroundColor: selected
              ? "rgba(124, 58, 237, 0.08)"
              : "transparent",
            width: 48,
            height: 48,
            borderRadius: 24,
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 6,
          }}
        >
          <Text className="text-3xl">{emoji}</Text>
        </View>
        <Text
          className={`
            text-sm font-bold
            ${
              selected
                ? "text-purple-700 dark:text-purple-400"
                : "text-gray-700 dark:text-gray-300"
            }
          `}
        >
          {range.label}
        </Text>
        {selected && (
          <View
            style={{
              position: "absolute",
              top: -8,
              right: -8,
              backgroundColor: "#7C3AED",
              width: 24,
              height: 24,
              borderRadius: 12,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ color: "white", fontSize: 14, fontWeight: "800" }}>
              ✓
            </Text>
          </View>
        )}
      </View>
    </Pressable>
  );
};

// Premium Gender Card Component
const GenderCard: React.FC<{
  gender: string;
  selected: boolean;
  emoji: string;
  index: number;
  onSelect: () => void;
}> = ({ gender, selected, emoji, index, onSelect }) => {
  return (
    <Pressable
      onPress={onSelect}
      style={{
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderRadius: 16,
        borderWidth: 2.5,
        minWidth: 110,
        borderColor: selected ? "#3B82F6" : "rgba(203, 213, 225, 0.5)",
      }}
      className="bg-white"
    >
      <View className="items-center">
        <View
          style={{
            backgroundColor: selected
              ? "rgba(59, 130, 246, 0.08)"
              : "transparent",
            width: 48,
            height: 48,
            borderRadius: 24,
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 6,
          }}
        >
          <Text className="text-3xl">{emoji}</Text>
        </View>
        <Text
          className={`
            text-sm font-bold capitalize
            ${
              selected
                ? "text-blue-700 dark:text-blue-400"
                : "text-gray-700 dark:text-gray-300"
            }
          `}
        >
          {gender}
        </Text>
        {selected && (
          <View
            style={{
              position: "absolute",
              top: -8,
              right: -8,
              backgroundColor: "#3B82F6",
              width: 24,
              height: 24,
              borderRadius: 12,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ color: "white", fontSize: 14, fontWeight: "800" }}>
              ✓
            </Text>
          </View>
        )}
      </View>
    </Pressable>
  );
};

import React from "react";
import { View, Text, ScrollView } from "react-native";
import { Feather } from "@expo/vector-icons";

interface InsightTagsSectionProps {
  title: string;
  icon: keyof typeof Feather.glyphMap;
  iconColor: string;
  bgColor: string;
  tagBgColor: string;
  tagTextColor: string;
  items: string[] | null;
}

/**
 * Displays a list of insight tags as styled chips
 * Used for achievements, worries, goals, triggers, etc.
 */
export const InsightTagsSection: React.FC<InsightTagsSectionProps> = React.memo(
  ({ title, icon, iconColor, bgColor, tagBgColor, tagTextColor, items }) => {
    if (!items || items.length === 0) return null;

    return (
      <View
        className={`rounded-2xl p-4 mb-4 ${bgColor}`}
      >
        <View className="flex-row items-center mb-4">
          <View
            className={`w-8 h-8 rounded-full items-center justify-center mr-2 ${tagBgColor}`}
          >
            <Feather name={icon} size={16} className={iconColor} />
          </View>
          <Text className="text-sm font-semibold text-theme-text-primary">
            {title}
          </Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingRight: 16 }}
        >
          <View className="flex-row flex-wrap gap-2">
            {items.map((item: string, index: number) => (
              <View
                key={`${title}-${index}`}
                className={`px-4 py-2 rounded-full ${tagBgColor}`}
              >
                <Text
                  className={`text-sm font-medium ${tagTextColor}`}
                >
                  {item}
                </Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    );
  }
);

InsightTagsSection.displayName = "InsightTagsSection";

/**
 * Configuration for different insight tag sections
 */
export const INSIGHT_TAG_CONFIGS: Record<
  string,
  Omit<InsightTagsSectionProps, "items">
> = {
  achievements: {
    title: "Achievements",
    icon: "award",
    iconColor: "text-emerald-500",
    bgColor: "bg-emerald-50 dark:bg-emerald-900/20",
    tagBgColor: "bg-emerald-100 dark:bg-emerald-800/40",
    tagTextColor: "text-emerald-700 dark:text-emerald-300",
  },
  worries: {
    title: "Worries",
    icon: "cloud",
    iconColor: "text-indigo-500",
    bgColor: "bg-indigo-50 dark:bg-indigo-900/20",
    tagBgColor: "bg-indigo-100 dark:bg-indigo-800/40",
    tagTextColor: "text-indigo-700 dark:text-indigo-300",
  },
  goals: {
    title: "Goals",
    icon: "target",
    iconColor: "text-amber-500",
    bgColor: "bg-amber-50 dark:bg-amber-900/20",
    tagBgColor: "bg-amber-100 dark:bg-amber-800/40",
    tagTextColor: "text-amber-700 dark:text-amber-300",
  },
  triggers: {
    title: "Triggers",
    icon: "alert-circle",
    iconColor: "text-rose-500",
    bgColor: "bg-rose-50 dark:bg-rose-900/20",
    tagBgColor: "bg-rose-100 dark:bg-rose-800/40",
    tagTextColor: "text-rose-700 dark:text-rose-300",
  },
  copingStrategies: {
    title: "Coping Strategies",
    icon: "heart",
    iconColor: "text-pink-500",
    bgColor: "bg-pink-50 dark:bg-pink-900/20",
    tagBgColor: "bg-pink-100 dark:bg-pink-800/40",
    tagTextColor: "text-pink-700 dark:text-pink-300",
  },
  physicalSymptoms: {
    title: "Physical Symptoms",
    icon: "activity",
    iconColor: "text-cyan-500",
    bgColor: "bg-cyan-50 dark:bg-cyan-900/20",
    tagBgColor: "bg-cyan-100 dark:bg-cyan-800/40",
    tagTextColor: "text-cyan-700 dark:text-cyan-300",
  },
};

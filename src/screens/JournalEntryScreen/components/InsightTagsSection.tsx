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
        className="rounded-2xl p-4 mb-3"
        style={{ backgroundColor: bgColor }}
      >
        <View className="flex-row items-center mb-3">
          <View
            className="w-8 h-8 rounded-full items-center justify-center mr-2"
            style={{ backgroundColor: tagBgColor }}
          >
            <Feather name={icon} size={16} color={iconColor} />
          </View>
          <Text className="text-sm font-semibold text-gray-800 dark:text-gray-100">
            {title}
          </Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingRight: 8 }}
        >
          <View className="flex-row flex-wrap gap-2">
            {items.map((item: string, index: number) => (
              <View
                key={`${title}-${index}`}
                className="px-3 py-1.5 rounded-full"
                style={{ backgroundColor: tagBgColor }}
              >
                <Text
                  className="text-xs font-medium"
                  style={{ color: tagTextColor }}
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
    iconColor: "#10B981",
    bgColor: "#ECFDF5",
    tagBgColor: "#D1FAE5",
    tagTextColor: "#065F46",
  },
  worries: {
    title: "Worries",
    icon: "cloud",
    iconColor: "#6366F1",
    bgColor: "#EEF2FF",
    tagBgColor: "#E0E7FF",
    tagTextColor: "#3730A3",
  },
  goals: {
    title: "Goals",
    icon: "target",
    iconColor: "#F59E0B",
    bgColor: "#FFFBEB",
    tagBgColor: "#FEF3C7",
    tagTextColor: "#92400E",
  },
  triggers: {
    title: "Triggers",
    icon: "alert-circle",
    iconColor: "#EF4444",
    bgColor: "#FEF2F2",
    tagBgColor: "#FEE2E2",
    tagTextColor: "#991B1B",
  },
  copingStrategies: {
    title: "Coping Strategies",
    icon: "heart",
    iconColor: "#EC4899",
    bgColor: "#FDF2F8",
    tagBgColor: "#FCE7F3",
    tagTextColor: "#9D174D",
  },
  physicalSymptoms: {
    title: "Physical Symptoms",
    icon: "activity",
    iconColor: "#0891B2",
    bgColor: "#ECFEFF",
    tagBgColor: "#CFFAFE",
    tagTextColor: "#155F75",
  },
};

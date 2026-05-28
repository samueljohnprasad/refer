import React from "react";
import { View, ScrollView } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Text } from "@/src/components/ui/Text";

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
        <View className="flex-row items-center mb-3">
          <View
            className={`w-8 h-8 rounded-xl items-center justify-center mr-2 bg-white border border-brand-border shadow-sm`}
          >
            <Feather name={icon} size={15} className={iconColor} />
          </View>
          <Text variant="label-bold" className="text-ink">
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
                className={`px-3.5 py-1.5 rounded-full border border-brand-border/20 ${tagBgColor}`}
              >
                <Text
                  variant="chip"
                  className={`text-[12px] font-bold ${tagTextColor}`}
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
    iconColor: "text-gold",
    bgColor: "bg-white/40 border border-sage-100/60 shadow-sm",
    tagBgColor: "bg-gold-tint",
    tagTextColor: "text-ink",
  },
  worries: {
    title: "Worries",
    icon: "cloud",
    iconColor: "text-macaw-purple",
    bgColor: "bg-white/40 border border-sage-100/60 shadow-sm",
    tagBgColor: "bg-macaw-purple-tint",
    tagTextColor: "text-ink",
  },
  goals: {
    title: "Goals",
    icon: "target",
    iconColor: "text-otter-blue",
    bgColor: "bg-white/40 border border-sage-100/60 shadow-sm",
    tagBgColor: "bg-otter-blue-tint",
    tagTextColor: "text-ink",
  },
  triggers: {
    title: "Triggers",
    icon: "alert-circle",
    iconColor: "text-cardinal-red",
    bgColor: "bg-white/40 border border-sage-100/60 shadow-sm",
    tagBgColor: "bg-cardinal-red/10",
    tagTextColor: "text-cardinal-red",
  },
  copingStrategies: {
    title: "Coping Strategies",
    icon: "heart",
    iconColor: "text-sage-500",
    bgColor: "bg-white/40 border border-sage-100/60 shadow-sm",
    tagBgColor: "bg-sage-pill",
    tagTextColor: "text-sage-700",
  },
  physicalSymptoms: {
    title: "Physical Symptoms",
    icon: "activity",
    iconColor: "text-otter-blue",
    bgColor: "bg-white/40 border border-sage-100/60 shadow-sm",
    tagBgColor: "bg-otter-blue-tint",
    tagTextColor: "text-ink",
  },
};

import React from "react";
import { View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
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
  ({ title, icon, iconColor, tagBgColor, tagTextColor, items }) => {
    const { t } = useTranslation("journal");

    if (!items || items.length === 0) return null;

    return (
      <View className="mb-5">
        <View className="flex-row items-center mb-2.5">
          <View
            className="w-7 h-7 rounded-lg items-center justify-center mr-2.5 bg-white border border-brand-border/60"
          >
            <Feather name={icon} size={14} className={iconColor} />
          </View>
          <Text variant="label-bold" className="text-ink text-[14px]">
            {t(title)}
          </Text>
        </View>

        <View>
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
        </View>
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
    title: "insights.achievements",
    icon: "award",
    iconColor: "text-happy-accent",
    bgColor: "bg-happy-surface border border-happy-sep shadow-xs",
    tagBgColor: "bg-hue-reframe",
    tagTextColor: "text-happy-label",
  },
  worries: {
    title: "insights.worries",
    icon: "cloud",
    iconColor: "text-happy-accent",
    bgColor: "bg-happy-surface border border-happy-sep shadow-xs",
    tagBgColor: "bg-hue-ladder",
    tagTextColor: "text-happy-label",
  },
  goals: {
    title: "insights.goals",
    icon: "target",
    iconColor: "text-happy-accent",
    bgColor: "bg-happy-surface border border-happy-sep shadow-xs",
    tagBgColor: "bg-hue-abc",
    tagTextColor: "text-happy-label",
  },
  triggers: {
    title: "insights.triggers",
    icon: "alert-circle",
    iconColor: "text-happy-accent",
    bgColor: "bg-happy-surface border border-happy-sep shadow-xs",
    tagBgColor: "bg-hue-act",
    tagTextColor: "text-happy-label",
  },
  copingStrategies: {
    title: "insights.copingStrategies",
    icon: "heart",
    iconColor: "text-happy-ink",
    bgColor: "bg-happy-surface border border-happy-sep shadow-xs",
    tagBgColor: "bg-happy-tint",
    tagTextColor: "text-happy-accent",
  },
  physicalSymptoms: {
    title: "insights.physicalSymptoms",
    icon: "activity",
    iconColor: "text-happy-accent",
    bgColor: "bg-happy-surface border border-happy-sep shadow-xs",
    tagBgColor: "bg-hue-catch",
    tagTextColor: "text-happy-label",
  },
};

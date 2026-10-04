import React from "react";
import { View, TouchableOpacity } from "react-native";
import { Text } from "@/src/components/ui/Text";
import { Enums } from "@/database.types";
import { MoodIcon, type MoodKey } from "@/src/components/MoodIcon";

import { useTranslation } from "react-i18next";

interface MoodSelectorProps {
  selectedMood: Enums<"mood">;
  onSelectMood: (mood: Enums<"mood">) => void;
  viewOnly?: boolean;
  title?: string;
  date?: string | null;
}

const formatEntryDate = (dateStr: string | null | undefined, locale: string): string | null => {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return null;
  return `${d.toLocaleDateString(locale, { month: "short", day: "numeric" })} · ${d.toLocaleTimeString(locale, { hour: "numeric", minute: "2-digit" })}`;
};

const MOODS: Enums<"mood">[] = ["terrible", "bad", "fine", "good", "great"];

/**
 * Mood selector component with vector MoodIcon
 * Ultra-clean design with minimal styling
 */
export const MoodSelector = React.memo<MoodSelectorProps>(
  ({
    selectedMood,
    onSelectMood,
    viewOnly = false,
    title,
    date,
  }: MoodSelectorProps) => {
      const { t, i18n } = useTranslation("journal");
      if (viewOnly) {
        const moodLabel = t(`entryDetail.moods.${selectedMood}`);
        const formattedDate = formatEntryDate(date, i18n.language);
        return (
          // ponytail: quiet mood tile & editorial title with subtle date
          <View 
            className="mb-4"
            accessible={true}
            accessibilityLabel={t("entryDetail.moodSummary", { title: title || t("entryDetail.dailyReflections"), mood: moodLabel })}
          >
            <View className="flex-row items-center gap-3">
              {/* Mood tile: reduced ~15%, soft cream/white surface, lower border contrast */}
              <View 
                className="h-11 w-11 items-center justify-center rounded-xl bg-white/70 border border-ink/8"
                accessibilityLabel={t("entryDetail.mood", { mood: moodLabel })}
              >
                <MoodIcon mood={selectedMood as MoodKey} size={28} />
              </View>
              <View className="flex-1 justify-center">
                <Text color="ink" className="happy-font-heading-semibold text-[24px] leading-[29px]">
                  {title || t("entryDetail.dailyReflections")}
                </Text>
                {formattedDate ? (
                  <Text color="soft" className="happy-font-body-medium text-[13px] leading-4 mt-0.5">
                    {formattedDate}
                  </Text>
                ) : null}
              </View>
            </View>
          </View>
        );
      }

    return (
      // ponytail: vector MoodIcon selection row
      <View className="px-4 pb-4">
        <View className="flex-row justify-between">
          {MOODS.map((mood) => {
            const isSelected = selectedMood === mood;
            return (
              <TouchableOpacity
                key={mood}
                onPress={() => onSelectMood(mood)}
                className="items-center"
                activeOpacity={0.7}
                accessibilityRole="button"
                accessibilityLabel={t(`entryDetail.moods.${mood}`)}
                accessibilityState={{ selected: isSelected }}
              >
                <View style={{ opacity: isSelected ? 1 : 0.45 }}>
                  <MoodIcon
                    mood={mood as MoodKey}
                    size={isSelected ? 44 : 38}
                  />
                </View>
                <Text
                  variant="caption"
                  className={`mt-1.5 text-[11px] ${
                    isSelected
                      ? "font-bold text-ink"
                      : "font-medium text-ink-soft opacity-70"
                  }`}
                >
                  {t(`entryDetail.moods.${mood}`)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  }
);

MoodSelector.displayName = "MoodSelector";

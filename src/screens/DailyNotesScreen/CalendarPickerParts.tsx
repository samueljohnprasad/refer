import React from "react";
import { Pressable, View, type DimensionValue } from "react-native";
import { useTranslation } from "react-i18next";
import { Text } from "@/src/components/ui/Text";
import MoodBadge from "@/src/components/MoodBadge";
import { SEMANTIC_COLORS } from "@/src/theme/colors";

interface CalendarDayCellProps {
  day: Date;
  inCurrentMonth: boolean;
  isTodayDate: boolean;
  isSelected: boolean;
  mood?: number;
  onPress: () => void;
  showMoodBadge: boolean;
  disabled?: boolean;
  cellStyle: { width: DimensionValue; aspectRatio: number };
}

export const CalendarDayCell = React.memo<CalendarDayCellProps>(({
  day,
  inCurrentMonth,
  isTodayDate,
  isSelected,
  mood,
  onPress,
  showMoodBadge,
  disabled = false,
  cellStyle,
}) => {
  const { i18n, t } = useTranslation("journal");
  if (!inCurrentMonth) {
    return <View style={cellStyle} className="justify-center items-center p-0.5"><View className="w-full h-full" /></View>;
  }

  const dayLabel = new Intl.NumberFormat(i18n.language).format(day.getDate());
  const dateBgStyle = isSelected
    ? { backgroundColor: SEMANTIC_COLORS.selection.surface, borderColor: SEMANTIC_COLORS.selection.foreground, borderWidth: 1 }
    : isTodayDate
      ? { backgroundColor: SEMANTIC_COLORS.surface.secondary, borderColor: SEMANTIC_COLORS.brand.soft, borderWidth: 1 }
      : { borderColor: "transparent", borderWidth: 1 };

  return (
    <Pressable
      className="justify-center items-center p-1"
      style={cellStyle}
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={t("calendar.dayA11y", { day: dayLabel, today: isTodayDate ? `, ${t("calendar.today")}` : "" })}
      accessibilityState={{ selected: isSelected, disabled }}
    >
      <View className="w-full h-full flex justify-center items-center gap-1">
        <View className="w-[34px] h-[34px] rounded-full justify-center items-center" style={dateBgStyle}>
          <Text
            variant={isTodayDate || isSelected ? "body-bold" : "body"}
            color={disabled ? "muted" : isSelected ? undefined : isTodayDate ? "ink" : "muted"}
            style={{ color: isSelected ? SEMANTIC_COLORS.brand.pressed : undefined }}
          >
            {dayLabel}
          </Text>
        </View>
        {showMoodBadge && (
          <View className={`mt-0.5 ${disabled ? "opacity-30" : ""}`}>
            <MoodBadge moodscore={mood !== undefined ? Math.round(mood) : undefined} size={22} disabled={disabled} displayOnly hideEmptySlot={disabled && mood === undefined} />
          </View>
        )}
      </View>
    </Pressable>
  );
});

export function CalendarWeekDayHeader(): React.JSX.Element {
  const { i18n } = useTranslation("journal");
  const weekdays = Array.from({ length: 7 }, (_, index) => {
    const day = new Date(2023, 0, 1 + index);
    return new Intl.DateTimeFormat(i18n.language, { weekday: "short" }).format(day);
  });

  return (
    <View className="flex-row mb-1" accessibilityElementsHidden importantForAccessibility="no">
      {weekdays.map((label, index) => (
        <View key={`${index}-${label}`} className="flex-1 items-center py-2">
          <Text variant="overline" color={index === 0 || index === 6 ? "muted" : "ink"}>
            {label}
          </Text>
        </View>
      ))}
    </View>
  );
}

const MOOD_LABEL_KEYS = ["terrible", "bad", "okay", "good", "great"] as const;

export function CalendarMoodLegend(): React.JSX.Element {
  const { t } = useTranslation("journal");
  return (
    <View className="flex-row justify-between mt-4 px-1" accessibilityElementsHidden importantForAccessibility="no">
      {MOOD_LABEL_KEYS.map((key, index) => (
        <View key={key} className="items-center gap-0.5" style={{ flex: 1 }}>
          <MoodBadge moodscore={index + 1} size={14} disabled={false} displayOnly />
          <Text variant="overline" color="muted" style={{ fontSize: 9 }} numberOfLines={1}>
            {t(`moods.${key}`, { defaultValue: key })}
          </Text>
        </View>
      ))}
    </View>
  );
}

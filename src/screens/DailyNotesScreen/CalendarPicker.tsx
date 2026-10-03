import {
  format,
  isToday,
  isSameMonth,
  isSameDay,
  startOfDay,
  isAfter,
  startOfMonth,
  addMonths,
} from "date-fns";
import React, { useMemo } from "react";
import { Pressable, View, DimensionValue } from "react-native";
import { Text } from "@/src/components/ui/Text";
import useCalendarMonth from "./hooks/useCalendarMonth";
import { CalendarDayCell, CalendarMoodLegend, CalendarWeekDayHeader } from "./CalendarPickerParts";
import { ArrowLeft01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { SEMANTIC_COLORS } from "@/src/theme/colors";
import { useTranslation } from "react-i18next";

// Calendar Picker Component
interface CalendarPickerProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  visible?: boolean; // when toggled true, resets view to selectedDate's month
  moodMap: Map<string, number> | undefined;
  showMoodBadges?: boolean; // controls visibility of mood badges/+ icons
}

export const CalendarPicker: React.FC<CalendarPickerProps> = React.memo(
  ({ selectedDate, onDateSelect, visible, moodMap, showMoodBadges = true }) => {
    const { i18n, t } = useTranslation("journal");
    const { currentMonth, days, goToPreviousMonth, goToNextMonth, goToDate } =
      useCalendarMonth({ selectedDate, visible, weekStartsOn: 0 });

    const monthTitle = new Intl.DateTimeFormat(i18n.language, {
      month: "long",
      year: "numeric",
    }).format(currentMonth);

    const canGoNextMonth = useMemo((): boolean => {
      const nextMonthStart = startOfMonth(addMonths(currentMonth, 1));
      const todayMonthStart = startOfMonth(new Date());
      return !isAfter(nextMonthStart, todayMonthStart);
    }, [currentMonth]);

    // Pre-compute day data to avoid calculations in render loop
    const daysData = useMemo(() => {
      const today = startOfDay(new Date());
      return days.map((day: Date) => {
        const dayStr = format(day, "yyyy-MM-dd");
        const disabled = isAfter(startOfDay(day), today);
        return {
          day,
          dayStr,
          inCurrentMonth: isSameMonth(day, currentMonth),
          isTodayDate: isToday(day),
          isSelected: isSameDay(day, selectedDate),
          mood: moodMap?.get(dayStr),
          disabled,
        };
      });
    }, [days, currentMonth, selectedDate, moodMap]);

    const cellStyle = useMemo(() => {
      const numberOfRows = days.length / 7;
      // Taller cells to comfortably fit the date number and mood badge without vertical overlap.
      // 5-row months get slightly taller cells (0.72); 6-row months get squarer but still tall (0.88).
      const aspectRatio = numberOfRows === 5 ? 0.72 : 0.88;
      return {
        width: "14.285%" as DimensionValue,
        aspectRatio,
      };
    }, [days.length]);

    // Create stable press handlers for each day
    const dayPressHandlers = useMemo(() => {
      return daysData.map((dayData) => () => onDateSelect(dayData.day));
    }, [daysData, onDateSelect]);

    // Determines whether the calendar is showing the current month — used to
    // conditionally show the "Today" jump affordance.
    const isViewingCurrentMonth = useMemo(
      () => isSameMonth(currentMonth, new Date()),
      [currentMonth]
    );

    return (
      <View className="px-2">
        {/*
          Month header: back-arrow (left) · title (center) · forward-arrow (right)
          Matches universal calendar convention so navigation direction is obvious.
        */}
        <View className="flex-row items-center mb-3 py-2">
          {/* Back arrow — offset by ml-10 to prevent overlap with top-left close (X) icon */}
          <Pressable
            className="h-9 w-9 items-center justify-center rounded-full bg-sage-50/60 ml-10"
            onPress={goToPreviousMonth}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            accessibilityRole="button"
            accessibilityLabel={t("calendar.previousMonth")}
            accessibilityHint={t("calendar.previousMonthHint")}
          >
            <HugeiconsIcon
              icon={ArrowLeft01Icon}
              size={18}
              color={SEMANTIC_COLORS.brand.pressed}
              strokeWidth={2}
            />
          </Pressable>

          {/* Month title — centered, with optional Today jump button */}
          <View className="flex-1 items-center">
            <Text variant="h1" color="ink">
              {monthTitle}
            </Text>
            {!isViewingCurrentMonth && (
              <Pressable
                onPress={() => goToDate(new Date())}
                accessibilityRole="button"
                accessibilityLabel={t("calendar.jumpToday")}
                hitSlop={{ top: 8, bottom: 8, left: 12, right: 12 }}
              >
                <Text
                  variant="label"
                  style={{ color: SEMANTIC_COLORS.warning.indicator, marginTop: 2 }}
                >
                  {t("calendar.today")}
                </Text>
              </Pressable>
            )}
          </View>

          {/* Forward arrow — right edge; grayed when at current month */}
          <Pressable
            className="h-9 w-9 items-center justify-center rounded-full bg-sage-50/60"
            onPress={goToNextMonth}
            disabled={!canGoNextMonth}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            accessibilityRole="button"
            accessibilityLabel={t("calendar.nextMonth")}
            accessibilityHint={t("calendar.nextMonthHint")}
          >
            <HugeiconsIcon
              icon={ArrowRight01Icon}
              size={18}
              color={canGoNextMonth ? SEMANTIC_COLORS.brand.pressed : SEMANTIC_COLORS.selection.foreground}
              strokeWidth={2}
            />
          </Pressable>
        </View>

        <CalendarWeekDayHeader />

        <View className="flex-row flex-wrap">
          {daysData.map((dayData, index) => (
            <CalendarDayCell
              key={dayData.dayStr}
              day={dayData.day}
              inCurrentMonth={dayData.inCurrentMonth}
              isTodayDate={dayData.isTodayDate}
              isSelected={dayData.isSelected}
              mood={dayData.mood}
              onPress={dayPressHandlers[index]}
              showMoodBadge={showMoodBadges}
              disabled={dayData.disabled}
              cellStyle={cellStyle}
            />
          ))}
        </View>

        {showMoodBadges && <CalendarMoodLegend />}
      </View>
    );
  }
);

CalendarPicker.displayName = "CalendarPicker";

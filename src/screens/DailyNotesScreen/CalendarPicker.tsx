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
import MoodBadge from "@/src/components/MoodBadge";
import { ArrowLeft01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import {
  BRAND_SURFACE_SOFT,
  INK,
  INK_MUTED,
  SAGE,
  SAGE_OVERLAY,
  TRANSPARENT,
  PARROT_ORANGE,
} from "@/lib/tokens";

/** Human-readable mood scale shown as a legend below the calendar grid. */
const MOOD_LEGEND = [
  { score: 1, label: "Terrible" },
  { score: 2, label: "Bad" },
  { score: 3, label: "Okay" },
  { score: 4, label: "Good" },
  { score: 5, label: "Great" },
] as const;

// Constants outside component to prevent recreation
const WEEKDAY_LABELS = [
  "Sun",
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
] as const;

// Calendar Picker Component
interface CalendarPickerProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  visible?: boolean; // when toggled true, resets view to selectedDate's month
  moodMap: Map<string, number> | undefined;
  showMoodBadges?: boolean; // controls visibility of mood badges/+ icons
}

// Memoized Day Cell Component
interface DayCellProps {
  day: Date;
  inCurrentMonth: boolean;
  isTodayDate: boolean;
  isSelected: boolean;
  mood: number | undefined;
  onPress: () => void;
  showMoodBadge: boolean;
  disabled?: boolean;
  cellStyle: {
    width: DimensionValue;
    aspectRatio: number;
  };
}

const DayCell = React.memo<DayCellProps>(
  ({
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
    const dayLabel = format(day, "d");

    const textVariant = useMemo(() => {
      if (isTodayDate || isSelected) return "body-bold";
      return "body";
    }, [isTodayDate, isSelected]);

    const textColorVariant = useMemo(() => {
      if (disabled) return "muted";
      if (isSelected) return "sage";
      return isTodayDate ? "ink" : "muted";
    }, [disabled, isSelected, isTodayDate]);

    const dateBgStyle = useMemo(() => {
      if (isSelected) {
        return {
          backgroundColor: SAGE.selected,
          borderColor: SAGE[200],
          borderWidth: 1,
        };
      }
      if (isTodayDate) {
        return {
          backgroundColor: BRAND_SURFACE_SOFT,
          borderColor: SAGE[100],
          borderWidth: 1,
        };
      }
      return { borderColor: TRANSPARENT, borderWidth: 1 };
    }, [isSelected, isTodayDate]);

    const moodClassName = useMemo(
      () => `mt-0.5 ${disabled ? "opacity-30" : ""}`,
      [disabled]
    );

    // Early return for out-of-month cells (after all hooks)
    if (!inCurrentMonth) {
      return (
        <View style={cellStyle} className="justify-center items-center p-0.5">
          <View className="w-full h-full" />
        </View>
      );
    }

    return (
      <Pressable
        className="justify-center items-center p-1"
        style={cellStyle}
        onPress={onPress}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityLabel={`${dayLabel}${isTodayDate ? ", today" : ""}`}
        accessibilityState={{ selected: isSelected, disabled }}
      >
        <View className="w-full h-full flex justify-center items-center gap-1">
          <View className="w-[34px] h-[34px] rounded-full justify-center items-center" style={dateBgStyle}>
            <Text variant={textVariant as any} color={textColorVariant as any}>
              {dayLabel}
            </Text>
          </View>
          {showMoodBadge && (
            <View className={moodClassName}>
              <MoodBadge
                disabled={disabled}
                moodscore={mood !== undefined ? Math.round(mood) : undefined}
                // 22px fills the cell without cramping the date number,
                // and meets the visual size needed for recognisable emoji.
                size={22}
                // Press handling is owned by the parent Pressable (full-cell
                // target), so the badge itself is display-only.
                displayOnly
              />
            </View>
          )}
        </View>
      </Pressable>
    );
  },
  // Custom comparison to prevent unnecessary re-renders
  (prevProps, nextProps) => {
    return (
      prevProps.isSelected === nextProps.isSelected &&
      prevProps.isTodayDate === nextProps.isTodayDate &&
      prevProps.inCurrentMonth === nextProps.inCurrentMonth &&
      prevProps.mood === nextProps.mood &&
      prevProps.showMoodBadge === nextProps.showMoodBadge &&
      prevProps.day.getTime() === nextProps.day.getTime() &&
      prevProps.cellStyle.aspectRatio === nextProps.cellStyle.aspectRatio
    );
  }
);

DayCell.displayName = "DayCell";

// Memoized Week Header Component
const WeekDayHeader = React.memo(() => (
  // important: use accessibilityElementsHidden to reduce screen reader noise
  <View
    className="flex-row mb-1"
    accessibilityElementsHidden={true}
    importantForAccessibility="no"
  >
    {WEEKDAY_LABELS.map((label, index) => {
      const isWeekend = index === 0 || index === 6;
      const colorVariant = isWeekend ? "muted" : "ink";

      return (
        <View key={label} className="flex-1 items-center py-2">
          <Text variant="overline" color={colorVariant}>
            {label}
          </Text>
        </View>
      );
    })}
  </View>
));

WeekDayHeader.displayName = "WeekDayHeader";

export const CalendarPicker: React.FC<CalendarPickerProps> = React.memo(
  ({ selectedDate, onDateSelect, visible, moodMap, showMoodBadges = true }) => {
    const { currentMonth, days, goToPreviousMonth, goToNextMonth, goToDate } =
      useCalendarMonth({ selectedDate, visible, weekStartsOn: 0 });

    // Memoize month title - use full month name
    const monthTitle = useMemo(
      () => format(currentMonth, "MMMM yyyy"),
      [currentMonth]
    );

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
            className="h-10 w-10 items-center justify-center rounded-full bg-sage-50 ml-10"
            onPress={goToPreviousMonth}
            accessibilityRole="button"
            accessibilityLabel="Previous month"
            accessibilityHint="Navigates calendar to the previous month"
          >
            <HugeiconsIcon
              icon={ArrowLeft01Icon}
              size={20}
              color={SAGE[600]}
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
                accessibilityLabel="Jump to today"
                hitSlop={{ top: 8, bottom: 8, left: 12, right: 12 }}
              >
                <Text
                  variant="label"
                  style={{ color: PARROT_ORANGE, marginTop: 2 }}
                >
                  Today
                </Text>
              </Pressable>
            )}
          </View>

          {/* Forward arrow — right edge; grayed when at current month */}
          <Pressable
            className="h-10 w-10 items-center justify-center rounded-full bg-sage-50"
            onPress={goToNextMonth}
            disabled={!canGoNextMonth}
            accessibilityRole="button"
            accessibilityLabel="Next month"
            accessibilityHint="Navigates calendar to the next month"
          >
            <HugeiconsIcon
              icon={ArrowRight01Icon}
              size={20}
              color={canGoNextMonth ? SAGE[600] : SAGE[200]}
              strokeWidth={2}
            />
          </Pressable>
        </View>

        <WeekDayHeader />

        <View className="flex-row flex-wrap">
          {daysData.map((dayData, index) => (
            <DayCell
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

        {/* Mood scale legend — 5-emoji row with labels so the scale is always
            visible without requiring prior knowledge of the 1–5 system. */}
        {showMoodBadges && (
          <View
            className="flex-row justify-between mt-4 px-1"
            accessibilityElementsHidden={true}
            importantForAccessibility="no"
          >
            {MOOD_LEGEND.map(({ score, label }) => (
              <View key={score} className="items-center gap-0.5" style={{ flex: 1 }}>
                <MoodBadge
                  moodscore={score}
                  size={14}
                  disabled={false}
                  displayOnly
                />
                <Text
                  variant="overline"
                  color="muted"
                  style={{ fontSize: 9 }}
                  numberOfLines={1}
                >
                  {label}
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>
    );
  }
);

CalendarPicker.displayName = "CalendarPicker";

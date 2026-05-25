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
import { Text } from "@/components/Themed";
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
} from "@/lib/tokens";

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

    // All hooks MUST be called before any conditional returns (Rules of Hooks)
    const containerClassName = useMemo(
      () =>
        "w-full h-full flex justify-center items-center gap-1 rounded-xl",
      []
    );

    const textClassName = useMemo(() => {
      if (disabled) return "happy-font-body-semibold text-[18px]";
      if (isTodayDate && !isSelected) return "happy-font-body-bold text-[18px]";
      if (isSelected) return "happy-font-body-bold text-[18px]";
      return "happy-font-body-medium text-[18px]";
    }, [isTodayDate, isSelected, disabled]);

    const textColor = useMemo(() => {
      if (disabled) return SAGE_OVERLAY.disabled;
      if (isSelected) return SAGE[600];
      return isTodayDate ? INK : INK_MUTED;
    }, [disabled, isSelected, isTodayDate]);

    const containerStyle = useMemo(() => {
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
        accessibilityLabel={`${dayLabel}, ${isTodayDate ? "today" : ""}`}
        accessibilityState={{ selected: isSelected, disabled }}
      >
        <View className={containerClassName} style={containerStyle}>
          <Text className={textClassName} style={{ color: textColor }}>
            {dayLabel}
          </Text>
          {showMoodBadge && (
            <View className={moodClassName}>
              <MoodBadge
                disabled={disabled}
                moodscore={Math.round(mood || 0)}
                size={16}
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
    {WEEKDAY_LABELS.map((day) => (
      <Text
        key={day}
        className="happy-font-body-bold flex-1 text-center text-xs uppercase tracking-widest py-2"
        style={{ color: INK_MUTED }}
      >
        {day}
      </Text>
    ))}
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
      const aspectRatio = numberOfRows === 5 ? 0.86 : 1.05;
      return {
        width: "14.285%" as DimensionValue,
        aspectRatio,
      };
    }, [days.length]);

    // Create stable press handlers for each day
    const dayPressHandlers = useMemo(() => {
      return daysData.map((dayData) => () => onDateSelect(dayData.day));
    }, [daysData, onDateSelect]);

    return (
      <View className="px-2">
        {/* Month header with title on left, arrows on right */}
        <View className="flex-row justify-between items-center mb-3 py-2">
          <Text
            className="happy-font-heading-bold text-[30px] tracking-tight"
            style={{ color: INK }}
          >
            {monthTitle}
          </Text>
          <View className="flex-row items-center gap-2">
            <Pressable
              className="h-10 w-10 items-center justify-center rounded-full bg-sage-50"
              onPress={goToPreviousMonth}
              accessibilityRole="button"
              accessibilityLabel="Previous Month"
              accessibilityHint="Navigates calendar to the previous month"
            >
              <HugeiconsIcon
                icon={ArrowLeft01Icon}
                size={20}
                color={SAGE[600]}
                strokeWidth={2}
              />
            </Pressable>
            <Pressable
              className="h-10 w-10 items-center justify-center rounded-full bg-sage-50"
              onPress={goToNextMonth}
              disabled={!canGoNextMonth}
              accessibilityRole="button"
              accessibilityLabel="Next Month"
              accessibilityHint="Navigates calendar to the next month"
            >
              <HugeiconsIcon
                icon={ArrowRight01Icon}
                size={20}
                color={
                  canGoNextMonth
                    ? SAGE[600]
                    : SAGE[200]
                }
                strokeWidth={2}
              />
            </Pressable>
          </View>
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
      </View>
    );
  }
);

CalendarPicker.displayName = "CalendarPicker";

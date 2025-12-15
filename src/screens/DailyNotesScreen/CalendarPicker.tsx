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
import { Pressable, View, Text, DimensionValue } from "react-native";
import useCalendarMonth from "./hooks/useCalendarMonth";
import MoodBadge from "@/src/components/MoodBadge";
import { ArrowLeft01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";

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

    // If not in current month, render empty cell for spacing
    if (!inCurrentMonth) {
      return (
        <View style={cellStyle} className="justify-center items-center p-[2px]">
          <View className="w-full h-full" />
        </View>
      );
    }

    // Memoize className strings to avoid recalculation
    const containerClassName = useMemo(
      () =>
        `w-full h-full flex justify-center items-center gap-0.5 rounded-xl ${
          isSelected ? "bg-[#7B61FF]" : isTodayDate ? "bg-white/20" : ""
        }`,
      [isSelected, isTodayDate]
    );

    const textClassName = useMemo(() => {
      const getValue = () => {
        if (disabled) return "text-black/30";
        if (isTodayDate && !isSelected) return "text-black/60 font-bold";
        if (isSelected) return "text-white font-bold";
        return "text-black/60";
      };
      return `text-[18px] font-semibold ${getValue()}`;
    }, [isTodayDate, isSelected, disabled]);

    const moodClassName = useMemo(() => {
      const getValue = () => {
        if (disabled) return "opacity-30";
        return "";
      };
      return `mt-0.5 ${getValue()}`;
    }, [disabled]);

    return (
      <Pressable
        className="justify-center items-center p-[2px]"
        style={cellStyle}
        onPress={onPress}
        disabled={disabled}
        accessibilityRole="button"
      >
        <View className={containerClassName}>
          <Text className={textClassName}>{dayLabel}</Text>
          {showMoodBadge && (
            <View className={moodClassName}>
              <MoodBadge disabled={disabled} moodscore={Math.round(mood || 0)} size={16} />
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
  <View className="flex-row mb-1">
    {WEEKDAY_LABELS.map((day) => (
      <Text
        key={day}
        className="flex-1 text-center text-[12px] font-bold text-black/50 uppercase tracking-widest py-2"
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
        <View className="flex-row justify-between items-center mb-2 py-2">
          <Text className="text-[22px] font-bold text-black tracking-tight font-cormorantBold">
            {monthTitle}
          </Text>
          <View className="flex-row items-center gap-2">
            <Pressable className="p-2 rounded-full" onPress={goToPreviousMonth}>
              <HugeiconsIcon icon={ArrowLeft01Icon} size={20} color="#007AFF" />
            </Pressable>
            <Pressable
              className="p-2 rounded-full"
              onPress={goToNextMonth}
              disabled={!canGoNextMonth}
            >
              <HugeiconsIcon
                icon={ArrowRight01Icon}
                size={20}
                color={canGoNextMonth ? "#007AFF" : "#C7C7CC"}
              />
            </Pressable>
          </View>
        </View>

        <WeekDayHeader />

        <View className="flex-row flex-wrap -mx-[2px]">
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

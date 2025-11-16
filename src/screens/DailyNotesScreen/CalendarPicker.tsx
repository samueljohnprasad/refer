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
import { Pressable, View, Text } from "react-native";
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
const DAY_CELL_STYLE = { width: "14.285%", aspectRatio: 1 } as const;

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
  }) => {
    const dayLabel = format(day, "d");

    // Memoize className strings to avoid recalculation
    const containerClassName = useMemo(
      () =>
        `w-full h-full flex justify-center items-center gap-0.5 rounded-lg ${
          isSelected ? "bg-[#7B61FF]" : isTodayDate ? "bg-white/15" : ""
        }`,
      [isSelected, isTodayDate]
    );

    const textClassName = useMemo(() => {
      const getValue = () => {
        if (disabled) return "text-black/30";
        if (!inCurrentMonth) return "text-black/50";
        if (isTodayDate && !isSelected) return "text-black font-semibold";
        if (isSelected) return "text-black font-semibold";

        return "text-black";
      };
      return `text-[14px] font-medium ${getValue()}`;
    }, [inCurrentMonth, isTodayDate, isSelected, disabled]);

    const moodClassName = useMemo(() => {
      const getValue = () => {
        if (disabled) return "opacity-30";
        if (!inCurrentMonth) return "opacity-50";
        return "";
      };
      return `mt-0.5 ${getValue()}`;
    }, [inCurrentMonth]);

    return (
      <Pressable
        className="justify-center items-center p-[2px]"
        style={DAY_CELL_STYLE}
        onPress={onPress}
        disabled={disabled}
        accessibilityRole="button"
      >
        <View className={containerClassName}>
          <Text className={textClassName}>{dayLabel}</Text>
          {showMoodBadge && (
            <View className={moodClassName}>
              <MoodBadge disabled={disabled} moodscore={mood} size={18} />
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
      prevProps.day.getTime() === nextProps.day.getTime()
    );
  }
);

DayCell.displayName = "DayCell";

// Memoized Week Header Component
const WeekDayHeader = React.memo(() => (
  <View className="flex-row mb-2">
    {WEEKDAY_LABELS.map((day) => (
      <Text
        key={day}
        className="flex-1 text-center text-[11px] font-semibold text-white/60 uppercase tracking-wider py-1"
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

    // Memoize month title
    const monthTitle = useMemo(
      () => format(currentMonth, "MMM yyyy"),
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

    // Create stable press handlers for each day
    const dayPressHandlers = useMemo(() => {
      return daysData.map((dayData) => () => onDateSelect(dayData.day));
    }, [daysData, onDateSelect]);

    return (
      <View className="px-1">
        <View className="flex-row justify-between items-center mb-4">
          <Pressable className="p-2 -ml-2" onPress={goToPreviousMonth}>
            <HugeiconsIcon icon={ArrowLeft01Icon} size={22} color="#fff" />
          </Pressable>
          <Text className="text-[18px] font-semibold text-white tracking-wide">
            {monthTitle}
          </Text>
          <Pressable
            className="p-2 -mr-2"
            onPress={goToNextMonth}
            disabled={!canGoNextMonth}
          >
            <HugeiconsIcon
              icon={ArrowRight01Icon}
              size={22}
              color={canGoNextMonth ? "#fff" : "#9b9b9b"}
            />
          </Pressable>
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
            />
          ))}
        </View>
      </View>
    );
  }
);

CalendarPicker.displayName = "CalendarPicker";

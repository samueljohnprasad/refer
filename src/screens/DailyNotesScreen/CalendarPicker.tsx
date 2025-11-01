import { Feather } from "@expo/vector-icons";
import { format, isToday, isSameMonth, isSameDay } from "date-fns";
import React, { useMemo, useCallback } from "react";
import { Pressable, View } from "react-native";
import { Text } from "@/components/Themed";
import useCalendarMonth from "./hooks/useCalendarMonth";
import MoodBadge from "@/src/components/MoodBadge";

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
}

const DayCell = React.memo<DayCellProps>(
  ({ day, inCurrentMonth, isTodayDate, isSelected, mood, onPress, showMoodBadge }) => {
    const dayLabel = format(day, "d");

    // Memoize className strings to avoid recalculation
    const containerClassName = useMemo(
      () =>
        `w-full h-full flex justify-center items-center gap-0.5 ${
          isSelected
            ? "bg-[#7B61FF] rounded-lg"
            : isTodayDate
            ? "bg-white/15 rounded-lg"
            : ""
        }`,
      [isSelected, isTodayDate]
    );

    const textClassName = useMemo(
      () =>
        `text-[14px] font-medium ${
          !inCurrentMonth
            ? "text-white/30"
            : isTodayDate && !isSelected
            ? "text-white font-semibold"
            : isSelected
            ? "text-white font-semibold"
            : "text-white/90"
        }`,
      [inCurrentMonth, isTodayDate, isSelected]
    );

    const moodClassName = useMemo(
      () => `mt-0.5 ${!inCurrentMonth ? "opacity-30" : ""}`,
      [inCurrentMonth]
    );

    return (
      <Pressable
        className="justify-center items-center p-[2px]"
        style={DAY_CELL_STYLE}
        onPress={onPress}
        accessibilityRole="button"
      >
        <View className={containerClassName}>
          <Text className={textClassName}>{dayLabel}</Text>
          {showMoodBadge && (
            <View className={moodClassName}>
              <MoodBadge moodscore={mood} size={18} />
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

    // Pre-compute day data to avoid calculations in render loop
    const daysData = useMemo(() => {
      return days.map((day: Date) => {
        const dayStr = format(day, "yyyy-MM-dd");
        return {
          day,
          dayStr,
          inCurrentMonth: isSameMonth(day, currentMonth),
          isTodayDate: isToday(day),
          isSelected: isSameDay(day, selectedDate),
          mood: moodMap?.get(dayStr),
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
            <Feather name="chevron-left" size={22} color="#fff" />
          </Pressable>
          <Text className="text-[18px] font-semibold text-white tracking-wide">{monthTitle}</Text>
          <Pressable className="p-2 -mr-2" onPress={goToNextMonth}>
            <Feather name="chevron-right" size={22} color="#fff" />
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
            />
          ))}
        </View>
      </View>
    );
  }
);

CalendarPicker.displayName = "CalendarPicker";

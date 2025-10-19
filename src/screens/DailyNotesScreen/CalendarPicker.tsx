import { Feather } from "@expo/vector-icons";
import { format, isToday, isSameMonth, isSameDay } from "date-fns";
import React, { useMemo, useCallback } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Text } from "@/components/Themed";
import useCalendarMonth from "./hooks/useCalendarMonth";
import MoodBadge from "@/src/components/MoodBadge";

// Calendar Picker Component
interface CalendarPickerProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  edgeToEdge?: boolean; // remove top margin and horizontal padding when true
  visible?: boolean; // when toggled true, resets view to selectedDate's month
  moodMap: Map<string, number> | undefined;
}

// Memoized Day Cell Component
interface DayCellProps {
  day: Date;
  inCurrentMonth: boolean;
  isTodayDate: boolean;
  isSelected: boolean;
  mood: number | undefined;
  onPress: () => void;
}

const DayCell = React.memo<DayCellProps>(({ day, inCurrentMonth, isTodayDate, isSelected, mood, onPress }) => {
  const dayLabel = useMemo(() => format(day, "d"), [day]);
  const accessibilityLabel = useMemo(() => `Select ${format(day, "EEEE, MMM d, yyyy")}`, [day]);

  return (
    <Pressable
      style={[styles.dayCell]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
    >
      <View
        style={[
          styles.dayCellInside,
          isTodayDate && !isSelected && styles.todayDayCell,
          isSelected && styles.selectedDayCell,
        ]}
      >
        <Text
          style={[
            styles.dayCellText,
            !inCurrentMonth && styles.otherMonthText,
            isSelected && styles.selectedDayText,
            isTodayDate && !isSelected && styles.todayDayText,
          ]}
        >
          {dayLabel}
        </Text>
        <View
          style={[
            styles.moodWrapper,
            !inCurrentMonth && styles.moodDimmed,
          ]}
        >
          <MoodBadge moodscore={mood} size={20} />
        </View>
      </View>
    </Pressable>
  );
});

DayCell.displayName = 'DayCell';

export const CalendarPicker: React.FC<CalendarPickerProps> = React.memo(({
  selectedDate,
  onDateSelect,
  edgeToEdge,
  visible,
  moodMap,
}) => {
  const { currentMonth, days, goToPreviousMonth, goToNextMonth } =
    useCalendarMonth({ selectedDate, visible, weekStartsOn: 0 });

  const WEEKDAY_LABELS: ReadonlyArray<string> = useMemo(
    () => ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const,
    []
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
    <View
      style={[
        styles.calendarPicker,
        edgeToEdge && { marginTop: 0, paddingHorizontal: 0 },
      ]}
    >
      <View style={styles.monthHeader}>
        <Pressable style={styles.monthNavButton} onPress={goToPreviousMonth}>
          <Feather name="chevron-left" size={20} color="#fff" />
        </Pressable>
        <Text style={styles.monthTitle}>
          {format(currentMonth, "MMM yyyy")}
        </Text>
        <Pressable style={styles.monthNavButton} onPress={goToNextMonth}>
          <Feather name="chevron-right" size={20} color="#fff" />
        </Pressable>
      </View>

      <View style={styles.weekDaysHeader}>
        {WEEKDAY_LABELS.map((day) => (
          <Text key={day} style={styles.weekDayLabel}>
            {day}
          </Text>
        ))}
      </View>

      <View style={styles.daysGrid}>
        {daysData.map((dayData, index) => (
          <DayCell
            key={dayData.dayStr}
            day={dayData.day}
            inCurrentMonth={dayData.inCurrentMonth}
            isTodayDate={dayData.isTodayDate}
            isSelected={dayData.isSelected}
            mood={dayData.mood}
            onPress={dayPressHandlers[index]}
          />
        ))}
      </View>
    </View>
  );
});

CalendarPicker.displayName = 'CalendarPicker';

const styles = StyleSheet.create({
  calendarPicker: {
    marginTop: 8,
  },
  monthHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 0,
  },
  monthNavButton: {
    padding: 8,
  },
  monthTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  weekDaysHeader: {
    flexDirection: "row",
    marginBottom: 0,
  },
  weekDayLabel: {
    flex: 1,
    textAlign: "center",
    fontSize: 12,
    fontWeight: "600",
    color: "#EDE9FF",
    paddingVertical: 6,
  },
  daysGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  dayCell: {
    width: "14.28%",
    height: "14.28%",
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 2,
    // borderRadius: 12,
  },
  dayCellInside: {
    width: "100%",
    height: "100%",
    // borderRadius: 12,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: 2,
  },
  selectedDayCell: {
    backgroundColor: "#7B61FF",
    borderRadius: 12,
  },
  todayDayCell: {
    backgroundColor: "rgba(255,255,255,0.12)",
    borderRadius: 12,
  },
  dayCellText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#FFFFFF",
    borderRadius: 12,
  },
  selectedDayText: {
    color: "#fff",
    fontWeight: "600",
  },
  todayDayText: {
    color: "#fff",
    fontWeight: "700",
  },
  otherMonthText: {
    color: "#C7BDF9",
  },
  moodWrapper: {
    marginTop: 2,
  },
  moodDimmed: {
    opacity: 0.4,
  },
});

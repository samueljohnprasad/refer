import { Feather } from "@expo/vector-icons";
import {
  addMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isToday,
  isSameMonth,
  isSameDay,
} from "date-fns";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

// Calendar Picker Component
interface CalendarPickerProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  edgeToEdge?: boolean; // remove top margin and horizontal padding when true
  visible?: boolean; // when toggled true, resets view to selectedDate's month
}

export const CalendarPicker: React.FC<CalendarPickerProps> = ({
  selectedDate,
  onDateSelect,
  edgeToEdge,
  visible,
}) => {
  const [currentMonth, setCurrentMonth] = useState<Date>(
    startOfMonth(selectedDate)
  );

  const WEEKDAY_LABELS: ReadonlyArray<string> = useMemo(
    () => ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const,
    []
  );

  // Keep the calendar's visible month in sync with the externally selected date
  useEffect((): void => {
    setCurrentMonth(startOfMonth(selectedDate));
  }, [selectedDate]);

  // When the calendar becomes visible (e.g., expanded), ensure it shows the selected date's month
  useEffect((): void => {
    if (visible) {
      setCurrentMonth(startOfMonth(selectedDate));
    }
  }, [visible, selectedDate]);

  const getVisibleDates = useCallback(
    (currentMonth: Date) => {
      const visibleStart = startOfWeek(startOfMonth(currentMonth), {
        weekStartsOn: 0,
      });
      const visibleEnd = endOfWeek(endOfMonth(currentMonth), {
        weekStartsOn: 0,
      });
      return { visibleStart, visibleEnd };
    },
    [currentMonth]
  );

  const getVisibleDatesMemo = useMemo(
    () => getVisibleDates(currentMonth),
    [currentMonth]
  );

  const days = useMemo<Date[]>((): Date[] => {
    return eachDayOfInterval({
      start: getVisibleDatesMemo.visibleStart,
      end: getVisibleDatesMemo.visibleEnd,
    });
  }, [getVisibleDatesMemo.visibleEnd, getVisibleDatesMemo.visibleStart]);

  const goToPreviousMonth = (): void => {
    setCurrentMonth((prev: Date) => startOfMonth(addMonths(prev, -1)));
    getVisibleDates(currentMonth);
  };

  const goToNextMonth = (): void => {
    setCurrentMonth((prev: Date) => startOfMonth(addMonths(prev, 1)));
    getVisibleDates(currentMonth);
  };

  return (
    <View
      style={[
        styles.calendarPicker,
        edgeToEdge && { marginTop: 0, paddingHorizontal: 0 },
      ]}
    >
      <View style={styles.monthHeader}>
        <Pressable style={styles.monthNavButton} onPress={goToPreviousMonth}>
          <Feather name="chevron-left" size={20} color="#000" />
        </Pressable>
        <Text style={styles.monthTitle}>
          {format(currentMonth, "MMMM yyyy")}
        </Text>
        <Pressable style={styles.monthNavButton} onPress={goToNextMonth}>
          <Feather name="chevron-right" size={20} color="#000" />
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
        {days.map((day: Date) => {
          const inCurrentMonth: boolean = isSameMonth(day, currentMonth);
          const isTodayDate: boolean = isToday(day);
          const isSelected: boolean = isSameDay(day, selectedDate);

          return (
            <Pressable
              key={format(day, "yyyy-MM-dd")}
              style={[
                styles.dayCell,
                isSelected && styles.selectedDayCell,
                isTodayDate && !isSelected && styles.todayDayCell,
              ]}
              onPress={(): void => onDateSelect(day)}
            >
              <Text
                style={[
                  styles.dayCellText,
                  !inCurrentMonth && styles.otherMonthText,
                  isSelected && styles.selectedDayText,
                  isTodayDate && !isSelected && styles.todayDayText,
                ]}
              >
                {format(day, "d")}
              </Text>
              <View
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: "#ccc",
                  borderStyle: "dashed",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 2,
                  shadowColor: "#000",
                  shadowOpacity: 0.1,
                  shadowOffset: { width: 0, height: 2 },
                  shadowRadius: 3,
                  elevation: 2,
                }}
              >
                <Text
                  style={{
                    fontSize: 8,
                    color: "#ccc",
                  }}
                >
                  {"＋"}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  calendarPicker: {
    marginTop: 16,
  },
  monthHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  monthNavButton: {
    padding: 8,
  },
  monthTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
  },
  weekDaysHeader: {
    flexDirection: "row",
    marginBottom: 4,
  },
  weekDayLabel: {
    flex: 1,
    textAlign: "center",
    fontSize: 12,
    fontWeight: "500",
    color: "#666",
    paddingVertical: 8,
  },
  daysGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  dayCell: {
    width: "14.28%",
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    marginVertical: 2,
    gap: 4,
  },
  selectedDayCell: {
    backgroundColor: "#007AFF",
  },
  todayDayCell: {
    backgroundColor: "#E3F2FD",
  },
  dayCellText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#000",
  },
  selectedDayText: {
    color: "#fff",
    fontWeight: "600",
  },
  todayDayText: {
    color: "#007AFF",
    fontWeight: "600",
  },
  otherMonthText: {
    color: "#ccc",
  },
});

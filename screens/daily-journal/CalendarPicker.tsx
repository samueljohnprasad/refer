import { Feather } from "@expo/vector-icons";
import { format, isToday, isSameMonth, isSameDay } from "date-fns";
import { useEffect, useMemo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import useCalendarMonth from "./hooks/useCalendarMonth";
import MoodBadge from "@/components/dailyJournal/MoodBadge";

// Calendar Picker Component
interface CalendarPickerProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  edgeToEdge?: boolean; // remove top margin and horizontal padding when true
  visible?: boolean; // when toggled true, resets view to selectedDate's month
  moodMap: Map<string, number> | undefined;
}

export const CalendarPicker: React.FC<CalendarPickerProps> = ({
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
          const mood = moodMap?.get(format(day, "yyyy-MM-dd"));

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
              <MoodBadge moodscore={mood} size={28} />
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

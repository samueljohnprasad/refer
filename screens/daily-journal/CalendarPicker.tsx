import { Feather } from "@expo/vector-icons";
import { format, isToday, isSameMonth, isSameDay } from "date-fns";
import { useMemo } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Text } from "@/components/Themed";
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
        {days.map((day: Date) => {
          const inCurrentMonth: boolean = isSameMonth(day, currentMonth);
          const isTodayDate: boolean = isToday(day);
          const isSelected: boolean = isSameDay(day, selectedDate);
          const mood = moodMap?.get(format(day, "yyyy-MM-dd"));

          return (
            <Pressable
              key={format(day, "yyyy-MM-dd")}
              style={[styles.dayCell]}
              onPress={(): void => onDateSelect(day)}
              accessibilityRole="button"
              accessibilityLabel={`Select ${format(day, "EEEE, MMM d, yyyy")}`}
            >
              <View
                style={[
                  styles.dayCellInside,
                  isSelected && styles.selectedDayCell,
                  isTodayDate && !isSelected && styles.todayDayCell,
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
                  {format(day, "d")}
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
        })}
      </View>
    </View>
  );
};

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
  },
  dayCellInside: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: 2,
  },
  selectedDayCell: {
    backgroundColor: "#7B61FF",
  },
  todayDayCell: {
    backgroundColor: "rgba(255,255,255,0.12)",
    borderColor: "rgba(255,255,255,0.65)",
  },
  dayCellText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#FFFFFF",
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

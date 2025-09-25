import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  Pressable,
  Animated,
  PanResponder,
  Easing,
} from "react-native";
import { Text, View as ThemedView } from "@/components/Themed";
import { Feather } from "@expo/vector-icons";
import { Stack } from "expo-router";
import { format, startOfWeek, addDays, isToday } from "date-fns";
import {
  MentalHealthProfileContainer,
  useMentalHealthData,
} from "@/components/mentalHealth/MentalHealthProfileContainer";
import { useAtom } from "jotai";
import { currentWeekViewAtom, selectedDateAtom } from "./atoms";
import DailyNotesHeader from "./DailyNotesHeader";

// Animated Day Button Component
interface DayButtonProps {
  day: Date;
  dayName: string;
  isSelected: boolean;
  isToday: boolean;
  onPress: () => void;
}

export const DayButton: React.FC<DayButtonProps> = ({
  day,
  dayName,
  isSelected,
  isToday,
  onPress,
}) => {
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Gentle glow animation for selected state
    Animated.timing(glowAnim, {
      toValue: isSelected ? 1 : 0,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [isSelected]);

  const handlePress = () => {
    onPress();
  };

  return (
    <Pressable onPress={handlePress}>
      <Animated.View
        style={[
          styles.dayBox,
          isSelected && styles.dayBoxActive,
          {
            opacity: glowAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0.8, 1],
            }),
          },
        ]}
      >
        <Animated.View
          style={{
            opacity: glowAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0.7, 1],
            }),
          }}
          className="flex flex-col items-center"
        >
          <Text style={[styles.dayName, isSelected && styles.dayNameActive]}>
            {dayName}
          </Text>
          <Text
            style={[
              styles.dayNumberText,
              isSelected && styles.dayNumberTextActive,
            ]}
          >
            {format(day, "d")}
          </Text>
        </Animated.View>
        {isToday && !isSelected && <View style={styles.todayIndicator} />}
      </Animated.View>
    </Pressable>
  );
};

const DailyNotesScreen = () => {
  // State for selected date
  const [selectedDate, setSelectedDate] = useAtom(selectedDateAtom);
  // State for current week view (independent of selected date)
  const [currentWeekView, setCurrentWeekView] = useAtom(currentWeekViewAtom);

  // Animation values
  const weekSlideAnim = useRef(new Animated.Value(0)).current;

  // Content swipe animation
  const contentSlideAnim = useRef(new Animated.Value(0)).current;
  // Opacity animation for mindful cross-fade
  const contentOpacityAnim = useRef(new Animated.Value(1)).current;
  // Day label animation values
  const dayLabelOpacityAnim = useRef(new Animated.Value(1)).current;
  const dayLabelTranslateAnim = useRef(new Animated.Value(0)).current;

  // Helper to move date by offset without stale closure issues
  const changeDateBy = (offset: number) => {
    // Animate week header slide to match arrow behavior
    const direction = offset > 0 ? 1 : -1;
    Animated.timing(weekSlideAnim, {
      toValue: direction,
      duration: 350,
      useNativeDriver: true,
    }).start(() => {
      Animated.timing(weekSlideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    });
    // Gently fade out, change date, then fade back in
    Animated.timing(contentOpacityAnim, {
      toValue: 0.15,
      duration: 180,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start(() => {
      // Once faded, update date
      setSelectedDate((prev) => {
        const newDate = addDays(prev, offset);
        setCurrentWeekView(newDate);
        return newDate;
      });

      // Reset slide value to avoid sticking
      contentSlideAnim.setValue(0);

      // Fade content back in
      Animated.timing(contentOpacityAnim, {
        toValue: 1,
        duration: 300,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }).start();
    });
  };

  const goToPreviousDateContent = () => changeDateBy(-1);
  const goToNextDateContent = () => changeDateBy(1);

  // Pan responder for content area
  const clamp = (value: number, min: number, max: number) =>
    Math.min(Math.max(value, min), max);

  const contentPanResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) =>
        Math.abs(g.dx) > Math.abs(g.dy) && Math.abs(g.dx) > 10,

      onPanResponderMove: (_, g) => {
        // Directly use dx, but clamp for safety
        contentSlideAnim.setValue(clamp(g.dx, -120, 120));
      },
      onPanResponderRelease: (_, g) => {
        const absDx = Math.abs(g.dx);
        const direction = g.dx > 0 ? "right" : "left";

        // Decide and change date BEFORE animating back to center
        if (absDx > 60) {
          if (direction === "left") {
            goToNextDateContent();
          } else {
            goToPreviousDateContent();
          }
        }

        // Return content smoothly to center
        Animated.spring(contentSlideAnim, {
          toValue: 0,
          useNativeDriver: true,
          friction: 6,
        }).start();
      },
      onPanResponderTerminate: () => {
        Animated.spring(contentSlideAnim, {
          toValue: 0,
          useNativeDriver: true,
          friction: 6,
        }).start();
      },
      onPanResponderTerminationRequest: () => false,
    })
  ).current;

  // Animate day label with breath-like motion
  useEffect(() => {
    // Start from slightly faded and elevated
    dayLabelOpacityAnim.setValue(0.7);
    dayLabelTranslateAnim.setValue(6);

    // Gentle breath-in animation (like inhale)
    const breathIn = Animated.parallel([
      Animated.timing(dayLabelOpacityAnim, {
        toValue: 1,
        duration: 900, // Slower for serenity
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(dayLabelTranslateAnim, {
        toValue: 0,
        duration: 1100, // Slight stagger for organic feel
        easing: Easing.out(Easing.sin),
        useNativeDriver: true,
      }),
    ]);

    // Subtle breath-out (like exhale) - more subtle
    const breathOut = Animated.parallel([
      Animated.timing(dayLabelOpacityAnim, {
        toValue: 0.95, // Slight fade on settle
        duration: 300,
        delay: 200, // Pause at peak
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]);

    Animated.sequence([breathIn, breathOut]).start();
  }, [selectedDate]);

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* <DailyNotesHeader /> */}
        <Stack.Screen
          options={{ header: () => <DailyNotesHeader />, headerShown: true }}
        />

        {/* Date and Content */}
        <Animated.View
          style={[
            styles.mainContent,
            {
              opacity: contentOpacityAnim,
              transform: [
                {
                  translateX: contentSlideAnim,
                },
              ],
            },
          ]}
          {...contentPanResponder.panHandlers}
        >
          {/* Mental Health Journal Dashboard */}
          <View style={styles.mentalHealthSection}>
            <MentalHealthProfileContainer
              selectedDate={selectedDate}
              onRefresh={() => {
                // Optional refresh logic for mental health data
              }}
            />
          </View>
        </Animated.View>
      </ScrollView>

      {/* Calendar Modal */}
    </ThemedView>
  );
};

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
  const [currentMonth, setCurrentMonth] = useState(selectedDate);

  // Keep the calendar's visible month in sync with the externally selected date
  useEffect(() => {
    setCurrentMonth(selectedDate);
  }, [selectedDate]);

  // When the calendar becomes visible (e.g., expanded), ensure it shows the selected date's month
  useEffect(() => {
    if (visible) {
      setCurrentMonth(selectedDate);
    }
  }, [visible, selectedDate]);

  // Get days in current month
  const startOfCurrentMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1
  );
  const endOfCurrentMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  );
  const startDate = startOfWeek(startOfCurrentMonth, { weekStartsOn: 0 });
  const endDate = addDays(endOfCurrentMonth, 6 - endOfCurrentMonth.getDay());

  const days = [];
  let current = startDate;
  while (current <= endDate) {
    days.push(current);
    current = addDays(current, 1);
  }

  const goToPreviousMonth = () => {
    setCurrentMonth((prev) => addDays(prev, -30));
  };

  const goToNextMonth = () => {
    setCurrentMonth((prev) => addDays(prev, 30));
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
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <Text key={day} style={styles.weekDayLabel}>
            {day}
          </Text>
        ))}
      </View>

      <View style={styles.daysGrid}>
        {days.map((day, index) => {
          const isCurrentMonth = day.getMonth() === currentMonth.getMonth();
          const isTodayDate = isToday(day);
          const isSelected =
            format(day, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd");

          return (
            <Pressable
              key={index}
              style={[
                styles.dayCell,
                isSelected && styles.selectedDayCell,
                isTodayDate && !isSelected && styles.todayDayCell,
              ]}
              onPress={() => onDateSelect(day)}
            >
              <Text
                style={[
                  styles.dayCellText,
                  !isCurrentMonth && styles.otherMonthText,
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
  container: {
    flex: 1,
    marginBottom: 60,
    backgroundColor: "#f5f5f5",
  },
  scrollView: {
    flex: 1,
  },
  content: {
    // paddingHorizontal: 12,
    paddingTop: 56,
    paddingBottom: 32,
  },
  calendarHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 0,
    paddingHorizontal: 12,
  },
  navigationContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  navButton: {
    padding: 6,
  },
  todayText: {
    fontSize: 17,
    fontWeight: "600",
    color: "#fff",
    marginHorizontal: 16,
    textAlign: "center",
  },
  moreButton: {
    padding: 8,
  },

  weekDaysRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  weekDatesRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dayContainer: {
    alignItems: "center",
    flex: 1,
  },
  weekRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dayBox: {
    alignItems: "center",
    paddingVertical: 6,
    borderRadius: 8,
  },
  dayBoxActive: {
    backgroundColor: "#007AFF",
    padding: 10,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  dayName: {
    fontSize: 12,
    fontWeight: "500",
    color: "#fff",
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  dayNameActive: {
    color: "#fff",
  },
  dayNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  dayNumberActive: {
    backgroundColor: "#007BFF",
  },
  dayNumberText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#fff",
  },
  dayNumberTextActive: {
    color: "#fff",
    fontWeight: "600",
  },
  weekDivider: {
    height: 1,
    backgroundColor: "#e0e0e0",
    marginHorizontal: -12,
    marginBottom: 24,
  },
  mainContent: {
    paddingHorizontal: 12,
    paddingTop: 0,
    backgroundColor: "#f5f5f5",
  },
  dateHeader: {
    marginBottom: 24,
  },
  dayLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#007AFF",
    letterSpacing: 1,
    marginBottom: 8,
  },
  dateText: {
    fontSize: 36,
    fontWeight: "700",
    color: "#000",
    lineHeight: 42,
  },
  description: {
    fontSize: 16,
    color: "#666",
    lineHeight: 24,
    marginBottom: 32,
  },
  tasksIntro: {
    fontSize: 16,
    color: "#666",
    lineHeight: 24,
    marginBottom: 24,
  },
  tasksContainer: {
    gap: 16,
  },
  taskItem: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#ddd",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    marginTop: 2,
  },
  checkboxCompleted: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  taskText: {
    fontSize: 16,
    color: "#000",
    lineHeight: 24,
    flex: 1,
  },
  taskTextCompleted: {
    color: "#999",
    textDecorationLine: "line-through",
  },
  // Mental Health Section Styles
  mentalHealthSection: {
    paddingTop: 8,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#000",
    marginBottom: 8,
    lineHeight: 32,
  },
  sectionDescription: {
    fontSize: 16,
    color: "#666",
    lineHeight: 24,
    marginBottom: 24,
  },
  todayIndicator: {
    position: "absolute",
    bottom: -6,
    left: "50%",
    transform: [{ translateX: -2 }],
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#007AFF",
  },

  // Calendar Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },

  // Calendar Picker Styles
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

export default DailyNotesScreen;

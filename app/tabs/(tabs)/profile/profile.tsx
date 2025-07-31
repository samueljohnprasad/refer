import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  Pressable,
  Modal,
  Dimensions,
  Animated,
  PanResponder,
  Easing,
} from "react-native";
import { View as ThemedView } from "@/components/Themed";
import { Text } from "@/components/ui/text";
import { Feather } from "@expo/vector-icons";
import { Stack } from "expo-router";
import { format, startOfWeek, addDays, isToday } from "date-fns";

interface TaskItemProps {
  text: string;
  completed: boolean;
  onToggle?: () => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ text, completed, onToggle }) => {
  const breatheAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Gentle fade animation for completed tasks
    Animated.timing(fadeAnim, {
      toValue: completed ? 0.6 : 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, [completed]);

  const handlePress = () => {
    // Gentle breathing-like animation
    Animated.sequence([
      Animated.timing(breatheAnim, {
        toValue: 1.02,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(breatheAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();

    onToggle?.();
  };

  return (
    <Pressable onPress={handlePress}>
      <Animated.View
        style={[
          styles.taskItem,
          {
            transform: [{ scale: breatheAnim }],
            opacity: fadeAnim,
          },
        ]}
      >
        <Animated.View
          style={[styles.checkbox, completed && styles.checkboxCompleted]}
        >
          {completed && (
            <Animated.View
              style={{
                transform: [{ scale: breatheAnim }],
              }}
            >
              <Feather name="check" size={14} color="#fff" />
            </Animated.View>
          )}
        </Animated.View>
        <View style={{ flex: 1 }}>
          <Text
            style={[styles.taskText, completed && styles.taskTextCompleted]}
          >
            {text}
          </Text>
        </View>
      </Animated.View>
    </Pressable>
  );
};

// Animated Day Button Component
interface DayButtonProps {
  day: Date;
  dayName: string;
  isSelected: boolean;
  isToday: boolean;
  onPress: () => void;
}

const DayButton: React.FC<DayButtonProps> = ({
  day,
  dayName,
  isSelected,
  isToday,
  onPress,
}) => {
  const rippleAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Gentle glow animation for selected state
    Animated.timing(glowAnim, {
      toValue: isSelected ? 1 : 0,
      duration: 500,
      useNativeDriver: true,
    }).start();

    // Spring effect for newly selected date
    if (isSelected) {
      rippleAnim.setValue(0.9);
      Animated.spring(rippleAnim, {
        toValue: 1,
        useNativeDriver: true,
        friction: 6,
        tension: 160,
      }).start();
    }
  }, [isSelected]);

  const handlePress = () => {
    // Mindful spring ripple on press
    rippleAnim.setValue(0.9);
    Animated.spring(rippleAnim, {
      toValue: 1,
      useNativeDriver: true,
      friction: 5,
      tension: 170,
    }).start();

    onPress();
  };

  return (
    <Pressable onPress={handlePress}>
      <Animated.View
        style={[
          styles.dayBox,
          isSelected && styles.dayBoxActive,
          {
            transform: [{ scale: rippleAnim }],
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
  const [selectedDate, setSelectedDate] = useState(new Date());
  // State for current week view (independent of selected date)
  const [currentWeekView, setCurrentWeekView] = useState(new Date());
  // State for calendar modal
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  // Animation values
  const weekSlideAnim = useRef(new Animated.Value(0)).current;
  const modalScaleAnim = useRef(new Animated.Value(0)).current;
  const modalOpacityAnim = useRef(new Animated.Value(0)).current;

  // Content swipe animation
  const contentSlideAnim = useRef(new Animated.Value(0)).current;
  // Opacity animation for mindful cross-fade
  const contentOpacityAnim = useRef(new Animated.Value(1)).current;
  // Day label animation values
  const dayLabelOpacityAnim = useRef(new Animated.Value(1)).current;
  const dayLabelTranslateAnim = useRef(new Animated.Value(0)).current;

  // Gesture-driven pan responder for week navigation
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) =>
        Math.abs(gestureState.dx) > 10,
      onPanResponderMove: (_, gestureState) => {
        weekSlideAnim.setValue(gestureState.dx / 50); // create subtle move effect
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx < -50) {
          // Swipe left → next week
          goToNextWeek();
        } else if (gestureState.dx > 50) {
          // Swipe right → previous week
          goToPreviousWeek();
        } else {
          // Return to center if not enough swipe distance
          Animated.spring(weekSlideAnim, {
            toValue: 0,
            useNativeDriver: true,
            friction: 6,
          }).start();
        }
      },
    })
  ).current;

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

  // Calculate week based on current week view (not selected date)
  const weekStart = startOfWeek(currentWeekView, { weekStartsOn: 0 }); // Sunday
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const dayNames = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

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

  // Week navigation functions with gentle transitions
  const goToPreviousWeek = () => {
    Animated.timing(weekSlideAnim, {
      toValue: -1,
      duration: 400,
      useNativeDriver: true,
    }).start(() => {
      setCurrentWeekView((prev) => addDays(prev, -7));
      Animated.timing(weekSlideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    });
  };

  const goToNextWeek = () => {
    Animated.timing(weekSlideAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start(() => {
      setCurrentWeekView((prev) => addDays(prev, 7));
      Animated.timing(weekSlideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    });
  };

  const selectDate = (date: Date) => {
    setSelectedDate(date);
    // Also update the week view to center on the selected date
    setCurrentWeekView(date);
  };

  // Animated date selection function
  const selectDateWithAnimation = (date: Date) => {
    selectDate(date);
  };

  // Calendar modal functions with gentle animations
  const openCalendar = () => {
    setShowCalendarModal(true);
    Animated.parallel([
      Animated.spring(modalScaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 50,
        friction: 10,
      }),
      Animated.timing(modalOpacityAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const closeCalendar = () => {
    Animated.parallel([
      Animated.timing(modalScaleAnim, {
        toValue: 0.95,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(modalOpacityAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowCalendarModal(false);
    });
  };

  const selectDateFromCalendar = (date: Date) => {
    setSelectedDate(date);
    // Also update the week view to center on the selected date
    setCurrentWeekView(date);
    setShowCalendarModal(false);
  };

  // Mock tasks data with state
  const [tasks, setTasks] = useState([
    { id: 1, text: "Sign up for Clover", completed: true },
    {
      id: 2,
      text: "Read through the Getting Started pages in the sidebar",
      completed: false,
    },
  ]);

  const toggleTask = (taskId: number) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Calendar Header */}
        <View style={styles.calendarHeader}>
          <Pressable style={styles.calendarIcon} onPress={openCalendar}>
            <Feather name="calendar" size={20} color="#000" />
          </Pressable>

          <View style={styles.navigationContainer}>
            <Pressable style={styles.navButton} onPress={goToPreviousWeek}>
              <Feather name="chevron-left" size={24} color="#000" />
            </Pressable>

            <Animated.View
              style={{
                opacity: dayLabelOpacityAnim,
                transform: [{ translateY: dayLabelTranslateAnim }],
              }}
            >
              <Text style={styles.todayText}>
                {isToday(selectedDate) ? "Today" : format(selectedDate, "EEEE")}
              </Text>
            </Animated.View>

            <Pressable style={styles.navButton} onPress={goToNextWeek}>
              <Feather name="chevron-right" size={24} color="#000" />
            </Pressable>
          </View>

          <Pressable style={styles.moreButton}>
            <Feather name="more-horizontal" size={24} color="#000" />
          </Pressable>
        </View>

        {/* Week View */}
        <View style={styles.weekContainer} {...panResponder.panHandlers}>
          <Animated.View
            style={[
              styles.weekRow,
              {
                transform: [
                  {
                    translateX: weekSlideAnim.interpolate({
                      inputRange: [-1, 0, 1],
                      outputRange: [-10, 0, 10],
                    }),
                  },
                ],
                opacity: weekSlideAnim.interpolate({
                  inputRange: [-1, 0, 1],
                  outputRange: [0.3, 1, 0.3],
                }),
              },
            ]}
          >
            {weekDays.map((day, index) => {
              const isTodayDate = isToday(day);
              const isSelectedDay =
                format(day, "yyyy-MM-dd") ===
                format(selectedDate, "yyyy-MM-dd");
              return (
                <DayButton
                  key={`day-${index}`}
                  day={day}
                  dayName={dayNames[index]}
                  isSelected={isSelectedDay}
                  isToday={isTodayDate}
                  onPress={() => selectDate(day)}
                />
              );
            })}
          </Animated.View>
        </View>

        {/* Edge-to-edge divider */}
        <View style={styles.weekDivider} />

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
          <View style={styles.dateHeader}>
            <Text style={styles.dayLabel}>
              {format(selectedDate, "EEEE").toUpperCase()} •{" "}
              {isToday(selectedDate)
                ? "TODAY"
                : format(selectedDate, "EEEE").toUpperCase()}
            </Text>
            <Text style={styles.dateText}>
              {format(selectedDate, "MMM d, yyyy")}
            </Text>
          </View>

          <Text style={styles.title}>These are your Daily Notes.</Text>

          <Text style={styles.description}>
            Think of them as a calendar you can write on. Everyday you get a
            fresh doc. Use it to plan tasks or jot down notes throughout your
            day. Any tasks you don't complete will automatically roll over to
            the next day. Try it out for a few days! It's a great habit to keep
            you focused and prioritized.
          </Text>

          <Text style={styles.tasksIntro}>
            We've gone ahead and created a few tasks to help you get started.
          </Text>

          {/* Tasks */}
          <View style={styles.tasksContainer}>
            {tasks.map((task) => (
              <TaskItem
                key={task.id}
                text={task.text}
                completed={task.completed}
                onToggle={() => toggleTask(task.id)}
              />
            ))}
          </View>
        </Animated.View>
      </ScrollView>

      {/* Calendar Modal */}
      <Modal
        visible={showCalendarModal}
        transparent={true}
        animationType="fade"
        onRequestClose={closeCalendar}
      >
        <Animated.View
          style={[styles.modalOverlay, { opacity: modalOpacityAnim }]}
        >
          <Pressable style={styles.modalBackdrop} onPress={closeCalendar} />
          <Animated.View
            style={[
              styles.calendarModal,
              {
                transform: [{ scale: modalScaleAnim }],
                opacity: modalOpacityAnim,
              },
            ]}
          >
            <View style={styles.calendarHeader}>
              <Text style={styles.calendarTitle}>Select Date</Text>
              <Pressable style={styles.closeButton} onPress={closeCalendar}>
                <Feather name="x" size={24} color="#000" />
              </Pressable>
            </View>

            <CalendarPicker
              selectedDate={selectedDate}
              onDateSelect={selectDateFromCalendar}
            />
          </Animated.View>
        </Animated.View>
      </Modal>
    </ThemedView>
  );
};

// Calendar Picker Component
interface CalendarPickerProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
}

const CalendarPicker: React.FC<CalendarPickerProps> = ({
  selectedDate,
  onDateSelect,
}) => {
  const [currentMonth, setCurrentMonth] = useState(selectedDate);

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
    <View style={styles.calendarPicker}>
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
    backgroundColor: "#f5f5f5",
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 12,
    paddingTop: 56,
    paddingBottom: 32,
  },
  calendarHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
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
    color: "#000",
    marginHorizontal: 16,
    textAlign: "center",
  },
  moreButton: {
    padding: 8,
  },
  weekContainer: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginBottom: 0,
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
    flex: 1,
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
    color: "#666",
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
    backgroundColor: "#007AFF",
  },
  dayNumberText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#000",
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
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#000",
    marginBottom: 16,
    lineHeight: 32,
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
  calendarIcon: {
    padding: 4,
    marginLeft: 0,
    marginRight: 8,
  },
  // Calendar Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBackdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  calendarModal: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    margin: 20,
    width: Dimensions.get("window").width - 40,
    maxHeight: "80%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  calendarTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
  },
  closeButton: {
    padding: 4,
  },
  // Calendar Picker Styles
  calendarPicker: {
    marginTop: 16,
  },
  monthHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
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
    marginBottom: 8,
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

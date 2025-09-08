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
import { Text, View as ThemedView } from "@/components/Themed";
import { Feather } from "@expo/vector-icons";
import { format, startOfWeek, addDays, isToday } from "date-fns";
import { Box } from "@/components/ui/box";
import {
  currentWeekViewAtom,
  selectedDateAtom,
  showCalendarModalAtom,
} from "./atoms";
import { useAtom } from "jotai";
import { CalendarPicker, DayButton } from ".";

const { height } = Dimensions.get("window"); // get screen height
const twentyPercentHeight = height * 0.2;

const DailyNotesHeader = () => {
  const [showCalendarModal, setShowCalendarModal] = useAtom(
    showCalendarModalAtom
  );
  const modalScaleAnim = useRef(new Animated.Value(0)).current;
  const modalOpacityAnim = useRef(new Animated.Value(0)).current;
  const [selectedDate, setSelectedDate] = useAtom(selectedDateAtom);
  const [currentWeekView, setCurrentWeekView] = useAtom(currentWeekViewAtom);
  const weekSlideAnim = useRef(new Animated.Value(0)).current;
  const dayLabelOpacityAnim = useRef(new Animated.Value(1)).current;
  const dayLabelTranslateAnim = useRef(new Animated.Value(0)).current;

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
  const selectDateFromCalendar = (date: Date) => {
    setSelectedDate(date);
    // Also update the week view to center on the selected date
    setCurrentWeekView(date);
    setShowCalendarModal(false);
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

  const weekStart = startOfWeek(currentWeekView, { weekStartsOn: 0 }); // Sunday
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const dayNames = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
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

  // Gesture-driven pan responder for week navigation
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
  return (
    <Box
      style={{
        backgroundColor: "#9F8CFF",
        height: twentyPercentHeight,
        justifyContent: "flex-end",
      }}
    >
      {/* Calendar Header */}
      <View style={styles.calendarHeader}>
        <Pressable style={styles.calendarIcon} onPress={openCalendar}>
          <Feather name="calendar" size={24} color="white" />
        </Pressable>

        <View style={styles.navigationContainer}>
          <Pressable style={styles.navButton} onPress={goToPreviousWeek}>
            <Feather name="chevron-left" size={24} color="#fff" />
          </Pressable>

          <Text style={styles.todayText}>AI Journal</Text>

          <Pressable style={styles.navButton} onPress={goToNextWeek}>
            <Feather name="chevron-right" size={24} color="#fff" />
          </Pressable>
        </View>

        <Pressable style={styles.moreButton}>
          <Feather name="more-horizontal" size={24} color="#fff" />
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
              format(day, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd");
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
    </Box>
  );
};

const styles = StyleSheet.create({
  modalBackdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
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
  weekContainer: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginBottom: 0,
    width: "100%",
  },
  weekRow: {
    flexDirection: "row",
    width: "100%",
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
  navigationContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  calendarHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 0,
    paddingHorizontal: 12,
  },
  moreButton: {
    padding: 8,
  },
  calendarIcon: {
    padding: 4,
    marginLeft: 0,
    marginRight: 8,
  },
});

export default DailyNotesHeader;

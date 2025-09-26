import React, { useRef } from "react";
import {
  StyleSheet,
  View,
  Pressable,
  Dimensions,
  Animated,
} from "react-native";
import { Text } from "@/components/Themed";
import { Feather } from "@expo/vector-icons";
import { format, startOfWeek, addDays, isToday } from "date-fns";
import { currentWeekViewAtom, selectedDateAtom } from "./atoms";
import { useAtom } from "jotai";
import { DayButton } from ".";
import { useCalendarExpandDrag } from "@/hooks/useCalendarExpandDrag";
import { useWeekNavigation } from "@/hooks/useWeekNavigation";
import { TodayPill } from "@/components/dailyJournal/TodayPill";
import { MoodBadge } from "@/components/dailyJournal/MoodBadge";
import { CalendarPicker } from "./CalendarPicker";

const { height } = Dimensions.get("window"); // get screen height
const twentyPercentHeight = height * 0.24;

const DailyNotesHeader = () => {
  const [selectedDate, setSelectedDate] = useAtom(selectedDateAtom);
  const [currentWeekView, setCurrentWeekView] = useAtom(currentWeekViewAtom);
  const { weekSlideAnim, panHandlers, animateToWeekOf } = useWeekNavigation({
    setCurrentWeek: setCurrentWeekView,
    durationEnterMs: 400,
    durationReturnMs: 300,
    swipeTriggerDx: 50,
    slideDivisor: 50,
  });

  // Vertical expand/collapse for inline calendar
  const CALENDAR_EXPANDED_HEIGHT = 360;
  const {
    progress,
    isExpanded,
    panHandlers: verticalPanHandlers,
    collapse,
    toggle,
  } = useCalendarExpandDrag({
    expandedHeight: CALENDAR_EXPANDED_HEIGHT,
    snapThreshold: 0.35,
    animationDurationMs: 500,
  });
  const headerHeightAnim = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [twentyPercentHeight, CALENDAR_EXPANDED_HEIGHT + 50],
  });
  const headerControlsOpacity = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  });
  const weekHeaderOpacity = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  });
  // Anchor for handle initial Y (below week row); animate absolute handle position from there
  const dragAnchorTopAnim = useRef(new Animated.Value(0)).current;

  const selectDate = (date: Date) => {
    setSelectedDate(date);
    // Also update the week view to center on the selected date
    setCurrentWeekView(date);
  };

  const weekStart = startOfWeek(currentWeekView, { weekStartsOn: 0 }); // Sunday
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const dayNames = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  // Week navigation handled by useWeekNavigation hook

  const handleGoToToday = async (): Promise<void> => {
    const today = new Date();
    await animateToWeekOf(today, currentWeekView);
    selectDate(today);
  };

  // Pan gesture handlers are provided by useWeekNavigation
  return (
    <Animated.View
      style={[
        styles.headerContainer,
        {
          height: headerHeightAnim,
        },
      ]}
    >
      {/* Calendar Header */}
      <Animated.View
        style={[styles.calendarHeader, { opacity: headerControlsOpacity }]}
      >
        <Pressable style={styles.calendarIcon} onPress={() => toggle()}>
          <Feather name="calendar" size={24} color="white" />
        </Pressable>

        <View style={styles.navigationContainer}>
          <Text style={styles.todayText}>
            {format(selectedDate, "MMM dd, yyyy")}
          </Text>
        </View>

        <Pressable style={styles.moreButton}>
          <Feather name="more-horizontal" size={24} color="#fff" />
        </Pressable>
      </Animated.View>

      {/* Week View */}
      <View style={styles.weekContainer} {...panHandlers}>
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
                {
                  translateY: progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -8],
                  }),
                },
                {
                  scale: progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 0.98],
                  }),
                },
              ],
              opacity: Animated.multiply(
                weekSlideAnim.interpolate({
                  inputRange: [-1, 0, 1],
                  outputRange: [0.3, 1, 0.3],
                }),
                weekHeaderOpacity
              ),
            },
          ]}
        >
          {weekDays.map((day, index) => {
            const isTodayDate = isToday(day);
            const isSelectedDay =
              format(day, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd");
            return (
              <View className="flex-1 gap-8 mb-4" key={index}>
                <DayButton
                  day={day}
                  dayName={dayNames[index]}
                  isSelected={isSelectedDay}
                  isToday={isTodayDate}
                  onPress={() => selectDate(day)}
                />
                <View style={styles.moodItem}>
                  <MoodBadge
                    emoji={isSelectedDay ? "😄" : ""}
                    active={isSelectedDay}
                    size={28}
                  />
                </View>
              </View>
            );
          })}
        </Animated.View>
      </View>
      {/* Invisible anchor to capture the initial handle position just below the week */}
      <View
        pointerEvents="none"
        style={styles.dragAnchorPlaceholder}
        onLayout={(e) => {
          const { y, height } = e.nativeEvent.layout;
          // place handle a little below the placeholder for spacing
          dragAnchorTopAnim.setValue(y + height / 2 - 2);
        }}
      />
      <Animated.View
        style={[
          styles.inlineCalendarContainer,
          {
            height: progress.interpolate({
              inputRange: [0, 1],
              outputRange: [0, CALENDAR_EXPANDED_HEIGHT],
            }),
            opacity: progress.interpolate({
              inputRange: [0, 0.05, 0.15, 1],
              outputRange: [0, 0, 1, 1],
            }),
          },
        ]}
      >
        <CalendarPicker
          selectedDate={selectedDate}
          visible={isExpanded}
          onDateSelect={(date: Date) => {
            // First collapse smoothly, then update date so header morph feels natural
            collapse(() => {
              selectDate(date);
            });
          }}
        />
      </Animated.View>
      {/* Today tag - animated reusable component */}
      <TodayPill visible={!isToday(selectedDate)} onPress={handleGoToToday} />
      {/* Absolute overlay handle that moves down with expanding calendar */}
      <Animated.View style={[styles.handleOverlay]} pointerEvents="box-none">
        <Animated.View {...verticalPanHandlers} style={[styles.dragHandle]} />
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: "#9F8CFF",
    justifyContent: "flex-end",
    position: "relative",
  },
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
    position: "relative",
  },
  weekRow: {
    flexDirection: "row",
    width: "100%",
  },
  moodRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 8,
  },
  moodItem: {
    flex: 1,
    alignItems: "center",
  },
  dragAnchorPlaceholder: {
    height: 8,
  },
  dragHandle: {
    width: 48,
    height: 5,
    borderRadius: 3,
    backgroundColor: "rgba(255,255,255,0.9)",
  },
  handleOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 10,
  },
  inlineCalendarContainer: {
    position: "absolute",
    top: 45,
    left: 0,
    right: 0,
    zIndex: 20,
    overflow: "hidden",
    paddingHorizontal: 12,
    paddingBottom: 8,
    backgroundColor: "#9F8CFF",
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
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

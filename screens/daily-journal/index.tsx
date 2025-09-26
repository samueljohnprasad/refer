import React, { useCallback, useEffect, useMemo, memo } from "react";
import { StyleSheet, View, ScrollView, Pressable } from "react-native";
import { Text } from "@/components/Themed";
import { Stack } from "expo-router";
import { format, addDays } from "date-fns";
import { MentalHealthProfileContainer } from "@/components/mentalHealth/MentalHealthProfileContainer";
import { useAtom } from "jotai";
import { currentWeekViewAtom, selectedDateAtom } from "./atoms";
import DailyNotesHeader from "./DailyNotesHeader";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, {
  Easing,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";

// Animated Day Button Component
interface DayButtonProps {
  day: Date;
  dayName: string;
  isSelected: boolean;
  isToday: boolean;
  onPress: () => void;
}

const DayButtonComponent: React.FC<DayButtonProps> = ({
  day,
  dayName,
  isSelected,
  isToday,
  onPress,
}) => {
  const glow = useSharedValue<number>(0);

  useEffect(() => {
    // Gentle glow animation for selected state (on UI thread)
    glow.value = withTiming(isSelected ? 1 : 0, {
      duration: 500,
      easing: Easing.out(Easing.quad),
    });
  }, [isSelected]);

  const outerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(glow.value, [0, 1], [0.8, 1]),
  }));

  const innerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(glow.value, [0, 1], [0.7, 1]),
  }));

  const handlePress = (): void => {
    onPress();
  };

  return (
    <Pressable onPress={handlePress}>
      <Animated.View
        style={[
          styles.dayBox,
          isSelected && styles.dayBoxActive,
          isToday && !isSelected && styles.dayBoxToday,
          outerAnimatedStyle,
        ]}
      >
        <Animated.View
          style={[innerAnimatedStyle]}
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
      </Animated.View>
    </Pressable>
  );
};

// Memoize to prevent re-rendering of unchanged days during header/calendar animations
const areDayButtonPropsEqual = (
  prev: Readonly<DayButtonProps>,
  next: Readonly<DayButtonProps>
): boolean => {
  return (
    prev.isSelected === next.isSelected &&
    prev.isToday === next.isToday &&
    prev.day.getTime() === next.day.getTime() &&
    prev.dayName === next.dayName
    // Intentionally ignoring onPress reference to avoid re-renders due to new function identity
  );
};

export const DayButton = memo(DayButtonComponent, areDayButtonPropsEqual);

const DailyNotesScreen: React.FC = () => {
  // State for selected date
  const [selectedDate, setSelectedDate] = useAtom(selectedDateAtom);
  const tabBarHeight = useBottomTabBarHeight();

  // State for current week view (independent of selected date)
  const [, setCurrentWeekView] = useAtom(currentWeekViewAtom);
  // Shared values for content animations (UI thread)
  const contentTranslateX = useSharedValue<number>(0);
  const contentOpacity = useSharedValue<number>(1);

  // Animated styles
  const contentAnimatedStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
    transform: [{ translateX: contentTranslateX.value }],
  }));

  // Helper to move date by offset without stale closure issues
  const updateDateFromTs = useCallback(
    (ts: number): void => {
      const newDate = new Date(ts);
      setSelectedDate(newDate);
      setCurrentWeekView(newDate);
    },
    [setSelectedDate, setCurrentWeekView]
  );

  const changeDateBy = (offset: number): void => {
    // Pre-compute the target date timestamp on JS thread and pass to worklet as a primitive
    const targetTs: number = addDays(selectedDate, offset).getTime();
    // Gently fade out, change date on JS thread, then fade back in (all driven by UI thread)
    contentOpacity.value = withTiming(
      0.15,
      { duration: 180, easing: Easing.out(Easing.quad) },
      (finished?: boolean) => {
        if (finished) {
          runOnJS(updateDateFromTs)(targetTs);
          // Reset translation on UI thread
          contentTranslateX.value = 0;
          // Fade back in
          contentOpacity.value = withTiming(1, {
            duration: 300,
            easing: Easing.out(Easing.quad),
          });
        }
      }
    );
  };

  const goToPreviousDateContent = (): void => changeDateBy(-1);
  const goToNextDateContent = (): void => changeDateBy(1);

  // Pan gesture for content area (RN Gesture Handler + Reanimated)
  const contentPanGesture = useMemo(
    () =>
      Gesture.Pan()
        .minDistance(10)
        .activeOffsetY([-12, 12])
        .onUpdate((g) => {
          let tx = g.translationX;
          if (tx < -120) tx = -120;
          else if (tx > 120) tx = 120;
          contentTranslateX.value = tx;
        })
        .onEnd((g) => {
          const absDx = Math.abs(g.translationX);
          const direction = g.translationX > 0 ? "right" : "left";

          if (absDx > 60) {
            if (direction === "left") {
              runOnJS(goToNextDateContent)();
            } else {
              runOnJS(goToPreviousDateContent)();
            }
          }

          contentTranslateX.value = withSpring(0, {
            damping: 16,
            stiffness: 180,
          });
        })
        .onFinalize(() => {
          contentTranslateX.value = withSpring(0, {
            damping: 16,
            stiffness: 180,
          });
        }),
    [goToNextDateContent, goToPreviousDateContent]
  );

  // Removed unused day label animation for performance

  return (
    <SafeAreaView edges={[]} style={styles.container}>
      {/* <DailyNotesHeader /> */}
      <Stack.Screen
        options={{ header: () => <DailyNotesHeader />, headerShown: true }}
      />
      <View style={{ flex: 1 }}>
        <GestureDetector gesture={contentPanGesture}>
          <ScrollView
            style={{ flex: 1 }}
            // contentContainerStyle={[styles.content, { paddingTop: 0 }]}
            showsVerticalScrollIndicator={false}
          >
            {/* Date and Content */}

            <Animated.View
              style={[
                styles.mainContent,
                contentAnimatedStyle,
                { paddingBottom: tabBarHeight },
              ]}
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
        </GestureDetector>
      </View>

      {/* Calendar Modal */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollView: {},
  content: {
    flex: 1,
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
    borderRadius: 12,
  },
  dayBoxActive: {
    backgroundColor: "#7B61FF",
    borderRadius: 12,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  dayBoxToday: {
    backgroundColor: "rgba(255,255,255,0.12)",
    borderRadius: 12,
  },
  dayName: {
    fontSize: 12,
    fontWeight: "500",
    color: "#EDE9FF",
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
    backgroundColor: "#f5f5f5",
    // paddingTop: 56,
    flex: 1,
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
    paddingTop: 20,
    paddingBottom: 0,
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
});

export default DailyNotesScreen;

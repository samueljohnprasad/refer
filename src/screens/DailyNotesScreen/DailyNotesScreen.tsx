import React, {
  useCallback,
  useEffect,
  useMemo,
  memo,
  useRef,
  useState,
} from "react";
import { View, ScrollView, Pressable } from "react-native";
import { Text } from "@/components/Themed";
import { Stack } from "expo-router";
import {
  format,
  addDays,
  startOfWeek,
  endOfWeek,
  isBefore,
  startOfDay,
  startOfMonth,
  endOfMonth,
  getWeek,
} from "date-fns";
import { useAtom, useSetAtom } from "jotai";
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
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import {
  currentWeekViewAtom,
  selectedDateAtom,
  calenderVisibleDatesAtom,
} from "./atoms";
import DailyNotesHeader from "./DailyNotesHeader";
import { MentalHealthProfileContainer } from "./notes/MentalHealthProfileContainer";
import { AIInsightsChip } from "@/src/components/ai/AIInsightsChip";
import { AIInsightsModalBottomSheet } from "@/src/components/ai/AIInsightsModalBottomSheet";
import { useWeeklyAISummary } from "@/hooks/data/useWeeklyAISummaries";
import { formateDate_y_m_d } from "@/hooks/data/date";

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
      duration: 400,
      easing: Easing.out(Easing.quad),
    });
  }, [isSelected]);

  const outerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(glow.value, [0, 1], [0.85, 1]),
  }));

  const innerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(glow.value, [0, 1], [0.8, 1]),
  }));

  const handlePress = (): void => {
    onPress();
  };

  return (
    <Pressable onPress={handlePress}>
      <Animated.View
        className={`items-center py-1.5 px-1 rounded-xl ${
          isSelected ? "bg-[#7B61FF]" : isToday && !isSelected ? "bg-white/10" : ""
        }`}
        style={[outerAnimatedStyle]}
      >
        <Animated.View
          style={[innerAnimatedStyle]}
          className="flex flex-col items-center"
        >
          <Text
            className={`text-xs font-medium tracking-wider mb-0.5 ${
              isSelected ? "text-white" : "text-[#EDE9FF]"
            }`}
          >
            {dayName}
          </Text>
          <Text
            className={`text-base font-semibold ${
              isSelected ? "text-white" : "text-white"
            }`}
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
  const [currentWeekView, setCurrentWeekView] = useAtom(currentWeekViewAtom);

  // Set calendar visible dates based on current week in view
  const setCalenderVisibleDates = useSetAtom(calenderVisibleDatesAtom);

  // Update calendar visible dates when week changes
  useEffect(() => {
    const monthStart = startOfMonth(currentWeekView);
    const monthEnd = endOfMonth(currentWeekView);
    const visibleStartDate = startOfWeek(monthStart, { weekStartsOn: 0 });
    const visibleEndDate = endOfWeek(monthEnd, { weekStartsOn: 0 });

    setCalenderVisibleDates({
      visibleStartDate: formateDate_y_m_d(visibleStartDate),
      visibleEndDate: formateDate_y_m_d(visibleEndDate),
    });
  }, [getWeek(currentWeekView)]);

  // Bottom sheet ref for AI insights
  const bottomSheetRef = useRef<BottomSheetModal>(null);

  // Check if current week is before today (past week)
  const isBeforeCurrentWeek = useMemo(() => {
    const today = startOfDay(new Date());
    const weekEndDate = endOfWeek(currentWeekView, { weekStartsOn: 0 });
    return isBefore(weekEndDate, today);
  }, [currentWeekView]);

  // Format week dates for display
  const weekStart = useMemo(
    () => startOfWeek(currentWeekView, { weekStartsOn: 0 }),
    [currentWeekView]
  );
  const weekEnd = useMemo(
    () => endOfWeek(currentWeekView, { weekStartsOn: 0 }),
    [currentWeekView]
  );
  const weekStartFormatted = format(weekStart, "MMM dd, yyyy");
  const weekEndFormatted = format(weekEnd, "MMM dd, yyyy");

  // Shared values for content animations (UI thread)
  const contentTranslateX = useSharedValue<number>(0);
  const contentOpacity = useSharedValue<number>(1);
  const contentScale = useSharedValue<number>(1);

  // Animated styles with smooth scale feedback
  const contentAnimatedStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
    transform: [
      { translateX: contentTranslateX.value },
      { scale: contentScale.value },
    ],
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

  // Enhanced pan gesture with better feedback
  const contentPanGesture = useMemo(
    () =>
      Gesture.Pan()
        .minDistance(10)
        .activeOffsetY([-12, 12])
        .onBegin(() => {
          contentScale.value = withSpring(0.98, {
            damping: 15,
            stiffness: 200,
          });
        })
        .onUpdate((g) => {
          'worklet';
          let tx = g.translationX;
          const maxTranslate = 100;
          if (tx < -maxTranslate) tx = -maxTranslate;
          else if (tx > maxTranslate) tx = maxTranslate;
          contentTranslateX.value = tx;
          
          // Add subtle opacity change during swipe
          const progress = Math.abs(tx) / maxTranslate;
          contentOpacity.value = interpolate(
            progress,
            [0, 0.5, 1],
            [1, 0.85, 0.7],
            "clamp"
          );
        })
        .onEnd((g) => {
          const absDx = Math.abs(g.translationX);
          const direction = g.translationX > 0 ? "right" : "left";

          if (absDx > 50) {
            if (direction === "left") {
              runOnJS(goToNextDateContent)();
            } else {
              runOnJS(goToPreviousDateContent)();
            }
          }

          contentTranslateX.value = withSpring(0, {
            damping: 20,
            stiffness: 200,
          });
          contentOpacity.value = withSpring(1, {
            damping: 15,
            stiffness: 150,
          });
          contentScale.value = withSpring(1, {
            damping: 15,
            stiffness: 200,
          });
        })
        .onFinalize(() => {
          contentTranslateX.value = withSpring(0, {
            damping: 20,
            stiffness: 200,
          });
          contentOpacity.value = withSpring(1);
          contentScale.value = withSpring(1);
        }),
    [goToNextDateContent, goToPreviousDateContent]
  );

  // Removed unused day label animation for performance

  return (
    <SafeAreaView edges={[]} className="flex-1 bg-gray-50">
      <Stack.Screen
        options={{ header: () => <DailyNotesHeader />, headerShown: true }}
      />
      <View className="flex-1">
        {/* AI Insights Chip - Below header */}
        <View className="pt-2 px-4 pb-1">
          <AIInsightsChip
            visible={isBeforeCurrentWeek}
            onPress={() => {
              bottomSheetRef.current?.present();
            }}
          />
        </View>

        <GestureDetector gesture={contentPanGesture}>
          <ScrollView
            className="flex-1"
            contentContainerStyle={{ flexGrow: 1 }}
            showsVerticalScrollIndicator={false}
            accessible={true}
            accessibilityLabel="Daily notes content"
          >
            <Animated.View
              className="flex-1 px-4 bg-gray-50"
              style={[
                contentAnimatedStyle,
                { paddingBottom: tabBarHeight + 20 },
              ]}
            >
              {/* Mental Health Journal Dashboard */}
              <View className="pt-4 pb-2">
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

      {/* AI Insights Bottom Sheet */}
      <AIInsightsModalBottomSheet
        ref={bottomSheetRef}
        weekStart={weekStartFormatted}
        weekEnd={weekEndFormatted}
        onClose={() => {
          bottomSheetRef.current?.dismiss();
        }}
      />

      {/* Calendar Modal */}
    </SafeAreaView>
  );
};

// All styles have been converted to Tailwind CSS

export default DailyNotesScreen;

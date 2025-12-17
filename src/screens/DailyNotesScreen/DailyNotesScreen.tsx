import React, {
  useCallback,
  useEffect,
  useMemo,
  memo,
  useRef,
  useState,
} from "react";
import { View, ScrollView, Pressable, Text } from "react-native";
import { Feather } from "@expo/vector-icons";
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
import { AIInsightsChip } from "@/src/components/ai/AIInsightsChip";
import { formateDate_y_m_d } from "@/src/utils/date";
import SuspensLoader from "@/src/components/SuspensLoader";
import CalorieWidget from "@/src/components/CalorieWidget";

// Lazy load heavy components
const MentalHealthProfileContainer = React.lazy(() =>
  import("./notes/MentalHealthProfileContainer").then((module) => ({
    default: module.MentalHealthProfileContainer,
  }))
);

const AIInsightsModalBottomSheet = React.lazy(() =>
  import("@/src/components/ai/AIInsightsModalBottomSheet").then((module) => ({
    default: module.AIInsightsModalBottomSheet,
  }))
);

const DailyNotesScreenComponent = () => {
  // State for selected date
  const [selectedDate, setSelectedDate] = useAtom(selectedDateAtom);
  const [showBookmarksModal, setShowBookmarksModal] = useState<boolean>(false);

  // State for current week view (independent of selected date)
  const [currentWeekView, setCurrentWeekView] = useAtom(currentWeekViewAtom);

  // Set calendar visible dates based on current week in view
  const setCalenderVisibleDates = useSetAtom(calenderVisibleDatesAtom);

  // Memoize the week number to avoid unnecessary effect triggers
  const currentWeekNumber = useMemo(
    () => getWeek(currentWeekView),
    [currentWeekView]
  );

  // Update calendar visible dates when week changes - optimized with memoized week number
  useEffect(() => {
    const monthStart = startOfMonth(currentWeekView);
    const monthEnd = endOfMonth(currentWeekView);
    const visibleStartDate = startOfWeek(monthStart, { weekStartsOn: 0 });
    const visibleEndDate = endOfWeek(monthEnd, { weekStartsOn: 0 });

    setCalenderVisibleDates({
      visibleStartDate: formateDate_y_m_d(visibleStartDate),
      visibleEndDate: formateDate_y_m_d(visibleEndDate),
    });
  }, [currentWeekNumber, setCalenderVisibleDates]);

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
  const weekStartFormatted = useMemo(
    () => format(weekStart, "MMM dd, yyyy"),
    [weekStart]
  );
  const weekEndFormatted = useMemo(
    () => format(weekEnd, "MMM dd, yyyy"),
    [weekEnd]
  );

  // Shared values for content animations (UI thread)
  const contentTranslateX = useSharedValue<number>(0);
  const contentOpacity = useSharedValue<number>(1);
  const contentScale = useSharedValue<number>(1);
  // Simplified arrow indicators - only opacity, no scale
  const leftArrowOpacity = useSharedValue<number>(0);
  const rightArrowOpacity = useSharedValue<number>(0);

  // Animated styles with smooth scale feedback
  const contentAnimatedStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
    transform: [
      { translateX: contentTranslateX.value },
      { scale: contentScale.value },
    ],
  }));

  // Simplified navigation arrow animated styles - only opacity
  const leftArrowAnimatedStyle = useAnimatedStyle(() => ({
    opacity: leftArrowOpacity.value,
  }));

  const rightArrowAnimatedStyle = useAnimatedStyle(() => ({
    opacity: rightArrowOpacity.value,
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

  const changeDateBy = useCallback(
    (offset: number): void => {
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
    },
    [selectedDate, updateDateFromTs, contentOpacity, contentTranslateX]
  );

  const goToPreviousDateContent = useCallback(
    (): void => changeDateBy(-1),
    [changeDateBy]
  );
  const goToNextDateContent = useCallback(
    (): void => changeDateBy(1),
    [changeDateBy]
  );

  // Enhanced pan gesture with reduced sensitivity - memoized with stable dependencies
  const contentPanGesture = useMemo(
    () =>
      Gesture.Pan()
        .minDistance(15)
        .activeOffsetY([-15, 15])
        .onBegin(() => {
          "worklet";
          // Reduced scale effect for less bounce
          contentScale.value = withSpring(0.995, {
            damping: 25,
            stiffness: 180,
          });
        })
        .onUpdate((g) => {
          "worklet";
          const rawTx = g.translationX;
          const resistanceThreshold = 60; // Start resistance after this distance
          const maxTranslate = 100;

          let tx = rawTx;

          // Apply rubber band resistance after threshold
          if (Math.abs(rawTx) > resistanceThreshold) {
            const excess = Math.abs(rawTx) - resistanceThreshold;
            // Logarithmic resistance: harder to pull the further you go
            const resistance = resistanceThreshold + excess * 0.3;
            tx = rawTx > 0 ? resistance : -resistance;
          }

          // Hard limit
          if (tx < -maxTranslate) tx = -maxTranslate;
          else if (tx > maxTranslate) tx = maxTranslate;

          contentTranslateX.value = tx;

          // Show arrow indicators based on swipe direction - simplified
          const progress = Math.abs(tx) / maxTranslate;

          if (tx > 20) {
            // Swiping right - show left arrow (go to previous)
            leftArrowOpacity.value = interpolate(
              progress,
              [0.2, 0.6],
              [0, 1],
              "clamp"
            );
            rightArrowOpacity.value = 0;
          } else if (tx < -20) {
            // Swiping left - show right arrow (go to next)
            rightArrowOpacity.value = interpolate(
              progress,
              [0.2, 0.6],
              [0, 1],
              "clamp"
            );
            leftArrowOpacity.value = 0;
          } else {
            leftArrowOpacity.value = 0;
            rightArrowOpacity.value = 0;
          }

          // Less aggressive opacity change during swipe
          contentOpacity.value = interpolate(
            progress,
            [0, 0.7, 1],
            [1, 0.92, 0.85],
            "clamp"
          );
        })
        .onEnd((g) => {
          "worklet";
          const absDx = Math.abs(g.translationX);
          const direction = g.translationX > 0 ? "right" : "left";

          // Increased threshold for less sensitivity
          if (absDx > 75) {
            if (direction === "left") {
              runOnJS(goToNextDateContent)();
            } else {
              runOnJS(goToPreviousDateContent)();
            }
          }

          // Smoother, less bouncy spring animation
          contentTranslateX.value = withSpring(0, {
            damping: 30,
            stiffness: 180,
          });
          contentOpacity.value = withSpring(1, {
            damping: 25,
            stiffness: 150,
          });
          contentScale.value = withSpring(1, {
            damping: 25,
            stiffness: 180,
          });

          // Hide arrows
          leftArrowOpacity.value = withTiming(0, { duration: 200 });
          rightArrowOpacity.value = withTiming(0, { duration: 200 });
        })
        .onFinalize(() => {
          "worklet";
          contentTranslateX.value = withSpring(0, {
            damping: 30,
            stiffness: 180,
          });
          contentOpacity.value = withSpring(1);
          contentScale.value = withSpring(1);
          leftArrowOpacity.value = withTiming(0, { duration: 150 });
          rightArrowOpacity.value = withTiming(0, { duration: 150 });
        }),
    [
      contentScale,
      contentTranslateX,
      contentOpacity,
      leftArrowOpacity,
      rightArrowOpacity,
      goToNextDateContent,
      goToPreviousDateContent,
    ]
  );

  // Memoize AI Insights Chip to prevent re-renders
  const aiInsightsChip = useMemo(
    () => (
      <View className="pt-2 px-4 pb-1">
        <AIInsightsChip
          visible={isBeforeCurrentWeek}
          onPress={() => {
            bottomSheetRef.current?.present();
          }}
        />
      </View>
    ),
    [isBeforeCurrentWeek]
  );

  // Memoize Mental Health Container to prevent re-renders during animations
  const mentalHealthContent = useMemo(
    () => (
      <View className="pt-4 pb-2">
        <SuspensLoader>
          <MentalHealthProfileContainer
            selectedDate={selectedDate}
            showBookmarksModal={showBookmarksModal}
            setShowBookmarksModal={setShowBookmarksModal}
            onRefresh={() => {
              // Optional refresh logic for mental health data
            }}
          />
        </SuspensLoader>
      </View>
    ),
    [selectedDate, showBookmarksModal]
  );

  // Memoize header callback
  const handleBookmarksPress = useCallback(
    () => setShowBookmarksModal((prev) => !prev),
    []
  );

  // Memoize header component
  const headerComponent = useMemo(
    () => <DailyNotesHeader onBookmarksPress={handleBookmarksPress} />,
    [handleBookmarksPress]
  );

  return (
    <SafeAreaView edges={[]} className="flex-1 bg-gray-50">
      <Stack.Screen
        options={{
          header: () => headerComponent,
          headerShown: true,
        }}
      />
      <View className="flex-1">
        <View className="flex-1 relative">
          <GestureDetector gesture={contentPanGesture}>
            <ScrollView
              className="flex-1"
              contentContainerStyle={{ flexGrow: 1 }}
              showsVerticalScrollIndicator={false}
              accessible={true}
              accessibilityLabel="Daily notes content"
            >
              {/* AI Insights Chip - Below header */}
              {aiInsightsChip}

              {/* Calorie Tracker Widget */}
              <View className="px-4 pt-3">
                <CalorieWidget selectedDate={selectedDate} />
              </View>

              <Animated.View
                className="flex-1 px-4 bg-gray-50"
                style={[contentAnimatedStyle, { paddingBottom: 20 }]}
              >
                {/* Mental Health Journal Dashboard */}
                {mentalHealthContent}
              </Animated.View>
            </ScrollView>
          </GestureDetector>

          {/* Navigation Arrows - Simplified, Chrome-style */}
          <Animated.View
            className="absolute left-4"
            style={[leftArrowAnimatedStyle, { top: "50%", marginTop: -24 }]}
            pointerEvents="none"
          >
            <View className="bg-violet-500 rounded-full p-3 shadow-lg">
              <Feather name="chevron-left" size={24} color="white" />
            </View>
          </Animated.View>

          <Animated.View
            className="absolute right-4"
            style={[rightArrowAnimatedStyle, { top: "50%", marginTop: -24 }]}
            pointerEvents="none"
          >
            <View className="bg-violet-500 rounded-full p-3 shadow-lg">
              <Feather name="chevron-right" size={24} color="white" />
            </View>
          </Animated.View>
        </View>
      </View>

      {/* AI Insights Bottom Sheet */}
      <SuspensLoader>
        <AIInsightsModalBottomSheet
          ref={bottomSheetRef}
          weekStart={weekStartFormatted}
          weekEnd={weekEndFormatted}
          onClose={() => {
            bottomSheetRef.current?.dismiss();
          }}
        />
      </SuspensLoader>

      {/* Calendar Modal */}
    </SafeAreaView>
  );
};

// Memoize the entire screen to prevent unnecessary re-renders from parent
const DailyNotesScreen = memo(DailyNotesScreenComponent);

export default DailyNotesScreen;

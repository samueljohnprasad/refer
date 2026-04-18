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
import { Host, Picker } from "@expo/ui/swift-ui";
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
import { HabitsSection } from "@/src/components/habits/HabitsSection";
import CalorieTrackerScreen from "../CalorieTrackerScreen/CalorieTrackerScreen";

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

  // Tab filter state
  type TabFilter = "habits" | "journal" | "calories";
  const [tabFilter, setTabFilter] = useState<TabFilter>("journal");
  const [filterIndex, setFilterIndex] = useState(0);

  const filterOptions = ["Journal", "Calories", "Habits"];

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

  const changeDateBy = useCallback(
    (offset: number): void => {
      // Pre-compute the target date timestamp on JS thread and pass to worklet as a primitive
      const targetTs: number = addDays(selectedDate, offset).getTime();
      const direction = offset > 0 ? -1 : 1;
      const slideDistance = 30; // Exit distance is shorter

      contentOpacity.value = withTiming(0, { duration: 150 });
      contentTranslateX.value = withTiming(
        direction * slideDistance,
        { duration: 150 },
        (finished?: boolean) => {
          if (finished) {
            runOnJS(updateDateFromTs)(targetTs);
            // Set starting position for new content (coming from the other side)
            contentTranslateX.value = -direction * slideDistance * 1.5;
            
            // Fade back in with spring motion
            contentOpacity.value = withTiming(1, { duration: 250 });
            contentTranslateX.value = withSpring(0, {
              damping: 20,
              stiffness: 200,
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
        // failOffsetY: gesture fails immediately when vertical scroll detected.
        // This prevents onBegin/onUpdate from firing during vertical scroll,
        // which was animating contentScale/opacity → causing the flicker.
        .failOffsetY([-5, 5])
        // Only become active once the user moves clearly horizontally
        .activeOffsetX([-15, 15])
        .onUpdate((g) => {
          "worklet";
          const rawTx = g.translationX;
          const resistanceThreshold = 60;
          const maxTranslate = 100;

          let tx = rawTx;

          // Rubber band resistance after threshold
          if (Math.abs(rawTx) > resistanceThreshold) {
            const excess = Math.abs(rawTx) - resistanceThreshold;
            const c = 120;
            const resistance = resistanceThreshold + (excess * c) / (excess + c);
            tx = rawTx > 0 ? resistance : -resistance;
          }

          if (tx < -maxTranslate) tx = -maxTranslate;
          else if (tx > maxTranslate) tx = maxTranslate;

          contentTranslateX.value = tx;

          const progress = Math.abs(tx) / maxTranslate;

          contentOpacity.value = interpolate(
            progress,
            [0, 0.7, 1],
            [1, 0.92, 0.85],
            "clamp"
          );
          // Scale only applies during confirmed horizontal swipe, never during scroll
          contentScale.value = interpolate(progress, [0, 1], [1, 0.98], "clamp");
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
            stiffness: 200,
          });
          contentOpacity.value = withSpring(1, {
            damping: 30,
            stiffness: 200,
          });
          contentScale.value = withSpring(1, {
            damping: 30,
            stiffness: 200,
          });
        })
        .onFinalize(() => {
          "worklet";
          contentTranslateX.value = withSpring(0, {
            damping: 30,
            stiffness: 180,
          });
          contentOpacity.value = withSpring(1);
          contentScale.value = withSpring(1);
        }),
    [
      contentScale,
      contentTranslateX,
      contentOpacity,
      goToNextDateContent,
      goToPreviousDateContent,
    ]
  );

  // Memoize AI Insights Chip to prevent re-renders
  const aiInsightsChip = useMemo(
    () => (
      <View className="px-4 py-2">
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
    <SafeAreaView edges={[]} className="flex-1 bg-theme-background-primary">
      <Stack.Screen
        options={{
          header: () => headerComponent,
          headerShown: true,
        }}
      />
      <View className="flex-1 relative">
        <GestureDetector gesture={contentPanGesture}>
          <ScrollView
            className="flex-1"
            contentContainerStyle={{ flexGrow: 1 }}
            showsVerticalScrollIndicator={false}
          >
            {/* AI Insights Chip - Below header */}
            {aiInsightsChip}

            {/* Tab Picker */}
            <View className="px-4 py-2">
              <Host matchContents>
                <Picker
                  label="View"
                  options={filterOptions}
                  selectedIndex={filterIndex}
                  onOptionSelected={({ nativeEvent: { index } }) => {
                    setFilterIndex(index);
                    const filters: TabFilter[] = [
                      "journal",
                      "calories",
                      "habits",
                    ];
                    setTabFilter(filters[index]);
                  }}
                  variant="palette"
                />
              </Host>
            </View>

            {/* Unified Animated Container for Swipe Transitions */}
            <Animated.View
              className="flex-1 bg-theme-background-primary px-4 pb-8"
              style={contentAnimatedStyle}
            >
              {/* Calorie Tracker Widget */}
              {tabFilter === "calories" && (
                <View className="flex-1 pt-4">
                  <CalorieTrackerScreen selectedDate={selectedDate} />
                </View>
              )}

              {/* Habits Section */}
              {tabFilter === "habits" && (
                <View className="flex-1 pt-4">
                  <HabitsSection selectedDate={selectedDate} />
                </View>
              )}

              {/* Journal Section */}
              {tabFilter === "journal" && (
                <View className="flex-1">
                  {mentalHealthContent}
                </View>
              )}
            </Animated.View>
          </ScrollView>
        </GestureDetector>
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

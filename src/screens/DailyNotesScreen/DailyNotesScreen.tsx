import {
  lazy,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactElement,
} from "react";
import { ScrollView, View } from "react-native";
import { Stack } from "expo-router";
import { Host, Picker, Text as SwiftUIText } from "@expo/ui/swift-ui";
import { pickerStyle, tag, tint } from "@expo/ui/swift-ui/modifiers";
import {
  format,
  addDays,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
} from "date-fns";
import { useAtom, useSetAtom } from "jotai";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import Animated, {
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  FadeIn,
  Easing,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import {
  currentWeekViewAtom,
  selectedDateAtom,
  calenderVisibleDatesAtom,
  openAIInsightsAtom,
} from "./atoms";
import DailyNotesHeader from "./DailyNotesHeader";
import { formateDate_y_m_d } from "@/src/utils/date";
import SuspensLoader from "@/src/components/SuspensLoader";
import { HabitsSection } from "@/src/components/habits/HabitsSection";
import CalorieTrackerScreen from "../CalorieTrackerScreen/CalorieTrackerScreen";
import { SAGE } from "@/lib/tokens";

// Static imports to avoid Metro bundler React.lazy chunk resolution crashes
import { MentalHealthProfileContainer } from "./notes/MentalHealthProfileContainer";
import { AIInsightsModalBottomSheet } from "@/src/components/ai/AIInsightsModalBottomSheet";

const TAB_FILTER_OPTIONS = ["Journal", "Calories", "Habits"] as const;
type TabFilter = "habits" | "journal" | "calories";
type TabFilterLabel = (typeof TAB_FILTER_OPTIONS)[number];

const TAB_FILTER_BY_LABEL: Record<TabFilterLabel, TabFilter> = {
  Journal: "journal",
  Calories: "calories",
  Habits: "habits",
};
const TAB_FILTER_LABEL_BY_FILTER: Record<TabFilter, TabFilterLabel> = {
  journal: "Journal",
  calories: "Calories",
  habits: "Habits",
};

function isTabFilterLabel(selection: unknown): selection is TabFilterLabel {
  return (
    typeof selection === "string" &&
    TAB_FILTER_OPTIONS.includes(selection as TabFilterLabel)
  );
}

function DailyNotesScreenComponent(): ReactElement {
  // State for selected date
  const [selectedDate, setSelectedDate] = useAtom(selectedDateAtom);
  const [openAIInsights, setOpenAIInsights] = useAtom(openAIInsightsAtom);
  const [showBookmarksModal, setShowBookmarksModal] = useState<boolean>(false);

  // Tab filter state
  const [tabFilter, setTabFilter] = useState<TabFilter>("journal");

  // State for current week view (independent of selected date)
  const [currentWeekView, setCurrentWeekView] = useAtom(currentWeekViewAtom);

  // Set calendar visible dates based on current week in view
  const setCalenderVisibleDates = useSetAtom(calenderVisibleDatesAtom);

  // Update calendar visible dates when the displayed week changes.
  useEffect(() => {
    const monthStart = startOfMonth(currentWeekView);
    const monthEnd = endOfMonth(currentWeekView);
    const visibleStartDate = startOfWeek(monthStart, { weekStartsOn: 0 });
    const visibleEndDate = endOfWeek(monthEnd, { weekStartsOn: 0 });

    setCalenderVisibleDates({
      visibleStartDate: formateDate_y_m_d(visibleStartDate),
      visibleEndDate: formateDate_y_m_d(visibleEndDate),
    });
  }, [currentWeekView, setCalenderVisibleDates]);

  // Bottom sheet ref for AI insights
  const bottomSheetRef = useRef<BottomSheetModal>(null);

  useEffect(() => {
    if (!openAIInsights) return;

    setTabFilter("journal");

    const timer = setTimeout(() => {
      bottomSheetRef.current?.present();
      setOpenAIInsights(false);
    }, 350);

    return () => clearTimeout(timer);
  }, [openAIInsights, setOpenAIInsights]);

  // Format week dates for display
  const weekStart = useMemo(
    () => startOfWeek(currentWeekView, { weekStartsOn: 0 }),
    [currentWeekView],
  );
  const weekEnd = useMemo(
    () => endOfWeek(currentWeekView, { weekStartsOn: 0 }),
    [currentWeekView],
  );
  const weekStartFormatted = useMemo(
    () => format(weekStart, "MMM dd, yyyy"),
    [weekStart],
  );
  const weekEndFormatted = useMemo(
    () => format(weekEnd, "MMM dd, yyyy"),
    [weekEnd],
  );

  // Shared values for content animations (UI thread)
  const contentTranslateX = useSharedValue<number>(0);
  const contentOpacity = useSharedValue<number>(1);
  const contentScale = useSharedValue<number>(1);
  // Animated styles with smooth scale feedback
  const contentAnimatedStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.get(),
    transform: [
      { translateX: contentTranslateX.get() },
      { scale: contentScale.get() },
    ],
  }));

  // Helper to move date by offset without stale closure issues
  const updateDateFromTs = useCallback(
    (ts: number): void => {
      const newDate = new Date(ts);
      setSelectedDate(newDate);
      setCurrentWeekView(newDate);
    },
    [setSelectedDate, setCurrentWeekView],
  );

  const changeDateBy = useCallback(
    (offset: number): void => {
      // Pre-compute the target date timestamp on JS thread and pass to worklet as a primitive
      const targetTs: number = addDays(selectedDate, offset).getTime();
      const direction = offset > 0 ? -1 : 1;
      const slideDistance = 30; // Exit distance is shorter

      contentOpacity.set(withTiming(0, { duration: 150 }));
      contentTranslateX.set(
        withTiming(
          direction * slideDistance,
          { duration: 150 },
          (finished?: boolean) => {
            if (finished) {
              runOnJS(updateDateFromTs)(targetTs);
              // Set starting position for new content (coming from the other side)
              contentTranslateX.set(-direction * slideDistance * 1.5);

              // Fade back in with spring motion
              contentOpacity.set(withTiming(1, { duration: 250 }));
              contentTranslateX.set(
                withSpring(0, { damping: 20, stiffness: 100, overshootClamping: true }),
              );
            }
          },
        ),
      );
    },
    [selectedDate, updateDateFromTs, contentOpacity, contentTranslateX],
  );

  const goToPreviousDateContent = useCallback(
    (): void => changeDateBy(-1),
    [changeDateBy],
  );
  const goToNextDateContent = useCallback(
    (): void => changeDateBy(1),
    [changeDateBy],
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
            const resistance =
              resistanceThreshold + (excess * c) / (excess + c);
            tx = rawTx > 0 ? resistance : -resistance;
          }

          if (tx < -maxTranslate) tx = -maxTranslate;
          else if (tx > maxTranslate) tx = maxTranslate;

          contentTranslateX.set(tx);

          const progress = Math.abs(tx) / maxTranslate;

          contentOpacity.set(
            interpolate(progress, [0, 0.7, 1], [1, 0.92, 0.85], "clamp"),
          );
          // Scale only applies during confirmed horizontal swipe, never during scroll
          contentScale.set(interpolate(progress, [0, 1], [1, 0.98], "clamp"));
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
          contentTranslateX.set(
            withSpring(0, { damping: 20, stiffness: 100, overshootClamping: true }),
          );
          contentOpacity.set(
            withSpring(1, { damping: 20, stiffness: 100, overshootClamping: true }),
          );
          contentScale.set(
            withSpring(1, { damping: 20, stiffness: 100, overshootClamping: true }),
          );
        })
        .onFinalize(() => {
          "worklet";
          contentTranslateX.set(
            withSpring(0, { damping: 20, stiffness: 100, overshootClamping: true }),
          );
          contentOpacity.set(withSpring(1));
          contentScale.set(withSpring(1));
        }),
    [
      contentScale,
      contentTranslateX,
      contentOpacity,
      goToNextDateContent,
      goToPreviousDateContent,
    ],
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
    [selectedDate, showBookmarksModal],
  );

  // Memoize header callback
  const handleBookmarksPress = useCallback(
    () => setShowBookmarksModal((prev) => !prev),
    [],
  );
  const handleFilterSelectionChange = useCallback(
    (selection: unknown): void => {
      if (!isTabFilterLabel(selection)) return;
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setTabFilter(TAB_FILTER_BY_LABEL[selection]);
    },
    [],
  );
  const handleAIInsightsClose = useCallback((): void => {
    bottomSheetRef.current?.dismiss();
  }, []);

  // Memoize header component
  const headerComponent = useMemo(
    () => <DailyNotesHeader onBookmarksPress={handleBookmarksPress} />,
    [handleBookmarksPress],
  );
  const screenOptions = useMemo(
    () => ({
      header: () => headerComponent,
      headerShown: true,
    }),
    [headerComponent],
  );

  return (
    <View className="flex-1 bg-brand-surface">
      <SafeAreaView edges={[]} style={{ flex: 1 }}>
        <Stack.Screen options={screenOptions} />
        <View className="flex-1 relative">
          <GestureDetector gesture={contentPanGesture}>
            <ScrollView
              className="flex-1"
              style={{ flex: 1 }}
              contentContainerStyle={{ flexGrow: 1 }}
              showsVerticalScrollIndicator={false}
            >
              {/* Tab Picker */}
              <View className="px-4 pb-3 pt-4">
                <View className="rounded-full border border-sage-100 bg-sage-50 p-1.5">
                  <Host style={{ width: "100%", height: 32 }}>
                    <Picker
                      modifiers={[pickerStyle("segmented"), tint(SAGE[600])]}
                      label="View"
                      selection={TAB_FILTER_LABEL_BY_FILTER[tabFilter]}
                      onSelectionChange={handleFilterSelectionChange}
                    >
                      {TAB_FILTER_OPTIONS.map((option) => (
                        <SwiftUIText key={option} modifiers={[tag(option)]}>
                          {option}
                        </SwiftUIText>
                      ))}
                    </Picker>
                  </Host>
                </View>
              </View>

              {/* Unified Animated Container for Swipe Transitions */}
              <Animated.View
                className="flex-1 px-4 pb-8"
                style={contentAnimatedStyle}
              >
                {/* Calorie Tracker Widget */}
                {tabFilter === "calories" ? (
                  <Animated.View entering={FadeIn.duration(500).easing(Easing.bezier(0.4, 0.0, 0.2, 1))} className="flex-1 pt-4">
                    <CalorieTrackerScreen selectedDate={selectedDate} />
                  </Animated.View>
                ) : null}

                {/* Habits Section */}
                {tabFilter === "habits" ? (
                  <Animated.View entering={FadeIn.duration(500).easing(Easing.bezier(0.4, 0.0, 0.2, 1))} className="flex-1 pt-4">
                    <HabitsSection selectedDate={selectedDate} />
                  </Animated.View>
                ) : null}

                {/* Journal Section */}
                {tabFilter === "journal" ? (
                  <Animated.View entering={FadeIn.duration(500).easing(Easing.bezier(0.4, 0.0, 0.2, 1))} className="min-h-[520px] flex-1">
                    {mentalHealthContent}
                  </Animated.View>
                ) : null}
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
            onClose={handleAIInsightsClose}
          />
        </SuspensLoader>

        {/* Calendar Modal */}
      </SafeAreaView>
    </View>
  );
}

// Memoize the entire screen to prevent unnecessary re-renders from parent
const DailyNotesScreen = memo(DailyNotesScreenComponent);

export default DailyNotesScreen;

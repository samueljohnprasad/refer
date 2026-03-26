import React, { useMemo, useCallback, useState, Suspense } from "react";
import { View, Pressable, Dimensions, Platform } from "react-native";
import { Text } from "@/components/Themed";
import {
  format,
  startOfWeek,
  addDays,
  isToday,
  isValid,
  differenceInWeeks,
  addWeeks,
  startOfMonth,
  isSameWeek,
  startOfDay,
  isAfter,
} from "date-fns";
import { useAtom } from "jotai";
import Animated, {
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";
import { GestureDetector } from "react-native-gesture-handler";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { currentWeekViewAtom, selectedDateAtom } from "./atoms";
import MoodBadge from "@/src/components/MoodBadge";
import { useWeekNavigation } from "./hooks/useWeekNavigation";
import { useFetchMoodsMonthly } from "@/hooks/data/useFetchMoods";
import useCalendarExpandReanimated from "./hooks/useCalendarExpandReanimated";
import TodayPill from "@/src/components/TodayPill";
import { router } from "expo-router";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { Bookmark03Icon, Calendar01Icon } from "@hugeicons/core-free-icons";
import { isIOS } from "@/src/utils/mood";
import { DayButton } from "./DayButtonComponent";
import SuspensLoader from "@/src/components/SuspensLoader";
import { EmotionDetailsModal } from "@/src/components/modals";

// Lazy load CalendarPicker
const CalendarPicker = React.lazy(() =>
  import("./CalendarPicker").then((module) => ({
    default: module.CalendarPicker,
  }))
);

const { height } = Dimensions.get("window");
// Replaced magic number variable name to match exact scaling
const HEADER_MIN_HEIGHT = 120;

// Move constants outside component to avoid recreation
const DAY_NAMES = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const CALENDAR_EXPANDED_HEIGHT = 416; // 8pt grid multiple

interface DailyNotesHeaderProps {
  onBookmarksPress?: () => void;
}

const DailyNotesHeader = React.memo(
  ({ onBookmarksPress }: DailyNotesHeaderProps) => {
    const [selectedDate, setSelectedDate] = useAtom(selectedDateAtom);
    const [currentWeekView, setCurrentWeekView] = useAtom(currentWeekViewAtom);
    const { weekSlideAnim, panHandlers, animateToWeekOf } = useWeekNavigation({
      setCurrentWeek: setCurrentWeekView,
      durationEnterMs: 400,
      durationReturnMs: 300,
      swipeTriggerDx: 50,
      slideDivisor: 50,
      canGoNextWeek: () => {
        const today = new Date();
        const nextWeek = addDays(currentWeekView, 7);
        // allow moving next only if the next week is not beyond the current (today's) week
        return (
          isSameWeek(nextWeek, today, { weekStartsOn: 0 }) ||
          !isAfter(
            startOfWeek(nextWeek, { weekStartsOn: 0 }),
            startOfWeek(today, { weekStartsOn: 0 })
          )
        );
      },
    });
    const insets = useSafeAreaInsets();

    const { data: moodMap } = useFetchMoodsMonthly(); // Vertical expand/collapse for inline calendar (Reanimated on UI thread)
    const { progress, isExpanded, expand, collapse, toggle, gesture } =
      useCalendarExpandReanimated({
        expandedHeight: CALENDAR_EXPANDED_HEIGHT,
        snapThreshold: 0.35,
        durationMs: 500,
      });

    // Track if calendar was ever opened to keep it mounted for smooth animations
    const [hasBeenExpanded, setHasBeenExpanded] = useState(false);

    const [showEmotionDetails, setShowEmotionDetails] = useState(false);
    const [emotionDetailsDate, setEmotionDetailsDate] = useState<Date>(
      new Date()
    );

    React.useEffect(() => {
      if (isExpanded && !hasBeenExpanded) {
        setHasBeenExpanded(true);
      }
    }, [isExpanded, hasBeenExpanded]);

    // Animated styles derived from shared progress
    const headerContainerAnimatedStyle = useAnimatedStyle(() => ({
      height: interpolate(
        progress.value,
        [0, 1],
        [HEADER_MIN_HEIGHT, CALENDAR_EXPANDED_HEIGHT + 24]
      ),
    }));
    const headerControlsAnimatedStyle = useAnimatedStyle(() => ({
      opacity: interpolate(progress.value, [0, 1], [1, 0]),
    }));
    const weekHeaderAnimatedStyle = useAnimatedStyle(() => ({
      opacity: interpolate(progress.value, [0, 0.2, 1], [1, 0.5, 0]),
      transform: [
        { translateY: interpolate(progress.value, [0, 1], [0, -8]) },
        { scale: interpolate(progress.value, [0, 1], [1, 0.98]) },
      ],
    }));
    const inlineCalendarAnimatedStyle = useAnimatedStyle(() => ({
      height: interpolate(
        progress.value,
        [0, 1],
        [0, CALENDAR_EXPANDED_HEIGHT]
      ),
      opacity: interpolate(progress.value, [0, 0.05, 0.15, 1], [0, 0, 1, 1]),
    }));

    // Reanimated-driven slide/opacity for the week strip with smoother transitions
    const weekSlideAnimatedStyle = useAnimatedStyle(() => ({
      transform: [
        {
          translateX: interpolate(
            weekSlideAnim.value,
            [-1, 0, 1],
            [-10, 0, 10]
          ),
        },
      ],
      opacity: interpolate(
        weekSlideAnim.value,
        [-1, -0.5, 0, 0.5, 1],
        [0.3, 0.7, 1, 0.7, 0.3],
        "clamp"
      ),
    }));

    const selectDate = useCallback(
      (date: Date) => {
        setSelectedDate(date);
        // Also update the week view to center on the selected date
        setCurrentWeekView(date);
      },
      [setSelectedDate, setCurrentWeekView]
    );

    // Guard against any invalid dates to avoid RangeError from date-fns format
    const isSelectedDateValid = useMemo(
      () => isValid(selectedDate),
      [selectedDate]
    );
    const currentWeekViewSafe = useMemo(
      () => (isValid(currentWeekView) ? currentWeekView : new Date()),
      [currentWeekView]
    );

    const selectedDateLabel = useMemo(
      () => (isSelectedDateValid ? format(selectedDate, "MMM, yyyy") : ""),
      [isSelectedDateValid, selectedDate]
    );
    const selectedDateStr = useMemo(
      () => (isSelectedDateValid ? format(selectedDate, "yyyy-MM-dd") : ""),
      [isSelectedDateValid, selectedDate]
    );

    const weekStart = useMemo(
      () => startOfWeek(currentWeekViewSafe, { weekStartsOn: 0 }),
      [currentWeekViewSafe]
    );

    const currentMonthView = useMemo(
      () =>
        format(
          startOfMonth(startOfWeek(currentWeekViewSafe, { weekStartsOn: 0 })),
          "MMM, yyyy"
        ),
      [currentWeekViewSafe]
    );

    const weekDays = useMemo(() => {
      const start = weekStart.getTime();
      return [0, 1, 2, 3, 4, 5, 6].map((i) => new Date(start + i * 86400000));
    }, [weekStart]);

    // Memoize week days data to avoid recalculating format on every render
    const weekDaysData = useMemo(() => {
      const today = new Date();
      const isCurrentWeekInView = isSameWeek(currentWeekViewSafe, today, {
        weekStartsOn: 0,
      });
      return weekDays.map((day, index) => {
        const dayStr = format(day, "yyyy-MM-dd");
        const disabled =
          isCurrentWeekInView && isAfter(startOfDay(day), startOfDay(today));
        return {
          day,
          dayStr,
          dayName: DAY_NAMES[index],
          isTodayDate: isToday(day),
          isSelectedDay: selectedDateStr !== "" && dayStr === selectedDateStr,
          mood: moodMap?.get(dayStr), // Pre-fetch mood to avoid map lookup in render
          disabled,
        };
      });
    }, [weekDays, selectedDateStr, moodMap, currentWeekViewSafe]);

    const dayPressHandlers = useCallback(
      (dayData: (typeof weekDaysData)[number]) => {
        return () => selectDate(dayData.day);
      },
      [selectDate]
    );

    const handleGoToToday = useCallback(async (): Promise<void> => {
      const today = new Date();
      const weeksDifference = differenceInWeeks(today, currentWeekView);
      const weeksAway = Math.abs(weeksDifference);

      if (weeksAway <= 3) {
        // 3 weeks or less: animate all the way to today
        await animateToWeekOf(today, currentWeekView);
        selectDate(today);
      } else {
        // More than 3 weeks: animate 3 weeks toward today, then jump
        const direction = weeksDifference > 0 ? 1 : -1; // Forward or backward
        const intermediateDate = addWeeks(currentWeekView, 2 * direction);

        // Animate for 3 weeks
        await animateToWeekOf(intermediateDate, currentWeekView);

        // Then jump instantly to today
        selectDate(today);
        setCurrentWeekView(today);
      }
    }, [animateToWeekOf, currentWeekView, selectDate, setCurrentWeekView]);

    const showTodayPill = useMemo(() => {
      const isSameW = isSameWeek(currentWeekViewSafe, new Date(), {
        weekStartsOn: 0,
      });
      if (!isSameW) {
        return true;
      }

      return isSelectedDateValid ? !isToday(selectedDate) : false;
    }, [currentWeekViewSafe]);

    const onEmojiPress = (day: Date, moodScore?: number) => {
      if (moodScore) {
        setEmotionDetailsDate(day);
        return setShowEmotionDetails(true);
      }
      const today = new Date();
      if (isAfter(startOfDay(day), startOfDay(today))) return;
      const date = day.toISOString();
      router.push({
        pathname: "/tabs/(tabs)/record",
        params: { date },
      });
    };

    return (
      <SafeAreaView
        edges={["top"]}
        style={{
          paddingTop: insets.top,
        }}
        className="bg-theme-background-primary"
      >
        <Animated.View
          className="bg-theme-background-primary justify-end relative"
          style={[headerContainerAnimatedStyle]}
        >
          {/* Calendar Header */}
          <Animated.View
            className="flex-row items-center justify-between px-4 pb-2 rounded-3xl"
            style={[headerControlsAnimatedStyle]}
          >
            <Pressable
              className="p-2 -ml-1 rounded-lg"
              onPress={() => toggle()}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              accessibilityRole="button"
              accessibilityLabel={isExpanded ? "Collapse calendar" : "Expand calendar"}
              accessibilityHint="Toggles between weekly and monthly calendar views"
            >
              <HugeiconsIcon icon={Calendar01Icon} size={20} className="text-theme-text-secondary" />
            </Pressable>

            <View className="flex-row items-center justify-center flex-1">
              <Text className="text-2xl text-theme-text-primary text-center font-cormorantBold">
                {currentMonthView || ""}
              </Text>
            </View>

            <View className="flex-row items-center gap-1">
              <Pressable
                className="p-2 rounded-lg"
                onPress={onBookmarksPress}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                accessibilityRole="button"
                accessibilityLabel="Bookmarks"
              >
                <HugeiconsIcon icon={Bookmark03Icon} size={20} className="text-theme-text-secondary" />
              </Pressable>
            </View>
          </Animated.View>
          {/* Week View */}
          <View className="px-4 pb-4 w-full relative" {...panHandlers}>
            <Animated.View
              className="flex-row w-full"
              style={[weekHeaderAnimatedStyle]}
            >
              <Animated.View
                className="flex flex-1 flex-row gap-1"
                style={[weekSlideAnimatedStyle]}
                accessibilityElementsHidden={isExpanded}
                importantForAccessibility={isExpanded ? "no-hide-descendants" : "auto"}
              >
                {weekDaysData.map((dayData) => (
                  <View className="flex-1 gap-2 mb-2" key={dayData.dayStr}>
                    <DayButton
                      day={dayData.day}
                      dayName={dayData.dayName}
                      isSelected={dayData.isSelectedDay}
                      isToday={dayData.isTodayDate}
                      disabled={dayData.disabled}
                      onPress={dayPressHandlers(dayData)}
                    />
                    <View className="flex-1 items-center mb-1">
                      <MoodBadge
                        disabled={dayData.disabled}
                        moodscore={Math.round(dayData.mood || 0)}
                        active={dayData.isSelectedDay}
                        size={24}
                        onPress={() => onEmojiPress(dayData.day, dayData.mood)}
                      />
                    </View>
                  </View>
                ))}
              </Animated.View>
            </Animated.View>
          </View>
          {/* Only render CalendarPicker after first expansion for smooth animations */}
          {hasBeenExpanded && (
            <Animated.View
              className="absolute left-0 right-0 z-20 overflow-hidden px-4 pb-3 rounded-t-none bg-theme-background-primary top-0"
              style={[inlineCalendarAnimatedStyle]}
              accessibilityElementsHidden={!isExpanded}
              importantForAccessibility={!isExpanded ? "no-hide-descendants" : "yes"}
            >
              <SuspensLoader>
                <CalendarPicker
                  moodMap={moodMap}
                  selectedDate={isSelectedDateValid ? selectedDate : new Date()}
                  visible={isExpanded}
                  onDateSelect={(date: Date) => {
                    // First collapse smoothly, then update date so header morph feels natural
                    collapse(() => {
                      selectDate(date);
                    });
                  }}
                />
              </SuspensLoader>
            </Animated.View>
          )}
          {/* Today tag - animated reusable component */}
          <TodayPill visible={showTodayPill} onPress={handleGoToToday} />
          {/* Drag handle for calendar expansion */}
          <View
            className="absolute bottom-1 left-0 right-0 items-center z-10"
            pointerEvents="box-none"
          >
            <GestureDetector gesture={gesture}>
              <View 
                className="py-2 px-8"
                accessibilityRole="adjustable"
                accessibilityLabel="Calendar drag handle"
              >
                <View className="w-10 h-1 rounded-full bg-theme-border" />
              </View>
            </GestureDetector>
          </View>
        </Animated.View>

        <EmotionDetailsModal
          visible={showEmotionDetails}
          onClose={() => setShowEmotionDetails(false)}
          selectedDate={emotionDetailsDate}
        />
      </SafeAreaView>
    );
  }
);

DailyNotesHeader.displayName = "DailyNotesHeader";

export default DailyNotesHeader;

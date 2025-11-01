import React, { useMemo, useCallback, useState } from "react";
import { View, Pressable, Dimensions, Platform } from "react-native";
import { Text } from "@/components/Themed";
import { Feather } from "@expo/vector-icons";
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
import { DayButton } from "./DailyNotesScreen";
import { CalendarPicker } from "./CalendarPicker";
import { useWeekNavigation } from "./hooks/useWeekNavigation";
import useFetchMoods from "@/hooks/data/useFetchMoods";
import useCalendarExpandReanimated from "./hooks/useCalendarExpandReanimated";
import TodayPill from "@/src/components/TodayPill";
import { router } from "expo-router";

const { height } = Dimensions.get("window");
const isIso = Platform.OS === "ios";
const twentyPercentHeight = height * (isIso ? 0.16 : 0.16);

// Move constants outside component to avoid recreation
const DAY_NAMES = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const CALENDAR_EXPANDED_HEIGHT = 400;

const DailyNotesHeader = React.memo(() => {
  const [selectedDate, setSelectedDate] = useAtom(selectedDateAtom);
  const [currentWeekView, setCurrentWeekView] = useAtom(currentWeekViewAtom);
  const { weekSlideAnim, panHandlers, animateToWeekOf } = useWeekNavigation({
    setCurrentWeek: setCurrentWeekView,
    durationEnterMs: 400,
    durationReturnMs: 300,
    swipeTriggerDx: 50,
    slideDivisor: 50,
  });
  const insets = useSafeAreaInsets();

  const { data: moodMap } = useFetchMoods();

  // Vertical expand/collapse for inline calendar (Reanimated on UI thread)
  const { progress, isExpanded, expand, collapse, toggle, gesture } =
    useCalendarExpandReanimated({
      expandedHeight: CALENDAR_EXPANDED_HEIGHT,
      snapThreshold: 0.35,
      durationMs: 500,
    });

  // Track if calendar was ever opened to keep it mounted for smooth animations
  const [hasBeenExpanded, setHasBeenExpanded] = useState(false);

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
      [twentyPercentHeight, CALENDAR_EXPANDED_HEIGHT + 20]
    ),
  }));
  const headerControlsAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 1], [1, 0]),
  }));
  const weekHeaderAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 1], [1, 0]),
    transform: [
      { translateY: interpolate(progress.value, [0, 1], [0, -8]) },
      { scale: interpolate(progress.value, [0, 1], [1, 0.98]) },
    ],
  }));
  const inlineCalendarAnimatedStyle = useAnimatedStyle(() => ({
    height: interpolate(progress.value, [0, 1], [0, CALENDAR_EXPANDED_HEIGHT]),
    opacity: interpolate(progress.value, [0, 0.05, 0.15, 1], [0, 0, 1, 1]),
  }));

  // Reanimated-driven slide/opacity for the week strip (no RN Animated)
  const weekSlideAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: interpolate(weekSlideAnim.value, [-1, 0, 1], [-10, 0, 10]),
      },
    ],
    opacity: interpolate(
      weekSlideAnim.value,
      [-1, 0, 1],
      [0.4, 1, 0.4],
      "clamp" // Clamp to prevent going below 0.3
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

  const weekDays = useMemo(
    () => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)),
    [weekStart]
  );

  // Memoize week days data to avoid recalculating format on every render
  const weekDaysData = useMemo(() => {
    return weekDays.map((day, index) => {
      const dayStr = format(day, "yyyy-MM-dd");
      return {
        day,
        dayStr,
        dayName: DAY_NAMES[index],
        isTodayDate: isToday(day),
        isSelectedDay: selectedDateStr !== "" && dayStr === selectedDateStr,
        mood: moodMap?.get(dayStr), // Pre-fetch mood to avoid map lookup in render
      };
    });
  }, [weekDays, selectedDateStr, moodMap]);

  const dayPressHandlers = useCallback(
    (dayData: any) => {
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
      const intermediateDate = addWeeks(currentWeekView, 3 * direction);

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
    if (moodScore) return;
    const date = day.toISOString();
    router.push({
      pathname: "/tabs/(tabs)/record",
      params: { date },
    });
  };

  // Pan gesture handlers are provided by useWeekNavigation
  return (
    <SafeAreaView edges={["top"]} className="bg-violet-300">
      <Animated.View
        className="bg-violet-300 justify-end relative"
        style={[headerContainerAnimatedStyle]}
      >
        {/* Calendar Header */}
        <Animated.View
          className="flex-row items-center justify-between mb-0 px-3"
          style={[headerControlsAnimatedStyle]}
        >
          <Pressable className="p-1 ml-0 mr-2" onPress={() => toggle()}>
            <Feather name="calendar" size={24} color="white" />
          </Pressable>

          <View className="flex-row items-center justify-center flex-1">
            <Text className="text-[17px] font-semibold text-white mx-4 text-center">
              {currentMonthView || ""}
            </Text>
          </View>

          <Pressable className="p-2" onPress={() => expand()}>
            <Feather name="more-horizontal" size={24} color="#fff" />
          </Pressable>
        </Animated.View>
        {/* Week View */}
        <View className="py-3 px-3 mb-0 w-full relative" {...panHandlers}>
          <Animated.View
            className="flex-row w-full"
            style={[weekHeaderAnimatedStyle]}
          >
            <Animated.View
              style={[
                { display: "flex", flex: 1, flexDirection: "row", gap: 6 },
                weekSlideAnimatedStyle,
              ]}
            >
              {weekDaysData.map((dayData) => (
                <View className="flex-1 gap-4 mb-8" key={dayData.dayStr}>
                  <DayButton
                    day={dayData.day}
                    dayName={dayData.dayName}
                    isSelected={dayData.isSelectedDay}
                    isToday={dayData.isTodayDate}
                    onPress={dayPressHandlers(dayData)}
                  />
                  <View className="flex-1 items-center">
                    <MoodBadge
                      moodscore={dayData.mood}
                      active={dayData.isSelectedDay}
                      size={28}
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
            className="absolute left-0 right-0 z-20 overflow-hidden px-3 pb-2 rounded-t-none bg-violet-300"
            style={[inlineCalendarAnimatedStyle, { top: isIso ? 0 : 0 }]}
          >
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
          </Animated.View>
        )}
        {/* Today tag - animated reusable component */}
        <TodayPill visible={showTodayPill} onPress={handleGoToToday} />
        {/* Absolute overlay handle that moves down with expanding calendar */}
        <Animated.View
          className="absolute left-0 right-0 items-center z-10"
          pointerEvents="box-none"
        >
          <GestureDetector gesture={gesture}>
            <View className="w-12 h-[5px] rounded bg-white/90" />
          </GestureDetector>
        </Animated.View>
      </Animated.View>
    </SafeAreaView>
  );
});

DailyNotesHeader.displayName = "DailyNotesHeader";

export default DailyNotesHeader;

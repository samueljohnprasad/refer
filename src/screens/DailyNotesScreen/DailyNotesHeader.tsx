import React from "react";
import {
  View,
  Pressable,
  Dimensions,
  Platform,
} from "react-native";
import { Text } from "@/components/Themed";
import { Feather } from "@expo/vector-icons";
import { format, startOfWeek, addDays, isToday, isValid } from "date-fns";
import { useAtom } from "jotai";
import Animated, {
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";
import { GestureDetector } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { currentWeekViewAtom, selectedDateAtom } from "./atoms";
import MoodBadge from "@/src/components/MoodBadge";
import { DayButton } from "./DailyNotesScreen";
import { CalendarPicker } from "./CalendarPicker";
import { useWeekNavigation } from "./hooks/useWeekNavigation";
import useFetchMoods from "@/hooks/data/useFetchMoods";
import useCalendarExpandReanimated from "./hooks/useCalendarExpandReanimated";
import TodayPill from "@/src/components/TodayPill";

const { height } = Dimensions.get("window");
const isIso = Platform.OS === "ios";
const twentyPercentHeight = height * (isIso ? 0.24 : 0.19);

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
  const insets = useSafeAreaInsets();

  const { data: moodMap } = useFetchMoods();

  // Vertical expand/collapse for inline calendar (Reanimated on UI thread)
  const CALENDAR_EXPANDED_HEIGHT = 400;
  const { progress, isExpanded, expand, collapse, toggle, gesture } =
    useCalendarExpandReanimated({
      expandedHeight: CALENDAR_EXPANDED_HEIGHT,
      snapThreshold: 0.35,
      durationMs: 500,
    });

  // Animated styles derived from shared progress
  const headerContainerAnimatedStyle = useAnimatedStyle(() => ({
    height: interpolate(
      progress.value,
      [0, 1],
      [twentyPercentHeight, CALENDAR_EXPANDED_HEIGHT + 50]
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
    opacity: interpolate(weekSlideAnim.value, [-1, 0, 1], [0.3, 1, 0.3]),
  }));

  const selectDate = (date: Date) => {
    setSelectedDate(date);
    // Also update the week view to center on the selected date
    setCurrentWeekView(date);
  };

  // Guard against any invalid dates to avoid RangeError from date-fns format
  const isSelectedDateValid = isValid(selectedDate);
  const currentWeekViewSafe = isValid(currentWeekView)
    ? currentWeekView
    : new Date();

  const selectedDateLabel = isSelectedDateValid
    ? format(selectedDate, "MMM, yyyy")
    : "";
  const selectedDateStr = isSelectedDateValid
    ? format(selectedDate, "yyyy-MM-dd")
    : "";

  const weekStart = startOfWeek(currentWeekViewSafe, { weekStartsOn: 0 }); // Sunday
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
          <Text className="text-[17px] font-semibold text-white mx-4 text-center">{selectedDateLabel || ""}</Text>
        </View>

        <Pressable className="p-2" onPress={() => expand()}>
          <Feather name="more-horizontal" size={24} color="#fff" />
        </Pressable>
      </Animated.View>

      {/* Week View */}
      <View className="py-3 px-3 mb-0 w-full relative" {...panHandlers}>
        <Animated.View className="flex-row w-full" style={[weekHeaderAnimatedStyle]}>
          <Animated.View
            style={[
              { display: "flex", flex: 1, flexDirection: "row", gap: 6 },
              weekSlideAnimatedStyle,
            ]}
          >
            {weekDays.map((day, index) => {
              const isTodayDate = isToday(day);
              const isSelectedDay =
                selectedDateStr !== "" &&
                format(day, "yyyy-MM-dd") === selectedDateStr;

              const mood = moodMap?.get(format(day, "yyyy-MM-dd"));
              return (
                <View className="flex-1 gap-4 mb-8" key={index}>
                  <DayButton
                    day={day}
                    dayName={dayNames[index]}
                    isSelected={isSelectedDay}
                    isToday={isTodayDate}
                    onPress={() => selectDate(day)}
                  />
                  <View className="flex-1 items-center">
                    <MoodBadge
                      moodscore={mood}
                      active={isSelectedDay}
                      size={28}
                    />
                  </View>
                </View>
              );
            })}
          </Animated.View>
        </Animated.View>
      </View>
      <Animated.View
        className="absolute left-0 right-0 z-20 overflow-hidden px-3 pb-2 rounded-t-none bg-violet-300"
        style={[
          inlineCalendarAnimatedStyle,
          { top: isIso ? 45 : 10 },
        ]}
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
      {/* Today tag - animated reusable component */}
      <TodayPill
        visible={isSelectedDateValid ? !isToday(selectedDate) : false}
        onPress={handleGoToToday}
      />
      {/* Absolute overlay handle that moves down with expanding calendar */}
      <Animated.View className="absolute left-0 right-0 items-center z-10" pointerEvents="box-none">
        <GestureDetector gesture={gesture}>
          <View className="w-12 h-[5px] rounded bg-white/90" />
        </GestureDetector>
      </Animated.View>
    </Animated.View>
  );
};


export default DailyNotesHeader;

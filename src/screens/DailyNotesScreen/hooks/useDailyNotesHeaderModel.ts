import { useCallback, useEffect, useMemo, useState } from "react";
import { Dimensions } from "react-native";
import {
  addDays,
  addWeeks,
  differenceInWeeks,
  format,
  isAfter,
  isSameWeek,
  isToday,
  isValid,
  startOfDay,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { useAtom } from "jotai";
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { currentWeekViewAtom, selectedDateAtom } from "../atoms";
import { useWeekNavigation } from "./useWeekNavigation";
import { useFetchMoodsMonthly } from "@/hooks/data/useFetchMoods";
import useCalendarExpandReanimated from "./useCalendarExpandReanimated";

const { height } = Dimensions.get("window");
const HEADER_MIN_HEIGHT = 157;
const CALENDAR_EXPANDED_HEIGHT = 456;

export function useDailyNotesHeaderModel(onBookmarksPress?: () => void) {
  const { i18n, t } = useTranslation("journal");
  const [selectedDate, setSelectedDate] = useAtom(selectedDateAtom);
  const [currentWeekView, setCurrentWeekView] = useAtom(currentWeekViewAtom);
  const insets = useSafeAreaInsets();
  const { data: moodMap } = useFetchMoodsMonthly();
  const { weekSlideAnim, panHandlers, animateToWeekOf } = useWeekNavigation({
    setCurrentWeek: setCurrentWeekView,
    durationEnterMs: 400,
    durationReturnMs: 300,
    swipeTriggerDx: 50,
    slideDivisor: 50,
    canGoNextWeek: () => {
      const today = new Date();
      const nextWeek = addDays(currentWeekView, 7);
      return (
        isSameWeek(nextWeek, today, { weekStartsOn: 0 }) ||
        !isAfter(startOfWeek(nextWeek, { weekStartsOn: 0 }), startOfWeek(today, { weekStartsOn: 0 }))
      );
    },
  });
  const { progress, isExpanded, collapse, toggle, gesture } = useCalendarExpandReanimated({
    expandedHeight: CALENDAR_EXPANDED_HEIGHT,
    snapThreshold: 0.35,
    durationMs: 500,
  });

  const [hasBeenExpanded, setHasBeenExpanded] = useState(false);
  const [showEmotionDetails, setShowEmotionDetails] = useState(false);
  const [emotionDetailsDate, setEmotionDetailsDate] = useState(new Date());

  useEffect(() => {
    if (isExpanded && !hasBeenExpanded) setHasBeenExpanded(true);
  }, [isExpanded, hasBeenExpanded]);

  const headerContainerAnimatedStyle = useAnimatedStyle(() => ({
    height: interpolate(progress.value, [0, 1], [HEADER_MIN_HEIGHT, CALENDAR_EXPANDED_HEIGHT + 24]),
  }));
  const titleAndBookmarkStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 1], [1, 0]),
  }));
  const headerControlsAnimatedStyle = useAnimatedStyle(() => ({ zIndex: 30 }));
  const weekHeaderAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 0.2, 1], [1, 0.5, 0]),
    transform: [
      { translateY: interpolate(progress.value, [0, 1], [0, -8]) },
      { scale: interpolate(progress.value, [0, 1], [1, 0.98]) },
    ],
  }));
  const inlineCalendarAnimatedStyle = useAnimatedStyle(() => ({
    height: interpolate(progress.value, [0, 1], [0, CALENDAR_EXPANDED_HEIGHT]),
    opacity: interpolate(progress.value, [0, 0.05, 0.15, 1], [0, 0, 1, 1]),
  }));
  const weekSlideAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: interpolate(weekSlideAnim.value, [-1, 0, 1], [-10, 0, 10]) }],
    opacity: interpolate(weekSlideAnim.value, [-1, -0.5, 0, 0.5, 1], [0.3, 0.7, 1, 0.7, 0.3], "clamp"),
  }));

  const selectDate = useCallback((date: Date) => {
    setSelectedDate(date);
    setCurrentWeekView(date);
  }, [setSelectedDate, setCurrentWeekView]);

  const isSelectedDateValid = useMemo(() => isValid(selectedDate), [selectedDate]);
  const currentWeekViewSafe = useMemo(
    () => (isValid(currentWeekView) ? currentWeekView : new Date()),
    [currentWeekView],
  );
  const selectedDateLabel = useMemo(
    () => isSelectedDateValid
      ? new Intl.DateTimeFormat(i18n.language, { month: "short", year: "numeric" }).format(selectedDate)
      : "",
    [i18n.language, isSelectedDateValid, selectedDate],
  );
  const selectedDateStr = useMemo(
    () => (isSelectedDateValid ? format(selectedDate, "yyyy-MM-dd") : ""),
    [isSelectedDateValid, selectedDate],
  );
  const weekStart = useMemo(() => startOfWeek(currentWeekViewSafe, { weekStartsOn: 0 }), [currentWeekViewSafe]);
  const currentMonthView = useMemo(
    () => new Intl.DateTimeFormat(i18n.language, { month: "long", year: "numeric" })
      .format(startOfMonth(weekStart)),
    [i18n.language, weekStart],
  );
  const weekDays = useMemo(
    () => Array.from({ length: 7 }, (_, index) => new Date(weekStart.getTime() + index * 86400000)),
    [weekStart],
  );
  const weekDaysData = useMemo(() => {
    const today = new Date();
    const isCurrentWeekInView = isSameWeek(currentWeekViewSafe, today, { weekStartsOn: 0 });
    return weekDays.map((day) => {
      const dayStr = format(day, "yyyy-MM-dd");
      return {
        day,
        dayStr,
        dayName: new Intl.DateTimeFormat(i18n.language, { weekday: "short" })
          .format(day).toLocaleUpperCase(i18n.language),
        isTodayDate: isToday(day),
        isSelectedDay: selectedDateStr !== "" && dayStr === selectedDateStr,
        mood: moodMap?.get(dayStr),
        disabled: isCurrentWeekInView && isAfter(startOfDay(day), startOfDay(today)),
      };
    });
  }, [i18n.language, weekDays, selectedDateStr, moodMap, currentWeekViewSafe]);

  const [weekWidth, setWeekWidth] = useState(0);
  const [buttonHeight, setButtonHeight] = useState(55);
  const pillX = useSharedValue(0);
  const pillOpacity = useSharedValue(0);
  const selectedIndex = useMemo(() => weekDaysData.findIndex((day) => day.isSelectedDay), [weekDaysData]);

  useEffect(() => {
    if (selectedIndex < 0 || weekWidth === 0) {
      pillOpacity.value = withTiming(0, { duration: 150 });
      return;
    }
    const cellWidth = (weekWidth - 24) / 7;
    const xPosition = selectedIndex * (cellWidth + 4);
    if (pillOpacity.value === 0) {
      pillX.value = xPosition;
      pillOpacity.value = withTiming(1, { duration: 150 });
    } else {
      pillX.value = withTiming(xPosition, { duration: 600, easing: Easing.bezier(0.4, 0, 0.2, 1) });
    }
  }, [selectedIndex, weekWidth]);

  const animatedPillStyle = useAnimatedStyle(() => {
    if (!weekWidth) return { opacity: 0 };
    return {
      position: "absolute",
      width: (weekWidth - 24) / 7,
      height: buttonHeight,
      transform: [{ translateX: pillX.value }],
      opacity: pillOpacity.value,
      zIndex: 0,
      borderColor: "rgba(187, 199, 185, 0.4)",
      borderWidth: 1,
      borderRadius: 16,
      overflow: "hidden",
    };
  });
  const dayPressHandlers = useCallback((dayData: (typeof weekDaysData)[number]) => () => selectDate(dayData.day), [selectDate]);

  const handleGoToToday = useCallback(async (): Promise<void> => {
    const today = new Date();
    const weeksDifference = differenceInWeeks(today, currentWeekView);
    if (Math.abs(weeksDifference) <= 3) {
      await animateToWeekOf(today, currentWeekView);
      selectDate(today);
      return;
    }
    const intermediateDate = addWeeks(currentWeekView, 2 * (weeksDifference > 0 ? 1 : -1));
    await animateToWeekOf(intermediateDate, currentWeekView);
    selectDate(today);
    setCurrentWeekView(today);
  }, [animateToWeekOf, currentWeekView, selectDate, setCurrentWeekView]);
  const showTodayPill = useMemo(() => {
    const isCurrentWeek = isSameWeek(currentWeekViewSafe, new Date(), { weekStartsOn: 0 });
    return !isCurrentWeek || !(isSelectedDateValid && isToday(selectedDate));
  }, [currentWeekViewSafe, isSelectedDateValid, selectedDate]);
  const onEmojiPress = useCallback((day: Date, moodScore?: number) => {
    if (moodScore) {
      setEmotionDetailsDate(day);
      setShowEmotionDetails(true);
      return;
    }
    if (isAfter(startOfDay(day), startOfDay(new Date()))) return;
    router.push({ pathname: "/tabs/(tabs)/record", params: { date: day.toISOString() } });
  }, []);
  const handleCalendarPress = useCallback(() => toggle(), [toggle]);
  const calendarIconStyle = useAnimatedStyle(() => ({ transform: [{ rotateY: `${progress.value * 180}deg` }] }));
  const bookmarkWobble = useSharedValue(0);
  const handleBookmarkPressInternal = useCallback(() => {
    bookmarkWobble.value = -30;
    bookmarkWobble.value = withSpring(0, { damping: 20, stiffness: 100, overshootClamping: true });
    onBookmarksPress?.();
  }, [onBookmarksPress, bookmarkWobble]);
  const handleTimelinePress = useCallback(() => {
    void Haptics.selectionAsync();
    router.push("/tabs/screens/timelines");
  }, []);
  const bookmarkIconStyle = useAnimatedStyle(() => ({
    transform: [{ rotateZ: `${bookmarkWobble.value}deg` }],
    transformOrigin: "top center" as never,
  }));

  return {
    height, selectedDate, currentWeekView, insets, moodMap, progress, isExpanded,
    collapse, toggle, gesture, hasBeenExpanded, showEmotionDetails, setShowEmotionDetails,
    emotionDetailsDate, headerContainerAnimatedStyle, titleAndBookmarkStyle,
    headerControlsAnimatedStyle, weekHeaderAnimatedStyle, inlineCalendarAnimatedStyle,
    weekSlideAnimatedStyle, panHandlers, selectedDateLabel, isSelectedDateValid, selectDate,
    currentMonthView, weekDaysData,
    setWeekWidth, setButtonHeight, animatedPillStyle, dayPressHandlers, handleGoToToday,
    showTodayPill, onEmojiPress, handleCalendarPress, calendarIconStyle,
    handleBookmarkPressInternal, handleTimelinePress, bookmarkIconStyle,
    t,
  };
}

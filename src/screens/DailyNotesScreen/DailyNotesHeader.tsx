import React, { useMemo, useCallback, useState, Suspense, useEffect } from "react";
import { View, Pressable, Dimensions, Platform } from "react-native";
import { Text } from "@/src/components/ui/Text";
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
  useSharedValue,
  withSpring,
  withTiming,
  Easing,
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
import { Bookmark03Icon, Calendar01Icon, Cancel01Icon } from "@hugeicons/core-free-icons";
import { isIOS } from "@/src/utils/mood";
import { DayButton } from "./DayButtonComponent";
import SuspensLoader from "@/src/components/SuspensLoader";
import { EmotionDetailsModal } from "@/src/components/modals";
import { BRAND_SURFACE, SAGE } from "@/lib/tokens";
import { GlassView, isGlassEffectAPIAvailable } from "expo-glass-effect";
import { BlurView } from "expo-blur";

const AnimatedGlassView = Animated.createAnimatedComponent(GlassView);
const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);
// Static imports to avoid Metro bundler React.lazy chunk resolution crashes
import { CalendarPicker } from "./CalendarPicker";

const { height } = Dimensions.get("window");
// Use exact content height to prevent overflow and align headers natively
const HEADER_MIN_HEIGHT = 157;

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
    const titleAndBookmarkStyle = useAnimatedStyle(() => ({
      opacity: interpolate(progress.value, [0, 1], [1, 0]),
      pointerEvents: progress.value > 0.5 ? 'none' : 'auto',
    }));
    const headerControlsAnimatedStyle = useAnimatedStyle(() => ({
      zIndex: 30,
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
          "MMMM yyyy"
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

    // Morphing Pill Logic for Week View
    const [weekWidth, setWeekWidth] = useState(0);
    const [buttonHeight, setButtonHeight] = useState(55); // Fallback
    const pillX = useSharedValue(0);
    const pillOpacity = useSharedValue(0);

    const selectedIndex = useMemo(
      () => weekDaysData.findIndex((d) => d.isSelectedDay),
      [weekDaysData]
    );

    useEffect(() => {
      if (selectedIndex !== -1 && weekWidth > 0) {
        const cellWidth = (weekWidth - 24) / 7;
        const xPos = selectedIndex * (cellWidth + 4);

        const TimingConfig = {
          duration: 600, // Slightly longer duration to appreciate the curve
          easing: Easing.bezier(0.4, 0.0, 0.2, 1),
        };

        if (pillOpacity.value === 0) {
          pillX.value = xPos;
          pillOpacity.value = withTiming(1, { duration: 150 });
        } else {
          pillX.value = withTiming(xPos, TimingConfig);
        }
      } else {
        pillOpacity.value = withTiming(0, { duration: 150 });
      }
    }, [selectedIndex, weekWidth]);

    const animatedPillStyle = useAnimatedStyle(() => {
      if (weekWidth === 0) return { opacity: 0 };
      const cellWidth = (weekWidth - 24) / 7;
      return {
        position: "absolute",
        width: cellWidth,
        height: buttonHeight,
        transform: [{ translateX: pillX.value }],
        opacity: pillOpacity.value,
        zIndex: 0,
        borderColor: "rgba(187, 199, 185, 0.4)", // SAGE[200] with some transparency
        borderWidth: 1,
        borderRadius: 16,
        overflow: "hidden", // Important for BlurView clipping
      };
    });

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

    const handleCalendarPress = useCallback(() => {
      toggle();
    }, [toggle]);

    const calendarIconStyle = useAnimatedStyle(() => ({
      transform: [{ rotateY: `${progress.value * 180}deg` }],
    }));

    const bookmarkWobble = useSharedValue(0);
    const handleBookmarkPressInternal = useCallback(() => {
      bookmarkWobble.value = -30;
      bookmarkWobble.value = withSpring(0, { damping: 20, stiffness: 100, overshootClamping: true });
      onBookmarksPress?.();
    }, [onBookmarksPress, bookmarkWobble]);

    const bookmarkIconStyle = useAnimatedStyle(() => ({
      transform: [{ rotateZ: `${bookmarkWobble.value}deg` }],
      transformOrigin: 'top center' as any
    }));

    return (
      <View className="bg-brand-surface">
        <SafeAreaView
          edges={["top"]}
          style={{ paddingTop: insets.top - 30 }}
        >
          <Animated.View
            className="bg-brand-surface justify-start relative border-b border-brand-border"
            style={[
              headerContainerAnimatedStyle,
              { backgroundColor: BRAND_SURFACE, marginTop: -25 },
            ]}
          >
            {/* Calendar Header */}
            <Animated.View style={headerControlsAnimatedStyle} pointerEvents="box-none">
              <View
                className="flex-row items-center justify-between px-4 pt-1 pb-2 rounded-3xl"
                pointerEvents="box-none"
              >
                <Pressable
                  className="min-h-[44px] min-w-[44px] justify-center items-center -ml-1 rounded-full"
                  onPress={handleCalendarPress}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  accessibilityRole="button"
                  accessibilityLabel={
                    isExpanded ? "Collapse calendar" : "Expand calendar"
                  }
                  accessibilityHint="Toggles between weekly and monthly calendar views"
                >
                  <Animated.View style={calendarIconStyle}>
                    <HugeiconsIcon
                      icon={isExpanded ? Cancel01Icon : Calendar01Icon}
                      size={20}
                      color={SAGE[600]}
                      strokeWidth={2}
                    />
                  </Animated.View>
                </Pressable>

                <Animated.View 
                  style={[titleAndBookmarkStyle, { position: 'absolute', left: 100, right: 100, top: 0, bottom: 0, zIndex: -1 }]} 
                  className="flex-row items-center justify-center pointer-events-none"
                  pointerEvents="none"
                >
                  <Text variant="h1" className="text-[28px] text-center" adjustsFontSizeToFit numberOfLines={1} minimumFontScale={0.7}>
                    {currentMonthView || ""}
                  </Text>
                </Animated.View>

                <Animated.View 
                  style={titleAndBookmarkStyle} 
                  className="flex-row items-center gap-1"
                  pointerEvents={isExpanded ? "none" : "auto"}
                >
                  <TodayPill visible={showTodayPill} onPress={handleGoToToday} offsetX={0} />
                  <Pressable
                    className="min-h-[44px] min-w-[44px] justify-center items-center rounded-full"
                    onPress={handleBookmarkPressInternal}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    accessibilityRole="button"
                    accessibilityLabel="Bookmarks"
                  >
                    <Animated.View style={bookmarkIconStyle}>
                      <HugeiconsIcon
                        icon={Bookmark03Icon}
                        size={20}
                        color={SAGE[600]}
                        strokeWidth={2}
                      />
                    </Animated.View>
                  </Pressable>
                </Animated.View>
              </View>
            </Animated.View>
            {/* Week View */}
            <View className="px-4 pb-4 w-full relative" {...panHandlers}>
              <Animated.View
                className="flex-row w-full"
                style={[weekHeaderAnimatedStyle]}
              >
                <Animated.View
                  className="flex flex-1 flex-row gap-1 relative"
                  style={[weekSlideAnimatedStyle]}
                  accessibilityElementsHidden={isExpanded}
                  importantForAccessibility={
                    isExpanded ? "no-hide-descendants" : "auto"
                  }
                  onLayout={(e) => setWeekWidth(e.nativeEvent.layout.width)}
                >
                  {/* The Morphing Selection Pill */}
                  {isGlassEffectAPIAvailable() ? (
                    <AnimatedGlassView
                      style={animatedPillStyle}
                      pointerEvents="none"
                      glassEffectStyle="regular"
                      tintColor={SAGE.selected}
                    />
                  ) : Platform.OS === "ios" ? (
                    <AnimatedBlurView
                      style={animatedPillStyle}
                      pointerEvents="none"
                      intensity={20}
                      tint="light"
                      experimentalBlurMethod="dimezisBlurView"
                    >
                      <View style={{ flex: 1, backgroundColor: SAGE.selected, opacity: 0.8 }} />
                    </AnimatedBlurView>
                  ) : (
                    <Animated.View
                      style={[animatedPillStyle, { backgroundColor: SAGE.selected }]}
                      pointerEvents="none"
                    />
                  )}

                  {weekDaysData.map((dayData, index) => (
                    <View className="flex-1 gap-1 mb-3" key={dayData.dayStr}>
                      <DayButton
                        day={dayData.day}
                        dayName={dayData.dayName}
                        isSelected={dayData.isSelectedDay}
                        isToday={dayData.isTodayDate}
                        disabled={dayData.disabled}
                        onPress={dayPressHandlers(dayData)}
                        onLayout={index === 0 ? (e) => setButtonHeight(e.nativeEvent.layout.height) : undefined}
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
                className="absolute left-0 right-0 z-20 overflow-hidden px-4 pb-3 rounded-t-none bg-brand-surface top-0"
                style={[inlineCalendarAnimatedStyle]}
                accessibilityElementsHidden={!isExpanded}
                importantForAccessibility={
                  !isExpanded ? "no-hide-descendants" : "yes"
                }
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
            {/* Drag handle for calendar expansion */}
            <View
              className="absolute bottom-2 left-0 right-0 items-center z-10"
              pointerEvents="box-none"
            >
              <GestureDetector gesture={gesture}>
                <View
                  className="min-h-[44px] justify-center px-8 hidden"
                  accessibilityRole="adjustable"
                  accessibilityLabel="Calendar drag handle"
                >
                  <View className="w-12 h-1.5 rounded-full bg-sage-200" />
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
      </View>
    );
  }
);

DailyNotesHeader.displayName = "DailyNotesHeader";

export default DailyNotesHeader;

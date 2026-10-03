import { useCallback, useMemo } from "react";
import { addDays } from "date-fns";
import { useAtom, useSetAtom } from "jotai";
import { Gesture } from "react-native-gesture-handler";
import {
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { currentWeekViewAtom, selectedDateAtom } from "../atoms";

export function useJournalDateSwipe() {
  const [selectedDate, setSelectedDate] = useAtom(selectedDateAtom);
  const setCurrentWeekView = useSetAtom(currentWeekViewAtom);
  const translateX = useSharedValue(0);
  const opacity = useSharedValue(1);
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.get(),
    transform: [{ translateX: translateX.get() }, { scale: scale.get() }],
  }));

  const updateDate = useCallback(
    (timestamp: number): void => {
      const nextDate = new Date(timestamp);
      setSelectedDate(nextDate);
      setCurrentWeekView(nextDate);
    },
    [setSelectedDate, setCurrentWeekView],
  );

  const changeDateBy = useCallback(
    (offset: number): void => {
      const targetTimestamp = addDays(selectedDate, offset).getTime();
      const direction = offset > 0 ? -1 : 1;
      const slideDistance = 30;

      opacity.set(withTiming(0, { duration: 150 }));
      translateX.set(
        withTiming(direction * slideDistance, { duration: 150 }, (finished) => {
          if (!finished) return;
          runOnJS(updateDate)(targetTimestamp);
          translateX.set(-direction * slideDistance * 1.5);
          opacity.set(withTiming(1, { duration: 250 }));
          translateX.set(withSpring(0, { damping: 20, stiffness: 100, overshootClamping: true }));
        }),
      );
    },
    [selectedDate, updateDate, opacity, translateX],
  );

  const goToPreviousDate = useCallback(() => changeDateBy(-1), [changeDateBy]);
  const goToNextDate = useCallback(() => changeDateBy(1), [changeDateBy]);

  const gesture = useMemo(
    () =>
      Gesture.Pan()
        .minDistance(15)
        .failOffsetY([-5, 5])
        .activeOffsetX([-15, 15])
        .onUpdate((event) => {
          "worklet";
          const rawTranslation = event.translationX;
          const resistanceThreshold = 60;
          const maxTranslation = 100;
          let translation = rawTranslation;

          if (Math.abs(rawTranslation) > resistanceThreshold) {
            const excess = Math.abs(rawTranslation) - resistanceThreshold;
            const resistance = resistanceThreshold + (excess * 120) / (excess + 120);
            translation = rawTranslation > 0 ? resistance : -resistance;
          }

          translation = Math.max(-maxTranslation, Math.min(maxTranslation, translation));
          translateX.set(translation);
          const progress = Math.abs(translation) / maxTranslation;
          opacity.set(interpolate(progress, [0, 0.7, 1], [1, 0.92, 0.85], "clamp"));
          scale.set(interpolate(progress, [0, 1], [1, 0.98], "clamp"));
        })
        .onEnd((event) => {
          "worklet";
          if (Math.abs(event.translationX) > 75) {
            runOnJS(event.translationX < 0 ? goToNextDate : goToPreviousDate)();
          }
          translateX.set(withSpring(0, { damping: 20, stiffness: 100, overshootClamping: true }));
          opacity.set(withSpring(1, { damping: 20, stiffness: 100, overshootClamping: true }));
          scale.set(withSpring(1, { damping: 20, stiffness: 100, overshootClamping: true }));
        })
        .onFinalize(() => {
          "worklet";
          translateX.set(withSpring(0, { damping: 20, stiffness: 100, overshootClamping: true }));
          opacity.set(withSpring(1));
          scale.set(withSpring(1));
        }),
    [goToNextDate, goToPreviousDate, opacity, scale, translateX],
  );

  return { gesture, animatedStyle };
}

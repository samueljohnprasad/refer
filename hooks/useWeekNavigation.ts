import { useCallback, useMemo, useRef } from 'react';
import { Animated, PanResponder, type GestureResponderHandlers } from 'react-native';
import { addDays } from 'date-fns';

// Generic SetStateAction type compatible with React/Jotai setters
export type SetStateAction<T> = T | ((prev: T) => T);

export interface UseWeekNavigationOptions {
  // Setter for the current week view (e.g., Jotai atom setter)
  setCurrentWeek: (update: SetStateAction<Date>) => void;
  // Animation and gesture tuning
  durationEnterMs?: number; // duration for the initial slide left/right
  durationReturnMs?: number; // duration for snapping back to center
  swipeTriggerDx?: number; // distance threshold to trigger week change
  slideDivisor?: number; // divisor to reduce dx effect in onPanResponderMove
}

export interface UseWeekNavigationResult {
  weekSlideAnim: Animated.Value;
  panHandlers: GestureResponderHandlers;
  goToPreviousWeek: () => void;
  goToNextWeek: () => void;
}

/**
 * Encapsulates week navigation logic (animations + swipe gestures) for a weekly calendar header.
 * Keeps component files lean and enforces reuse.
 */
export const useWeekNavigation = (
  options: UseWeekNavigationOptions
): UseWeekNavigationResult => {
  const {
    setCurrentWeek,
    durationEnterMs = 400,
    durationReturnMs = 300,
    swipeTriggerDx = 50,
    slideDivisor = 50,
  } = options;

  const weekSlideAnim = useRef(new Animated.Value(0)).current;

  const goToPreviousWeek = useCallback(() => {
    Animated.timing(weekSlideAnim, {
      toValue: -1,
      duration: durationEnterMs,
      useNativeDriver: false,
    }).start(() => {
      setCurrentWeek((prev: Date) => addDays(prev, -7));
      Animated.timing(weekSlideAnim, {
        toValue: 0,
        duration: durationReturnMs,
        useNativeDriver: false,
      }).start();
    });
  }, [durationEnterMs, durationReturnMs, setCurrentWeek, weekSlideAnim]);

  const goToNextWeek = useCallback(() => {
    Animated.timing(weekSlideAnim, {
      toValue: 1,
      duration: durationEnterMs,
      useNativeDriver: false,
    }).start(() => {
      setCurrentWeek((prev: Date) => addDays(prev, 7));
      Animated.timing(weekSlideAnim, {
        toValue: 0,
        duration: durationReturnMs,
        useNativeDriver: false,
      }).start();
    });
  }, [durationEnterMs, durationReturnMs, setCurrentWeek, weekSlideAnim]);

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, gestureState) =>
          Math.abs(gestureState.dx) > 10,
        onPanResponderMove: (_, gestureState) => {
          weekSlideAnim.setValue(gestureState.dx / slideDivisor);
        },
        onPanResponderRelease: (_, gestureState) => {
          if (gestureState.dx < -swipeTriggerDx) {
            goToNextWeek();
          } else if (gestureState.dx > swipeTriggerDx) {
            goToPreviousWeek();
          } else {
            Animated.spring(weekSlideAnim, {
              toValue: 0,
              useNativeDriver: false,
              friction: 6,
            }).start();
          }
        },
      }),
    [goToNextWeek, goToPreviousWeek, slideDivisor, swipeTriggerDx, weekSlideAnim]
  );

  return {
    weekSlideAnim,
    panHandlers: panResponder.panHandlers,
    goToPreviousWeek,
    goToNextWeek,
  };
};

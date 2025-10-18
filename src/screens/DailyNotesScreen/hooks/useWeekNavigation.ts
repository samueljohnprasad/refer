import { useCallback, useMemo } from 'react';
import { PanResponder, type GestureResponderHandlers } from 'react-native';
import { addDays, differenceInCalendarWeeks, isSameWeek } from 'date-fns';
import { useSharedValue, withTiming, runOnJS, type SharedValue } from 'react-native-reanimated';

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
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6; // for week calculations (default Sunday)
}

export interface UseWeekNavigationResult {
  weekSlideAnim: SharedValue<number>;
  panHandlers: GestureResponderHandlers;
  goToPreviousWeek: () => Promise<void>;
  goToNextWeek: () => Promise<void>;
  animateToWeekOf: (targetDate: Date, currentWeek: Date) => Promise<void>;
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
    durationReturnMs = 100,
    swipeTriggerDx = 50,
    slideDivisor = 50,
    weekStartsOn = 0,
  } = options;

  const weekSlideAnim = useSharedValue<number>(0);

  // Update helper defined on JS thread to avoid passing functions through runOnJS
  const updateWeekByDelta = useCallback((deltaDays: number): void => {
    setCurrentWeek((prev: Date) => addDays(prev, deltaDays));
  }, [setCurrentWeek]);

  const animateStep = useCallback((toValue: number, deltaDays: number): Promise<void> => {
    return new Promise((resolve) => {
      weekSlideAnim.value = withTiming(toValue, { duration: durationEnterMs }, (finished?: boolean) => {
        if (finished) {
          runOnJS(updateWeekByDelta)(deltaDays);
          weekSlideAnim.value = withTiming(0, { duration: durationReturnMs }, () => {
            runOnJS(resolve)();
          });
        } else {
          runOnJS(resolve)();
        }
      });
    });
  }, [durationEnterMs, durationReturnMs, updateWeekByDelta, weekSlideAnim]);

  const goToPreviousWeek = useCallback(() => animateStep(-1, -7), [animateStep]);
  const goToNextWeek = useCallback(() => animateStep(1, 7), [animateStep]);

  const animateToWeekOf = useCallback(async (targetDate: Date, currentWeek: Date): Promise<void> => {
    if (isSameWeek(currentWeek, targetDate, { weekStartsOn })) return;
    const diff = differenceInCalendarWeeks(targetDate, currentWeek, { weekStartsOn });
    const steps = Math.abs(diff);
    const stepFn = diff > 0 ? goToNextWeek : goToPreviousWeek;
    for (let i = 0; i < steps; i += 1) {
      // await each step to maintain smooth sequential animation
      // eslint-disable-next-line no-await-in-loop
      await stepFn();
    }
  }, [goToNextWeek, goToPreviousWeek, weekStartsOn]);

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, gestureState) =>
          Math.abs(gestureState.dx) > 10,
        onPanResponderMove: (_, gestureState) => {
          weekSlideAnim.value = gestureState.dx / slideDivisor;
        },
        onPanResponderRelease: (_, gestureState) => {
          if (gestureState.dx < -swipeTriggerDx) {
            goToNextWeek();
          } else if (gestureState.dx > swipeTriggerDx) {
            goToPreviousWeek();
          } else {
            weekSlideAnim.value = withTiming(0, { duration: durationReturnMs });
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
    animateToWeekOf,
  };
};

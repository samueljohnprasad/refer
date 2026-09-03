import { useState } from 'react';
import {
  runOnJS,
  useSharedValue,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';
import { Gesture } from 'react-native-gesture-handler';

export interface CalendarExpandOptions {
  expandedHeight?: number; // used to normalize drag delta
  snapThreshold?: number; // 0..1
  durationMs?: number;
  initialExpanded?: boolean;
}

export interface CalendarExpandApi {
  progress: SharedValue<number>; // 0 collapsed -> 1 expanded
  isExpanded: boolean;
  expand: (onDone?: () => void) => void;
  collapse: (onDone?: () => void) => void;
  toggle: (onDone?: () => void) => void;
  gesture: ReturnType<typeof Gesture.Pan>;
}

const DEFAULTS: Required<Omit<CalendarExpandOptions, 'initialExpanded'>> = {
  expandedHeight: 360,
  snapThreshold: 0.35,
  durationMs: 500,
};

export function useCalendarExpandReanimated(
  options?: CalendarExpandOptions
): CalendarExpandApi {
  const { expandedHeight, snapThreshold, durationMs } = {
    ...DEFAULTS,
    ...(options || {}),
  };

  const [isExpanded, setIsExpanded] = useState<boolean>(!!options?.initialExpanded);
  const progress = useSharedValue<number>(options?.initialExpanded ? 1 : 0);
  const start = useSharedValue<number>(options?.initialExpanded ? 1 : 0);

  const finishExpand = (onDone?: () => void) => {
    setIsExpanded(true);
    if (onDone) onDone();
  };

  const finishCollapse = (onDone?: () => void) => {
    setIsExpanded(false);
    if (onDone) onDone();
  };

  const expand = (onDone?: () => void): void => {
    progress.value = withTiming(1, { duration: durationMs }, (finished?: boolean) => {
      if (finished) {
        runOnJS(finishExpand)(onDone);
      }
    });
  };

  const collapse = (onDone?: () => void): void => {
    progress.value = withTiming(0, { duration: durationMs }, (finished?: boolean) => {
      if (finished) {
        runOnJS(finishCollapse)(onDone);
      }
    });
  };

  const toggle = (onDone?: () => void): void => {
    const to = progress.value >= 0.5 ? 0 : 1;
    if (to === 1) expand(onDone);
    else collapse(onDone);
  };

  const gesture = Gesture.Pan()
    .onStart(() => {
      start.value = progress.value;
    })
    .onUpdate((e) => {
      const delta = e.translationY / expandedHeight; // positive when dragging down
      let next = start.value + delta;
      if (next < 0) next = 0;
      if (next > 1) next = 1;
      progress.value = next;
    })
    .onEnd(() => {
      if (progress.value > snapThreshold) runOnJS(expand)();
      else runOnJS(collapse)();
    });

  return { progress, isExpanded, expand, collapse, toggle, gesture };
}

export default useCalendarExpandReanimated;

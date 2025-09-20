import { useCallback, useMemo, useRef, useState } from 'react';
import { Animated, PanResponder, PanResponderGestureState, PanResponderInstance } from 'react-native';

export interface CalendarDragConfig {
  expandedHeight?: number;
  snapThreshold?: number; // between 0 and 1
  initialExpanded?: boolean;
  animationDurationMs?: number;
}

export interface CalendarDragHook {
  progress: Animated.Value; // 0 -> collapsed (week), 1 -> expanded (month)
  isExpanded: boolean;
  panHandlers: PanResponderInstance['panHandlers'];
  expand: (onDone?: () => void) => void;
  collapse: (onDone?: () => void) => void;
  toggle: (onDone?: () => void) => void;
}

const DEFAULTS: Required<Omit<CalendarDragConfig, 'initialExpanded'>> = {
  expandedHeight: 340,
  snapThreshold: 0.3,
  animationDurationMs: 260,
};

export function useCalendarExpandDrag(config?: CalendarDragConfig): CalendarDragHook {
  const { expandedHeight, snapThreshold, animationDurationMs } = {
    ...DEFAULTS,
    ...(config || {}),
  };

  const [isExpanded, setIsExpanded] = useState<boolean>(!!config?.initialExpanded);
  const progress = useRef(new Animated.Value(!!config?.initialExpanded ? 1 : 0)).current;
  const startProgressRef = useRef<number>(!!config?.initialExpanded ? 1 : 0);

  const clamp = (val: number, min: number, max: number): number => Math.max(min, Math.min(max, val));

  const animateTo = useCallback(
    (toValue: number, onDone?: () => void) => {
      Animated.timing(progress, {
        toValue,
        duration: animationDurationMs,
        useNativeDriver: false, // height interpolation uses layout values; keep false
      }).start(() => {
        setIsExpanded(toValue === 1);
        onDone?.();
      });
    },
    [animationDurationMs, progress]
  );

  const expand = useCallback((onDone?: () => void) => animateTo(1, onDone), [animateTo]);
  const collapse = useCallback((onDone?: () => void) => animateTo(0, onDone), [animateTo]);
  const toggle = useCallback((onDone?: () => void) => {
    progress.stopAnimation((val) => {
      if (val >= 0.5) {
        collapse(onDone);
      } else {
        expand(onDone);
      }
    });
  }, [collapse, expand, progress]);

  const handleMove = useCallback(
    (_: unknown, gesture: PanResponderGestureState) => {
      const dy = gesture.dy; // positive when dragging down
      const delta = dy / expandedHeight;
      const next = clamp(startProgressRef.current + delta, 0, 1);
      progress.setValue(next);
    },
    [expandedHeight, progress]
  );

  const handleRelease = useCallback(
    () => {
      progress.stopAnimation((val) => {
        if (val > snapThreshold) {
          animateTo(1);
        } else {
          animateTo(0);
        }
      });
    },
    [animateTo, progress, snapThreshold]
  );

  const panResponder = useMemo(() =>
    PanResponder.create({
      onMoveShouldSetPanResponder: (_evt, g) => Math.abs(g.dy) > Math.abs(g.dx) && Math.abs(g.dy) > 4,
      onPanResponderGrant: () => {
        progress.stopAnimation((val) => {
          startProgressRef.current = typeof val === 'number' ? val : 0;
        });
      },
      onPanResponderMove: handleMove,
      onPanResponderRelease: handleRelease,
      onPanResponderTerminate: handleRelease,
      onPanResponderTerminationRequest: () => false,
    }),
  [handleMove, handleRelease, progress]);

  return {
    progress,
    isExpanded,
    panHandlers: panResponder.panHandlers,
    expand,
    collapse,
    toggle,
  };
}

export default useCalendarExpandDrag;

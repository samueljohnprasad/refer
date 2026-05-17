import { useCallback, useEffect, useMemo } from "react";
import { Gesture } from "react-native-gesture-handler";
import {
  runOnJS,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import type { HappyAssistantPosition } from "@/src/store/slices/happyAssistantSlice";
import {
  ASSISTANT_BOTTOM_CLEARANCE,
  ASSISTANT_BUTTON_SIZE,
  ASSISTANT_EDGE_MARGIN,
  ASSISTANT_TAP_DISTANCE,
} from "./constants";

const DEFAULT_ASSISTANT_Y_RATIO = 0.42;
const DIMMED_ASSISTANT_OPACITY = 0.42;
const DRAG_START_DISTANCE = ASSISTANT_TAP_DISTANCE + 1;
const SNAP_SPRING_CONFIG = {
  damping: 18,
  stiffness: 170,
  mass: 0.8,
} as const;
const PRESS_SPRING_CONFIG = {
  damping: 18,
  stiffness: 220,
} as const;

interface AssistantButtonBounds {
  maxX: number;
  minY: number;
  maxY: number;
  defaultY: number;
}

interface UseFloatingAssistantButtonMotionInput {
  isDimmed: boolean;
  position: HappyAssistantPosition | null;
  windowWidth: number;
  windowHeight: number;
  safeAreaTop: number;
  safeAreaBottom: number;
  onOpen: () => void;
  onPositionChange: (position: HappyAssistantPosition) => void;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function getAssistantButtonBounds({
  windowWidth,
  windowHeight,
  safeAreaTop,
  safeAreaBottom,
}: {
  windowWidth: number;
  windowHeight: number;
  safeAreaTop: number;
  safeAreaBottom: number;
}): AssistantButtonBounds {
  const maxX = Math.max(
    ASSISTANT_EDGE_MARGIN,
    windowWidth - ASSISTANT_BUTTON_SIZE - ASSISTANT_EDGE_MARGIN,
  );
  const minY = safeAreaTop + ASSISTANT_EDGE_MARGIN;
  const maxY = Math.max(
    minY,
    windowHeight -
      safeAreaBottom -
      ASSISTANT_BUTTON_SIZE -
      ASSISTANT_BOTTOM_CLEARANCE,
  );
  const defaultY = clamp(
    windowHeight * DEFAULT_ASSISTANT_Y_RATIO,
    minY,
    maxY,
  );

  return {
    maxX,
    minY,
    maxY,
    defaultY,
  };
}

function resolveAssistantPosition(
  position: HappyAssistantPosition | null,
  bounds: AssistantButtonBounds,
): HappyAssistantPosition {
  return {
    x: clamp(position?.x ?? bounds.maxX, ASSISTANT_EDGE_MARGIN, bounds.maxX),
    y: clamp(position?.y ?? bounds.defaultY, bounds.minY, bounds.maxY),
  };
}

export function useFloatingAssistantButtonMotion({
  isDimmed,
  position,
  windowWidth,
  windowHeight,
  safeAreaTop,
  safeAreaBottom,
  onOpen,
  onPositionChange,
}: UseFloatingAssistantButtonMotionInput) {
  const bounds = useMemo(
    () =>
      getAssistantButtonBounds({
        windowWidth,
        windowHeight,
        safeAreaTop,
        safeAreaBottom,
      }),
    [safeAreaBottom, safeAreaTop, windowHeight, windowWidth],
  );
  const resolvedPosition = useMemo(
    () => resolveAssistantPosition(position, bounds),
    [bounds, position?.x, position?.y],
  );
  const x = useSharedValue(resolvedPosition.x);
  const y = useSharedValue(resolvedPosition.y);
  const startX = useSharedValue(resolvedPosition.x);
  const startY = useSharedValue(resolvedPosition.y);
  const scale = useSharedValue(1);
  const opacity = useDerivedValue(
    () =>
      withSpring(
        isDimmed ? DIMMED_ASSISTANT_OPACITY : 1,
        PRESS_SPRING_CONFIG,
      ),
    [isDimmed],
  );

  const savePosition = useCallback(
    (nextX: number, nextY: number): void => {
      onPositionChange({ x: nextX, y: nextY });
    },
    [onPositionChange],
  );

  const snapToEdge = useCallback(
    (currentX: number, currentY: number): void => {
      "worklet";

      const nextX =
        currentX + ASSISTANT_BUTTON_SIZE / 2 < windowWidth / 2
          ? ASSISTANT_EDGE_MARGIN
          : bounds.maxX;
      const nextY = Math.min(Math.max(currentY, bounds.minY), bounds.maxY);

      x.set(withSpring(nextX, SNAP_SPRING_CONFIG));
      y.set(withSpring(nextY, SNAP_SPRING_CONFIG));

      runOnJS(savePosition)(nextX, nextY);
    },
    [bounds.maxX, bounds.maxY, bounds.minY, savePosition, windowWidth, x, y],
  );

  useEffect(() => {
    x.set(withSpring(resolvedPosition.x));
    y.set(withSpring(resolvedPosition.y));
  }, [resolvedPosition.x, resolvedPosition.y, x, y]);

  const panGesture = useMemo(
    () =>
      Gesture.Pan()
        .minDistance(DRAG_START_DISTANCE)
        .onBegin(() => {
          scale.set(withSpring(0.92, PRESS_SPRING_CONFIG));
          startX.set(x.get());
          startY.set(y.get());
        })
        .onUpdate((event) => {
          x.set(startX.get() + event.translationX);
          y.set(startY.get() + event.translationY);
        })
        .onEnd(() => {
          scale.set(withSpring(1, PRESS_SPRING_CONFIG));
          snapToEdge(x.get(), y.get());
        })
        .onFinalize(() => {
          scale.set(withSpring(1, PRESS_SPRING_CONFIG));
        }),
    [scale, snapToEdge, startX, startY, x, y],
  );

  const tapGesture = useMemo(
    () =>
      Gesture.Tap()
        .maxDistance(ASSISTANT_TAP_DISTANCE)
        .onBegin(() => {
          scale.set(withSpring(0.94, PRESS_SPRING_CONFIG));
        })
        .onEnd((_event, success) => {
          if (success) {
            runOnJS(onOpen)();
          }
        })
        .onFinalize(() => {
          scale.set(withSpring(1, PRESS_SPRING_CONFIG));
        }),
    [onOpen, scale],
  );

  const assistantGesture = useMemo(
    () => Gesture.Race(tapGesture, panGesture),
    [panGesture, tapGesture],
  );

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.get(),
    transform: [
      { translateX: x.get() },
      { translateY: y.get() },
      { scale: scale.get() },
    ],
  }));

  return {
    assistantGesture,
    animatedStyle,
  };
}

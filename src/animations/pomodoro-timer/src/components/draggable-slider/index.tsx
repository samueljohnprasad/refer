import React, { useImperativeHandle } from 'react';
import { Dimensions, StyleSheet, View, useWindowDimensions } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  cancelAnimation,
  interpolate,
  runOnJS,
  useAnimatedReaction,
  useDerivedValue,
  useSharedValue,
  withDecay,
  withTiming,
} from 'react-native-reanimated';

import { useTimer } from './hooks/useTimer';
import type { DraggableSliderProps } from './types';
import { TickLine } from './components/tick-line';

export type CircularDraggableSliderRefType = {
  resetTimer: () => void;
  runTimer: (to: number) => void;
  stopTimer: () => void;
};

// This one was really challening :)
// The idea is to use a custom pan gesture handler to handle the drag event and update the progress value accordingly.
// Once the user drags, the progress gets converted to radians and then to seconds.

export const CircularDraggableSlider = React.forwardRef<
  CircularDraggableSliderRefType,
  DraggableSliderProps
>(
  (
    {
      linesAmount,
      maxLineHeight,
      minLineHeight,
      bigLineIndexOffset = 10,
      lineWidth = 1.5,
      onProgressChange,
      indicatorColor,
      lineColor = '#c6c6c6',
      bigLineColor = '#c6c6c6',
      onCompletion,
      radius = 280,
      containerMode = 'fullscreen',
    },
    ref,
  ) => {
    const { height: WindowHeight } = useWindowDimensions();
    const progress = useSharedValue(0);
    const previousProgress = useSharedValue(0);

    const distanceBetweenTwoTicksRad = (2 * Math.PI) / linesAmount;
    const diameter = 2 * Math.PI * radius;
    const distanceBetweenTwoTicks = diameter / linesAmount;
    const listWidth = diameter;

    const { runTimer, stopTimer, resetTimer, isTimerEnabled } = useTimer({
      progress,
      incrementOffset: distanceBetweenTwoTicks,
      onCompletion: () => {
        isTimerEnabled.value = false;
        onCompletion?.();
      },
    });

    useImperativeHandle(ref, () => {
      return {
        resetTimer,
        runTimer,
        stopTimer,
      };
    }, [resetTimer, runTimer, stopTimer]);

    const panGesture = Gesture.Pan()
      .onBegin(() => {
        if (isTimerEnabled.value) {
          return;
        }
        cancelAnimation(progress);
        previousProgress.value = progress.value;
      })
      .onUpdate(event => {
        if (isTimerEnabled.value) {
          return;
        }
        progress.value = event.translationX + previousProgress.value;
      })
      .onFinalize(event => {
        if (isTimerEnabled.value) {
          return;
        }
        if (progress.value > 0) {
          cancelAnimation(progress);
          progress.value = withTiming(0, { duration: 500 });
          return;
        }
        progress.value = withDecay({
          velocity: event.velocityX,
        });
      });

    const offset = Math.PI / 2;
    const progressRadiants = useDerivedValue(() => {
      return interpolate(
        -progress.value,
        [0, listWidth],
        [offset, 2 * Math.PI + offset],
      );
    }, [listWidth]);

    useAnimatedReaction(
      () => progressRadiants.value,
      radiants => {
        const amountOfSeconds = Math.round(
          (radiants - offset) / distanceBetweenTwoTicksRad,
        );
        if (onProgressChange) {
          runOnJS(onProgressChange)(amountOfSeconds);
        }
      },
    );

    return (
      <View style={containerMode === 'inline' ? [styles.inlineContainer, { width: radius * 2, height: radius * 2 }] : styles.container}>
        <View
          pointerEvents="none"
          style={[
            {
              position: 'absolute',
              justifyContent: 'center',
              alignItems: 'center',
              height: radius * 2,
              width: radius * 2,
              transform: containerMode === 'inline' ? [] : [
                {
                  translateY: WindowHeight / 2 - radius / 2,
                },
              ],
            },
          ]}>
          <View
            style={{
              position: 'absolute',
              top: -maxLineHeight / 2,
              zIndex: 10,
              height: maxLineHeight * 1.2,
              width: lineWidth * 2,
              backgroundColor: indicatorColor,
            }}
          />
          <Animated.View pointerEvents="none">
            {new Array(linesAmount).fill(0).map((_, index) => {
              const isBigLine = index % bigLineIndexOffset === 0;
              const height = isBigLine ? maxLineHeight : minLineHeight;
              const color = isBigLine ? bigLineColor : lineColor;

              return (
                <TickLine
                  disabled={isTimerEnabled}
                  key={index}
                  height={height}
                  radius={radius}
                  progressRadiants={progressRadiants}
                  index={index}
                  lineWidth={lineWidth}
                  color={color}
                  linesAmount={linesAmount}
                />
              );
            })}
          </Animated.View>
        </View>
        <GestureDetector gesture={panGesture}>
          <Animated.View
            style={[
              containerMode === 'inline'
                ? { width: radius * 2, height: radius * 2, position: 'absolute' }
                : { height: WindowHeight / 2, ...styles.timer },
            ]}
          />
        </GestureDetector>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inlineContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    alignSelf: 'center',
  },
  timer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
});

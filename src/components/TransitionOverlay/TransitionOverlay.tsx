import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Canvas, Group, Rect, Skia } from '@shopify/react-native-skia';
import Animated, { 
  useSharedValue, 
  useDerivedValue, 
  withTiming, 
  runOnJS, 
  Easing, 
  withDelay 
} from 'react-native-reanimated';
import { useAtomValue, useSetAtom } from 'jotai';
import { transitionAtom, endTransitionAtom } from '@/src/store/transitionStore';

const { width, height } = Dimensions.get('window');
// Calculate the maximum radius needed to cover the entire screen from any corner
const MAX_RADIUS = Math.sqrt(width * width + height * height);

export const TransitionOverlay = () => {
  const { isActive, cx, cy, color, duration, isReversing, onComplete } = useAtomValue(transitionAtom);
  const endTransition = useSetAtom(endTransitionAtom);

  const radius = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (isActive) {
      const activeDuration = duration || 400;

      if (isReversing) {
        // Start fully opaque and full screen
        opacity.value = 1;
        radius.value = MAX_RADIUS;
        
        // Shrink the circle down to 0
        radius.value = withTiming(
          0,
          { duration: activeDuration, easing: Easing.inOut(Easing.ease) },
          (finished) => {
            if (finished) {
              if (onComplete) runOnJS(onComplete)();
              
              // Fade out instantly since the circle is already 0 radius
              opacity.value = 0;
              runOnJS(endTransition)();
            }
          }
        );
      } else {
        // Animate the opacity so it fades in
        opacity.value = withTiming(1, { duration: activeDuration / 2 });
        
        // Animate the circle growing to fill the screen
        radius.value = withTiming(
          MAX_RADIUS,
          { duration: activeDuration, easing: Easing.inOut(Easing.ease) },
          (finished) => {
            if (finished) {
              // Once the screen is filled, trigger the actual navigation
              if (onComplete) {
                runOnJS(onComplete)();
              }
              
              // Wait slightly for the new screen to render behind it, 
              // then fade the overlay out
              opacity.value = withDelay(
                150, 
                withTiming(0, { duration: 300 }, (finishedFade) => {
                  if (finishedFade) {
                    // Reset state so it's ready for the next transition
                    runOnJS(endTransition)();
                    radius.value = 0;
                  }
                })
              );
            }
          }
        );
      }
    }
  }, [isActive, isReversing, onComplete, endTransition, opacity, radius]);

  const clipPath = useDerivedValue(() => {
    const path = Skia.Path.Make();
    path.addCircle(cx, cy, radius.value);
    return path;
  }, [cx, cy, radius]);

  if (!isActive && opacity.value === 0) {
    return null;
  }

  return (
    <View 
      style={[StyleSheet.absoluteFill, { zIndex: 99999 }]} 
      pointerEvents={isActive ? "auto" : "none"}
    >
      <Animated.View style={[StyleSheet.absoluteFill, { opacity }]}>
        <Canvas style={StyleSheet.absoluteFill} pointerEvents="none">
          <Group clip={clipPath}>
            <Rect x={0} y={0} width={width} height={height} color={color} />
          </Group>
        </Canvas>
      </Animated.View>
    </View>
  );
};

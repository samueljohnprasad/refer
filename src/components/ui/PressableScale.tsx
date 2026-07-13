/**
 * PressableScale
 *
 * Drop-in replacement for TouchableOpacity that provides a spring scale-down
 * press animation with optional haptic feedback. This is the single source of
 * truth for interactive touch feedback across the app.
 *
 * @example
 * <PressableScale onPress={handlePress} scale={0.95}>
 *   <Text>Tap me</Text>
 * </PressableScale>
 */

import React, { useCallback } from 'react';
import {
  GestureResponderEvent,
  Pressable,
  PressableProps,
  StyleProp,
  ViewStyle,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { SPRING_SNAPPY } from '@/src/utils/motionTokens';
import { useReducedMotion } from '@/src/hooks/useReducedMotion';

type HapticStyle = 'none' | 'light' | 'medium' | 'heavy';

interface PressableScaleProps extends Omit<PressableProps, 'style'> {
  /** Target scale when pressed. Default: 0.96 */
  scale?: number;
  /** Haptic feedback intensity on press-in. Default: 'light' */
  hapticStyle?: HapticStyle;
  /** Optional style override */
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
}

const HAPTIC_MAP: Record<HapticStyle, () => Promise<void>> = {
  none: () => Promise.resolve(),
  light: () => Haptics.selectionAsync(),
  medium: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium),
  heavy: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy),
};

export const PressableScale: React.FC<PressableScaleProps> = ({
  scale = 0.96,
  hapticStyle = 'light',
  style,
  onPress,
  onPressIn,
  onPressOut,
  children,
  ...rest
}) => {
  const reducedMotion = useReducedMotion();
  const scaleValue = useSharedValue<number>(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleValue.value }],
  }));

  const handlePressIn = useCallback(
    (e: GestureResponderEvent) => {
      if (!reducedMotion) {
        scaleValue.value = withSpring(scale, SPRING_SNAPPY);
      }
      HAPTIC_MAP[hapticStyle]();
      onPressIn?.(e);
    },
    [scale, hapticStyle, reducedMotion, onPressIn, scaleValue],
  );

  const handlePressOut = useCallback(
    (e: GestureResponderEvent) => {
      if (!reducedMotion) {
        scaleValue.value = withSpring(1, SPRING_SNAPPY);
      }
      onPressOut?.(e);
    },
    [reducedMotion, onPressOut, scaleValue],
  );

  return (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
      {...rest}
    >
      <Animated.View style={[animatedStyle, style]}>{children}</Animated.View>
    </Pressable>
  );
};

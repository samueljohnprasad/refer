import React from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, SharedValue, interpolate, Extrapolation } from 'react-native-reanimated';

interface HappyRippleProps {
  progress: SharedValue<number>;
  color?: string;
}

export function HappyRipple({ progress, color = 'rgba(255, 255, 255, 0.5)' }: HappyRippleProps) {
  const rippleStyle = useAnimatedStyle(() => {
    const scale = interpolate(progress.value, [0, 1], [0.5, 3], Extrapolation.CLAMP);
    const opacity = interpolate(progress.value, [0, 0.8, 1], [1, 0.5, 0], Extrapolation.CLAMP);
    
    return {
      transform: [{ scale }],
      opacity,
    };
  });

  return (
    <View style={[StyleSheet.absoluteFill, { justifyContent: 'center', alignItems: 'center' }]} pointerEvents="none">
      <Animated.View 
        style={[
          {
            width: 150,
            height: 150,
            borderRadius: 75,
            backgroundColor: color,
          },
          rippleStyle
        ]}
      />
    </View>
  );
}

import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withDelay,
  Easing,
} from "react-native-reanimated";

interface ParticleProps {
  delay: number;
  startX: number;
  duration: number;
}

const Particle = ({ delay, startX, duration }: ParticleProps) => {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withDelay(
      delay,
      withRepeat(
        withTiming(1, { duration, easing: Easing.out(Easing.quad) }),
        -1, // Infinite repeat
        false
      )
    );
  }, [delay, duration, progress]);

  const style = useAnimatedStyle(() => {
    const y = progress.value * -80; // Float up 80px
    // Gentle sine wave wobble for X
    const x = startX + Math.sin(progress.value * Math.PI * 4) * 15;
    
    // Opacity fades in slightly, then fades out completely
    let opacity = 0;
    if (progress.value > 0) {
      if (progress.value < 0.2) opacity = (progress.value / 0.2) * 0.25; // fade in to 25% max
      else opacity = 0.25 * (1 - (progress.value - 0.2) / 0.8); // fade out slowly
    }

    return {
      opacity,
      transform: [
        { translateX: x },
        { translateY: y },
        { scale: 1 - progress.value * 0.5 }, // Shrink slightly as it rises
      ],
    };
  });

  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          width: 8,
          height: 8,
          borderRadius: 4,
          backgroundColor: "#FFFFFF",
          top: "50%",
          left: "50%",
          marginLeft: -4,
          marginTop: -4,
        },
        style,
      ]}
    />
  );
};

export const ResidualHeatParticles = () => {
  // Generate particles with staggered delays so they don't spawn all at once
  const particles = [
    { id: 1, startX: -25, delay: 0, duration: 4000 },
    { id: 2, startX: 15, delay: 1200, duration: 4500 },
    { id: 3, startX: -10, delay: 2400, duration: 5500 },
    { id: 4, startX: 25, delay: 800, duration: 4800 },
    { id: 5, startX: 5, delay: 3200, duration: 4200 },
    { id: 6, startX: -20, delay: 1800, duration: 5000 },
  ];

  return (
    <View style={[StyleSheet.absoluteFill, { overflow: "visible" }]} pointerEvents="none">
      {particles.map((p) => (
        <Particle key={p.id} startX={p.startX} delay={p.delay} duration={p.duration} />
      ))}
    </View>
  );
};

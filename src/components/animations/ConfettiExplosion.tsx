import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withDelay,
  withSequence,
  Easing,
  interpolate,
  runOnJS,
} from "react-native-reanimated";

interface ConfettiExplosionProps {
  isVisible: boolean;
  count?: number;
  duration?: number;
  onAnimationComplete?: () => void;
}

const COLORS = [
  "#9B8FD9",
  "#7B61FF",
  "#FF8C42",
  "#5B9FED",
  "#FFD24A",
  "#7ED9C4",
];

export const ConfettiExplosion: React.FC<ConfettiExplosionProps> = ({
  isVisible,
  count = 20,
  duration = 800,
  onAnimationComplete,
}) => {
  const [particles] = React.useState(() =>
    Array.from({ length: count }).map((_, i) => ({
      id: i,
      angle: (Math.PI * 2 * i) / count, // Distribute evenly
      distance: 40 + Math.random() * 40, // Random distance
      size: 4 + Math.random() * 4, // Random size
      color: COLORS[i % COLORS.length],
      delay: Math.random() * 100,
    }))
  );

  if (!isVisible) return null;

  return (
    <View style={styles.container} pointerEvents="none">
      {particles.map((particle) => (
        <Particle
          key={particle.id}
          particle={particle}
          duration={duration}
          onComplete={particle.id === 0 ? onAnimationComplete : undefined}
        />
      ))}
    </View>
  );
};

interface ParticleProps {
  particle: {
    id: number;
    angle: number;
    distance: number;
    size: number;
    color: string;
    delay: number;
  };
  duration: number;
  onComplete?: () => void;
}

const Particle: React.FC<ParticleProps> = ({
  particle,
  duration,
  onComplete,
}) => {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withDelay(
      particle.delay,
      withSequence(
        withTiming(1, { duration, easing: Easing.out(Easing.quad) }),
        withTiming(1, {}, (finished) => {
          if (finished && onComplete) {
            runOnJS(onComplete)();
          }
        })
      )
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    const x = Math.cos(particle.angle) * particle.distance * progress.value;
    const y = Math.sin(particle.angle) * particle.distance * progress.value;
    const opacity = interpolate(progress.value, [0, 0.7, 1], [1, 1, 0]);
    const scale = interpolate(progress.value, [0, 0.5, 1], [0, 1, 0]);

    return {
      opacity,
      transform: [{ translateX: x }, { translateY: y }, { scale }],
    };
  });

  return (
    <Animated.View
      style={[
        styles.particle,
        {
          width: particle.size,
          height: particle.size,
          backgroundColor: particle.color,
          borderRadius: particle.size / 2,
        },
        animatedStyle,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
  },
  particle: {
    position: "absolute",
  },
});

import React, { useEffect, useMemo } from "react";
import { View, StyleSheet } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
  interpolate,
  runOnJS,
  cancelAnimation,
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

interface ParticleData {
  id: number;
  angle: number;
  distance: number;
  size: number;
  color: string;
}

const generateParticles = (count: number): ParticleData[] =>
  Array.from({ length: count }).map((_, i) => ({
    id: i,
    angle: (Math.PI * 2 * i) / count,
    distance: 40 + Math.random() * 40,
    size: 4 + Math.random() * 4,
    color: COLORS[i % COLORS.length],
  }));

// ponytail: single memoized particle observing shared progress prevents desynced view unmounts
const Particle: React.FC<{
  particle: ParticleData;
  progress: Animated.SharedValue<number>;
}> = React.memo(({ particle, progress }) => {
  const animatedStyle = useAnimatedStyle(() => {
    const p = progress.value;
    const x = Math.cos(particle.angle) * particle.distance * p;
    const y = Math.sin(particle.angle) * particle.distance * p;
    const opacity = interpolate(p, [0, 0.7, 1], [1, 1, 0]);
    const scale = interpolate(p, [0, 0.5, 1], [0, 1, 0]);

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
});

export const ConfettiExplosion: React.FC<ConfettiExplosionProps> = ({
  isVisible,
  count = 20,
  duration = 800,
  onAnimationComplete,
}) => {
  // ponytail: one master shared value drives all particles; cancels cleanly on unmount in Fabric
  const progress = useSharedValue(0);
  const particles = useMemo(() => generateParticles(count), [count]);

  useEffect(() => {
    if (!isVisible) {
      cancelAnimation(progress);
      progress.value = 0;
      return;
    }

    const onFinish = (finished?: boolean) => {
      'worklet';
      if (finished && onAnimationComplete) {
        runOnJS(onAnimationComplete)();
      }
    };

    progress.value = 0;
    progress.value = withTiming(
      1,
      { duration, easing: Easing.out(Easing.quad) },
      onFinish
    );

    return () => {
      // ponytail: cancel native UI animation before Fabric unmounts views
      cancelAnimation(progress);
    };
  }, [isVisible, duration, onAnimationComplete, progress]);

  if (!isVisible) return null;

  return (
    <View style={styles.container} pointerEvents="none">
      {particles.map((particle) => (
        <Particle key={particle.id} particle={particle} progress={progress} />
      ))}
    </View>
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

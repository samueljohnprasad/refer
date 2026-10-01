import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
  Easing,
  interpolate,
} from "react-native-reanimated";

const FLAME_COLORS = ["#FF7A3D", "#FFB03B", "#FFD24A", "#FF5C2E"];

interface FlameBurstProps {
  /** Delay (ms) before the burst fires. */
  delay?: number;
  count?: number;
  distance?: number;
}

/**
 * A warm, flame-colored particle burst used to mark streak milestones.
 * Renders centered in its parent; sized to the parent's center.
 */
export function FlameBurst({ delay = 0, count = 12, distance = 46 }: FlameBurstProps) {
  const [particles] = React.useState(() =>
    Array.from({ length: count }).map((_, i) => ({
      id: i,
      angle: (Math.PI * 2 * i) / count + (i % 2 ? 0.18 : -0.1),
      distance: distance * (0.75 + ((i * 7) % 5) / 10),
      size: 5 + ((i * 3) % 4),
      color: FLAME_COLORS[i % FLAME_COLORS.length],
      delay: delay + (i % 3) * 40,
    })),
  );

  return (
    <View style={styles.container} pointerEvents="none">
      {particles.map((p) => (
        <Ember key={p.id} {...p} />
      ))}
      <Halo delay={delay} />
    </View>
  );
}

function Ember({
  angle,
  distance,
  size,
  color,
  delay,
}: {
  angle: number;
  distance: number;
  size: number;
  color: string;
  delay: number;
}) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withDelay(
      delay,
      withTiming(1, { duration: 820, easing: Easing.out(Easing.cubic) }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const style = useAnimatedStyle(() => {
    const d = distance * progress.value;
    // Embers drift upward as they fade, like sparks off a fire.
    const lift = -18 * progress.value * progress.value;
    return {
      opacity: interpolate(progress.value, [0, 0.15, 0.75, 1], [0, 1, 1, 0]),
      transform: [
        { translateX: Math.cos(angle) * d },
        { translateY: Math.sin(angle) * d + lift },
        { scale: interpolate(progress.value, [0, 0.35, 1], [0, 1.1, 0.4]) },
      ],
    };
  });

  return (
    <Animated.View
      style={[
        styles.ember,
        { width: size, height: size * 1.4, borderRadius: size, backgroundColor: color },
        style,
      ]}
    />
  );
}

function Halo({ delay }: { delay: number }) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withDelay(delay, withTiming(1, { duration: 700, easing: Easing.out(Easing.quad) }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const style = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 0.2, 1], [0, 0.55, 0]),
    transform: [{ scale: interpolate(progress.value, [0, 1], [0.4, 2.1]) }],
  }));

  return <Animated.View style={[styles.halo, style]} />;
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  ember: {
    position: "absolute",
  },
  halo: {
    position: "absolute",
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 3,
    borderColor: "#FF9A5C",
  },
});

export default FlameBurst;

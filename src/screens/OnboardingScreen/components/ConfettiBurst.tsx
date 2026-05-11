import React, { useEffect } from "react";
import { View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSpring,
  Easing,
} from "react-native-reanimated";

const PARTICLES = Array.from({ length: 12 }).map((_, i) => ({
  id: i,
  angle: i * 30 * (Math.PI / 180),
  color: ["#D4A943", "#5A7A56", "#C8694B", "#7A9272", "#E8A88E", "#3F5A3D"][
    i % 6
  ],
  size: 6 + (i % 3) * 3,
}));

const Particle: React.FC<{
  angle: number;
  color: string;
  size: number;
  index: number;
}> = ({ angle, color, size, index }) => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(0);
  const opacity = useSharedValue(1);
  const rotation = useSharedValue(0);

  useEffect(() => {
    const distance = 60 + (index % 3) * 25;
    const targetX = Math.cos(angle) * distance;
    const targetY = Math.sin(angle) * distance;

    scale.value = withDelay(
      index * 30,
      withSpring(1, { damping: 8, stiffness: 300 }),
    );
    translateX.value = withDelay(
      index * 30,
      withSpring(targetX, { damping: 12, stiffness: 150 }),
    );
    translateY.value = withDelay(
      index * 30,
      withSpring(targetY, { damping: 12, stiffness: 150 }),
    );
    rotation.value = withDelay(
      index * 30,
      withTiming(360, { duration: 800, easing: Easing.out(Easing.cubic) }),
    );
    opacity.value = withDelay(
      600 + index * 30,
      withTiming(0, { duration: 400 }),
    );
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
      { rotate: `${rotation.value}deg` },
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
        },
        style,
      ]}
    />
  );
};

const ConfettiBurst: React.FC = () => {
  return (
    <View
      className="absolute items-center justify-center"
      style={{ width: 200, height: 200 }}
    >
      {PARTICLES.map((p) => (
        <Particle
          key={p.id}
          angle={p.angle}
          color={p.color}
          size={p.size}
          index={p.id}
        />
      ))}
    </View>
  );
};

export default React.memo(ConfettiBurst);

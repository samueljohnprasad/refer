import React, { useRef, useEffect } from "react";
import { View, Animated, Dimensions, StyleSheet } from "react-native";
import { useSeasonalTheme } from "@/hooks/useSeasonalTheme";

const { width, height } = Dimensions.get("window");

export interface RosePetalParticlesProps {
  /** Number of rose petals to render */
  petalCount?: number;
  /** Whether particles are enabled */
  enabled?: boolean;
  /** Animation speed multiplier */
  speed?: number;
}

/**
 * RosePetalParticles - A reusable component that renders floating rose petals
 * with gentle animations for a therapeutic, mindful experience.
 */
const RosePetalParticles: React.FC<RosePetalParticlesProps> = ({
  petalCount = 12,
  enabled = true,
  speed = 1,
}) => {
  const activeTheme = useSeasonalTheme();

  // Rose petal particle system
  const petals = useRef<
    {
      x: Animated.Value;
      y: Animated.Value;
      opacity: Animated.Value;
      scale: Animated.Value;
      rotation: Animated.Value;
      size: "small" | "medium" | "large";
    }[]
  >(
    Array.from({ length: petalCount }, (_, i) => ({
      x: new Animated.Value(Math.random() * width),
      y: new Animated.Value(Math.random() * height + height),
      opacity: new Animated.Value(Math.random() * 0.7 + 0.3),
      scale: new Animated.Value(Math.random() * 0.5 + 0.5),
      rotation: new Animated.Value(Math.random() * 360),
      size: Math.random() > 0.6 ? "large" : Math.random() > 0.3 ? "medium" : "small",
    }))
  ).current;

  useEffect(() => {
    if (!enabled) return;

    const animations = petals.map((petal, index) => {
      // Staggered start times for natural effect
      const delay = index * 200;
      
      // Vertical floating animation
      const floatY = Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(petal.y, {
            toValue: -100,
            duration: (8000 + Math.random() * 4000) / speed,
            useNativeDriver: true,
          }),
        ])
      );

      // Horizontal drift animation
      const driftX = Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(petal.x, {
            toValue: petal.x._value + (Math.random() - 0.5) * 200,
            duration: (6000 + Math.random() * 3000) / speed,
            useNativeDriver: true,
          }),
          Animated.timing(petal.x, {
            toValue: petal.x._value - (Math.random() - 0.5) * 200,
            duration: (6000 + Math.random() * 3000) / speed,
            useNativeDriver: true,
          }),
        ])
      );

      // Gentle rotation animation
      const rotate = Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(petal.rotation, {
            toValue: petal.rotation._value + 360,
            duration: (10000 + Math.random() * 5000) / speed,
            useNativeDriver: true,
          }),
        ])
      );

      // Gentle opacity pulsing
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(petal.opacity, {
            toValue: Math.min(1, petal.opacity._value + 0.3),
            duration: (3000 + Math.random() * 2000) / speed,
            useNativeDriver: true,
          }),
          Animated.timing(petal.opacity, {
            toValue: Math.max(0.2, petal.opacity._value - 0.3),
            duration: (3000 + Math.random() * 2000) / speed,
            useNativeDriver: true,
          }),
        ])
      );

      // Reset position when petal goes off screen
      const resetPosition = () => {
        petal.y.setValue(height + 100);
        petal.x.setValue(Math.random() * width);
      };

      // Listen for animation completion to reset
      petal.y.addListener(({ value }) => {
        if (value < -150) {
          resetPosition();
        }
      });

      floatY.start();
      driftX.start();
      rotate.start();
      pulse.start();

      return { floatY, driftX, rotate, pulse };
    });

    return () => {
      animations.forEach(({ floatY, driftX, rotate, pulse }) => {
        floatY.stop();
        driftX.stop();
        rotate.stop();
        pulse.stop();
      });
      petals.forEach(petal => {
        petal.y.removeAllListeners();
      });
    };
  }, [enabled, speed, petals]);

  if (!enabled) return null;

  return (
    <View style={styles.container} pointerEvents="none">
      {petals.map((petal, index) => (
        <Animated.View
          key={index}
          style={[
            styles.petal,
            petal.size === "small" ? styles.petalSmall :
            petal.size === "medium" ? styles.petalMedium : styles.petalLarge,
            {
              backgroundColor: activeTheme.particleSparkle,
              shadowColor: activeTheme.particleDot,
              transform: [
                { translateX: petal.x },
                { translateY: petal.y },
                { scale: petal.scale },
                { 
                  rotate: petal.rotation.interpolate({
                    inputRange: [0, 360],
                    outputRange: ['0deg', '360deg'],
                  })
                },
              ],
              opacity: petal.opacity,
            },
          ]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  petal: {
    position: 'absolute',
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  petalSmall: {
    width: 8,
    height: 12,
    borderRadius: 8,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  petalMedium: {
    width: 12,
    height: 18,
    borderRadius: 12,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  petalLarge: {
    width: 16,
    height: 24,
    borderRadius: 16,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
});

export default RosePetalParticles;

import React, { useRef, useEffect } from "react";
import { View, Animated, Dimensions, StyleSheet } from "react-native";
import { useSeasonalTheme } from "@/hooks/useSeasonalTheme";

const { width, height } = Dimensions.get("window");

export interface FirefliesParticlesProps {
  /** Number of fireflies to render */
  fireflyCount?: number;
  /** Whether particles are enabled */
  enabled?: boolean;
  /** Animation speed multiplier */
  speed?: number;
  /** Whether to show only during evening hours */
  eveningOnly?: boolean;
}

/**
 * FirefliesParticles - A reusable component that renders glowing fireflies
 * with gentle animations for evening journaling sessions.
 */
const FirefliesParticles: React.FC<FirefliesParticlesProps> = ({
  fireflyCount = 8,
  enabled = true,
  speed = 1,
  eveningOnly = true,
}) => {
  const activeTheme = useSeasonalTheme();

  // Check if it's evening (6 PM to 6 AM)
  const currentHour = new Date().getHours();
  const isEvening = currentHour >= 18 || currentHour <= 6;
  
  const shouldShow = enabled && (!eveningOnly || isEvening);

  // Firefly particle system
  const fireflies = useRef<
    {
      x: Animated.Value;
      y: Animated.Value;
      opacity: Animated.Value;
      scale: Animated.Value;
      glowIntensity: Animated.Value;
      brightness: "dim" | "medium" | "bright";
    }[]
  >(
    Array.from({ length: fireflyCount }, (_, i) => ({
      x: new Animated.Value(Math.random() * width),
      y: new Animated.Value(Math.random() * height),
      opacity: new Animated.Value(Math.random() * 0.8 + 0.2),
      scale: new Animated.Value(Math.random() * 0.6 + 0.4),
      glowIntensity: new Animated.Value(Math.random() * 0.8 + 0.6),
      brightness: Math.random() > 0.7 ? "bright" : Math.random() > 0.4 ? "medium" : "dim",
    }))
  ).current;

  useEffect(() => {
    if (!shouldShow) return;

    const animations = fireflies.map((firefly, index) => {
      // Staggered start times for natural effect
      const delay = index * 500;
      
      // Gentle floating movement (figure-8 pattern)
      const floatX = Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(firefly.x, {
            toValue: firefly.x._value + (Math.random() - 0.5) * 150,
            duration: (4000 + Math.random() * 3000) / speed,
            useNativeDriver: true,
          }),
          Animated.timing(firefly.x, {
            toValue: firefly.x._value - (Math.random() - 0.5) * 150,
            duration: (4000 + Math.random() * 3000) / speed,
            useNativeDriver: true,
          }),
        ])
      );

      const floatY = Animated.loop(
        Animated.sequence([
          Animated.delay(delay + 1000),
          Animated.timing(firefly.y, {
            toValue: firefly.y._value + (Math.random() - 0.5) * 200,
            duration: (5000 + Math.random() * 4000) / speed,
            useNativeDriver: true,
          }),
          Animated.timing(firefly.y, {
            toValue: firefly.y._value - (Math.random() - 0.5) * 200,
            duration: (5000 + Math.random() * 4000) / speed,
            useNativeDriver: true,
          }),
        ])
      );

      // Firefly glow effect (blinking)
      const glow = Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(firefly.glowIntensity, {
            toValue: 1,
            duration: (800 + Math.random() * 400) / speed,
            useNativeDriver: true,
          }),
          Animated.timing(firefly.glowIntensity, {
            toValue: 0.3,
            duration: (1200 + Math.random() * 800) / speed,
            useNativeDriver: true,
          }),
          Animated.delay(Math.random() * 2000 / speed), // Random pause between blinks
        ])
      );

      // Gentle opacity breathing
      const breathe = Animated.loop(
        Animated.sequence([
          Animated.delay(delay + 2000),
          Animated.timing(firefly.opacity, {
            toValue: Math.min(1, firefly.opacity._value + 0.4),
            duration: (3000 + Math.random() * 2000) / speed,
            useNativeDriver: true,
          }),
          Animated.timing(firefly.opacity, {
            toValue: Math.max(0.2, firefly.opacity._value - 0.3),
            duration: (3000 + Math.random() * 2000) / speed,
            useNativeDriver: true,
          }),
        ])
      );

      // Gentle scale pulsing
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.delay(delay + 1500),
          Animated.timing(firefly.scale, {
            toValue: Math.min(1.2, firefly.scale._value + 0.3),
            duration: (2000 + Math.random() * 1500) / speed,
            useNativeDriver: true,
          }), 
          Animated.timing(firefly.scale, {
            toValue: Math.max(0.4, firefly.scale._value - 0.2),
            duration: (2000 + Math.random() * 1500) / speed,
            useNativeDriver: true,
          }),
        ])
      );

      // Boundary check and reset
      const boundaryCheck = () => {
        if (firefly.x._value < -50 || firefly.x._value > width + 50) {
          firefly.x.setValue(Math.random() * width);
        }
        if (firefly.y._value < -50 || firefly.y._value > height + 50) {
          firefly.y.setValue(Math.random() * height);
        }
      };

      const boundaryInterval = setInterval(boundaryCheck, 5000);

      floatX.start();
      floatY.start();
      glow.start();
      breathe.start();
      pulse.start();

      return { floatX, floatY, glow, breathe, pulse, boundaryInterval };
    });

    return () => {
      animations.forEach(({ floatX, floatY, glow, breathe, pulse, boundaryInterval }) => {
        floatX.stop();
        floatY.stop();
        glow.stop();
        breathe.stop();
        pulse.stop();
        clearInterval(boundaryInterval);
      });
    };
  }, [shouldShow, speed, fireflies]);

  if (!shouldShow) return null;

  return (
    <View style={styles.container} pointerEvents="none">
      {fireflies.map((firefly, index) => (
        <Animated.View
          key={index}
          style={[
            styles.firefly,
            firefly.brightness === "dim" ? styles.fireflyDim :
            firefly.brightness === "medium" ? styles.fireflyMedium : styles.fireflyBright,
            {
              transform: [
                { translateX: firefly.x },
                { translateY: firefly.y },
                { scale: firefly.scale },
              ],
              opacity: Animated.multiply(firefly.opacity, firefly.glowIntensity),
            },
          ]}
        >
          {/* Firefly body */}
          <View style={[
            styles.fireflyBody,
            { backgroundColor: '#FFE55C' }
          ]} />
          
          {/* Glow effect */}
          <Animated.View style={[
            styles.fireflyGlow,
            {
              backgroundColor: '#FFE55C',
              opacity: firefly.glowIntensity.interpolate({
                inputRange: [0.3, 1],
                outputRange: [0.2, 0.6],
              }),
            }
          ]} />
        </Animated.View>
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
    zIndex: 2,
  },
  firefly: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fireflyBody: {
    width: 4,
    height: 6,
    borderRadius: 3,
    shadowColor: '#FFE55C',
    shadowOpacity: 0.8,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 0 },
    elevation: 5,
  },
  fireflyGlow: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    shadowColor: '#FFE55C',
    shadowOpacity: 0.6,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 0 },
    elevation: 3,
  },
  fireflyDim: {
    // Smaller, dimmer fireflies
  },
  fireflyMedium: {
    // Standard fireflies
  },
  fireflyBright: {
    // Larger, brighter fireflies
    transform: [{ scale: 1.2 }],
  },
});

export default FirefliesParticles;

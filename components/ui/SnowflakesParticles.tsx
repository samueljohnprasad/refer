import React, { useRef, useEffect } from "react";
import { View, Animated, Dimensions, StyleSheet } from "react-native";
import { useSeasonalTheme, useSeasonalThemeUtils } from "@/hooks/useSeasonalTheme";

const { width, height } = Dimensions.get("window");

export interface SnowflakesParticlesProps {
  /** Number of snowflakes to render */
  snowflakeCount?: number;
  /** Whether particles are enabled */
  enabled?: boolean;
  /** Animation speed multiplier */
  speed?: number;
  /** Whether to show only during winter months */
  winterOnly?: boolean;
  /** Force calm theme colors regardless of season */
  useCalm?: boolean;
}

/**
 * SnowflakesParticles - A reusable component that renders gentle falling snowflakes
 * with serene animations for winter/calm journaling sessions.
 */
const SnowflakesParticles: React.FC<SnowflakesParticlesProps> = ({
  snowflakeCount = 15,
  enabled = true,
  speed = 1,
  winterOnly = true,
  useCalm = false,
}) => {
  const activeTheme = useSeasonalTheme();
  const { currentMonth } = useSeasonalThemeUtils();

  // Check if it's winter months (December, January, February)
  const isWinter = currentMonth === 11 || currentMonth === 0 || currentMonth === 1;
  
  const shouldShow = enabled && (!winterOnly || isWinter);

  // Define calm winter colors
  const calmColors = {
    snowflake: '#F0F8FF', // Alice blue
    shadow: '#E6F3FF',    // Very light blue
    accent: '#D6EAF8',    // Light winter blue
  };

  const colors = useCalm ? calmColors : {
    snowflake: activeTheme.gradient[0],
    shadow: activeTheme.gradient[1],
    accent: activeTheme.particleDot,
  };

  // Snowflake particle system
  const snowflakes = useRef<
    {
      x: Animated.Value;
      y: Animated.Value;
      opacity: Animated.Value;
      scale: Animated.Value;
      rotation: Animated.Value;
      driftOffset: Animated.Value;
      size: "tiny" | "small" | "medium" | "large";
      shape: "simple" | "detailed" | "crystal";
    }[]
  >(
    Array.from({ length: snowflakeCount }, (_, i) => ({
      x: new Animated.Value(Math.random() * width),
      y: new Animated.Value(-50 - Math.random() * 100),
      opacity: new Animated.Value(Math.random() * 0.8 + 0.3),
      scale: new Animated.Value(Math.random() * 0.8 + 0.4),
      rotation: new Animated.Value(0),
      driftOffset: new Animated.Value(0),
      size: Math.random() > 0.7 ? "large" : Math.random() > 0.4 ? "medium" : Math.random() > 0.2 ? "small" : "tiny",
      shape: Math.random() > 0.6 ? "crystal" : Math.random() > 0.3 ? "detailed" : "simple",
    }))
  ).current;

  useEffect(() => {
    if (!shouldShow) return;

    const animations = snowflakes.map((snowflake, index) => {
      // Staggered start times for natural snowfall
      const delay = index * 100;
      
      // Gentle falling animation
      const fall = Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(snowflake.y, {
            toValue: height + 100,
            duration: (8000 + Math.random() * 4000) / speed,
            useNativeDriver: true,
          }),
        ])
      );

      // Gentle horizontal drift
      const drift = Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(snowflake.driftOffset, {
            toValue: 50,
            duration: (4000 + Math.random() * 2000) / speed,
            useNativeDriver: true,
          }),
          Animated.timing(snowflake.driftOffset, {
            toValue: -50,
            duration: (4000 + Math.random() * 2000) / speed,
            useNativeDriver: true,
          }),
        ])
      );

      // Gentle rotation
      const rotate = Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(snowflake.rotation, {
            toValue: 360,
            duration: (12000 + Math.random() * 8000) / speed,
            useNativeDriver: true,
          }),
        ])
      );

      // Very subtle opacity breathing
      const breathe = Animated.loop(
        Animated.sequence([
          Animated.delay(delay + 1000),
          Animated.timing(snowflake.opacity, {
            toValue: Math.min(1, snowflake.opacity._value + 0.2),
            duration: (4000 + Math.random() * 2000) / speed,
            useNativeDriver: true,
          }),
          Animated.timing(snowflake.opacity, {
            toValue: Math.max(0.3, snowflake.opacity._value - 0.1),
            duration: (4000 + Math.random() * 2000) / speed,
            useNativeDriver: true,
          }),
        ])
      );

      // Reset position when snowflake falls off screen
      const resetPosition = () => {
        if (snowflake.y._value > height + 150) {
          snowflake.y.setValue(-50 - Math.random() * 100);
          snowflake.x.setValue(Math.random() * width);
        }
      };

      const resetInterval = setInterval(resetPosition, 1000);

      fall.start();
      drift.start();
      rotate.start();
      breathe.start();

      return { fall, drift, rotate, breathe, resetInterval };
    });

    return () => {
      animations.forEach(({ fall, drift, rotate, breathe, resetInterval }) => {
        fall.stop();
        drift.stop();
        rotate.stop();
        breathe.stop();
        clearInterval(resetInterval);
      });
    };
  }, [shouldShow, speed, snowflakes]);

  if (!shouldShow) return null;

  const renderSnowflake = (snowflake: any, index: number) => {
    const SnowflakeShape = () => {
      switch (snowflake.shape) {
        case "simple":
          return (
            <View style={[
              styles.snowflakeSimple,
              snowflake.size === "tiny" ? styles.snowflakeTiny :
              snowflake.size === "small" ? styles.snowflakeSmall :
              snowflake.size === "medium" ? styles.snowflakeMedium : styles.snowflakeLarge,
              { backgroundColor: colors.snowflake }
            ]} />
          );
        case "detailed":
          return (
            <View style={styles.snowflakeDetailed}>
              <View style={[styles.snowflakeCross, { backgroundColor: colors.snowflake }]} />
              <View style={[styles.snowflakeCrossRotated, { backgroundColor: colors.snowflake }]} />
            </View>
          );
        case "crystal":
          return (
            <View style={styles.snowflakeCrystal}>
              <View style={[styles.snowflakeCross, { backgroundColor: colors.snowflake }]} />
              <View style={[styles.snowflakeCrossRotated, { backgroundColor: colors.snowflake }]} />
              <View style={[styles.snowflakeDiagonal1, { backgroundColor: colors.snowflake }]} />
              <View style={[styles.snowflakeDiagonal2, { backgroundColor: colors.snowflake }]} />
            </View>
          );
        default:
          return null;
      }
    };

    return (
      <Animated.View
        key={index}
        style={[
          styles.snowflake,
          {
            transform: [
              { 
                translateX: Animated.add(snowflake.x, snowflake.driftOffset)
              },
              { translateY: snowflake.y },
              { scale: snowflake.scale },
              { 
                rotate: snowflake.rotation.interpolate({
                  inputRange: [0, 360],
                  outputRange: ['0deg', '360deg'],
                })
              },
            ],
            opacity: snowflake.opacity,
          },
        ]}
      >
        <SnowflakeShape />
      </Animated.View>
    );
  };

  return (
    <View style={styles.container} pointerEvents="none">
      {snowflakes.map((snowflake, index) => renderSnowflake(snowflake, index))}
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
  snowflake: {
    position: 'absolute',
  },
  snowflakeSimple: {
    borderRadius: 50,
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  snowflakeTiny: {
    width: 3,
    height: 3,
  },
  snowflakeSmall: {
    width: 5,
    height: 5,
  },
  snowflakeMedium: {
    width: 7,
    height: 7,
  },
  snowflakeLarge: {
    width: 9,
    height: 9,
  },
  snowflakeDetailed: {
    width: 12,
    height: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  snowflakeCrystal: {
    width: 14,
    height: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  snowflakeCross: {
    position: 'absolute',
    width: 12,
    height: 2,
    shadowOpacity: 0.2,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  snowflakeCrossRotated: {
    position: 'absolute',
    width: 2,
    height: 12,
    shadowOpacity: 0.2,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  snowflakeDiagonal1: {
    position: 'absolute',
    width: 10,
    height: 1,
    transform: [{ rotate: '45deg' }],
    shadowOpacity: 0.2,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  snowflakeDiagonal2: {
    position: 'absolute',
    width: 10,
    height: 1,
    transform: [{ rotate: '-45deg' }],
    shadowOpacity: 0.2,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
});

export default SnowflakesParticles;

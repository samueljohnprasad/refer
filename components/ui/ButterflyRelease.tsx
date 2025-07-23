import React, { useRef, useEffect } from "react";
import { View, Animated, Dimensions, StyleSheet } from "react-native";
import { useSeasonalTheme } from "@/hooks/useSeasonalTheme";

const { width, height } = Dimensions.get("window");

export interface ButterflyReleaseProps {
  /** Whether the butterfly release is active */
  isActive: boolean;
  /** Number of butterflies to release */
  butterflyCount?: number;
  /** Animation speed multiplier */
  speed?: number;
  /** Duration of the entire effect in milliseconds */
  duration?: number;
  /** Callback when animation completes */
  onComplete?: () => void;
}

/**
 * ButterflyRelease - A celebratory component that releases colorful butterflies
 * upward when triggered, perfect for positive journal entry celebrations.
 */
const ButterflyRelease: React.FC<ButterflyReleaseProps> = ({
  isActive,
  butterflyCount = 6,
  speed = 1,
  duration = 4000,
  onComplete,
}) => {
  const activeTheme = useSeasonalTheme();

  // Butterfly particle system
  const butterflies = useRef<
    {
      x: Animated.Value;
      y: Animated.Value;
      opacity: Animated.Value;
      scale: Animated.Value;
      rotation: Animated.Value;
      wingFlap: Animated.Value;
      driftX: Animated.Value;
      size: "small" | "medium" | "large";
      color: string;
    }[]
  >(
    Array.from({ length: butterflyCount }, (_, i) => ({
      x: new Animated.Value(width * 0.2 + Math.random() * width * 0.6), // More centered
      y: new Animated.Value(height * 0.7), // Start from lower on screen
      opacity: new Animated.Value(1.0), // Full opacity
      scale: new Animated.Value(0.3),
      rotation: new Animated.Value(0),
      wingFlap: new Animated.Value(0),
      driftX: new Animated.Value(0),
      size: Math.random() > 0.6 ? "large" : Math.random() > 0.3 ? "medium" : "small",
      color: [
        '#FF69B4', // Hot pink
        '#FF6347', // Tomato
        '#FFD700', // Gold
        '#32CD32', // Lime green
        '#FF1493', // Deep pink
        '#9370DB', // Medium purple
        '#00CED1', // Dark turquoise
        '#FFA500', // Orange
      ][Math.floor(Math.random() * 8)],
    }))
  ).current;

  useEffect(() => {
    if (!isActive) return;

    const animations = butterflies.map((butterfly, index) => {
      // Staggered release timing
      const releaseDelay = index * 200;
      
      // Entrance animation - butterflies appear and grow
      const entrance = Animated.parallel([
        Animated.timing(butterfly.opacity, {
          toValue: 1,
          duration: 500 / speed,
          delay: releaseDelay,
          useNativeDriver: true,
        }),
        Animated.timing(butterfly.scale, {
          toValue: 1,
          duration: 600 / speed,
          delay: releaseDelay,
          useNativeDriver: true,
        }),
      ]);

      // Wing flapping animation (continuous)
      const wingFlapping = Animated.loop(
        Animated.sequence([
          Animated.timing(butterfly.wingFlap, {
            toValue: 1,
            duration: 300 / speed,
            useNativeDriver: true,
          }),
          Animated.timing(butterfly.wingFlap, {
            toValue: 0,
            duration: 300 / speed,
            useNativeDriver: true,
          }),
        ])
      );

      // Flying upward with gentle curves
      const flyUp = Animated.timing(butterfly.y, {
        toValue: -100,
        duration: (duration - 1000) / speed,
        delay: releaseDelay,
        useNativeDriver: true,
      });

      // Horizontal drift (figure-8 pattern)
      const drift = Animated.loop(
        Animated.sequence([
          Animated.timing(butterfly.driftX, {
            toValue: 60,
            duration: 1500 / speed,
            useNativeDriver: true,
          }),
          Animated.timing(butterfly.driftX, {
            toValue: -60,
            duration: 1500 / speed,
            useNativeDriver: true,
          }),
        ])
      );

      // Gentle rotation
      const rotate = Animated.loop(
        Animated.timing(butterfly.rotation, {
          toValue: 360,
          duration: 8000 / speed,
          useNativeDriver: true,
        })
      );

      // Exit fade out
      const exit = Animated.timing(butterfly.opacity, {
        toValue: 0,
        duration: 800 / speed,
        delay: (duration - 800) / speed,
        useNativeDriver: true,
      });

      // Start all animations
      entrance.start();
      wingFlapping.start();
      
      setTimeout(() => {
        flyUp.start();
        drift.start();
        rotate.start();
        exit.start();
      }, releaseDelay);

      return { entrance, wingFlapping, flyUp, drift, rotate, exit };
    });

    // Call onComplete when animation finishes
    const completionTimer = setTimeout(() => {
      if (onComplete) onComplete();
    }, duration / speed);

    return () => {
      clearTimeout(completionTimer);
      animations.forEach(({ entrance, wingFlapping, flyUp, drift, rotate, exit }) => {
        entrance.stop();
        wingFlapping.stop();
        flyUp.stop();
        drift.stop();
        rotate.stop();
        exit.stop();
      });
    };
  }, [isActive, speed, duration, butterflies, onComplete]);

  if (!isActive) return null;

  const renderButterfly = (butterfly: any, index: number) => {
    const wingScale = butterfly.wingFlap.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 1.1],
    });

    return (
      <Animated.View
        key={index}
        style={[
          styles.butterfly,
          {
            transform: [
              { 
                translateX: Animated.add(butterfly.x, butterfly.driftX)
              },
              { translateY: butterfly.y },
              { scale: butterfly.scale },
              { 
                rotate: butterfly.rotation.interpolate({
                  inputRange: [0, 360],
                  outputRange: ['0deg', '360deg'],
                })
              },
            ],
            opacity: butterfly.opacity,
          },
        ]}
      >
        {/* Butterfly body */}
        <View style={[
          styles.butterflyBody,
          { backgroundColor: '#8B4513' } // Saddle brown
        ]} />
        
        {/* Left wing */}
        <Animated.View style={[
          styles.butterflyWingLeft,
          butterfly.size === "small" ? styles.wingSmall :
          butterfly.size === "medium" ? styles.wingMedium : styles.wingLarge,
          {
            backgroundColor: butterfly.color,
            transform: [{ scaleX: wingScale }],
          }
        ]} />
        
        {/* Right wing */}
        <Animated.View style={[
          styles.butterflyWingRight,
          butterfly.size === "small" ? styles.wingSmall :
          butterfly.size === "medium" ? styles.wingMedium : styles.wingLarge,
          {
            backgroundColor: butterfly.color,
            transform: [{ scaleX: wingScale }],
          }
        ]} />
        
        {/* Wing patterns/spots */}
        <View style={[
          styles.butterflyPattern,
          { backgroundColor: '#FFFFFF', opacity: 0.8 } // White spots for visibility
        ]} />
      </Animated.View>
    );
  };

  return (
    <View style={styles.container} pointerEvents="none">
      {butterflies.map((butterfly, index) => renderButterfly(butterfly, index))}
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
    zIndex: 999, // Very high z-index
    backgroundColor: 'transparent',
  },
  butterfly: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  butterflyBody: {
    width: 4,
    height: 20,
    borderRadius: 2,
    zIndex: 2,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  butterflyWingLeft: {
    position: 'absolute',
    left: -10,
    top: 2,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 6,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 3,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: -1, height: 2 },
    elevation: 2,
  },
  butterflyWingRight: {
    position: 'absolute',
    right: -10,
    top: 2,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 12,
    borderBottomLeftRadius: 3,
    borderBottomRightRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 1, height: 2 },
    elevation: 2,
  },
  butterflyPattern: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 3,
    top: 5,
  },
  wingSmall: {
    width: 16,
    height: 12,
  },
  wingMedium: {
    width: 20,
    height: 16,
  },
  wingLarge: {
    width: 24,
    height: 20,
  },
});

export default ButterflyRelease;

import React, { useRef, useEffect } from "react";
import { View, Animated, Dimensions } from "react-native";
import { useSeasonalTheme } from "@/hooks/useSeasonalTheme";

type DropletsParticlesProps = {
  particleCount?: number;
};

const DropletsParticles: React.FC<DropletsParticlesProps> = ({
  particleCount = 32,
}) => {
  const activeTheme = useSeasonalTheme();
  const width = Dimensions.get("window").width;
  const particles = useRef<
    {
      x: Animated.Value;
      y: Animated.Value;
      opacity: Animated.Value;
      scale: Animated.Value;
      type: "dot" | "sparkle";
    }[]
  >(
    Array.from({ length: particleCount }, (_, i) => ({
      x: new Animated.Value(Math.random() * width),
      y: new Animated.Value(Math.random() * 600),
      opacity: new Animated.Value(Math.random() * 0.4 + 0.3), // More visible: 0.3-0.7
      scale: new Animated.Value(Math.random() * 0.8 + 0.6), // Larger: 0.6-1.4
      type: i % 3 === 0 ? "sparkle" : "dot",
    }))
  ).current;

  // Particle animation effect
  useEffect(() => {
    const animateParticles = () => {
      particles.forEach((particle, index) => {
        const initialY = Math.random() * 600;
        const floatAnimation = Animated.loop(
          Animated.sequence([
            Animated.timing(particle.y, {
              toValue: initialY - 20,
              duration: 3000 + Math.random() * 2000,
              useNativeDriver: true,
            }),
            Animated.timing(particle.y, {
              toValue: initialY + 40,
              duration: 3000 + Math.random() * 2000,
              useNativeDriver: true,
            }),
          ])
        );

        const fadeAnimation = Animated.loop(
          Animated.sequence([
            Animated.timing(particle.opacity, {
              toValue: 0.2,
              duration: 2000 + Math.random() * 1000,
              useNativeDriver: true,
            }),
            Animated.timing(particle.opacity, {
              toValue: 0.8,
              duration: 2000 + Math.random() * 1000,
              useNativeDriver: true,
            }),
          ])
        );

        const scaleAnimation = Animated.loop(
          Animated.sequence([
            Animated.timing(particle.scale, {
              toValue: 0.5,
              duration: 1500 + Math.random() * 1000,
              useNativeDriver: true,
            }),
            Animated.timing(particle.scale, {
              toValue: 1.2,
              duration: 1500 + Math.random() * 1000,
              useNativeDriver: true,
            }),
          ])
        );

        floatAnimation.start();

        fadeAnimation.start();
        if (particle.type === "sparkle") {
          scaleAnimation.start();
        }
      });
    };

    animateParticles();
  }, [particles]);

  return (
    <View style={styles.particleContainer}>
      {particles.map((particle, index) => (
        <Animated.View
          key={index}
          style={[
            styles.particle,
            particle.type === "sparkle"
              ? [
                  styles.sparkle,
                  {
                    backgroundColor: activeTheme.particleSparkle,
                    shadowColor: activeTheme.particleDot,
                  },
                ]
              : [
                  styles.dot,
                  {
                    backgroundColor: activeTheme.particleDot,
                    shadowColor: activeTheme.particleDot,
                  },
                ],
            {
              transform: [
                { translateX: particle.x },
                { translateY: particle.y },
                { scale: particle.scale },
              ],
              opacity: particle.opacity,
            },
          ]}
        />
      ))}
    </View>
  );
};

const styles = {
  particleContainer: {
    position: "absolute" as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: "none" as const,
  },
  particle: {
    position: "absolute" as const,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 3,
  },
  sparkle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: "rgba(232, 213, 255, 0.4)",
  },
};

export default DropletsParticles;

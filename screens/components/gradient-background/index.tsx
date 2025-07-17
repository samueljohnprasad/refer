/* ----------------------------------------------------------------------------
GradientBackground Component
-----------------------------------------------------------------------------
A reusable gradient ("radiant") background that can be customised via props.
It optionally renders a matching card whose background colour automatically
harmonises with the gradient's first colour.

The component relies on `expo-linear-gradient`. If you are using bare React
Native swap the package import for `react-native-linear-gradient`.
----------------------------------------------------------------------------*/

import React, { useRef } from "react";
import { StyleSheet, Animated, View, ViewStyle } from "react-native";
import AnimatedLinearGradient from "./AnimatedLinearGradient";
import { GlassCard } from "./glass-card";
import { getBrightness } from "./utils";
import type { GradientBackgroundProps } from "./types";

// ---------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------

export const GradientBackground: React.FC<GradientBackgroundProps> = ({
  colors = ["#FFDF9C", "#FFF5DC", "#FFDF9C", "#FFF5DC"],
  children,
  style,
  card,
  scrollY,
  parallaxStrength = 0.35,
  adaptiveBlur = true,
}) => {
  const scrollYAnimated = scrollY || useRef(new Animated.Value(0)).current;

  // ---------------- Parallax style ----------------
  const styles = StyleSheet.create({
    gradient: {
      ...StyleSheet.absoluteFillObject,
      flex: 1,
      width: "100%" as any, // Using 'any' to bypass the DimensionValue type
      height: "100%" as any, // Using 'any' to bypass the DimensionValue type
    },
  });

  const gradientStyle = {
    ...styles.gradient,
    ...style,
    transform: [
      {
        translateY: Animated.multiply(
          scrollYAnimated,
          new Animated.Value(parallaxStrength)
        ),
      },
    ],
  };

  // ---------------- Adaptive blur overlay ----------------
  const brightness = getBrightness(colors[0]);
  const overlayAlpha1 = adaptiveBlur && brightness > 200 ? 0.55 : 0.35;
  const overlayAlpha2 = adaptiveBlur && brightness > 200 ? 0.35 : 0.15;

  return (
    <View style={{ flex: 1 }}>
      {/* Background Gradient */}
      <AnimatedLinearGradient
        colors={colors as any} 
        locations={[1, 0.55, 0.1, 0]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.7, y: 0.8 }}
        style={[StyleSheet.absoluteFill, gradientStyle]}
      />

      {/* Content */}
      <Animated.ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1 }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollYAnimated } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
      >
        <View style={{ flex: 1 }}>
          {/* Glass Card */}
          {card && (
            <GlassCard
              label={card.label}
              description={card.description}
              overlayAlpha1={overlayAlpha1}
              overlayAlpha2={overlayAlpha2}
            />
          )}

          {/* Children Content */}
          <View style={{ flex: 1 }}>{children}</View>
        </View>
      </Animated.ScrollView>
    </View>
  );
};

export default GradientBackground;

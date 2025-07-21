// MovingGradientBackground.tsx
import React, { useEffect, useRef, useState } from "react";
import { Animated, StyleSheet } from "react-native";
import AnimatedLinearGradient from "./AnimatedLinearGradient";

const MovingGradientBackground = () => {
  const [gradientOptions, setGradientOptions] = useState({
    colors: ["#bbf3bf", "#bdebf8", "#fdf4c9"],
    start: { x: 0.5, y: 0 },
    end: { x: 0.5, y: 1 },
    locations: [0, 0.6, 1],
  });

  return (
    <AnimatedLinearGradient
      colors={gradientOptions.colors as any}
      start={gradientOptions.start}
      end={gradientOptions.end}
      locations={gradientOptions.locations as any}
      style={StyleSheet.absoluteFill}
    />
  );
};

export default MovingGradientBackground;

import React from "react";
import { LinearGradient, LinearGradientProps } from "expo-linear-gradient";

/**
 * Simplified wrapper that avoids Animated.createAnimatedComponent
 * to prevent React Native warning on useInsertionEffect scheduling.
 */
const AnimatedLinearGradient: React.FC<LinearGradientProps> = (props) => (
  <LinearGradient {...props} />
);

export default AnimatedLinearGradient;

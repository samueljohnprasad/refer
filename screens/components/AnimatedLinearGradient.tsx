import React from "react";
import { Animated } from "react-native";
import { LinearGradient, LinearGradientProps } from "expo-linear-gradient";

// Create an animated version of LinearGradient with proper typing
const AnimatedLinearGradient = Animated.createAnimatedComponent(
  LinearGradient
) as unknown as React.ComponentType<LinearGradientProps>;

export default AnimatedLinearGradient;

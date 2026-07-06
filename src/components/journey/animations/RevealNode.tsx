import React, { useEffect, useRef } from "react";
import type { StyleProp, ViewStyle } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  withDelay,
} from "react-native-reanimated";

export function RevealNode({ children, index, style }: { children: React.ReactNode; index: number; style?: StyleProp<ViewStyle> }): React.ReactElement {
  return <Animated.View style={style}>{children}</Animated.View>;
}

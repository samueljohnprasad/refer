import React, { useEffect } from "react";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";

export function ScreenReveal({ children }: { children: React.ReactNode }): React.ReactElement {
  return <>{children}</>;
}

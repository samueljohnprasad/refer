import React, { useEffect } from "react";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  withDelay,
} from "react-native-reanimated";

export function RevealTopBar({ children }: { children: React.ReactNode }): React.ReactElement {
  return <>{children}</>;
}

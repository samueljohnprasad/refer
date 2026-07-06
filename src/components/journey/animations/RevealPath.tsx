import React, { useEffect, useRef } from "react";
import { StyleSheet } from "react-native";
import Animated from "react-native-reanimated";

export function RevealPath({ children, index }: { children: React.ReactNode; index: number }): React.ReactElement {
  return (
    <Animated.View style={StyleSheet.absoluteFill} pointerEvents="none">
      {children}
    </Animated.View>
  );
}

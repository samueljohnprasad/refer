import React from "react";
import { StyleSheet } from "react-native";
import Animated from "react-native-reanimated";

export interface RevealPathProps {
  children: React.ReactNode;
  index: number;
}

export const RevealPathView = React.memo(function RevealPathView({
  children,
}: RevealPathProps): React.JSX.Element {
  return (
    <Animated.View style={StyleSheet.absoluteFill} pointerEvents="none">
      {children}
    </Animated.View>
  );
});

export function RevealPath(props: RevealPathProps): React.JSX.Element {
  return <RevealPathView {...props} />;
}

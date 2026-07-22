import React from "react";
import type { StyleProp, ViewStyle } from "react-native";
import Animated from "react-native-reanimated";

export interface RevealNodeProps {
  children: React.ReactNode;
  index: number;
  style?: StyleProp<ViewStyle>;
}

export const RevealNodeView = React.memo(function RevealNodeView({
  children,
  style,
}: RevealNodeProps): React.JSX.Element {
  return <Animated.View style={style}>{children}</Animated.View>;
});

export function RevealNode(props: RevealNodeProps): React.JSX.Element {
  return <RevealNodeView {...props} />;
}

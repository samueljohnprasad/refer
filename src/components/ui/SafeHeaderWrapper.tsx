import { useHeaderHeight } from "expo-router/react-navigation";
import React from "react";
import { View, ViewProps } from "react-native";
import Animated from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface SafeHeaderWrapperProps extends ViewProps {
  children: React.ReactNode;
}

export function SafeHeaderWrapper({
  children,
  style,
  ...props
}: SafeHeaderWrapperProps): React.JSX.Element {
  const headerHeight = useHeaderHeight();
  return (
    <View style={[{ paddingTop: headerHeight, flex: 1 }, style]} {...props}>
      {children}
    </View>
  );
}

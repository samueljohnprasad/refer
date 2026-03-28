import React from "react";
import {
  Animated,
  Pressable,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { Text } from "@/components/Themed";
import useTodayPillAnimation from "@/hooks/animations/useTodayPillAnimation";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

export interface TodayPillProps {
  visible: boolean;
  label?: string;
  onPress?: () => void;
  containerStyle?: StyleProp<ViewStyle>;
  backgroundColor?: string;
  textColor?: string;
  durationMs?: number;
  offsetX?: number;
  scaleFrom?: number;
}

export const TodayPill: React.FC<TodayPillProps> = React.memo(
  ({
    visible,
    label = "Today",
    onPress,
    containerStyle,
    backgroundColor = "#7B61FF",
    textColor = "#ffffff",
    durationMs,
    offsetX,
    scaleFrom,
  }) => {
    const { animatedStyle, pointerEvents } = useTodayPillAnimation({
      visible,
      durationMs,
      offsetX,
      scaleFrom,
    });

    return (
      <Animated.View
        style={[
          {
            position: "absolute",
            right: 0,
            bottom: -16,
            zIndex: 100,
          },
          containerStyle,
          animatedStyle,
        ]}
        className="flex-row items-center rounded-l-2xl px-2 py-1 bg-theme-purple-light"
        pointerEvents={pointerEvents}
      >
        <Pressable
          onPress={onPress}
          accessibilityRole="button"
          accessibilityLabel={label}
          accessibilityHint="Returns view to the current day"
          className="flex-row items-center gap-1"
        >
          <MaterialCommunityIcons name="chevron-left" size={18} className="text-theme-text-secondary font-regular" />
          <Text className="font-regular text-theme-text-secondary text-sm">{label}</Text>
        </Pressable>
      </Animated.View>
    );
  }
);

export default TodayPill;

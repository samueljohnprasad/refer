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
import { SAGE } from "@/lib/tokens";

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
    backgroundColor = SAGE.selected,
    textColor = SAGE[600],
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
            bottom: 6,
            zIndex: 100,
            backgroundColor,
          },
          containerStyle,
          animatedStyle,
        ]}
        className="flex-row items-center rounded-l-full px-2.5 py-1 border border-r-0 border-sage-200/60 shadow-xs"
        pointerEvents={pointerEvents}
      >
        <Pressable
          onPress={onPress}
          accessibilityRole="button"
          accessibilityLabel={label}
          accessibilityHint="Returns view to the current day"
          className="flex-row items-center gap-1"
        >
          <MaterialCommunityIcons
            name="chevron-left"
            size={18}
            color={textColor}
          />
          <Text
            className="happy-font-body-medium text-sm"
            style={{ color: textColor }}
          >
            {label}
          </Text>
        </Pressable>
      </Animated.View>
    );
  }
);

export default TodayPill;

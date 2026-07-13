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
            backgroundColor,
          },
          containerStyle,
          animatedStyle,
        ]}
        className="flex-row items-center rounded-full px-2 py-0.5 border border-sage-200/60 shadow-xs"
        pointerEvents={pointerEvents}
      >
        <Pressable
          onPress={onPress}
          accessibilityRole="button"
          accessibilityLabel={label}
          accessibilityHint="Returns view to the current day"
          className="flex-row items-center gap-0.5"
        >
          <MaterialCommunityIcons
            name="chevron-left"
            size={16}
            color={textColor}
          />
          <Text
            className="happy-font-body-medium text-[13px]"
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

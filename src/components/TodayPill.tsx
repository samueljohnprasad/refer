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
            bottom: -14,
            borderTopLeftRadius: 16,
            borderBottomLeftRadius: 16,
            paddingHorizontal: 6,
            paddingVertical: 4,
            flexDirection: "row",
            alignItems: "center",
            zIndex: 100,
            backgroundColor: "#EDE9FE", // Soft lavender/light purple
          },
          containerStyle,
          animatedStyle,
        ]}
        pointerEvents={pointerEvents}
      >
        <Pressable
          onPress={onPress}
          accessibilityRole="button"
          accessibilityLabel={label}
          className="flex-row items-center"
        >
          <MaterialCommunityIcons name="chevron-left" size={18} color="#7B61FF" />
          <Text className="font-semibold" style={{ color: "#7B61FF" }}>{label}</Text>
        </Pressable>
      </Animated.View>
    );
  }
);

export default TodayPill;

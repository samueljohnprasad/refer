import React from "react";
import {
  Animated,
  Pressable,
  StyleSheet,
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
    backgroundColor = "#8B5CF6", // purple-500
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
          styles.pill,
          { backgroundColor },
          containerStyle,
          animatedStyle,
        ]}
        pointerEvents={pointerEvents}
      >
        <Pressable
          onPress={onPress}
          accessibilityRole="button"
          accessibilityLabel={label}
          style={styles.row}
        >
          <MaterialCommunityIcons name="chevron-left" size={18} color="white" />
          <Text style={[styles.text, { color: textColor }]}>{label}</Text>
        </Pressable>
      </Animated.View>
    );
  }
);

const styles = StyleSheet.create({
  pill: {
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
  },
  text: {
    fontWeight: "600",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
});

export default TodayPill;

import React from "react";
import {
  Animated,
  StyleSheet,
  View,
  Text as RNText,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { Text } from "../Themed";
import { Image } from "../ui/image";
import { great } from "@/assets/emojis";

export type MoodBadgeProps = {
  emoji?: string; // if undefined, show placeholder state
  active?: boolean; // highlighted ring for selected day
  size?: number; // diameter of badge
  containerStyle?: StyleProp<ViewStyle>;
};

export const MoodBadge: React.FC<MoodBadgeProps> = ({
  emoji,
  size = 32,
  containerStyle,
}) => {
  const diameter = size;
  const radius = diameter / 2;

  return (
    <Animated.View
      style={[styles.wrapper, containerStyle]}
      pointerEvents="none"
    >
      <View style={styles.outer} />
      <View
        style={{
          width: diameter,
          height: diameter,
          borderRadius: radius,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "rgba(0,0,0,0.06)",
        }}
      >
        {emoji && (
          // <RNText style={{ fontSize: size * 0.65, lineHeight: size * 0.8 }}>
          //   {emoji}
          // </RNText>
          <Image
            source={great}
            className="w-6 h-6"
            alt={emoji}
          />
        )}
        {!emoji && <Text>+</Text>}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    alignItems: "center",
    justifyContent: "center",
  },
  outer: {
    position: "absolute",
  },
});

export default MoodBadge;

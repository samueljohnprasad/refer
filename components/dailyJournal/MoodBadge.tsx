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
import { bad, fine, good, great, terrible } from "@/assets/emojis";
import { moodScoreToPale, clampToMoodScore } from "@/constants/moodColors";

export type MoodBadgeProps = {
  moodscore?: number;
  active?: boolean; // highlighted ring for selected day
  size?: number; // diameter of badge
  containerStyle?: StyleProp<ViewStyle>;
};

const moodEmojiMap = {
  1: terrible,
  2: bad,
  3: fine,
  4: good,
  5: great,
};

export const MoodBadge: React.FC<MoodBadgeProps> = ({
  moodscore,
  size = 32,
  containerStyle,
}) => {
  const diameter = size;
  const radius = diameter / 2;
  const moodEmoji = moodscore
    ? moodEmojiMap[moodscore as keyof typeof moodEmojiMap]
    : null;
  const bgColor =
    typeof moodscore === "number"
      ? moodScoreToPale(clampToMoodScore(moodscore))
      : "rgba(0,0,0,0.06)";
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
          backgroundColor: bgColor,
        }}
      >
        {moodEmoji && (
          // <RNText style={{ fontSize: size * 0.65, lineHeight: size * 0.8 }}>
          //   {emoji}
          // </RNText>
          <Image
            source={moodEmoji}
            alt={"moodEmoji"}
            style={{
              width: diameter,
              height: diameter,
            }}
            width={diameter}
            height={diameter}
          />
        )}
        {!moodEmoji && (
          <Text className="color-slate-700" style={{ color: "#334155" }}>
            +
          </Text>
        )}
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

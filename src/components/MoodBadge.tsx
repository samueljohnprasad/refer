import React from "react";
import {
  Animated,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { bad, fine, good, great, terrible } from "@/assets/emojis";
import { moodScoreToPale, clampToMoodScore } from "@/constants/moodColors";
import { Image } from "@/components/ui/image";
import { Text } from "@/components/Themed";
import { PressableOpacity } from "pressto";

export type MoodBadgeProps = {
  moodscore?: number;
  active?: boolean; // highlighted ring for selected day
  size?: number; // diameter of badge
  containerStyle?: StyleProp<ViewStyle>;
  onPress?: () => void;
};

const moodEmojiMap = {
  1: terrible,
  2: bad,
  3: fine,
  4: good,
  5: great,
};

export const MoodBadge: React.FC<MoodBadgeProps> = React.memo(
  ({ moodscore, size = 32, containerStyle, onPress }) => {
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
      <PressableOpacity
        style={{ width: diameter, height: diameter }}
        onPress={onPress}
      >
        <Animated.View style={[styles.wrapper, containerStyle]}>
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
              <Image
                source={moodEmoji}
                alt={"moodEmoji"}
                style={{
                  width: diameter,
                  height: diameter,
                }}
                width={diameter}
                height={diameter}
                progressiveRenderingEnabled={true}
              />
            )}
            {!moodEmoji && (
              <Text className="color-slate-700" style={{ color: "#334155" }}>
                +
              </Text>
            )}
          </View>
        </Animated.View>
      </PressableOpacity>
    );
  }
);

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

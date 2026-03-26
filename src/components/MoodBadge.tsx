import React from "react";
import {
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { bad, fine, good, great, terrible } from "@/assets/emojis";
import { Image } from "@/components/ui/image";
import { Text } from "@/components/Themed";
import { PressableOpacity } from "pressto";

export type MoodBadgeProps = {
  moodscore?: number;
  active?: boolean; // highlighted ring for selected day
  size?: number; // diameter of badge
  containerStyle?: StyleProp<ViewStyle>;
  onPress?: () => void;
  disabled: boolean;
};

const moodEmojiMap = {
  1: terrible,
  2: bad,
  3: fine,
  4: good,
  5: great,
};

export const MoodBadge: React.FC<MoodBadgeProps> = React.memo(
  ({ moodscore, size = 32, containerStyle, onPress, disabled, active = true }) => {
    const diameter = size;
    const radius = diameter / 2;
    const moodEmoji = moodscore
      ? moodEmojiMap[moodscore as keyof typeof moodEmojiMap]
      : null;
    return (
      <PressableOpacity
        style={{ width: diameter, height: diameter }}
        onPress={disabled ? undefined : onPress}
        accessibilityRole="button"
        accessibilityLabel={`Mood is ${
          moodscore ? Object.entries(moodEmojiMap).find(([key, val]) => val === moodEmoji)?.[0] : "Not set"
        }.`}
        accessibilityState={{ selected: active, disabled }}
      >
        <View className={`items-center justify-center ${!active ? 'opacity-50' : ''}`} style={containerStyle}>
          <View
            style={{
              width: diameter,
              height: diameter,
              borderRadius: radius,
            }}
            className={`items-center justify-center ${disabled ? "opacity-30" : ""}`}
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
            {!moodEmoji && <Text className="text-theme-text-secondary text-sm font-medium">+</Text>}
          </View>
        </View>
      </PressableOpacity>
    );
  }
);

export default MoodBadge;

import React from "react";
import {
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { bad, fine, good, great, terrible } from "@/assets/emojis";
import { Image } from "@/components/ui/image";
import { Text } from "@/components/Themed";
import { PressableOpacity } from "pressto";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { Add01Icon } from "@hugeicons/core-free-icons";

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

    const plusScale = useSharedValue(1);
    const plusRotation = useSharedValue(active ? 0 : -360);

    React.useEffect(() => {
      if (!moodEmoji) {
        if (active) {
          plusRotation.value = -360;
          plusRotation.value = withTiming(0, { duration: 400 });
        } else {
          plusRotation.value = -360;
        }
      }
    }, [active, moodEmoji, plusRotation]);

    const plusAnimatedStyle = useAnimatedStyle(() => ({
      transform: [
        { scale: plusScale.value },
        { rotate: `${plusRotation.value}deg` }
      ]
    }));

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
            {!moodEmoji && (
              <Animated.View style={[plusAnimatedStyle, { width: 16, height: 16, justifyContent: 'center', alignItems: 'center' }]}>
                <HugeiconsIcon
                  icon={Add01Icon}
                  size={16}
                  color="#64748B"
                  strokeWidth={2}
                />
              </Animated.View>
            )}
          </View>
        </View>
      </PressableOpacity>
    );
  }
);

export default MoodBadge;

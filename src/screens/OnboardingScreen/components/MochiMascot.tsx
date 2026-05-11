import React, { useEffect } from "react";
import { Image, ImageSourcePropType, View } from "react-native";
import Animated, {
  FadeInUp,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withDelay,
  Easing,
} from "react-native-reanimated";
import { MochiExpression } from "../types";

/* eslint-disable @typescript-eslint/no-require-imports */
const MASCOT_IMAGES: Record<MochiExpression, ImageSourcePropType> = {
  happy: require("@/assets/images/panda/panda-happy.png"),
  waving: require("@/assets/images/panda-hi.png"),
  concentrating: require("@/assets/images/panda/panda-confused-thinking.png"),
  celebrating: require("@/assets/images/panda/panda-super-excite.png"),
  peaceful: require("@/assets/images/panda/panda-love-hug.png"),
  notes: require("@/assets/images/panda/panda-notes.png"),
};

interface MochiMascotProps {
  expression: MochiExpression;
  size?: number;
  animate?: boolean;
  delay?: number;
}

const MochiMascot: React.FC<MochiMascotProps> = ({
  expression,
  size = 140,
  animate = true,
  delay = 0,
}) => {
  const floatY = useSharedValue(0);
  const breatheScale = useSharedValue(1);

  useEffect(() => {
    if (!animate) return;

    floatY.value = withDelay(
      delay + 600,
      withRepeat(
        withSequence(
          withTiming(-4, { duration: 1800, easing: Easing.inOut(Easing.sin) }),
          withTiming(4, { duration: 1800, easing: Easing.inOut(Easing.sin) }),
        ),
        0,
        true,
      ),
    );

    breatheScale.value = withDelay(
      delay + 600,
      withRepeat(
        withSequence(
          withTiming(1.02, {
            duration: 2200,
            easing: Easing.inOut(Easing.sin),
          }),
          withTiming(0.98, {
            duration: 2200,
            easing: Easing.inOut(Easing.sin),
          }),
        ),
        0,
        true,
      ),
    );
  }, [animate, delay]);

  const floatingStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: floatY.value }, { scale: breatheScale.value }],
  }));

  const content = (
    <Animated.View
      style={[
        { width: size, height: size },
        animate ? floatingStyle : undefined,
      ]}
      className="items-center justify-center"
    >
      <Image
        source={MASCOT_IMAGES[expression]}
        style={{ width: size * 0.9, height: size * 0.9 }}
        resizeMode="contain"
      />
    </Animated.View>
  );

  if (!animate) return content;

  return (
    <Animated.View entering={FadeInUp.delay(delay).duration(600)}>
      {content}
    </Animated.View>
  );
};

export default React.memo(MochiMascot);

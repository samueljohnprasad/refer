import React, { useEffect } from "react";
import { Image, ImageSourcePropType } from "react-native";
import Animated, { 
  FadeIn, 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withSequence, 
  withTiming, 
  Easing 
} from "react-native-reanimated";
import { HappiExpression } from "../types";

/* eslint-disable @typescript-eslint/no-require-imports */
// ponytail: map new high-res transparent panda actions directly to assets
const MASCOT_IMAGES: Record<HappiExpression, ImageSourcePropType> = {
  happy: require("@/assets/images/panda/panda-happy.png"),
  waving: require("@/assets/images/panda-hi.png"),
  concentrating: require("@/assets/images/panda/panda-confused-thinking.png"),
  celebrating: require("@/assets/images/panda/panda-super-excite.png"),
  celebrating_jump: require("@/assets/images/panda/panda-celebration.png"),
  peaceful: require("@/assets/images/panda/panda-love-hug.png"),
  notes: require("@/assets/images/panda/panda-notes.png"),
  breathing: require("@/assets/images/panda/panda-breathing.png"),
  detective: require("@/assets/images/panda/panda-detective.png"),
  comfort: require("@/assets/images/panda/panda-comfort.png"),
  insight: require("@/assets/images/panda/panda-insight.png"),
  sleep: require("@/assets/images/panda/panda-sleep.png"),
  proud_tears: require("@/assets/images/panda/panda-proud-tears.png"),
  pancake: require("@/assets/images/panda/panda-pancake.png"),
  side_eye: require("@/assets/images/panda/panda-side-eye.png"),
  flex: require("@/assets/images/panda/panda-flex.png"),
  transcend: require("@/assets/images/panda/panda-transcend.png"),
  pleading: require("@/assets/images/panda/panda-pleading.png"),
};

interface HappiMascotProps {
  expression: HappiExpression;
  size?: number;
  animate?: boolean;
  delay?: number;
}

const HappiMascot: React.FC<HappiMascotProps> = ({
  expression,
  size = 140,
  animate = true,
  delay = 0,
}) => {
  const translateY = useSharedValue(0);

  useEffect(() => {
    if (animate) {
      translateY.value = withRepeat(
        withSequence(
          withTiming(-4, { duration: 1500, easing: Easing.inOut(Easing.sin) }),
          withTiming(0, { duration: 1500, easing: Easing.inOut(Easing.sin) })
        ),
        -1,
        true
      );
    }
  }, [animate]);

  const floatingStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View
      entering={animate ? FadeIn.delay(delay).duration(220) : undefined}
      style={[{ width: size, height: size }, floatingStyle]}
      className="items-center justify-center"
    >
      <Image
        accessible={true}
        accessibilityLabel={`Happi the panda ${expression}`}
        source={MASCOT_IMAGES[expression]}
        style={{ width: size * 0.9, height: size * 0.9 }}
        resizeMode="contain"
      />
    </Animated.View>
  );
};

export default React.memo(HappiMascot);

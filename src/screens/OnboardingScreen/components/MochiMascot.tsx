import React from "react";
import { Image, ImageSourcePropType } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
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
  return (
    <Animated.View
      entering={animate ? FadeIn.delay(delay).duration(220) : undefined}
      style={{ width: size, height: size }}
      className="items-center justify-center"
    >
      <Image
        source={MASCOT_IMAGES[expression]}
        style={{ width: size * 0.9, height: size * 0.9 }}
        resizeMode="contain"
      />
    </Animated.View>
  );
};

export default React.memo(MochiMascot);

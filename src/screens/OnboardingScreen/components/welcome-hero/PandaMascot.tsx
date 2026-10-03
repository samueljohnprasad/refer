// ponytail: animated panda mascot with breathing loop, squash/stretch, and floating heart without ground shadow
import React from "react";
import { Image } from "react-native";
import Animated, {
  SharedValue,
  useAnimatedStyle,
  interpolate,
  Extrapolation,
} from "react-native-reanimated";
import Svg, { Path } from "react-native-svg";
import { PANDA, T } from "./constants";

interface PandaMascotProps {
  frame: SharedValue<number>;
  scale: number;
}

export function PandaMascot({ frame, scale }: PandaMascotProps): React.JSX.Element {
  const pandaWidth: number = PANDA.width * scale;
  const pandaLeft: number = PANDA.left * scale;
  const pandaTop: number = PANDA.top * scale;

  const pandaStyle = useAnimatedStyle(() => {
    const f: number = frame.value;
    const pandaIn: number = interpolate(
      f,
      [T.pandaAt, T.pandaAt + 22],
      [0, 1],
      Extrapolation.CLAMP
    );
    const phase: number = f / 50;
    const pandaBob: number = Math.sin(phase) * (9 * scale);
    const stretch: number = Math.cos(phase) * 0.025;
    const pandaTilt: number = Math.sin(phase * 0.47 + 1.3) * 1.6;
    const landSquash: number = interpolate(
      f,
      [T.pandaAt, T.pandaAt + 7, T.pandaAt + 16],
      [0, 1, 0],
      Extrapolation.CLAMP
    );
    const scaleY: number = Math.max(pandaIn, 0) * (1 + stretch - landSquash * 0.1);
    const scaleX: number = Math.max(pandaIn, 0) * (1 - stretch * 0.6 + landSquash * 0.14);
    const translateY: number = (1 - pandaIn) * (46 * scale) + pandaBob;

    return {
      opacity: pandaIn,
      transform: [
        { translateY },
        { rotate: `${pandaTilt}deg` },
        { scaleX },
        { scaleY },
      ],
    };
  });

  const heartStyle = useAnimatedStyle(() => {
    const f: number = frame.value;
    const at: number = T.pandaAt + 14;
    if (f < at) return { opacity: 0 };
    const cycle: number = ((f - at) % 70) / 70;
    const rise: number = interpolate(cycle, [0, 1], [0, -46 * scale], Extrapolation.CLAMP);
    const opacity: number = interpolate(cycle, [0, 0.15, 0.75, 1], [0, 1, 1, 0], Extrapolation.CLAMP);

    return {
      opacity,
      transform: [{ translateY: rise }],
    };
  });

  return (
    <>
      {/* Floating pink heart */}
      <Animated.View
        style={[
          {
            position: "absolute",
            left: pandaLeft + pandaWidth * 0.78,
            top: pandaTop - 24 * scale,
            width: 30 * scale,
            height: 26 * scale,
          },
          heartStyle,
        ]}
        pointerEvents="none"
      >
        <Svg width="100%" height="100%" viewBox="-15 -13 30 26">
          <Path
            d="M 0 8 C -15 -1 -6.5 -13 0 -3 C 6.5 -13 15 -1 0 8 Z"
            fill="#F25C68"
          />
        </Svg>
      </Animated.View>

      {/* Animated Panda */}
      <Animated.View
        style={[
          {
            position: "absolute",
            left: pandaLeft,
            top: pandaTop,
            width: pandaWidth,
            height: pandaWidth,
          },
          pandaStyle,
        ]}
      >
        <Image
          source={require("@/assets/images/panda/panda-happy.png")}
          style={{ width: pandaWidth, height: pandaWidth }}
          resizeMode="contain"
        />
      </Animated.View>
    </>
  );
}

export default React.memo(PandaMascot);

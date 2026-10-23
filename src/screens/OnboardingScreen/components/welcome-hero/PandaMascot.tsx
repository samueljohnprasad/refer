// ponytail: clean stable video mascot with gentle floating heart, no artificial video zoom/stretch
import React from "react";
import { View } from "react-native";
import { VideoView, useVideoPlayer } from "expo-video";
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
  const player = useVideoPlayer(
    require("@/assets/video/onboarding-welcome-panda.mov"),
    (videoPlayer) => {
      videoPlayer.loop = true;
      videoPlayer.muted = true;
      videoPlayer.play();
    },
  );

  const pandaWidth: number = PANDA.width * scale;
  const pandaLeft: number = PANDA.left * scale;
  const pandaTop: number = PANDA.top * scale;

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

      {/* Stable Video Mascot (no artificial scale/stretch/zoom) */}
      <View
        style={{
          position: "absolute",
          left: pandaLeft,
          top: pandaTop,
          width: pandaWidth,
          height: pandaWidth,
        }}
        pointerEvents="none"
      >
        <VideoView
          player={player}
          style={{ width: pandaWidth, height: pandaWidth }}
          contentFit="contain"
          nativeControls={false}
          allowsPictureInPicture={false}
          accessible
          accessibilityLabel="Happi the panda"
        />
      </View>
    </>
  );
}

export default React.memo(PandaMascot);

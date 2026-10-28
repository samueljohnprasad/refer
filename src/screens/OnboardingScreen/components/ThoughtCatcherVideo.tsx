// ponytail: Duolingo-grade thought catcher micro-win video player
import React from "react";
import { VideoView, useVideoPlayer } from "expo-video";
import Animated, { FadeIn } from "react-native-reanimated";

type ThoughtCatcherVideoProps = {
  width?: number;
  height?: number;
  loop?: boolean;
};

export function ThoughtCatcherVideo({
  width = 88,
  height = 156,
  loop = true,
}: ThoughtCatcherVideoProps): React.JSX.Element {
  const player = useVideoPlayer(
    require("@/assets/video/panda-thought-catcher.mp4"),
    (videoPlayer) => {
      videoPlayer.loop = loop;
      videoPlayer.muted = true;
      videoPlayer.play();
    },
  );

  return (
    <Animated.View
      entering={FadeIn.duration(260)}
      style={{ width, height, borderRadius: 16, overflow: "hidden" }}
      className="items-center justify-center bg-sage-50 border border-sage-200"
    >
      <VideoView
        player={player}
        style={{ width: "100%", height: "100%" }}
        contentFit="cover"
        nativeControls={false}
        accessible
        accessibilityLabel="Happi catching the thought cloud and releasing an insight butterfly"
        pointerEvents="none"
      />
    </Animated.View>
  );
}

export default React.memo(ThoughtCatcherVideo);

import React from "react";
import { VideoView, useVideoPlayer } from "expo-video";
import Animated, { FadeIn } from "react-native-reanimated";

type OnboardingPandaAnimationProps = {
  size?: number;
  delay?: number;
};

export function OnboardingPandaAnimation({
  size = 112,
  delay = 0,
}: OnboardingPandaAnimationProps): React.JSX.Element {
  const player = useVideoPlayer(
    require("@/assets/video/onboarding-welcome-panda.mov"),
    (videoPlayer) => {
      videoPlayer.loop = true;
      videoPlayer.muted = true;
      videoPlayer.play();
    },
  );

  return (
    <Animated.View
      entering={FadeIn.delay(delay).duration(220)}
      style={{ width: size, height: size }}
      className="items-center justify-center"
    >
      <VideoView
        player={player}
        style={{ width: size, height: size }}
        contentFit="contain"
        nativeControls={false}
        accessible
        accessibilityLabel="Happi the panda"
        pointerEvents="none"
      />
    </Animated.View>
  );
}

export default React.memo(OnboardingPandaAnimation);

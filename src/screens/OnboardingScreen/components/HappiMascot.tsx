import React from "react";
import { Image, ImageSourcePropType } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
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
  self_hug: require("@/assets/images/panda/panda-self-hug.png"),
  high_five: require("@/assets/images/panda/panda-high-five.png"),
  pondering: require("@/assets/images/panda/panda-pondering.png"),
  shield: require("@/assets/images/panda/panda-shield.png"),
  sprout: require("@/assets/images/panda/panda-sprout.png"),
  journaling: require("@/assets/images/panda/panda-journaling.png"),
  umbrella: require("@/assets/images/panda/panda-umbrella.png"),
  heart_bandage: require("@/assets/images/panda/panda-heart-bandage.png"),
  lantern: require("@/assets/images/panda/panda-lantern.png"),
  bubble: require("@/assets/images/panda/panda-bubble.png"),
  tea: require("@/assets/images/panda/panda-tea.png"),
  cheer: require("@/assets/images/panda/panda-cheer.png"),
  coping_card: require("@/assets/images/panda/panda-coping-card.png"),
  habit: require("@/assets/images/panda/panda-habit.png"),
  analyst: require("@/assets/images/panda/panda-analyst.png"),
  explorer: require("@/assets/images/panda/panda-explorer.png"),
  flag_milestone: require("@/assets/images/panda/panda-flag-milestone.png"),
  milestone: require("@/assets/images/panda/panda-milestone.png"),
  sage: require("@/assets/images/panda/panda-sage.png"),
  target: require("@/assets/images/panda/panda-target.png"),
  bell: require("@/assets/images/panda/panda-bell.png"),
  headset: require("@/assets/images/panda/panda-headset.png"),
  nametag: require("@/assets/images/panda/panda-nametag.png"),
  toolkit: require("@/assets/images/panda/panda-toolkit.png"),
  stopwatch: require("@/assets/images/panda/panda-stopwatch.png"),
  paper_plane: require("@/assets/images/panda/panda-paper-plane.png"),
  caution: require("@/assets/images/panda/panda-caution.png"),
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
  // ponytail: kill generic floating slop - mascot stays firmly anchored like Duolingo Duo
  return (
    <Animated.View
      entering={animate ? FadeIn.delay(delay).duration(200) : undefined}
      style={{ width: size, height: size }}
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

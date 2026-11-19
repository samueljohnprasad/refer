// ponytail: live Happi stage (hero/corner/ask contexts) — replaces the static HappiGuideStage.
// One rig + one thought-cloud, cropped to the prototype's own viewBoxes (.agents/onboarding.html's
// VB_FULL/VB_ASK), driven by a live useHappiGuideMotion() instance owned by the caller.
import React from 'react';
import { View } from 'react-native';
import Svg from 'react-native-svg';
import { HappiRig } from '@/src/components/ui/happy-scene/HappiRig';
import { useHappiAnimatedProps } from '../../containers/useHappiAnimatedProps';
import type { HappiGuideMotion } from '../../containers/useHappiGuideMotion';
import { ThoughtCloud } from './ThoughtCloud';

const VIEWBOX = {
  full: '10 10 280 250',
  ask: '20 10 195 250',
  // Home (.agents/home.html): full-body figure in the scene (native rig box, aspect-ratio 220/246 per
  // `.scene .happi` css). The account-sheet hero avatar reuses the existing HappiIcon head-crop instead.
  scene: '20 4 220 246',
} as const;

export interface HappiStageProps {
  motion: HappiGuideMotion;
  size: keyof typeof VIEWBOX;
  width?: number;
}

export function HappiStage({ motion, size, width = 220 }: HappiStageProps): React.JSX.Element {
  const { rigProps, cloudProps } = useHappiAnimatedProps(motion.pose);
  return (
    <View style={{ width, aspectRatio: 1 }} accessible={false}>
      <Svg viewBox={VIEWBOX[size]} width="100%" height="100%">
        <HappiRig {...rigProps} scene={motion.scene} />
        <ThoughtCloud {...cloudProps} />
      </Svg>
    </View>
  );
}

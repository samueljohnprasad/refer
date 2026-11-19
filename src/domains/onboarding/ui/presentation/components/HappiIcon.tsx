// ponytail: static head-crop Happi icon (goal tiles, saved-card sticker) — replaces the hand-drawn
// HappiHeadSvg. Same rig/pose pipeline as HappiStage, just a frozen frame instead of a ticking clock, so
// tile icons and the full-body stage can never visually drift from each other.
import React from 'react';
import Svg from 'react-native-svg';
import { useDerivedValue } from 'react-native-reanimated';
import { HappiRig } from '@/src/components/ui/happy-scene/HappiRig';
import { NEUTRAL, POSES, type PoseKey } from '../../containers/happiPoses';
import { keysFor, channelsToRig, channelsToCloud } from '../../containers/happiMotionEngine';
import { useHappiAnimatedProps } from '../../containers/useHappiAnimatedProps';
import { ThoughtCloud } from './ThoughtCloud';
import type { HappiMatrices } from '../../containers/useHappiGuideMotion';

const VIEWBOX = '20 20 195 155';

export interface HappiIconProps {
  pose: PoseKey;
  size?: number;
}

export function HappiIcon({ pose: poseKey, size = 58 }: HappiIconProps): React.JSX.Element {
  const pose = useDerivedValue<HappiMatrices>(() => {
    const row = POSES[poseKey];
    const keys = keysFor(NEUTRAL, row);
    return {
      rig: channelsToRig(keys, {}, row.hold, 0, 0),
      cloud: channelsToCloud(row.f ?? NEUTRAL.f, 0),
    };
  }, [poseKey]);

  const { rigProps, cloudProps } = useHappiAnimatedProps(pose);
  return (
    <Svg viewBox={VIEWBOX} width={size} height={size} accessible={false}>
      <HappiRig {...rigProps} />
      <ThoughtCloud {...cloudProps} />
    </Svg>
  );
}

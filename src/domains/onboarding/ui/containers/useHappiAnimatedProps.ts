// ponytail: wires one HappiMatrices derived value into HappiRig's + ThoughtCloud's AnimatedProps slots.
// Shared by HappiStage (live, ticking) and HappiIcon (static) so the wiring exists exactly once.
import { useAnimatedProps, type DerivedValue } from 'react-native-reanimated';
import type { HappiRigProps } from '@/src/components/ui/happy-scene/HappiRig';
import type { HappiPropsKit } from '@/src/components/ui/happy-scene/HappiProps';
import type { ThoughtCloudProps } from '../presentation/components/ThoughtCloud';
import type { HappiMatrices } from './useHappiGuideMotion';

type AnyProps = Record<string, unknown>;

export function useHappiAnimatedProps(pose: DerivedValue<HappiMatrices>): {
  rigProps: HappiRigProps;
  cloudProps: ThoughtCloudProps;
} {
  const shadowProps = useAnimatedProps<AnyProps>(() => ({ matrix: pose.value.rig.shadow }));
  const rootProps = useAnimatedProps<AnyProps>(() => ({ matrix: pose.value.rig.root }));
  const bodyProps = useAnimatedProps<AnyProps>(() => ({ matrix: pose.value.rig.body }));
  const heartProps = useAnimatedProps<AnyProps>(() => ({ matrix: pose.value.rig.heart }));
  const armLProps = useAnimatedProps<AnyProps>(() => ({ matrix: pose.value.rig.armL }));
  const armLFrontProps = useAnimatedProps<AnyProps>(() => ({ matrix: pose.value.rig.armLFront }));
  const foreLProps = useAnimatedProps<AnyProps>(() => ({ matrix: pose.value.rig.foreL }));
  const padProps = useAnimatedProps<AnyProps>(() => ({ opacity: 0 }));
  const armRProps = useAnimatedProps<AnyProps>(() => ({ matrix: pose.value.rig.armR }));
  const foreRProps = useAnimatedProps<AnyProps>(() => ({ matrix: pose.value.rig.foreR }));
  const headProps = useAnimatedProps<AnyProps>(() => ({ matrix: pose.value.rig.head }));
  const earLProps = useAnimatedProps<AnyProps>(() => ({ matrix: pose.value.rig.earL }));
  const earRProps = useAnimatedProps<AnyProps>(() => ({ matrix: pose.value.rig.earR }));
  const faceProps = useAnimatedProps<AnyProps>(() => ({ matrix: pose.value.rig.face }));
  const eyesProps = useAnimatedProps<AnyProps>(() => ({ matrix: pose.value.rig.eyes, opacity: pose.value.rig.eyesOpacity }));
  const pupilsProps = useAnimatedProps<AnyProps>(() => ({ matrix: pose.value.rig.pupils }));
  const pupilLProps = useAnimatedProps<AnyProps>(() => ({ matrix: pose.value.rig.pupilL }));
  const pupilRProps = useAnimatedProps<AnyProps>(() => ({ matrix: pose.value.rig.pupilR }));
  const smileProps = useAnimatedProps<AnyProps>(() => ({ opacity: pose.value.rig.smileOpacity }));
  const mouthOpenProps = useAnimatedProps<AnyProps>(() => ({
    matrix: pose.value.rig.mouthOpenMatrix, opacity: pose.value.rig.mouthOpenOpacity,
  }));
  const happyProps = useAnimatedProps<AnyProps>(() => ({ opacity: pose.value.rig.happyOpacity }));

  const stageProps = useAnimatedProps<AnyProps>(() => ({ matrix: pose.value.rig.stage }));
  const propsKit: HappiPropsKit = {
    propL: useAnimatedProps<AnyProps>(() => ({ matrix: pose.value.rig.propL.matrix, opacity: pose.value.rig.propL.opacity })),
    propR: useAnimatedProps<AnyProps>(() => ({ matrix: pose.value.rig.propR.matrix, opacity: pose.value.rig.propR.opacity })),
    swayL: useAnimatedProps<AnyProps>(() => ({ matrix: pose.value.rig.propL.sway })),
    swayR: useAnimatedProps<AnyProps>(() => ({ matrix: pose.value.rig.propR.sway })),
    bob: useAnimatedProps<AnyProps>(() => ({ matrix: pose.value.rig.detail.bob })),
    glow: useAnimatedProps<AnyProps>(() => ({ matrix: pose.value.rig.detail.glow })),
    flame: useAnimatedProps<AnyProps>(() => ({ matrix: pose.value.rig.detail.flame })),
    cloth: useAnimatedProps<AnyProps>(() => ({ matrix: pose.value.rig.detail.cloth })),
    drop0: useAnimatedProps<AnyProps>(() => ({ matrix: pose.value.rig.detail.drops[0].matrix, opacity: pose.value.rig.detail.drops[0].opacity })),
    drop1: useAnimatedProps<AnyProps>(() => ({ matrix: pose.value.rig.detail.drops[1].matrix, opacity: pose.value.rig.detail.drops[1].opacity })),
    drop2: useAnimatedProps<AnyProps>(() => ({ matrix: pose.value.rig.detail.drops[2].matrix, opacity: pose.value.rig.detail.drops[2].opacity })),
    sprout: useAnimatedProps<AnyProps>(() => ({ matrix: pose.value.rig.detail.sprout })),
  };

  const sunProps = useAnimatedProps<AnyProps>(() => ({ matrix: pose.value.cloud.sun, opacity: pose.value.cloud.sunOpacity }));
  const raysProps = useAnimatedProps<AnyProps>(() => ({ matrix: pose.value.cloud.rays }));
  const cloudProps = useAnimatedProps<AnyProps>(() => ({ matrix: pose.value.cloud.cloud, fill: pose.value.cloud.cloudFill }));
  const c0Props = useAnimatedProps<AnyProps>(() => ({ matrix: pose.value.cloud.c0, opacity: pose.value.cloud.puffOpacity }));
  const c1Props = useAnimatedProps<AnyProps>(() => ({ matrix: pose.value.cloud.c1, opacity: pose.value.cloud.puffOpacity }));
  const c2Props = useAnimatedProps<AnyProps>(() => ({ matrix: pose.value.cloud.c2, opacity: pose.value.cloud.puffOpacity }));
  const c3Props = useAnimatedProps<AnyProps>(() => ({ opacity: pose.value.cloud.c3Opacity }));

  return {
    rigProps: {
      shadowProps, rootProps, bodyProps, heartProps, armLProps, armLFrontProps, foreLProps, padProps,
      armRProps, foreRProps, headProps, earLProps, earRProps, faceProps, eyesProps, pupilsProps,
      pupilLProps, pupilRProps, smileProps, mouthOpenProps, happyProps, stageProps, propsKit,
    },
    cloudProps: { sunProps, raysProps, cloudProps, c0Props, c1Props, c2Props, c3Props },
  };
}

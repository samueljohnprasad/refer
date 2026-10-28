// ponytail: full-screen interactive HappyScene featuring articulated Happi puppet matching Screenshot 2
import React, { useEffect, useState } from "react";
import { AppState } from "react-native";
import Svg, { G, SvgXml, type GProps } from "react-native-svg";
import Animated, {
  useAnimatedProps,
  useDerivedValue,
  useFrameCallback,
  useSharedValue,
} from "react-native-reanimated";
import { useReducedMotion } from "@/src/hooks/useReducedMotion";
import { scenery } from "./art";
import { HappiRig } from "./HappiRig";
import { getHappyPose, SCENE, type Matrix } from "./pose";

type AnimatedGProps = GProps & { matrix?: Matrix };
const AnimatedGroup = Animated.createAnimatedComponent(G);
const sceneXml = (content: string): string =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 390 844">${content}</svg>`;

export function HappyScene({ live = true }: { live?: boolean }): React.JSX.Element {
  const reducedMotion = useReducedMotion();
  const [isForeground, setIsForeground] = useState(AppState.currentState === "active");
  const clock = useSharedValue(0);

  useEffect(() => {
    const listener = AppState.addEventListener("change", state => setIsForeground(state === "active"));
    return () => listener.remove();
  }, []);

  const frame = useFrameCallback(({ timeSincePreviousFrame }) => {
    clock.value += Math.min(timeSincePreviousFrame ?? 0, 64);
  }, false);

  useEffect(() => {
    frame.setActive(live && isForeground && !reducedMotion);
    return () => frame.setActive(false);
  }, [frame, isForeground, live, reducedMotion]);

  const pose = useDerivedValue(
    () =>
      getHappyPose(
        reducedMotion ? SCENE.duration : clock.value,
        reducedMotion ? 0 : clock.value,
      ),
    [reducedMotion],
  );

  // Scenery animated matrices
  const cloudProps = useAnimatedProps<AnimatedGProps>(() => ({ matrix: pose.value.cloud }), [live]);
  const plantProps = useAnimatedProps<AnimatedGProps>(() => ({ matrix: pose.value.plant }), [live]);

  // Character animated matrices
  const shadowProps = useAnimatedProps<AnimatedGProps>(() => ({ matrix: pose.value.shadow }), [live]);
  const rootProps = useAnimatedProps<AnimatedGProps>(() => ({ matrix: pose.value.root }), [live]);
  const bodyProps = useAnimatedProps<AnimatedGProps>(() => ({ matrix: pose.value.body }), [live]);
  const heartProps = useAnimatedProps<AnimatedGProps>(() => ({ matrix: pose.value.heart }), [live]);
  const armLProps = useAnimatedProps<AnimatedGProps>(() => ({ matrix: pose.value.armL }), [live]);
  const armRProps = useAnimatedProps<AnimatedGProps>(() => ({ matrix: pose.value.armR }), [live]);
  const headProps = useAnimatedProps<AnimatedGProps>(() => ({ matrix: pose.value.head }), [live]);
  const earLProps = useAnimatedProps<AnimatedGProps>(() => ({ matrix: pose.value.earL }), [live]);
  const earRProps = useAnimatedProps<AnimatedGProps>(() => ({ matrix: pose.value.earR }), [live]);
  const faceProps = useAnimatedProps<AnimatedGProps>(() => ({ matrix: pose.value.face }), [live]);
  const cheeksProps = useAnimatedProps<AnimatedGProps>(() => ({ matrix: pose.value.cheeks }), [live]);
  const eyesProps = useAnimatedProps<AnimatedGProps>(() => ({ matrix: pose.value.eyes }), [live]);
  const pupilsProps = useAnimatedProps<AnimatedGProps>(() => ({ matrix: pose.value.pupils }), [live]);

  return (
    <Svg width="100%" height="100%" viewBox="0 0 390 844" preserveAspectRatio="xMidYMid slice" accessible={false}>
      {/* Calm Sage Hills Background */}
      <SvgXml xml={sceneXml(scenery.background)} width={390} height={844} />

      {/* Drifting Clouds */}
      <AnimatedGroup animatedProps={cloudProps}>
        <SvgXml xml={sceneXml(scenery.cloud)} width={390} height={844} />
      </AnimatedGroup>

      {/* Swaying Side Plant */}
      <AnimatedGroup animatedProps={plantProps}>
        <SvgXml xml={sceneXml(scenery.plant)} width={390} height={844} />
      </AnimatedGroup>

      {/* Articulated Happi Rig on Floor matching Screenshot 2 100% */}
      <G
        transform={`translate(195 ${SCENE.floor}) scale(${SCENE.scale}) translate(-${SCENE.pivotX} -${SCENE.pivotY})`}
      >
        <HappiRig
          shadowProps={shadowProps}
          rootProps={rootProps}
          bodyProps={bodyProps}
          heartProps={heartProps}
          armLProps={armLProps}
          armRProps={armRProps}
          headProps={headProps}
          earLProps={earLProps}
          earRProps={earRProps}
          faceProps={faceProps}
          cheeksProps={cheeksProps}
          eyesProps={eyesProps}
          pupilsProps={pupilsProps}
        />
      </G>
    </Svg>
  );
}

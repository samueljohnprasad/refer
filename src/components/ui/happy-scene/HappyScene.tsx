import React, { memo, useEffect, useState } from "react";
import { AppState } from "react-native";
import Svg, { G, SvgXml } from "react-native-svg";
import Animated, { useAnimatedProps, useDerivedValue, useFrameCallback, useSharedValue, type SharedValue } from "react-native-reanimated";
import { useReducedMotion } from "@/src/hooks/useReducedMotion";
import { scenery, svgLayer } from "./art";
import { HAPPY_LAYERS, type HappyLayer } from "./layers";
import { getHappyPose, matrix, SCENE, type HappyPose } from "./pose";

const AnimatedGroup = Animated.createAnimatedComponent(G);
const xml = (content: string): string => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 390 844">${content}</svg>`;

const RigLayer = memo(function RigLayer({ layer, pose }: { layer: HappyLayer; pose: SharedValue<HappyPose> }) {
  const props = useAnimatedProps(() => ({ matrix: layer.pose ? pose.value[layer.pose] : matrix() }));
  return (
    <AnimatedGroup animatedProps={props}>
      {layer.art && <SvgXml xml={svgLayer(layer.art)} width={240} height={240} />}
      {layer.children?.map((child, index) => <RigLayer key={index} layer={child} pose={pose} />)}
    </AnimatedGroup>
  );
});

export function HappyScene({ live = true }: { live?: boolean }): React.JSX.Element {
  const reduced = useReducedMotion();
  const [foreground, setForeground] = useState(AppState.currentState === "active");
  const clock = useSharedValue(0);
  useEffect(() => {
    const listener = AppState.addEventListener("change", state => setForeground(state === "active"));
    return () => listener.remove();
  }, []);
  const frame = useFrameCallback(({ timeSincePreviousFrame }) => {
    clock.value += Math.min(timeSincePreviousFrame ?? 0, 64);
  }, false);
  useEffect(() => {
    frame.setActive(live && foreground && !reduced);
    return () => frame.setActive(false);
  }, [frame, foreground, live, reduced]);
  const pose = useDerivedValue(() => getHappyPose(reduced ? SCENE.duration : clock.value, reduced ? 0 : clock.value), [reduced]);
  const cloud = useAnimatedProps(() => ({ matrix: pose.value.cloud }), [live]);
  const plant = useAnimatedProps(() => ({ matrix: pose.value.plant }), [live]);
  return (
    <Svg width="100%" height="100%" viewBox="0 0 390 844" preserveAspectRatio="xMidYMid slice" accessible={false}>
      <SvgXml xml={xml(scenery.background)} width={390} height={844} />
      <AnimatedGroup animatedProps={cloud}><SvgXml xml={xml(scenery.cloud)} width={390} height={844} /></AnimatedGroup>
      <AnimatedGroup animatedProps={plant}><SvgXml xml={xml(scenery.plant)} width={390} height={844} /></AnimatedGroup>
      <G transform={`translate(195 ${SCENE.floor}) scale(${SCENE.scale}) translate(-120 -226)`}>
        {HAPPY_LAYERS.map((layer, index) => <RigLayer key={index} layer={layer} pose={pose} />)}
      </G>
    </Svg>
  );
}

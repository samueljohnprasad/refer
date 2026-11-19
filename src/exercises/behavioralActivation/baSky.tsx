// ponytail: the feeling as weather (.agents/behavioral-activation.html's SKY): `heat` 0..1 shrinks the sun,
// darkens and grows the cloud, adds a brow, a frown and rain. Pure presentation; rain falls (FallingRain).
import React from "react";
import Svg, { Circle, G, Line, Path, Rect } from "react-native-svg";
import Animated, { Easing, useAnimatedProps, useReducedMotion, useSharedValue, withRepeat, withTiming } from "react-native-reanimated";
import { FallingRain } from "@/src/components/exercise/FallingRain";

const AnimatedG = Animated.createAnimatedComponent(G);

// ponytail: the prototype's markup has a `bob` group but no keyframes of its own; same loops as Fear Ladder
// (4s bob, 30s ray spin), still when motion is reduced.
function useLoop(ms: number) {
  const still = useReducedMotion();
  const p = useSharedValue(0);
  React.useEffect(() => {
    if (still) return;
    p.value = withRepeat(withTiming(1, { duration: ms, easing: Easing.linear }), -1);
  }, [still, p, ms]);
  return p;
}

const RAYS = Array.from({ length: 8 }, (_, i) => {
  const a = (i * Math.PI) / 4;
  const c = Math.cos(a);
  const n = Math.sin(a);
  return { x1: Math.round(140 + c * 32), y1: Math.round(46 + n * 32), x2: Math.round(140 + c * 40), y2: Math.round(46 + n * 40) };
});
const CLOUD_LO = [228, 238, 224];
const CLOUD_HI = [169, 191, 160];
const mix = (t: number) => `rgb(${CLOUD_LO.map((v, i) => Math.round(v + (CLOUD_HI[i] - v) * t)).join(",")})`;

export function BaSky({ heat, width = 200 }: { heat: number; width?: number }): React.JSX.Element {
  const f = Math.min(1, Math.max(0, heat));
  const bobP = useLoop(4000);
  const spinP = useLoop(30000);
  const bob = useAnimatedProps(() => ({ translateY: -4 * Math.sin(Math.PI * bobP.value) }));
  const spin = useAnimatedProps(() => ({ rotation: spinP.value * 360 }));
  return (
    <Svg width={width} height={width * 0.65} viewBox="0 0 200 130">
      <G opacity={1 - f} translateY={f * 14}>
        <Circle cx={140} cy={46} r={24} fill="#f5b942" />
        <AnimatedG origin="140, 46" animatedProps={spin}>
          {RAYS.map((r, i) => <Line key={i} {...r} stroke="#f5b942" strokeWidth={4} strokeLinecap="round" />)}
        </AnimatedG>
      </G>
      <AnimatedG animatedProps={bob}>
      <G origin="96, 102" scale={0.72 + 0.28 * f}>
        <G fill={mix(f)}>
          <Circle cx={64} cy={78} r={24} />
          <Circle cx={96} cy={62} r={30} />
          <Circle cx={130} cy={80} r={22} />
          <Rect x={40} y={78} width={112} height={24} rx={12} />
        </G>
      </G>
      <Circle cx={86} cy={80} r={3.5} fill="#142414" />
      <Circle cx={112} cy={80} r={3.5} fill="#142414" />
      <Path d="M80 72L92 75M118 72L106 75" stroke="#142414" strokeWidth={3} strokeLinecap="round" opacity={Math.max(0, (f - 0.6) * 2.5)} />
      <Path d="M91 91Q99 99 107 91" fill="none" stroke="#142414" strokeWidth={3} strokeLinecap="round" transform={`translate(99 95) scale(1 ${1 - 2 * f}) translate(-99 -95)`} />
      <FallingRain opacity={Math.max(0, (f - 0.55) * 2.2)} color="#44633f" />
      </AnimatedG>
    </Svg>
  );
}

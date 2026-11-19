// ponytail: direct react-native-svg port of .agents/fear-ladder.html's two drawings, geometry and colours
// verbatim: SKY (the cloud that darkens and rains as the number rises) and LADDER (a cloud at the foot,
// the sun at the top, one rung lit per step). The prototype's loops are kept: cloud bob (4s), sun-ray spin
// (30s) and the falling rain; all stand still when motion is reduced.
import React from "react";
import Svg, { Circle, G, Line, Path, Rect } from "react-native-svg";
import Animated, { Easing, useAnimatedProps, useReducedMotion, useSharedValue, withRepeat, withTiming } from "react-native-reanimated";
import { FallingRain } from "@/src/components/exercise/FallingRain";

const SUN = "#f5b942";
const INK = "#142414";
const ACCENT = "#44633f";
const CLOUD_LO = [228, 238, 224];
const CLOUD_HI = [169, 191, 160];

const AnimatedG = Animated.createAnimatedComponent(G);

/** 0→1 repeating; stays at 0 when motion is reduced */
function useLoop(ms: number, easing: (t: number) => number = Easing.linear) {
  const still = useReducedMotion();
  const p = useSharedValue(0);
  React.useEffect(() => {
    if (still) return;
    p.value = withRepeat(withTiming(1, { duration: ms, easing }), -1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [still, p, ms]);
  return p;
}

/** prototype `bob`: 4s ease-in-out, up 4 at the midpoint */
function useBob() {
  const p = useLoop(4000);
  return useAnimatedProps(() => ({ translateY: -4 * Math.sin(Math.PI * p.value) }));
}

/** prototype `spin`: 30s linear, one turn about the sun's centre */
function useSpin() {
  const p = useLoop(30000);
  return useAnimatedProps(() => ({ rotation: p.value * 360 }));
}

const rays = (cx: number, cy: number, from: number, to: number) =>
  Array.from({ length: 8 }, (_, i) => {
    const a = (i * Math.PI) / 4;
    const c = Math.cos(a);
    const s = Math.sin(a);
    return { x1: Math.round(cx + c * from), y1: Math.round(cy + s * from), x2: Math.round(cx + c * to), y2: Math.round(cy + s * to) };
  });

const SKY_RAYS = rays(140, 46, 32, 40);
const SUN_RAYS = rays(172, 30, 20, 26);
const mix = (t: number) => `rgb(${CLOUD_LO.map((v, i) => Math.round(v + (CLOUD_HI[i] - v) * t)).join(",")})`;

const CloudBody = () => (
  <>
    <Circle cx={64} cy={78} r={24} />
    <Circle cx={96} cy={62} r={30} />
    <Circle cx={130} cy={80} r={22} />
    <Rect x={40} y={78} width={112} height={24} rx={12} />
  </>
);

/** `f` 0..1: how heavy it feels. Small cloud, sun and a smile at 0; big grey cloud, brow, frown and rain at 1. */
export function FLSky({ f, width = 200 }: { f: number; width?: number }): React.JSX.Element {
  const t = Math.min(1, Math.max(0, f));
  const bob = useBob();
  const spin = useSpin();
  return (
    <Svg width={width} height={(width * 130) / 200} viewBox="0 0 200 130" accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      <G opacity={1 - t} translateY={t * 14}>
        <Circle cx={140} cy={46} r={24} fill={SUN} />
        <AnimatedG origin="140, 46" animatedProps={spin}>
          {SKY_RAYS.map((r, i) => <Line key={i} {...r} stroke={SUN} strokeWidth={4} strokeLinecap="round" />)}
        </AnimatedG>
      </G>
      <AnimatedG animatedProps={bob}>
        <G origin="96, 102" scale={0.72 + 0.28 * t} fill={mix(t)}>
          <CloudBody />
        </G>
        <Circle cx={86} cy={80} r={3.5} fill={INK} />
        <Circle cx={112} cy={80} r={3.5} fill={INK} />
        <Path d="M80 72L92 75M118 72L106 75" stroke={INK} strokeWidth={3} strokeLinecap="round" opacity={Math.max(0, (t - 0.6) * 2.5)} />
        <Path d="M91 91Q99 99 107 91" fill="none" stroke={INK} strokeWidth={3} strokeLinecap="round" transform={`translate(99 95) scale(1 ${1 - 2 * t}) translate(-99 -95)`} />
        <FallingRain opacity={Math.max(0, (t - 0.55) * 2.2)} color={ACCENT} />
      </AnimatedG>
    </Svg>
  );
}

/** `n` rungs lit, 0..5 */
export function FLLadder({ n, width = 200 }: { n: number; width?: number }): React.JSX.Element {
  const bob = useBob();
  const spin = useSpin();
  return (
    <Svg width={width} height={(width * 130) / 200} viewBox="0 0 200 130" accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      <Circle cx={172} cy={30} r={14} fill={SUN} />
      <AnimatedG origin="172, 30" animatedProps={spin}>
        {SUN_RAYS.map((r, i) => <Line key={i} {...r} stroke={SUN} strokeWidth={3} strokeLinecap="round" />)}
      </AnimatedG>
      <Path d="M108 14V122M148 14V122" stroke={ACCENT} strokeWidth={4} strokeLinecap="round" />
      {[0, 1, 2, 3, 4].map((i) => (
        <Path key={i} d={`M108 ${106 - i * 20}H148`} stroke={i < n ? ACCENT : "#e5e5e5"} strokeWidth={4} strokeLinecap="round" />
      ))}
      <AnimatedG animatedProps={bob}>
        <G transform="translate(8 68) scale(.5)">
          <G fill={mix(0.6)}>
            <CloudBody />
          </G>
          <Circle cx={86} cy={80} r={3.5} fill={INK} />
          <Circle cx={112} cy={80} r={3.5} fill={INK} />
          <Path d="M91 91Q99 99 107 91" fill="none" stroke={INK} strokeWidth={4} strokeLinecap="round" />
        </G>
      </AnimatedG>
    </Svg>
  );
}

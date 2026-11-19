// ponytail: the prototype's `.rain` (three drops, `fall` 1.2s linear, each 0.4s behind the last). Render
// inside an <Svg viewBox="0 0 200 130">; static when reduced motion is on.
import React from "react";
import { G, Line } from "react-native-svg";
import Animated, { Easing, useAnimatedProps, useReducedMotion, useSharedValue, withRepeat, withTiming, type SharedValue } from "react-native-reanimated";

const AnimatedLine = Animated.createAnimatedComponent(Line);
const RAIN_X = [78, 98, 118];

function Drop({ x, delay, p, still, color }: { x: number; delay: number; p: SharedValue<number>; still: boolean; color: string }) {
  const props = useAnimatedProps(() => {
    if (still) return { y1: 108, y2: 113, opacity: 1 };
    const t = (p.value + 1 - delay / 1.2) % 1;
    const dy = -4 + 16 * t;
    return { y1: 108 + dy, y2: 113 + dy, opacity: t < 0.3 ? t / 0.3 : 1 - (t - 0.3) / 0.7 };
  });
  return <AnimatedLine x1={x} x2={x} stroke={color} strokeWidth={3} strokeLinecap="round" animatedProps={props} />;
}

/** `opacity` is how much rain the drawing wants (it grows with the feeling) */
export function FallingRain({ opacity, color = "#5f7f58" }: { opacity: number; color?: string }): React.JSX.Element {
  const still = useReducedMotion();
  const p = useSharedValue(0);
  React.useEffect(() => {
    if (still) return;
    p.value = withRepeat(withTiming(1, { duration: 1200, easing: Easing.linear }), -1);
  }, [still, p]);
  return (
    <G opacity={opacity}>
      {RAIN_X.map((x, i) => <Drop key={x} x={x} delay={i * 0.4} p={p} still={still} color={color} />)}
    </G>
  );
}

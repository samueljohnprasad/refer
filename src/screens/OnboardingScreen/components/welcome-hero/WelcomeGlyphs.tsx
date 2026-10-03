// ponytail: vector glyphs, gloss stripes, and checkmark matching remotion reference
import React from "react";
import Animated, {
  SharedValue,
  useAnimatedProps,
  interpolate,
  Extrapolation,
} from "react-native-reanimated";
import { G, Rect, Path, Circle, Line } from "react-native-svg";
import { IconKind, starPath } from "./constants";

const AnimatedPath = Animated.createAnimatedComponent(Path);

interface IconGlyphProps {
  icon: IconKind;
  color: string;
  size: number;
}

export function IconGlyph({ icon, color, size: s }: IconGlyphProps): React.JSX.Element {
  switch (icon) {
    case "lock":
      return (
        <G>
          <Rect
            x={-s * 0.26}
            y={-s * 0.02}
            width={s * 0.52}
            height={s * 0.42}
            rx={s * 0.08}
            fill={color}
          />
          <Path
            d={`M ${-s * 0.16} ${-s * 0.02} v ${-s * 0.14} a ${s * 0.16} ${s * 0.16} 0 0 1 ${s * 0.32} 0 v ${s * 0.14}`}
            fill="none"
            stroke={color}
            strokeWidth={s * 0.08}
            strokeLinecap="round"
          />
          <Circle cx={0} cy={s * 0.17} r={s * 0.05} fill="#FFFFFF" />
        </G>
      );
    case "star":
      return <Path d={starPath(s * 0.32, s * 0.14)} fill={color} />;
    case "heart":
      return (
        <Path
          d={`M 0 ${s * 0.26} C ${-s * 0.48} ${-s * 0.04} ${-s * 0.2} ${-s * 0.4} 0 ${-s * 0.08} C ${s * 0.2} ${-s * 0.4} ${s * 0.48} ${-s * 0.04} 0 ${s * 0.26} Z`}
          fill={color}
        />
      );
    case "pencil":
      return (
        <G transform="rotate(-40)">
          <Rect
            x={-s * 0.09}
            y={-s * 0.32}
            width={s * 0.18}
            height={s * 0.5}
            rx={s * 0.03}
            fill={color}
          />
          <Path
            d={`M ${-s * 0.09} ${-s * 0.32} L 0 ${-s * 0.48} L ${s * 0.09} ${-s * 0.32} Z`}
            fill={color}
          />
        </G>
      );
    case "leaf":
      return (
        <Path
          d={`M 0 ${s * 0.32} C ${-s * 0.34} ${s * 0.08} ${-s * 0.28} ${-s * 0.34} 0.02 ${-s * 0.34} C ${s * 0.32} ${-s * 0.32} ${s * 0.32} 0.14 0 ${s * 0.32} Z`}
          fill={color}
        />
      );
    case "sun":
      return (
        <G>
          <Circle r={s * 0.2} fill={color} />
          {Array.from({ length: 8 }, (_, i: number) => {
            const a: number = (i / 8) * Math.PI * 2;
            return (
              <Line
                key={i}
                x1={Math.cos(a) * s * 0.28}
                y1={Math.sin(a) * s * 0.28}
                x2={Math.cos(a) * s * 0.4}
                y2={Math.sin(a) * s * 0.4}
                stroke={color}
                strokeWidth={s * 0.055}
                strokeLinecap="round"
              />
            );
          })}
        </G>
      );
  }
}

export function CheckmarkGlyph({ checkR }: { checkR: number }): React.JSX.Element {
  return (
    <Path
      d={`M ${-checkR * 0.55} 0 L ${-checkR * 0.05} ${checkR * 0.5} L ${checkR * 0.6} ${-checkR * 0.5}`}
      fill="none"
      stroke="#FFFFFF"
      strokeWidth={checkR * 0.34}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  );
}

export interface AnimatedCheckmarkProps {
  checkR: number;
  frame: SharedValue<number>;
  nodeCompleteAt: number;
}

export function AnimatedCheckmark({
  checkR,
  frame,
  nodeCompleteAt,
}: AnimatedCheckmarkProps): React.JSX.Element {
  const checkLen: number = checkR * 1.95;
  const animatedProps = useAnimatedProps(() => {
    const f: number = frame.value;
    if (f < nodeCompleteAt + 2) {
      return { strokeDashoffset: checkLen, opacity: 0 };
    }
    const raw: number = interpolate(
      f,
      [nodeCompleteAt + 2, nodeCompleteAt + 16],
      [0, 1],
      Extrapolation.CLAMP
    );
    // Easing.out(Easing.cubic): 1 - (1 - t)^3
    const p: number = 1 - Math.pow(1 - raw, 3);
    return {
      strokeDashoffset: (1 - p) * checkLen,
      opacity: 1,
    };
  });

  return (
    <AnimatedPath
      d={`M ${-checkR * 0.55} 0 L ${-checkR * 0.05} ${checkR * 0.5} L ${checkR * 0.6} ${-checkR * 0.5}`}
      fill="none"
      stroke="#FFFFFF"
      strokeWidth={checkR * 0.34}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeDasharray={checkLen}
      animatedProps={animatedProps}
    />
  );
}

export function GlossStripes({
  faceRx,
  faceRy,
  screenScale,
  clipId,
}: {
  faceRx: number;
  faceRy: number;
  screenScale: number;
  clipId: string;
}): React.JSX.Element {
  return (
    <G clipPath={`url(#${clipId})`} opacity={0.3}>
      <Rect
        x={-faceRx - 20}
        y={-faceRy + 4}
        width={faceRx * 2 + 40}
        height={24 * screenScale}
        fill="#FFFFFF"
        transform="rotate(-45 0 0)"
      />
      <Rect
        x={-faceRx - 20}
        y={16 * screenScale}
        width={faceRx * 2 + 40}
        height={18 * screenScale}
        fill="#FFFFFF"
        transform="rotate(-45 0 0)"
      />
    </G>
  );
}

export default React.memo(IconGlyph);

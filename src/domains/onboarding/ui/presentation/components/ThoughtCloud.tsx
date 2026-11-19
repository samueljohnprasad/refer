// ponytail: thought-cloud prop (sun + rays + cloud puffs), ported from .agents/happi.js's build()/pose().
// Sibling to HappiRig inside the same <Svg>, not one of its transform-tree slots — it sits past the rig's
// default viewBox and only becomes visible when the host widens it (HappiStage's "full"/"ask" sizes do).
import React from 'react';
import Animated from 'react-native-reanimated';
import { Circle, G, Line, Rect } from 'react-native-svg';

const AnimatedGroup = Animated.createAnimatedComponent(G);
const RAY_COUNT = 8;

type AnimatedProps = Record<string, unknown>;

export interface ThoughtCloudProps {
  sunProps: AnimatedProps;
  raysProps: AnimatedProps;
  cloudProps: AnimatedProps;
  c0Props: AnimatedProps;
  c1Props: AnimatedProps;
  c2Props: AnimatedProps;
  c3Props: AnimatedProps;
}

export function ThoughtCloud(p: ThoughtCloudProps): React.JSX.Element {
  return (
    <G>
      <AnimatedGroup animatedProps={p.sunProps}>
        <AnimatedGroup animatedProps={p.raysProps} stroke="#F5B942" strokeWidth={3} strokeLinecap="round">
          {[...Array(RAY_COUNT)].map((_, i) => {
            const a = (i * Math.PI) / 4;
            return (
              <Line
                key={i}
                x1={(Math.cos(a) * 14).toFixed(1)}
                y1={(Math.sin(a) * 14).toFixed(1)}
                x2={(Math.cos(a) * 18).toFixed(1)}
                y2={(Math.sin(a) * 18).toFixed(1)}
              />
            );
          })}
        </AnimatedGroup>
        <Circle r={10} fill="#F5B942" />
      </AnimatedGroup>

      <AnimatedGroup animatedProps={p.cloudProps}>
        <AnimatedGroup animatedProps={p.c3Props}>
          <Rect x={220} y={29} width={50} height={12} rx={6} />
        </AnimatedGroup>
        <AnimatedGroup animatedProps={p.c0Props}>
          <Circle cx={229} cy={30} r={11} />
        </AnimatedGroup>
        <AnimatedGroup animatedProps={p.c1Props}>
          <Circle cx={245} cy={22} r={14} />
        </AnimatedGroup>
        <AnimatedGroup animatedProps={p.c2Props}>
          <Circle cx={260} cy={31} r={10} />
        </AnimatedGroup>
      </AnimatedGroup>
    </G>
  );
}

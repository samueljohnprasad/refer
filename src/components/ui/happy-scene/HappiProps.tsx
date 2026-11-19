// ponytail: held props + grounds, geometry copied verbatim from .agents/happi.js PROPS/GROUND. Drawn upright
// with the grip at (0,0); HappiRig mounts them inside the forearm group so the paw covers the grip.
// Placement/sway/idle transforms arrive as animatedProps built from the engine (useHappiAnimatedProps).
import React from "react";
import Animated from "react-native-reanimated";
import { Circle, Ellipse, G, Path, Rect } from "react-native-svg";
import { HEART, INK } from "./art";

const AnimatedGroup = Animated.createAnimatedComponent(G);

type AnimatedProps = Record<string, unknown>;
const IDENTITY: AnimatedProps = {};
const S = { stroke: INK, strokeWidth: 3, strokeLinejoin: "round" } as const;

export type PropKind = "jar" | "frame" | "lens" | "lantern" | "can" | "flag";
export type GroundKind = "sprout" | "step";

export interface HappiPropsKit {
  propL: AnimatedProps; propR: AnimatedProps; swayL: AnimatedProps; swayR: AnimatedProps;
  bob: AnimatedProps; glow: AnimatedProps; flame: AnimatedProps; cloth: AnimatedProps;
  drop0: AnimatedProps; drop1: AnimatedProps; drop2: AnimatedProps;
  sprout: AnimatedProps;
}

function PropArt({ kind, kit, sway }: { kind: PropKind; kit: HappiPropsKit; sway: AnimatedProps }): React.JSX.Element {
  switch (kind) {
    case "jar":
      return (
        <AnimatedGroup animatedProps={sway}>
          <Rect x={-13} y={-31} width={26} height={31} rx={8} fill="#EEF6F2" {...S} />
          <Rect x={-14.5} y={-37} width={29} height={8} rx={3.5} fill={INK} />
          <AnimatedGroup animatedProps={kit.bob}>
            <Path d="M-7 -12a4.5 4.5 0 0 1 0-9a5.5 5.5 0 0 1 10-1.5a4.5 4.5 0 0 1 5 5.5a3.5 3.5 0 0 1-1 5z" fill={HEART} />
          </AnimatedGroup>
          <Path d="M-7.5 -25v7" stroke="#fff" strokeWidth={2.5} strokeLinecap="round" />
        </AnimatedGroup>
      );
    case "frame":
      return (
        <AnimatedGroup animatedProps={sway}>
          <Rect x={-19} y={-44} width={38} height={32} rx={5} fill="#fff" {...S} />
          <Circle cx={7} cy={-34} r={4} fill="#F6C453" />
          <Path d="M-14 -16Q-6 -27 2 -20T15 -18V-16Z" fill="#A8C392" />
        </AnimatedGroup>
      );
    case "lens":
      return (
        <AnimatedGroup animatedProps={sway}>
          <Path d="M0 0L9 -13" stroke={INK} strokeWidth={6} strokeLinecap="round" />
          <Circle cx={17} cy={-25} r={12} fill="#E2EEF8" fillOpacity={0.7} stroke={INK} strokeWidth={4} />
          <Path d="M11 -30a7 7 0 0 1 6-3" fill="none" stroke="#fff" strokeWidth={2.5} strokeLinecap="round" />
        </AnimatedGroup>
      );
    case "lantern":
      return (
        <AnimatedGroup animatedProps={sway}>
          <AnimatedGroup animatedProps={kit.glow}>
            <Circle cx={0} cy={25} r={24} fill="#FFE29A" fillOpacity={0.35} />
          </AnimatedGroup>
          <Path d="M-6 8Q0 -6 6 8" fill="none" stroke={INK} strokeWidth={2.5} />
          <Rect x={-8} y={7} width={16} height={5} rx={2} fill={INK} />
          <Rect x={-10} y={11} width={20} height={24} rx={6} fill="#FFF0BF" {...S} />
          <AnimatedGroup animatedProps={kit.flame}>
            <Ellipse cx={0} cy={24} rx={3.5} ry={5.5} fill="#F4A94A" />
          </AnimatedGroup>
          <Rect x={-8} y={34} width={16} height={4} rx={2} fill={INK} />
        </AnimatedGroup>
      );
    case "can":
      return (
        <>
          <AnimatedGroup animatedProps={sway}>
            <Path d="M-12 -8Q-26 -14 -30 -4" fill="none" stroke={INK} strokeWidth={4} strokeLinecap="round" />
            <Path d="M-30 -4l-4 -4" stroke={INK} strokeWidth={3} strokeLinecap="round" />
            <Rect x={-12} y={-14} width={24} height={20} rx={5} fill="#A8C392" {...S} />
            <Path d="M12 -10q9 0 9 8t-9 6" fill="none" stroke={INK} strokeWidth={3} />
          </AnimatedGroup>
          {[kit.drop0, kit.drop1, kit.drop2].map((drop, i) => (
            <AnimatedGroup key={i} animatedProps={drop}>
              <Ellipse cx={-36} cy={-6} rx={1.8} ry={3} fill="#8EC5E8" />
            </AnimatedGroup>
          ))}
        </>
      );
    case "flag":
      return (
        <AnimatedGroup animatedProps={sway}>
          <Path d="M0 10V-52" stroke={INK} strokeWidth={3.5} strokeLinecap="round" />
          <AnimatedGroup animatedProps={kit.cloth}>
            <Path d="M-1 -52L-30 -44L-1 -35Z" fill="#F6C453" {...S} />
          </AnimatedGroup>
        </AnimatedGroup>
      );
  }
}

export function HeldProp({ kind, side, kit }: { kind: PropKind; side: "L" | "R"; kit: HappiPropsKit }): React.JSX.Element {
  return (
    <AnimatedGroup animatedProps={side === "L" ? kit.propL : kit.propR}>
      <PropArt kind={kind} kit={kit} sway={side === "L" ? kit.swayL : kit.swayR} />
    </AnimatedGroup>
  );
}

export function HappiGround({ kind, kit }: { kind: GroundKind; kit?: HappiPropsKit }): React.JSX.Element {
  if (kind === "step") {
    return (
      <>
        <Rect x={40} y={235} width={44} height={13} rx={5} fill="#D9CFF0" />
        <Rect x={72} y={220} width={116} height={28} rx={6} fill="#D9CFF0" />
        <Path d="M78 221H182" stroke="#fff" strokeWidth={2} strokeLinecap="round" />
      </>
    );
  }
  return (
    <AnimatedGroup animatedProps={kit?.sprout ?? IDENTITY}>
      <Path d="M0 0Q-2 -12 1 -20" fill="none" stroke="#7C9C6B" strokeWidth={3} strokeLinecap="round" />
      <Path d="M1 -14Q-12 -16 -12 -26Q0 -26 1 -14M1 -18Q12 -22 13 -31Q2 -31 1 -18" fill="#A8C392" />
    </AnimatedGroup>
  );
}

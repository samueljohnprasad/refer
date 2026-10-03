// ponytail: tactile 3D node badge with reanimated entrance, complete pop, and checkmark
import React from "react";
import Animated, {
  SharedValue,
  useAnimatedStyle,
  interpolate,
  Extrapolation,
} from "react-native-reanimated";
import Svg, { Ellipse, Defs, ClipPath } from "react-native-svg";
import {
  NODES,
  TODAY_INDEX,
  NODE_SIZE,
  TODAY_SIZE,
  NODE_STATE,
  NEUTRAL_RIM,
  shade,
  nodeAt,
  completeAt,
  JourneyNodeDef,
} from "./constants";
import { IconGlyph, AnimatedCheckmark, GlossStripes } from "./WelcomeGlyphs";

interface WelcomeNodeProps {
  index: number;
  frame: SharedValue<number>;
  scale: number;
}

export function WelcomeNode({ index, frame, scale: screenScale }: WelcomeNodeProps): React.JSX.Element {
  const node: JourneyNodeDef = NODES[index];
  const isToday: boolean = index === TODAY_INDEX;
  const isLocked: boolean = index > TODAY_INDEX;
  const baseSize: number = isToday ? TODAY_SIZE : NODE_SIZE;
  const size: number = baseSize * screenScale;

  const startAt: number = nodeAt(index);
  const nodeCompleteAt: number = completeAt(index);

  const faceRx: number = size / 2;
  const faceRy: number = faceRx * (45 / 55);
  const rimDy: number = size * 0.118;
  const checkR: number = size * 0.62 * 0.5;

  const animatedStyle = useAnimatedStyle(() => {
    const f: number = frame.value;
    const appear: number = interpolate(
      f,
      [startAt, startAt + 20],
      [0, 1],
      Extrapolation.CLAMP
    );
    const breathe: number = isToday ? 1 + Math.sin(f / 22) * 0.03 : 1;
    const completePop: number =
      index < TODAY_INDEX
        ? interpolate(
            f,
            [nodeCompleteAt, nodeCompleteAt + 8, nodeCompleteAt + 20],
            [1, 1.16, 1],
            Extrapolation.CLAMP
          )
        : 1;

    return {
      opacity: appear,
      transform: [{ scale: Math.max(appear, 0) * breathe * completePop }],
    };
  });

  const todayGlowStyle = useAnimatedStyle(() => {
    if (!isToday) return { opacity: 0 };
    return { opacity: 0.16 + Math.sin(frame.value / 22) * 0.05 };
  });

  const completedLayerStyle = useAnimatedStyle(() => {
    if (index >= TODAY_INDEX) return { opacity: 0 };
    const opacity: number = interpolate(
      frame.value,
      [nodeCompleteAt, nodeCompleteAt + 4],
      [0, 1],
      Extrapolation.CLAMP
    );
    return { opacity };
  });

  const initialGlyphStyle = useAnimatedStyle(() => {
    if (index >= TODAY_INDEX) return { opacity: 1 };
    const opacity: number = interpolate(
      frame.value,
      [nodeCompleteAt, nodeCompleteAt + 4],
      [1, 0],
      Extrapolation.CLAMP
    );
    return { opacity };
  });

  const faceColor: string = isToday ? node.iconColor : isLocked ? NODE_STATE.locked : "#FFFFFF";
  const rimColor: string = isToday ? shade(node.iconColor, 0.68) : NEUTRAL_RIM;
  const completedFaceColor: string = NODE_STATE.completed;
  const completedRimColor: string = shade(NODE_STATE.completed, 0.72);

  const posX: number = node.x * screenScale - faceRx;
  const posY: number = node.y * screenScale - faceRy;
  const clipId: string = `node-gloss-${index}`;
  const compClipId: string = `node-gloss-comp-${index}`;

  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          left: posX,
          top: posY,
          width: size,
          height: size + rimDy,
          alignItems: "center",
          justifyContent: "center",
        },
        animatedStyle,
      ]}
    >
      {isToday && (
        <Animated.View
          style={[
            {
              position: "absolute",
              width: (faceRx + 20 * screenScale) * 2,
              height: (faceRx + 20 * screenScale) * 2,
              borderRadius: faceRx + 20 * screenScale,
              backgroundColor: node.iconColor,
            },
            todayGlowStyle,
          ]}
        />
      )}

      {/* Base Badge */}
      <Svg width={size} height={size + rimDy} viewBox={`${-faceRx} ${-faceRy} ${size} ${size + rimDy}`}>
        <Defs>
          <ClipPath id={clipId}>
            <Ellipse cx={0} cy={0} rx={faceRx} ry={faceRy} />
          </ClipPath>
        </Defs>
        <Ellipse cx={0} cy={rimDy + 4 * screenScale} rx={faceRx} ry={faceRy} fill="#142414" opacity={0.18} />
        <Ellipse cx={0} cy={rimDy} rx={faceRx} ry={faceRy} fill={rimColor} />
        <Ellipse cx={0} cy={0} rx={faceRx} ry={faceRy} fill={faceColor} />
        <GlossStripes faceRx={faceRx} faceRy={faceRy} screenScale={screenScale} clipId={clipId} />
        {isLocked && (
          <Ellipse
            cx={0}
            cy={0}
            rx={faceRx + 9 * screenScale}
            ry={faceRy + 7 * screenScale}
            fill="none"
            stroke={NEUTRAL_RIM}
            strokeWidth={3 * screenScale}
            strokeDasharray="7 7"
          />
        )}
      </Svg>

      {/* Completed State Overlay */}
      {index < TODAY_INDEX && (
        <Animated.View
          style={[{ position: "absolute", left: 0, top: 0, width: size, height: size + rimDy }, completedLayerStyle]}
          pointerEvents="none"
        >
          <Svg width={size} height={size + rimDy} viewBox={`${-faceRx} ${-faceRy} ${size} ${size + rimDy}`}>
            <Defs>
              <ClipPath id={compClipId}>
                <Ellipse cx={0} cy={0} rx={faceRx} ry={faceRy} />
              </ClipPath>
            </Defs>
            <Ellipse cx={0} cy={rimDy} rx={faceRx} ry={faceRy} fill={completedRimColor} />
            <Ellipse cx={0} cy={0} rx={faceRx} ry={faceRy} fill={completedFaceColor} />
            <GlossStripes faceRx={faceRx} faceRy={faceRy} screenScale={screenScale} clipId={compClipId} />
          </Svg>
        </Animated.View>
      )}

      {/* Initial Glyph Icon */}
      <Animated.View
        style={[
          { position: "absolute", width: size, height: size, alignItems: "center", justifyContent: "center" },
          initialGlyphStyle,
        ]}
      >
        <Svg width={size} height={size} viewBox={`${-faceRx} ${-faceRy} ${size} ${size}`}>
          {isLocked ? (
            <IconGlyph icon="lock" color="#B7C4CE" size={size * 0.56} />
          ) : (
            <IconGlyph icon={node.icon} color={isToday ? "#FFFFFF" : node.iconColor} size={size * 0.62} />
          )}
        </Svg>
      </Animated.View>

      {/* Checkmark Glyph for Completed State */}
      {index < TODAY_INDEX && (
        <Animated.View
          style={{ position: "absolute", width: size, height: size, alignItems: "center", justifyContent: "center" }}
          pointerEvents="none"
        >
          <Svg width={size} height={size} viewBox={`${-faceRx} ${-faceRy} ${size} ${size}`}>
            <AnimatedCheckmark checkR={checkR} frame={frame} nodeCompleteAt={nodeCompleteAt} />
          </Svg>
        </Animated.View>
      )}
    </Animated.View>
  );
}

export default React.memo(WelcomeNode);

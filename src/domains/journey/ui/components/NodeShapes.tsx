import React from "react";
import Svg, { Ellipse, Polygon, Path, Defs, ClipPath, G, Rect } from "react-native-svg";
import Animated from "react-native-reanimated";
import { ColorValue } from "react-native";
import { NodeType } from "@/src/types/journey";
import { NODE_SHAPES } from "@/src/data/journey/constants";

const AnimatedEllipse = Animated.createAnimatedComponent(Ellipse);
const AnimatedPolygon = Animated.createAnimatedComponent(Polygon);
const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedG = Animated.createAnimatedComponent(G);

export interface NodeSilhouetteProps {
  type: NodeType;
  size: number;
  fill: ColorValue;
  rim: ColorValue;
  faceAnimatedProps?: any; // To animate 'translateY' or 'cy' if we use SVG animations
}

export const NodeSilhouette = React.memo(function NodeSilhouette({
  type,
  size,
  fill,
  rim,
  faceAnimatedProps,
}: NodeSilhouetteProps) {
  const depth = 6;
  const hSize = size / 2;

  if (type === NodeType.LESSON) {
    // Exact match for existing DuolingoSvgNodeButton
    return (
      
      <Svg width="100%" height="100%" viewBox="-10 -10 120 130">
        <Defs>
          <ClipPath id="lessonClip">
            <Ellipse cx={50} cy={40} rx={51} ry={41} />
          </ClipPath>
        </Defs>
        <Ellipse cx={50} cy={53} rx={55} ry={45} fill={rim as any} />
        <AnimatedEllipse
          cx={50}
          cy={40}
          rx={55}
          ry={45}
          fill={fill as any}
          animatedProps={faceAnimatedProps}
        />
        <AnimatedG animatedProps={faceAnimatedProps} clipPath="url(#lessonClip)">
          <Rect x={-10} y={-2} width={120} height={30} fill="rgba(255, 255, 255, 0.3)" transform="rotate(-45 50 40)" />
          <Rect x={-10} y={50} width={120} height={26} fill="rgba(255, 255, 255, 0.3)" transform="rotate(-45 50 40)" />
        </AnimatedG>
      </Svg>
    );
  }

  let viewBox = `0 0 100 ${100 + depth * (100 / size)}`;
  let pathD = NODE_SHAPES.hexagon;
  if (type === NodeType.CHEST) {
    pathD = "M 20 20 H 80 C 85 20 90 25 90 30 V 70 C 90 80 80 90 70 90 H 30 C 20 90 10 80 10 70 V 30 C 10 25 15 20 20 20 Z"; // Generic chest/box
  } else if (type === NodeType.MILESTONE) {
    viewBox = `0 0 100 ${100 + depth * (100 / size)}`;
    pathD = NODE_SHAPES.rosette;
  } else if (type === NodeType.CHECKPOINT) {
    viewBox = `0 0 100 ${100 + depth * (100 / size)}`;
    pathD = NODE_SHAPES.hexagon;
  }

  return (
    <Svg width={size} height={size + depth} viewBox={viewBox}>
      <Defs>
        <ClipPath id="shapeClip">
          <Path d={pathD} />
        </ClipPath>
      </Defs>
      {/* Rim / Shadow - offset vertically */}
      <G transform={`translate(0, ${depth * (100 / size)})`}>
        <Path d={pathD} fill={rim as any} />
      </G>
      {/* Animated Face */}
      <AnimatedPath d={pathD} fill={fill as any} animatedProps={faceAnimatedProps} />
      {/* Gloss */}
      <AnimatedG animatedProps={faceAnimatedProps} clipPath="url(#shapeClip)">
        <Rect x={-50} y={10} width={200} height={25} fill="rgba(255, 255, 255, 0.3)" transform="rotate(-45 50 50)" />
        <Rect x={-50} y={40} width={200} height={8} fill="rgba(255, 255, 255, 0.3)" transform="rotate(-45 50 50)" />
      </AnimatedG>
    </Svg>
  );
});

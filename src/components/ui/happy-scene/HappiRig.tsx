// ponytail: presentational vector rig matching 100% to Screenshot 2 mascot design
import React from "react";
import Animated from "react-native-reanimated";
import { Circle, Ellipse, G, Path } from "react-native-svg";
import { BLUSH, HEART, INK, paths, SHADOW, WHITE } from "./art";

const AnimatedGroup = Animated.createAnimatedComponent(G);

export interface HappiRigProps {
  shadowProps: Record<string, unknown>;
  rootProps: Record<string, unknown>;
  bodyProps: Record<string, unknown>;
  heartProps: Record<string, unknown>;
  armLProps: Record<string, unknown>;
  armRProps: Record<string, unknown>;
  headProps: Record<string, unknown>;
  earLProps: Record<string, unknown>;
  earRProps: Record<string, unknown>;
  faceProps: Record<string, unknown>;
  cheeksProps: Record<string, unknown>;
  eyesProps: Record<string, unknown>;
  pupilsProps: Record<string, unknown>;
}

export function HappiRig({
  shadowProps,
  rootProps,
  bodyProps,
  heartProps,
  armLProps,
  armRProps,
  headProps,
  earLProps,
  earRProps,
  faceProps,
  cheeksProps,
  eyesProps,
  pupilsProps,
}: HappiRigProps): React.JSX.Element {
  return (
    <G>
      {/* Ground Contact Shadow */}
      <AnimatedGroup animatedProps={shadowProps}>
        <Ellipse cx={120} cy={226} rx={70} ry={12} fill={SHADOW} />
      </AnimatedGroup>

      {/* Main Root (Hips, Lift, Volume Preservation Squash) */}
      <AnimatedGroup animatedProps={rootProps}>
        {/* Legs / Feet */}
        <Path
          d={paths.legL}
          fill={INK}
          stroke={INK}
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d={paths.legR}
          fill={INK}
          stroke={INK}
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Torso & Belly */}
        <AnimatedGroup animatedProps={bodyProps}>
          {/* Black Torso Coat */}
          <Path
            d={paths.torsoBlack}
            fill={INK}
            stroke={INK}
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* White Belly */}
          <Path
            d={paths.bellyWhite}
            fill={WHITE}
            stroke={INK}
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Pulsing Lavender Heart */}
          <AnimatedGroup animatedProps={heartProps}>
            <Path d={paths.bellyHeart} fill={HEART} />
          </AnimatedGroup>
        </AnimatedGroup>

        {/* Articulated Left Arm (Viewer's Left) */}
        <AnimatedGroup animatedProps={armLProps}>
          <Path
            d={paths.armL}
            fill={INK}
            stroke={INK}
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Path
            d={paths.foreL}
            fill={INK}
            stroke={INK}
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Ellipse cx={51} cy={179} rx={5} ry={4} fill={WHITE} />
        </AnimatedGroup>

        {/* Articulated Right Arm (Viewer's Right) */}
        <AnimatedGroup animatedProps={armRProps}>
          <Path
            d={paths.armR}
            fill={INK}
            stroke={INK}
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Path
            d={paths.foreR}
            fill={INK}
            stroke={INK}
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Ellipse cx={170} cy={180} rx={5} ry={4} fill={WHITE} />
        </AnimatedGroup>

        {/* Articulated Head & Face Group */}
        <AnimatedGroup animatedProps={headProps}>
          {/* Left Ear with follow-through */}
          <AnimatedGroup animatedProps={earLProps}>
            <Path
              d={paths.earL}
              fill={INK}
              stroke={INK}
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </AnimatedGroup>

          {/* Right Ear with follow-through */}
          <AnimatedGroup animatedProps={earRProps}>
            <Path
              d={paths.earR}
              fill={INK}
              stroke={INK}
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </AnimatedGroup>

          {/* White Head with hair tufts */}
          <Path
            d={paths.headBase}
            fill={WHITE}
            stroke={INK}
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Path
            d={paths.hairTufts}
            fill="none"
            stroke={INK}
            strokeWidth={3}
            strokeLinecap="round"
          />

          {/* Eyebrows */}
          <Path
            d={paths.eyebrows}
            fill="none"
            stroke={INK}
            strokeWidth={3}
            strokeLinecap="round"
          />

          {/* Eye Patches */}
          <Path d={paths.eyePatchL} fill={INK} />
          <Path d={paths.eyePatchR} fill={INK} />

          {/* Pink Blush Cheeks */}
          <AnimatedGroup animatedProps={cheeksProps}>
            <Ellipse cx={46} cy={94} rx={11} ry={5} fill={BLUSH} />
            <Ellipse cx={174} cy={112} rx={12} ry={5.5} fill={BLUSH} />
          </AnimatedGroup>

          {/* Eye Whites & Blinking Lids */}
          <AnimatedGroup animatedProps={eyesProps}>
            <Ellipse cx={73} cy={78} rx={7} ry={9} fill={WHITE} />
            <Ellipse cx={151} cy={88} rx={7} ry={9} fill={WHITE} />

            {/* Sliding Pupils & Specular Highlights */}
            <AnimatedGroup animatedProps={pupilsProps}>
              <Ellipse cx={75} cy={79} rx={3.8} ry={6} fill={INK} />
              <Ellipse cx={153} cy={89} rx={3.8} ry={6} fill={INK} />
              {/* Gloss catchlights */}
              <Circle cx={74} cy={77} r={1.8} fill={WHITE} />
              <Circle cx={77} cy={81} r={1.1} fill={WHITE} />
              <Circle cx={152} cy={86} r={1.8} fill={WHITE} />
              <Circle cx={155} cy={90} r={1.1} fill={WHITE} />
            </AnimatedGroup>
          </AnimatedGroup>

          {/* Snout: Nose & Cat Smile with 2.5D Parallax */}
          <AnimatedGroup animatedProps={faceProps}>
            <Path d={paths.nose} fill={INK} />
            <Path
              d={paths.smile}
              fill="none"
              stroke={INK}
              strokeWidth={3}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </AnimatedGroup>
        </AnimatedGroup>
      </AnimatedGroup>
    </G>
  );
}

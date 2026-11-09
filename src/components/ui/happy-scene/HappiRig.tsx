import React from "react";
import Animated from "react-native-reanimated";
import { Circle, ClipPath, Defs, Ellipse, G, Path } from "react-native-svg";
import { eyes, HEART, INK, LINE, nose, paths, pawPad, SHADOW, shadow, STROKE, WHITE } from "./art";

const AnimatedGroup = Animated.createAnimatedComponent(G);
const EYE_CLIP = "happi-eye-clip";
const ink = { fill: INK, stroke: INK, strokeWidth: STROKE, strokeLinejoin: "round" } as const;
const line = { fill: "none", stroke: INK, strokeLinecap: "round", strokeLinejoin: "round" } as const;

type AnimatedProps = Record<string, unknown>;

export interface HappiRigProps {
  shadowProps: AnimatedProps;
  rootProps: AnimatedProps;
  bodyProps: AnimatedProps;
  heartProps: AnimatedProps;
  armLProps: AnimatedProps;
  armLFrontProps: AnimatedProps;
  foreLProps: AnimatedProps;
  padProps: AnimatedProps;
  armRProps: AnimatedProps;
  foreRProps: AnimatedProps;
  headProps: AnimatedProps;
  earLProps: AnimatedProps;
  earRProps: AnimatedProps;
  faceProps: AnimatedProps;
  eyesProps: AnimatedProps;
  pupilsProps: AnimatedProps;
}

export function HappiRig(p: HappiRigProps): React.JSX.Element {
  return (
    <G>
      <Defs>
        <ClipPath id={EYE_CLIP}>
          {eyes.map(({ white }, i) => <Ellipse key={i} {...white} />)}
        </ClipPath>
      </Defs>

      <AnimatedGroup animatedProps={p.shadowProps}>
        <Ellipse {...shadow} fill={SHADOW} />
      </AnimatedGroup>

      <AnimatedGroup animatedProps={p.rootProps}>
        <Path d={paths.legL} {...ink} />
        <Path d={paths.legR} {...ink} />

        <AnimatedGroup animatedProps={p.bodyProps}>
          <Path d={paths.torso} {...ink} />
          <Path d={paths.belly} fill={WHITE} />
          <Path d={paths.bellyFold} {...line} strokeWidth={LINE.fold} />
          <AnimatedGroup animatedProps={p.heartProps}>
            <Path d={paths.heart} fill={HEART} />
          </AnimatedGroup>
        </AnimatedGroup>

        <AnimatedGroup animatedProps={p.armRProps}>
          <Path d={paths.upperArmR} {...ink} />
          <AnimatedGroup animatedProps={p.foreRProps}>
            <Path d={paths.forearmR} {...ink} />
          </AnimatedGroup>
        </AnimatedGroup>

        <AnimatedGroup animatedProps={p.armLProps}>
          <Path d={paths.upperArmL} {...ink} />
        </AnimatedGroup>

        <AnimatedGroup animatedProps={p.headProps}>
          <AnimatedGroup animatedProps={p.earLProps}>
            <Path d={paths.earL} {...ink} />
          </AnimatedGroup>
          <AnimatedGroup animatedProps={p.earRProps}>
            <Path d={paths.earR} {...ink} />
          </AnimatedGroup>

          <Path d={paths.head} fill={WHITE} stroke={INK} strokeWidth={LINE.head} strokeLinejoin="round" />
          <Path d={paths.hairTufts} {...line} strokeWidth={LINE.tuft} />

          {eyes.map(({ patch: { rotate, ...patch } }, i) => (
            <Ellipse key={i} {...patch} fill={INK} transform={`rotate(${rotate} ${patch.cx} ${patch.cy})`} />
          ))}

          <AnimatedGroup animatedProps={p.eyesProps}>
            {eyes.map(({ white }, i) => <Ellipse key={i} {...white} fill={WHITE} />)}
            <G clipPath={`url(#${EYE_CLIP})`}>
              <AnimatedGroup animatedProps={p.pupilsProps}>
                {eyes.map(({ pupil, glints }, i) => (
                  <G key={i}>
                    <Circle {...pupil} fill={INK} />
                    {glints.map((glint, j) => <Circle key={j} {...glint} fill={WHITE} />)}
                  </G>
                ))}
              </AnimatedGroup>
            </G>
          </AnimatedGroup>

          <AnimatedGroup animatedProps={p.faceProps}>
            <Ellipse {...nose} fill={INK} />
            <Path d={paths.mouth} {...line} strokeWidth={LINE.mouth} />
          </AnimatedGroup>
        </AnimatedGroup>

        <AnimatedGroup animatedProps={p.armLFrontProps}>
          <AnimatedGroup animatedProps={p.foreLProps}>
            <Path d={paths.forearmL} {...ink} />
            <AnimatedGroup animatedProps={p.padProps}>
              <Circle {...pawPad} fill={WHITE} stroke={INK} strokeWidth={LINE.pad} />
            </AnimatedGroup>
          </AnimatedGroup>
        </AnimatedGroup>
      </AnimatedGroup>
    </G>
  );
}

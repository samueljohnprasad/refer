import React from "react";
import Animated from "react-native-reanimated";
import { Circle, ClipPath, Defs, Ellipse, G, Path } from "react-native-svg";
import {
  eyes, happyEyes, HEART, INK, LINE, mouthInner, nose, paths, pawPad, SHADOW, shadow, STROKE, TONGUE, WHITE,
} from "./art";
import { HappiGround, HeldProp, type GroundKind, type HappiPropsKit, type PropKind } from "./HappiProps";

const AnimatedGroup = Animated.createAnimatedComponent(G);
const EYE_CLIP = "happi-eye-clip";
const ink = { fill: INK, stroke: INK, strokeWidth: STROKE, strokeLinejoin: "round" } as const;
const line = { fill: "none", stroke: INK, strokeLinecap: "round", strokeLinejoin: "round" } as const;

type AnimatedProps = Record<string, unknown>;
const IDENTITY: AnimatedProps = {};

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
  /** opacity toward each eye's own pupil centre — the `pup` channel (alarmed/narrowed looks) */
  pupilLProps?: AnimatedProps;
  pupilRProps?: AnimatedProps;
  /** closed smile (default) vs. open-mouth+tongue, crossfaded by the `mouth` channel */
  smileProps?: AnimatedProps;
  mouthOpenProps?: AnimatedProps;
  /** closed happy-squint eye curves, crossfaded against eyesProps by the `cheek` channel */
  happyProps?: AnimatedProps;
  /** lifts figure + shadow together (the `stage` channel); identity when absent */
  stageProps?: AnimatedProps;
  /** held props and ground to draw; omit for a bare figure */
  scene?: { propL?: PropKind; propR?: PropKind; ground?: GroundKind };
  propsKit?: HappiPropsKit;
}

export function HappiRig(p: HappiRigProps): React.JSX.Element {
  return (
    <G>
      <Defs>
        <ClipPath id={EYE_CLIP}>
          {eyes.map(({ white }, i) => <Ellipse key={i} {...white} />)}
        </ClipPath>
      </Defs>

      {p.scene?.ground && <HappiGround kind={p.scene.ground} kit={p.propsKit} />}

      <AnimatedGroup animatedProps={p.stageProps ?? IDENTITY}>
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
            {p.scene?.propR && p.propsKit && <HeldProp kind={p.scene.propR} side="R" kit={p.propsKit} />}
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
                <AnimatedGroup animatedProps={p.pupilLProps ?? IDENTITY}>
                  <Circle {...eyes[0].pupil} fill={INK} />
                  {eyes[0].glints.map((glint, j) => <Circle key={j} {...glint} fill={WHITE} />)}
                </AnimatedGroup>
                <AnimatedGroup animatedProps={p.pupilRProps ?? IDENTITY}>
                  <Circle {...eyes[1].pupil} fill={INK} />
                  {eyes[1].glints.map((glint, j) => <Circle key={j} {...glint} fill={WHITE} />)}
                </AnimatedGroup>
              </AnimatedGroup>
            </G>
          </AnimatedGroup>
          <AnimatedGroup animatedProps={p.happyProps ?? IDENTITY}>
            {happyEyes.map((d, i) => <Path key={i} d={d} {...line} strokeWidth={LINE.mouth} />)}
          </AnimatedGroup>

          <AnimatedGroup animatedProps={p.faceProps}>
            <Ellipse {...nose} fill={INK} />
            <AnimatedGroup animatedProps={p.smileProps ?? IDENTITY}>
              <Path d={paths.mouth} {...line} strokeWidth={LINE.mouth} />
            </AnimatedGroup>
            <AnimatedGroup animatedProps={p.mouthOpenProps ?? IDENTITY}>
              <Path d={paths.mouthOpen} {...ink} />
              <Ellipse {...mouthInner} fill={TONGUE} />
            </AnimatedGroup>
          </AnimatedGroup>
        </AnimatedGroup>

        <AnimatedGroup animatedProps={p.armLFrontProps}>
          <AnimatedGroup animatedProps={p.foreLProps}>
            {p.scene?.propL && p.propsKit && <HeldProp kind={p.scene.propL} side="L" kit={p.propsKit} />}
            <Path d={paths.forearmL} {...ink} />
            <AnimatedGroup animatedProps={p.padProps}>
              <Circle {...pawPad} fill={WHITE} stroke={INK} strokeWidth={LINE.pad} />
            </AnimatedGroup>
          </AnimatedGroup>
        </AnimatedGroup>
      </AnimatedGroup>
      </AnimatedGroup>
    </G>
  );
}

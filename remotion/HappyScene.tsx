// Web mirror of src/components/ui/happy-scene/HappiRig.tsx for offline review; same art and pose data.
import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import {
  eyes, HEART, INK, LINE, nose, paths, pawPad, scenery, SHADOW, shadow, STROKE, WHITE,
} from "../src/components/ui/happy-scene/art";
import { getHappyPose, SCENE } from "../src/components/ui/happy-scene/pose";

const m = (matrix: readonly number[]): string => `matrix(${matrix.join(" ")})`;
const ink = { fill: INK, stroke: INK, strokeWidth: STROKE, strokeLinejoin: "round" } as const;
const line = { fill: "none", stroke: INK, strokeLinecap: "round", strokeLinejoin: "round" } as const;
const EYE_CLIP = "happi-eye-clip";

export function HappyScenePreview(): React.JSX.Element {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pose = getHappyPose((frame / fps) * 1000);

  return (
    <svg width="100%" height="100%" viewBox="0 0 390 844" preserveAspectRatio="xMidYMid slice">
      <defs>
        <clipPath id={EYE_CLIP}>
          {eyes.map(({ white }, i) => <ellipse key={i} {...white} />)}
        </clipPath>
      </defs>
      <g dangerouslySetInnerHTML={{ __html: scenery.background }} />
      <g transform={m(pose.cloud)} dangerouslySetInnerHTML={{ __html: scenery.cloud }} />
      <g transform={m(pose.plant)} dangerouslySetInnerHTML={{ __html: scenery.plant }} />

      <g transform={`translate(195 ${SCENE.floor}) scale(${SCENE.scale}) translate(-${SCENE.pivotX} -${SCENE.pivotY})`}>
        <g transform={m(pose.shadow)}>
          <ellipse {...shadow} fill={SHADOW} />
        </g>

        <g transform={m(pose.root)}>
          <path d={paths.legL} {...ink} />
          <path d={paths.legR} {...ink} />

          <g transform={m(pose.body)}>
            <path d={paths.torso} {...ink} />
            <path d={paths.belly} fill={WHITE} />
            <path d={paths.bellyFold} {...line} strokeWidth={LINE.fold} />
            <g transform={m(pose.heart)}>
              <path d={paths.heart} fill={HEART} />
            </g>
          </g>

          <g transform={m(pose.armR)}>
            <path d={paths.upperArmR} {...ink} />
            <g transform={m(pose.foreR)}>
              <path d={paths.forearmR} {...ink} />
            </g>
          </g>

          <g transform={m(pose.armL)}>
            <path d={paths.upperArmL} {...ink} />
          </g>

          <g transform={m(pose.head)}>
            <g transform={m(pose.earL)}>
              <path d={paths.earL} {...ink} />
            </g>
            <g transform={m(pose.earR)}>
              <path d={paths.earR} {...ink} />
            </g>

            <path d={paths.head} fill={WHITE} stroke={INK} strokeWidth={LINE.head} strokeLinejoin="round" />
            <path d={paths.hairTufts} {...line} strokeWidth={LINE.tuft} />

            {eyes.map(({ patch: { rotate, ...patch } }, i) => (
              <ellipse key={i} {...patch} fill={INK} transform={`rotate(${rotate} ${patch.cx} ${patch.cy})`} />
            ))}

            <g transform={m(pose.eyes)}>
              {eyes.map(({ white }, i) => <ellipse key={i} {...white} fill={WHITE} />)}
              <g clipPath={`url(#${EYE_CLIP})`}>
                <g transform={m(pose.pupils)}>
                  {eyes.map(({ pupil, glints }, i) => (
                    <g key={i}>
                      <circle {...pupil} fill={INK} />
                      {glints.map((glint, j) => <circle key={j} {...glint} fill={WHITE} />)}
                    </g>
                  ))}
                </g>
              </g>
            </g>

            <g transform={m(pose.face)}>
              <ellipse {...nose} fill={INK} />
              <path d={paths.mouth} {...line} strokeWidth={LINE.mouth} />
            </g>
          </g>

          <g transform={m(pose.armL)}>
            <g transform={m(pose.foreL)}>
              <path d={paths.forearmL} {...ink} />
              <circle {...pawPad} fill={WHITE} stroke={INK} strokeWidth={LINE.pad} opacity={pose.padOpacity} />
            </g>
          </g>
        </g>
      </g>
    </svg>
  );
}

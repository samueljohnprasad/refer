// ponytail: remotion preview mirroring 100% vector rigged Happi scene matching Screenshot 2
import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { INK, WHITE, HEART, SHADOW, scenery, art } from "../src/components/ui/happy-scene/art";
import { getHappyPose, SCENE } from "../src/components/ui/happy-scene/pose";

const transform = (m: readonly number[]): string => `matrix(${m.join(" ")})`;

export function HappyScenePreview(): React.JSX.Element {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const timeMs = (frame / fps) * 1000;
  const pose = getHappyPose(timeMs);

  return (
    <svg width="100%" height="100%" viewBox="0 0 390 844" style={{ backgroundColor: "#F0F5EC" }}>
      {/* Background Hills */}
      <g dangerouslySetInnerHTML={{ __html: scenery.background }} />

      {/* Drifting Clouds */}
      <g transform={transform(pose.cloud)} dangerouslySetInnerHTML={{ __html: scenery.cloud }} />

      {/* Swaying Side Plant */}
      <g transform={transform(pose.plant)} dangerouslySetInnerHTML={{ __html: scenery.plant }} />

      {/* Articulated Happi Rig matching Screenshot 2 */}
      <g transform={`translate(195 ${SCENE.floor}) scale(${SCENE.scale}) translate(-120 -226)`}>
        {/* Ground Shadow */}
        <g transform={transform(pose.shadow)}>
          <ellipse cx={120} cy={226} rx={70} ry={12} fill="#BCD0AF" />
        </g>

        {/* Root (Breathing & Volume Preservation) */}
        <g transform={transform(pose.root)}>
          {/* Feet / Legs */}
          <path
            d="M87 192 Q76 204 79 220 Q82 232 99 226 Q108 222 106 210 L106 193Z"
            fill={INK}
            stroke={INK}
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M129 192 Q124 211 131 220 Q140 228 156 219 Q163 210 152 202 L148 188Z"
            fill={INK}
            stroke={INK}
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Torso & Belly */}
          <g transform={transform(pose.body)}>
            {/* Black Torso Coat */}
            <path
              d="M83 126 C64 138 62 175 71 194 C80 217 122 219 143 201 C159 184 157 146 143 132Z"
              fill={INK}
              stroke={INK}
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* White Belly */}
            <path
              d="M86 139 C74 152 73 178 82 192 C95 206 123 206 136 190 C146 175 145 148 132 139Z"
              fill={WHITE}
              stroke={INK}
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Pulsing Lavender Heart */}
            <g transform={transform(pose.heart)}>
              <path
                d="M108 164 C91 147 85 165 97 176 L108 184 C132 171 124 151 108 164Z"
                fill={HEART}
              />
            </g>
          </g>

          {/* Articulated Left Arm (Viewer's Left) */}
          <g transform={transform(pose.armL)}>
            <path
              d="M78 139 Q61 129 51 146 Q43 164 57 174 Q70 178 80 159Z"
              fill={INK}
              stroke={INK}
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M57 158 Q43 162 41 179 Q44 191 57 190 Q73 185 72 171Z"
              fill={INK}
              stroke={INK}
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <ellipse cx={51} cy={179} rx={5} ry={4} fill={WHITE} />
          </g>

          {/* Articulated Right Arm (Viewer's Right) */}
          <g transform={transform(pose.armR)}>
            <path
              d="M143 138 Q160 129 171 147 Q177 161 165 173 Q150 177 141 159Z"
              fill={INK}
              stroke={INK}
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M158 159 Q173 160 179 175 Q180 188 167 192 Q151 192 149 177Z"
              fill={INK}
              stroke={INK}
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <ellipse cx={170} cy={180} rx={5} ry={4} fill={WHITE} />
          </g>

          {/* Articulated Head & Face Group */}
          <g transform={transform(pose.head)}>
            {/* Left Ear with follow-through */}
            <g transform={transform(pose.earL)}>
              <path
                d="M42 62 C18 46 28 13 53 6 C76 0 94 17 88 38Z"
                fill={INK}
                stroke={INK}
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>

            {/* Right Ear with follow-through */}
            <g transform={transform(pose.earR)}>
              <path
                d="M147 36 C143 13 172 3 191 16 C212 30 205 56 186 66Z"
                fill={INK}
                stroke={INK}
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>

            {/* White Head with hair tufts */}
            <path
              d="M40 62 C53 37 76 31 100 24 C113 17 128 14 126 27 C141 20 155 29 165 34 C192 46 202 70 201 96 C207 118 196 137 177 145 C139 159 83 151 53 140 C27 133 24 111 30 89Z"
              fill={WHITE}
              stroke={INK}
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Hair tufts */}
            <path
              d="M125 27 Q124 33 119 35 M133 29 Q139 34 135 41"
              fill="none"
              stroke={INK}
              strokeWidth={3}
              strokeLinecap="round"
            />

            {/* Eyebrows */}
            <path
              d="M70 47 Q75 44 82 45 M150 54 Q157 54 161 58"
              fill="none"
              stroke={INK}
              strokeWidth={3}
              strokeLinecap="round"
            />

            {/* Eye Patches */}
            <path
              d="M48 78 C54 59 73 57 85 66 C96 74 92 88 82 88 C69 86 57 90 48 84Z"
              fill={INK}
            />
            <path
              d="M132 82 C139 67 157 72 167 82 C178 94 174 103 164 101 C154 96 139 100 132 94Z"
              fill={INK}
            />

            {/* Pink Blush Cheeks */}
            <g transform={transform(pose.cheeks)}>
              <ellipse cx={46} cy={94} rx={11} ry={5} fill="#F4B5C2" />
              <ellipse cx={174} cy={112} rx={12} ry={5.5} fill="#F4B5C2" />
            </g>

            {/* Eye Whites & Blinking Lids */}
            <g transform={transform(pose.eyes)}>
              <ellipse cx={73} cy={78} rx={7} ry={9} fill={WHITE} />
              <ellipse cx={151} cy={88} rx={7} ry={9} fill={WHITE} />

              {/* Sliding Pupils & Specular Highlights */}
              <g transform={transform(pose.pupils)}>
                <ellipse cx={75} cy={79} rx={3.8} ry={6} fill={INK} />
                <ellipse cx={153} cy={89} rx={3.8} ry={6} fill={INK} />
                {/* Gloss catchlights */}
                <circle cx={74} cy={77} r={1.8} fill={WHITE} />
                <circle cx={77} cy={81} r={1.1} fill={WHITE} />
                <circle cx={152} cy={86} r={1.8} fill={WHITE} />
                <circle cx={155} cy={90} r={1.1} fill={WHITE} />
              </g>
            </g>

            {/* Snout: Nose & Cat Smile with 2.5D Parallax */}
            <g transform={transform(pose.face)}>
              <path
                d="M101 93 Q109 89 115 94 Q113 101 106 100 Q101 98 101 93Z"
                fill={INK}
              />
              <path
                d="M108 101 Q101 113 91 105 M108 101 Q117 115 126 106"
                fill="none"
                stroke={INK}
                strokeWidth={3}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
          </g>
        </g>
      </g>
    </svg>
  );
}

// ponytail: exact Happi head vector art and acting poses from .agents/onboarding.html
import React from 'react';
import Svg, { Path, Ellipse, Circle, G } from 'react-native-svg';
import { GoalId } from '../../../domain/enums';

export interface HappiHeadSvgProps {
  goalId?: GoalId | 'card';
  size?: number;
}

export function HappiHeadSvg({
  goalId,
  size = 50,
}: HappiHeadSvgProps): React.JSX.Element {
  // Head tilts and pupil adjustments per goal pose
  const isWorry = goalId === GoalId.Worry;
  const isMood = goalId === GoalId.Mood;
  const isStress = goalId === GoalId.Stress;
  const isSelf = goalId === GoalId.Self;
  const isSleep = goalId === GoalId.Sleep;

  const headAngle = isWorry ? 7 : isMood ? -6 : isStress ? -2 : isSelf ? -8 : isSleep ? 8 : 0;
  const sink = isMood ? 2 : isSleep ? 3 : isWorry || isStress || isSelf ? 1 : 0;
  const gazeX = isWorry ? 3.5 : isStress || isSelf ? -2.5 : 0;
  const gazeY = isMood || isSelf ? 3 : isSleep ? 1.5 : isWorry ? -1.5 : 0;

  return (
    <Svg viewBox="40 10 180 166" width={size} height={size}>
      {/* Ears */}
      <Path
        d="M60 36 C66 22 86 18 98 26 C108 33 108 50 100 60 C90 70 70 70 62 60 C56 53 56 44 60 36 Z"
        fill="#252525"
        stroke="#252525"
        strokeWidth={5.5}
        strokeLinejoin="round"
      />
      <Path
        d="M164 40 C172 30 192 30 200 42 C207 53 205 68 196 74 C186 80 170 76 165 66 C161 58 160 48 164 40 Z"
        fill="#252525"
        stroke="#252525"
        strokeWidth={5.5}
        strokeLinejoin="round"
      />

      {/* Head shape */}
      <G transform={`translate(0, ${sink}) rotate(${headAngle} 131 152)`}>
        <Path
          d="M66 64 C84 46 104 40 118 40 C124 35 132 33 136 37 C158 38 182 44 196 64 C208 82 212 106 208 124 C204 144 186 158 160 163 C140 166 122 166 102 163 C76 158 55 142 52 112 C51 92 56 76 66 64 Z"
          fill="#FFF"
          stroke="#252525"
          strokeWidth={5.5}
          strokeLinejoin="round"
        />

        {/* Hair tufts */}
        <Path
          d="M131 35 Q138 38 136 47 Q135 52 132 51 M141 45 Q146 49 144 55"
          fill="none"
          stroke="#252525"
          strokeWidth={4}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Eye patches */}
        <Ellipse
          cx={97.5}
          cy={99}
          rx={25.5}
          ry={25}
          fill="#252525"
          transform="rotate(-8 97.5 99)"
        />
        <Ellipse
          cx={166}
          cy={102.5}
          rx={25.5}
          ry={25.5}
          fill="#252525"
          transform="rotate(6 166 102.5)"
        />

        {/* Eye whites */}
        <Ellipse cx={99} cy={99} rx={18.5} ry={17.5} fill="#FFF" />
        <Ellipse cx={165.5} cy={102.75} rx={18} ry={17.75} fill="#FFF" />

        {/* Pupils & Highlights */}
        <G transform={`translate(${gazeX}, ${gazeY})`}>
          <Circle cx={100.5} cy={101} r={isSleep ? 12 : 14} fill="#252525" />
          <Circle cx={164.5} cy={105} r={isSleep ? 12 : 14} fill="#252525" />

          <Circle cx={95.5} cy={93.5} r={3.3} fill="#FFF" />
          <Circle cx={91.5} cy={99.5} r={2} fill="#FFF" />
          <Circle cx={159.5} cy={97} r={3} fill="#FFF" />
          <Circle cx={155.5} cy={103} r={2} fill="#FFF" />
        </G>

        {/* Nose */}
        <Ellipse cx={131.75} cy={113.75} rx={7} ry={4.6} fill="#252525" />

        {/* Mouth */}
        <Path
          d="M121 122 Q123.5 127.5 127 126 Q130 125 132 122.5 Q134 125.5 137 126 Q140.5 127.5 142.5 122.5"
          fill="none"
          stroke="#252525"
          strokeWidth={3.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </G>
    </Svg>
  );
}

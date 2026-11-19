// ponytail: exact Happi head vector art and acting poses matching .agents/onboarding.html and design mocks
import React from 'react';
import Svg, { Path, Ellipse, Circle, G } from 'react-native-svg';
import { GoalId } from '../../../domain/enums';

export interface HappiHeadSvgProps {
  goalId?: GoalId | 'card';
  size?: number;
}

const INK = '#252525';

export function HappiHeadSvg({
  goalId,
  size = 50,
}: HappiHeadSvgProps): React.JSX.Element {
  const isWorry = goalId === GoalId.Worry;
  const isMood = goalId === GoalId.Mood;
  const isStress = goalId === GoalId.Stress;
  const isSelf = goalId === GoalId.Self;
  const isSleep = goalId === GoalId.Sleep;

  // Head angles and sink per goal pose matching prototype specs
  const headAngle = isWorry ? 7 : isMood ? -6 : isStress ? -2 : isSelf ? -8 : isSleep ? 8 : 0;
  const sink = isMood ? 2 : isSleep ? 3 : isWorry || isStress || isSelf ? 1 : 0;
  const gazeX = isWorry ? 3.5 : isStress || isSelf ? -2.5 : 0;
  const gazeY = isMood || isSelf ? 3 : isWorry ? -1.5 : 0;
  const pupR = isWorry || isStress || isSelf ? 12.5 : 14;

  return (
    <Svg viewBox="40 10 180 166" width={size} height={size}>
      {/* Ears */}
      <Path
        d="M60 36 C66 22 86 18 98 26 C108 33 108 50 100 60 C90 70 70 70 62 60 C56 53 56 44 60 36 Z"
        fill={INK}
        stroke={INK}
        strokeWidth={5.5}
        strokeLinejoin="round"
      />
      <Path
        d="M164 40 C172 30 192 30 200 42 C207 53 205 68 196 74 C186 80 170 76 165 66 C161 58 160 48 164 40 Z"
        fill={INK}
        stroke={INK}
        strokeWidth={5.5}
        strokeLinejoin="round"
      />

      {/* Head shape */}
      <G transform={`translate(0, ${sink}) rotate(${headAngle} 131 152)`}>
        <Path
          d="M66 64 C84 46 104 40 118 40 C124 35 132 33 136 37 C158 38 182 44 196 64 C208 82 212 106 208 124 C204 144 186 158 160 163 C140 166 122 166 102 163 C76 158 55 142 52 112 C51 92 56 76 66 64 Z"
          fill="#FFF"
          stroke={INK}
          strokeWidth={5.5}
          strokeLinejoin="round"
        />

        {/* Hair tufts */}
        <Path
          d="M131 35 Q138 38 136 47 Q135 52 132 51 M141 45 Q146 49 144 55"
          fill="none"
          stroke={INK}
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
          fill={INK}
          transform="rotate(-8 97.5 99)"
        />
        <Ellipse
          cx={166}
          cy={102.5}
          rx={25.5}
          ry={25.5}
          fill={INK}
          transform="rotate(6 166 102.5)"
        />

        {/* Eyes & Gaze per pose */}
        {isSleep ? (
          /* Sleep: sleepy closed curved lids matching design mock */
          <G>
            <Path
              d="M86 102 Q98 108 110 102"
              fill="none"
              stroke={INK}
              strokeWidth={4.5}
              strokeLinecap="round"
            />
            <Path
              d="M154 105 Q166 111 178 105"
              fill="none"
              stroke={INK}
              strokeWidth={4.5}
              strokeLinecap="round"
            />
          </G>
        ) : (
          <G>
            {/* Eye whites */}
            <Ellipse
              cx={99}
              cy={isMood || isSelf ? 100 : 99}
              rx={18.5}
              ry={isMood ? 14 : isSelf ? 15 : 17.5}
              fill="#FFF"
            />
            <Ellipse
              cx={165.5}
              cy={isMood || isSelf ? 103.5 : 102.75}
              rx={18}
              ry={isMood ? 14 : isSelf ? 15 : 17.75}
              fill="#FFF"
            />

            {/* Pupils & Highlights */}
            <G transform={`translate(${gazeX}, ${gazeY})`}>
              <Circle cx={100.5} cy={101} r={pupR} fill={INK} />
              <Circle cx={164.5} cy={105} r={pupR} fill={INK} />

              <Circle cx={95.5} cy={93.5} r={3} fill="#FFF" />
              <Circle cx={91.5} cy={99.5} r={1.8} fill="#FFF" />
              <Circle cx={159.5} cy={97} r={2.8} fill="#FFF" />
              <Circle cx={155.5} cy={103} r={1.8} fill="#FFF" />
            </G>
          </G>
        )}

        {/* Nose */}
        <Ellipse cx={131.75} cy={113.75} rx={7} ry={4.6} fill={INK} />

        {/* Mouth per pose: flat/neutral for worry/stress/self/mood, calm curve for sleep, smile for default */}
        {isSleep ? (
          <Path
            d="M125 124 Q131.5 127 138 124"
            fill="none"
            stroke={INK}
            strokeWidth={3.2}
            strokeLinecap="round"
          />
        ) : isMood ? (
          <Path
            d="M125 125.5 Q131.5 124 138 125.5"
            fill="none"
            stroke={INK}
            strokeWidth={3.2}
            strokeLinecap="round"
          />
        ) : isWorry || isStress || isSelf ? (
          <Path
            d="M125 124.5 L138 124.5"
            fill="none"
            stroke={INK}
            strokeWidth={3.2}
            strokeLinecap="round"
          />
        ) : (
          <Path
            d="M121 122 Q123.5 127.5 127 126 Q130 125 132 122.5 Q134 125.5 137 126 Q140.5 127.5 142.5 122.5"
            fill="none"
            stroke={INK}
            strokeWidth={3.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}
      </G>
    </Svg>
  );
}

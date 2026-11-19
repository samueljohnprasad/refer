// ponytail: exact full-fidelity vector scene art from .agents/onboarding.html
import React from 'react';
import { View, Text } from 'react-native';
import Animated from 'react-native-reanimated';
import Svg, { Rect, Circle, G, Ellipse, Path, Line, Text as SvgText } from 'react-native-svg';
import { GoalId } from '../../../domain/enums';
import { riseIn } from '../animations';

export interface SceneArtSvgProps {
  goalId: GoalId;
  caption: string;
}

export function SceneArtSvg({ goalId, caption }: SceneArtSvgProps): React.JSX.Element {
  return (
    <Animated.View
      entering={riseIn()}
      className="w-full rounded-3xl overflow-hidden bg-white/40 mb-3 border border-black/5 shadow-xs"
    >
      <View className="w-full h-28 items-center justify-center p-1">
        {goalId === GoalId.Worry && (
          <Svg viewBox="0 0 240 100" width="100%" height="100%">
            <Ellipse cx={120} cy={96} rx={34} ry={4} fill="#142414" opacity={0.07} />
            <Path
              d="M80 38 q-6 10 0 20M72 33 q-9 15 0 30M160 38 q6 10 0 20M168 33 q9 15 0 30"
              fill="none"
              stroke="#e09a24"
              strokeWidth={3}
              strokeLinecap="round"
            />
            <G transform="rotate(-6 120 52)">
              <Rect x={96} y={14} width={48} height={80} rx={10} fill="#9a83d4" />
              <Rect x={96} y={10} width={48} height={80} rx={10} fill="#c3b3ea" />
              <Rect x={101} y={18} width={38} height={64} rx={5} fill="#fffaf0" />
              <Rect x={112} y={13} width={16} height={2.5} rx={1.2} fill="#9a83d4" />
              <Path d="M106 52 l-2 7 l8 -5z" fill="#5f9ed4" />
              <Rect x={104} y={34} width={30} height={20} rx={7} fill="#5f9ed4" />
              <Line x1={110} y1={41} x2={127} y2={41} stroke="#fff" strokeWidth={2.5} strokeLinecap="round" />
              <Line x1={110} y1={47} x2={121} y2={47} stroke="#fff" strokeWidth={2.5} strokeLinecap="round" />
            </G>
            <SvgText x={44} y={52} fontSize={24} fontWeight="700" fill="#e09a24">?</SvgText>
            <SvgText x={184} y={34} fontSize={18} fontWeight="700" fill="#e09a24">?</SvgText>
            <SvgText x={192} y={80} fontSize={13} fontWeight="700" fill="#dd7b5a">?</SvgText>
          </Svg>
        )}

        {goalId === GoalId.Mood && (
          <Svg viewBox="0 0 240 100" width="100%" height="100%">
            <Ellipse cx={177} cy={96} rx={46} ry={4} fill="#142414" opacity={0.07} />
            <Rect x={34} y={18} width={62} height={56} rx={7} fill="#a5714a" />
            <Rect x={34} y={14} width={62} height={56} rx={7} fill="#c99363" />
            <Rect x={40} y={20} width={50} height={44} rx={3} fill="#b9c6cf" />
            <Path d="M48 34 c0-6 8-8 11-4 c3-6 13-5 13 2 c5 0 6 7 0 7h-22c-5 0-6-5-2-5z" fill="#8e9ea9" />
            <Path d="M52 46l-2 6M62 44l-2 6M72 47l-2 6M82 44l-2 6" stroke="#6f8494" strokeWidth={2.5} strokeLinecap="round" />
            <Path d="M65 20v44M40 42h50" stroke="#c99363" strokeWidth={3} />
            <Rect x={132} y={36} width={12} height={58} rx={4} fill="#a5714a" />
            <Rect x={138} y={72} width={78} height={16} rx={6} fill="#a5714a" />
            <Rect x={138} y={68} width={78} height={16} rx={6} fill="#c99363" />
            <Rect x={144} y={86} width={5} height={9} rx={2} fill="#a5714a" />
            <Rect x={206} y={86} width={5} height={9} rx={2} fill="#a5714a" />
            <Ellipse cx={156} cy={62} rx={13} ry={7} fill="#fff" />
            <Path d="M156 72 C156 52 178 46 194 52 C208 44 222 54 220 72 Z" fill="#9a83d4" />
            <Path d="M156 69 C156 50 178 44 194 50 C208 42 222 52 220 69 Z" fill="#c3b3ea" />
          </Svg>
        )}

        {goalId === GoalId.Stress && (
          <Svg viewBox="0 0 240 100" width="100%" height="100%">
            <G transform="rotate(-12 70 54)">
              <Rect x={43} y={28} width={54} height={62} rx={8} fill="#dd7b5a" />
              <Rect x={43} y={24} width={54} height={62} rx={8} fill="#fff" />
              <Path d="M43 40v-8a8 8 0 0 1 8-8h38a8 8 0 0 1 8 8v8z" fill="#f4a688" />
              <Rect x={56} y={18} width={5} height={12} rx={2.5} fill="#a5714a" />
              <Rect x={79} y={18} width={5} height={12} rx={2.5} fill="#a5714a" />
              <SvgText x={70} y={70} textAnchor="middle" fontSize={20} fontWeight="700" fill="#dd7b5a">14</SvgText>
              <Ellipse cx={70} cy={63} rx={17} ry={13} fill="none" stroke="#dd7b5a" strokeWidth={2.5} />
            </G>
            <G transform="rotate(0 120 54)">
              <Rect x={93} y={28} width={54} height={62} rx={8} fill="#dd7b5a" />
              <Rect x={93} y={24} width={54} height={62} rx={8} fill="#fff" />
              <Path d="M93 40v-8a8 8 0 0 1 8-8h38a8 8 0 0 1 8 8v8z" fill="#f4a688" />
              <Rect x={106} y={18} width={5} height={12} rx={2.5} fill="#a5714a" />
              <Rect x={129} y={18} width={5} height={12} rx={2.5} fill="#a5714a" />
              <SvgText x={120} y={70} textAnchor="middle" fontSize={20} fontWeight="700" fill="#dd7b5a">14</SvgText>
              <Ellipse cx={120} cy={63} rx={17} ry={13} fill="none" stroke="#dd7b5a" strokeWidth={2.5} />
            </G>
            <G transform="rotate(12 170 54)">
              <Rect x={143} y={28} width={54} height={62} rx={8} fill="#dd7b5a" />
              <Rect x={143} y={24} width={54} height={62} rx={8} fill="#fff" />
              <Path d="M143 40v-8a8 8 0 0 1 8-8h38a8 8 0 0 1 8 8v8z" fill="#f4a688" />
              <Rect x={156} y={18} width={5} height={12} rx={2.5} fill="#a5714a" />
              <Rect x={179} y={18} width={5} height={12} rx={2.5} fill="#a5714a" />
              <SvgText x={170} y={70} textAnchor="middle" fontSize={20} fontWeight="700" fill="#dd7b5a">14</SvgText>
              <Ellipse cx={170} cy={63} rx={17} ry={13} fill="none" stroke="#dd7b5a" strokeWidth={2.5} />
            </G>
            <Path d="M24 22v12M24 40v.5M216 42v12M216 60v.5" stroke="#e09a24" strokeWidth={4} strokeLinecap="round" />
          </Svg>
        )}

        {goalId === GoalId.Self && (
          <Svg viewBox="0 0 240 100" width="100%" height="100%">
            <Path d="M78 66 l-12 18 l26 -14z" fill="#9a83d4" />
            <Rect x={66} y={16} width={112} height={56} rx={20} fill="#9a83d4" />
            <Path d="M78 62 l-12 18 l26 -14z" fill="#fff" />
            <Rect x={66} y={12} width={112} height={56} rx={20} fill="#fff" />
            <Path
              d="M84 42 c8-16 18 12 26-2 s4-18 12-4 s10 14 16-2 c4-10 12-6 10 4 s-8 8 4 4 s12-10 14-2"
              fill="none"
              stroke="#9a83d4"
              strokeWidth={4}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <SvgText x={150} y={86} fontSize={14} fontWeight="700" fill="#9a83d4" transform="rotate(18 150 86)">w</SvgText>
            <SvgText x={168} y={92} fontSize={11} fontWeight="700" fill="#9a83d4" transform="rotate(-14 168 92)">o</SvgText>
            <SvgText x={184} y={84} fontSize={13} fontWeight="700" fill="#9a83d4" transform="rotate(24 184 84)">r</SvgText>
            <Path d="M46 24 l4 4M44 36h6M196 22 l-4 4M200 34h-6" stroke="#dd7b5a" strokeWidth={3} strokeLinecap="round" />
          </Svg>
        )}

        {goalId === GoalId.Sleep && (
          <Svg viewBox="0 0 240 100" width="100%" height="100%">
            <G transform="translate(36 -6) scale(0.62)">
              <Path d="M72 18 a20 20 0 1 0 22 26 a16 16 0 0 1 -22 -26z" fill="#f5b942" />
            </G>
            <Path d="M28 18 q1 5 6 6 q-5 1 -6 6 q-1 -5 -6 -6 q5 -1 6 -6z" fill="#e09a24" />
            <Path d="M106 14 q.7 3.5 4 4 q-3.3 .7 -4 4 q-.7 -3.3 -4 -4 q3.3 -.5 4 -4z" fill="#e09a24" />
            <Ellipse cx={62} cy={64} rx={28} ry={10} fill="#fffaf0" />
            <Circle cx={46} cy={54} r={5} fill="#142414" />
            <Circle cx={70} cy={54} r={5} fill="#142414" />
            <Circle cx={58} cy={68} r={17} fill="#fff" stroke="#142414" strokeWidth={2} />
            <Ellipse cx={51} cy={65} rx={5.5} ry={5} fill="#142414" />
            <Ellipse cx={65} cy={65} rx={5.5} ry={5} fill="#142414" />
            <Circle cx={51} cy={64.5} r={3} fill="#fff" />
            <Circle cx={65} cy={64.5} r={3} fill="#fff" />
            <Path d="M20 96 C20 80 40 74 60 76 C82 72 108 76 112 96 Z" fill="#9a83d4" />
            <Path d="M20 94 C20 77 40 71 60 73 C82 69 108 73 112 94 Z" fill="#c3b3ea" />
            <Circle cx={136} cy={30} r={8} fill="#5f9ed4" />
            <Circle cx={176} cy={30} r={8} fill="#5f9ed4" />
            <Path d="M140 84l-6 10M172 84l6 10" stroke="#5f9ed4" strokeWidth={4} strokeLinecap="round" />
            <Circle cx={156} cy={60} r={31} fill="#5f9ed4" />
            <Circle cx={156} cy={56} r={31} fill="#9cc8ec" />
            <Circle cx={156} cy={56} r={24} fill="#fff" />
            <Path d="M156 35v3M177 56h-3M156 77v-3M135 56h3" stroke="#5f9ed4" strokeWidth={3} strokeLinecap="round" />
            <Path d="M156 56V40M156 56l4.5 -7.8" stroke="#142414" strokeWidth={3} strokeLinecap="round" />
            <Circle cx={156} cy={56} r={2.5} fill="#142414" />
            <Path d="M206 26 q.8 4 5 5 q-4.2 .8 -5 5 q-.8 -4.2 -5 -5 q4.2 -1 5 -5z" fill="#e09a24" />
          </Svg>
        )}
      </View>
      {Boolean(caption) && (
        <Text className="px-4 pb-3 font-bold text-neutral-900 text-sm">{caption}</Text>
      )}
    </Animated.View>
  );
}

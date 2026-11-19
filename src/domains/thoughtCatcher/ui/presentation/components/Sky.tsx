// ponytail: the thought as weather (.sky svg), direct port of thought-catcher.html's SKY(f) generator —
// sun fades / cloud darkens+grows / brow furrows / rain falls as f (0-1 believability) rises.
import React from 'react';
import { View } from 'react-native';
import Svg, { Circle, Path, Line, G, Rect } from 'react-native-svg';
import { FallingRain } from '@/src/components/exercise/FallingRain';

/** the thought as weather: f (0-1) is believability — sun fades, cloud darkens and grows, brow furrows, rain falls */
export function Sky({ f }: { f: number }): React.JSX.Element {
  const cloudColor = `rgb(${Math.round(228 - f * (228 - 169))}, ${Math.round(238 - f * (238 - 191))}, ${Math.round(224 - f * (224 - 160))})`;
  const sunOpacity = Math.max(0, 1 - f);
  const browOpacity = Math.max(0, (f - 0.6) * 2.5);
  const rainOpacity = Math.max(0, (f - 0.55) * 2.2);
  const cloudScale = 0.72 + 0.28 * f;
  const mouthScaleY = 1 - 2 * f;
  return (
    <View style={{ width: '100%', aspectRatio: 200 / 130 }} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
    <Svg width="100%" height="100%" viewBox="0 0 200 130">
      <G transform={`translate(0 ${f * 14})`} opacity={sunOpacity}>
        <Circle cx={140} cy={46} r={24} fill="#f5b942" />
        {[...Array(8)].map((_, i) => {
          const a = (i * Math.PI) / 4;
          return (
            <Line
              key={i}
              x1={140 + Math.cos(a) * 32}
              y1={46 + Math.sin(a) * 32}
              x2={140 + Math.cos(a) * 40}
              y2={46 + Math.sin(a) * 40}
              stroke="#f5b942"
              strokeWidth={4}
              strokeLinecap="round"
            />
          );
        })}
      </G>
      <G transform={`translate(96 ${62 + f * 10}) scale(${cloudScale})`}>
        <Circle cx={-32} cy={16} r={24} fill={cloudColor} />
        <Circle cx={0} cy={0} r={30} fill={cloudColor} />
        <Circle cx={34} cy={18} r={22} fill={cloudColor} />
        <Rect x={-56} y={16} width={112} height={24} rx={12} fill={cloudColor} />
        <Circle cx={-10} cy={18} r={3.5} fill="#142414" />
        <Circle cx={16} cy={18} r={3.5} fill="#142414" />
        <Path d="M-14 10L-2 13" stroke="#142414" strokeWidth={3} strokeLinecap="round" opacity={browOpacity} />
        <Path d="M22 10L10 13" stroke="#142414" strokeWidth={3} strokeLinecap="round" opacity={browOpacity} />
        <Path
          d="M-5 29Q3 37 11 29"
          fill="none"
          stroke="#142414"
          strokeWidth={3}
          strokeLinecap="round"
          transform={`scale(1, ${mouthScaleY})`}
        />
      </G>
      <FallingRain opacity={rainOpacity} />
    </Svg>
    </View>
  );
}

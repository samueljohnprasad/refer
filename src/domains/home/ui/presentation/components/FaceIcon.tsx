// ponytail: the 5 mood face SVGs from .agents/home.html's MOODS array (terrible..great) — distinct from
// the app's existing MoodIcon set, ported verbatim (circle head + 2 eye dots + a mouth path per mood).
import React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';

export type MoodKey = 'terrible' | 'bad' | 'okay' | 'good' | 'great';

const MOUTHS: Record<MoodKey, string> = {
  terrible: 'M8 16.5q4-3.5 8 0',
  bad: 'M8.5 16q3.5-2 7 0',
  okay: 'M8.5 15h7',
  good: 'M8.5 14q3.5 2.5 7 0',
  great: 'M8 13.5q4 5 8 0Z',
};

export interface FaceIconProps {
  mood: MoodKey;
  size?: number;
  color: string;
}

export function FaceIcon({ mood, size = 22, color }: FaceIconProps): React.JSX.Element {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round">
      <Circle cx={12} cy={12} r={10} />
      <Circle cx={8.8} cy={10} r={0.6} fill={color} />
      <Circle cx={15.2} cy={10} r={0.6} fill={color} />
      <Path d={MOUTHS[mood]} fill={mood === 'great' ? color : 'none'} />
    </Svg>
  );
}

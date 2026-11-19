// ponytail: the .rg SVG ring from .agents/home.html — a track circle + a value circle drawn with
// stroke-dasharray, used by the header count chip and the account sheet's "this week" tile.
import React from 'react';
import Svg, { Circle } from 'react-native-svg';

export interface ProgressRingProps {
  value: number;
  goal: number;
  size?: number;
  trackColor?: string;
  valueColor?: string;
}

export function ProgressRing({
  value,
  goal,
  size = 18,
  trackColor = '#e4eee0',
  valueColor = '#44633f',
}: ProgressRingProps): React.JSX.Element {
  const r = 7.5;
  const circumference = 2 * Math.PI * r;
  const fraction = goal > 0 ? Math.min(1, value / goal) : 0;
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20" style={{ transform: [{ rotate: '-90deg' }] }}>
      <Circle cx={10} cy={10} r={r} fill="none" stroke={trackColor} strokeWidth={3.5} />
      {fraction > 0 && (
        <Circle
          cx={10}
          cy={10}
          r={r}
          fill="none"
          stroke={valueColor}
          strokeWidth={3.5}
          strokeLinecap="round"
          strokeDasharray={`${fraction * circumference} ${circumference}`}
          strokeDashoffset={0}
        />
      )}
    </Svg>
  );
}

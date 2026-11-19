// ponytail: shared hollow→filled 0-10 dot-track, matching .agents/exercises.html's `.mv`/`move()` —
// extracted once so ShiftBadge (My Log footer) and TimelineEntryCard (collapsed head row) don't
// each redraw the same SVG geometry. Colour says whether it helped (sage), stayed (grey) or went
// the other way (amber); position and the label text say which direction.
import React from 'react';
import Svg, { Circle, Line } from 'react-native-svg';
import { MoveTone } from '../../../domain/timelineEntry';

const trackX = (v: number): number => 8 + v * 8.4;

const TONE_COLOR: Record<MoveTone, string> = {
  [MoveTone.Helped]: '#5f7f58',
  [MoveTone.Flat]: '#8a918a',
  [MoveTone.Against]: '#c9852f',
};

export interface MoveTrackProps {
  before: number;
  after: number;
  tone?: MoveTone;
  width?: number;
  height?: number;
}

export function MoveTrack({ before, after, tone = MoveTone.Helped, width = 64, height = 10 }: MoveTrackProps): React.JSX.Element {
  const c = TONE_COLOR[tone];
  return (
    <Svg width={width} height={height} viewBox="0 0 100 16">
      <Line x1={8} y1={8} x2={92} y2={8} stroke="#e5e5e5" strokeWidth={4} strokeLinecap="round" />
      <Line x1={trackX(before)} y1={8} x2={trackX(after)} y2={8} stroke={c} strokeWidth={4} strokeLinecap="round" />
      <Circle cx={trackX(before)} cy={8} r={5} fill="#fff" stroke={c} strokeWidth={2.5} />
      <Circle cx={trackX(after)} cy={8} r={5.5} fill={c} />
    </Svg>
  );
}

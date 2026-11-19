// ponytail: the ten feeling faces from .agents/abc-analysis.html's FACES, one construction (a round face)
// with only the features changing. Pure presentation.
import React from 'react';
import Svg, { Circle, Ellipse, Path, Rect } from 'react-native-svg';

const INK = '#142414';
const WHITE = '#fff';
const SKY2 = '#5f9ed4';
const COR = '#f4a688';
const SUN2 = '#e09a24';

const Ln = ({ d, c = INK, w = 3 }: { d: string; c?: string; w?: number }) => (
  <Path d={d} fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" />
);
const Eyes = ({ x1 = 23, x2 = 41, y = 30, r = 3.2 }: { x1?: number; x2?: number; y?: number; r?: number }) => (
  <>
    <Circle cx={x1} cy={y} r={r} fill={INK} />
    <Circle cx={x2} cy={y} r={r} fill={INK} />
  </>
);
const Drop = ({ x, y }: { x: number; y: number }) => (
  <Path d={`M${x} ${y} C${x + 3} ${y + 5} ${x + 4} ${y + 8} ${x} ${y + 10} C${x - 4} ${y + 8} ${x - 3} ${y + 5} ${x} ${y} Z`} fill={SKY2} />
);

const FEATURES: Record<string, React.JSX.Element> = {
  anxious: <><Eyes /><Ln d="M16 22 L26 19 M48 22 L38 19" /><Ln d="M21 44 q2.75 -3 5.5 0 t5.5 0 t5.5 0 t5.5 0" /><Drop x={51} y={10} /></>,
  sad: <><Eyes y={31} /><Ln d="M16 23 L26 20 M48 23 L38 20" /><Ln d="M24 46 Q32 39 40 46" /><Drop x={21} y={35} /></>,
  angry: <><Eyes y={31} /><Ln d="M15 20 L27 25 M49 20 L37 25" /><Ln d="M24 45 Q32 40 40 45" /></>,
  ashamed: <><Ellipse cx={17} cy={39} rx={5.5} ry={3.5} fill={COR} /><Ellipse cx={47} cy={39} rx={5.5} ry={3.5} fill={COR} /><Ln d="M18 31 Q23 35 28 31 M36 31 Q41 35 46 31" /><Ln d="M28 44 H36" /></>,
  hopeless: <><Ln d="M18 31 H28 M36 31 H46" /><Ln d="M17 24 L27 25 M47 24 L37 25" w={2.5} /><Ln d="M25 45 Q32 41 39 45" /></>,
  guilty: <><Eyes x1={19} x2={37} y={31} /><Ln d="M14 24 L24 21 M42 24 L32 21" /><Ln d="M29 44 q3 -2.5 6 0" /></>,
  frustrated: <><Eyes /><Ln d="M15 20 L27 25 M49 20 L37 25" /><Rect x={22} y={39} width={20} height={9} rx={3.5} fill={WHITE} stroke={INK} strokeWidth={2.5} /><Ln d="M22.5 43.5 H41.5" w={2} /></>,
  fearful: <><Circle cx={23} cy={30} r={5.5} fill={WHITE} stroke={INK} strokeWidth={2.5} /><Circle cx={41} cy={30} r={5.5} fill={WHITE} stroke={INK} strokeWidth={2.5} /><Eyes y={31} r={2.3} /><Ln d="M16 20 Q22 15 28 18 M48 20 Q42 15 36 18" /><Ellipse cx={32} cy={45} rx={4.5} ry={5.5} fill={INK} /></>,
  overwhelmed: <><Ln d="M14 10 L18 15 M32 3 V9 M50 10 L46 15" c={SUN2} /><Ln d="M19 30 a4 4 0 1 1 4 4 M37 30 a4 4 0 1 1 4 4" /><Ln d="M21 45 q2.75 -3 5.5 0 t5.5 0 t5.5 0 t5.5 0" /></>,
  lonely: <><Eyes x1={22} x2={40} y={33} /><Ln d="M16 26 L26 25 M46 26 L36 25" w={2.5} /><Ln d="M27 46 Q32 42 37 46" /></>,
};

export function AbcFace({ name, on, size = 56 }: { name: string; on: boolean; size?: number }): React.JSX.Element {
  return (
    <Svg width={size} height={size} viewBox="0 0 64 64">
      <Circle cx={32} cy={35} r={26} fill={on ? SUN2 : '#8fb184'} />
      <Circle cx={32} cy={32} r={26} fill={on ? '#f5b942' : '#c5d8bc'} />
      {FEATURES[name]}
    </Svg>
  );
}

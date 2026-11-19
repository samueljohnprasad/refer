// ponytail: direct react-native-svg port of .agents/thought-reframing.html's art (`skyBody`, `face`) —
// geometry and colours copied verbatim. Pure presentation: ThoughtSky takes a 0-10 belief, EmotionFace
// a name + whether it is picked (picked warms from sage to sun).
import React from 'react';
import Svg, { Circle, Ellipse, G, Line, Path, Rect } from 'react-native-svg';

const C = {
  s1: '#c5d8bc', s2: '#8fb184', s3: '#5f7f58', s4: '#44633f', sun: '#f5b942', sun2: '#e09a24',
  sky2: '#5f9ed4', cor: '#f4a688', ink: '#142414', w: '#ffffff', wash: '#f6ecd8',
};
const f1 = (n: number): number => Math.round(n * 10) / 10;
const mix = (a: string, b: string, t: number): string =>
  '#' + [1, 3, 5].map((i) => Math.round(parseInt(a.slice(i, i + 2), 16) * (1 - t) + parseInt(b.slice(i, i + 2), 16) * t).toString(16).padStart(2, '0')).join('');

const CLOUD = 'M10 34 C3 34 0 28 2 23 C3 18 8 16 12 17 C12 9 19 4 27 5 C32 0 42 0 47 6 C55 6 60 13 58 20 C62 23 61 34 52 34 Z';

function Mood({ x, y, s, m, brow = 0 }: { x: number; y: number; s: number; m: number; brow?: number }) {
  return (
    <G transform={`translate(${f1(x)} ${f1(y)}) scale(${s})`}>
      <Circle cx={-7} cy={0} r={2.8} fill={C.ink} />
      <Circle cx={7} cy={0} r={2.8} fill={C.ink} />
      {brow > 0 && <Path d="M-12 -5 L-4 -8.5 M12 -5 L4 -8.5" stroke={C.ink} strokeWidth={2.4} strokeLinecap="round" opacity={Math.min(1, brow)} />}
      <Path d={`M-4.5 6 Q0 ${f1(6 + 5 * m)} 4.5 6`} stroke={C.ink} strokeWidth={2.4} strokeLinecap="round" fill="none" />
      {m > 0.3 && (
        <>
          <Circle cx={-11} cy={4} r={2.8} fill={C.cor} opacity={0.6} />
          <Circle cx={11} cy={4} r={2.8} fill={C.cor} opacity={0.6} />
        </>
      )}
    </G>
  );
}

/** the weather of a thought: heavy grey cloud and rain at 10, a small white cloud and full sun at 0 */
export function ThoughtSky({ value }: { value: number }): React.JSX.Element {
  const t = Math.min(10, Math.max(0, value)) / 10;
  const cs = 0.95 + t * 0.85, cx = 112 + t * 50, x = cx - 30 * cs, y = 30 + t * 6, sy = 50 + t * 74, bottom = y + 34 * cs;
  const n = t > 0.5 ? Math.round((t - 0.5) * 10) : 0;
  return (
    <Svg viewBox="0 0 320 168" width="100%" style={{ aspectRatio: 320 / 168 }} accessibilityLabel={`Weather picture: ${value} out of 10`}>
      <Rect width={320} height={168} fill={mix(C.wash, '#e3e8e0', t)} />
      {t < 0.9 && <Circle cx={232} cy={f1(sy)} r={34} fill={C.sun} opacity={(1 - t) * 0.25} />}
      {t < 0.6 && [...Array(8)].map((_, i) => {
        const a = (i * Math.PI) / 4, c = Math.cos(a), s = Math.sin(a);
        return <Line key={i} x1={f1(232 + c * 31)} y1={f1(sy + s * 31)} x2={f1(232 + c * 40)} y2={f1(sy + s * 40)} stroke={C.sun} strokeWidth={4} strokeLinecap="round" opacity={1 - t / 0.6} />;
      })}
      <Circle cx={232} cy={f1(sy)} r={23} fill={C.sun} />
      <Path d="M0 128 C52 110 98 114 142 124 C192 108 252 106 320 120 L320 168 L0 168 Z" fill={mix(C.s2, '#a3ad9f', t * 0.7)} />
      <Path d="M0 146 C60 132 120 136 170 146 C220 136 280 134 320 142 L320 168 L0 168 Z" fill={mix(C.s3, '#7d8a78', t * 0.7)} />
      {[...Array(n)].map((_, i) => {
        const rx = x + 12 * cs + (i + 0.5) * ((36 * cs) / n);
        return <Line key={i} x1={f1(rx)} y1={f1(bottom + 8)} x2={f1(rx - 4)} y2={f1(bottom + 20)} stroke={C.sky2} strokeWidth={3.5} strokeLinecap="round" />;
      })}
      <G transform={`translate(${f1(x)} ${f1(y)}) scale(${f1(cs * 100) / 100})`}>
        <Path d={CLOUD} fill={mix('#e2ead9', '#7f9179', t)} transform="translate(0 3)" />
        <Path d={CLOUD} fill={mix(C.w, '#adbaa7', t)} />
      </G>
      <Mood x={x + 30 * cs} y={y + 22 * cs} s={0.8 + t * 0.5} m={1 - 2 * t} brow={(t - 0.55) * 2.4} />
    </Svg>
  );
}

const ln = (d: string, w = 3, c = C.ink) => <Path d={d} stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" fill="none" />;
const eyes = (x1 = 23, x2 = 41, y = 30, r = 3.2) => (
  <>
    <Circle cx={x1} cy={y} r={r} fill={C.ink} />
    <Circle cx={x2} cy={y} r={r} fill={C.ink} />
  </>
);
const drop = (x: number, y: number) => <Path d={`M${x} ${y} C${x + 3} ${y + 5} ${x + 4} ${y + 8} ${x} ${y + 10} C${x - 4} ${y + 8} ${x - 3} ${y + 5} ${x} ${y} Z`} fill={C.sky2} />;
const ring = (cx: number) => <Circle cx={cx} cy={30} r={5.5} fill={C.w} stroke={C.ink} strokeWidth={2.5} />;

const FEATURES: Record<string, () => React.JSX.Element> = {
  anxious: () => <>{eyes()}{ln('M16 22 L26 19 M48 22 L38 19')}{ln('M21 44 q2.75 -3 5.5 0 t5.5 0 t5.5 0 t5.5 0')}{drop(51, 10)}</>,
  sad: () => <>{eyes(23, 41, 31)}{ln('M16 23 L26 20 M48 23 L38 20')}{ln('M24 46 Q32 39 40 46')}{drop(21, 35)}</>,
  angry: () => <>{eyes(23, 41, 31)}{ln('M15 20 L27 25 M49 20 L37 25')}{ln('M24 45 Q32 40 40 45')}</>,
  ashamed: () => <><Ellipse cx={17} cy={39} rx={5.5} ry={3.5} fill={C.cor} /><Ellipse cx={47} cy={39} rx={5.5} ry={3.5} fill={C.cor} />{ln('M18 31 Q23 35 28 31 M36 31 Q41 35 46 31')}{ln('M28 44 H36')}</>,
  hopeless: () => <>{ln('M18 31 H28 M36 31 H46')}{ln('M17 24 L27 25 M47 24 L37 25', 2.5)}{ln('M25 45 Q32 41 39 45')}</>,
  guilty: () => <>{eyes(19, 37, 31)}{ln('M14 24 L24 21 M42 24 L32 21')}{ln('M29 44 q3 -2.5 6 0')}</>,
  frustrated: () => <>{eyes(23, 41, 30)}{ln('M15 20 L27 25 M49 20 L37 25')}<Rect x={22} y={39} width={20} height={9} rx={3.5} fill={C.w} stroke={C.ink} strokeWidth={2.5} />{ln('M22.5 43.5 H41.5', 2)}</>,
  fearful: () => <>{ring(23)}{ring(41)}{eyes(23, 41, 31, 2.3)}{ln('M16 20 Q22 15 28 18 M48 20 Q42 15 36 18')}<Ellipse cx={32} cy={45} rx={4.5} ry={5.5} fill={C.ink} /></>,
  overwhelmed: () => <>{ln('M14 10 L18 15 M32 3 V9 M50 10 L46 15', 3, C.sun2)}{ln('M19 30 a4 4 0 1 1 4 4 M37 30 a4 4 0 1 1 4 4')}{ln('M21 45 q2.75 -3 5.5 0 t5.5 0 t5.5 0 t5.5 0')}</>,
  lonely: () => <>{eyes(22, 40, 33)}{ln('M16 26 L26 25 M46 26 L36 25', 2.5)}{ln('M27 46 Q32 42 37 46')}</>,
};

export function EmotionFace({ name, on, size = 56 }: { name: string; on: boolean; size?: number }): React.JSX.Element {
  const Feature = FEATURES[name];
  return (
    <Svg viewBox="0 0 64 64" width={size} height={size}>
      <Circle cx={32} cy={35} r={26} fill={on ? C.sun2 : C.s2} />
      <Circle cx={32} cy={32} r={26} fill={on ? C.sun : C.s1} />
      {Feature ? <Feature /> : null}
    </Svg>
  );
}

// ponytail: the feeling as weather (.agents/abc-analysis.html's SKY): `strength` 0..1 shrinks the sun,
// darkens and grows the cloud, adds a brow, a frown and rain. Pure presentation.
import React from 'react';
import Svg, { Circle, G, Line, Path, Rect } from 'react-native-svg';

const RAYS = Array.from({ length: 8 }, (_, i) => {
  const a = (i * Math.PI) / 4;
  const c = Math.cos(a);
  const n = Math.sin(a);
  return { x1: Math.round(140 + c * 32), y1: Math.round(46 + n * 32), x2: Math.round(140 + c * 40), y2: Math.round(46 + n * 40) };
});

const mix = (a: number[], b: number[], t: number) => `rgb(${a.map((v, i) => Math.round(v + (b[i] - v) * t)).join(',')})`;
const CLOUD_LO = [228, 238, 224];
const CLOUD_HI = [169, 191, 160];

export function AbcSky({ strength, width = 200 }: { strength: number; width?: number }): React.JSX.Element {
  const f = Math.min(1, Math.max(0, strength));
  const cloud = mix(CLOUD_LO, CLOUD_HI, f);
  const cloudScale = 0.72 + 0.28 * f;
  const sunOpacity = 1 - f;
  const brow = Math.max(0, (f - 0.6) * 2.5);
  const rain = Math.max(0, (f - 0.55) * 2.2);
  return (
    <Svg width={width} height={width * 0.65} viewBox="0 0 200 130">
      <G opacity={sunOpacity} translateY={f * 14}>
        <Circle cx={140} cy={46} r={24} fill="#f5b942" />
        {RAYS.map((r, i) => <Line key={i} {...r} stroke="#f5b942" strokeWidth={4} strokeLinecap="round" />)}
      </G>
      <G origin="96, 102" scale={cloudScale}>
        <G fill={cloud}>
          <Circle cx={64} cy={78} r={24} />
          <Circle cx={96} cy={62} r={30} />
          <Circle cx={130} cy={80} r={22} />
          <Rect x={40} y={78} width={112} height={24} rx={12} />
        </G>
      </G>
      <Circle cx={86} cy={80} r={3.5} fill="#142414" />
      <Circle cx={112} cy={80} r={3.5} fill="#142414" />
      <Path d="M80 72L92 75M118 72L106 75" stroke="#142414" strokeWidth={3} strokeLinecap="round" opacity={brow} />
      <Path d="M91 91Q99 99 107 91" fill="none" stroke="#142414" strokeWidth={3} strokeLinecap="round" transform={`translate(99 95) scale(1 ${1 - 2 * f}) translate(-99 -95)`} />
      <G opacity={rain}>
        {[78, 98, 118].map((x) => <Line key={x} x1={x} y1={108} x2={x} y2={113} stroke="#44633f" strokeWidth={3} strokeLinecap="round" />)}
      </G>
    </Svg>
  );
}

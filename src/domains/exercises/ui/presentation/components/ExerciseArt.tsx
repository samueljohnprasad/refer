// ponytail: direct port of .agents/exercise-art.js's ART (13 per-exercise illustrations, 160x120
// canvas) and GLYPH (5 reply-tile icons) into react-native-svg. Geometry/colors copied verbatim
// from the prototype's inline generators (face/cloud/spark/heart/leaf/stone/rays), same approach
// as SceneArtSvg.tsx's port of home.html's inline scene script.
import React from 'react';
import Svg, { Circle, Ellipse, G, Line, Path, Rect, Text } from 'react-native-svg';
import type { ExerciseType } from '@/src/types/exerciseFlow';

const C = {
  s1: '#c5d8bc', s2: '#8fb184', s3: '#5f7f58', s4: '#44633f',
  sun: '#f5b942', sun2: '#e09a24', sky: '#9cc8ec', sky2: '#5f9ed4',
  cor: '#f4a688', cor2: '#dd7b5a', lav: '#c3b3ea', lav2: '#9a83d4',
  wood: '#c99363', wood2: '#a5714a', sand: '#ead7b5', ink: '#142414', w: '#ffffff', cream: '#fffaf0',
} as const;

function Shadow({ cx, rx, cy = 106 }: { cx: number; rx: number; cy?: number }): React.JSX.Element {
  return <Ellipse cx={cx} cy={cy} rx={rx} ry={5} fill={C.ink} opacity={0.07} />;
}

function Face({ x, y, s = 1 }: { x: number; y: number; s?: number }): React.JSX.Element {
  return (
    <G transform={`translate(${x} ${y}) scale(${s})`}>
      <Circle cx={-6} cy={0} r={2.6} fill={C.ink} />
      <Circle cx={6} cy={0} r={2.6} fill={C.ink} />
      <Path d="M-3.5 5 Q0 8.5 3.5 5" fill="none" stroke={C.ink} strokeWidth={2} strokeLinecap="round" />
      <Circle cx={-10.5} cy={4} r={2.8} fill={C.cor} opacity={0.55} />
      <Circle cx={10.5} cy={4} r={2.8} fill={C.cor} opacity={0.55} />
    </G>
  );
}

function Cloud({ x, y, s, fill, shade }: { x: number; y: number; s: number; fill: string; shade?: string }): React.JSX.Element {
  const d = 'M10 34 C3 34 0 28 2 23 C3 18 8 16 12 17 C12 9 19 4 27 5 C32 0 42 0 47 6 C55 6 60 13 58 20 C62 23 61 34 52 34 Z';
  return (
    <G transform={`translate(${x} ${y}) scale(${s})`}>
      {shade && <Path d={d} fill={shade} transform="translate(0 3)" />}
      <Path d={d} fill={fill} />
    </G>
  );
}

function Spark({ x, y, r, fill }: { x: number; y: number; r: number; fill: string }): React.JSX.Element {
  const d = `M${x} ${y - r} Q${x + r * 0.2} ${y - r * 0.2} ${x + r} ${y} Q${x + r * 0.2} ${y + r * 0.2} ${x} ${y + r} Q${x - r * 0.2} ${y + r * 0.2} ${x - r} ${y} Q${x - r * 0.2} ${y - r * 0.2} ${x} ${y - r} Z`;
  return <Path d={d} fill={fill} />;
}

function Heart({ x, y, s, fill }: { x: number; y: number; s: number; fill: string }): React.JSX.Element {
  const d = `M${x} ${y + s * 0.9} C${x - s * 1.25} ${y + s * 0.1} ${x - s * 0.65} ${y - s * 0.85} ${x} ${y - s * 0.2} C${x + s * 0.65} ${y - s * 0.85} ${x + s * 1.25} ${y + s * 0.1} ${x} ${y + s * 0.9} Z`;
  return <Path d={d} fill={fill} />;
}

function Leaf({ x, y, rot, fill, rib = C.w }: { x: number; y: number; rot: number; fill: string; rib?: string }): React.JSX.Element {
  return (
    <G transform={`translate(${x} ${y}) rotate(${rot})`}>
      <Path d="M0 0 C8 -11 24 -11 30 0 C24 11 8 11 0 0 Z" fill={fill} />
      <Path d="M3 0 L26 0" stroke={rib} strokeWidth={1.6} strokeLinecap="round" opacity={0.7} />
    </G>
  );
}

function Stone({ cx, cy, rx, ry, top, side }: { cx: number; cy: number; rx: number; ry: number; top: string; side: string }): React.JSX.Element {
  return (
    <>
      <Ellipse cx={cx} cy={cy + 4} rx={rx} ry={ry} fill={side} />
      <Ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={top} />
    </>
  );
}

function Rays({ cx, cy, r1, r2, color, n = 8 }: { cx: number; cy: number; r1: number; r2: number; color: string; n?: number }): React.JSX.Element {
  return (
    <>
      {Array.from({ length: n }, (_, i) => {
        const a = (i * 2 * Math.PI) / n;
        const c = Math.cos(a);
        const s = Math.sin(a);
        return <Line key={i} x1={cx + c * r1} y1={cy + s * r1} x2={cx + c * r2} y2={cy + s * r2} stroke={color} strokeWidth={3} strokeLinecap="round" />;
      })}
    </>
  );
}

function Scene({ children }: { children: React.ReactNode }): React.JSX.Element {
  return (
    <Svg width="100%" height="100%" viewBox="0 0 160 120">
      {children}
    </Svg>
  );
}

const ILLUSTRATIONS: Record<ExerciseType, () => React.JSX.Element> = {
  thought_catcher: () => (
    <Scene>
      <Shadow cx={64} rx={38} />
      <Line x1={34} y1={104} x2={74} y2={64} stroke={C.wood2} strokeWidth={8} strokeLinecap="round" />
      <Line x1={34} y1={102} x2={73} y2={63} stroke={C.wood} strokeWidth={5} strokeLinecap="round" />
      <Path d="M74 62 C70 82 84 100 101 100 C117 100 126 84 124 60 Z" fill={C.w} opacity={0.9} />
      <Path
        d="M86 64 C86 78 92 92 101 98 M101 62 C101 76 104 88 109 97 M114 61 C116 72 118 82 119 90 M77 74 C92 79 108 79 124 72 M82 87 C95 91 107 91 119 86"
        fill="none" stroke={C.s1} strokeWidth={2} strokeLinecap="round"
      />
      <Ellipse cx={99} cy={60} rx={26} ry={8} fill="none" stroke={C.s3} strokeWidth={5} />
      <Cloud x={78} y={12} s={0.7} fill={C.w} shade={C.s1} />
      <Face x={99} y={25} s={0.75} />
      <Circle cx={127} cy={31} r={4} fill={C.w} />
      <Circle cx={135} cy={23} r={2.6} fill={C.w} />
    </Scene>
  ),

  thought_reframing: () => (
    <Scene>
      <Shadow cx={82} rx={40} />
      <G transform="rotate(-13 80 60)">
        <Rect x={47} y={31} width={66} height={56} rx={9} fill="none" stroke={C.s2} strokeWidth={4} strokeDasharray="7 6" strokeLinecap="round" />
      </G>
      <Rect x={50} y={34} width={64} height={56} rx={9} fill={C.sun2} />
      <Rect x={50} y={30} width={64} height={56} rx={9} fill={C.sun} />
      <Rect x={58} y={38} width={48} height={40} rx={5} fill={C.cream} />
      <Circle cx={91} cy={53} r={8} fill={C.sun} />
      <Path d="M58 78 L58 70 C66 62 76 64 84 70 C90 66 100 64 106 68 L106 78 Z" fill={C.s2} />
      <Path d="M58 78 L58 74 C70 70 82 72 94 76 C99 74 103 73 106 74 L106 78 Z" fill={C.s3} />
      <Spark x={126} y={28} r={7} fill={C.sun} />
      <Spark x={38} y={40} r={4} fill={C.w} />
    </Scene>
  ),

  gratitude_reframe: () => (
    <Scene>
      <Shadow cx={80} rx={30} />
      <Path d="M58 48 C53 56 53 94 61 101 C69 106 91 106 99 101 C107 94 107 56 102 48 Z" fill={C.w} opacity={0.75} />
      <Path d="M56 86 C57 95 59 99 61 101 C69 106 91 106 99 101 C101 99 103 95 104 86 C95 92 65 92 56 86 Z" fill={C.s1} opacity={0.8} />
      <Heart x={70} y={82} s={8} fill={C.cor} />
      <G transform="rotate(14 90 74)">
        <Rect x={82} y={66} width={16} height={14} rx={2.5} fill={C.sun} />
        <Line x1={85} y1={71} x2={95} y2={71} stroke={C.w} strokeWidth={1.8} strokeLinecap="round" />
        <Line x1={85} y1={75} x2={92} y2={75} stroke={C.w} strokeWidth={1.8} strokeLinecap="round" />
      </G>
      <Leaf x={68} y={64} rot={-28} fill={C.s2} />
      <Heart x={91} y={93} s={5} fill={C.cor2} />
      <Path d="M58 48 C53 56 53 94 61 101 C69 106 91 106 99 101 C107 94 107 56 102 48" fill="none" stroke={C.s2} strokeWidth={3} strokeLinecap="round" />
      <Path d="M65 58 C63 68 63 80 65 88" fill="none" stroke={C.w} strokeWidth={3.5} strokeLinecap="round" />
      <Rect x={59} y={36} width={42} height={13} rx={5} fill={C.wood} />
      <Rect x={59} y={44} width={42} height={5} rx={2} fill={C.wood2} />
      <Spark x={116} y={40} r={6} fill={C.sun} />
      <Circle cx={44} cy={58} r={2.6} fill={C.sun} />
    </Scene>
  ),

  abc_analysis: () => (
    <Scene>
      <Path d="M8 86 C36 78 58 92 82 86 C106 80 128 92 152 86 L152 104 C128 110 106 98 82 104 C58 110 36 98 8 104 Z" fill={C.sky} opacity={0.55} />
      <Path d="M24 95 L36 95 M96 99 L110 99 M126 93 L136 93" stroke={C.w} strokeWidth={2.5} strokeLinecap="round" opacity={0.8} />
      <Stone cx={42} cy={82} rx={17} ry={7} top={C.s2} side={C.s3} />
      <Stone cx={80} cy={70} rx={21} ry={9} top={C.sun} side={C.sun2} />
      <Stone cx={118} cy={82} rx={17} ry={7} top={C.s2} side={C.s3} />
      <Path d="M52 72 Q60 56 68 62 M92 62 Q100 56 108 72" fill="none" stroke={C.s3} strokeWidth={2.5} strokeDasharray="1 6" strokeLinecap="round" />
      <Text x={42} y={86} textAnchor="middle" fontFamily="Nunito" fontWeight="800" fontSize={13} fill={C.w}>A</Text>
      <Text x={80} y={75} textAnchor="middle" fontFamily="Nunito" fontWeight="800" fontSize={15} fill={C.ink}>B</Text>
      <Text x={118} y={86} textAnchor="middle" fontFamily="Nunito" fontWeight="800" fontSize={13} fill={C.w}>C</Text>
      <Spark x={80} y={40} r={7} fill={C.sun} />
    </Scene>
  ),

  box_breathing: () => (
    <Scene>
      <Shadow cx={80} rx={34} cy={98} />
      <Rect x={50} y={20} width={60} height={60} rx={14} fill={C.w} opacity={0.7} />
      <Rect x={50} y={20} width={60} height={60} rx={14} fill="none" stroke={C.sky} strokeWidth={6} />
      <Path d="M64 20 L96 20 C104 20 110 26 110 34 L110 50" fill="none" stroke={C.sky2} strokeWidth={6} strokeLinecap="round" />
      <Circle cx={80} cy={50} r={13} fill={C.sky} opacity={0.45} />
      <Circle cx={80} cy={50} r={6} fill={C.sky2} opacity={0.7} />
      <Circle cx={110} cy={50} r={7} fill={C.w} stroke={C.sky2} strokeWidth={3} />
    </Scene>
  ),

  breathing_478: () => (
    <Scene>
      <Shadow cx={92} rx={42} />
      <Path d="M56 22 A22 22 0 1 0 78 56 A18 18 0 1 1 56 22 Z" fill={C.sun} />
      <Path d="M47 45 Q50 48 53 45 M59 47 Q62 50 65 47" fill="none" stroke={C.ink} strokeWidth={2} strokeLinecap="round" />
      <Circle cx={47} cy={51} r={2.6} fill={C.cor} opacity={0.55} />
      <Rect x={90} y={78} width={12} height={24} rx={6} fill={C.sky} />
      <Rect x={108} y={60} width={12} height={42} rx={6} fill={C.sky} />
      <Rect x={108} y={60} width={12} height={20} rx={6} fill={C.sky2} />
      <Rect x={126} y={54} width={12} height={48} rx={6} fill={C.sky} />
      <Spark x={104} y={28} r={5} fill={C.w} />
      <Circle cx={130} cy={34} r={2.4} fill={C.w} />
      <Circle cx={30} cy={70} r={2} fill={C.w} />
    </Scene>
  ),

  grounding_54321: () => (
    <Scene>
      <Shadow cx={80} rx={36} cy={104} />
      <Stone cx={80} cy={92} rx={30} ry={9} top={C.wood} side={C.wood2} />
      <Stone cx={78} cy={78} rx={24} ry={8} top={C.s2} side={C.s3} />
      <Stone cx={82} cy={65} rx={18} ry={7} top={C.sky} side={C.sky2} />
      <Stone cx={79} cy={54} rx={13} ry={6} top={C.cor} side={C.cor2} />
      <Stone cx={81} cy={45} rx={8} ry={5} top={C.sun} side={C.sun2} />
      <Path
        d="M42 104 Q44 95 47 104 M50 104 Q51 98 53 104 M110 104 Q113 94 116 104 M118 104 Q119 99 121 104"
        fill="none" stroke={C.s3} strokeWidth={2.5} strokeLinecap="round"
      />
      <Spark x={110} y={34} r={5} fill={C.sun} />
    </Scene>
  ),

  body_scan_pmr: () => (
    <Scene>
      <Shadow cx={80} rx={30} />
      <Path d="M64 94 C62 77 66 62 80 60 C94 62 98 77 96 94 Z" fill={C.lav} />
      <Path d="M48 98 C48 89 62 86 80 91 C98 86 112 89 112 98 C112 104 48 104 48 98 Z" fill={C.lav2} />
      <Circle cx={80} cy={40} r={15} fill={C.lav} />
      <Path d="M72 40 Q75 43 78 40 M82 40 Q85 43 88 40" fill="none" stroke={C.ink} strokeWidth={2} strokeLinecap="round" />
      <Path d="M77 47 Q80 49.5 83 47" fill="none" stroke={C.ink} strokeWidth={2} strokeLinecap="round" />
      <Rect x={40} y={66} width={80} height={12} rx={6} fill={C.sky} opacity={0.55} />
      <Line x1={40} y1={72} x2={120} y2={72} stroke={C.sky2} strokeWidth={2.5} strokeLinecap="round" />
      <Path d="M48 54 Q44 50 48 46 M112 54 Q116 50 112 46" fill="none" stroke={C.sky2} strokeWidth={2.5} strokeLinecap="round" />
    </Scene>
  ),

  mindful_breathing_1min: () => (
    <Scene>
      <Shadow cx={80} rx={32} />
      <Rect x={74} y={20} width={12} height={9} rx={3} fill={C.s3} />
      <Circle cx={80} cy={63} r={33} fill={C.s3} />
      <Circle cx={80} cy={60} r={33} fill={C.w} />
      <Path d="M80 60 L80 34 A26 26 0 0 1 106 60 Z" fill={C.sky} />
      <Line x1={80} y1={60} x2={104} y2={60} stroke={C.ink} strokeWidth={3} strokeLinecap="round" />
      <Circle cx={80} cy={60} r={3.5} fill={C.ink} />
      <Path d="M26 70 C32 60 40 74 46 64 M114 64 C120 74 128 60 134 70" fill="none" stroke={C.sky2} strokeWidth={3} strokeLinecap="round" />
    </Scene>
  ),

  decatastrophizing: () => (
    <Scene>
      <Path d="M136 58 L98 104 L128 104 Z" fill={C.sun} opacity={0.22} />
      <Path
        d="M24 104 C20 80 24 52 38 38 L36 22 L47 32 C53 28 61 28 67 32 L78 22 L76 38 C90 52 94 80 90 104 Z"
        fill={C.lav2} opacity={0.45}
      />
      <Ellipse cx={50} cy={54} rx={3} ry={4} fill={C.w} opacity={0.8} />
      <Ellipse cx={65} cy={54} rx={3} ry={4} fill={C.w} opacity={0.8} />
      <Shadow cx={108} rx={16} />
      <Path d="M94 104 C92 92 98 82 108 82 C118 82 124 92 122 104 Z" fill={C.cor} />
      <Path d="M94 104 C94 100 95 97 96 95 C102 99 114 99 120 95 C121 97 122 100 122 104 Z" fill={C.cor2} opacity={0.5} />
      <Face x={108} y={93} s={0.7} />
      <Line x1={140} y1={66} x2={140} y2={104} stroke={C.wood2} strokeWidth={3} strokeLinecap="round" />
      <Circle cx={138} cy={58} r={8} fill={C.sun} />
    </Scene>
  ),

  worry_decision_tree: () => (
    <Scene>
      <Path d="M80 108 C80 92 66 84 34 80" fill="none" stroke={C.sand} strokeWidth={12} strokeLinecap="round" />
      <Path d="M80 108 C80 92 94 84 126 80" fill="none" stroke={C.sand} strokeWidth={12} strokeLinecap="round" />
      <Rect x={77} y={32} width={6} height={72} rx={3} fill={C.wood2} />
      <Path d="M50 36 L76 36 L76 51 L50 51 L42 43.5 Z" fill={C.s3} />
      <Path d="M53 43.5 L57.5 48 L65 39.5" fill="none" stroke={C.w} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M84 56 L110 56 L118 63.5 L110 71 L84 71 Z" fill={C.cor} />
      <Path d="M90 64 C94 59 100 68 106 62" fill="none" stroke={C.w} strokeWidth={3} strokeLinecap="round" />
      <Circle cx={80} cy={31} r={4.5} fill={C.wood2} />
      <Path d="M30 96 Q32 88 35 96 M128 96 Q131 87 134 96" fill="none" stroke={C.s3} strokeWidth={2.5} strokeLinecap="round" />
    </Scene>
  ),

  // one small thing: a sprout just up in its pot, the sun already on it
  behavioral_activation: () => (
    <Scene>
      <Shadow cx={80} rx={30} />
      <Rays cx={126} cy={30} r1={15} r2={20} color={C.sun} />
      <Circle cx={126} cy={30} r={10} fill={C.sun} />
      <Path d="M80 72 C80 62 78 54 80 42" fill="none" stroke={C.s3} strokeWidth={4} strokeLinecap="round" />
      <Path d="M79 58 C66 60 60 52 61 43 C70 43 78 49 79 58 Z" fill={C.s2} />
      <Path d="M81 49 C93 50 100 42 98 32 C88 32 81 40 81 49 Z" fill={C.s3} />
      <Path d="M61 78 L99 78 L94 104 L66 104 Z" fill={C.cor} />
      <Path d="M63 93 L97 93 L94 104 L66 104 Z" fill={C.cor2} opacity={0.45} />
      <Rect x={56} y={70} width={48} height={11} rx={4} fill={C.cor2} />
      <Face x={80} y={88} s={0.8} />
    </Scene>
  ),

  // a ladder toward the sun, two rungs climbed, standing on the easiest one
  fear_ladder: () => (
    <Scene>
      <Shadow cx={80} rx={30} />
      <Rays cx={136} cy={26} r1={12} r2={16} color={C.sun} />
      <Circle cx={136} cy={26} r={8.5} fill={C.sun} />
      <Line x1={60} y1={106} x2={76} y2={18} stroke={C.wood} strokeWidth={5} strokeLinecap="round" />
      <Line x1={96} y1={106} x2={112} y2={18} stroke={C.wood} strokeWidth={5} strokeLinecap="round" />
      <Line x1={62.5} y1={92} x2={98.5} y2={92} stroke={C.s3} strokeWidth={4.5} strokeLinecap="round" />
      <Line x1={65.5} y1={76} x2={101.5} y2={76} stroke={C.s3} strokeWidth={4.5} strokeLinecap="round" />
      <Line x1={68.4} y1={60} x2={104.4} y2={60} stroke={C.wood2} strokeWidth={4.5} strokeLinecap="round" />
      <Line x1={71.3} y1={44} x2={107.3} y2={44} stroke={C.wood2} strokeWidth={4.5} strokeLinecap="round" />
      <Line x1={74.2} y1={28} x2={110.2} y2={28} stroke={C.wood2} strokeWidth={4.5} strokeLinecap="round" />
      <Path d="M73 76 C72 66 77 60 84 60 C91 60 96 66 95 76 Z" fill={C.cor} />
      <Face x={84} y={68} s={0.6} />
    </Scene>
  ),

  detached_mindfulness: () => (
    <Scene>
      <Path
        d="M6 70 C40 60 70 82 100 72 C122 65 140 70 154 66 L154 94 C132 100 112 88 90 96 C60 106 38 86 6 96 Z"
        fill={C.sky} opacity={0.6}
      />
      <Path d="M22 86 L36 86 M106 82 L122 82 M60 96 L72 96" stroke={C.w} strokeWidth={2.5} strokeLinecap="round" opacity={0.85} />
      <Leaf x={24} y={76} rot={-12} fill={C.s2} />
      <Leaf x={64} y={84} rot={10} fill={C.s3} />
      <Leaf x={106} y={72} rot={-6} fill={C.sun} rib={C.cream} />
      <Circle cx={74} cy={66} r={2.6} fill={C.w} />
      <Circle cx={80} cy={60} r={3.6} fill={C.w} />
      <Cloud x={78} y={30} s={0.45} fill={C.w} />
      <Spark x={40} y={40} r={5} fill={C.sun} />
    </Scene>
  ),

  attention_training: () => (
    <Scene>
      <Circle cx={104} cy={56} r={26} fill={C.sun} opacity={0.2} />
      <Circle cx={104} cy={56} r={17} fill={C.sun} opacity={0.3} />
      <Path d="M126 40 Q132 48 126 56 M132 34 Q142 48 132 62" fill="none" stroke={C.sun2} strokeWidth={2.5} strokeLinecap="round" />
      {([[44, 64, C.s2], [70, 38, C.lav2], [100, 52, C.s3]] as const).map(([x, y, color]) => (
        <G key={x}>
          <Circle cx={x} cy={y + 14} r={7} fill={color} />
          <Line x1={x + 5.5} y1={y + 14} x2={x + 5.5} y2={y - 6} stroke={color} strokeWidth={3} strokeLinecap="round" />
          <Path d={`M${x + 5.5} ${y - 6} Q${x + 14} ${y - 2} ${x + 13} ${y + 6}`} fill="none" stroke={color} strokeWidth={3} strokeLinecap="round" />
        </G>
      ))}
      <Shadow cx={80} rx={36} cy={102} />
    </Scene>
  ),
};

export interface ExerciseArtProps {
  type: ExerciseType;
}

/** One 160x120 flat-illustration scene per exercise, matching .agents/exercise-art.js's ART set. */
export function ExerciseArt({ type }: ExerciseArtProps): React.JSX.Element {
  const Illustration = ILLUSTRATIONS[type];
  return Illustration();
}

export type ReplyGlyphKind = 'loop' | 'sting' | 'empty' | 'avoid' | 'unsure';

function GlyphScene({ children }: { children: React.ReactNode }): React.JSX.Element {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      {children}
    </Svg>
  );
}

const GLYPHS: Record<ReplyGlyphKind, () => React.JSX.Element> = {
  loop: () => (
    <GlyphScene>
      <Path d="M20 12a8 8 0 1 1-2.34-5.66" />
      <Path d="M20 4v4h-4" />
    </GlyphScene>
  ),
  sting: () => (
    <GlyphScene>
      <Path d="M13 3 5 14h6l-1 7 8-11h-6Z" />
    </GlyphScene>
  ),
  empty: () => (
    <GlyphScene>
      <Rect x={2.5} y={7.5} width={17} height={9} rx={2} />
      <Path d="M22 11v2" />
      <Path d="M6 11v2" />
    </GlyphScene>
  ),
  avoid: () => (
    <GlyphScene>
      <Path d="M5 21V4h10v17" />
      <Path d="M2 21h20" />
      <Path d="M11 12h.01" />
      <Path d="M15 4l4 2v15" />
    </GlyphScene>
  ),
  unsure: () => (
    <GlyphScene>
      <Circle cx={12} cy={12} r={9} fill="none" />
      <Path d="m15.5 8.5-2 5-5 2 2-5Z" />
    </GlyphScene>
  ),
};

export interface ReplyGlyphProps {
  kind: ReplyGlyphKind;
}

/** 24px line icon for one Lessons reply tile, matching .agents/exercise-art.js's GLYPH set. */
export function ReplyGlyph({ kind }: ReplyGlyphProps): React.JSX.Element {
  const Glyph = GLYPHS[kind];
  return Glyph();
}

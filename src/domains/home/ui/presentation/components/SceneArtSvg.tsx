// ponytail: direct port of .agents/home.html's procedural illustrated scene (sky/sun-moon/clouds/ridge/
// trees/ground/house/flowers/stars-fireflies) into react-native-svg. Geometry and palette are copied
// verbatim from home.html's inline <script> (the P palette, blob()/tree()/cloud()/ridge()/farTrees/tuft()/
// flower()/stars/flies generators). Drift/sway/twinkle/fly loops use Reanimated withRepeat instead of CSS
// @keyframes — same durations/phases, honors useReducedMotion by never starting the loop.
// feTurbulence grain filter has no RN/SVG equivalent — dropped (documented fidelity loss, see plan).
import React, { useEffect } from 'react';
import Svg, {
  Defs, LinearGradient, RadialGradient, Mask, Stop, Rect, Circle, Path, Ellipse, G,
} from 'react-native-svg';
import Animated, {
  useSharedValue, useAnimatedProps, withRepeat, withTiming, Easing,
} from 'react-native-reanimated';
import { useReducedMotion } from '@/src/hooks/useReducedMotion';
import { seeded } from '@/src/components/ui/motion/engine';

const AnimatedG = Animated.createAnimatedComponent(G);
const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export interface ScenePalette {
  sky: readonly [string, string, string];
  sun: string; cloud: string; cloudSh: string; far: string; far2: string;
  mid: string; midSh: string; midHi: string;
  tr: string; trSh: string; trHi: string; trunk: string;
  front: string; frontSh: string; frontHi: string;
  path: string; pathSh: string; bush: string; bushSh: string; dim: number;
}

const NIGHT_PALETTE: ScenePalette = {
  sky: ['#1b2445', '#2d3866', '#58588a'], sun: '#f3ecd0', cloud: '#7d85ad', cloudSh: '#646c96',
  far: '#3a4769', far2: '#31405e', mid: '#2e4a4e', midSh: '#263f43', midHi: '#3e5d5c',
  tr: '#28433f', trSh: '#1e3532', trHi: '#37574f', trunk: '#3a3440',
  front: '#33533f', frontSh: '#2a463a', frontHi: '#43664f',
  path: '#565b6c', pathSh: '#484d5e', bush: '#24403a', bushSh: '#1c332f', dim: 0.45,
};

const DAY_PALETTE: ScenePalette = {
  sky: ['#bfe1e8', '#e4f2ec', '#fdf1d6'], sun: '#ffd77a', cloud: '#fff', cloudSh: '#dfecef',
  far: '#c7ddcd', far2: '#afcdb4', mid: '#a2c98d', midSh: '#8db97a', midHi: '#c4e2ac',
  tr: '#73a967', trSh: '#5c9257', trHi: '#93c67f', trunk: '#8b6a4e',
  front: '#90c377', frontSh: '#7aad64', frontHi: '#b2d995',
  path: '#f0e3c2', pathSh: '#dfcda1', bush: '#64a05c', bushSh: '#4f874b', dim: 1,
};

// blob(): dark base shifted down-left, lighter body shifted up-right, optional highlight — reads as sun-lit
function Blob({ pts, base, body, hi }: {
  pts: ReadonlyArray<readonly [number, number, number]>;
  base: string; body: string; hi?: string;
}): React.JSX.Element {
  return (
    <>
      {pts.map(([x, y, r], i) => (
        <Circle key={`b${i}`} cx={x - r * 0.12} cy={y + r * 0.12} r={r} fill={base} />
      ))}
      {pts.map(([x, y, r], i) => (
        <Circle key={`c${i}`} cx={x + r * 0.04} cy={y - r * 0.06} r={r * 0.9} fill={body} />
      ))}
      {hi && (
        <Circle
          cx={pts[0][0] + pts[0][2] * 0.35}
          cy={pts[0][1] - pts[0][2] * 0.45}
          r={pts[0][2] * 0.28}
          fill={hi}
          opacity={0.8}
        />
      )}
    </>
  );
}

function Tree({ x, y, s, t = 14, palette, blossom }: {
  x: number; y: number; s: number; t?: number; palette: ScenePalette; blossom?: boolean;
}): React.JSX.Element {
  const cy = y - t * s - 10 * s;
  const sway = useSharedValue(0);
  const reducedMotion = useReducedMotion();
  const period = t > 20 ? 7000 : 4200;
  const amp = t > 20 ? 0.8 : 3;
  useEffect(() => {
    if (reducedMotion) return;
    sway.value = withRepeat(withTiming(1, { duration: period, easing: Easing.inOut(Easing.ease) }), -1, true);
  }, [reducedMotion, sway, period]);
  const animatedProps = useAnimatedProps(() => ({
    rotation: (sway.value * 2 - 1) * amp,
    originX: x,
    originY: y,
  }));
  return (
    <>
      <Rect x={x - 2.6 * s} y={y - t * s - 4 * s} width={5.2 * s} height={(t + 4) * s} rx={2 * s} fill={palette.trunk} />
      <AnimatedG animatedProps={animatedProps}>
        <Blob
          pts={[[x + 2 * s, cy - 8 * s, 14 * s], [x - 11 * s, cy + 2 * s, 11 * s], [x + 11 * s, cy + 2 * s, 11 * s]]}
          base={palette.trSh}
          body={palette.tr}
          hi={palette.trHi}
        />
        {blossom && [[2, -26], [-8, -6], [24, -18], [40, 2], [12, 8]].map(([dx, dy], i) => (
          <Circle key={i} cx={x + dx * 1.6} cy={234 + dy * 1.6} r={3.2} fill="#f7cfc6" />
        ))}
      </AnimatedG>
    </>
  );
}

function Cloud({ x, y, s, o, palette }: { x: number; y: number; s: number; o: number; palette: ScenePalette }): React.JSX.Element {
  const d = 'M0 0q-14 0-13-11q1-10 13-10q4-15 20-12q12 2 13 15q14-1 15 9q0 9-12 9z';
  return (
    <G transform={`translate(${x} ${y}) scale(${s})`} opacity={o}>
      <Path d={d} fill={palette.cloudSh} transform="translate(0 3)" />
      <Path d={d} fill={palette.cloud} />
    </G>
  );
}

function ridgeY(x: number): number {
  return 234 + 8 * Math.sin(x / 46) + 4 * Math.sin(x / 17 + 1);
}

const RIDGE_D = `M0 ${ridgeY(0)}${Array.from({ length: 40 }, (_, i) => ` L${(i + 1) * 10} ${ridgeY((i + 1) * 10).toFixed(1)}`).join('')} V400 H0Z`;

const FAR_TREES = Array.from({ length: 26 }, (_, i) => {
  const x = i * 16 + seeded(i) * 8 - 4;
  const r = 8 + seeded(i + 9) * 5;
  return { x, y: ridgeY(x) - r * 0.55, r };
});

const TUFTS: ReadonlyArray<readonly [number, number]> = [
  [104, 334], [130, 352], [236, 348], [292, 330], [314, 360], [40, 372], [262, 378], [208, 386],
];

const FLOWERS: ReadonlyArray<readonly [number, number, string]> = [
  [110, 346, '#fff'], [114, 360, '#f6c453'], [272, 342, '#f2a7a0'],
  [300, 352, '#fff'], [218, 364, '#f6c453'], [56, 380, '#f2a7a0'],
];

const LEAVES: ReadonlyArray<readonly [number, number]> = [[350, 318], [372, 330], [340, 332], [382, 316]];

function Tuft({ x, y, color }: { x: number; y: number; color: string }): React.JSX.Element {
  return (
    <Path
      d={`M${x} ${y}q-2-6-6-9M${x} ${y}q0-7 1-12M${x} ${y}q3-5 7-7`}
      fill="none"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
    />
  );
}

function Flower({ x, y, color }: { x: number; y: number; color: string }): React.JSX.Element {
  return (
    <>
      {[0, 72, 144, 216, 288].map((a) => (
        <Circle
          key={a}
          cx={x + 2.6 * Math.cos((a * Math.PI) / 180)}
          cy={y + 2.6 * Math.sin((a * Math.PI) / 180)}
          r={2.3}
          fill={color}
        />
      ))}
      <Circle cx={x} cy={y} r={1.5} fill="#f2b33d" />
    </>
  );
}

function Birds(): React.JSX.Element {
  const t = useSharedValue(0);
  const flap = useSharedValue(0);
  const reducedMotion = useReducedMotion();
  useEffect(() => {
    if (reducedMotion) return;
    t.value = withRepeat(withTiming(1, { duration: 40000, easing: Easing.linear }), -1, false);
    flap.value = withRepeat(withTiming(1, { duration: 500, easing: Easing.inOut(Easing.ease) }), -1, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reducedMotion]);
  const groupProps = useAnimatedProps(() => ({
    translateX: -60 + t.value * 500,
    translateY: 132 + t.value * -30,
  }));
  const wingProps = useAnimatedProps(() => ({ scaleY: 1 - flap.value * 0.65 }));
  return (
    <AnimatedG animatedProps={groupProps}>
      {[[0, 0, 1], [16, 7, 0.8]].map(([x, y, s], i) => (
        <AnimatedG key={i} transform={`translate(${x} ${y}) scale(${s})`} animatedProps={wingProps}>
          <Path d="M0 0q4-4 8 0q4-4 8 0" fill="none" stroke="#5f716d" strokeWidth={1.6} strokeLinecap="round" />
        </AnimatedG>
      ))}
    </AnimatedG>
  );
}

function SwayPlant({ color, highlight }: { color: string; highlight: string }): React.JSX.Element {
  const w = useSharedValue(0);
  const reducedMotion = useReducedMotion();
  useEffect(() => {
    if (reducedMotion) return;
    w.value = withRepeat(withTiming(1, { duration: 4200, easing: Easing.inOut(Easing.ease) }), -1, true);
  }, [reducedMotion, w]);
  const animatedProps = useAnimatedProps(() => ({
    rotation: (w.value * 2 - 1) * 4,
    originX: 88,
    originY: 344,
  }));
  return (
    <AnimatedG animatedProps={animatedProps}>
      <Path d="M88 344Q84 324 91 310" fill="none" stroke={color} strokeWidth={2.6} strokeLinecap="round" />
      <Path
        d="M89 328Q74 326 75 314Q88 314 89 328M90 319Q104 313 103 302Q91 304 90 319"
        fill={highlight}
      />
    </AnimatedG>
  );
}

function DriftLayer({ children, duration, delayMs = 0 }: { children: React.ReactNode; duration: number; delayMs?: number }): React.JSX.Element {
  const t = useSharedValue(0);
  const reducedMotion = useReducedMotion();
  useEffect(() => {
    if (reducedMotion) return;
    const id = setTimeout(() => {
      t.value = withRepeat(withTiming(1, { duration, easing: Easing.linear }), -1, false);
    }, 0);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reducedMotion]);
  const animatedProps = useAnimatedProps(() => ({
    translateX: -140 + t.value * 620 - (delayMs / duration) * 620,
  }));
  return <AnimatedG animatedProps={animatedProps}>{children}</AnimatedG>;
}

function Twinkle({ x, y, r, delay }: { x: number; y: number; r: number; delay: number }): React.JSX.Element {
  const o = useSharedValue(1);
  const reducedMotion = useReducedMotion();
  useEffect(() => {
    if (reducedMotion) return;
    const id = setTimeout(() => {
      o.value = withRepeat(withTiming(0.25, { duration: 3000, easing: Easing.inOut(Easing.ease) }), -1, true);
    }, delay);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reducedMotion]);
  const animatedProps = useAnimatedProps(() => ({ opacity: o.value }));
  if (r > 1.6) {
    const d = `M${x} ${y - 4}L${x + 1} ${y - 1}L${x + 4} ${y}L${x + 1} ${y + 1}L${x} ${y + 4}L${x - 1} ${y + 1}L${x - 4} ${y}L${x - 1} ${y - 1}Z`;
    return <AnimatedPath d={d} fill="#fff" animatedProps={animatedProps} />;
  }
  return <AnimatedCircle cx={x} cy={y} r={r} fill="#fff" animatedProps={animatedProps} />;
}

function Firefly({ x, y, delay }: { x: number; y: number; delay: number }): React.JSX.Element {
  const p = useSharedValue(0);
  const reducedMotion = useReducedMotion();
  useEffect(() => {
    if (reducedMotion) return;
    const id = setTimeout(() => {
      p.value = withRepeat(withTiming(1, { duration: 6000, easing: Easing.inOut(Easing.ease) }), -1, true);
    }, delay);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reducedMotion]);
  const animatedProps = useAnimatedProps(() => ({
    translateX: p.value < 0.5 ? p.value * 12 : 6 - (p.value - 0.5) * 20,
    translateY: -8 * p.value,
    opacity: p.value < 0.5 ? 0.35 + p.value : 1 - (p.value - 0.5),
  }));
  return (
    <AnimatedG animatedProps={animatedProps}>
      <Circle cx={x} cy={y} r={5} fill="#ffcf5a" opacity={0.6} />
      <Circle cx={x} cy={y} r={1.6} fill="#fff3b8" />
    </AnimatedG>
  );
}

export interface SceneArtSvgProps {
  night: boolean;
}

export function SceneArtSvg({ night }: SceneArtSvgProps): React.JSX.Element {
  const palette = night ? NIGHT_PALETTE : DAY_PALETTE;

  const stars = night
    ? Array.from({ length: 16 }, (_, i) => ({
        x: seeded(i) * 390,
        y: 14 + seeded(i + 30) * 170,
        r: 0.7 + seeded(i + 60) * 1.2,
        delay: i * 700,
      }))
    : [];
  const flies = night
    ? Array.from({ length: 8 }, (_, i) => ({
        x: 30 + seeded(i + 3) * 330,
        y: 250 + seeded(i + 7) * 95,
        delay: i * 800,
      }))
    : [];

  return (
    <Svg width="100%" height="100%" viewBox="0 0 390 400" preserveAspectRatio="xMidYMax slice">
      <Defs>
        <LinearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={palette.sky[0]} />
          <Stop offset="0.55" stopColor={palette.sky[1]} />
          <Stop offset="0.72" stopColor={palette.sky[2]} />
        </LinearGradient>
        <RadialGradient id="pool" cx="50%" cy="50%" r="50%">
          <Stop offset="0" stopColor="#ffd98a" stopOpacity={0.55} />
          <Stop offset="1" stopColor="#ffd98a" stopOpacity={0} />
        </RadialGradient>
        <Mask id="moon">
          <Rect width={390} height={400} fill="#fff" />
          <Circle cx={218} cy={56} r={18} fill="#000" />
        </Mask>
      </Defs>

      <Rect width={390} height={400} fill="url(#sky)" />

      {night ? (
        <>
          <Circle cx={206} cy={64} r={40} fill={palette.sun} opacity={0.22} />
          <Circle cx={206} cy={64} r={22} fill={palette.sun} mask="url(#moon)" />
        </>
      ) : (
        <>
          <Circle cx={304} cy={206} r={52} fill={palette.sun} opacity={0.18} />
          <Circle cx={304} cy={206} r={36} fill={palette.sun} opacity={0.32} />
          <Circle cx={304} cy={206} r={24} fill={palette.sun} />
          <Circle cx={311} cy={199} r={7} fill="#fff" opacity={0.35} />
        </>
      )}

      {stars.map((s, i) => <Twinkle key={i} x={s.x} y={s.y} r={s.r} delay={s.delay} />)}

      <DriftLayer duration={150000} delayMs={70000}>
        <Cloud x={40} y={70} s={0.7} o={night ? 0.14 : 0.75} palette={palette} />
      </DriftLayer>
      <DriftLayer duration={90000}>
        <Cloud x={40} y={150} s={1.25} o={night ? 0.16 : 1} palette={palette} />
      </DriftLayer>
      <DriftLayer duration={60000} delayMs={20000}>
        <Cloud x={40} y={112} s={0.9} o={night ? 0.12 : 0.9} palette={palette} />
      </DriftLayer>

      {!night && <Birds />}

      <Path d="M0 214Q60 196 120 210T250 200T390 206V400H0Z" fill={palette.far} />
      <Path d={RIDGE_D} fill={palette.far2} />
      {FAR_TREES.map((ft, i) => <Circle key={i} cx={ft.x} cy={ft.y} r={ft.r} fill={palette.far2} />)}

      <Path d="M0 288Q80 262 170 276T390 262V400H0Z" fill={palette.mid} />
      <Path d="M0 288Q80 262 170 276T390 262" fill="none" stroke={palette.midHi} strokeWidth={2.5} />

      {/* house, small window glow at night */}
      <G transform="translate(316 270)">
        <Rect x={-10} y={-13} width={20} height={14} rx={1.5} fill={night ? '#5a5f7c' : '#f4ecd8'} />
        <Path d="M-13-12L0-23L13-12Z" fill={night ? '#3a3248' : '#c97b5a'} strokeLinejoin="round" />
        {night && <Circle cx={3} cy={-6} r={10} fill="#ffb84a" opacity={0.7} />}
        <Rect x={-1} y={-10} width={8} height={6} rx={1} fill={night ? '#ffd772' : '#9cc3cf'} />
      </G>

      <Tree x={262} y={276} s={0.9} palette={palette} />
      <Tree x={286} y={272} s={1.15} t={16} palette={palette} />
      <Tree x={352} y={268} s={1} palette={palette} />
      <Tree x={22} y={342} s={3.2} t={24} palette={palette} blossom={!night} />

      <Path d="M0 330Q90 310 190 316T390 308V400H0Z" fill={palette.front} />
      <Path d="M0 330Q90 310 190 316T390 308" fill="none" stroke={palette.frontHi} strokeWidth={3} />
      <Path d="M168 340Q181 334 194 340C214 362 244 380 268 400H96C120 380 150 362 168 340Z" fill={palette.path} />
      <Path d="M168 340C150 362 120 380 96 400M194 340C214 362 244 380 268 400" fill="none" stroke={palette.pathSh} strokeWidth={2} />
      <Ellipse cx={150} cy={368} rx={4} ry={2.4} fill={palette.pathSh} />
      <Ellipse cx={226} cy={372} rx={5} ry={2.8} fill={palette.pathSh} />
      <Ellipse cx={134} cy={388} rx={3.5} ry={2} fill={palette.pathSh} />

      {night && <Ellipse cx={160} cy={344} rx={86} ry={20} fill="url(#pool)" />}

      <Blob pts={[[64, 350, 16], [46, 356, 12], [82, 358, 11]]} base={palette.bushSh} body={palette.bush} />
      <Blob pts={[[360, 326, 30], [334, 338, 24], [392, 338, 26]]} base={palette.bushSh} body={palette.bush} hi={palette.trHi} />

      {!night && LEAVES.map(([x, y], i) => <Circle key={i} cx={x} cy={y} r={2.6} fill="#e2685a" />)}

      <SwayPlant color={palette.frontSh} highlight={palette.trHi} />

      {TUFTS.map(([x, y], i) => <Tuft key={i} x={x} y={y} color={palette.frontSh} />)}
      {FLOWERS.map(([x, y, c], i) => (
        <G key={i} opacity={palette.dim}><Flower x={x} y={y} color={c} /></G>
      ))}

      {flies.map((f, i) => <Firefly key={i} x={f.x} y={f.y} delay={f.delay} />)}
    </Svg>
  );
}

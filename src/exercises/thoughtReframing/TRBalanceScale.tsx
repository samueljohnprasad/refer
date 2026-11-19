// ponytail: the balance from .agents/thought-reframing.html (`scaleBody`) — geometry and colours copied verbatim.
// Pure JSX: the container hands in the beam/pan animated props. Square slate stones back the thought up, round
// pebbles go against it: colour and shape both carry the difference.
import React from 'react';
import Animated from 'react-native-reanimated';
import Svg, { Circle, Ellipse, G, Line, Path, Rect, Text as SvgText } from 'react-native-svg';
import { trStonePlan } from './trBalance';
import { TRDropIn } from './TRDropIn';

const AnimatedG = Animated.createAnimatedComponent(G);

const C = {
  s3: '#5f7f58', s4: '#44633f', sun: '#f5b942', sun2: '#e09a24',
  wood: '#c99363', wood2: '#a5714a', sand: '#ead7b5', ink: '#142414', w: '#ffffff', wash: '#f6ecd8',
} as const;

type AnimatedProps = Record<string, unknown>;

function Stones({ count, kind }: { count: number; kind: 'for' | 'against' }): React.JSX.Element {
  const { slots, overflow } = trStonePlan(count);
  return (
    <>
      {slots.map(({ x, cy }, i) => (
        <TRDropIn key={i}>
          {kind === 'for' ? (
            <>
              <Rect x={x - 9} y={cy - 4} width={18} height={13} rx={4} fill={C.s4} />
              <Rect x={x - 9} y={cy - 7} width={18} height={13} rx={4} fill={C.s3} />
              <Line x1={x - 5} y1={cy - 3} x2={x + 1} y2={cy - 3} stroke={C.w} strokeWidth={2} strokeLinecap="round" opacity={0.45} />
            </>
          ) : (
            <>
              <Ellipse cx={x} cy={cy + 3} rx={10} ry={7.5} fill={C.sun2} />
              <Ellipse cx={x} cy={cy} rx={10} ry={7.5} fill={C.sun} />
              <Path d={`M${x - 5} ${cy - 3} Q${x - 2} ${cy - 5.5} ${x + 1} ${cy - 4.5}`} fill="none" stroke={C.w} strokeWidth={2} strokeLinecap="round" opacity={0.7} />
            </>
          )}
        </TRDropIn>
      ))}
      {overflow > 0 && (
        <SvgText x={0} y={60} textAnchor="middle" fontWeight="800" fontSize={12} fill={C.wood2}>{`+${overflow}`}</SvgText>
      )}
    </>
  );
}

function Pan({ animatedProps, count, kind }: { animatedProps: AnimatedProps; count: number; kind: 'for' | 'against' }): React.JSX.Element {
  return (
    <AnimatedG animatedProps={animatedProps}>
      <Path d="M0 0 L-34 46 M0 0 L34 46" fill="none" stroke={C.s4} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
      <Circle cx={0} cy={0} r={4} fill={C.s4} />
      <Path d="M-40 49 H40 A40 18 0 0 1 -40 49 Z" fill={C.wood2} />
      <Path d="M-40 46 H40 A40 18 0 0 1 -40 46 Z" fill={C.sand} />
      <Stones count={count} kind={kind} />
    </AnimatedG>
  );
}

export interface TRBalanceScaleProps {
  forCount: number;
  againstCount: number;
  beamProps: AnimatedProps;
  forPanProps: AnimatedProps;
  againstPanProps: AnimatedProps;
}

export function TRBalanceScale({ forCount, againstCount, beamProps, forPanProps, againstPanProps }: TRBalanceScaleProps): React.JSX.Element {
  return (
    <Svg
      width={245}
      height={136}
      viewBox="0 0 320 178"
      accessibilityLabel={`Balance: ${forCount} ${forCount === 1 ? 'fact backs' : 'facts back'} the thought up, ${againstCount} ${againstCount === 1 ? 'fact goes' : 'facts go'} against it`}
    >
      <Rect x={0} y={0} width={320} height={178} fill={C.wash} />
      <Ellipse cx={160} cy={168} rx={72} ry={5} fill={C.ink} opacity={0.07} />
      <Rect x={153} y={50} width={14} height={104} rx={5} fill={C.wood2} />
      <Rect x={156} y={50} width={4} height={98} rx={2} fill={C.wood} />
      <Rect x={118} y={152} width={84} height={14} rx={7} fill={C.wood2} />
      <Rect x={118} y={148} width={84} height={13} rx={6.5} fill={C.wood} />
      <AnimatedG animatedProps={beamProps}>
        <Rect x={52} y={45} width={216} height={11} rx={5.5} fill={C.wood2} />
        <Rect x={52} y={42} width={216} height={11} rx={5.5} fill={C.wood} />
      </AnimatedG>
      <Pan animatedProps={forPanProps} count={forCount} kind="for" />
      <Pan animatedProps={againstPanProps} count={againstCount} kind="against" />
      <Circle cx={160} cy={52} r={9} fill={C.sun2} />
      <Circle cx={160} cy={49} r={9} fill={C.sun} />
    </Svg>
  );
}

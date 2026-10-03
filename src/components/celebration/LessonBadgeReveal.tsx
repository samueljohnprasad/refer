// ponytail: minimal vector badge reveal with reanimated interpolation
import React from 'react';
import { View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  SharedValue,
  interpolate,
  Extrapolation,
  useReducedMotion,
} from 'react-native-reanimated';
import Svg, { Defs, LinearGradient, Stop, Polygon, Ellipse, Rect, Path } from 'react-native-svg';
import { SAGE, YELLOW, NEUTRAL } from '../../theme/palette';

export interface LessonBadgeRevealProps {
  progress: SharedValue<number>;
}

interface SparkleItem {
  left: `${number}%`;
  top: `${number}%`;
  size: number;
}

const SPARKLES: readonly SparkleItem[] = [
  { left: '26%', top: '18%', size: 12 },
  { left: '72%', top: '24%', size: 16 },
  { left: '80%', top: '52%', size: 10 },
  { left: '15%', top: '54%', size: 14 },
  { left: '66%', top: '74%', size: 9 },
] as const;

// 4-point sparkle burst, drawn once and reused per instance
function SparkleShape({ size, color }: { size: number; color: string }): React.JSX.Element {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16">
      <Path
        d="M8,0 L9.8,6.2 L16,8 L9.8,9.8 L8,16 L6.2,9.8 L0,8 L6.2,6.2 Z"
        fill={color}
      />
    </Svg>
  );
}

interface SparkleProps extends SparkleItem {
  progress: SharedValue<number>;
  index: number;
  reducedMotion: boolean;
}

function Sparkle({
  progress,
  index,
  reducedMotion,
  left,
  top,
  size,
}: SparkleProps): React.JSX.Element {
  const start: number = 0.5 + index * 0.08;

  const style = useAnimatedStyle(() => {
    if (reducedMotion) {
      return { opacity: interpolate(progress.value, [start, 1], [0, 1], Extrapolation.CLAMP) };
    }
    const opacity: number = interpolate(progress.value, [start, start + 0.1, 1], [0, 1, 1], Extrapolation.CLAMP);
    const scale: number = interpolate(
      progress.value,
      [start, start + 0.15, start + 0.3, 1],
      [0, 1.4, 0.9, 1],
      Extrapolation.CLAMP
    );
    return { opacity, transform: [{ scale }] };
  });

  return (
    <Animated.View style={[{ position: 'absolute', left, top }, style]}>
      <SparkleShape size={size} color={index % 2 === 0 ? YELLOW.primary : SAGE[400]} />
    </Animated.View>
  );
}

export function LessonBadgeReveal({ progress }: LessonBadgeRevealProps): React.JSX.Element {
  const reducedMotion: boolean = Boolean(useReducedMotion());

  const pedestalStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 0.25], [0, 1], Extrapolation.CLAMP),
  }));

  const badgeStyle = useAnimatedStyle(() => {
    if (reducedMotion) {
      return {
        opacity: interpolate(progress.value, [0, 1], [0, 1], Extrapolation.CLAMP),
        transform: [{ scale: interpolate(progress.value, [0, 1], [0.95, 1], Extrapolation.CLAMP) }],
      };
    }
    const translateY: number = interpolate(progress.value, [0, 0.4, 0.7, 1], [50, -10, 4, 0], Extrapolation.CLAMP);
    const opacity: number = interpolate(progress.value, [0, 0.15, 1], [0, 1, 1], Extrapolation.CLAMP);
    const scale: number = interpolate(progress.value, [0, 0.4, 0.6, 0.8, 1], [0.4, 1.15, 0.92, 1.03, 1], Extrapolation.CLAMP);
    const rotate: number = interpolate(progress.value, [0, 0.4, 0.6, 0.8, 1], [-6, 5, -2, 1, 0], Extrapolation.CLAMP);
    return { opacity, transform: [{ translateY }, { scale }, { rotate: `${rotate}deg` }] };
  });

  return (
    <View className="items-center justify-center absolute w-full h-full">
      {/* Beam + pedestal */}
      <Animated.View style={[{ position: 'absolute', width: '100%', height: '100%' }, pedestalStyle]}>
        <Svg width="100%" height="100%" viewBox="0 0 200 200">
          <Defs>
            <LinearGradient id="beam" x1="0" y1="1" x2="0" y2="0">
              <Stop offset="0" stopColor={SAGE[200]} stopOpacity={0.5} />
              <Stop offset="1" stopColor={SAGE[200]} stopOpacity={0} />
            </LinearGradient>
          </Defs>

          <Polygon points="70,140 130,140 155,20 45,20" fill="url(#beam)" />

          {/* pedestal: rim + body + base, cylinder trick */}
          <Ellipse cx={100} cy={165} rx={58} ry={13} fill={SAGE[800]} opacity={0.18} />
          <Rect x={42} y={140} width={116} height={25} fill={SAGE[600]} />
          <Ellipse cx={100} cy={140} rx={40} ry={9} fill="none" stroke={SAGE[200]} strokeWidth={1.5} opacity={0.6} />
          <Ellipse cx={100} cy={140} rx={58} ry={14} fill={SAGE[400]} stroke={YELLOW.primary} strokeWidth={2} />
        </Svg>
      </Animated.View>

      {SPARKLES.map((s: SparkleItem, i: number) => (
        <Sparkle key={i} progress={progress} index={i} reducedMotion={reducedMotion} {...s} />
      ))}

      {/* Gem badge */}
      <Animated.View style={[{ position: 'absolute', left: '34%', top: '26.5%', width: '32%', height: '32%' }, badgeStyle]}>
        <Svg width="100%" height="100%" viewBox="0 0 64 64">
          <Defs>
            <LinearGradient id="gemFill" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0" stopColor={SAGE[300]} />
              <Stop offset="1" stopColor={SAGE[600]} />
            </LinearGradient>
          </Defs>
          <Rect
            x={8}
            y={8}
            width={48}
            height={48}
            rx={12}
            fill="url(#gemFill)"
            stroke={YELLOW.primary}
            strokeWidth={2.5}
            transform="rotate(45 32 32)"
          />
          <Polygon points="14,10 24,10 10,24 10,14" fill={NEUTRAL.white} opacity={0.25} transform="rotate(45 32 32)" />
          {/* sage-leaf glyph */}
          <Path
            d="M32,18 C42,24 42,42 32,48 C22,42 22,24 32,18 Z"
            fill={NEUTRAL.white}
          />
          <Path d="M32,21 L32,45" stroke={YELLOW.primary} strokeWidth={1.5} opacity={0.8} />
        </Svg>
      </Animated.View>
    </View>
  );
}

export default LessonBadgeReveal;

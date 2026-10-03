// ponytail: reactive welcome hero canvas with progressive segment fill matching remotion
import React from "react";
import { View, Text, useWindowDimensions } from "react-native";
import Animated, {
  SharedValue,
  useSharedValue,
  useFrameCallback,
  useAnimatedStyle,
  useAnimatedProps,
  interpolate,
  Extrapolation,
  FrameInfo,
} from "react-native-reanimated";
import Svg, {
  Defs,
  LinearGradient,
  RadialGradient,
  Stop,
  Rect,
  Circle,
  ClipPath,
  G,
  Path,
} from "react-native-svg";
import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  BACKGROUND,
  COPY,
  NODES,
  TODAY_INDEX,
  PATH_D,
  TRAIL_TOP,
  TRAIL_BOTTOM,
  PROGRESS_SEGMENTS,
  ProgressSegmentDef,
  DURATION_FRAMES,
  T,
} from "./constants";
import { WelcomeNode } from "./WelcomeNode";
import {
  WelcomeLabel,
  TodayCallout,
  ProgressSegment,
  XpFloat,
} from "./WelcomeDecorations";
import { PandaMascot } from "./PandaMascot";
import { APP_FONT_FAMILIES } from "@/src/theme/typography";

const AnimatedRect = Animated.createAnimatedComponent(Rect);

function HeadlineLine({
  line,
  index,
  frame,
  scale,
}: {
  line: string;
  index: number;
  frame: SharedValue<number>;
  scale: number;
}): React.JSX.Element {
  const animatedStyle = useAnimatedStyle(() => {
    const f: number = frame.value;
    const opacity: number = interpolate(f, [T.headline + index * 6, T.headline + index * 6 + 18], [0, 1], Extrapolation.CLAMP);
    const translateY: number = (1 - opacity) * (26 * scale);
    return { opacity, transform: [{ translateY }] };
  });

  return (
    <Animated.View style={animatedStyle}>
      <Text
        style={{
          fontFamily: APP_FONT_FAMILIES.extraBold,
          fontSize: 92 * scale,
          lineHeight: 98 * scale,
          letterSpacing: -0.02 * 92 * scale,
          color: "#1E2A33",
        }}
      >
        {line}
      </Text>
    </Animated.View>
  );
}

function Subhead({
  text,
  frame,
  scale,
}: {
  text: string;
  frame: SharedValue<number>;
  scale: number;
}): React.JSX.Element {
  const animatedStyle = useAnimatedStyle(() => {
    const opacity: number = interpolate(frame.value, [T.headline + 16, T.headline + 34], [0, 1], Extrapolation.CLAMP);
    const translateY: number = (1 - opacity) * (16 * scale);
    return { opacity, transform: [{ translateY }] };
  });

  return (
    <Animated.View style={[{ marginTop: 18 * scale }, animatedStyle]}>
      <Text
        style={{
          fontFamily: APP_FONT_FAMILIES.caveatSemiBold,
          fontSize: 48 * scale,
          lineHeight: 52 * scale,
          color: "#6C7A85",
        }}
      >
        {text}
      </Text>
    </Animated.View>
  );
}

export function WelcomeHeroCanvas(): React.JSX.Element {
  const { width: screenWidth } = useWindowDimensions();
  const scale: number = screenWidth / CANVAS_WIDTH;
  const canvasHeight: number = CANVAS_HEIGHT * scale;
  // rawFrame advances continuously; frame is the looped value seen by children
  const rawFrame = useSharedValue<number>(0);
  const frame = useSharedValue<number>(0);

  // 30 FPS clock — loops DURATION_FRAMES up to 5×, then freezes at DURATION_FRAMES
  useFrameCallback((info: FrameInfo) => {
    if (info.timeSincePreviousFrame) {
      const maxRaw: number = DURATION_FRAMES * 5; // ponytail: 5 plays
      rawFrame.value = Math.min(rawFrame.value + (info.timeSincePreviousFrame / 1000) * 30, maxRaw);
      frame.value = rawFrame.value < maxRaw ? rawFrame.value % DURATION_FRAMES : DURATION_FRAMES;
    }
  });

  const driftStyle = useAnimatedStyle(() => {
    const drift: number = Math.sin(frame.value / 90) * (8 * scale);
    return { transform: [{ translateY: drift }] };
  });

  const trailClipProps = useAnimatedProps(() => {
    const pathReveal: number = interpolate(frame.value, [T.pathStart, T.pathEnd], [TRAIL_TOP, TRAIL_BOTTOM], Extrapolation.CLAMP);
    return { height: pathReveal };
  });

  return (
    <View style={{ width: screenWidth, height: canvasHeight, overflow: "hidden" }}>
      {/* Background SVG canvas */}
      <Svg
        width={screenWidth}
        height={canvasHeight}
        viewBox={`0 0 ${CANVAS_WIDTH} ${CANVAS_HEIGHT}`}
        style={{ position: "absolute", top: 0, left: 0 }}
      >
        <Defs>
          <LinearGradient id="bgGrad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={BACKGROUND.top} />
            <Stop offset="0.46" stopColor={BACKGROUND.mid} />
            <Stop offset="0.82" stopColor={BACKGROUND.bottom} />
          </LinearGradient>

          <RadialGradient id="ambientPurple" cx="50%" cy="50%" r="50%">
            <Stop offset="0" stopColor="#8C7FD6" stopOpacity={0.2} />
            <Stop offset="0.68" stopColor="#8C7FD6" stopOpacity={0} />
          </RadialGradient>

          <RadialGradient id="ambientTeal" cx="50%" cy="50%" r="50%">
            <Stop offset="0" stopColor="#3FC7A6" stopOpacity={0.2} />
            <Stop offset="0.68" stopColor="#3FC7A6" stopOpacity={0} />
          </RadialGradient>

          <ClipPath id="trail-clip">
            <AnimatedRect x={0} y={0} width={CANVAS_WIDTH} animatedProps={trailClipProps} />
          </ClipPath>
        </Defs>

        {/* Gradient sky */}
        <Rect x={0} y={0} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} fill="url(#bgGrad)" />

        {/* Ambient drifting botanical blurred orbs */}
        <Circle cx={-140} cy={CANVAS_HEIGHT - 420} r={280} fill="url(#ambientPurple)" />
        <Circle cx={CANVAS_WIDTH - 120} cy={CANVAS_HEIGHT - 340} r={260} fill="url(#ambientTeal)" />

        {/* Trail path with animated reveal */}
        <G clipPath="url(#trail-clip)">
          <Path
            d={PATH_D}
            fill="none"
            stroke="#A9D4EF"
            strokeWidth={7}
            strokeLinecap="round"
            strokeDasharray="1 20"
          />

          {/* Solid gold segment fills that advance sequentially on node completion */}
          {PROGRESS_SEGMENTS.map((segment: ProgressSegmentDef, i: number) => (
            <ProgressSegment key={i} segment={segment} frame={frame} />
          ))}
        </G>
      </Svg>

      {/* Headline & subhead */}
      <View style={{ position: "absolute", top: 176 * scale, left: 72 * scale, right: 72 * scale }}>
        {COPY.headline.map((line: string, i: number) => (
          <HeadlineLine key={line} line={line} index={i} frame={frame} scale={scale} />
        ))}
        <Subhead text={COPY.subhead} frame={frame} scale={scale} />
      </View>

      {/* Drifting layer for nodes, labels, and panda */}
      <Animated.View style={[{ width: "100%", height: "100%" }, driftStyle]}>
        {NODES.map((_, i: number) => (
          <WelcomeNode key={i} index={i} frame={frame} scale={scale} />
        ))}

        {NODES.map((_, i: number) => (
          <WelcomeLabel key={i} index={i} frame={frame} scale={scale} />
        ))}

        <TodayCallout frame={frame} scale={scale} />

        {NODES.slice(0, TODAY_INDEX).map((_, i: number) => (
          <XpFloat key={i} frame={frame} index={i} scale={scale} />
        ))}

        <PandaMascot frame={frame} scale={scale} />
      </Animated.View>
    </View>
  );
}

export default React.memo(WelcomeHeroCanvas);
